# 16BitFit Screen Specifications
## Version 1.0 | Story 1.4 Pixel-Perfect Specs

This document provides detailed pixel-perfect specifications for all three onboarding screens in Story 1.4, including measurements, spacing, typography, colors, and asset requirements.

---

## Design Grid System

### Base Grid
- **Column Grid:** 24px margins, 16px gutters
- **Row Grid:** 8px baseline grid (vertical rhythm)
- **Safe Areas:**
  - Top: 44px (status bar) + 20px padding = 64px
  - Bottom: 34px (home indicator) + 40px padding = 74px

### Device Targets
```javascript
devices: {
  primary: {
    name: 'iPhone 14 Pro',
    screen: '393×852pt',
    safeArea: { top: 59, bottom: 34 },
  },
  secondary: {
    name: 'iPhone SE (3rd gen)',
    screen: '375×667pt',
    safeArea: { top: 20, bottom: 0 },
  },
  tablet: {
    name: 'iPad Air',
    screen: '820×1180pt',
    safeArea: { top: 24, bottom: 20 },
  },
}
```

---

## Screen 1: WelcomeScreen

### Viewport
- **Device:** iPhone 14 Pro (393×852pt)
- **Safe Area:** Top 59pt, Bottom 34pt
- **Usable Height:** 759pt (852 - 59 - 34)

### Layout Structure

```
┌─────────────────────────────────────┐  ← 0pt (top edge)
│                                     │
│         Status Bar (59pt)           │  ← System UI
│                                     │
├─────────────────────────────────────┤  ← 59pt
│                                     │
│          Progress (20pt)            │  ← 59-79pt
│         ● ○ ○ Step 1 of 3           │
│                                     │
├─────────────────────────────────────┤  ← 79pt
│                                     │
│                                     │
│        [Spacer: 80pt]               │  ← Breathing room
│                                     │
├─────────────────────────────────────┤  ← 159pt
│                                     │
│     [Logo Section - 400pt tall]     │
│                                     │
│     [Logo: 96×96pt]                 │  ← 159-255pt
│         ↓ 24pt gap                  │
│     [Title: 16BITFIT]               │  ← 279-324pt (32pt tall + line height)
│         ↓ 16pt gap                  │
│     [Tagline: 2 lines]              │  ← 340-394pt (54pt = 18×1.5×2)
│                                     │
├─────────────────────────────────────┤  ← 559pt
│                                     │
│        [Spacer: flex]               │  ← Push CTA to bottom
│                                     │
├─────────────────────────────────────┤  ← ~630pt (flexible)
│                                     │
│     [CTA Section - 144pt tall]      │
│                                     │
│     [Primary Button: 48pt]          │  ← 630-678pt
│         ↓ 16pt gap                  │
│     [Secondary Link: 44pt]          │  ← 694-738pt
│         ↓ 40pt bottom padding       │
│                                     │
├─────────────────────────────────────┤  ← 778pt
│                                     │
│      Home Indicator (34pt)          │  ← System UI
│                                     │
└─────────────────────────────────────┘  ← 852pt (bottom edge)
```

### Component Specifications

#### Progress Indicator
```javascript
progressIndicator: {
  position: { x: 'center', y: 59 + 20 },  // 79pt from top
  width: 'intrinsic',  // ~120pt
  height: 32,

  dots: {
    size: 12,
    gap: 12,
    activeDot: {
      width: 16,  // Slightly larger
      height: 16,
      backgroundColor: tokens.interactive.primary,  // #8BAC0F or #00D0FF
    },
    inactiveDot: {
      width: 12,
      height: 12,
      backgroundColor: tokens.border.default,  // #306230 or #3D4E7A
      opacity: 0.4,
    },
  },

  label: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Montserrat',
    color: tokens.text.secondary,
  },
}
```

