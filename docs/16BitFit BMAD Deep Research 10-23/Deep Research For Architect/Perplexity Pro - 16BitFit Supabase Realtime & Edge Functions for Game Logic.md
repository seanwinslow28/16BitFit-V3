<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# **Context:** 16BitFit-V3 uses Supabase as its BaaS, leveraging PostgreSQL, Realtime subscriptions, and potentially Edge Functions. The app involves real-time elements like syncing fitness data impacting game state (avatar evolution stage, combat stats stored in DB) and potentially displaying dynamic resources like the Energy Meter. Some calculations might occur server-side (e.g., final EPP calculations, stat scaling lookup).

**Research Goal:** Determine the most performant, scalable, and secure patterns for using Supabase Realtime and Edge Functions specifically for a mobile game context like 16BitFit-V3.

**Specific Questions:**

1. What are the **best practices for structuring PostgreSQL tables and leveraging Supabase Realtime subscriptions** for efficiently syncing game state updates (e.g., user profile changes like evolution stage, updated stats) to a React Native client? Compare different subscription strategies (e.g., subscribing to entire tables vs. specific rows/channels).
2. How does **Supabase Realtime performance scale** with a large number of concurrent users typical for a mobile game? Are there documented limitations or optimization techniques (e.g., filtering, payload shaping) we should implement from the start?
3. For server-side logic like calculating Evolution Progress Points based on historical data or applying stat scaling based on evolution stage, **when should we use Supabase Edge Functions vs. PostgreSQL Functions/Triggers**? Analyze the trade-offs regarding performance, complexity, security, and cost. Provide examples relevant to game logic.
4. What are the **security best practices for Supabase Edge Functions** when handling potentially sensitive calculations or game logic to prevent cheating or unauthorized access? Consider input validation, authentication within functions, and securing API keys.
5. Are there **specific patterns or libraries** within the Supabase ecosystem recommended for managing real-time game state synchronization or implementing server-side game logic effectively?
6. How does Supabase Realtime compare to alternative real-time backends (like Firebase Realtime Database/Firestore, or self-hosted solutions with WebSockets) specifically for mobile game state synchronization in terms of **latency, scalability, and ease of integration** with React Native?

Now I have gathered comprehensive information about Supabase Realtime, Edge Functions, PostgreSQL Functions, and comparisons with alternative backends. Let me synthesize this into a detailed report addressing all the specific questions.

# Optimizing Supabase for 16BitFit-V3: Real-Time Game State \& Server Logic Best Practices

## 1. Best Practices for PostgreSQL Table Structure \& Realtime Subscriptions

### Table Structuring for Game State

For efficiently syncing game state updates like evolution stage and combat stats, structure your tables with real-time performance in mind:[^1]

**Optimize Primary Keys**: Use single-column primary keys with fixed field sizes (integers, UUIDs) rather than text or multi-column indexes. Small primary keys significantly improve Realtime performance.[^2]

**Enable Replication Selectively**: Only enable replication on tables that require real-time updates. Create publications for specific tables:[^3]

```sql
CREATE PUBLICATION supabase_realtime FOR TABLE user_profiles, combat_stats;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

**Indexing Strategy**: Create indexes on columns used in filters and RLS policies:[^4][^5]

```sql
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_combat_stats_updated_at ON combat_stats(updated_at);
```


### Subscription Strategies Comparison

**Row-Level Filtering (Recommended for Mobile Games)**:[^6][^1]

```javascript
const channel = supabase
  .channel('user-profile')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'user_profiles',
    filter: `user_id=eq.${userId}`
  }, (payload) => handleProfileUpdate(payload))
  .subscribe();
```

**Advantages**: Dramatically reduces payload size, minimizes bandwidth, only receives relevant updates.[^7][^1]

**Broadcast from Database (Best for Scalability)**:[^8][^9]

For high-scale scenarios, use database triggers with Broadcast instead of Postgres Changes:[^8]

```sql
CREATE OR REPLACE FUNCTION broadcast_profile_changes()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    'profile:' || NEW.user_id::text,
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN NULL;
END;
$$;
```

**Key Differences**:[^9][^10][^8]


| Feature | Postgres Changes | Broadcast from Database |
| :-- | :-- | :-- |
| **Scalability** | Moderate (up to 1,000s users) | High (tens of thousands) |
| **Setup Complexity** | Simple | Requires triggers |
| **Latency** | 100-200ms | <100ms |
| **Column Selection** | Full record | Selective fields |
| **Best For** | Development, low-scale | Production, high-scale |

**Multiple Subscriptions in One Channel**:[^11]

You can subscribe to multiple row-level filters, but chain them properly:

```javascript
const channel = supabase.channel('game-updates');

