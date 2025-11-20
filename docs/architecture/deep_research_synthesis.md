# Deep Research Synthesis & Architectural Recommendations for 16BitFit-V3

**Date:** November 19, 2025  
**Status:** Stories 1.1-1.4 COMPLETE ✅ | Moving to Story 1.5  
**Purpose:** Architect role analysis of deep research to inform remaining development

---

## Executive Summary

After analyzing 12 deep research documents covering critical technical domains, I've identified a clear architectural path forward for 16BitFit-V3. The research validates our core technology choices while revealing specific implementation patterns that will ensure high performance and scalability.

**Key Findings:**
- ✅ **Supabase architecture is sound** - but we must use specific patterns (Broadcast+Triggers) to avoid scalability traps
- ✅ **WebView hybrid approach is viable** - but requires careful RN-WebView bridge implementation 
- ✅ **Avatar generation is feasible** - but needs strategic choice between DALL-E 3 simplicity vs. Stable Diffusion control
- ⚠️ **Critical gaps identified** - authentication strategy, fitness data algorithms, and rendering patterns need immediate definition

---

## Domain-Specific Synthesis

### 1. AI Avatar Generation (Story 1.5) 🎯

**Current Story Plan vs. Research Reality:**

| Story 1.5 Spec | Research Recommendation | Gap Analysis |
|---|---|---|
| Uses DALL-E 3 with text prompts | ✅ Valid for MVP | ⚠️ Face likeness will be limited |
| Inpainting approach | ⚠️ DALL-E can't take reference images | **CRITICAL: Need alternative** |
| $0.04/image cost | ✅ Confirmed | Scalable for MVP budget |

**Recommended Path Forward:**

**Option A: DALL-E 3 (Recommended for MVP)**
- **Pros:** Simple, one API call, low setup cost
- **Cons:** Cannot reference user's actual face photo; relies on text descriptions
- **Implementation:** Use detailed text descriptions of facial features + archetype prompt
- **Cost:** $0.04/image = $100/month supports 2,500 avatars

**Option B: Stable Diffusion + IP-Adapter (Future Enhancement)**
- **Pros:** True face integration, more control, no per-image cost
- **Cons:** Complex setup, requires GPU hosting, higher initial cost
- **Implementation:** Use face-to-many pipeline with ControlNet + InstantID + pixel art LoRA
- **Cost:** Fixed GPU server costs (~$50-200/month) regardless of volume

**CRITICAL DECISION NEEDED:** Story 1.5 assumes DALL-E can use the user's photo as a reference (inpainting). **This is not possible with the API.** We must choose:

1. **Pivot to text-only DALL-E** (describe facial features from photo)  
2. **Adopt Stable Diffusion** with IP-Adapter (more complex, better results)
3. **Use hybrid approach** (DALL-E for MVP, SD for v2)

**My Recommendation:** Option #3 - Start with DALL-E text descriptions for MVP (faster to market), plan SD migration for v1.1 when we have user feedback and can justify GPU infrastructure.

---

### 2. Fitness Data Conversion & Game Balance 🏃‍♂️

**Research Validates Core Mechanics:**
- Daily step caps prevent exploits ✅
- Diminishing returns after 7k-10k steps ✅  
- Workout duration-based points ✅

**Specific Algorithms from Research:**

```typescript
// Evolution Points Calculation
const calculateEPP = (steps: number): number => {
  const DAILY_CAP = 10000;
  const RATE = 1; // 1 EP per 100 steps
  const cappedSteps = Math.min(steps, DAILY_CAP);
  return Math.floor(cappedSteps / 100) * RATE;
};

// Diminishing Returns Model (Alternative)
const calculateEPPWithDiminish = (steps: number): number => {
  const THRESHOLD = 5000;
  const FULL_RATE = 1.0;
  const DIMINISH_RATE = 0.5;
  
  if (steps <= THRESHOLD) {
    return Math.floor(steps / 100) * FULL_RATE;
  }
  
  const base = Math.floor(THRESHOLD / 100) * FULL_RATE;
  const excess = steps - THRESHOLD;
  const diminished = Math.floor(excess / 100) * DIMINISH_RATE;
  return base + diminished;
};

// Workout Points
const calculateWorkoutEP = (type: 'cardio' | 'strength' | 'flexibility', minutes: number): number => {
  const RATES = {
    cardio: 1.0,      // 1 EP/min
    strength: 1.0,    // 1 EP/min
    flexibility: 0.5  // 0.5 EP/min
  };
  return Math.floor(minutes * RATES[type]);
};

// Combat Stat Scaling (+10% per stage)
const getStatsForStage = (baseHP: number, baseDMG: number, stage: number): { hp: number; dmg: number } => {
  const multiplier = 1 + (stage - 1) * 0.10;
  return {
    hp: Math.floor(baseHP * multiplier),
    dmg: Math.floor(baseDMG * multiplier)
  };
};
```