#### Logo
```javascript
logo: {
  position: { x: 'center', y: 159 },
  size: 96,  // 96×96pt
  source: require('@/assets/logo-96.png'),

  // Asset requirements
  asset: {
    format: 'PNG-8',
    dimensions: '96×96pt (@1x), 192×192pt (@2x), 288×288pt (@3x)',
    colorDepth: 8,
    fileSize: '<50KB',
  },
}
```

#### Title
```javascript
title: {
  position: { x: 24, y: 279 },  // 24pt margins
  width: 393 - 48,  // Full width minus margins (345pt)

  text: '16BITFIT',
  fontFamily: 'Press Start 2P',
  fontSize: 32,
  lineHeight: 44.8,  // 32 × 1.4
  letterSpacing: 0,
  textTransform: 'uppercase',
  textAlign: 'center',
  color: tokens.text.primary,  // #9BBC0F or #FFFFFF

  // Actual rendered height: ~45pt (single line with line height)
}
```

#### Tagline
```javascript
tagline: {
  position: { x: 46, y: 340 },  // Centered with 22pt extra side margin
  width: 301,  // Constrained to 300pt for readability
  maxWidth: 300,

  text: 'Your fitness journey starts here. Level up your health, one step at a time.',
  fontFamily: 'Montserrat',
  fontSize: 18,
  lineHeight: 27,  // 18 × 1.5
  letterSpacing: 0,
  textAlign: 'center',
  color: tokens.text.secondary,  // #8BAC0F or #B8C5E0
  numberOfLines: 2,

  // Actual rendered height: ~54pt (2 lines)
}
```

#### Primary CTA Button
```javascript
primaryButton: {
  position: { x: 36, y: 630 },  // 36pt side margins (tighter than screen margins)
  width: 321,  // 393 - 72
  height: 48,

  // Border
  borderWidth: 4,
  borderRadius: 0,
  borderColor: tokens.interactive.primary,

  // Background
  backgroundColor: tokens.interactive.primary,

  // Text
  text: 'GET STARTED',
  fontFamily: 'Press Start 2P',
  fontSize: 16,
  lineHeight: 20,  // 16 × 1.25 (tight for button)
  letterSpacing: 0,
  textTransform: 'uppercase',
  textAlign: 'center',
  color: tokens.text.inverse,  // #0F380F or #1B2853

  // Shadow (pixel shadow)
  shadowOffset: { x: 4, y: 4 },
  shadowColor: tokens.background.primary,
  shadowOpacity: 1,
  shadowRadius: 0,

  // Touch target (meets 48pt minimum)
  touchArea: { width: 321, height: 48 },
}
```

#### Secondary Link
```javascript
secondaryLink: {
  position: { x: 'center', y: 694 },
  width: 'intrinsic',  // ~240pt
  height: 44,  // Touch target

  // Text
  text: 'I already have an account',
  fontFamily: 'Montserrat',
  fontSize: 14,
  lineHeight: 19.25,  // 14 × 1.375
  letterSpacing: 0,
  textDecoration: 'underline',
  textAlign: 'center',
  color: tokens.interactive.primary,

  // Padding for touch target
  paddingVertical: 12,
  paddingHorizontal: 16,
}
```

### Spacing Measurements
```javascript
spacing: {
  topSafeArea: 59,
  progressTop: 20,  // Below safe area
  progressToLogo: 80,
  logoToTitle: 24,
  titleToTagline: 16,
  taglineToButtons: 236,  // Flexible spacer
  buttonToPrimary: 0,
  primaryToSecondary: 16,
  secondaryToBottom: 40,
  bottomSafeArea: 34,

  // Horizontal
  screenMargins: 24,
  buttonMargins: 36,  // Slightly tighter
  taglineMargins: 46,  // Extra for readability
}
```

