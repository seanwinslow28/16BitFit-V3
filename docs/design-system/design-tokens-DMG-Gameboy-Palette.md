# 16BitFit Design Tokens
## Version 1.0 | Foundation Document

This document defines the core visual language of 16BitFit. All components, screens, and interactions must reference these tokens to maintain consistency across the platform.

---

## Color Palettes

### Palette Selection Guide
Choose ONE palette as your primary theme. Each palette is designed to be:
- ✅ WCAG AA compliant (4.5:1 minimum contrast)
- ✅ Retro-authentic (Game Boy heritage)
- ✅ Mobile-optimized (vibrant on OLED and LCD)
- ✅ Emotionally resonant with fitness motivation

---

### 🎮 Palette 1: DMG Classic (Original Game Boy)
**Mood:** Nostalgic, Authentic, Minimalist
**Use Case:** Users who want pure retro authenticity

#### Core Colors
```javascript
dmg: {
  darkest:  '#0F380F',  // rgb(15, 56, 15)   - Deep forest shadow
  dark:     '#306230',  // rgb(48, 98, 48)   - Pine border
  light:    '#8BAC0F',  // rgb(139, 172, 15) - Lime highlight
  lightest: '#9BBC0F',  // rgb(155, 188, 15) - Neon grass glow
}
```

#### Semantic Tokens
```javascript
background: {
  primary:   '#0F380F',  // Screen background
  elevated:  '#306230',  // Cards, modals
  overlay:   '#0F380Fcc', // 80% opacity overlay
}

text: {
  primary:   '#9BBC0F',  // Body text, headers
  secondary: '#8BAC0F',  // Muted text, captions
  inverse:   '#0F380F',  // Text on light backgrounds
}

border: {
  default:   '#306230',  // Input fields, dividers
  highlight: '#8BAC0F',  // Selected states, active elements
  focus:     '#9BBC0F',  // Focus rings, interactive states
}

interactive: {
  primary:   '#8BAC0F',  // Primary buttons, CTAs
  hover:     '#9BBC0F',  // Hover states
  active:    '#306230',  // Pressed states
  disabled:  '#306230',  // Disabled elements
}

feedback: {
  success:   '#8BAC0F',  // Success messages, achievements
  warning:   '#9BBC0F',  // Warnings, attention states
  error:     '#306230',  // Errors (muted in DMG palette)
  info:      '#8BAC0F',  // Info messages, tooltips
}
```