channel
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'user_profiles',
    filter: `user_id=eq.${userId}`
  }, handleProfileUpdate)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'combat_stats',
    filter: `user_id=eq.${userId}`
  }, handleStatsUpdate)
  .subscribe();
```

**Note**: Call `.subscribe()` only once per channel.[^11]

## 2. Supabase Realtime Performance \& Scalability

### Concurrent Connection Limits:[^12][^13][^14]

| Plan | Concurrent Connections | Cost |
| :-- | :-- | :-- |
| Free | 200 | \$0 |
| Pro | 500 | \$25/month |
| Pro + Custom | 1,000-10,000+ | \$10 per 1,000 over 500 |
| Team | 500+ (scalable) | \$599/month + usage |

### Performance Benchmarks:[^15][^16][^2]

**Processing Time with Row-Level Security**:[^2]


| Subscribers | Processing Time (ms) |
| :-- | :-- |
| 1 | 11.2 |
| 100 | 24.5 |
| 1,000 | 64.7 |
| 10,000 | 303.8 |

**Throughput Comparison**:[^16][^17]


| Feature | Supabase (PostgreSQL) | Firebase (Firestore) |
| :-- | :-- | :-- |
| Latency | 100-200ms | <100ms |
| Throughput | Up to 500 writes/sec | Up to 1,000 writes/sec |
| Scalability | Up to 10,000 concurrent clients | Higher (millions) |

### Optimization Techniques

**1. Rate Limiting**:[^18][^3]

```javascript
const supabase = createClient(url, key, {
  realtime: {
    params: {
      eventsPerSecond: 40 // Increase for games requiring frequent updates
    }
  }
});
```

**2. Payload Filtering**:[^1][^7]

Always use specific filters rather than subscribing to entire tables:

```javascript
// ❌ Bad: Receives all user updates
.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' })

// ✅ Good: Only your user's updates
.on('postgres_changes', { 
  event: 'UPDATE', 
  schema: 'public', 
  table: 'users',
  filter: `id=eq.${userId}`
})
```

**3. Optimize RLS Policies**:[^19][^4][^2]

- Disable RLS for public data (stock prices, leaderboards)[^2]
- Avoid joins within RLS policies[^2]
- Use indexes on all filter conditions[^2]
- Keep primary keys small (UUID/integer)[^2]

Example optimized policy:

```sql
-- ❌ Slow: Join in RLS policy
CREATE POLICY "team_access" ON documents
FOR SELECT USING (
  team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
);