### Color Usage Map
```javascript
colors: {
  background: tokens.background.primary,  // Full screen
  progressActiveDot: tokens.interactive.primary,
  progressInactiveDot: tokens.border.default,
  progressLabel: tokens.text.secondary,
  logo: '[multi-color pixel art]',
  title: tokens.text.primary,
  tagline: tokens.text.secondary,
  primaryButton: {
    background: tokens.interactive.primary,
    border: tokens.interactive.primary,
    text: tokens.text.inverse,
    shadow: tokens.background.primary,
  },
  secondaryLink: tokens.interactive.primary,
}
```

### Responsive Breakpoints

#### iPhone SE (375×667pt)
```javascript
adjustments: {
  logoY: 120,  // Move up 39pt
  taglineMaxWidth: 280,  // Narrower
  ctaSectionY: 550,  // Move up 80pt
  spacerFlexShrink: true,
}
```

#### iPad Air (820×1180pt)
```javascript
adjustments: {
  screenMargins: 80,  // Wider margins
  logoSize: 128,  // Larger logo
  titleFontSize: 40,  // Larger text
  taglineMaxWidth: 400,  // Wider tagline
  buttonMaxWidth: 400,  // Wider button
}
```

---

## Screen 2: ProfileSetupScreen

### Viewport
- **Device:** iPhone 14 Pro (393×852pt)
- **Safe Area:** Top 59pt, Bottom 34pt
- **Usable Height:** 759pt

### Layout Structure

```
┌─────────────────────────────────────┐  ← 0pt
│         Status Bar (59pt)           │
├─────────────────────────────────────┤  ← 59pt
│          Progress (20pt)            │
│         ● ● ○ Step 2 of 3           │
├─────────────────────────────────────┤  ← 79pt
│                                     │
│    [Scrollable Content Area]        │
│                                     │
│    [60pt spacer]                    │  ← Breathing room
│                                     │
│    [Header - 108pt]                 │
│      - Title: 24pt tall             │  ← 139-163pt
│      - Gap: 12pt                    │
│      - Subtitle: 72pt tall          │  ← 175-247pt (3 lines)
│                                     │
│    [32pt gap]                       │
│                                     │
│    [Form - ~240pt]                  │
│      - Username Field: 112pt        │  ← 279-391pt
│        • Label: 14pt + 8pt margin   │
│        • Input: 48pt                │
│        • Helper: 12pt + 8pt margin  │
│        • Gap: 24pt                  │
│      - Display Name Field: 112pt    │  ← 415-527pt
│                                     │
│    [180pt bottom padding]           │  ← Space for sticky CTA
│                                     │
├─────────────────────────────────────┤  ← Sticky Bottom (144pt tall)
│   ═══════════════════════════════   │  ← Border (3pt)
│                                     │
│    [CTA Section - 141pt]            │
│      - Padding top: 24pt            │
│      - Primary Button: 48pt         │  ← 24pt from border
│      - Gap: 12pt                    │
│      - Secondary Link: 17pt         │  ← Text height
│      - Padding bottom: 40pt         │
│                                     │
├─────────────────────────────────────┤
│      Home Indicator (34pt)          │
└─────────────────────────────────────┘  ← 852pt
```

### Component Specifications

#### Header Section
```javascript
header: {
  position: { x: 24, y: 139 },
  width: 345,  // Full width - margins

  title: {
    text: 'CREATE PROFILE',
    fontFamily: 'Press Start 2P',
    fontSize: 24,
    lineHeight: 33.6,  // 24 × 1.4
    letterSpacing: 0,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: tokens.text.primary,
    marginBottom: 12,
  },

  subtitle: {
    text: 'Choose your unique username and optional display name.',
    fontFamily: 'Montserrat',
    fontSize: 16,
    lineHeight: 24,  // 16 × 1.5
    letterSpacing: 0,
    textAlign: 'center',
    color: tokens.text.secondary,
    maxWidth: 280,  // Centered, narrower for readability
    numberOfLines: 3,
  },
}
```