**Tunable Parameters (Store as config):**
```typescript
// apps/mobile-shell/src/config/gameBalance.ts
export const GAME_BALANCE = {
  steps: {
    dailyCap: 10000,
    epPerHundredSteps: 1,
    diminishThreshold: 7000,
    diminishRate: 0.5,
  },
  workouts: {
    cardioEPPerMin: 1.0,
    strengthEPPerMin: 1.0,
    flexibilityEPPerMin: 0.5,
    maxDailyWorkoutEP: 100,
  },
  evolution: {
    statBoostPerStage: 0.10, // 10%
  },
  energy: {
    maxEnergy: 100,
    energyPerHundredSteps: 1,
  },
} as const;
```

**REQUIRED ACTIONS:**
1. Create `apps/mobile-shell/src/services/fitnessCalculator.ts` with these algorithms
2. Create database function `calculate_and_apply_epp()` for server-side execution
3. Store balance constants in config (not hardcoded) for tuning

---

### 3. RN-WebView Bridge Architecture 🌉

**Critical Research Finding:** Standard `postMessage` has **severe performance limitations** for real-time games.

**Performance Comparison:**

| Method | Latency | Throughput | Complexity | Recommended |
|---|---|---|---|---|
| postMessage (standard) | High, unreliable | Low | Simple | ❌ NO |
| TurboModule intermediary | Very low | Very high | High | ✅ **YES** (Story 1.7) |
| Local WebSocket | Low | High | Medium | ✅ Alternative |
| JSI direct injection | Lowest | Highest | Very High | 🔮 v2.0 |

**Recommended Architecture for Story 1.7:**

```
┌─────────────────┐
│ WebView (Phaser)│
│  - Game Logic   │
│  - Combat       │
└────────┬────────┘
         │
         │ 1. Native Bridge Call
         ▼
┌─────────────────┐
│ TurboModule     │
│ (Native Layer)  │
└────────┬────────┘
         │
         │ 2. JSI (Synchronous)
         ▼
┌─────────────────┐
│ React Native    │
│  - State Mgmt   │
│  - Supabase     │
└─────────────────┘
```

**Data Flow Patterns:**

**Pattern 1: Game → RN (Player Actions)**
```typescript
// In Phaser WebView
(window as any).NativeBridge.sendGameEvent({
  type: 'BATTLE_COMPLETE',
  payload: { 
    enemyId: 'training-dummy',
    damage: 45,
    energyUsed: 20 
  }
});

// In TurboModule (apps/mobile-shell/ios/NativeBridge.swift)
@objc func sendGameEvent(_ data: NSDictionary) {
  // Parse, validate, pass to RN via JSI
}

// In RN (apps/mobile-shell/src/services/gameService.ts)
import { NativeBridge } from './modules/NativeBridge';

NativeBridge.addListener('BATTLE_COMPLETE', async (data) => {
  await supabase.from('battle_results').insert({
    user_id: user.id,
    ...data
  });
});
```

**Pattern 2: RN → Game (State Updates)**
```typescript
// In RN
import { NativeBridge } from './modules/NativeBridge';

const updateGameState = (stats: AvatarStats) => {
  NativeBridge.sendToWebView({
    type: 'STATS_UPDATE',
    payload: stats
  });
};

// In Phaser WebView
(window as any).addEventListener('message', (event) => {
  if (event.data.type === 'STATS_UPDATE') {
    gameState.updatePlayerStats(event.data.payload);
  }
});
```

**CRITICAL REQUIREMENT:** Do NOT implement standard postMessage for combat loop. It will fail at scale.