-- ✅ Fast: Use security definer function
CREATE POLICY "team_access" ON documents
FOR SELECT USING (
  team_id = ANY(get_user_teams()) -- Returns team_id array
);
```

**4. Use Private Channels with Authorization**:[^20]

```javascript
const channel = supabase.channel('room:123:messages', {
  config: { private: true }
});
```

Then create RLS policies for authorization:[^9]

```sql
CREATE POLICY "Authenticated users can receive broadcasts"
ON "realtime"."messages"
FOR SELECT
TO authenticated
USING (true);
```

**5. Clean Up Subscriptions**:[^20]

```javascript
useEffect(() => {
  const channel = supabase.channel('game-state');
  // ... setup subscriptions
  
  return () => {
    supabase.removeChannel(channel); // Critical for mobile apps
  };
}, []);
```


## 3. Edge Functions vs. PostgreSQL Functions: When to Use Each

### Decision Matrix for Game Logic:[^21][^22][^23][^24]

| Use Case | Recommended Approach | Rationale |
| :-- | :-- | :-- |
| EPP calculation from historical data | **PostgreSQL Function** | Data-intensive, requires complex queries, benefits from being at data source[^21][^23] |
| Stat scaling lookup | **PostgreSQL Function** | Simple data retrieval, no external APIs[^21][^24] |
| Evolution stage validation | **PostgreSQL Function** | Anti-cheat logic, needs transaction safety[^23][^25] |
| Payment processing | **Edge Function** | Third-party API integration[^21][^22] |
| Push notifications | **Edge Function** | External service calls[^21][^22] |
| Image generation | **Edge Function** | Heavy computation, external APIs[^21] |

### Performance Comparison:[^23][^24][^26][^21]

**PostgreSQL Functions**:

- **Latency**: 10-50ms (data at source)[^21][^23]
- **Throughput**: High (native database operations)
- **Transaction Safety**: Automatic[^23]
- **Security**: RLS integration, SECURITY DEFINER for controlled privilege escalation[^27][^28]

**Edge Functions**:

- **Latency**: 200-600ms (recent improvements to 42ms cold start)[^26][^29][^30]
- **Throughput**: Moderate (serverless limitations)
- **Geographic Distribution**: Global edge deployment[^21]
- **Language**: TypeScript/JavaScript (better DX for some)[^23][^21]


### Example: EPP Calculation

**PostgreSQL Function (Recommended)**:[^21][^23]

```sql
CREATE OR REPLACE FUNCTION calculate_epp(p_user_id UUID, p_date DATE)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_total_epp INTEGER;
BEGIN
  -- Validate user authorization
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Calculate EPP from workout history
  SELECT SUM(
    CASE 
      WHEN workout_type = 'strength' THEN points * 1.5
      WHEN workout_type = 'cardio' THEN points * 1.2
      ELSE points
    END
  ) INTO v_total_epp
  FROM workout_history
  WHERE user_id = p_user_id
    AND workout_date = p_date;

  -- Update user profile (transaction-safe)
  UPDATE user_profiles 
  SET epp_total = epp_total + COALESCE(v_total_epp, 0),
      updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN COALESCE(v_total_epp, 0);
END;
$$;

-- Revoke public access, grant only to authenticated
REVOKE EXECUTE ON FUNCTION calculate_epp FROM PUBLIC;
GRANT EXECUTE ON FUNCTION calculate_epp TO authenticated;
```

**Trade-offs Analysis**:[^24][^23][^21]


| Factor | PostgreSQL Functions | Edge Functions |
| :-- | :-- | :-- |
| **Performance** | 10-100x faster for data operations[^23] | Better for external integrations |
| **Complexity** | SQL/PL/pgSQL (steeper learning curve)[^23] | TypeScript (familiar to web devs)[^21] |
| **Security** | Built-in RLS, transaction safety[^23] | Requires manual validation[^31][^32] |
| **Cost** | Included in database compute[^33] | \$2 per million invocations[^33][^34] |
| **Vendor Lock-in** | Standard PostgreSQL (portable)[^21] | Deno runtime (Supabase-specific) |
| **Latency** | No network hops[^23][^24] | Additional network latency[^24][^26] |

### When to Combine Both

Use a hybrid approach:[^23][^21]

```javascript
// Edge Function calls PostgreSQL Function for data operations
export default async (req: Request) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! }
      }
    }
  );

  // Send push notification (external API)
  await sendPushNotification(userId, message);
  
  // Update database via PostgreSQL function
  const { data, error } = await supabase.rpc('calculate_epp', {
    p_user_id: userId,
    p_date: new Date()
  });
  
  return new Response(JSON.stringify({ epp: data }));
};
```


## 4. Security Best Practices for Edge Functions \& Game Logic

### Input Validation \& Authentication:[^31][^35][^32][^25]

**1. Validate All Inputs**:[^36][^31]

```typescript
import { z } from 'zod';

const requestSchema = z.object({
  user_id: z.string().uuid(),
  evolution_stage: z.number().int().min(1).max(10),
  stat_value: z.number().positive()
});