#### Username Field (FormField)
```javascript
usernameField: {
  position: { x: 24, y: 279 },
  width: 345,
  height: 112,  // Total component height

  label: {
    text: 'Username',
    required: true,  // Shows asterisk
    fontFamily: 'Montserrat SemiBold',
    fontSize: 14,
    lineHeight: 19.25,
    fontWeight: '600',
    color: tokens.text.primary,
    marginBottom: 8,
    height: 22,  // 14 + margin
  },

  input: {
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 3,  // 4 when focused
    borderRadius: 0,
    borderColor: tokens.border.default,  // Changes on focus/error
    backgroundColor: tokens.background.primary,

    // Text
    fontFamily: 'Montserrat',
    fontSize: 16,
    lineHeight: 24,
    color: tokens.text.primary,

    // Placeholder
    placeholder: 'Enter username...',
    placeholderTextColor: tokens.text.tertiary,
  },

  helperText: {
    text: '3-20 characters (letters, numbers, underscore)',
    fontFamily: 'Montserrat',
    fontSize: 12,
    lineHeight: 16.5,
    color: tokens.text.secondary,
    marginTop: 8,
    height: 26,  // 12 + margin
  },

  // States
  focused: {
    borderWidth: 4,
    borderColor: tokens.border.focus,  // #1E90FF or #00D0FF
  },

  error: {
    borderColor: tokens.feedback.error,  // #FF4757
    helperTextColor: tokens.feedback.error,
    // Shake animation triggers
  },

  success: {
    borderColor: tokens.feedback.success,  // #2ED573
    // Checkmark icon appears on right
  },
}
```

#### Display Name Field
```javascript
displayNameField: {
  position: { x: 24, y: 415 },  // 279 + 112 + 24 gap
  width: 345,
  height: 112,

  // Same structure as username field
  label: {
    text: 'Display Name',
    required: false,  // Optional
    // ... same specs as username label
  },

  input: {
    placeholder: 'Optional display name...',
    // ... same specs as username input
  },

  helperText: {
    text: 'This is how others will see you',
    // ... same specs as username helper
  },
}
```

#### Sticky CTA Section
```javascript
ctaSection: {
  position: 'absolute',
  bottom: 34,  // Above home indicator
  left: 0,
  right: 0,
  height: 144,  // Including border

  // Border
  borderTopWidth: 3,
  borderTopColor: tokens.border.default,
  backgroundColor: tokens.background.primary,

  // Content
  paddingHorizontal: 24,
  paddingTop: 24,
  paddingBottom: 40,
  gap: 12,

  primaryButton: {
    width: 345,
    height: 48,
    // ... same specs as WelcomeScreen primary button
    text: 'CREATE ACCOUNT',

    disabled: {
      opacity: 0.4,
      backgroundColor: tokens.interactive.disabled,
    },

    loading: {
      // Replace text with ActivityIndicator
      spinnerColor: tokens.text.inverse,
    },
  },

  secondaryLink: {
    text: 'Skip for now',
    textAlign: 'center',
    height: 17,  // Text height only (no padding)
    // ... same specs as WelcomeScreen secondary link
  },
}
```

### Spacing Measurements
```javascript
spacing: {
  topSafeArea: 59,
  progressTop: 20,
  progressToHeader: 60,
  headerTitleToSubtitle: 12,
  headerToForm: 32,
  formFieldGap: 24,
  formToCtaSection: 180,  // Padding for sticky section

  // Sticky CTA
  ctaBorderHeight: 3,
  ctaPaddingTop: 24,
  ctaPrimaryToSecondary: 12,
  ctaPaddingBottom: 40,

  // Field internals
  labelToInput: 8,
  inputToHelper: 8,
}
```

### Keyboard Behavior
```javascript
keyboardAvoidance: {
  behavior: 'padding',  // iOS
  keyboardVerticalOffset: 0,

  // When keyboard appears
  onKeyboardShow: {
    // Scroll active input into view
    scrollToInput: true,
    // Keep CTA section visible (sticky)
    maintainBottomSection: true,
  },

  // Keyboard heights
  keyboardHeightPortrait: 291,  // iPhone 14 Pro
  keyboardHeightLandscape: 209,
}
```

