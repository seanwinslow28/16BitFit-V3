# 16BitFit V3 - Claude Code on the Web Configuration

## Project Overview

**16BitFit V3** is a gamified fitness platform that combines real-world physical activity with retro Game Boy-inspired RPG mechanics. Users track steps via Apple Health/Google Fit, which fuels energy for turn-based combat training sessions featuring pixel art characters and Street Fighter 2-inspired mechanics.

**Tech Stack:**
- **Frontend:** React Native (Expo) + TypeScript
- **Game Engine:** Phaser 3 (WebView bridge)
- **Backend:** Supabase (PostgreSQL + Edge Functions + Storage)
- **Design System:** DMG Game Boy LCD 4-color palette + atomic design
- **Health Integration:** Apple HealthKit (iOS) / Google Fit (Android)

---

## Build Commands

### Development

```bash
# Install dependencies (root + mobile-shell)
npm install
cd apps/mobile-shell && npm install

# iOS Development (choose one method)
npm run ios                           # CLI method (Metro + simulator)
open apps/mobile-shell/ios/MobileShell.xcworkspace  # Xcode method

# Android Development
npm run android

# Start Metro Bundler (if not auto-started)
npm run start

# Run Tests
npm run test
cd apps/mobile-shell && npm test

# Type Checking
npm run type-check
cd apps/mobile-shell && npx tsc --noEmit

# Linting
npm run lint
```

### iOS-Specific Setup

```bash
# Install CocoaPods dependencies
cd apps/mobile-shell/ios && pod install

# OR use npx wrapper (recommended)
npx pod-install

# Check iOS simulators available
xcrun simctl list devices

# Boot a specific simulator
xcrun simctl boot "iPhone 15 Pro"
```

### Supabase (Backend)

```bash
# Start local Supabase instance
cd supabase
npx supabase start

# Generate TypeScript types from schema
npx supabase gen types typescript --local > ../apps/mobile-shell/src/types/database.types.ts

# Apply migrations
npx supabase db reset

# Stop Supabase
npx supabase stop
```

---

## Project Structure

```
16BitFit-V3/
├── apps/
│   └── mobile-shell/              # React Native app
│       ├── src/
│       │   ├── components/
│       │   │   ├── atoms/         # Atomic design components
│       │   │   ├── molecules/     # Composite components
│       │   │   └── organisms/     # Complex layouts
│       │   ├── screens/           # Screen components
│       │   │   └── onboarding/    # Onboarding flow (Stories 1.2-1.5)
│       │   ├── navigation/        # React Navigation setup
│       │   ├── services/          # Business logic
│       │   │   ├── health/        # HealthKit/Google Fit integration
│       │   │   └── supabase/      # Database client
│       │   ├── design-system/     # Design tokens, animations
│       │   ├── types/             # TypeScript definitions
│       │   └── hooks/             # Custom React hooks
│       ├── ios/                   # Native iOS code
│       └── android/               # Native Android code
├── supabase/
│   ├── migrations/                # Database schema migrations
│   ├── functions/                 # Edge Functions (Deno)
│   └── config.toml                # Local Supabase config
├── docs/
│   ├── stories/                   # Feature stories (1.1-1.14)
│   ├── design-system/             # Design documentation
│   └── archive/                   # Historical docs
└── assets/                        # Shared assets (sprites, audio)
```

---

## Design System

### Color Palette (LCD Screen-Only 4-Color Theme)

**All components MUST use these exact 4 colors:**

```typescript
// From apps/mobile-shell/src/design-system/tokens.ts
// Official Palette: docs/design-system/design-tokens-LCD.md
export const colors = {
  dmg: {
    lightest: '#9BBC0F',  // Neon grass glow (backgrounds, inverse text)
    light: '#8BAC0F',     // Lime highlight (buttons, CTAs, focus states)
    dark: '#306230',      // Pine border (borders, secondary text)
    darkest: '#0F380F',   // Deep forest shadow (text, shadows)
  },
};
```

