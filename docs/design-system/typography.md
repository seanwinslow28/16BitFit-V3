# 16BitFit Typography System
## Version 1.0 | Foundation Document

This document defines the complete typography system for 16BitFit, including font pairings, size scales, line heights, and usage guidelines for both pixel fonts and modern sans-serifs.

---

## Font Philosophy

### The Two-Font Strategy
16BitFit uses a **contrast pairing** approach: retro pixel fonts for display elements + clean modern sans-serifs for body text.

**Why This Works:**
- ✅ **Visual Hierarchy**: Instant distinction between headers and body text
- ✅ **Nostalgic + Readable**: Pixel fonts spark emotion, sans-serifs ensure legibility
- ✅ **Performance**: Pixel fonts work best at large sizes; modern fonts handle small text gracefully
- ✅ **Accessibility**: Modern fonts maintain WCAG readability standards at all sizes

---

## Primary Font Pairing (Recommended)

### Display Font: Press Start 2P
**Use For:** Headers, buttons, labels, UI chrome, retro emphasis

```css
font-family: 'Press Start 2P', 'Courier New', monospace;
```

**Characteristics:**
- True 8-bit bitmap font from classic NES/Game Boy era
- Monospaced (all characters same width)
- Works best at multiples of 8px (8, 16, 24, 32, 40, 48)
- ⚠️ **DO NOT USE for paragraphs** - extremely low legibility at small sizes
- ✅ **Perfect for titles, buttons, pixel UI elements**