---

## Screen 3: ArchetypeSelectionScreen

### Viewport
- **Device:** iPhone 14 Pro (393×852pt)
- **Safe Area:** Top 59pt, Bottom 34pt
- **Usable Height:** 759pt

### Layout Structure

```
┌─────────────────────────────────────┐  ← 0pt
│         Status Bar (59pt)           │
├─────────────────────────────────────┤  ← 59pt
│          Progress (20pt)            │
│         ● ● ● Step 3 of 3           │
├─────────────────────────────────────┤  ← 79pt
│                                     │
│    [Scrollable Content Area]        │
│                                     │
│    [60pt spacer]                    │
│                                     │
│    [Header - 108pt]                 │
│      - Title                        │  ← 139-163pt
│      - Subtitle                     │  ← 175-247pt
│                                     │
│    [32pt gap]                       │
│                                     │
│    [Grid Section]                   │
│                                     │
│    Row 1: [Card 1] [Card 2]         │  ← 279-479pt (200pt tall)
│            16pt gap                  │
│    Row 2: [Card 3] [Card 4]         │  ← 495-695pt
│            16pt gap                  │
│    Row 3:    [Card 5]                │  ← 711-911pt (centered)
│                                     │
│    [100pt bottom padding]           │
│                                     │
├─────────────────────────────────────┤  ← Sticky Bottom (104pt tall)
│   ═══════════════════════════════   │
│                                     │
│    [CTA Section - 101pt]            │
│      - Primary Button               │
│      - No secondary action          │
│                                     │
├─────────────────────────────────────┤
│      Home Indicator (34pt)          │
└─────────────────────────────────────┘  ← 852pt
```

### Component Specifications

#### Archetype Card
```javascript
archetypeCard: {
  width: 164.5,  // (393 - 48 - 16) / 2 = 164.5pt
  height: 200,
  padding: 16,
  gap: 12,

  // Border
  borderWidth: 3,  // 4 when selected
  borderRadius: 0,
  borderColor: tokens.border.default,  // Changes when selected
  backgroundColor: tokens.background.elevated,

  // Layout
  alignItems: 'center',
  justifyContent: 'flex-start',

  // Avatar
  avatar: {
    size: 80,  // 80×80pt
    marginBottom: 8,

    // Asset requirements
    asset: {
      format: 'PNG-8',
      dimensions: '80×80pt (@1x), 160×160pt (@2x), 240×240pt (@3x)',
      colorDepth: 8,
      palette: 'DMG or custom fitness palette',
      fileSize: '<30KB',
    },
  },

  // Name
  name: {
    fontFamily: 'Press Start 2P',
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: tokens.text.primary,
    marginBottom: 4,
    numberOfLines: 1,
  },

  // Description
  description: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    lineHeight: 18,  // 12 × 1.5
    letterSpacing: 0,
    textAlign: 'center',
    color: tokens.text.secondary,
    numberOfLines: 2,
    height: 36,  // 2 lines
  },

  // Selected state
  selected: {
    borderWidth: 4,
    borderColor: tokens.border.highlight,  // #00D0FF or #8BAC0F
    scale: 1.05,
    shadowOffset: { x: 0, y: 0 },
    shadowColor: tokens.border.highlight,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
}
```

