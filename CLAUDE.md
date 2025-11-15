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

### Color Palette (DMG Game Boy LCD)

**All components MUST use these exact 4 colors:**

```typescript
// From apps/mobile-shell/src/design-system/tokens.ts
export const colors = {
  dmg: {
    darkest: '#0F380F',   // Darkest green (shadows, text)
    dark: '#306230',      // Dark green (borders, outlines)
    light: '#8BAC0F',     // Light green (highlights, active states)
    lightest: '#9BBC0F',  // Lightest green (backgrounds, base)
  },
};
```

**Usage Rules:**
- Background: `lightest` (#9BBC0F)
- Text: `darkest` (#0F380F)
- Borders: `dark` (#306230)
- Highlights/Active: `light` (#8BAC0F)

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

### 1. Atomic Components (PRIORITY)

**Status:** 5 implemented, 5 remaining

**Implemented:**
- ✅ [PixelButton](apps/mobile-shell/src/components/atoms/PixelButton/index.tsx)
- ✅ [PixelText](apps/mobile-shell/src/components/atoms/PixelText/index.tsx)
- ✅ [PixelInput](apps/mobile-shell/src/components/atoms/PixelInput/index.tsx)
- ✅ [PixelSprite](apps/mobile-shell/src/components/atoms/PixelSprite/index.tsx)
- ✅ [PixelBorder](apps/mobile-shell/src/components/atoms/PixelBorder/index.tsx)

**To Implement:**
- ⏳ PixelIcon (SVG icons, 16/20/24/32px)
- ⏳ PixelDivider (Horizontal separator, 2/3/4px thickness)
- ⏳ PixelBadge (Notification badges with count)
- ⏳ PixelProgressBar (SF2-style health bars)
- ⏳ PixelCheckbox (Toggle with bounce animation)

**Full specs:** [docs/design-system/atomic-components.md](docs/design-system/atomic-components.md)

### 2. Molecular Components (PRIORITY)

**Status:** 0 implemented, 10 documented

**To Implement:**
- ⏳ ArchetypeCard (160x200px selection card with sprite)
- ⏳ FormField (Label + Input + Validation + Error)
- ⏳ ProgressIndicator (Step dots: "Step X of Y")
- ⏳ ToastNotification (Slide-in alerts)
- ⏳ ProfileHeader (Avatar + Username + Metadata)
- ⏳ StatBar (Labeled progress: "Strength 75/100")
- ⏳ ActionSheet (Bottom sheet modal)
- ⏳ EmptyState (Icon + Title + Description + CTA)
- ⏳ LoadingSpinner (Rotating pixel icon)
- ⏳ ConfirmDialog (Confirmation modal)

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
