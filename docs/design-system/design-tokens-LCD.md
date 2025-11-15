# 16BitFit Design Tokens - LCD Screen-Only Theme
## Official Color Palette for Production Development

**Version:** 1.0
**Last Updated:** 2025-11-09
**Status:** 🔴 OFFICIAL - Use this palette for ALL 16BitFit development
**Viewport:** 329×584pt (LCD screen dimensions)

---

## ⚠️ IMPORTANT: THIS IS THE CORRECT COLOR PALETTE

**This document supersedes any previous references to "DMG Palette" or "DMG-Gameboy-Palette.md".**

While the 4 hex color values are the same as the DMG palette (#9BBC0F, #0F380F, #8BAC0F, #306230), the **LCD Screen-Only theme** provides the correct semantic naming and usage patterns optimized for our 329×584pt LCD viewport.

**Source:** `docs/design-system/magicpath-prompt-library.md` - Theme 6: LCD Screen Content

---

## 🎨 THE 4 LCD COLORS

These are the ONLY colors allowed in the 16BitFit app:

| Color Name | Hex Code | OKLCH | Usage | Semantic Token |
|------------|----------|-------|-------|----------------|
| **Neon Grass Glow** | `#9BBC0F` | `oklch(0.9533 0.1124 127.8456)` | Primary backgrounds, lightest shade | `--background` |
| **Deep Forest Shadow** | `#0F380F` | `oklch(0.2368 0.0531 136.0921)` | Primary text, darkest shade | `--foreground` |
| **Lime Highlight** | `#8BAC0F` | `oklch(0.6839 0.1089 127.5847)` | Buttons, CTAs, focus states | `--primary` |
| **Pine Border** | `#306230` | `oklch(0.4112 0.0442 136.2584)` | Borders, dividers, secondary text | `--secondary` |

---

## 📐 COMPLETE TOKEN SYSTEM

### Base Colors
```typescript
export const colors = {
  // Background & Foreground
  background: {
    primary: '#9BBC0F',      // Neon grass glow (lightest)
    secondary: '#8BAC0F',    // Lime highlight (medium-light)
    darkest: '#0F380F',      // Deep forest shadow
  },

  foreground: {
    primary: '#0F380F',      // Deep forest shadow (darkest)
    secondary: '#306230',    // Pine border (medium-dark)
    lightest: '#9BBC0F',     // Neon grass glow
  },

  // Interactive Elements
  text: {
    primary: '#0F380F',      // Deep forest - main text
    secondary: '#306230',    // Pine border - secondary text
    muted: '#8BAC0F',        // Lime - helper text
    inverse: '#9BBC0F',      // Neon grass - text on dark bg
  },

  // Buttons & CTAs
  button: {
    primary: '#8BAC0F',      // Lime highlight
    primaryText: '#0F380F',  // Deep forest
    secondary: '#306230',    // Pine border
    secondaryText: '#9BBC0F', // Neon grass
  },

  // Borders & Dividers
  border: {
    default: '#306230',      // Pine border
    light: '#8BAC0F',        // Lime highlight
    dark: '#0F380F',         // Deep forest
  },

  // Input Fields
  input: {
    background: '#9BBC0F',   // Neon grass
    border: '#306230',       // Pine border
    text: '#0F380F',         // Deep forest
    placeholder: '#8BAC0F',  // Lime highlight
    focus: '#8BAC0F',        // Lime - focus ring
  },

  // States
  states: {
    active: '#8BAC0F',       // Lime highlight
    inactive: '#306230',     // Pine border
    disabled: '#8BAC0F',     // Lime at 40% opacity
    hover: '#8BAC0F',        // Lime highlight
  },

  // Feedback
  feedback: {
    // No harsh reds - use muted pine for errors
    error: '#306230',        // Pine border
    errorText: '#9BBC0F',    // Neon grass
    success: '#8BAC0F',      // Lime highlight
    warning: '#306230',      // Pine border
  },
};
```

---

## 🚫 STRICT RULES

### Rule 1: Only 4 Colors Allowed
❌ **NEVER** use any color outside these 4:
- `#9BBC0F` (Neon grass glow)
- `#0F380F` (Deep forest shadow)
- `#8BAC0F` (Lime highlight)
- `#306230` (Pine border)

✅ **ALWAYS** reference design tokens, not hardcoded hex values.

### Rule 2: No Gradients
❌ **NEVER** use `LinearGradient`, `RadialGradient`, or CSS gradients
✅ **ALWAYS** use solid colors

### Rule 3: No Transparency (Except Modals)
❌ **NEVER** use `opacity < 1.0` for regular UI elements
✅ **ONLY** use 80% opacity for modal overlays:
```typescript
backgroundColor: 'rgba(15, 56, 15, 0.8)' // Deep forest at 80%
```

### Rule 4: Zero Border Radius
❌ **NEVER** use rounded corners
✅ **ALWAYS** use sharp pixel-perfect edges:
```typescript
borderRadius: 0
```

### Rule 5: Zero Shadow Radius
❌ **NEVER** use blurred shadows
✅ **ALWAYS** use hard pixel shadows:
```typescript
shadowRadius: 0
shadowOffset: { width: 4, height: 4 }
shadowColor: '#0F380F'
```

---

## 📏 SPACING SYSTEM (LCD Optimized)

Scaled down for 329×584pt LCD viewport:

```typescript
export const spacing = {
  xs: 4,      // Tight spacing (icons, small gaps)
  sm: 8,      // Small spacing (padding, margins)
  md: 12,     // Medium spacing (between elements)
  lg: 16,     // Large spacing (section gaps)
  xl: 20,     // Extra large (screen padding)
  xxl: 24,    // Screen horizontal margins
};
```

---

## 🔤 TYPOGRAPHY SYSTEM

### Fonts
```typescript
export const fonts = {
  heading: 'PressStart2P-Regular',  // Pixel font for headers/buttons
  body: 'Montserrat',               // Modern sans-serif for body text
};
```

### Type Scale (LCD Optimized)
```typescript
export const typography = {
  // Headers (Press Start 2P)
  h1: { fontSize: 20, lineHeight: 24, fontFamily: 'PressStart2P-Regular' },
  h2: { fontSize: 16, lineHeight: 20, fontFamily: 'PressStart2P-Regular' },
  h3: { fontSize: 12, lineHeight: 16, fontFamily: 'PressStart2P-Regular' },

  // Body (Montserrat)
  body: { fontSize: 14, lineHeight: 20, fontFamily: 'Montserrat' },
  bodySmall: { fontSize: 12, lineHeight: 16, fontFamily: 'Montserrat' },
  caption: { fontSize: 10, lineHeight: 14, fontFamily: 'Montserrat' },

  // Buttons
  button: { fontSize: 12, lineHeight: 16, fontFamily: 'PressStart2P-Regular' },
  buttonSmall: { fontSize: 10, lineHeight: 14, fontFamily: 'PressStart2P-Regular' },
};
```

---

## 🎭 SHADOWS

### Hard Pixel Shadows (DMG Style)
```typescript
export const shadows = {
  sm: {
    shadowColor: '#0F380F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,  // NO BLUR
  },
  md: {
    shadowColor: '#0F380F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,  // NO BLUR
  },
  lg: {
    shadowColor: '#0F380F',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,  // NO BLUR
  },
};
```

---

## 📦 BORDERS

```typescript
export const borders = {
  width: {
    thin: 1,
    default: 2,
    thick: 4,
  },
  radius: 0,  // ALWAYS 0 (no rounded corners)
  color: {
    default: '#306230',  // Pine border
    light: '#8BAC0F',    // Lime highlight
    dark: '#0F380F',     // Deep forest
  },
};
```

---

## 🔍 USAGE EXAMPLES

### Button Component
```typescript
<View style={{
  backgroundColor: colors.button.primary,      // #8BAC0F (Lime)
  borderWidth: borders.width.default,          // 2px
  borderColor: borders.color.dark,             // #0F380F (Deep forest)
  borderRadius: borders.radius,                // 0
  paddingHorizontal: spacing.md,               // 12px
  paddingVertical: spacing.sm,                 // 8px
  ...shadows.md,                               // Hard pixel shadow
}}>
  <Text style={{
    color: colors.button.primaryText,          // #0F380F (Deep forest)
    ...typography.button,                      // Press Start 2P, 12px
  }}>
    PRESS START
  </Text>
</View>
```

### Input Field
```typescript
<TextInput
  style={{
    backgroundColor: colors.input.background,  // #9BBC0F (Neon grass)
    borderWidth: borders.width.default,        // 2px
    borderColor: colors.input.border,          // #306230 (Pine border)
    borderRadius: borders.radius,              // 0
    paddingHorizontal: spacing.md,             // 12px
    paddingVertical: spacing.sm,               // 8px
    color: colors.input.text,                  // #0F380F (Deep forest)
    ...typography.body,                        // Montserrat, 14px
  }}
  placeholderTextColor={colors.input.placeholder} // #8BAC0F (Lime)
/>
```

### Card Component
```typescript
<View style={{
  backgroundColor: colors.background.primary,  // #9BBC0F (Neon grass)
  borderWidth: borders.width.thick,            // 4px
  borderColor: colors.border.default,          // #306230 (Pine border)
  borderRadius: borders.radius,                // 0
  padding: spacing.lg,                         // 16px
  ...shadows.lg,                               // 6px hard shadow
}}>
  <Text style={{
    color: colors.text.primary,                // #0F380F (Deep forest)
    ...typography.h2,                          // Press Start 2P, 16px
  }}>
    GAME BOY
  </Text>
</View>
```

---

## ✅ COMPLIANCE CHECKLIST

Before merging any PR, verify:

- [ ] Only 4 LCD colors used (`#9BBC0F`, `#0F380F`, `#8BAC0F`, `#306230`)
- [ ] All colors reference design tokens (no hardcoded hex values)
- [ ] No `borderRadius` values > 0
- [ ] No `shadowRadius` values > 0
- [ ] No gradients (`LinearGradient`, etc.)
- [ ] No opacity < 1.0 (except modal overlays at 80%)
- [ ] Shadows use `shadowRadius: 0` (hard pixel edges)
- [ ] Typography uses only Press Start 2P or Montserrat
- [ ] Spacing values from spacing system (not random numbers)

---

## 📚 RELATED DOCUMENTATION

- **Source Specification:** `docs/design-system/magicpath-prompt-library.md` (Theme 6: LCD Screen Content)
- **Implementation:** `apps/mobile-shell/src/design-system/tokens.ts`
- **Compliance Checklist:** `docs/design-system/LCD-PALETTE-COMPLIANCE-CHECKLIST.md`
- **Typography Guide:** `docs/design-system/typography.md`
- **Component Examples:** `docs/design-system/atomic-components.md`

---

## 🔄 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-09 | Initial LCD Screen-Only theme documentation. Supersedes DMG palette references. 4 colors defined with semantic tokens, spacing system, typography, shadows, borders, and strict compliance rules. |

---

**Document Owner:** Architect
**Approved By:** Product Owner
**Status:** 🟢 ACTIVE - Official design system specification

---

_This is the single source of truth for 16BitFit color system. All screens, components, and features MUST use this palette._