#### Grid Layout
```javascript
grid: {
  position: { x: 24, y: 279 },
  width: 345,

  // Layout
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',  // Distributes cards evenly
  rowGap: 16,
  columnGap: 16,

  // Grid math
  cardWidth: 164.5,  // (345 - 16) / 2
  cardHeight: 200,
  cardsPerRow: 2,
  rows: 3,  // 2 + 2 + 1 layout

  // Row 1
  row1: {
    cards: ['trainer', 'runner'],
    yPosition: 279,
  },

  // Row 2
  row2: {
    cards: ['yoga', 'bodybuilder'],
    yPosition: 495,  // 279 + 200 + 16
  },

  // Row 3 (centered single card)
  row3: {
    cards: ['cyclist'],
    yPosition: 711,  // 495 + 200 + 16
    alignment: 'center',  // Card centered in row
  },
}
```

#### Archetype Data
```javascript
archetypes: [
  {
    id: 'trainer',
    name: 'TRAINER',
    description: 'Balanced fitness with variety of exercises',
    avatar: require('@/assets/sprites/trainer-80.png'),
    position: { row: 1, col: 1 },
  },
  {
    id: 'runner',
    name: 'RUNNER',
    description: 'Built for endurance and speed',
    avatar: require('@/assets/sprites/runner-80.png'),
    position: { row: 1, col: 2 },
  },
  {
    id: 'yoga',
    name: 'YOGA',
    description: 'Focus on flexibility and mindfulness',
    avatar: require('@/assets/sprites/yoga-80.png'),
    position: { row: 2, col: 1 },
  },
  {
    id: 'bodybuilder',
    name: 'BODYBUILDER',
    description: 'Strength and muscle building focus',
    avatar: require('@/assets/sprites/bodybuilder-80.png'),
    position: { row: 2, col: 2 },
  },
  {
    id: 'cyclist',
    name: 'CYCLIST',
    description: 'Cardio and leg strength specialist',
    avatar: require('@/assets/sprites/cyclist-80.png'),
    position: { row: 3, col: 1 },
  },
]
```

#### Sticky CTA Section
```javascript
ctaSection: {
  position: 'absolute',
  bottom: 34,
  left: 0,
  right: 0,
  height: 104,  // Smaller than ProfileSetup (no secondary action)

  borderTopWidth: 3,
  borderTopColor: tokens.border.default,
  backgroundColor: tokens.background.primary,

  paddingHorizontal: 24,
  paddingTop: 24,
  paddingBottom: 40,

  primaryButton: {
    width: 345,
    height: 48,
    text: 'CONTINUE',
    // ... same specs as other screens

    disabled: {
      // Disabled until archetype selected
      opacity: 0.4,
      pointerEvents: 'none',
    },
  },
}
```

### Spacing Measurements
```javascript
spacing: {
  topSafeArea: 59,
  progressTop: 20,
  progressToHeader: 60,
  headerToGrid: 32,
  gridCardGap: 16,
  gridToBottom: 100,  // Padding for sticky CTA

  // Card internals
  cardPadding: 16,
  cardInternalGap: 12,
  avatarToName: 8,
  nameToDescription: 4,
}
```

### Staggered Animation Timing
```javascript
animation: {
  cardEntrance: {
    duration: 250,
    stagger: 50,  // 50ms delay between cards

    card1: { delay: 0,    opacity: [0, 1], translateY: [30, 0] },
    card2: { delay: 50,   opacity: [0, 1], translateY: [30, 0] },
    card3: { delay: 100,  opacity: [0, 1], translateY: [30, 0] },
    card4: { delay: 150,  opacity: [0, 1], translateY: [30, 0] },
    card5: { delay: 200,  opacity: [0, 1], translateY: [30, 0] },

    // Total animation time: 250 + 200 = 450ms
  },

  cardSelection: {
    deselect: {
      duration: 150,
      scale: [1.05, 1],
      borderWidth: [4, 3],
      shadowOpacity: [0.6, 0],
    },
    select: {
      duration: 200,
      easing: 'spring',
      scale: [1, 1.05],
      borderWidth: [3, 4],
      shadowOpacity: [0, 0.6],
    },
  },
}
```

---

## Asset Requirements Summary