**Binary Data Handling (Protobuf):**
```typescript
// Instead of JSON:
const payload = JSON.stringify(gameState); // ❌ Slow

// Use Protobuf:
import { GameState } from './proto/game_pb';
const payload = GameState.encode(gameState).finish(); // ✅ Fast + Small
```

**REQUIRED ACTIONS for Story 1.7:**
1. Create TurboModule spec: `apps/mobile-shell/specs/NativeBridgeSpec.ts`
2. Implement native modules for iOS/Android
3. Generate Protobuf schemas for game state messages
4. Remove `postMessage` references from current spec

---

### 4. Supabase Backend Architecture 🗄️

**CRITICAL SCALABILITY ISSUE DISCOVERED:**

The research reveals that **Postgres Changes subscriptions DO NOT SCALE** for our use case. Current Story 1.2 implementation may hit severe bottlenecks.

**The Problem:**
```
5,000 concurrent users subscribed to avatar_stats table
User A's stats update → Supabase executes 5,000 RLS checks
1 write = 5,000 reads = Database overload
```

**The Solution: Broadcast + Database Triggers**

```sql
-- 1. Create trigger function
CREATE OR REPLACE FUNCTION public.notify_avatar_stats_change()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
BEGIN
  -- Build minimal payload (only changed data)
  payload := jsonb_build_object(
    'user_id', NEW.user_id,
    'health_points', NEW.health_points,
    'energy_meter', NEW.energy_meter,
    'updated_at', NOW()
  );

  -- Broadcast to user-specific private channel
  PERFORM realtime.send(
    'user-state:' || NEW.user_id::text,
    'stats_update',
    payload,
    true -- private channel
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach trigger
CREATE TRIGGER handle_avatar_stats_change
AFTER INSERT OR UPDATE ON public.avatar_stats
FOR EACH ROW EXECUTE FUNCTION public.notify_avatar_stats_change();

-- 3. RLS Policy for private channels
CREATE POLICY "Users can receive their own state broadcasts"
ON realtime.messages FOR SELECT
TO authenticated
USING (
  realtime.topic() = 'user-state:' || (SELECT auth.uid())::text
);
```

**Client-Side (React Native):**
```typescript
// Instead of:
supabase
  .channel('avatar_stats')
  .on('postgres_changes', ...) // ❌ Does not scale

// Do this:
const userId = supabase.auth.getUser().id;
supabase
  .channel(`private:user-state:${userId}`)
  .on('broadcast', { event: 'stats_update' }, (payload) => {
    // Update local state
    legendState.avatarStats.set(payload);
  })
  .subscribe();
```

**Performance Benchmarks from Research:**
- 10,000 messages/second with 80,000 concurrent users
- Median latency: 46ms
- p95 latency: 132ms

**REQUIRED ACTIONS:**
1. **Audit Story 1.2 implementation** - Check if we're using Postgres Changes
2. **Migrate to Broadcast pattern** for real-time updates
3. **Create trigger functions** for avatar_stats, energy_meter, battle_results
4. **Update client subscriptions** to use private channels

---

### 5. Authentication & Session Management 🔐

**Research reveals hybrid RN+WebView auth is complex.** Current stories don't address this.

**Recommended Architecture:**

```
┌──────────────────┐
│ Anonymous Sign-in│  (On first app launch)
│ auth.signInAnonymously()
└────────┬─────────┘
         │
         │ User ID: abc-123
         │ is_anonymous: true
         ▼
┌──────────────────┐
│ Gameplay Session │
│ Progress saved to│
│ user_id: abc-123 │
└────────┬─────────┘
         │
         │ User decides to create account
         ▼
┌──────────────────┐
│ Upgrade Account  │
│ auth.updateUser({│
│   email, password│
│ })               │
└────────┬─────────┘
         │
         │ SAME user ID: abc-123
         │ is_anonymous: false
         ▼
┌──────────────────┐
│ Full Account     │
│ All progress     │
│ preserved ✅     │
└──────────────────┘
```

**Session Sharing RN ↔ WebView:**

**DO NOT pass refresh tokens to WebView.** Only short-lived access tokens.

