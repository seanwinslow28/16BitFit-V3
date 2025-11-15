# 16BitFit 21st.dev/magic Component Prompts
## Version 1.0 | Production-Ready React Native Components

This document provides optimized prompts for generating production-ready React Native components using 21st.dev/magic MCP (Model Context Protocol) integration with Cursor, WindSurf, or Cline.

---

## Table of Contents

1. [Understanding 21st.dev/magic](#understanding-21stdevmagic)
2. [Prompting Best Practices](#prompting-best-practices)
3. [Atomic Component Prompts](#atomic-component-prompts)
4. [Molecular Component Prompts](#molecular-component-prompts)
5. [Organism Component Prompts](#organism-component-prompts)
6. [Advanced Techniques](#advanced-techniques)
7. [Quality Checklist](#quality-checklist)

---

## Understanding 21st.dev/magic

### What Makes 21st.dev/magic Different

Unlike traditional AI code generation that "hallucinates" code, 21st.dev/magic uses a **curated library of professionally designed, pre-tested components**. This approach delivers:

✅ **Production-ready code** (not experimental AI slop)
✅ **Clean, maintainable structure** that follows React/React Native best practices
✅ **Type-safe TypeScript** with proper prop definitions
✅ **Professional design** with modern UI/UX patterns
✅ **Fast generation** (<100ms response times)

### How It Works

```
You describe component → Cline/Cursor sends to Magic MCP →
Magic matches to curated library → Returns clean code →
You customize/refine as needed
```

### Integration with Your IDE

**Cursor/WindSurf/Cline:**
```bash
# Install Magic MCP
npm install -g @21st-dev/magic-mcp

# Configure in your IDE settings
# Cursor: Settings > MCP Servers
# Add Magic MCP server endpoint
```

**Usage Syntax:**
```
/ui [component description]
/21 [component description]
```

---

## Prompting Best Practices

### Golden Rules (From Research)

1. **Be Extremely Specific** - Detail behaviors, animations, states
2. **Start Simple, Then Refine** - Don't aim for perfection in first prompt
3. **Break Down Complexity** - Generate smaller components, then compose
4. **Reference Design Systems** - Mention tokens, themes, style guides
5. **Describe Interactions** - Hover, press, focus, disabled states
6. **Specify Technology** - React Native, TypeScript, React Native Reanimated
7. **Iterate from Variants** - Magic generates 3-5 options, pick best and refine

### Effective Prompt Structure

```
/ui [Component Type] for [Platform] with [Specific Features]

Examples:
/ui Button component for React Native with press animation and disabled state
/ui Form input for React Native with validation and error shake animation
/ui Card component for React Native with pixel art border and shadow effect
```

### What to Include in Prompts

✅ **Component type** (button, input, card, modal)
✅ **Platform** (React Native, TypeScript)
✅ **Visual style** (retro, pixel art, Game Boy aesthetic)
✅ **Dimensions** (width, height, padding)
✅ **States** (default, hover, pressed, disabled, error, success)
✅ **Animations** (duration, easing, transform properties)
✅ **Interactions** (tap, swipe, long press, keyboard)
✅ **Accessibility** (touch targets, screen reader labels, ARIA)
✅ **Design tokens** (colors, spacing, typography from design system)

### What to Avoid

❌ Vague descriptions ("make it look cool")
❌ Trying to generate full screens at once
❌ Ignoring states (only describing default state)
❌ Skipping accessibility (touch targets, contrast, labels)
❌ Not mentioning design system (leads to generic components)

---

## Atomic Component Prompts

### 1. PixelButton (Primary)

```
/ui React Native button component for retro fitness app

Component Name: PixelButton
Platform: React Native with TypeScript
Style: Game Boy DMG aesthetic, pixel-perfect retro

Visual Specifications:
- Dimensions: minWidth 160px, height 48px
- Padding: 24px horizontal, 16px vertical
- Border: 4px solid, zero border-radius (sharp corners)
- Background: #8BAC0F (lime green)
- Text: Press Start 2P font, 16px, uppercase, #0F380F (dark green)
- Shadow: Hard pixel shadow, 4px×4px offset, #0F380F color, no blur

States:
1. Default: scale 1.0, shadow 4×4px
2. Pressed: scale 0.95, shadow 2×2px (100ms sharp easing)
3. Hover: opacity 0.9 (200ms ease-out)
4. Disabled: opacity 0.4, background #306230, pointer-events none
5. Loading: show ActivityIndicator (#0F380F), hide text

Animation:
- Press: scale(1.0 → 0.95) + shadow(4×4 → 2×2), duration 100ms, easing ease-in
- Release: scale(0.95 → 1.0) + shadow(2×2 → 4×4), duration 100ms, easing ease-out with slight overshoot
- Use React Native Animated API, enable useNativeDriver for GPU acceleration

Props Interface:
- onPress: () => void
- children: string
- variant?: 'primary' | 'secondary' | 'tertiary'
- disabled?: boolean
- loading?: boolean
- fullWidth?: boolean
- haptic?: boolean (triggers medium vibration on press)

Accessibility:
- accessibilityRole: 'button'
- accessibilityLabel: descriptive label
- accessibilityHint: result of action
- Minimum touch target: 48×48px (add transparent padding if needed)

Export as: src/components/atoms/PixelButton.tsx
```

---

### 2. PixelText (Typography Wrapper)

```
/ui React Native text wrapper component for design system enforcement

Component Name: PixelText
Platform: React Native with TypeScript

Purpose: Enforce typography system across app, prevent arbitrary font usage

Variants:
- h1: Press Start 2P, 32px, line-height 1.4, uppercase, #9BBC0F
- h2: Press Start 2P, 24px, line-height 1.4, uppercase, #9BBC0F
- h3: Press Start 2P, 16px, line-height 1.4, uppercase, #9BBC0F
- body: Montserrat, 16px, line-height 1.5, #9BBC0F
- bodyLarge: Montserrat, 18px, line-height 1.5, #9BBC0F
- bodySmall: Montserrat, 14px, line-height 1.5, #8BAC0F
- caption: Montserrat, 12px, line-height 1.375, #306230
- label: Montserrat SemiBold, 14px, line-height 1.375, #9BBC0F

Props Interface:
- variant: 'h1' | 'h2' | 'h3' | 'body' | 'bodyLarge' | 'bodySmall' | 'caption' | 'label'
- color?: string (optional override)
- align?: 'left' | 'center' | 'right'
- numberOfLines?: number
- children: React.ReactNode
- style?: TextStyle (for additional custom styles)

Implementation:
- Import typography tokens from design system
- Map variant prop to corresponding style object
- Merge with optional overrides
- Pass all other props to React Native Text component

Accessibility:
- Preserve default Text accessibility
- Allow accessibilityLabel override
- Support Dynamic Type on iOS (scale fonts based on user settings)

Export as: src/components/atoms/PixelText.tsx
```

---

### 3. PixelInput (Form Field)

```
/ui React Native text input with retro terminal styling and validation states

Component Name: PixelInput
Platform: React Native with TypeScript
Style: Retro terminal, pixel-perfect, Game Boy aesthetic

Visual Specifications:
- Height: 48px minimum
- Padding: 16px horizontal, 16px vertical
- Border: 3px solid (default), 4px (focused), zero border-radius
- Background: #0F380F (dark green - screen background)
- Text: Montserrat, 16px, #9BBC0F
- Placeholder: Montserrat, 16px, #306230, 60% opacity

States:
1. Default: border 3px #306230
2. Focused: border 4px #00D0FF (cyan), subtle glow (0 0 8px rgba(0,208,255,0.3))
3. Error: border 3px #FF4757 (red)
4. Success: border 3px #2ED573 (green)
5. Disabled: border 3px #306230, background #1A2818, opacity 0.5

Error Shake Animation (on validation fail):
- translateX keyframes: 0 → -10 → 10 → -10 → 10 → -5 → 5 → 0
- Duration: 500ms (7 keyframes, ~71ms each)
- Easing: ease-in-out
- Trigger: when error prop changes from false to true
- Use React Native Reanimated useSharedValue and withSequence

Props Interface:
- value: string
- onChangeText: (text: string) => void
- onFocus?: (e: any) => void
- onBlur?: (e: any) => void
- placeholder?: string
- error?: boolean
- errorText?: string
- success?: boolean
- successText?: string
- helperText?: string
- disabled?: boolean
- secureTextEntry?: boolean
- autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
- keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
- maxLength?: number

Accessibility:
- accessibilityLabel for label
- accessibilityHint for helper text
- accessibilityState: { disabled: boolean }
- Error messages announced via screen reader

Export as: src/components/atoms/PixelInput.tsx
```

---

### 4. PixelSprite (Image Container)

```
/ui React Native image component for pixel art rendering with crisp edges

Component Name: PixelSprite
Platform: React Native with TypeScript

Purpose: Display pixel art sprites with nearest-neighbor scaling (no anti-aliasing blur)

Visual Specifications:
- Always square dimensions (size × size)
- No interpolation/smoothing - crisp pixel rendering
- Optional pixel-perfect border (3px solid)
- Optional background for transparency

Size Variants:
- tiny: 16×16px
- small: 24×24px
- medium: 32×32px (default)
- large: 48×48px
- xl: 64×64px
- xxl: 80×80px (archetype avatars)
- hero: 96×96px (logos)

Props Interface:
- source: ImageSourcePropType (require() or uri)
- size?: 16 | 24 | 32 | 48 | 64 | 80 | 96
- bordered?: boolean
- borderColor?: string
- style?: ImageStyle

Implementation:
- Use React Native Image component
- Set resizeMode: 'pixelated' (iOS) or 'contain' (Android fallback)
- For web: imageRendering: 'pixelated' CSS property
- Ensure width and height are exact (no aspect ratio calculation)

Asset Requirements Note:
- Source images must be PNG-8 format
- Exported at @1x, @2x, @3x resolutions
- No anti-aliasing in export settings
- File size target: <30KB per sprite

Export as: src/components/atoms/PixelSprite.tsx
```

---

### 5. PixelProgressBar (Health Bar Style)

```
/ui React Native progress bar with retro 8-bit health meter aesthetic

Component Name: PixelProgressBar
Platform: React Native with TypeScript
Style: Chunky retro health/XP bar, Game Boy aesthetic

Visual Specifications:
- Height: 20-24px (chunky, visible)
- Width: 100% (responsive)
- Border: 3px solid #306230
- Background: #0F380F (empty state)
- Fill: #8BAC0F (progress color)
- Zero border-radius (sharp corners)

Variants:
1. Solid fill: Single color fills left-to-right
2. Segmented: 8 discrete segments with 2px gaps (classic game health bar)

Animation:
- Fill animates width from 0% to target percentage
- Duration: 500ms
- Easing: ease-out
- Use React Native Animated.timing with useNativeDriver: false (width doesn't support native)

Props Interface:
- progress: number (0 to 100)
- height?: number (default 24)
- color?: string (fill color, default #8BAC0F)
- backgroundColor?: string (empty color, default #0F380F)
- animated?: boolean (default true)
- segmented?: boolean (default false)
- segments?: number (default 8, only if segmented)

Accessibility:
- accessibilityRole: 'progressbar'
- accessibilityValue: { min: 0, max: 100, now: progress }
- accessibilityLabel: descriptive label (e.g., "Health: 75%")

Export as: src/components/atoms/PixelProgressBar.tsx
```

---

## Molecular Component Prompts

### 6. ArchetypeCard (Selectable Card)

```
/ui React Native selectable card component for fitness archetype selection

Component Name: ArchetypeCard
Platform: React Native with TypeScript, React Native Reanimated 2
Style: Retro pixel art card with selection states

Visual Specifications:
- Dimensions: 160×200px fixed (grid layout)
- Padding: 16px internal
- Border: 3px solid #306230 (default), 4px #8BAC0F (selected), zero border-radius
- Background: #306230 (elevated surface)
- Layout: Vertical flex, center-aligned, 12px gap between elements

Content Structure:
1. Avatar: 80×80px PixelSprite component (top, centered)
2. Name: Press Start 2P, 16px, uppercase, #9BBC0F, center-aligned, 1 line
3. Description: Montserrat, 12px, #8BAC0F, center-aligned, 2 lines max, line-height 1.5

States & Animations:
1. Default: scale 1.0, border 3px #306230, no shadow
2. Selected:
   - scale 1.05 (spring easing, 200ms)
   - border 4px #8BAC0F
   - shadow: 0 0 12px rgba(139,172,15,0.6) (neon glow)
   - elevation: 8 (Android)
3. Pressed: scale 0.98 (100ms, brief feedback)

Selection Animation:
- When selecting new card while another is selected:
  - Previous: scale 1.05→1.0, border 4px→3px, shadow fade out (150ms)
  - New: scale 1.0→1.05, border 3px→4px, shadow fade in (200ms spring)
  - Both animations run in parallel
- Haptic: medium vibration on selection

Props Interface:
- id: string
- name: string
- description: string
- avatarSource: ImageSourcePropType
- selected: boolean
- onSelect: (id: string) => void

Accessibility:
- accessibilityRole: 'button'
- accessibilityLabel: `Select ${name} archetype`
- accessibilityHint: description
- accessibilityState: { selected: boolean }
- Minimum 160×200px touch area (entire card tappable)

Export as: src/components/molecules/ArchetypeCard.tsx
```

---

### 7. FormField (Complete Form Input)

```
/ui React Native complete form field with label, input, validation, and error states

Component Name: FormField
Platform: React Native with TypeScript
Composition: Label + PixelInput + Helper/Error Text

Visual Structure (vertical stack, 8px gaps):
1. Label (optional)
   - Montserrat SemiBold, 14px, #9BBC0F
   - Required asterisk (*) in #FF4757 if required prop true
   - 8px margin below

2. Input Container (relative positioning)
   - PixelInput component (48px height)
   - Optional success icon: 20×20px checkmark, positioned absolute right 16px

3. Helper/Error/Success Text (conditional)
   - Montserrat, 12px, 8px margin above
   - Default helper: #8BAC0F
   - Error text: #FF4757
   - Success text: #2ED573

Validation Flow:
1. Real-time validation: validate prop is function that runs on blur
2. Error state: trigger shake animation + show error text
3. Success state: show checkmark icon + success text
4. Haptic feedback: error vibration on shake, light tick on success

Props Interface:
- label: string
- value: string
- onChangeText: (text: string) => void
- onBlur?: () => void
- placeholder?: string
- helperText?: string
- errorText?: string
- successText?: string
- error?: boolean
- success?: boolean
- required?: boolean
- validate?: (value: string) => { valid: boolean; message?: string }
- secureTextEntry?: boolean
- autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
- keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
- maxLength?: number

Behavior:
- Touched state: track whether user has interacted with field
- Validation runs on blur (not on every keystroke to avoid annoyance)
- Error cleared when user starts typing again
- Success state persists until field is unfocused

Export as: src/components/molecules/FormField.tsx
```

---

### 8. ProgressIndicator (Step Dots)

```
/ui React Native step progress indicator with dots and label

Component Name: ProgressIndicator
Platform: React Native with TypeScript
Style: Simple, clear, retro-minimal

Visual Specifications:
- Layout: Horizontal row, centered, with label below
- Dots: Square (0 border-radius) or circular (optional)
- Gap: 12px between dots
- Label: "Step X of Y" below dots, Montserrat 12px, #8BAC0F

Dot States:
1. Inactive: 12×12px, #306230 background, 40% opacity
2. Active/Completed: 16×16px (slightly larger), #8BAC0F background, 100% opacity
3. Current: 16×16px, #8BAC0F, with subtle pulse animation (optional)

Animation (optional):
- When currentStep changes, new active dot scales in: 0.8→1.0 (200ms spring)
- Label fades: opacity 0.5→1.0 (150ms)

Props Interface:
- totalSteps: number
- currentStep: number (1-indexed)
- showLabel?: boolean (default true)
- dotShape?: 'square' | 'circle' (default 'square')
- style?: ViewStyle

Accessibility:
- accessibilityRole: 'progressbar'
- accessibilityLabel: `Step ${currentStep} of ${totalSteps}`
- accessibilityValue: { min: 1, max: totalSteps, now: currentStep }

Export as: src/components/molecules/ProgressIndicator.tsx
```

---

### 9. ToastNotification (Temporary Message)

```
/ui React Native toast notification component with slide-in animation

Component Name: ToastNotification
Platform: React Native with TypeScript, React Native Reanimated 2
Style: Retro message overlay with pixel borders

Visual Specifications:
- Position: Absolute, top 60px (below status bar + margin)
- Width: Screen width - 48px (24px margins each side)
- Min-height: 64px
- Padding: 16px horizontal, 12px vertical
- Border: 3px solid (color varies by variant)
- Background: #306230 (elevated)
- Layout: Horizontal row, 12px gap, center-aligned

Content Structure:
1. Icon: 20×20px (left side)
   - Success: checkmark icon, #2ED573
   - Error: X icon, #FF4757
   - Warning: ! icon, #FFA502
   - Info: i icon, #00D0FF

2. Message: Montserrat Medium, 14px, #9BBC0F, flex: 1, up to 2 lines

Variants (border colors):
- success: #2ED573
- error: #FF4757
- warning: #FFA502
- info: #00D0FF

Animation:
- Entry: translateY(-100 → 0), opacity(0 → 1), duration 300ms spring easing
- Exit: translateY(0 → -100), opacity(1 → 0), duration 200ms ease-in
- Auto-dismiss: after duration prop (default 3000ms)

Props Interface:
- message: string
- variant?: 'success' | 'error' | 'warning' | 'info' (default 'info')
- duration?: number (milliseconds, default 3000)
- visible: boolean
- onDismiss?: () => void

Implementation:
- Use React Native Reanimated useSharedValue for translateY and opacity
- withSpring for entry, withTiming for exit
- Use useEffect to trigger auto-dismiss timeout
- Render in Portal (react-native-paper) or at root level for proper z-index

Accessibility:
- accessibilityLiveRegion: 'polite' (announces to screen readers)
- accessibilityRole: 'alert'

Export as: src/components/molecules/ToastNotification.tsx
```

---

## Organism Component Prompts

### 10. WelcomeScreen (Full Screen Layout)

```
/ui React Native welcome screen for onboarding flow with staggered animations

Component Name: WelcomeScreen
Platform: React Native with TypeScript, React Native Reanimated 2
Viewport: iPhone 14 Pro (393×852pt), safe areas top 59pt, bottom 34pt

Layout Structure (SafeAreaView + View, flex: 1):

TOP SECTION (absolute, top 79pt from screen top):
- ProgressIndicator component: ● ○ ○ "Step 1 of 3"
- zIndex: 10

LOGO SECTION (flex: 0.6, centered, justify: 'center'):
- 80pt spacer from top
- PixelSprite: 96×96px logo
- 24pt gap
- PixelText h1: "16BITFIT" (32px, Press Start 2P)
- 16pt gap
- PixelText bodyLarge: Tagline (18px, Montserrat, max-width 300px, 2 lines, centered)

CTA SECTION (flex: 0.4, justify: 'flex-end', align: 'center', bottom padding 40pt):
- PixelButton primary: "GET STARTED" (full width 321px)
- 16pt gap
- PixelButton tertiary: "I already have an account" (auto width)

Background: #9BBC0F (solid color, full screen)

Staggered Entrance Animation (on mount):
1. Logo (delay 0ms): opacity 0→1, scale 0.9→1.0, duration 400ms, easing ease-out
2. Tagline (delay 200ms): opacity 0→1, translateY 20→0, duration 300ms, easing ease-out
3. CTA (delay 400ms): opacity 0→1, scale 0.95→1.0, duration 300ms, easing spring (slight overshoot)

Use React Native Reanimated:
- useSharedValue for each animated property
- withDelay for stagger timing
- withTiming for logo/tagline
- withSpring for CTA (bouncy entrance)

Props Interface:
- onGetStarted: () => void
- onSignIn?: () => void

Navigation Integration:
- Use React Navigation Stack
- Exit animation: slide left 300ms when navigating to ProfileSetupScreen

Accessibility:
- Announce screen to screen readers: "Welcome to 16BitFit, Step 1 of 3"
- All buttons have proper labels and hints
- Touch targets ≥48px

Export as: src/screens/onboarding/WelcomeScreen.tsx
```

---

### 11. ProfileSetupScreen (Form Screen with Keyboard Handling)

```
/ui React Native profile setup screen with form validation and sticky CTA

Component Name: ProfileSetupScreen
Platform: React Native with TypeScript, KeyboardAvoidingView
Viewport: 393×852pt, safe areas, keyboard height 291pt

Layout Structure:
- SafeAreaView (flex: 1, background #0F380F)
- KeyboardAvoidingView (behavior: 'padding' iOS, 'height' Android)

TOP SECTION (absolute, top 79pt):
- ProgressIndicator: ● ● ○ "Step 2 of 3"

SCROLLABLE CONTENT (ScrollView, padding bottom 180pt for sticky CTA):
- Content starts 139pt from top (below progress)
- Header (108pt tall):
  - PixelText h2: "CREATE PROFILE" (24px, centered)
  - 12pt gap
  - PixelText body: Subtitle (16px, centered, max-width 280px)
- 32pt gap
- Form Section:
  - FormField: Username (required, validation)
    - validate: 3-20 chars, alphanumeric + underscore
    - error shake on invalid
  - 24pt gap
  - FormField: Display Name (optional)
    - helper text: "This is how others will see you"

STICKY CTA SECTION (absolute, bottom 34pt, 144pt tall):
- Border top: 3px #306230
- Background: #9BBC0F
- Padding: 24pt top, 40pt bottom, 24pt horizontal
- PixelButton primary: "CREATE ACCOUNT" (full width, disabled until valid)
  - loading state: show spinner, text hidden
- 12pt gap
- PixelButton tertiary: "Skip for now"

Keyboard Behavior:
- When keyboard shows: scroll active input into view
- Maintain sticky CTA visibility (always above keyboard)
- Dismiss keyboard: tap outside inputs or "Done" key

Form State Management:
- Track: username, displayName, usernameValid, usernameTouched, loading
- Real-time validation: on blur, check username against rules
- Error handling: show error toast on API failure (username taken)
- Success: navigate to ArchetypeSelectionScreen with slide-left animation

Props Interface:
- onContinue: (data: { username: string; displayName?: string }) => void
- onSkip: () => void
- onBack?: () => void

Accessibility:
- Form labels associated with inputs
- Error messages announced dynamically
- Tab order: progress → username → display name → create → skip

Export as: src/screens/onboarding/ProfileSetupScreen.tsx
```

---

### 12. ArchetypeSelectionScreen (Grid Layout with Staggered Cards)

```
/ui React Native archetype selection screen with 5 selectable cards in grid

Component Name: ArchetypeSelectionScreen
Platform: React Native with TypeScript, React Native Reanimated 2
Viewport: 393×852pt, safe areas

Layout Structure:
- SafeAreaView (flex: 1, background #0F380F)

TOP SECTION (absolute, top 79pt):
- ProgressIndicator: ● ● ● "Step 3 of 3"

SCROLLABLE CONTENT (ScrollView, padding bottom 100pt):
- Content starts 139pt from top
- Header (108pt tall):
  - PixelText h2: "SELECT ARCHETYPE" (24px, centered)
  - 12pt gap
  - PixelText body: Subtitle (16px, centered, max-width 300px)
- 32pt gap
- Grid Section (279pt from top):
  - Layout: 2-column grid, 16px gap
  - Width: 345px (screen width - 48px margins)
  - Card dimensions: 164.5×200px each
  - 5 ArchetypeCard components:
    Row 1: [Trainer] [Runner]
    Row 2: [Yoga] [Bodybuilder]
    Row 3: [Cyclist] (centered)

STICKY CTA SECTION (absolute, bottom 34pt, 104pt tall):
- Border top: 3px #306230
- Background: #9BBC0F
- Padding: 24pt top, 40pt bottom, 24pt horizontal
- PixelButton primary: "CONTINUE" (full width, disabled until selection)

Staggered Card Entrance (on mount):
- Each card: opacity 0→1, translateY 30→0, duration 250ms, ease-out
- Stagger delay: 50ms increment (card1: 0ms, card2: 50ms, card3: 100ms, etc.)
- Total animation: ~450ms

Selection Behavior:
- Track selectedArchetype state (string | null)
- When card tapped:
  - Deselect previous (if any): scale 1.05→1.0, border 4→3px (150ms)
  - Select new: scale 1.0→1.05, border 3→4px, shadow appear (200ms spring)
  - Medium haptic vibration
  - Show toast: "[Name] selected!" (2s, success variant)
- Continue button enabled only when selection made

Archetype Data (hardcoded or prop):
- Trainer: "Balanced fitness with variety of exercises"
- Runner: "Built for endurance and speed"
- Yoga: "Focus on flexibility and mindfulness"
- Bodybuilder: "Strength and muscle building focus"
- Cyclist: "Cardio and leg strength specialist"

Props Interface:
- onContinue: (archetypeId: string) => void
- onBack?: () => void

Implementation Notes:
- Use React Native Reanimated for card animations
- Grid: flexDirection 'row', flexWrap 'wrap', justifyContent 'space-between'
- Cards should be ArchetypeCard components (import from molecules)

Accessibility:
- Each card announces: "Select [name] archetype, [description]"
- Grid announced as "5 archetype options"
- Continue button state changes announced

Export as: src/screens/onboarding/ArchetypeSelectionScreen.tsx
```

---

## Advanced Techniques

### Technique 1: Generate Variants, Then Refine

```
// First prompt: Generate 3 variants
/ui Generate 3 variants of a retro pixel art button for React Native:
Variant 1: Classic DMG green (#8BAC0F)
Variant 2: Neon cyan (#00D0FF) with glow
Variant 3: Sepia retro browns (#D4A574)

// Review generated options, pick best

// Second prompt: Refine chosen variant
/ui Take Variant 2 (neon cyan button) and refine:
- Add neon glow shadow: 0 0 10px rgba(0,208,255,0.6)
- Enhance press animation with slight rotation: rotateZ(1deg)
- Add pulse animation on idle: scale 1.0→1.02→1.0 (2s loop)
```

### Technique 2: Break Complex Components into Parts

```
// Don't generate full screen at once - build incrementally

// Step 1: Generate layout shell
/ui React Native screen layout shell with header, scrollable content, sticky footer

// Step 2: Generate header component separately
/ui React Native header component with back button, title, action button

// Step 3: Generate content components
/ui React Native form section with 2 inputs stacked vertically

// Step 4: Generate sticky footer
/ui React Native sticky footer with primary button and secondary link

// Step 5: Compose into full screen using generated parts
```

### Technique 3: Reference Design System Tokens

```
/ui React Native card component using 16BitFit design tokens:

Colors from design system:
- Background: tokens.background.elevated (#306230)
- Border: tokens.border.default (#306230), tokens.border.highlight (#8BAC0F)
- Text primary: tokens.text.primary (#9BBC0F)
- Text secondary: tokens.text.secondary (#8BAC0F)

Typography from design system:
- Title: typography.h3 (Press Start 2P, 16px)
- Description: typography.bodySmall (Montserrat, 12px)

Spacing from design system:
- Padding: tokens.spacing[2] (16px)
- Gap: tokens.spacing[1.5] (12px)
- Margin bottom: tokens.spacing[3] (24px)

Generate component that imports these tokens from '@/design-system' and uses them instead of hardcoded values.
```

### Technique 4: Iterate with "Remix with AI"

After Magic generates a component, you can refine it:

```
// First generation
/ui React Native progress bar with retro aesthetic

// After reviewing, remix
Remix this component with changes:
- Change height from 16px to 24px (chunkier)
- Add segmented variant with 8 discrete blocks
- Animate segments filling one-by-one (staggered, 50ms delay each)
- Add border: 3px solid #306230
```

### Technique 5: Specify Exact Animation Specs

Use technical animation language for precision:

```
/ui React Native button with precise press animation:

Press animation (mousedown/touchstart):
- Property: transform
- Keyframe: scale(1.0 → 0.95)
- Duration: 100ms
- Easing: cubic-bezier(0.4, 0, 1, 1) [ease-in]
- Simultaneous: box-shadow 4px 4px → 2px 2px

Release animation (mouseup/touchend):
- Keyframe: scale(0.95 → 1.0)
- Duration: 100ms
- Easing: cubic-bezier(0.175, 0.885, 0.32, 1.275) [bounce overshoot]
- Simultaneous: box-shadow 2px 2px → 4px 4px

Use React Native Animated API with useNativeDriver: true for GPU acceleration.
```

---

## Quality Checklist

Before considering a component "done", verify:

### Code Quality ✅
- [ ] TypeScript: Proper prop types defined with interface/type
- [ ] Imports: All design tokens imported from design system
- [ ] Comments: Inline comments for complex logic
- [ ] Naming: Clear, descriptive variable and function names
- [ ] File structure: Follows atomic design pattern (atoms/molecules/organisms)
- [ ] Exports: Clean default export with named prop interface

### Visual Quality ✅
- [ ] Styling: Uses design system tokens (not hardcoded values)
- [ ] Spacing: Follows 8px grid system
- [ ] Typography: Uses design system font scale
- [ ] Colors: Uses semantic color tokens from theme
- [ ] Borders: Retro aesthetic (zero border-radius, pixel shadows)
- [ ] Responsive: Adapts to different screen sizes

### Interaction Quality ✅
- [ ] States: Defined for default, hover, pressed, disabled, error, success
- [ ] Animations: Smooth 60fps, use native driver where possible
- [ ] Haptics: Appropriate vibration feedback on interactions
- [ ] Transitions: Proper duration and easing for each state change
- [ ] Loading: Loading states show spinner, disable interactions

### Accessibility Quality ✅
- [ ] Touch targets: Minimum 48×48px (add transparent padding if needed)
- [ ] Labels: accessibilityLabel describes purpose
- [ ] Hints: accessibilityHint explains result of action
- [ ] Roles: Correct accessibilityRole (button, text, image, etc.)
- [ ] States: accessibilityState reflects current state
- [ ] Contrast: Text/background meets 4.5:1 minimum (WCAG AA)
- [ ] Screen readers: Content announced properly, live regions for dynamic content

### Performance Quality ✅
- [ ] Animations: Use useNativeDriver: true (transform/opacity only)
- [ ] Optimization: will-change specified for animated properties
- [ ] Memory: Cleanup animations on unmount (useEffect return)
- [ ] Assets: Images optimized (<30KB sprites, proper resolution)
- [ ] Re-renders: React.memo for components that don't need frequent updates

---

## Common Pitfalls & Fixes

### Pitfall 1: Generic, Un-Styled Components

**Problem:** Magic generates component but it doesn't match 16BitFit aesthetic

**Fix:**
```
// Add to prompt
Apply 16BitFit retro Game Boy aesthetic:
- Zero border-radius (sharp corners, no rounded edges)
- DMG color palette (#0F380F, #306230, #8BAC0F, #9BBC0F)
- Pixel-perfect borders (3px solid)
- Hard pixel shadows (4×4px offset, no blur)
- Press Start 2P font for headers, Montserrat for body
```

### Pitfall 2: Missing Animation Details

**Problem:** Component has states but no smooth transitions

**Fix:**
```
// Add animation specs
Animate state transitions:
- Default → Pressed: 100ms ease-in, scale 1.0→0.95
- Pressed → Default: 100ms ease-out with overshoot, scale 0.95→1.0
- Default → Disabled: 200ms ease-out, opacity 1.0→0.4
Use React Native Animated API, enable useNativeDriver for GPU acceleration
```

### Pitfall 3: Inaccessible Components

**Problem:** Component works visually but fails accessibility

**Fix:**
```
// Add accessibility requirements
Accessibility requirements:
- Minimum touch target: 48×48px (add transparent padding if visual is smaller)
- accessibilityRole: 'button' (or appropriate role)
- accessibilityLabel: '[Descriptive action]'
- accessibilityHint: '[Result of action]'
- accessibilityState: { disabled: boolean }
- Keyboard support: Enter/Space triggers action
- Screen reader: Announces state changes via accessibilityLiveRegion
```

### Pitfall 4: Poor Animation Performance

**Problem:** Animations stutter, drop frames, feel janky

**Fix:**
```
// Specify performance optimizations
Performance requirements:
- Use React Native Animated API with useNativeDriver: true
- Only animate transform and opacity (GPU accelerated)
- Avoid animating width, height, backgroundColor (CPU bound)
- Specify will-change: 'transform, opacity'
- Target 60fps (16.67ms per frame)
- Cleanup animations on unmount to prevent memory leaks
```

### Pitfall 5: Hardcoded Values Instead of Tokens

**Problem:** Component works but breaks design system consistency

**Fix:**
```
// Specify token usage
Import design tokens from '@/design-system/tokens':
- Colors: tokens.background.primary, tokens.text.primary, etc.
- Typography: typography.h1, typography.body, etc.
- Spacing: tokens.spacing[1] (8px), tokens.spacing[2] (16px), etc.
- Borders: tokens.borderWidth.default (3px), tokens.borderRadius.none (0)

Do NOT hardcode values like #8BAC0F or 16px - always reference tokens.
```

---

## Integration with Development Workflow

### Step 1: Generate Component

```bash
# In Cursor/WindSurf/Cline, use /ui command
/ui [component prompt from this document]
```

### Step 2: Review Generated Code

- Check TypeScript interfaces
- Verify design token usage
- Confirm animation implementations
- Test accessibility props

### Step 3: Refine if Needed

```bash
# Use "Remix with AI" or refine prompt
Remix this component to add [specific improvement]
```

### Step 4: Test in Isolation

```tsx
// Create Storybook story or test screen
import { PixelButton } from '@/components/atoms';

export default function TestScreen() {
  return (
    <View style={{ padding: 24 }}>
      <PixelButton onPress={() => console.log('pressed')}>
        TEST BUTTON
      </PixelButton>
    </View>
  );
}
```

### Step 5: Integrate into Screen

```tsx
// Import and use in actual screen
import { PixelButton } from '@/components/atoms';

export function WelcomeScreen() {
  return (
    <SafeAreaView>
      <PixelButton onPress={handleGetStarted}>
        GET STARTED
      </PixelButton>
    </SafeAreaView>
  );
}
```

### Step 6: Test on Device

- Run on iOS Simulator
- Run on Android Emulator
- Test on physical devices
- Validate animations run at 60fps
- Confirm haptic feedback works
- Test with VoiceOver/TalkBack

---

## Next Steps After Component Generation

1. **Save to Component Library** - Document in Storybook or similar
2. **Write Unit Tests** - Jest + React Native Testing Library
3. **Document Usage** - Add JSDoc comments, usage examples
4. **Performance Test** - Profile with React DevTools, ensure 60fps
5. **Accessibility Audit** - Test with screen readers, contrast checkers
6. **Code Review** - Team review for consistency, best practices
7. **Integrate** - Use in actual screens, gather feedback, iterate

---

## Version History

- **v1.0** (2025-10-31): Initial 21st.dev/magic prompt library - Complete component collection for Story 1.4, atomic through organism patterns, advanced techniques, quality checklist, common pitfalls and fixes.

---

**Document Owner:** UI/UX Specialist (Sally)
**Approved By:** Architect (Pending)
**Last Updated:** 2025-10-31