### Logo Asset (Welcome Screen)
```javascript
logoAsset: {
  filename: 'logo-96.png',
  sizes: {
    '1x': '96×96px',
    '2x': '192×192px',
    '3x': '288×288px',
  },
  format: 'PNG-8',
  colorDepth: 8,
  transparency: true,
  fileSize: '<50KB',
  palette: 'Game Boy DMG or Neon Arcade',
}
```

### Archetype Sprites (Archetype Selection Screen)
```javascript
archetypeSprites: [
  {
    filename: 'trainer-80.png',
    character: 'Balanced trainer character',
    sizes: {
      '1x': '80×80px',
      '2x': '160×160px',
      '3x': '240×240px',
    },
    format: 'PNG-8',
    colorDepth: 8,
    transparency: true,
    fileSize: '<30KB',
    palette: 'Game Boy DMG or Fitness Pulse',
    style: 'Pixel art, 16-bit aesthetic, front-facing pose',
  },
  {
    filename: 'runner-80.png',
    character: 'Athletic runner character',
    // ... same specs
  },
  {
    filename: 'yoga-80.png',
    character: 'Flexible yoga character',
    // ... same specs
  },
  {
    filename: 'bodybuilder-80.png',
    character: 'Muscular bodybuilder character',
    // ... same specs
  },
  {
    filename: 'cyclist-80.png',
    character: 'Cyclist character with bike',
    // ... same specs
  },
]
```

### Icon Assets
```javascript
iconAssets: [
  {
    filename: 'icon-check.png',
    sizes: { '1x': '20×20px', '2x': '40×40px', '3x': '60×60px' },
    usage: 'Success checkmark for form validation',
  },
  {
    filename: 'icon-error.png',
    sizes: { '1x': '20×20px', '2x': '40×40px', '3x': '60×60px' },
    usage: 'Error indicator for form validation',
  },
  {
    filename: 'icon-arrow-left.png',
    sizes: { '1x': '24×24px', '2x': '48×48px', '3x': '72×72px' },
    usage: 'Back button (future screens)',
  },
]
```

---

## Typography Scale (Applied)

### Screen Usage Matrix
```javascript
typographyUsage: {
  WelcomeScreen: {
    title: 'h1 (Press Start 2P, 32pt)',
    tagline: 'bodyLarge (Montserrat, 18pt)',
    primaryButton: 'buttonPrimary (Press Start 2P, 16pt)',
    secondaryLink: 'link (Montserrat, 14pt)',
    progressLabel: 'caption (Montserrat, 12pt)',
  },

  ProfileSetupScreen: {
    title: 'h2 (Press Start 2P, 24pt)',
    subtitle: 'body (Montserrat, 16pt)',
    fieldLabel: 'label (Montserrat SemiBold, 14pt)',
    fieldInput: 'inputText (Montserrat, 16pt)',
    helperText: 'caption (Montserrat, 12pt)',
    primaryButton: 'buttonPrimary (Press Start 2P, 16pt)',
    secondaryLink: 'link (Montserrat, 14pt)',
  },

  ArchetypeSelectionScreen: {
    title: 'h2 (Press Start 2P, 24pt)',
    subtitle: 'body (Montserrat, 16pt)',
    cardName: 'h3 (Press Start 2P, 16pt)',
    cardDescription: 'bodySmall (Montserrat, 12pt)',
    primaryButton: 'buttonPrimary (Press Start 2P, 16pt)',
  },
}
```

---

## Color Palette Application

### DMG Classic Palette Usage
```javascript
dmgPaletteUsage: {
  background: '#0F380F',           // darkest - screen background
  cardBackground: '#306230',       // dark - elevated surfaces
  border: '#306230',               // dark - default borders
  borderHighlight: '#8BAC0F',      // light - selected states
  textPrimary: '#9BBC0F',          // lightest - body text, headers
  textSecondary: '#8BAC0F',        // light - muted text
  buttonPrimary: '#8BAC0F',        // light - CTA background
  buttonText: '#0F380F',           // darkest - text on button
}
```