```typescript
// RN owns the session
const session = await supabase.auth.getSession();

// Pass ONLY access token to WebView
webViewRef.current?.postMessage({
  type: 'ACCESS_TOKEN',
  payload: {
    token: session.access_token,
    expiresAt: session.expires_at
  }
});

// WebView uses token for API calls, NOT auth
fetch('https://xyz.supabase.co/functions/v1/save-battle', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Row Level Security with is_anonymous:**
```sql
-- Example: Anonymous users can only create trial data
CREATE POLICY "anon_can_insert_trial"
ON public.trial_progress
FOR INSERT TO authenticated
USING (true)
WITH CHECK (
  auth.uid() = user_id 
  AND coalesce((auth.jwt()->>'is_anonymous')::boolean, false) = true
);

-- Full users can access full features
CREATE POLICY "full_users_can_manage_profile"
ON public.profiles
FOR ALL TO authenticated
USING (
  auth.uid() = user_id
  AND coalesce((auth.jwt()->>'is_anonymous')::boolean, false) = false
);
```

**MISSING FROM CURRENT STORIES:**
- No anonymous auth pattern defined
- No RN-WebView session sharing strategy
- No RLS policies for anonymous vs. full users

**REQUIRED ACTIONS:**
1. Update Story 1.2 to include anonymous auth
2. Create session management service
3. Define RLS policies for trial vs. full features
4. Document WebView auth pattern in Story 1.7

---

### 6. Performant Retro Rendering 🎨

**Research consensus: react-native-skia + Reanimated 4 is the optimal stack.**

**Current Approach vs. Research:**

| Current Plan | Research Recommendation | Action |
|---|---|---|
| NativeWind for styling | ✅ Keep for chrome | No change |
| Unknown retro rendering | ✅ Use Skia for DMG screen | Add to stories |
| Unknown animation | ✅ Reanimated 4 with worklets | Add to stories |

**Pixel-Perfect DMG Screen Implementation:**

```typescript
// Strict 4-color palette shader
const dmgPaletteShader = Skia.RuntimeEffect.Make(`
  uniform shader content;
  uniform float3 palette[4];
  
  float luma(vec3 c) { 
    return dot(c, vec3(0.299, 0.587, 0.114)); 
  }
  
  half4 main(vec2 pos) {
    vec4 col = content.eval(pos);
    float y = luma(col.rgb);
    
    // Map to nearest DMG color
    float3 c = (y < 0.25) ? palette[0] :
               (y < 0.50) ? palette[1] :
               (y < 0.75) ? palette[2] : palette[3];
    
    return half4(c, col.a);
  }
`)!;

// 160x144 virtual screen
const DMG_WIDTH = 160;
const DMG_HEIGHT = 144;

export function DMGScreen({ children }) {
  const { width, height } = useWindowDimensions();
  const scale = Math.floor(Math.min(
    width / DMG_WIDTH,
    height / DMG_HEIGHT
  )); // Integer scale only

  return (
    <Canvas style={{ width, height }}>
      <Group transform={[
        { translateX: (width - DMG_WIDTH * scale) / 2 },
        { translateY: (height - DMG_HEIGHT * scale) / 2 },
        { scale }
      ]}>
        <Fill>
          <Shader source={dmgPaletteShader} uniforms={{
            palette: [
              hexToFloat('#0F380F'),
              hexToFloat('#306230'),
              hexToFloat('#8BAC0F'),
              hexToFloat('#9BBC0F')
            ]
          }}>
            {children}
          </Shader>
        </Fill>
      </Group>
    </Canvas>
  );
}
```

**Sprite Animation (60fps on UI thread):**

```typescript
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