Deno.serve(async (req: Request) => {
  const body = await req.json();
  
  // Validate input
  const validation = requestSchema.safeParse(body);
  if (!validation.success) {
    return new Response(
      JSON.stringify({ error: 'Invalid input', details: validation.error }),
      { status: 400 }
    );
  }
  
  // ... process validated data
});
```

**2. Verify User Identity**:[^35][^32][^37]

```typescript
Deno.serve(async (req: Request) => {
  const supabase = createClient(/* ... */);
  
  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser(
    req.headers.get('Authorization')?.replace('Bearer ', '')
  );
  
  if (error || !user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    );
  }
  
  const { user_id, stat_value } = await req.json();
  
  // Prevent cheating: verify user_id matches authenticated user
  if (user.id !== user_id) {
    return new Response(
      JSON.stringify({ error: 'Forbidden' }),
      { status: 403 }
    );
  }
  
  // ... safe to process
});
```

**3. Secure Environment Variables**:[^32][^31]

```typescript
// ❌ Never hardcode
const apiKey = 'sk_live_12345...';

// ✅ Use environment variables
const apiKey = Deno.env.get('EXTERNAL_API_KEY');
```


### PostgreSQL Function Security:[^28][^38][^39][^27]

**SECURITY DEFINER Best Practices**:[^38][^39][^27]

```sql
CREATE OR REPLACE FUNCTION update_combat_stats(
  p_user_id UUID,
  p_new_hp INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp  -- Critical: prevents schema poisoning
AS $$
BEGIN
  -- Always validate caller identity first
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Validate business logic (anti-cheat)
  IF p_new_hp > 100 OR p_new_hp < 0 THEN
    RAISE EXCEPTION 'Invalid HP value';
  END IF;
  
  -- Schema-qualify all objects to prevent injection
  UPDATE public.combat_stats
  SET hp = p_new_hp,
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;

-- Restrict access
REVOKE ALL ON FUNCTION update_combat_stats FROM PUBLIC;
GRANT EXECUTE ON FUNCTION update_combat_stats TO authenticated;
```

**Why This Matters for Anti-Cheat**:[^39][^27][^38]

- `SECURITY DEFINER` runs with function owner's privileges (often superuser)[^27]
- Without `SET search_path`, attackers can create malicious operators/functions in `public` schema[^39][^27]
- Always validate `auth.uid()` matches the user being modified[^28]
- Use parameterized queries, never concatenate user input[^38]


### Row-Level Security for Game State:[^40][^25][^41]

```sql
-- Enable RLS on all game tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read/update their own data
CREATE POLICY "Users manage own profile"
ON user_profiles
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Use security definer function for complex checks
CREATE OR REPLACE FUNCTION user_can_access_game(game_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM game_participants
    WHERE game_id = $1 AND user_id = auth.uid()
  );
$$;

-- Apply function in policy
CREATE POLICY "Access own games"
ON game_state
FOR SELECT
USING (user_can_access_game(game_id));
```


## 5. Recommended Patterns \& Libraries for Game State Sync

### Client-Side State Management:[^42][^43][^18]

**Legend-State for Local-First Realtime**:[^42]

```typescript
import { observable } from '@legendapp/state';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';

// Configure synced observable
const gameState$ = observable(
  syncedSupabase({
    supabase: supabaseClient,
    collection: 'user_profiles',
    select: (from) => from.select('id,evolution_stage,epp,hp,attack'),
    filter: (select) => select.eq('user_id', userId),
    actions: ['read', 'update'],
    realtime: true,
    persist: {
      name: 'game-state',
      retrySync: true // Offline support
    },
    retry: {
      infinite: true
    }
  })
);
```

**Benefits**: Automatic persistence, offline-first, optimistic updates, conflict resolution.[^42]

### Recommended Architecture Patterns:[^43][^44]

**1. Client-Side Processing with Server Validation**:[^44]

```typescript
// Client: Calculate EPP locally for instant feedback
function calculateLocalEPP(workout: Workout): number {
  return workout.type === 'strength' ? workout.points * 1.5 : workout.points;
}

// Client: Send to server for validation
async function syncWorkout(workout: Workout) {
  // Update local state immediately
  gameState$.epp.set(s => s + calculateLocalEPP(workout));
  
  // Broadcast to other players via Realtime
  const channel = supabase.channel(`game:${gameId}`);
  await channel.send({
    type: 'broadcast',
    event: 'workout_complete',
    payload: { userId, epp: calculateLocalEPP(workout) }
  });
  
  // Server validates and persists
  const { data } = await supabase.rpc('validate_and_save_workout', {
    p_workout: workout
  });
  
  // Reconcile if server calculated differently (anti-cheat)
  if (data.actual_epp !== calculateLocalEPP(workout)) {
    gameState$.epp.set(data.actual_epp);
  }
}
```

**2. Checkpoint Pattern for Multiplayer**:[^44]

```typescript
// Most processing client-side, periodic server checkpoints
let localState = { position: [0, 0], hp: 100 };

// Update locally every frame
function updatePosition(x: number, y: number) {
  localState.position = [x, y];
  
  // Broadcast to other players (high frequency)
  channel.send({
    type: 'broadcast',
    event: 'position',
    payload: { userId, position: [x, y] }
  });
}

// Server checkpoint every 5 seconds
setInterval(async () => {
  await supabase.rpc('validate_game_state', {
    p_user_id: userId,
    p_position: localState.position,
    p_hp: localState.hp
  });
}, 5000);
```

**3. Broadcast vs. Postgres Changes Decision Tree**:[^10][^20][^8]

```
Is data persisted in database?
├─ No → Use Broadcast (ephemeral game events, position updates)
└─ Yes → Consider:
    ├─ Need scalability for 1,000+ users? → Broadcast from Database
    ├─ Simple dev/test scenario? → Postgres Changes
    └─ Need selective columns/actions? → Broadcast from Database
```


### React Native Specific Optimizations:[^45][^46][^47][^48]

**1. Initialize Supabase Correctly**:[^46][^48]

```typescript
// utils/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage, // Persist sessions
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
);
```

**2. Manage Realtime Lifecycle**:[^6][^20]

```typescript
// components/GameScreen.tsx
import { useEffect, useState } from 'react';