### Neon Arcade Palette Usage
```javascript
neonPaletteUsage: {
  background: '#1B2853',           // deepSpace - screen background
  cardBackground: '#2A3A6B',       // elevated - cards
  border: '#3D4E7A',               // muted blue - default borders
  borderHighlight: '#00D0FF',      // cyan - selected states
  textPrimary: '#FFFFFF',          // white - body text, headers
  textSecondary: '#B8C5E0',        // soft blue-gray - muted text
  buttonPrimary: '#00D0FF',        // cyan - CTA background
  buttonText: '#1B2853',           // deepSpace - text on button
  glow: '#00D0FF',                 // cyan - neon glow effects
}
```

---

## Touch Target Audit

### Minimum Touch Targets (44×44pt)
```javascript
touchTargets: {
  WelcomeScreen: {
    primaryButton: '321×48pt ✅',
    secondaryLink: '~240×44pt ✅',
  },

  ProfileSetupScreen: {
    usernameInput: '345×48pt ✅',
    displayNameInput: '345×48pt ✅',
    primaryButton: '345×48pt ✅',
    secondaryLink: '~200×44pt ✅',
  },

  ArchetypeSelectionScreen: {
    archetypeCard: '164.5×200pt ✅',
    primaryButton: '345×48pt ✅',
  },

  // All touch targets meet Apple HIG minimum of 44×44pt
}
```

---

## Performance Budget

### Target Metrics
```javascript
performanceBudget: {
  // Screen load time
  timeToInteractive: '<1000ms',

  // Animation frame rate
  fps: 60,
  frameDuration: '16.67ms',

  // Asset loading
  logoLoad: '<100ms',
  spriteLoad: '<150ms',
  totalAssetLoad: '<500ms',

  // Memory usage
  screenMemory: '<50MB',
  assetMemory: '<10MB',

  // Bundle size
  screenCode: '<100KB',
  assets: '<200KB (all sprites)',
}
```

---

## Export Specifications for Designers

### Figma/Sketch Export Settings
```javascript
exportSettings: {
  // iOS
  ios: {
    scale: ['@1x', '@2x', '@3x'],
    format: 'PNG',
    colorProfile: 'sRGB',
    compression: 'lossless',
  },

  // Android (future)
  android: {
    densities: ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'],
    format: 'PNG',
    colorProfile: 'sRGB',
  },
}
```

### Handoff Checklist
- [ ] All measurements documented in pt (not px)
- [ ] All colors referenced by token name (not hex)
- [ ] All fonts specified with exact weight
- [ ] All spacing uses 8pt grid
- [ ] All assets exported at 1x, 2x, 3x
- [ ] All touch targets ≥44×44pt
- [ ] All contrast ratios ≥4.5:1 for text
- [ ] All animations specified with duration/easing
- [ ] All states documented (default, hover, pressed, disabled)
- [ ] All responsive breakpoints defined

---

## Next Steps

1. ✅ **Design Tokens Complete**
2. ✅ **Typography System Complete**
3. ✅ **Animation Specifications Complete**
4. ✅ **Atomic Components Spec Complete**
5. ✅ **Molecular Components Spec Complete**
6. ✅ **Organism Components Spec Complete**
7. ✅ **User Flow Diagram Complete**
8. ✅ **Screen Specifications Complete** (This Document)
9. ⏭️ **MagicPath.ai Prompt Library** (Consolidated prompts)
10. ⏭️ **21st.dev/magic Component Prompts** (Consolidated prompts)

---

## Version History
- **v1.0** (2025-10-31): Initial screen specifications - Pixel-perfect measurements for all 3 Story 1.4 screens, asset requirements, color usage maps, touch target audit, performance budget.

---

**Document Owner:** UI/UX Specialist (Sally)
**Approved By:** Architect (Pending)
**Last Updated:** 2025-10-31