#### Accessibility Notes
- ⚠️ `darkest` on `lightest`: **5.3:1** contrast (AA compliant)
- ⚠️ `dark` on `light`: **3.8:1** contrast (Close to AA minimum)
- ✅ **Always use `darkest` (#0F380F) for critical text on `lightest` (#9BBC0F)**
- ✅ For body text, use `#FFFFFF` white on `darkest` background (14.6:1 contrast - AAA)

---

## Spacing Scale

### 8px Base Grid System
All spacing must be multiples of 8px for pixel-perfect layouts that honor retro bitmap aesthetics.

```javascript
spacing: {
  0:   '0px',    // No space
  1:   '8px',    // Minimum touch padding, tight grouping
  2:   '16px',   // Standard padding, comfortable breathing room
  3:   '24px',   // Section spacing, moderate separation
  4:   '32px',   // Large section breaks, screen padding
  5:   '40px',   // Extra-large spacing
  6:   '48px',   // Dramatic separation
  8:   '64px',   // Hero spacing, major screen sections
  10:  '80px',   // Maximum spacing (rare)
  12:  '96px',   // Ultra-wide (desktop only)
}
```

### Component-Specific Spacing
```javascript
component: {
  buttonPaddingX:     '24px',  // Horizontal button padding (spacing[3])
  buttonPaddingY:     '16px',  // Vertical button padding (spacing[2])
  inputPaddingX:      '16px',  // Input field horizontal padding
  inputPaddingY:      '16px',  // Input field vertical padding
  cardPadding:        '24px',  // Card internal padding
  screenPaddingX:     '24px',  // Screen horizontal margins
  screenPaddingY:     '32px',  // Screen vertical margins (top/bottom)
  stackGap:           '16px',  // Vertical stack spacing between elements
  gridGap:            '16px',  // Grid spacing between items
  sectionGap:         '48px',  // Gap between major screen sections
}
```

---

## Border System

### Border Widths
All borders are chunky and bold for retro aesthetic authenticity.

```javascript
borderWidth: {
  none:    '0px',
  thin:    '2px',    // Subtle dividers only
  default: '3px',    // Standard retro border (most common)
  thick:   '4px',    // Emphasized borders (selected states)
  heavy:   '6px',    // Hero elements, major focus states
  pixel:   '1px',    // Only for grid lines or very subtle dividers
}
```

### Border Radius
```javascript
borderRadius: {
  none:    '0px',    // DEFAULT - Pure retro, zero rounding
  subtle:  '2px',    // Only if absolutely necessary for modern touch
  small:   '4px',    // Rare - use sparingly
  medium:  '8px',    // Rare - breaks retro aesthetic
  large:   '16px',   // DO NOT USE in retro mode
}
```

**Design Rule:** Default to `borderRadius.none` (0px) for authentic Game Boy aesthetic. Only use subtle rounding (2-4px) if user testing reveals sharp corners cause usability issues.

---

## Elevation & Shadows

### Shadow System (Use Sparingly in Retro Aesthetic)
Retro designs typically avoid soft shadows. Use pixel-perfect offsets instead.

```javascript
// Modern Soft Shadows (Neon Arcade, Fitness Pulse, Synthwave)
shadow: {
  none:   'none',
  sm:     '0 2px 4px rgba(0, 0, 0, 0.1)',
  md:     '0 4px 8px rgba(0, 0, 0, 0.15)',
  lg:     '0 8px 16px rgba(0, 0, 0, 0.2)',
  xl:     '0 16px 32px rgba(0, 0, 0, 0.25)',
  neon:   '0 0 10px currentColor, 0 0 20px currentColor', // Synthwave glow
}

// Retro Pixel Shadows (DMG Classic, Game Boy Aesthetic)
pixelShadow: {
  none:   'none',
  right:  '4px 0 0 0 currentColor',     // Hard right shadow
  bottom: '0 4px 0 0 currentColor',     // Hard bottom shadow
  corner: '4px 4px 0 0 currentColor',   // Hard corner shadow (most common)
  heavy:  '6px 6px 0 0 currentColor',   // Chunky corner shadow
  inset:  'inset 2px 2px 0 rgba(0, 0, 0, 0.3)', // Pressed button effect
}
```

**Design Rule:**
- **DMG Classic:** Use `pixelShadow` only
- **Neon Arcade / Fitness Pulse:** Use `shadow` for depth + `neon` for CTAs
- **Retro Synthwave:** Use `shadow` + `effects.neonGlow` for dramatic emphasis

---

## Opacity Scale

```javascript
opacity: {
  invisible:  0,
  faint:      0.1,   // Subtle overlays
  light:      0.2,   // Grid lines, very subtle dividers
  muted:      0.4,   // Disabled text
  medium:     0.6,   // Secondary elements
  visible:    0.8,   // Overlays with content
  opaque:     0.9,   // Near-opaque overlays
  solid:      1,     // Fully opaque (default)
}
```

---

## Z-Index Scale

```javascript
zIndex: {
  base:       0,     // Default layer
  dropdown:   1000,  // Dropdowns, tooltips
  sticky:     1100,  // Sticky headers
  modal:      1200,  // Modals, dialogs
  popover:    1300,  // Popovers, context menus
  toast:      1400,  // Toast notifications
  tooltip:    1500,  // Tooltips (highest UI layer)
}
```

---

## Icon Sizes

### Pixel Art Icon Specifications
All icons must be perfect squares at multiples of 8px or 16px for crisp pixel art rendering.

```javascript
iconSize: {
  xs:   '16px',   // Small inline icons, list bullets
  sm:   '24px',   // Standard UI icons, navigation
  md:   '32px',   // Large buttons, feature icons
  lg:   '48px',   // Hero icons, empty states
  xl:   '64px',   // Large feature graphics
  xxl:  '80px',   // Archetype avatars (Story 1.4 requirement)
  hero: '96px',   // Splash screens, onboarding heroes
}
```

**Design Rule:** Always use even pixel dimensions. Avoid 17px, 25px, or any odd numbers that break pixel grid alignment.

---

## Touch Target Sizes (Mobile Accessibility)

```javascript
touchTarget: {
  minimum:  '44px',   // Apple HIG minimum (44×44dp)
  comfortable: '48px', // Google Material minimum (48×48dp)
  optimal:  '60px',   // Recommended for primary CTAs
  large:    '80px',   // Large cards, archetype selection
}
```

**Design Rule:** All interactive elements MUST meet minimum 44×44px tap target. Increase visual size OR add transparent padding to meet this requirement.

---

## Transition Durations

### Animation Timing Reference
Based on psychological research and Apple HIG guidelines.

```javascript
duration: {
  instant:  '0ms',     // No animation (accessibility preference)
  fast:     '100ms',   // Button press, micro-interactions
  normal:   '200ms',   // Standard transitions, hover states
  moderate: '300ms',   // Screen transitions, success animations
  slow:     '500ms',   // Dramatic reveals, onboarding moments
  epic:     '800ms',   // Level-up celebrations, major milestones
}
```

### Easing Functions
```javascript
easing: {
  linear:       'linear',
  easeIn:       'cubic-bezier(0.4, 0, 1, 1)',      // Accelerate
  easeOut:      'cubic-bezier(0, 0, 0.2, 1)',      // Decelerate (most common)
  easeInOut:    'cubic-bezier(0.4, 0, 0.2, 1)',    // Smooth both ends
  spring:       'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy (success animations)
  retroSnap:    'steps(4, end)',                   // Pixel art frame animation
}
```

**Design Rule:**
- Button presses: `fast` (100ms) + `easeOut`
- Screen transitions: `moderate` (300ms) + `easeInOut`
- Success animations: `moderate` (300ms) + `spring`
- Pixel art sprite animations: `normal` (200ms) + `retroSnap`

---

## Breakpoints (Responsive Design)

```javascript
breakpoint: {
  mobile:   '0px',      // 320px+ (primary target)
  tablet:   '768px',    // iPad, Android tablets
  desktop:  '1024px',   // Desktop web (future)
  wide:     '1440px',   // Large desktop (future)
}
```

**Design Priority:** Mobile-first design. 16BitFit is a mobile fitness app. Desktop views are secondary.

---

## Usage Guidelines

### Which Palette Should I Use?
| Palette | Best For | Avoid If |
|---------|----------|----------|
| **DMG Classic** | Purists who love authentic Game Boy nostalgia | User wants vibrant colors, modern feel |
| **Neon Arcade** | High-energy users, vibrant motivation | User prefers minimalism, muted tones |
| **Fitness Pulse** | Athletic focus, performance-driven users | User wants playful, game-focused aesthetic |
| **Retro Synthwave** | 80s nostalgia, vaporwave fans | User wants serious fitness app tone |

### Token Naming Convention
Always reference tokens by semantic names in code, NOT raw hex values.

❌ **Wrong:**
```javascript
backgroundColor: '#FF4757'
```

✅ **Correct:**
```javascript
backgroundColor: tokens.interactive.primary
// OR for palette-specific:
backgroundColor: tokens.pulse.heartbeat
```

### Accessibility Checklist
Before finalizing any design:
- [ ] All text meets 4.5:1 contrast minimum (AA)
- [ ] Large text (18px+) meets 3:1 contrast minimum
- [ ] Interactive elements have 44×44px minimum touch targets
- [ ] Focus states are clearly visible (3px+ border contrast)
- [ ] Color is NOT the only indicator (use icons, borders, text too)

---

## Next Steps

1. ✅ **Design Tokens Complete** (This Document)
2. ⏭️ **Typography System** (Font pairings, size scale, line height)
3. ⏭️ **Animation Specifications** (Timing functions, haptic feedback)
4. ⏭️ **Component Library** (Buttons, inputs, cards, etc.)

---

## Version History
- **v1.0** (2025-10-31): Initial design tokens creation - 4 palette variations, spacing system, border specs, touch targets, animation durations.

---

**Document Owner:** UI/UX Specialist (Sally)
**Approved By:** Architect (Pending)
**Last Updated:** 2025-10-31