**Usage Rules (LCD Screen-Only Theme):**
- Background: `lightest` (#9BBC0F) - `tokens.colors.background.primary`
- Text: `darkest` (#0F380F) - `tokens.colors.text.primary`
- Borders: `dark` (#306230) - `tokens.colors.border.default`
- Buttons/CTAs: `light` (#8BAC0F) - `tokens.colors.button.primary`

**📋 Full Documentation:** [docs/design-system/design-tokens-LCD.md](docs/design-system/design-tokens-LCD.md)

### Typography

```typescript
// Primary font: Press Start 2P (pixel font)
// Sizes: 10, 12, 14, 16, 20, 24

// Secondary font: Montserrat (body copy, long text)
// Weights: 400 (Regular), 600 (SemiBold), 700 (Bold)
```

### Spacing (8px Grid)

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### Border Widths (Pixel-Perfect)

```typescript
export const borderWidth = {
  thin: 2,   // Dividers
  medium: 3, // Default
  thick: 4,  // Emphasis
};
```

### Animations

```typescript
// Durations (match Game Boy hardware timings)
export const duration = {
  instant: 0,
  fast: 150,      // Button presses
  normal: 300,    // Transitions
  slow: 500,      // Modals
  verySlow: 800,  // Page transitions
};

// Easings
export const easing = {
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),    // Material Design
  emphasized: Easing.bezier(0.0, 0.0, 0.2, 1),  // Enter
  decelerated: Easing.bezier(0.0, 0.0, 0.2, 1), // Exit
};
```

---

## Component Implementation Guidelines

### 1. Atomic Components - ✅ COMPLETE

**Status:** 10/10 implemented (100% complete)

**All Components Implemented:**
- ✅ [PixelButton](apps/mobile-shell/src/components/atoms/PixelButton/index.tsx)
- ✅ [PixelText](apps/mobile-shell/src/components/atoms/PixelText/index.tsx)
- ✅ [PixelInput](apps/mobile-shell/src/components/atoms/PixelInput/index.tsx)
- ✅ [PixelSprite](apps/mobile-shell/src/components/atoms/PixelSprite/index.tsx)
- ✅ [PixelBorder](apps/mobile-shell/src/components/atoms/PixelBorder/index.tsx)
- ✅ [PixelIcon](apps/mobile-shell/src/components/atoms/PixelIcon/index.tsx) - 10 icons, 4 sizes
- ✅ [PixelDivider](apps/mobile-shell/src/components/atoms/PixelDivider/index.tsx) - 2/3/4px thickness
- ✅ [PixelBadge](apps/mobile-shell/src/components/atoms/PixelBadge/index.tsx) - Notification badges
- ✅ [PixelProgressBar](apps/mobile-shell/src/components/atoms/PixelProgressBar/index.tsx) - SF2-style health bars
- ✅ [PixelCheckbox](apps/mobile-shell/src/components/atoms/PixelCheckbox/index.tsx) - Toggle with animations

**Full specs:** [docs/design-system/atomic-components.md](docs/design-system/atomic-components.md)

### 2. Molecular Components - ✅ COMPLETE

**Status:** 10/10 implemented (100% complete) 🎉

**All Components Implemented:**
- ✅ [ArchetypeCard](apps/mobile-shell/src/components/molecules/ArchetypeCard/index.tsx) - 176 lines, selection animations
- ✅ [FormField](apps/mobile-shell/src/components/molecules/FormField/index.tsx) - 201 lines, validation & error states
- ✅ [ProgressIndicator](apps/mobile-shell/src/components/molecules/ProgressIndicator/index.tsx) - 120 lines, step dots
- ✅ [ToastNotification](apps/mobile-shell/src/components/molecules/ToastNotification/index.tsx) - 156 lines, slide-in animations
- ✅ [ProfileHeader](apps/mobile-shell/src/components/molecules/ProfileHeader/index.tsx) - 101 lines, avatar & stats
- ✅ [StatBar](apps/mobile-shell/src/components/molecules/StatBar/index.tsx) - 99 lines, labeled progress bars
- ✅ [ActionSheet](apps/mobile-shell/src/components/molecules/ActionSheet/index.tsx) - 203 lines, bottom sheet modal
- ✅ [EmptyState](apps/mobile-shell/src/components/molecules/EmptyState/index.tsx) - 106 lines, icon + message + CTA
- ✅ [LoadingSpinner](apps/mobile-shell/src/components/molecules/LoadingSpinner/index.tsx) - 121 lines, rotating icon
- ✅ [ConfirmDialog](apps/mobile-shell/src/components/molecules/ConfirmDialog/index.tsx) - 133 lines, confirmation modal

**Total:** ~1,516 lines of production-ready molecular components

**Full specs:** [docs/design-system/molecular-components.md](docs/design-system/molecular-components.md)

### 3. Code Quality Standards

**TypeScript:**
- Strict mode enabled
- No `any` types (use `unknown` + type guards)
- Explicit return types for functions
- Interface over type for component props

**React Native:**
- Functional components only
- Hooks for state/effects
- React.memo for expensive renders
- useCallback/useMemo for optimization

**Testing:**
- Jest + React Native Testing Library
- Unit tests for all components
- Integration tests for user flows
- 80%+ code coverage target

**Accessibility:**
- `accessibilityLabel` on all touchables
- `accessibilityRole` for semantic meaning
- `accessibilityHint` for complex interactions
- Minimum 44x44 touch targets
- WCAG AA contrast (handled by DMG palette)

---

## Frontend UI/UX Workflow: MagicPath.ai

### 🎨 Conversational Prototyping for All Screens

**IMPORTANT:** For all frontend UI/UX work, we use **MagicPath.ai** as our conversational prototyping canvas instead of directly writing React Native JSX.

**MagicPath.ai** is a designer's co-pilot that combines:
- **Natural language prompts** to generate screens/components
- **Visual editing post-generation** (Figma-like infinite canvas)
- **Code export** to React/HTML/CSS for developer handoff
- **Design system integration** (imports our DMG CSS themes)

### Why MagicPath.ai?

✅ **Rapid Iteration:** Generate full screens from text prompts in seconds
✅ **Visual Control:** Drag, resize, and refine components after generation
✅ **DMG Compliance:** Enforces our strict 4-color palette via CSS themes
✅ **Production React Code:** Exports clean React components with our atomic components
✅ **Designer-Friendly:** No Figma friction - export to code directly

### MagicPath.ai Workflow

**Step 1: Choose Theme**
- **For Production Development:** Use **Theme 6: LCD Screen Content** (329×584pt viewport)
- **For Presentations/Marketing:** Use **Theme 5: Game Boy Shell Mockup** (393×852pt viewport)

**Step 2: Write Prompts**
- Reference existing prompts in [`docs/design-system/magicpath-prompt-library.md`](docs/design-system/magicpath-prompt-library.md)
- Reuse components with `@PixelButton`, `@ArchetypeCard` notation
- Specify layout, spacing, and interactions in natural language

**Step 3: Generate & Refine**
- MagicPath generates the UI from your prompt
- Visually edit elements (drag, resize, adjust spacing)
- Iterate with follow-up prompts: "Move the button down 20px", "Make text darker"

**Step 4: Export Code**
- Export as React/HTML/CSS
- Integrate into `apps/mobile-shell/src/screens/`
- Replace HTML with our atomic components (PixelButton, PixelText, etc.)

### Existing Prompts (Story 1.4 - Onboarding)

All prompts for Stories 1.1-1.4 are documented in:
- **Full Library:** [`docs/design-system/magicpath-prompt-library.md`](docs/design-system/magicpath-prompt-library.md)

**Example: WelcomeScreen Prompt**
```
Create a GameBoy-inspired welcome screen for 16BitFit fitness app with DMG LCD palette.

Layout (329×584pt LCD screen):
- Hero text "16BITFIT" (Press Start 2P, 24px, #0F380F)
- Tagline "Fitness Battles Fueled by Your Steps" (Montserrat, 14px)
- Primary CTA button "Start Your Journey" (280px wide, #8BAC0F background)
- Progress dots at bottom (1 of 3, active = #8BAC0F, inactive = #306230)

Design System:
- Background: #9BBC0F (lightest green)
- Text: #0F380F (darkest green)
- Button background: #8BAC0F (lime highlight)
- 3px borders, zero border-radius
- 4×4px pixel shadows (no blur)
```

### Future Agents: Add New Screen Prompts Here

When implementing new stories (1.5+), follow this pattern:
1. Write MagicPath.ai prompt for the screen (reference prompt library for style)
2. Add prompt to `docs/design-system/magicpath-prompt-library.md`
3. Generate in MagicPath with LCD Screen Content theme
4. Export React code
5. Integrate into `apps/mobile-shell/src/screens/`

### 📚 Deep Research Documentation

Complete MagicPath.ai documentation is available in:
- **Competitive Analysis:** [`docs/UX_UI Magic Path Deep Research /Gemini - Prompt 2 - Competitive & Feature Analysis of MagicPath.ai.md`](docs/UX_UI%20Magic%20Path%20Deep%20Research%20/Gemini%20-%20Prompt%202%20-%20Competitive%20&%20Feature%20Analysis%20of%20MagicPath.ai.md)
- **Power-User Tips:** [`docs/UX_UI Magic Path Deep Research /GPT 5 - Agent Mode - Prompt 7 - _Power-User_ Tips & Hidden Features.md`](docs/UX_UI%20Magic%20Path%20Deep%20Research%20/GPT%205%20-%20Agent%20Mode%20-%20Prompt%207%20-%20_Power-User_%20Tips%20&%20Hidden%20Features.md)
- **Prompting Guide:** [`docs/UX_UI Magic Path Deep Research /ChatGPT 5 Pro - Prompt 3 - The _MagicPath.ai Prompting 101_ Guide.md`](docs/UX_UI%20Magic%20Path%20Deep%20Research%20/ChatGPT%205%20Pro%20-%20Prompt%203%20-%20The%20_MagicPath.ai%20Prompting%20101_%20Guide.md)

---

## Story Implementation Status

### ✅ Completed Stories

- **Story 1.1:** Project Setup & Infrastructure
- **Story 1.2:** Supabase Backend Integration
- **Story 1.3:** HealthKit/Google Fit Integration (partial)

### 🚧 In Progress

- **Story 1.4:** Onboarding & Profile Setup
  - Status: Screens created, needs molecular component integration
  - Files: `apps/mobile-shell/src/screens/onboarding/`
  - Next: Implement ArchetypeCard, FormField, ProgressIndicator

### ⏳ Upcoming Stories

- **Story 1.5:** Avatar Generation (DALL-E 3 Edge Function)
- **Story 1.6:** Home Screen Dashboard
- **Story 1.7:** WebView Bridge (React Native ↔ Phaser 3)
- **Story 1.8:** Combat Mechanics (Phaser 3 game engine)
- **Story 1.9:** Combat UI (Health bars, timers, combos)
- **Story 1.10:** FTUE Tutorial
- **Story 1.11-1.14:** Advanced features (social, quests, progression)

**Full story docs:** [docs/stories/](docs/stories/)

---

## Environment Variables

⚠️ **CRITICAL:** Do NOT hardcode credentials in source code!

### Setup Instructions

1. Copy `.env.example` to `.env` (local development only)
2. Use `expo-constants` to access environment variables:

```typescript
// apps/mobile-shell/src/config/env.ts
import Constants from 'expo-constants';

export const ENV = {
  SUPABASE_URL: Constants.expoConfig?.extra?.supabaseUrl || '',
  SUPABASE_ANON_KEY: Constants.expoConfig?.extra?.supabaseAnonKey || '',
} as const;
```

3. Configure in `app.json`:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": process.env.EXPO_PUBLIC_SUPABASE_URL,
      "supabaseAnonKey": process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    }
  }
}
```

### Required Variables

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional (for advanced features)
EXPO_PUBLIC_ELEVENLABS_API_KEY=sk_...  # Audio generation
EXPO_PUBLIC_FAL_AI_KEY=...             # Sprite generation
```

---

## Common Issues & Solutions

### Issue: Metro bundler cache problems

```bash
# Clear Metro cache
npx react-native start --reset-cache

# OR
rm -rf $TMPDIR/metro-* && rm -rf $TMPDIR/haste-*
```

### Issue: iOS build fails after pod install

```bash
# Clean build artifacts
cd apps/mobile-shell/ios
rm -rf Pods/ Podfile.lock build/
pod cache clean --all
pod install --repo-update

# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### Issue: TypeScript errors after schema changes

```bash
# Regenerate Supabase types
cd supabase
npx supabase gen types typescript --local > ../apps/mobile-shell/src/types/database.types.ts
```

### Issue: HealthKit permissions not working (iOS)

```bash
# Verify Info.plist has required entries
# File: apps/mobile-shell/ios/MobileShell/Info.plist

<key>NSHealthShareUsageDescription</key>
<string>16BitFit needs access to your step count to fuel your character's energy for battles.</string>
```

---

## Privacy & Security

### Health Data Handling (COPPA/GDPR Compliant)

1. **Data Minimization:** Only collect step count (no GPS, heart rate, etc.)
2. **Encryption:** AES-256 for health data at rest
3. **Consent:** Granular permission requests with clear explanations
4. **Deletion:** User-initiated data deletion via profile settings
5. **Audit Logs:** Track all health data access (admin only)

### Secure Coding Practices

- ✅ No hardcoded secrets (use environment variables)
- ✅ HTTPS only (Supabase enforces TLS)
- ✅ JWT authentication (Supabase handles)
- ✅ Row Level Security (RLS) policies on all tables
- ✅ Input validation on all user inputs
- ✅ Sanitize outputs to prevent XSS

---

## Network Access Requirements

### Recommended Setting: **Trusted Sources**

This allows Claude Code to:
- Install npm packages (React Native, Expo, Supabase)
- Access GitHub repositories
- Download CocoaPods dependencies
- Fetch from Supabase APIs (for type generation)

### Trusted Domains Required

```
registry.npmjs.org          # npm packages
registry.yarnpkg.com        # Yarn packages
github.com                  # GitHub repos
raw.githubusercontent.com  # GitHub raw files
cocoapods.org              # CocoaPods specs
cdn.cocoapods.org          # CocoaPods binaries
supabase.com               # Supabase CLI/APIs
```

---

## Task Execution Priorities

### P0 (Critical Path)

1. **Complete Atomic Components** (5 remaining)
   - PixelIcon, PixelDivider, PixelBadge, PixelProgressBar, PixelCheckbox
   - Estimated: ~650 lines
   - Dependencies: None

2. **Complete Molecular Components** (10 total)
   - All 10 components documented in `molecular-components.md`
   - Estimated: ~1,200 lines
   - Dependencies: Atomic components

3. **Story 1.4 Integration**
   - Wire up ArchetypeCard to ArchetypeSelectionScreen
   - Add FormField to ProfileSetupScreen
   - Implement ProgressIndicator in onboarding flow
   - Estimated: ~200 lines
   - Dependencies: Molecular components

### P1 (High Priority)

4. **Testing Coverage**
   - Unit tests for all 15 atomic + molecular components
   - Integration tests for onboarding flow
   - Estimated: ~1,800 lines
   - Dependencies: Component implementations

5. **TypeScript Utilities**
   - Supabase type generation from schema
   - Shared utility types for component props
   - Estimated: ~500 lines
   - Dependencies: Database schema

### P2 (Medium Priority)

6. **Backend Tasks**
   - RLS policies for all tables
   - Edge function for avatar generation (Story 1.5)
   - Storage bucket policies
   - API client service layer
   - Estimated: ~750 lines
   - Dependencies: Supabase local instance

### P3 (Low Priority - Parallel Work)

7. **Documentation Generation**
   - Component API docs (auto-generated from TSDoc)
   - Design token usage guide
   - Animation cookbook
   - Accessibility compliance report
   - Estimated: ~400 lines
   - Dependencies: Component implementations

8. **Refactoring/Optimization**
   - Extract common animation patterns
   - Create custom hooks (useHapticFeedback, useFormValidation)
   - Bundle size optimization
   - Performance monitoring (React.memo, useCallback)
   - Estimated: ~570 lines
   - Dependencies: Initial implementations

---

## File Naming Conventions

```
components/atoms/PixelButton/
├── index.tsx                    # Component implementation
├── PixelButton.types.ts         # TypeScript interfaces
├── PixelButton.styles.ts        # StyleSheet (if complex)
└── __tests__/
    └── PixelButton.test.tsx     # Jest tests

screens/onboarding/
├── WelcomeScreen.tsx
├── ProfileSetupScreen.tsx
└── components/                  # Screen-specific components
    └── ProgressIndicator.tsx
```

---

## Debugging & Logging

### Development Logging

```typescript
// Use __DEV__ guard for debug logs
if (__DEV__) {
  console.log('[Component] Render:', props);
}

// Use React Native Debugger for advanced debugging
// Flipper for network inspection
```

### Production Error Tracking

```typescript
// TODO: Implement Sentry or similar
// For now, use console.error with structured logs
console.error('[Error]', {
  component: 'PixelButton',
  action: 'onPress',
  error: error.message,
});
```

---

## Performance Targets

- **60 FPS:** All animations and interactions
- **Bundle Size:** <10 MB (compressed)
- **Time to Interactive:** <3s on mid-range devices
- **Health Data Sync:** <500ms latency
- **WebView Bridge:** <50ms message passing

---

## Additional Resources

- **Design System Docs:** [docs/design-system/](docs/design-system/)
- **Story Documents:** [docs/stories/](docs/stories/)
- **Boss Character Profiles:** [docs/archive/BOSS-CHARACTER-PROFILES.md](docs/archive/BOSS-CHARACTER-PROFILES.md)
- **Implementation Roadmap:** [docs/design-system/IMPLEMENTATION-ROADMAP.md](docs/design-system/IMPLEMENTATION-ROADMAP.md)
- **React Native Docs:** https://reactnative.dev/
- **Expo Docs:** https://docs.expo.dev/
- **Supabase Docs:** https://supabase.com/docs
- **Phaser 3 Docs:** https://photonstorm.github.io/phaser3-docs/

---

## Notes for Claude Code on the Web

### What Works Well in Cloud Execution

✅ **Component Generation:** All atomic and molecular components are fully spec'd and can be implemented without device testing
✅ **Test Generation:** Test patterns established, can generate comprehensive test suites
✅ **Type Generation:** SQL schema → TypeScript types conversion
✅ **Documentation:** Auto-generate docs from code/specs
✅ **Backend Code:** Edge functions, RLS policies, API clients
✅ **Refactoring:** Extract patterns, optimize imports, DRY improvements

### What Requires Local Testing

⚠️ **Visual Verification:** Component appearance (colors, spacing, animations)
⚠️ **Device Features:** Camera, HealthKit, haptic feedback
⚠️ **Performance:** 60 FPS validation, bundle size, memory usage
⚠️ **Integration:** WebView bridge latency, Phaser game engine
⚠️ **Platform Specifics:** iOS simulator builds, Android emulator

### Batch Processing Opportunities

When generating multiple similar components:
1. Use consistent patterns from existing implementations
2. Follow atomic design principles (atoms → molecules → organisms)
3. Generate tests alongside components
4. Auto-export from barrel files (`index.ts`)

---

**Last Updated:** 2025-11-14
**Project Version:** 1.4 (Onboarding Implementation)
**Claude Code Environment:** 16BitFit-V3 - Claude Code In Web