export default function GameScreen() {
  const [gameState, setGameState] = useState({});
  
  useEffect(() => {
    const channel = supabase
      .channel('game-updates', {
        config: { private: true, broadcast: { ack: true } }
      })
      .on('broadcast', { event: 'state-update' }, (payload) => {
        setGameState(payload);
      })
      .subscribe();
    
    // Critical: Clean up on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return <GameView state={gameState} />;
}
```

**3. Optimize Query Patterns**:[^49]

```typescript
// ❌ Avoid: Separate queries
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', userId)
  .single();

const { data: stats } = await supabase
  .from('combat_stats')
  .select('*')
  .eq('user_id', userId)
  .single();

// ✅ Better: Join in one query
const { data } = await supabase
  .from('user_profiles')
  .select(`
    *,
    combat_stats (*)
  `)
  .eq('user_id', userId)
  .single();
```


## 6. Supabase Realtime vs. Alternatives for Mobile Games

### Performance Comparison:[^17][^50][^51][^52][^16]

| Feature | Supabase Realtime | Firebase Realtime | Firestore |
| :-- | :-- | :-- | :-- |
| **Latency** | 100-200ms[^16] | <100ms[^16] | <100ms[^16] |
| **Throughput** | 500 writes/sec[^16] | 1,000 writes/sec[^16] | 1,000 writes/sec[^16] |
| **Concurrent Clients** | Up to 10,000[^53] | Millions[^50] | Millions[^50] |
| **Offline Support** | Via client libraries[^42] | Native[^50] | Native[^50] |
| **Database Type** | PostgreSQL (relational)[^17] | NoSQL[^17] | NoSQL[^17] |
| **Real-time Joins** | Yes[^51] | No[^51] | No[^51] |
| **Message Guarantee** | No guarantee[^54] | Strong consistency[^50] | Strong consistency[^50] |

### React Native Integration Ease:[^47][^48][^55][^46]

**Supabase**:

```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
```

**Firebase**:

```bash
npx expo install firebase @react-native-firebase/app
```

Both have excellent React Native support with similar setup complexity.[^46][^47]

### Cost Comparison:[^33][^34][^56][^57]

**Supabase (Pro Plan)**:[^33]

- Base: \$25/month
- Realtime: Included (up to 500 concurrent)
- Additional 1,000 connections: \$10/month
- Edge Functions: \$2 per million invocations

**Firebase (Blaze Plan)**:[^52]

- Database: \$5/GB stored, \$1/GB downloaded
- Realtime: \$1/GB transferred
- Cloud Functions: \$0.40 per million invocations
- Generally more expensive at scale[^52]


### Scalability Analysis:[^50][^58][^16]

**Supabase Strengths**:[^58][^16]

- **SQL queries**: Complex game logic (leaderboards, inventory)[^17]
- **Relational data**: Player stats, achievements with joins[^17]
- **Cost-effective**: Predictable pricing at scale[^33]
- **Self-hosting option**: Ultimate control[^21]

**Firebase Strengths**:[^16][^50][^52]

- **Lower latency**: Better for fast-paced action games[^16]
- **Offline resilience**: More mature offline support[^50]
- **Global scale**: Proven at millions of users[^50]
- **Google ecosystem**: Analytics, AdMob integration[^59]


### Recommendation for 16BitFit-V3:[^16][^17][^50]

**Supabase is the right choice** because:

1. **Fitness data is relational**: Workouts, stats, evolution stages benefit from SQL joins[^17]
2. **Turn-based gameplay**: 100-200ms latency acceptable for workout tracking[^16]
3. **Complex calculations**: EPP calculations, stat scaling easier in PostgreSQL[^17][^21]
4. **Cost predictability**: \$25/month base + transparent usage pricing[^33]
5. **Open-source**: Can self-host if needed[^59][^21]

**Use Firebase if**: You need sub-100ms latency for real-time PvP combat or have heavy mobile-specific needs (push notifications, analytics).[^59][^50]

## Summary: Key Takeaways for 16BitFit-V3

1. **Table Structure**: Use row-level filtering with small primary keys (UUIDs), enable replication selectively, index filter columns.[^1][^2]
2. **Subscription Strategy**: Start with Postgres Changes for simplicity, migrate to Broadcast from Database when scaling beyond 1,000 concurrent users.[^8][^9]
3. **Server Logic**: Use PostgreSQL Functions for EPP calculations and stat scaling (10-100x faster), Edge Functions only for external APIs.[^24][^23][^21]
4. **Security**: Always validate `auth.uid()`, use `SECURITY DEFINER` with `SET search_path`, enable RLS on all tables.[^27][^28][^38]
5. **Performance**: Optimize RLS policies, use private channels, clean up subscriptions, leverage Legend-State for offline-first sync.[^20][^42][^2]
6. **Scalability**: Pro plan supports 500 concurrent users, scales to 10,000+ with usage-based pricing (\$10 per 1,000).[^12][^33]

By following these patterns, 16BitFit-V3 can achieve responsive real-time gameplay with secure, scalable server-side logic while maintaining cost-effectiveness as your user base grows.
<span style="display:none">[^100][^101][^102][^103][^104][^105][^106][^107][^60][^61][^62][^63][^64][^65][^66][^67][^68][^69][^70][^71][^72][^73][^74][^75][^76][^77][^78][^79][^80][^81][^82][^83][^84][^85][^86][^87][^88][^89][^90][^91][^92][^93][^94][^95][^96][^97][^98][^99]</span>

<div align="center">⁂</div>

[^1]: https://supabase.com/docs/guides/realtime/postgres-changes

[^2]: https://supabase.com/blog/realtime-row-level-security-in-postgresql

[^3]: https://chat2db.ai/resources/blog/supabase-realtime-guide

[^4]: https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv

[^5]: https://supabase.com/docs/guides/database/query-optimization

[^6]: https://www.supadex.app/blog/building-real-time-apps-with-supabase-a-step-by-step-guide

[^7]: https://slashdev.io/-guide-to-building-fast-backends-in-supabase-in-2024

[^8]: https://dev.to/supabase/realtime-broadcast-from-database-17k4

[^9]: https://supabase.com/docs/guides/realtime/subscribing-to-database-changes

[^10]: https://www.answeroverflow.com/m/1357762690193555482

[^11]: https://github.com/orgs/supabase/discussions/10980

[^12]: https://supabase.com/docs/guides/troubleshooting/realtime-concurrent-peak-connections-quota-jdDqcp

[^13]: https://community.flutterflow.io/discussions/post/supabase-realtime-concurrent-connections-aUOyU2Hf2QqLKLU

[^14]: https://www.answeroverflow.com/m/1184169694744301651

[^15]: https://supabase.com/docs/guides/realtime/benchmarks

[^16]: https://sqlflash.ai/article/20250912_firebase_vs_supabase/

[^17]: https://chat2db.ai/resources/blog/supabase-vs-firebase

[^18]: https://supabase.com/blog/flutter-real-time-multiplayer-game

[^19]: https://www.reddit.com/r/Supabase/comments/1dv3kvq/query_performance_with_row_level_security_rls/

[^20]: https://supabase.com/docs/guides/realtime/getting_started

[^21]: https://www.closefuture.io/blogs/supabase-database-vs-edge-functions

[^22]: https://github.com/orgs/supabase/discussions/4269

[^23]: https://www.reddit.com/r/Supabase/comments/1kcm181/how_do_you_get_around_the_lack_of_a_business/

[^24]: https://www.reddit.com/r/Supabase/comments/1kmkm7h/database_function_vs_edge_function/

[^25]: https://www.supadex.app/blog/best-security-practices-in-supabase-a-comprehensive-guide

[^26]: https://github.com/orgs/supabase/discussions/29301

[^27]: https://mulungood.com/supabase-row-level-security-with-functions

[^28]: https://www.answeroverflow.com/m/1428006794835525794

[^29]: https://joshuaberkowitz.us/blog/news-1/supabase-edge-functions-persistent-storage-and-lightning-fast-cold-starts-transform-serverless-workflows-563

[^30]: https://www.reddit.com/r/Supabase/comments/1cmk86x/edge_function_latencyperformance_questions/

[^31]: https://drdroid.io/stack-diagnosis/supabase-edge-functions-function-security-vulnerability

[^32]: https://drdroid.io/stack-diagnosis/supabase-edge-functions-unauthorized-access-error-encountered-when-trying-to-access-supabase-edge-functions

[^33]: https://uibakery.io/blog/supabase-pricing

[^34]: https://www.bytebase.com/blog/supabase-vs-aws-pricing/

[^35]: https://supabase.com/docs/guides/functions/auth

[^36]: https://drdroid.io/stack-diagnosis/supabase-edge-functions-data-processed-by-the-function-is-corrupted--leading-to-incorrect-results

[^37]: https://www.reddit.com/r/Supabase/comments/1ds9e2i/how_is_edge_functions_security_handled/

[^38]: https://www.red-gate.com/simple-talk/?p=106671

[^39]: https://www.cybertec-postgresql.com/en/abusing-security-definer-functions/

[^40]: https://www.projectrules.ai/rules/supabase

[^41]: https://maxlynch.com/2023/11/04/tips-for-row-level-security-rls-in-postgres-and-supabase/

[^42]: https://supabase.com/blog/local-first-expo-legend-state

[^43]: https://www.aleksandra.codes/supabase-game

[^44]: https://www.reddit.com/r/Supabase/comments/17fap8l/multiplayer_game_with_supabase_best_practises/

[^45]: https://forum.cursor.com/t/prompt-for-ai-structured-guide-for-building-a-react-native-supabase-expo-app/109822

[^46]: https://dev.to/sebduta/how-to-use-supabase-database-in-react-native-complete-guide-11ih

[^47]: https://docs.expo.dev/guides/using-supabase/

[^48]: https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native

[^49]: https://fabwebstudio.com/blog/build-a-blazing-fast-scalable-app-with-next-js-and-supabase-step-by-step-tutorial

[^50]: https://www.bytebase.com/blog/supabase-vs-firebase/

[^51]: https://anotherwrapper.com/blog/supabase-vs-firebase

[^52]: https://talent500.com/blog/supabase-vs-firebase-baas-platform-comparison-2025/

[^53]: https://ably.com/compare/pusher-vs-supabase

[^54]: https://github.com/supabase/realtime

[^55]: https://supabase.com/docs/guides/auth/quickstarts/react-native

[^56]: https://www.metacto.com/blogs/the-true-cost-of-supabase-a-comprehensive-guide-to-pricing-integration-and-maintenance

[^57]: https://supabase.com/pricing

[^58]: https://propelius.ai/blogs/real-time-collaboration-tools-supabase-vs-firebase

[^59]: https://www.closefuture.io/blogs/supabase-vs-firebase

[^60]: https://github.com/orgs/supabase/discussions/5975

[^61]: https://supabase.com/features/realtime-postgres-changes

[^62]: https://www.reddit.com/r/Supabase/comments/1neiwhm/best_practices_for_updatinggetting_data_in_real/

[^63]: https://www.reddit.com/r/Supabase/comments/191m503/how_well_does_supabase_handle_concurent/

[^64]: https://supabase.com/blog

[^65]: https://bootstrapped.app/guide/how-to-handle-concurrent-writes-in-supabase

[^66]: https://supabase.com/blog/tags/realtime

[^67]: https://supabase.com/docs/guides/database/postgres/row-level-security

[^68]: https://dev.to/tigawanna/supabase-functions-not-edge-2o1

[^69]: https://supabase.com/blog/supabase-auth-identity-linking-hooks

[^70]: https://stackoverflow.com/questions/77866348/supabase-whats-the-difference-between-stored-procedures-rpcs-database-funct

[^71]: https://supabase.com/docs/guides/functions

[^72]: https://www.youtube.com/watch?v=31u3g2Uelfg

[^73]: https://community.weweb.io/t/recommendation-for-business-logic-using-supabase/8320

[^74]: https://www.reddit.com/r/Supabase/comments/1j4yqxi/edge_functions_for_complex_validation/

[^75]: https://github.com/supabase/auth-js/issues/881

[^76]: https://www.answeroverflow.com/m/1422016088337813544

[^77]: https://www.pentestly.io/blog/supabase-security-best-practices-2025-guide

[^78]: https://www.youtube.com/watch?v=isQODwzQDpk

[^79]: https://flatirons.com/blog/firebase-vs-supabase/

[^80]: https://www.reddit.com/r/Supabase/comments/1fo8adi/how_to_implement_game_time_synchronisation/

[^81]: https://dev.to/dev_tips/firebase-vs-supabase-in-2025-which-one-actually-scales-with-you-2374

[^82]: https://supabase.com/docs/guides/realtime

[^83]: https://www.reddit.com/r/FlutterDev/comments/1axet00/why_anyone_would_choose_firebase_over_supabase/

[^84]: https://www.reddit.com/r/reactnative/comments/1ggjrvr/tradeoffs_supabase_vs_firebase/

[^85]: https://supabase.com/blog/supabase-realtime-multiplayer-general-availability

[^86]: https://ably.com/compare/firebase-vs-supabase

[^87]: https://www.jakeprins.com/blog/supabase-vs-firebase-2024

[^88]: https://github.com/supabase-community/realtime-csharp

[^89]: https://discord-questions.refine.dev/m/1313496035074506792

[^90]: https://trigger.dev/blog/supabase-and-trigger-dev

[^91]: https://supabase.com/docs/guides/storage/production/scaling

[^92]: https://www.oviematthew.com/blog-post/frontend-performance-supabase-edge

[^93]: https://cursorrules.org/article/supabase-cursor-mdc-file

[^94]: https://www.answeroverflow.com/m/1331625252962304022

[^95]: https://github.com/orgs/supabase/discussions/21995

[^96]: https://cursor.directory/rules/supabase

[^97]: https://dev.to/iamhectorsosa/understanding-user-state-management-solutions-55ee

[^98]: https://sequinstream.com/docs/guides/supabase-function

[^99]: https://supabase.com/docs/guides/realtime/concepts

[^100]: https://supabase.com/docs/guides/realtime/protocol

[^101]: https://www.reddit.com/r/reactjs/comments/18ogc0o/web_sockets_are_not_efficient_and_hard_to_scale/

[^102]: https://getdeploying.com/supabase

[^103]: https://www.reddit.com/r/Supabase/comments/1l9kvd0/is_supabase_costly/

[^104]: https://www.reddit.com/r/Supabase/comments/1ko1ayv/best_practices_for_using_a_backend_to_interact/

[^105]: https://ably.com/compare/amazon-sqs-vs-supabase

[^106]: https://slashdev.io/-guide-to-building-fast-backends-in-supabase-in-2024-2

[^107]: https://talent500.com/blog/how-supabase-data-apis-transform-backend-development/