**Licensing:** [SIL Open Font License](https://fonts.google.com/specimen/Press+Start+2P) - Free for commercial use

**CDN Load:**
```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

**React Native Installation:**
```bash
# Expo
expo install expo-font @expo-google-fonts/press-start-2p

# React Native CLI
react-native link
# Add font file to assets folder and link in react-native.config.js
```

---

### Body Font: Montserrat
**Use For:** Body text, descriptions, forms, captions, long-form content

```css
font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

**Characteristics:**
- Modern geometric sans-serif inspired by urban typography
- 9 weights available (Thin 100 → Black 900)
- Excellent readability at small sizes (12px+)
- Clean, professional, pairs beautifully with retro pixel fonts
- ✅ **Perfect for paragraphs, UI descriptions, form inputs**

**Weights to Use:**
- **Regular (400)**: Body text, descriptions
- **Medium (500)**: Emphasized text, subheadings
- **SemiBold (600)**: Strong emphasis, secondary headers
- **Bold (700)**: Rare - only for critical callouts

**Licensing:** [SIL Open Font License](https://fonts.google.com/specimen/Montserrat) - Free for commercial use

**CDN Load:**
```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**React Native Installation:**
```bash
# Expo
expo install expo-font @expo-google-fonts/montserrat

# React Native CLI
# Add font files to assets and link
```

---

## Alternative Font Pairing (Option B)

### Display Font: Pixelify Sans
**Use For:** Headers, buttons (more modern than Press Start 2P)

```css
font-family: 'Pixelify Sans', 'Courier New', monospace;
```

**Characteristics:**
- Modern interpretation of pixel fonts (2023 release)
- Variable font with adjustable "pixelation" level
- Cleaner than Press Start 2P, slightly more legible
- ✅ **Good option if Press Start 2P feels too retro**

**Licensing:** [SIL Open Font License](https://fonts.google.com/specimen/Pixelify+Sans)

---

### Body Font: Open Sans
**Use For:** Body text, UI text (alternative to Montserrat)

```css
font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
```

**Characteristics:**
- Humanist sans-serif, optimized for screen readability
- Slightly wider than Montserrat (more breathing room)
- ✅ **Best for text-heavy screens, long descriptions**

**Licensing:** Apache License 2.0 - Free for commercial use

---

## Typography Scale

### Font Size System (8px Base Grid)
All font sizes follow 8px multiples for pixel-perfect alignment with spacing system.

```javascript
fontSize: {
  // Pixel Font Sizes (Press Start 2P, Pixelify Sans)
  pixelXS:    '8px',    // Tiny labels, icon text (rarely used)
  pixelSM:    '12px',   // Small UI labels, metadata
  pixelBase:  '16px',   // Standard button text, labels
  pixelLG:    '24px',   // Large buttons, section headers
  pixelXL:    '32px',   // Screen titles, hero text
  pixelXXL:   '40px',   // Splash screens, major titles
  pixelHero:  '48px',   // Welcome screens (rare)

  // Body Font Sizes (Montserrat, Open Sans)
  xs:   '12px',   // Captions, fine print, metadata
  sm:   '14px',   // Secondary text, form helper text
  base: '16px',   // Body text, standard paragraphs (DEFAULT)
  lg:   '18px',   // Emphasized body text, subheadings
  xl:   '20px',   // Large callouts, feature descriptions
  xxl:  '24px',   // Section headers (when not using pixel font)
  xxxl: '32px',   // Page titles (when not using pixel font)
}
```

---

## Line Height System

Line height (leading) affects readability. Pixel fonts need tight leading; body fonts need breathing room.

```javascript
lineHeight: {
  // Pixel Font Line Heights (Press Start 2P)
  pixelTight:   1.2,    // 120% - Compact UI labels
  pixelNormal:  1.4,    // 140% - Standard button text
  pixelRelaxed: 1.6,    // 160% - Multi-line headings (rare)

  // Body Font Line Heights (Montserrat)
  tight:   1.25,  // 125% - Tight UI text, small spaces
  snug:    1.375, // 137.5% - Comfortable single-line text
  normal:  1.5,   // 150% - Body paragraphs (DEFAULT)
  relaxed: 1.625, // 162.5% - Comfortable multi-paragraph text
  loose:   1.75,  // 175% - Very spacious, long-form articles
}
```

**Usage Guidelines:**
- **Pixel fonts**: Use `pixelNormal` (1.4) for single-line text, `pixelRelaxed` (1.6) if text wraps
- **Body fonts**: Use `normal` (1.5) for most text, `relaxed` (1.625) for long paragraphs
- **Buttons**: Use `tight` (1.25) to keep buttons compact
- **Headers**: Use `snug` (1.375) for single-line headers

---

## Letter Spacing (Tracking)

```javascript
letterSpacing: {
  // Pixel Fonts
  pixelTight:   '-0.02em', // -2% (rare, only for very large pixel text)
  pixelNormal:  '0em',     // 0% (DEFAULT for pixel fonts - never adjust)
  pixelWide:    '0.05em',  // +5% (rare, decorative use only)

  // Body Fonts
  tighter:  '-0.05em', // -5% (tight, urgent text)
  tight:    '-0.025em', // -2.5% (compact UI)
  normal:   '0em',     // 0% (DEFAULT)
  wide:     '0.025em', // +2.5% (buttons, CTAs for visual breathing room)
  wider:    '0.05em',  // +5% (ALL CAPS headings)
  widest:   '0.1em',   // +10% (EXTREME emphasis, rare)
}
```

**Usage Guidelines:**
- **Pixel fonts**: NEVER adjust letter spacing (breaks bitmap alignment)
- **Body fonts**: Use `wide` (0.025em) for buttons/CTAs to improve readability
- **ALL CAPS text**: Use `wider` (0.05em) to prevent letters from feeling cramped

---

## Font Weight Scale

```javascript
fontWeight: {
  thin:       100,  // Montserrat Thin (rarely used)
  extralight: 200,  // Montserrat ExtraLight (rarely used)
  light:      300,  // Montserrat Light (subtle de-emphasis)
  regular:    400,  // DEFAULT for body text
  medium:     500,  // Subtle emphasis, subheadings
  semibold:   600,  // Strong emphasis, secondary headers
  bold:       700,  // Critical emphasis, primary headers
  extrabold:  800,  // Rare - hero text only
  black:      900,  // Rare - extreme emphasis
}
```

**Press Start 2P Note:** Press Start 2P only has ONE weight (regular). Do not attempt to apply bold - it will have no effect. Use size and color for emphasis instead.

---

## Text Transform

```javascript
textTransform: {
  none:       'none',       // DEFAULT - preserve original case
  uppercase:  'uppercase',  // ALL CAPS (use sparingly)
  lowercase:  'lowercase',  // all lowercase (rare)
  capitalize: 'capitalize', // First Letter Of Each Word
}
```

**Usage Guidelines:**
- **Pixel fonts**: Can handle `uppercase` well (retro game aesthetic)
- **Body fonts**: Avoid `uppercase` for long text (reduces readability by 13%)
- **Buttons**: `uppercase` works well for pixel font buttons (e.g., "GET STARTED")
- **Headers**: Prefer natural case over `uppercase` for better scannability

---

## Typography Component Specifications

### Display Headers (Pixel Font)

#### H1 - Screen Titles
```javascript
h1: {
  fontFamily: 'Press Start 2P',
  fontSize: '32px',        // pixelXL
  lineHeight: 1.4,         // pixelNormal
  letterSpacing: '0em',    // pixelNormal
  fontWeight: 400,         // regular (only weight available)
  textTransform: 'uppercase',
  color: tokens.text.primary,
  marginBottom: '24px',    // spacing[3]
}
```

**Usage:** Welcome screen title, major screen headers
**Example:** "WELCOME TO 16BITFIT"

---

#### H2 - Section Headers
```javascript
h2: {
  fontFamily: 'Press Start 2P',
  fontSize: '24px',        // pixelLG
  lineHeight: 1.4,         // pixelNormal
  letterSpacing: '0em',
  fontWeight: 400,
  textTransform: 'uppercase',
  color: tokens.text.primary,
  marginBottom: '16px',    // spacing[2]
}
```

**Usage:** Section titles within screens, modal headers
**Example:** "SELECT ARCHETYPE"

---

#### H3 - Subsection Headers
```javascript
h3: {
  fontFamily: 'Press Start 2P',
  fontSize: '16px',        // pixelBase
  lineHeight: 1.4,
  letterSpacing: '0em',
  fontWeight: 400,
  textTransform: 'uppercase',
  color: tokens.text.primary,
  marginBottom: '16px',    // spacing[2]
}
```

**Usage:** Card titles, feature labels, archetype names
**Example:** "RUNNER"

---

### Body Text (Modern Sans-Serif)

#### Body Large
```javascript
bodyLarge: {
  fontFamily: 'Montserrat',
  fontSize: '18px',        // lg
  lineHeight: 1.5,         // normal
  letterSpacing: '0em',
  fontWeight: 400,         // regular
  color: tokens.text.primary,
  marginBottom: '16px',    // spacing[2]
}
```

**Usage:** Hero descriptions, feature callouts, important instructions

---

#### Body (Default)
```javascript
body: {
  fontFamily: 'Montserrat',
  fontSize: '16px',        // base
  lineHeight: 1.5,         // normal
  letterSpacing: '0em',
  fontWeight: 400,         // regular
  color: tokens.text.primary,
  marginBottom: '16px',    // spacing[2]
}
```

**Usage:** Standard paragraphs, descriptions, form labels
**Example:** "Balanced fitness with variety of exercises"

---

#### Body Small
```javascript
bodySmall: {
  fontFamily: 'Montserrat',
  fontSize: '14px',        // sm
  lineHeight: 1.5,         // normal
  letterSpacing: '0em',
  fontWeight: 400,         // regular
  color: tokens.text.secondary,
  marginBottom: '8px',     // spacing[1]
}
```

**Usage:** Helper text, form validation messages, metadata

---

#### Caption
```javascript
caption: {
  fontFamily: 'Montserrat',
  fontSize: '12px',        // xs
  lineHeight: 1.375,       // snug
  letterSpacing: '0em',
  fontWeight: 400,         // regular
  color: tokens.text.tertiary,
  marginBottom: '8px',     // spacing[1]
}
```

**Usage:** Fine print, timestamps, tertiary metadata

---

### Interactive Text (Buttons, Links)

#### Button Text (Primary CTA)
```javascript
buttonPrimary: {
  fontFamily: 'Press Start 2P',
  fontSize: '16px',        // pixelBase
  lineHeight: 1.25,        // tight (keeps button compact)
  letterSpacing: '0em',
  fontWeight: 400,
  textTransform: 'uppercase',
  color: tokens.text.inverse, // Dark text on bright button
}
```

**Usage:** Primary CTAs ("GET STARTED", "CONTINUE", "CREATE ACCOUNT")

---

#### Button Text (Secondary)
```javascript
buttonSecondary: {
  fontFamily: 'Montserrat',
  fontSize: '16px',        // base
  lineHeight: 1.25,        // tight
  letterSpacing: '0.025em', // wide (breathing room)
  fontWeight: 600,         // semibold
  textTransform: 'none',
  color: tokens.interactive.primary,
}
```

**Usage:** Secondary actions ("Skip for now", "Cancel", "Back")

---

#### Link Text
```javascript
link: {
  fontFamily: 'Montserrat',
  fontSize: '14px',        // sm
  lineHeight: 1.375,       // snug
  letterSpacing: '0em',
  fontWeight: 500,         // medium
  textDecoration: 'underline',
  color: tokens.interactive.primary,
}
```

**Usage:** Hyperlinks, "Learn more", "Forgot password?"

---

### Form Elements

#### Input Label
```javascript
inputLabel: {
  fontFamily: 'Montserrat',
  fontSize: '14px',        // sm
  lineHeight: 1.375,       // snug
  letterSpacing: '0em',
  fontWeight: 600,         // semibold
  textTransform: 'none',
  color: tokens.text.primary,
  marginBottom: '8px',     // spacing[1]
}
```

**Usage:** Form field labels ("Username", "Display Name")

---

#### Input Text
```javascript
inputText: {
  fontFamily: 'Montserrat',
  fontSize: '16px',        // base
  lineHeight: 1.5,         // normal
  letterSpacing: '0em',
  fontWeight: 400,         // regular
  color: tokens.text.primary,
}
```

**Usage:** Text inside input fields (user-typed content)

---

#### Input Placeholder
```javascript
inputPlaceholder: {
  fontFamily: 'Montserrat',
  fontSize: '16px',        // base
  lineHeight: 1.5,         // normal
  letterSpacing: '0em',
  fontWeight: 400,         // regular
  color: tokens.text.tertiary,
  opacity: 0.6,
}
```

**Usage:** Placeholder text ("Enter username...", "3-20 characters")

---

#### Input Helper Text
```javascript
inputHelper: {
  fontFamily: 'Montserrat',
  fontSize: '12px',        // xs
  lineHeight: 1.375,       // snug
  letterSpacing: '0em',
  fontWeight: 400,         // regular
  color: tokens.text.secondary,
  marginTop: '8px',        // spacing[1]
}
```

**Usage:** Helper text below inputs ("Must be 3-20 characters")

---

#### Input Error Text
```javascript
inputError: {
  fontFamily: 'Montserrat',
  fontSize: '12px',        // xs
  lineHeight: 1.375,       // snug
  letterSpacing: '0em',
  fontWeight: 500,         // medium (emphasis)
  color: tokens.feedback.error,
  marginTop: '8px',        // spacing[1]
}
```

**Usage:** Validation errors ("Username already taken", "Invalid format")

---

## Responsive Typography

### Mobile-First Scale (320px - 767px)
Use base sizes as defined above. This is the primary target device.

### Tablet Scale (768px - 1023px)
```javascript
// Increase sizes by 1.125x (12.5%)
h1.fontSize: '36px',     // 32px * 1.125
h2.fontSize: '27px',     // 24px * 1.125
body.fontSize: '18px',   // 16px * 1.125
```

### Desktop Scale (1024px+)
```javascript
// Increase sizes by 1.25x (25%)
h1.fontSize: '40px',     // 32px * 1.25
h2.fontSize: '30px',     // 24px * 1.25
body.fontSize: '20px',   // 16px * 1.25
```

**Note:** Desktop views are secondary. Only implement if web version is prioritized.

---

## Accessibility Guidelines

### Minimum Font Sizes
- ✅ **Body text minimum**: 16px (iOS Safari doesn't zoom at 16px+)
- ✅ **Caption text minimum**: 12px (absolute minimum for WCAG AA)
- ❌ **Never use smaller than 12px** for any readable text

### Contrast Requirements
- ✅ **Normal text (< 18px)**: 4.5:1 contrast ratio (WCAG AA)
- ✅ **Large text (≥ 18px)**: 3:1 contrast ratio (WCAG AA)
- ✅ **All text on DMG Classic palette**: Test with `#9BBC0F` text on `#0F380F` background (5.3:1 - passes AA)

### Dynamic Type Support (iOS)
Support iOS Dynamic Type for accessibility:
```javascript
// React Native
import { StyleSheet, Platform, PixelRatio } from 'react-native';

const scaleFontSize = (size) => {
  if (Platform.OS === 'ios') {
    return size * PixelRatio.getFontScale();
  }
  return size;
};
```

### Screen Reader Considerations
- ✅ All text must be selectable by screen readers
- ✅ Pixel fonts work fine with VoiceOver/TalkBack (text is still text)
- ✅ Avoid image-based text (use web fonts instead)

---

## Code Implementation

### React Native StyleSheet
```javascript
import { StyleSheet } from 'react-native';

const typography = StyleSheet.create({
  // Display Headers (Pixel Font)
  h1: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 32,
    lineHeight: 44.8,  // 32 * 1.4
    letterSpacing: 0,
    fontWeight: '400',
    textTransform: 'uppercase',
    color: '#9BBC0F', // tokens.text.primary (DMG)
    marginBottom: 24,
  },

  h2: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 24,
    lineHeight: 33.6,  // 24 * 1.4
    letterSpacing: 0,
    fontWeight: '400',
    textTransform: 'uppercase',
    color: '#9BBC0F',
    marginBottom: 16,
  },

  h3: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 16,
    lineHeight: 22.4,  // 16 * 1.4
    letterSpacing: 0,
    fontWeight: '400',
    textTransform: 'uppercase',
    color: '#9BBC0F',
    marginBottom: 16,
  },

  // Body Text (Modern Sans)
  body: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    lineHeight: 24,  // 16 * 1.5
    letterSpacing: 0,
    fontWeight: '400',
    color: '#9BBC0F',
    marginBottom: 16,
  },

  bodySmall: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    lineHeight: 21,  // 14 * 1.5
    letterSpacing: 0,
    fontWeight: '400',
    color: '#8BAC0F', // tokens.text.secondary
    marginBottom: 8,
  },

  caption: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    lineHeight: 16.5,  // 12 * 1.375
    letterSpacing: 0,
    fontWeight: '400',
    color: '#306230', // tokens.text.tertiary (DMG)
    marginBottom: 8,
  },

  // Buttons
  buttonPrimary: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 16,
    lineHeight: 20,  // 16 * 1.25 (tight)
    letterSpacing: 0,
    fontWeight: '400',
    textTransform: 'uppercase',
    color: '#0F380F', // Dark text on bright button
  },

  buttonSecondary: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    lineHeight: 20,  // 16 * 1.25
    letterSpacing: 0.4,  // 0.025em * 16px
    fontWeight: '600',
    color: '#8BAC0F', // tokens.interactive.primary
  },

  // Forms
  inputLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    lineHeight: 19.25,  // 14 * 1.375
    letterSpacing: 0,
    fontWeight: '600',
    color: '#9BBC0F',
    marginBottom: 8,
  },

  inputText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    lineHeight: 24,  // 16 * 1.5
    letterSpacing: 0,
    fontWeight: '400',
    color: '#9BBC0F',
  },

  inputError: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    lineHeight: 16.5,  // 12 * 1.375
    letterSpacing: 0,
    fontWeight: '500',
    color: '#FF4757', // tokens.feedback.error
    marginTop: 8,
  },
});

export default typography;
```

---

### CSS (Web Version)
```css
/* Root Typography Variables */
:root {
  /* Font Families */
  --font-pixel: 'Press Start 2P', 'Courier New', monospace;
  --font-body: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Font Sizes */
  --text-pixel-xs: 8px;
  --text-pixel-sm: 12px;
  --text-pixel-base: 16px;
  --text-pixel-lg: 24px;
  --text-pixel-xl: 32px;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;

  /* Line Heights */
  --leading-pixel-tight: 1.2;
  --leading-pixel-normal: 1.4;
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* Letter Spacing */
  --tracking-normal: 0em;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
}

/* Display Headers */
.h1 {
  font-family: var(--font-pixel);
  font-size: var(--text-pixel-xl);
  line-height: var(--leading-pixel-normal);
  letter-spacing: var(--tracking-normal);
  text-transform: uppercase;
  margin-bottom: 24px;
}

.h2 {
  font-family: var(--font-pixel);
  font-size: var(--text-pixel-lg);
  line-height: var(--leading-pixel-normal);
  letter-spacing: var(--tracking-normal);
  text-transform: uppercase;
  margin-bottom: 16px;
}

.h3 {
  font-family: var(--font-pixel);
  font-size: var(--text-pixel-base);
  line-height: var(--leading-pixel-normal);
  letter-spacing: var(--tracking-normal);
  text-transform: uppercase;
  margin-bottom: 16px;
}

/* Body Text */
.body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-normal);
  margin-bottom: 16px;
}

.body-small {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-normal);
  margin-bottom: 8px;
}

.caption {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-normal);
  margin-bottom: 8px;
}

/* Buttons */
.btn-primary {
  font-family: var(--font-pixel);
  font-size: var(--text-pixel-base);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-normal);
  text-transform: uppercase;
}

.btn-secondary {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-wide);
  font-weight: 600;
}
```

---

## Usage Examples

### Onboarding Screens (Story 1.4)

#### Welcome Screen Title
```jsx
<Text style={typography.h1}>
  WELCOME TO 16BITFIT
</Text>
```

#### Tagline
```jsx
<Text style={typography.body}>
  Your fitness journey starts here.
</Text>
```

#### Primary CTA
```jsx
<TouchableOpacity>
  <Text style={typography.buttonPrimary}>
    GET STARTED
  </Text>
</TouchableOpacity>
```

---

#### Profile Setup Screen

**Section Header:**
```jsx
<Text style={typography.h2}>
  CREATE PROFILE
</Text>
```

**Form Label:**
```jsx
<Text style={typography.inputLabel}>
  Username
</Text>
```

**Form Input:**
```jsx
<TextInput
  placeholder="Enter username..."
  placeholderTextColor={tokens.text.tertiary}
  style={typography.inputText}
/>
```

**Helper Text:**
```jsx
<Text style={typography.inputHelper}>
  Must be 3-20 characters (letters, numbers, underscore)
</Text>
```

**Error Message:**
```jsx
<Text style={typography.inputError}>
  Username already taken. Please try another.
</Text>
```

---

#### Archetype Selection Screen

**Screen Title:**
```jsx
<Text style={typography.h2}>
  SELECT ARCHETYPE
</Text>
```

**Archetype Card Title:**
```jsx
<Text style={typography.h3}>
  RUNNER
</Text>
```

**Archetype Description:**
```jsx
<Text style={typography.bodySmall}>
  Built for endurance and speed. Perfect for cardio enthusiasts.
</Text>
```

---

## Typography Don'ts (Common Mistakes)

❌ **Don't mix pixel fonts and body fonts in the same line**
```jsx
// BAD
<Text>
  <Text style={typography.h3}>LEVEL</Text>
  <Text style={typography.body}> 12</Text>
</Text>
```

✅ **Do use consistent font families per element**
```jsx
// GOOD
<Text style={typography.h3}>LEVEL 12</Text>
```

---

❌ **Don't use pixel fonts for long paragraphs**
```jsx
// BAD - unreadable
<Text style={typography.h3}>
  This is a very long description that explains the archetype selection process
  in great detail. Pixel fonts become extremely difficult to read at this length.
</Text>
```

✅ **Do use body fonts for paragraphs**
```jsx
// GOOD
<Text style={typography.body}>
  This is a clear, readable description that users can easily scan and understand.
</Text>
```

---

❌ **Don't adjust letter spacing on pixel fonts**
```jsx
// BAD - breaks bitmap alignment
<Text style={[typography.h2, { letterSpacing: 2 }]}>
  TITLE
</Text>
```

✅ **Do keep pixel fonts at default spacing**
```jsx
// GOOD
<Text style={typography.h2}>
  TITLE
</Text>
```

---

❌ **Don't use font sizes that aren't multiples of 8**
```jsx
// BAD - breaks pixel grid
<Text style={{ fontSize: 17 }}>
  Awkward Text
</Text>
```

✅ **Do use 8px multiples**
```jsx
// GOOD
<Text style={{ fontSize: 16 }}>
  Aligned Text
</Text>
```

---

## Performance Optimization

### Font Loading Strategy
```javascript
// Expo - Load fonts before app renders
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'PressStart2P-Regular': require('./assets/fonts/PressStart2P-Regular.ttf'),
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <AppNavigator />;
}
```

### Minimize Font Weights
Only load the weights you actually use:
- ✅ Montserrat Regular (400) - Body text
- ✅ Montserrat Medium (500) - Emphasis
- ✅ Montserrat SemiBold (600) - Strong emphasis
- ✅ Montserrat Bold (700) - Rare critical emphasis
- ❌ Don't load Thin/ExtraLight/Black unless explicitly needed

---

## Next Steps

1. ✅ **Design Tokens Complete**
2. ✅ **Typography System Complete** (This Document)
3. ⏭️ **Animation Specifications** (Timing, easing, haptics)
4. ⏭️ **Component Library** (Buttons, inputs, cards)

---

## Version History
- **v1.0** (2025-10-31): Initial typography system - Press Start 2P + Montserrat pairing, complete size scale, React Native implementation, accessibility guidelines.

---

**Document Owner:** UI/UX Specialist (Sally)
**Approved By:** Architect (Pending)
**Last Updated:** 2025-10-31
