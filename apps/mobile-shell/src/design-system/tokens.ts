/**
 * 16BitFit Design Tokens
 * DMG Game Boy Classic Palette
 *
 * This file defines the core visual language of 16BitFit.
 * All components must reference these tokens to maintain consistency.
 */

export const colors = {
  dmg: {
    darkest: '#0F380F',   // Deep forest shadow - text, shadows
    dark: '#306230',      // Pine border - borders, outlines
    light: '#8BAC0F',     // Lime highlight - highlights, active states
    lightest: '#9BBC0F',  // Neon grass glow - backgrounds, base
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderWidth = {
  thin: 2,      // Dividers
  medium: 3,    // Default
  thick: 4,     // Emphasis
} as const;

export const borderRadius = {
  none: 0,      // Pure retro, zero rounding
  subtle: 2,    // Only if absolutely necessary
  small: 4,     // Rare - use sparingly
} as const;

export const typography = {
  // Font families
  fonts: {
    pixel: 'PressStart2P-Regular',  // Primary pixel font
    body: 'Montserrat-Regular',     // Secondary body font
    bodySemiBold: 'Montserrat-SemiBold',
    bodyBold: 'Montserrat-Bold',
  },
  // Font sizes
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
} as const;

export const iconSize = {
  xs: 16,    // Small inline icons, list bullets
  sm: 24,    // Standard UI icons, navigation
  md: 32,    // Large buttons, feature icons
  lg: 48,    // Hero icons, empty states
  xl: 64,    // Large feature graphics
  xxl: 80,   // Archetype avatars
  hero: 96,  // Splash screens, onboarding
} as const;

export const touchTarget = {
  minimum: 44,      // Apple HIG minimum
  comfortable: 48,  // Google Material minimum
  optimal: 60,      // Recommended for primary CTAs
  large: 80,        // Large cards, archetype selection
} as const;

export const opacity = {
  invisible: 0,
  faint: 0.1,
  light: 0.2,
  muted: 0.4,
  medium: 0.6,
  visible: 0.8,
  opaque: 0.9,
  solid: 1,
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  toast: 1400,
  tooltip: 1500,
} as const;

// Export all tokens as a single object
export const tokens = {
  colors,
  spacing,
  borderWidth,
  borderRadius,
  typography,
  iconSize,
  touchTarget,
  opacity,
  zIndex,
} as const;

export default tokens;