// Stepped animation (no interpolation)
export function useSteppedAnimation(targetValue: number, steps: number) {
  const progress = useSharedValue(0);
  
  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 400,
      easing: Easing.steps(steps)
    });
  }, [targetValue]);
  
  return useAnimatedStyle(() => ({
    transform: [{
      translateX: Math.round(progress.value * targetValue)
    }]
  }));
}
```

**REQUIRED ACTIONS:**
1. Add Skia DMG screen component to design system
2. Create retro animation utilities with Reanimated
3. Enforce strict palette in all screen rendering
4. Update Story 1.9 (Combat UI) to specify Skia

---

## Story-by-Story Impact Analysis

### ✅ Stories 1.1-1.4: COMPLETE
**Review Required:** Yes, for auth and Supabase patterns

| Story | Concern | Action |
|---|---|---|
| 1.2 Supabase Auth | Missing anonymous auth | Add anonymous sign-in flow |
| 1.2 Supabase Realtime | May be using Postgres Changes | Audit & migrate to Broadcast |
| 1.3 HealthKit | No fitness calculation algorithms | Add EPP calculation service |
| 1.4 Onboarding | Works but no auth upgrade path | Document transition to full account |

### 🎯 Story 1.5: Avatar Generation (CURRENT)
**Status:** BLOCKED on architectural decision

**Critical Issues:**
1. ❌ DALL-E inpainting approach won't work (API limitation)
2. ❌ No face reference capability in current plan
3. ✅ Cost model is valid

**Recommendation:** Update story to use DALL-E text-based approach OR adopt Stable Diffusion with IP-Adapter.

**My vote:** Text-based DALL-E for MVP (ship faster), plan SD upgrade for v1.1.

### 📋 Story 1.6: Home Screen
**New Requirements from Research:**
- Use Skia canvas for DMG screen area
- Implement strict 4-color shader
- Use Reanimated for sprite animations

### ⚠️ Story 1.7: WebView Bridge (CRITICAL)
**Status:** Current spec needs major revision

**Required Changes:**
1. Remove postMessage implementation
2. Add TurboModule specification
3. Add Protobuf schema definitions
4. Add auth token passing mechanism
5. Add performance benchmarks

### 📋 Story 1.8: Combat Mechanics
**New Requirements:**
- Server-authoritative design (Edge Functions)
- Protobuf for game state messages
- Database functions for stat calculations

### 📋 Story 1.9: Combat UI
**New Requirements:**
- Skia-based rendering for all combat visuals
- Pixel dissolve shader for transitions
- Reanimated for sprite motion

### 📋 Story 1.10: FTUE Tutorial
**New Requirements:**
- Anonymous auth during tutorial
- Upgrade to full account after completion
- RLS policies for trial features

### 📋 Story 1.11: Performance Optimization
**Validated by Research:**
- Skia + Reanimated = correct choices
- TurboModules for bridge = required
- Broadcast pattern = necessary for scale

---

## Recommended Action Plan

### Phase 1: Immediate (Before Story 1.5)

1. **Make Avatar Generation Decision** 🚨
   - [ ] Choose between DALL-E text vs. Stable Diffusion
   - [ ] Update Story 1.5 spec accordingly
   - [ ] Set up chosen service (Edge Function)

2. **Audit Existing Stories**
   - [ ] Check Story 1.2 for Postgres Changes usage
   - [ ] Verify RLS policies exist
   - [ ] Confirm auth uses proper patterns

3. **Define Missing Systems**
   - [ ] Create `fitnessCalculator.ts` service
   - [ ] Create `gameBalance.ts` config
   - [ ] Document anonymous auth flow

### Phase 2: Story Updates (This Week)

1. **Update Story 1.5** (Avatar Generation)
   - Update approach based on decision
   - Add preprocessing requirements
   - Define fallback strategies

2. **Update Story 1.7** (WebView Bridge)
   - Replace postMessage with TurboModule
   - Add Protobuf schemas
   - Add auth token handling

3. **Update Story 1.9** (Combat UI)
   - Add Skia rendering requirements
   - Add shader specifications
   - Add Reanimated patterns

### Phase 3: New Components (Next Sprint)

1. **Create Architecture Documentation**
   - [ ] RN-WebView bridge architecture diagram
   - [ ] Supabase realtime data flow
   - [ ] Authentication state machine

2. **Create Shared Services**
   - [ ] Fitness calculation service
   - [ ] Game balance configuration
   - [ ] TurboModule bridge

3. **Create Development Tools**
   - [ ] Protobuf schema compiler
   - [ ] Performance profiling setup
   - [ ] Bridge communication debugger

---

## Technical Debt & Risks

### 🔴 Critical Risks

**Risk 1: WebView Bridge Performance**
- **Impact:** Game will be unplayable if using postMessage
- **Mitigation:** Implement TurboModule before Story 1.8
- **Timeline:** 1 week implementation time

**Risk 2: Avatar Generation Approach**
- **Impact:** User satisfaction depends on face likeness
- **Mitigation:** Choose SD over DALL-E if budget allows
- **Timeline:** Decision needed THIS WEEK

**Risk 3: Supabase Scalability**
- **Impact:** Database overload at 1000+ users if using Postgres Changes
- **Mitigation:** Migrate to Broadcast pattern NOW
- **Timeline:** 2 days audit + 3 days migration

### 🟡 Medium Risks

**Risk 4: Anonymous Auth Complexity**
- **Impact:** Lost progress if upgrade flow breaks
- **Mitigation:** Extensive testing of upgrade flow
- **Timeline:** Add to Story 1.4 retrospective

**Risk 5: Fitness Algorithm Balance**
- **Impact:** Unfair gameplay or exploitation
- **Mitigation:** Make algorithms tunable via config
- **Timeline:** Build tunability into Story 1.3

### 🟢 Low Risks

**Risk 6: Rendering Performance**
- **Impact:** Low FPS on older devices
- **Mitigation:** Skia + Reanimated already optimal
- **Timeline:** Monitor in Story 1.11

---

## Cost & Resource Implications

### Infrastructure Costs (Monthly)

**Currently Planned:**
- Supabase Pro: $25/month
- DALL-E 3: $100/month (2,500 avatars)
- **Total: $125/month**

**If Adopting Full Recommendations:**
- Supabase Pro: $25/month
- Stable Diffusion GPU: $150/month (dedicated)
- **OR** Replicate SD: $0.008/image (cheaper at scale)
- **Total: $175/month** OR **$25 + variable**

**Recommendation:** Start with DALL-E ($125/mo), switch to Replicate SD when volume justifies it (>12,500 avatars/month).

### Development Time Impact

| Task | Estimated Time | Story Impact |
|---|---|---|
| TurboModule implementation | 5 days | Story 1.7 +3 days |
| Broadcast migration | 3 days | Story 1.2 retrofit |
| Skia rendering setup | 2 days | Story 1.9 +1 day |
| Protobuf integration | 2 days | Story 1.8 +1 day |
| Anonymous auth | 2 days | Story 1.2 retrofit |
| **TOTAL** | **14 days** | **~3 week delay** |

**Recommendation:** Accept the delay. These patterns are essential for scale.

---

## Questions for User

Before proceeding to Story 1.5, I need your input on these critical decisions:

1. **Avatar Generation Approach**
   - Option A: Text-based DALL-E (faster, cheaper, lower quality)
   - Option B: Stable Diffusion + IP-Adapter (slower, more complex, better quality)
   - Option C: Hybrid (DALL-E MVP, plan SD for v1.1)
   
   **Your preference?**

2. **WebView Bridge Architecture**
   - Research strongly recommends abandoning postMessage for TurboModule
   - This adds ~5 days to Story 1.7 but is essential for real-time combat
   
   **Proceed with this change?**

3. **Previous Stories Review**
   - Research identified potential issues in Stories 1.2 and 1.3
   - Should we audit/fix now or defer to post-MVP?
   
   **Review priority?**

4. **Budget for Stable Diffusion**
   - If we choose SD for avatars, need ~$150/month for GPU server
   - OR use Replicate (pay per image, cheaper at low volume)
   
   **Budget approval?**

---

## Conclusion

The deep research has validated our core technology stack (React Native, Supabase, Phaser) while revealing critical implementation patterns we must adopt for success:

1. ✅ **Use Broadcast pattern for real-time** (not Postgres Changes)
2. ✅ **Use TurboModules for bridge** (not postMessage)  
3. ✅ **Use Skia for retro rendering** (not standard Views)
4. ✅ **Implement anonymous auth** (Story 1.2 gap)
5. ⚠️ **Choose avatar generation approach** (Story 1.5 decision)

The research also provided production-ready code patterns for:
- Fitness calculation algorithms
- Game balance formulas
- Real-time subscription patterns
- WebView communication protocols
- Pixel-perfect rendering shaders

**Recommendation:** Accept a 2-3 week delay to implement these patterns correctly. The alternative is building technical debt that will force a painful rewrite at scale.

**Next Steps:**
1. Review this synthesis
2. Make decisions on the 4 questions above
3. Update Story 1.5 specification
4. Begin Story 1.5 implementation with chosen approach
