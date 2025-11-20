/**
 * 16BitFit Design Tokens
 *
 * Core visual language defining colors, spacing, borders, and shadows.
 * Based on LCD Screen-Only 4-color palette for authentic retro aesthetic.
 *
 * **Official Palette:** See docs/design-system/design-tokens-LCD.md
 * **4 Colors:** #9BBC0F (lightest), #0F380F (darkest), #8BAC0F (medium-light), #306230 (medium-dark)
 */

import { ViewStyle } from 'react-native';

// ─────────────────────────────────────────────────────────
// Color Palette - LCD Screen-Only Theme (4 colors)
// ─────────────────────────────────────────────────────────

export const tokens = {
  colors: {
    // Background colors (LCD Screen-Only theme)
    background: {
      primary: '#9BBC0F',    // Neon grass glow (lightest) - Screen background
      secondary: '#8BAC0F',  // Lime highlight - Alternate backgrounds
      elevated: '#306230',   // Pine border - Cards, modals
      overlay: '#0F380Fcc',  // 80% opacity deep forest shadow - Overlays
    },

    // Text colors (LCD Screen-Only theme)
    text: {
      primary: '#0F380F',    // Deep forest shadow (darkest) - Body text, headers
      secondary: '#306230',  // Pine border - Muted text, captions
      muted: '#8BAC0F',      // Lime highlight - Helper text, hints
      inverse: '#9BBC0F',    // Neon grass glow - Text on dark backgrounds
    },

    // Border colors
    border: {
      default: '#306230',    // Input fields, dividers
      highlight: '#8BAC0F',  // Selected states, active elements
      focus: '#9BBC0F',      // Focus rings, interactive states
    },

    // Button colors
    button: {
      primary: '#8BAC0F',      // Lime highlight - Primary buttons
      primaryText: '#0F380F',  // Deep forest - Text on primary buttons
      secondary: '#306230',    // Pine border - Secondary buttons
      secondaryText: '#9BBC0F', // Neon grass - Text on secondary buttons
    },

    // Input field colors
    input: {
      background: '#9BBC0F',   // Neon grass - Input background
      border: '#306230',       // Pine border - Input border
      text: '#0F380F',         // Deep forest - Input text
      placeholder: '#8BAC0F',  // Lime highlight - Placeholder text
      focus: '#8BAC0F',        // Lime highlight - Focus ring
    },

    // Interactive states
    states: {
      active: '#8BAC0F',       // Lime highlight - Active elements
      inactive: '#306230',     // Pine border - Inactive elements
      disabled: '#306230',     // Pine border - Disabled elements (use with opacity)
      hover: '#8BAC0F',        // Lime highlight - Hover states
    },

    // Feedback colors
    feedback: {
      success: '#8BAC0F',      // Success messages, achievements
      warning: '#9BBC0F',      // Warnings, attention states
      error: '#306230',        // Errors (muted in LCD palette)
      errorText: '#9BBC0F',    // Neon grass - Error text on dark backgrounds
      info: '#8BAC0F',         // Info messages, tooltips
    },

    // Legacy interactive tokens (deprecated - use button/states instead)
    interactive: {
      primary: '#8BAC0F',    // Primary buttons, CTAs
      hover: '#9BBC0F',      // Hover states
      active: '#306230',     // Pressed states
      disabled: '#306230',   // Disabled elements
    },

    // Raw DMG palette values (for reference)
    dmg: {
      darkest: '#0F380F',    // rgb(15, 56, 15) - Deep forest shadow
      dark: '#306230',       // rgb(48, 98, 48) - Pine border
      light: '#8BAC0F',      // rgb(139, 172, 15) - Lime highlight
      lightest: '#9BBC0F',   // rgb(155, 188, 15) - Neon grass glow
    },
  },

  // ─────────────────────────────────────────────────────────
  // Spacing Scale - 8px Base Grid System
  // ─────────────────────────────────────────────────────────

  spacing: {
    0: 0,      // No space
    1: 4,      // Extra tight padding
    2: 8,      // Minimum touch padding, tight grouping
    3: 16,     // Standard padding, comfortable breathing room
    4: 24,     // Section spacing, moderate separation
    5: 32,     // Large section breaks, screen padding
    6: 40,     // Extra-large spacing
    7: 48,     // Dramatic separation
    8: 64,     // Hero spacing, major screen sections
    9: 80,     // Maximum spacing (rare)
    10: 96,    // Ultra-wide (desktop only)
  },

  // Component-specific spacing shortcuts
  component: {
    buttonPaddingX: 24,      // Horizontal button padding
    buttonPaddingY: 16,      // Vertical button padding
    inputPaddingX: 16,       // Input field horizontal padding
    inputPaddingY: 16,       // Input field vertical padding
    cardPadding: 24,         // Card internal padding
    screenPaddingX: 24,      // Screen horizontal margins
    screenPaddingY: 32,      // Screen vertical margins (top/bottom)
    stackGap: 16,            // Vertical stack spacing between elements
    gridGap: 16,             // Grid spacing between items
    sectionGap: 48,          // Gap between major screen sections
  },

  // ─────────────────────────────────────────────────────────
  // Border System
  // ─────────────────────────────────────────────────────────

  border: {
    width: {
      none: 0,
      thin: 2,       // Subtle dividers only
      default: 3,    // Standard retro border (most common)
      thick: 4,      // Emphasized borders (selected states)
      heavy: 6,      // Hero elements, major focus states
      pixel: 1,      // Only for grid lines or very subtle dividers
    },
    radius: 0,       // Pure retro - no rounding
  },

  // ─────────────────────────────────────────────────────────
  // Shadow System - Pixel-Perfect Hard Shadows
  // ─────────────────────────────────────────────────────────

  shadow: {
    small: {
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,     // Hard edge, no blur
      shadowColor: '#0F380F',
      elevation: 2,        // Android elevation
    } as ViewStyle,

    medium: {
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,     // Hard edge, no blur
      shadowColor: '#0F380F',
      elevation: 4,        // Android elevation
    } as ViewStyle,

    large: {
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 0,     // Hard edge, no blur
      shadowColor: '#0F380F',
      elevation: 6,        // Android elevation
    } as ViewStyle,
  },

  // ─────────────────────────────────────────────────────────
  // Opacity Scale
  // ─────────────────────────────────────────────────────────

  opacity: {
    invisible: 0,
    faint: 0.1,      // Subtle overlays
    light: 0.2,      // Grid lines, very subtle dividers
    muted: 0.4,      // Disabled text
    medium: 0.6,     // Secondary elements
    visible: 0.8,    // Overlays with content
    opaque: 0.9,     // Near-opaque overlays
    solid: 1,        // Fully opaque (default)
  },

  // ─────────────────────────────────────────────────────────
  // Z-Index Scale
  // ─────────────────────────────────────────────────────────

  zIndex: {
    base: 0,         // Default layer
    dropdown: 1000,  // Dropdowns, tooltips
    sticky: 1100,    // Sticky headers
    modal: 1200,     // Modals, dialogs
    popover: 1300,   // Popovers, context menus
    toast: 1400,     // Toast notifications
    tooltip: 1500,   // Tooltips (highest UI layer)
  },

  // ─────────────────────────────────────────────────────────
  // Icon & Touch Target Sizes
  // ─────────────────────────────────────────────────────────

  iconSize: {
    xs: 16,      // Small inline icons, list bullets
    sm: 24,      // Standard UI icons, navigation
    md: 32,      // Large buttons, feature icons
    lg: 48,      // Hero icons, empty states
    xl: 64,      // Large feature graphics
    xxl: 80,     // Archetype avatars (Story 1.4 requirement)
    hero: 96,    // Splash screens, onboarding heroes
  },

  touchTarget: {
    minimum: 44,      // Apple HIG minimum (44×44dp)
    comfortable: 48,  // Google Material minimum (48×48dp)
    optimal: 60,      // Recommended for primary CTAs
    large: 80,        // Large cards, archetype selection
  },
};
