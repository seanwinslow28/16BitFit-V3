# 16BitFit MagicPath.ai Prompt Library
## Version 1.1 | Story 1.4 Complete Prompt Collection

This document provides production-ready prompts for MagicPath.ai to rapidly prototype all three onboarding screens for 16BitFit, incorporating advanced MagicPath.ai techniques, design system integration, and animation specifications.

---

## 🚀 Quick Start Guide

**Choose your workflow:**

### Option A: LCD Screen-Only (Production Development)
**Use when:** Creating exportable React Native components, developer handoff
1. **Import:** Theme 6 "LCD Screen Content" (Step 0A below)
2. **Set viewport:** 329×584pt in MagicPath.ai
3. **Use prompts:** [LCD Screen-Only Prompts](#lcd-screen-only-prompts-use-with-theme-6-lcd-screen-content)
4. **Result:** Screen content only (wrap in GameBoyShell component later)

### Option B: Game Boy Shell Mockup (Presentations/Marketing)
**Use when:** Stakeholder demos, App Store screenshots, marketing materials
1. **Import:** Theme 5 "Game Boy Shell Hardware" (Step 0B below)
2. **Set viewport:** 393×852pt in MagicPath.ai
3. **Use prompts:** [Game Boy Shell Mockup Prompts](#game-boy-shell-mockup-variant-full-device-view)
4. **Result:** Complete device mockup with hardware + LCD screen

### Option C: Full-Screen Designs (Flexible Exploration)
**Use when:** Exploring alternative themes, larger screens, more spacing
1. **Import:** Themes 1-4 "DMG/Neon/Pulse/Synthwave" (Step 0B below)
2. **Set viewport:** 393×852pt in MagicPath.ai
3. **Use prompts:** [Full-Screen Prompts](#full-screen-prompts-use-with-themes-1-4-dmg-neon-pulse-synthwave)
4. **Result:** Full mobile screen designs with theme flexibility

---

## Table of Contents

1. [MagicPath.ai Advanced Features & Workflow](#magicpath-ai-advanced-features--workflow)
2. [Design System Setup](#design-system-setup)
   - [Step 0A: LCD Screen-Only Theme](#step-0a-lcd-screen-only-theme-for-production-development)
   - [Step 0B: Full-Screen & Shell Themes](#step-0b-import-shadcn-compatible-css-themes-full-screen-variants)
3. [LCD Screen-Only Prompts](#lcd-screen-only-prompts-use-with-theme-6-lcd-screen-content) ⭐ **NEW**
   - [LCD WelcomeScreen](#lcd-welcomescreen-screen-only-no-shell)
   - [LCD ProfileSetupScreen](#lcd-profilesetupscreen-screen-only-no-shell)
   - [LCD ArchetypeSelectionScreen](#lcd-archetypeselectionscreen-screen-only-no-shell)
4. [Full-Screen Prompts](#full-screen-prompts-use-with-themes-1-4-dmg-neon-pulse-synthwave)
   - [Screen 1: WelcomeScreen](#screen-1-welcomescreen-prompts)
   - [Screen 2: ProfileSetupScreen](#screen-2-profilesetupscreen-prompts)
   - [Screen 3: ArchetypeSelectionScreen](#screen-3-archetypeselectionscreen-prompts)
5. [Game Boy Shell Mockup Variant](#game-boy-shell-mockup-variant-full-device-view)
   - [WelcomeScreen Shell Mockup](#full-device-mockup-prompt-welcomescreen-example)
   - [ProfileSetupScreen Shell Mockup](#full-device-mockup-prompt-profilesetupscreen-screen-2-of-3)
   - [ArchetypeSelectionScreen Shell Mockup](#full-device-mockup-prompt-archetypeselectionscreen-screen-3-of-3)
6. [Component Library Prompts](#component-library-prompts)
7. [Animation & Micro-Interaction Prompts](#animation--micro-interaction-prompts)
8. [Iteration & Refinement Prompts](#iteration--refinement-prompts)

---

## MagicPath.ai Advanced Features & Workflow

### Power-User Tips (From Deep Research)

Before you start, understand these critical MagicPath.ai capabilities:

#### 1. **Component Recall with `@component_name`**
Once you create a component, recall it in future prompts using `@`:
```
"Add @PixelButton component below the hero text"
"Use @ArchetypeCard for the grid layout"
```

#### 2. **Design Reference Feature**
- Select a master element → Convert to Design Reference
- Reuse via prompts: "Create a section using @ButtonReference with gradient background"
- Enforces consistency across screens

#### 3. **Variant Generation**
- Generate multiple design options at once: "Show me 3 variants of this hero section"
- Rapidly explore color schemes and layouts without rewriting prompts

#### 4. **Reference Images**
- Attach screenshots to anchor visual style
- Click image icon in prompt area → upload reference
- MagicPath matches layout and aesthetics automatically

#### 5. **Built-in Design Systems**
- Access pre-made systems (OpenAI, Claude, Airbnb)
- Customize colors, fonts, borders → save for reuse
- Located in sidebar: "Design Systems" panel

#### 6. **Import Figma Variables**
- Export Figma tokens as CSS variables
- Import into MagicPath → preserves brand typography, colors, spacing
- Essential for maintaining design consistency

---

## Design System Setup

### Step 0A: LCD Screen-Only Theme (For Production Development)

**Purpose**: This theme is specifically for generating **screen content only** (without Game Boy shell hardware). Use this when you want to design the actual app UI that will be exported to React Native, or when you want to create mockups that can later be wrapped in the GameBoyShell component.

This theme uses the **exact specifications** from the LCD screens in the Game Boy Shell Mockups, including the scaled-down sizes, reduced spacing, and optimized typography for the 329×584pt LCD viewport.

#### 🎮 Theme 6: LCD Screen Content (329×584pt - Production Ready)

**Viewport**: 329×584pt (LCD screen dimensions from Game Boy mockup)
**Use for**: Screen-only designs, developer handoff, React Native component exports

```css
:root {
  /* Base Colors - DMG 4-Color Palette */
  --background: oklch(0.9533 0.1124 127.8456);        /* #9BBC0F - Neon grass glow (lightest) */
  --foreground: oklch(0.2368 0.0531 136.0921);        /* #0F380F - Deep forest shadow (darkest) */

  /* Card Components */
  --card: oklch(0.9533 0.1124 127.8456);              /* #9BBC0F - Same as background */
  --card-foreground: oklch(0.2368 0.0531 136.0921);   /* #0F380F - Darkest green */

  /* Popover Components */
  --popover: oklch(0.9533 0.1124 127.8456);           /* #9BBC0F */
  --popover-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F */

  /* Primary Actions (Buttons, CTAs) */
  --primary: oklch(0.6839 0.1089 127.5847);           /* #8BAC0F - Lime highlight (medium-light) */
  --primary-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F - Deep forest */

  /* Secondary Elements */
  --secondary: oklch(0.4112 0.0442 136.2584);         /* #306230 - Pine border (medium-dark) */
  --secondary-foreground: oklch(0.9533 0.1124 127.8456); /* #9BBC0F - Neon grass */

  /* Accent Highlights */
  --accent: oklch(0.6839 0.1089 127.5847);            /* #8BAC0F - Lime */
  --accent-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F - Deep forest */

  /* Muted/Subtle Elements */
  --muted: oklch(0.4112 0.0442 136.2584);             /* #306230 - Pine border */
  --muted-foreground: oklch(0.6839 0.1089 127.5847);  /* #8BAC0F - Lime (for helper text) */

  /* Destructive Actions */
  --destructive: oklch(0.4112 0.0442 136.2584);       /* #306230 - Muted error (no harsh reds) */
  --destructive-foreground: oklch(0.9533 0.1124 127.8456); /* #9BBC0F */

  /* Borders & Inputs */
  --border: oklch(0.4112 0.0442 136.2584);            /* #306230 - Pine border */
  --input: oklch(0.9533 0.1124 127.8456);             /* #9BBC0F - Same as background */
  --ring: oklch(0.6839 0.1089 127.5847);              /* #8BAC0F - Focus ring (lime) */

  /* Chart Colors (if needed) */
  --chart-1: oklch(0.9533 0.1124 127.8456);           /* #9BBC0F */
  --chart-2: oklch(0.6839 0.1089 127.5847);           /* #8BAC0F */
  --chart-3: oklch(0.4112 0.0442 136.2584);           /* #306230 */
  --chart-4: oklch(0.3240 0.0487 136.1752);           /* Elevated pine */
  --chart-5: oklch(0.2368 0.0531 136.0921);           /* #0F380F */

  /* Design System */
  --radius: 0rem;                                      /* Pure retro - no rounding */
}

.dark {
  /* Dark mode: Inverted DMG palette */
  --background: oklch(0.2368 0.0531 136.0921);        /* #0F380F - Deep forest */
  --foreground: oklch(0.9533 0.1124 127.8456);        /* #9BBC0F - Neon grass */

  --card: oklch(0.3240 0.0487 136.1752);              /* Elevated pine */
  --card-foreground: oklch(0.9533 0.1124 127.8456);   /* #9BBC0F */

  --popover: oklch(0.3240 0.0487 136.1752);           /* Elevated */
  --popover-foreground: oklch(0.9533 0.1124 127.8456); /* #9BBC0F */

  --primary: oklch(0.6839 0.1089 127.5847);           /* #8BAC0F - Lime */
  --primary-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F */

  --secondary: oklch(0.4112 0.0442 136.2584);         /* #306230 */
  --secondary-foreground: oklch(0.9533 0.1124 127.8456); /* #9BBC0F */

  --accent: oklch(0.6839 0.1089 127.5847);            /* #8BAC0F */
  --accent-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F */

  --muted: oklch(0.3240 0.0487 136.1752);             /* Elevated pine */
  --muted-foreground: oklch(0.6839 0.1089 127.5847);  /* #8BAC0F */

  --destructive: oklch(0.4112 0.0442 136.2584);       /* #306230 */
  --destructive-foreground: oklch(0.9533 0.1124 127.8456); /* #9BBC0F */

  --border: oklch(0.4112 0.0442 136.2584);            /* #306230 */
  --input: oklch(0.4112 0.0442 136.2584);             /* #306230 */
  --ring: oklch(0.9533 0.1124 127.8456);              /* #9BBC0F */

  --chart-1: oklch(0.9533 0.1124 127.8456);           /* #9BBC0F */
  --chart-2: oklch(0.6839 0.1089 127.5847);           /* #8BAC0F */
  --chart-3: oklch(0.4112 0.0442 136.2584);           /* #306230 */
  --chart-4: oklch(0.3240 0.0487 136.1752);           /* Elevated */
  --chart-5: oklch(0.2368 0.0531 136.0921);           /* #0F380F */

  --radius: 0rem;
}
```

**Typography Scale (LCD Screen Content - Optimized for 329×584pt):**
```
Display (Hero): 1.5rem (24px) - Screen titles, hero text
XL Large: 1.25rem (20px) - Section headers (reduced from 32px)
Large: 1.125rem (18px) - Card titles (reduced from 24px)
Base: 1rem (16px) - Primary button text (reduced from 18px)
Medium: 0.875rem (14px) - Body text, input fields (reduced from 16px)
Small: 0.75rem (12px) - Helper text, labels (reduced from 14px)
XSmall: 0.625rem (10px) - Captions, micro text (reduced from 12px)

Font Families:
- Display/Headings: "Press Start 2P", monospace
- Body/Forms: "Montserrat", sans-serif
```

**Spacing Scale (LCD Optimized - 20% reduction from full screen):**
```
space-1: 6px   (reduced from 8px)
space-2: 12px  (reduced from 16px)
space-3: 20px  (reduced from 24px)
space-4: 24px  (reduced from 32px)
space-5: 32px  (reduced from 40px)
space-6: 40px  (reduced from 48px)
space-8: 48px  (reduced from 64px)
```

**Component Sizes (LCD Optimized):**
```
Buttons:
- Primary: 280px width × 44px height
- Secondary: 280px width × 40px height
- Minimum touch target: 44×44px (maintained)

Input Fields:
- Width: 280px
- Height: 44px
- Border: 3px solid
- Padding: 12px horizontal

Progress Dots:
- Active: 16×16px
- Inactive: 12×12px
- Gap: 12px

Cards (Archetype):
- Width: 134px
- Height: 156px
- Padding: 12px
- Avatar: 60×60px
- Border: 3px (default), 4px (selected)
```

**Effects & Shadows (LCD Optimized):**
```
Border Radius: 0rem (sharp corners - authentic retro)
Pixel Shadow: 4×4px offset, #306230 color, no blur
Border Width: 3px default, 4px for selected/emphasis states
LCD Effects (Optional):
  - Scanlines: 1px horizontal lines every 2px, 5% opacity #0F380F
  - Vignette: Subtle radial gradient, darker edges at 10% opacity
```

**Design Rules (LCD Screen Content):**
```
VIEWPORT & LAYOUT:
- Design for 329×584pt viewport (LCD screen dimensions)
- Safe areas: 20pt top, 20pt bottom (within LCD)
- Horizontal margins: 24px (creates 280px content width)
- All spacing reduced by ~20% compared to full-screen designs

COLOR USAGE:
- Background: Always #9BBC0F (lightest green)
- Primary text: Always #0F380F (darkest green)
- Buttons/CTAs: #8BAC0F background with #0F380F text
- Borders/dividers: #306230 (medium-dark green)
- Helper text: #8BAC0F or #306230 depending on emphasis
- STRICT 4-COLOR PALETTE - No other colors allowed

TYPOGRAPHY:
- Headings: Press Start 2P (pixel font), sizes 18-24px max
- Body: Montserrat (clean sans-serif), sizes 10-14px
- All sizes ~20% smaller than full-screen equivalents
- Line-height: 1.4-1.5 for readability on small screen

INTERACTIONS:
- Zero border-radius (sharp corners)
- Hard pixel shadows (4×4px, no blur)
- 3px borders default, 4px for emphasis
- Button press: Scale to 0.98 (100ms)
- Focus state: Border width 3px→4px, color change to --ring

CONSTRAINTS:
- No scrolling on WelcomeScreen (fits in 329×584pt)
- Minimal scrolling on ProfileSetupScreen (if needed)
- Scrolling acceptable on ArchetypeSelectionScreen (5 cards + CTA)
- Optimize for content density while maintaining readability
```

**Quick Setup Instructions:**
```
1. Set viewport to 329×584pt in MagicPath.ai
2. Import the CSS theme above (copy-paste into theme panel)
3. Add fonts:
   - Press Start 2P: https://fonts.google.com/specimen/Press+Start+2P
   - Montserrat: https://fonts.google.com/specimen/Montserrat
4. Save as "16BitFit-LCD-Content" theme
5. Use the existing screen prompts (WelcomeScreen, ProfileSetupScreen, ArchetypeSelectionScreen)
6. MagicPath will generate screen content only (no shell)
7. Export as React Native components
```

**When to Use This Theme:**
- ✅ Developer handoff and production UI/UX work
- ✅ Creating exportable React Native components
- ✅ Iterating on screen layouts and interactions
- ✅ Testing responsive behavior and content density
- ✅ When you plan to wrap screens in `<GameBoyShell>` component later

**When NOT to Use This Theme:**
- ❌ Stakeholder presentations (use full shell mockup instead)
- ❌ Marketing materials (use full shell mockup instead)
- ❌ App Store screenshots (use full shell mockup instead)

---

### Step 0B: Import Shadcn-Compatible CSS Themes (Full Screen Variants)

**First step**: Import one of the four pre-built Shadcn-compatible themes into MagicPath.ai. These themes are derived from the [design-tokens.md](design-tokens.md) file and formatted for direct import.

Choose one theme based on your aesthetic preference:

#### 🎮 Theme 1: DMG Classic (Original Game Boy)

```css
:root {
  /* Base Colors */
  --background: oklch(0.9533 0.1124 127.8456);        /* #9BBC0F - Neon grass glow */
  --foreground: oklch(0.2368 0.0531 136.0921);        /* #0F380F - Deep forest shadow */

  /* Card Components */
  --card: oklch(0.9533 0.1124 127.8456);              /* #9BBC0F */
  --card-foreground: oklch(0.2368 0.0531 136.0921);   /* #0F380F */

  /* Popover Components */
  --popover: oklch(0.9533 0.1124 127.8456);           /* #9BBC0F */
  --popover-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F */

  /* Primary Actions */
  --primary: oklch(0.6839 0.1089 127.5847);           /* #8BAC0F - Lime highlight */
  --primary-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F - Deep forest */

  /* Secondary Elements */
  --secondary: oklch(0.4112 0.0442 136.2584);         /* #306230 - Pine border */
  --secondary-foreground: oklch(0.9533 0.1124 127.8456); /* #9BBC0F - Neon grass */

  /* Accent Highlights */
  --accent: oklch(0.6839 0.1089 127.5847);            /* #8BAC0F - Lime */
  --accent-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F - Deep forest */

  /* Muted/Subtle Elements */
  --muted: oklch(0.4112 0.0442 136.2584);             /* #306230 - Pine border */
  --muted-foreground: oklch(0.6839 0.1089 127.5847);  /* #8BAC0F - Lime */

  /* Destructive Actions */
  --destructive: oklch(0.4112 0.0442 136.2584);       /* #306230 - Muted error */
  --destructive-foreground: oklch(0.9533 0.1124 127.8456); /* #9BBC0F */

  /* Borders & Inputs */
  --border: oklch(0.4112 0.0442 136.2584);            /* #306230 - Pine border */
  --input: oklch(0.4112 0.0442 136.2584);             /* #306230 */
  --ring: oklch(0.9533 0.1124 127.8456);              /* #9BBC0F - Focus ring */

  /* Chart Colors */
  --chart-1: oklch(0.9533 0.1124 127.8456);           /* #9BBC0F */
  --chart-2: oklch(0.6839 0.1089 127.5847);           /* #8BAC0F */
  --chart-3: oklch(0.4112 0.0442 136.2584);           /* #306230 */
  --chart-4: oklch(0.3240 0.0487 136.1752);           /* Elevated */
  --chart-5: oklch(0.2368 0.0531 136.0921);           /* #0F380F */

  /* Sidebar (optional) */
  --sidebar-background: oklch(0.4112 0.0442 136.2584);     /* #306230 */
  --sidebar-foreground: oklch(0.9533 0.1124 127.8456);     /* #9BBC0F */
  --sidebar-primary: oklch(0.6839 0.1089 127.5847);        /* #8BAC0F */
  --sidebar-primary-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F */
  --sidebar-accent: oklch(0.6839 0.1089 127.5847);         /* #8BAC0F */
  --sidebar-accent-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F */
  --sidebar-border: oklch(0.3240 0.0487 136.1752);         /* Elevated */
  --sidebar-ring: oklch(0.9533 0.1124 127.8456);           /* #9BBC0F */

  /* Design System */
  --radius: 0rem;                                      /* Pure retro - no rounding */
}

.dark {
  /* Base Colors */
  --background: oklch(0.2368 0.0531 136.0921);        /* #0F380F - Deep forest shadow */
  --foreground: oklch(0.9533 0.1124 127.8456);        /* #9BBC0F - Neon grass glow */

  /* Card Components */
  --card: oklch(0.3240 0.0487 136.1752);              /* Elevated #306230 */
  --card-foreground: oklch(0.9533 0.1124 127.8456);   /* #9BBC0F */

  /* Popover Components */
  --popover: oklch(0.3240 0.0487 136.1752);           /* Elevated */
  --popover-foreground: oklch(0.9533 0.1124 127.8456); /* #9BBC0F */

  /* Primary Actions */
  --primary: oklch(0.6839 0.1089 127.5847);           /* #8BAC0F - Lime highlight */
  --primary-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F - Deep forest */

  /* Secondary Elements */
  --secondary: oklch(0.4112 0.0442 136.2584);         /* #306230 - Pine border */
  --secondary-foreground: oklch(0.9533 0.1124 127.8456); /* #9BBC0F - Neon grass */

  /* Accent Highlights */
  --accent: oklch(0.6839 0.1089 127.5847);            /* #8BAC0F - Lime */
  --accent-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F - Deep forest */

  /* Muted/Subtle Elements */
  --muted: oklch(0.3240 0.0487 136.1752);             /* Elevated #306230 */
  --muted-foreground: oklch(0.6839 0.1089 127.5847);  /* #8BAC0F - Lime */

  /* Destructive Actions */
  --destructive: oklch(0.4112 0.0442 136.2584);       /* #306230 - Muted error */
  --destructive-foreground: oklch(0.9533 0.1124 127.8456); /* #9BBC0F */

  /* Borders & Inputs */
  --border: oklch(0.4112 0.0442 136.2584);            /* #306230 - Pine border */
  --input: oklch(0.4112 0.0442 136.2584);             /* #306230 */
  --ring: oklch(0.9533 0.1124 127.8456);              /* #9BBC0F - Focus ring */

  /* Chart Colors */
  --chart-1: oklch(0.9533 0.1124 127.8456);           /* #9BBC0F */
  --chart-2: oklch(0.6839 0.1089 127.5847);           /* #8BAC0F */
  --chart-3: oklch(0.4112 0.0442 136.2584);           /* #306230 */
  --chart-4: oklch(0.3240 0.0487 136.1752);           /* Elevated */
  --chart-5: oklch(0.2368 0.0531 136.0921);           /* #0F380F */

  /* Sidebar (optional) */
  --sidebar-background: oklch(0.3240 0.0487 136.1752);     /* Elevated */
  --sidebar-foreground: oklch(0.9533 0.1124 127.8456);     /* #9BBC0F */
  --sidebar-primary: oklch(0.6839 0.1089 127.5847);        /* #8BAC0F */
  --sidebar-primary-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F */
  --sidebar-accent: oklch(0.6839 0.1089 127.5847);         /* #8BAC0F */
  --sidebar-accent-foreground: oklch(0.2368 0.0531 136.0921); /* #0F380F */
  --sidebar-border: oklch(0.4112 0.0442 136.2584);         /* #306230 */
  --sidebar-ring: oklch(0.9533 0.1124 127.8456);           /* #9BBC0F */

  /* Design System */
  --radius: 0rem;                                      /* Pure retro - no rounding */
}
```

**Typography Scale (DMG Classic):**
```
5X Large: 3rem (48px) - Hero headlines
4X Large: 2.25rem (36px) - Large headlines
3X Large: 1.875rem (30px) - Section headers
2X Large: 1.5rem (24px) - Subsection headers
X Large: 1.25rem (20px) - Card titles
Large: 1.125rem (18px) - Emphasized body
Base: 1rem (16px) - Body text
Small: 0.875rem (14px) - Supporting text
X Small: 0.75rem (12px) - Labels & captions

Font Families: "Press Start 2P" (headings), monospace (fallback)
```

**Effects & Shadows (DMG Classic):**
```
Border Radius: 0rem (sharp corners for retro aesthetic)
Shadows: Pixel-perfect hard shadows only
  - Primary: 4px 4px 0 0 oklch(0.2368 0.0531 136.0921)
  - Inset: inset 2px 2px 0 rgba(0,0,0,0.3)
  - No soft blur shadows
```

**Design Rules (DMG Classic):**
```
- Always use zero border-radius for authentic Game Boy aesthetic
- Use 3px borders by default, 4px for emphasis/selection states
- Apply hard pixel shadows (no blur) with 4×4px offset
- Maintain 8px base grid for all spacing
- Ensure all touch targets are minimum 44×44px
- Use chunky, bold UI elements that evoke retro hardware
```

#### 🕹️ Theme 2: Neon Arcade

```css
:root {
  /* Base Colors */
  --background: oklch(0.9647 0.0051 237.8942);        /* Lightened version of deepSpace */
  --foreground: oklch(0.2384 0.0328 252.8471);        /* #1B2853 - Deep space */

  /* Card Components */
  --card: oklch(0.9647 0.0051 237.8942);              /* Lightened deep space */
  --card-foreground: oklch(0.2384 0.0328 252.8471);   /* #1B2853 */

  /* Popover Components */
  --popover: oklch(0.9647 0.0051 237.8942);           /* Lightened deep space */
  --popover-foreground: oklch(0.2384 0.0328 252.8471); /* #1B2853 */

  /* Primary Actions */
  --primary: oklch(0.7586 0.1489 230.5483);           /* #00D0FF - Electric cyan */
  --primary-foreground: oklch(0.2384 0.0328 252.8471); /* #1B2853 - Deep space */

  /* Secondary Elements */
  --secondary: oklch(0.4831 0.2143 292.9847);         /* #8A2CE2 - Cyber violet */
  --secondary-foreground: oklch(1.0000 0 0);          /* #FFFFFF - Pure white */

  /* Accent Highlights */
  --accent: oklch(0.8745 0.2084 124.8352);            /* #B0EB00 - Radioactive green */
  --accent-foreground: oklch(0.2384 0.0328 252.8471); /* #1B2853 - Deep space */

  /* Muted/Subtle Elements */
  --muted: oklch(0.3856 0.0284 253.1247);             /* #2A3A6B - Elevated */
  --muted-foreground: oklch(0.7984 0.0312 252.9384);  /* #B8C5E0 - Soft blue-gray */

  /* Destructive Actions */
  --destructive: oklch(0.5842 0.2564 356.8937);       /* #FF007B - Hot pink energy */
  --destructive-foreground: oklch(1.0000 0 0);        /* #FFFFFF - Pure white */

  /* Borders & Inputs */
  --border: oklch(0.3856 0.0284 253.1247);            /* #3D4E7A - Muted blue */
  --input: oklch(0.3856 0.0284 253.1247);             /* #3D4E7A */
  --ring: oklch(0.4831 0.2143 292.9847);              /* #8A2CE2 - Focus purple */

  /* Chart Colors */
  --chart-1: oklch(0.7586 0.1489 230.5483);           /* #00D0FF - Electric cyan */
  --chart-2: oklch(0.4831 0.2143 292.9847);           /* #8A2CE2 - Cyber violet */
  --chart-3: oklch(0.8745 0.2084 124.8352);           /* #B0EB00 - Radioactive green */
  --chart-4: oklch(0.5842 0.2564 356.8937);           /* #FF007B - Hot pink */
  --chart-5: oklch(0.7984 0.0312 252.9384);           /* #B8C5E0 - Soft blue-gray */

  /* Sidebar (optional) */
  --sidebar-background: oklch(0.3856 0.0284 253.1247);     /* #2A3A6B - Elevated */
  --sidebar-foreground: oklch(1.0000 0 0);                 /* #FFFFFF */
  --sidebar-primary: oklch(0.7586 0.1489 230.5483);        /* #00D0FF - Electric cyan */
  --sidebar-primary-foreground: oklch(0.2384 0.0328 252.8471); /* #1B2853 */
  --sidebar-accent: oklch(0.8745 0.2084 124.8352);         /* #B0EB00 - Radioactive green */
  --sidebar-accent-foreground: oklch(0.2384 0.0328 252.8471); /* #1B2853 */
  --sidebar-border: oklch(0.4831 0.2143 292.9847);         /* #8A2CE2 */
  --sidebar-ring: oklch(0.7586 0.1489 230.5483);           /* #00D0FF */

  /* Design System */
  --radius: 0.25rem;                                   /* Subtle 4px rounding for neon aesthetic */
}

.dark {
  /* Base Colors */
  --background: oklch(0.2384 0.0328 252.8471);        /* #1B2853 - Deep space */
  --foreground: oklch(1.0000 0 0);                    /* #FFFFFF - Pure white */

  /* Card Components */
  --card: oklch(0.3856 0.0284 253.1247);              /* #2A3A6B - Elevated */
  --card-foreground: oklch(1.0000 0 0);               /* #FFFFFF */

  /* Popover Components */
  --popover: oklch(0.3856 0.0284 253.1247);           /* #2A3A6B - Elevated */
  --popover-foreground: oklch(1.0000 0 0);            /* #FFFFFF */

  /* Primary Actions */
  --primary: oklch(0.7586 0.1489 230.5483);           /* #00D0FF - Electric cyan */
  --primary-foreground: oklch(0.2384 0.0328 252.8471); /* #1B2853 - Deep space */

  /* Secondary Elements */
  --secondary: oklch(0.4831 0.2143 292.9847);         /* #8A2CE2 - Cyber violet */
  --secondary-foreground: oklch(1.0000 0 0);          /* #FFFFFF - Pure white */

  /* Accent Highlights */
  --accent: oklch(0.8745 0.2084 124.8352);            /* #B0EB00 - Radioactive green */
  --accent-foreground: oklch(0.2384 0.0328 252.8471); /* #1B2853 - Deep space */

  /* Muted/Subtle Elements */
  --muted: oklch(0.3856 0.0284 253.1247);             /* #2A3A6B - Elevated */
  --muted-foreground: oklch(0.7984 0.0312 252.9384);  /* #B8C5E0 - Soft blue-gray */

  /* Destructive Actions */
  --destructive: oklch(0.5842 0.2564 356.8937);       /* #FF007B - Hot pink energy */
  --destructive-foreground: oklch(1.0000 0 0);        /* #FFFFFF - Pure white */

  /* Borders & Inputs */
  --border: oklch(0.3856 0.0284 253.1247);            /* #3D4E7A - Muted blue */
  --input: oklch(0.3856 0.0284 253.1247);             /* #3D4E7A */
  --ring: oklch(0.4831 0.2143 292.9847);              /* #8A2CE2 - Focus purple */

  /* Chart Colors */
  --chart-1: oklch(0.7586 0.1489 230.5483);           /* #00D0FF - Electric cyan */
  --chart-2: oklch(0.4831 0.2143 292.9847);           /* #8A2CE2 - Cyber violet */
  --chart-3: oklch(0.8745 0.2084 124.8352);           /* #B0EB00 - Radioactive green */
  --chart-4: oklch(0.5842 0.2564 356.8937);           /* #FF007B - Hot pink */
  --chart-5: oklch(0.7984 0.0312 252.9384);           /* #B8C5E0 - Soft blue-gray */

  /* Sidebar (optional) */
  --sidebar-background: oklch(0.3856 0.0284 253.1247);     /* #2A3A6B - Elevated */
  --sidebar-foreground: oklch(1.0000 0 0);                 /* #FFFFFF */
  --sidebar-primary: oklch(0.7586 0.1489 230.5483);        /* #00D0FF - Electric cyan */
  --sidebar-primary-foreground: oklch(0.2384 0.0328 252.8471); /* #1B2853 */
  --sidebar-accent: oklch(0.8745 0.2084 124.8352);         /* #B0EB00 - Radioactive green */
  --sidebar-accent-foreground: oklch(0.2384 0.0328 252.8471); /* #1B2853 */
  --sidebar-border: oklch(0.4831 0.2143 292.9847);         /* #8A2CE2 */
  --sidebar-ring: oklch(0.7586 0.1489 230.5483);           /* #00D0FF */

  /* Design System */
  --radius: 0.25rem;                                   /* Subtle 4px rounding for neon aesthetic */
}
```

**Typography Scale (Neon Arcade):**
```
5X Large: 3rem (48px) - Hero headlines with neon glow
4X Large: 2.25rem (36px) - Large headlines
3X Large: 1.875rem (30px) - Section headers
2X Large: 1.5rem (24px) - Subsection headers
X Large: 1.25rem (20px) - Card titles
Large: 1.125rem (18px) - Emphasized body
Base: 1rem (16px) - Body text
Small: 0.875rem (14px) - Supporting text
X Small: 0.75rem (12px) - Labels & captions

Font Families: "Chakra Petch" (all text), sans-serif (fallback)
```

**Effects & Shadows (Neon Arcade):**
```
Border Radius: 0.25rem (4px subtle rounding for modern neon aesthetic)
Shadows: Neon glow effects with color-based box-shadows
  - Primary Glow: 0 0 10px oklch(0.7586 0.1489 230.5483), 0 0 20px oklch(0.7586 0.1489 230.5483 / 0.5)
  - Secondary Glow: 0 0 10px oklch(0.4831 0.2143 292.9847), 0 0 20px oklch(0.4831 0.2143 292.9847 / 0.5)
  - Accent Glow: 0 0 10px oklch(0.8745 0.2084 124.8352)
  - Use layered glows for intense neon effects on focus/hover states
```

**Design Rules (Neon Arcade):**
```
- Use neon glow effects liberally on interactive elements and accents
- Apply 0.25rem (4px) border-radius for sleek, modern arcade aesthetic
- Combine multiple glow layers for dramatic emphasis on primary CTAs
- Use 3px borders with neon accent colors for focused states
- Maintain 8px base grid for all spacing
- Ensure all touch targets are minimum 44×44px
- Apply subtle scanline overlay effects on dark backgrounds for CRT aesthetic
- Use high-contrast neon colors against deep space backgrounds
```

#### 💪 Theme 3: Fitness Pulse

```css
:root {
  /* Base Colors */
  --background: oklch(0.9647 0.0051 237.8942);        /* Lightened obsidian */
  --foreground: oklch(0.2647 0.0143 251.7384);        /* #1E272E - Rich obsidian */

  /* Card Components */
  --card: oklch(0.9647 0.0051 237.8942);              /* Lightened obsidian */
  --card-foreground: oklch(0.2647 0.0143 251.7384);   /* #1E272E */

  /* Popover Components */
  --popover: oklch(0.9647 0.0051 237.8942);           /* Lightened obsidian */
  --popover-foreground: oklch(0.2647 0.0143 251.7384); /* #1E272E */

  /* Primary Actions */
  --primary: oklch(0.6294 0.2147 22.8475);            /* #FF4757 - Heartbeat red */
  --primary-foreground: oklch(1.0000 0 0);            /* #FFFFFF - Pure white */

  /* Secondary Elements */
  --secondary: oklch(0.7842 0.1684 142.9475);         /* #2ED573 - Endurance green */
  --secondary-foreground: oklch(0.2647 0.0143 251.7384); /* #1E272E - Obsidian */

  /* Accent Highlights */
  --accent: oklch(0.7569 0.1842 58.3847);             /* #FFA502 - Power orange */
  --accent-foreground: oklch(0.2647 0.0143 251.7384); /* #1E272E - Obsidian */

  /* Muted/Subtle Elements */
  --muted: oklch(0.4847 0.0124 252.8471);             /* #57606F - Steel gray */
  --muted-foreground: oklch(0.7384 0.0089 251.9384);  /* #A4B0BE - Silver */

  /* Destructive Actions */
  --destructive: oklch(0.6294 0.2147 22.8475);        /* #FF4757 - Heartbeat red */
  --destructive-foreground: oklch(1.0000 0 0);        /* #FFFFFF - Pure white */

  /* Borders & Inputs */
  --border: oklch(0.4847 0.0124 252.8471);            /* #57606F - Steel */
  --input: oklch(0.4847 0.0124 252.8471);             /* #57606F */
  --ring: oklch(0.5784 0.1842 252.9384);              /* #1E90FF - Focus blue */

  /* Chart Colors */
  --chart-1: oklch(0.6294 0.2147 22.8475);            /* #FF4757 - Heartbeat red */
  --chart-2: oklch(0.7842 0.1684 142.9475);           /* #2ED573 - Endurance green */
  --chart-3: oklch(0.7569 0.1842 58.3847);            /* #FFA502 - Power orange */
  --chart-4: oklch(0.5784 0.1842 252.9384);           /* #1E90FF - Focus blue */
  --chart-5: oklch(0.7384 0.0089 251.9384);           /* #A4B0BE - Silver */

  /* Sidebar (optional) */
  --sidebar-background: oklch(0.4847 0.0124 252.8471);     /* #57606F - Steel gray */
  --sidebar-foreground: oklch(1.0000 0 0);                 /* #FFFFFF */
  --sidebar-primary: oklch(0.6294 0.2147 22.8475);         /* #FF4757 - Heartbeat red */
  --sidebar-primary-foreground: oklch(1.0000 0 0);         /* #FFFFFF */
  --sidebar-accent: oklch(0.7842 0.1684 142.9475);         /* #2ED573 - Endurance green */
  --sidebar-accent-foreground: oklch(0.2647 0.0143 251.7384); /* #1E272E */
  --sidebar-border: oklch(0.3384 0.0132 251.9384);         /* #2F3542 - Graphite */
  --sidebar-ring: oklch(0.5784 0.1842 252.9384);           /* #1E90FF */

  /* Design System */
  --radius: 0.25rem;                                   /* Subtle 4px rounding for athletic aesthetic */
}

.dark {
  /* Base Colors */
  --background: oklch(0.2647 0.0143 251.7384);        /* #1E272E - Rich obsidian */
  --foreground: oklch(1.0000 0 0);                    /* #FFFFFF - Pure white */

  /* Card Components */
  --card: oklch(0.3384 0.0132 251.9384);              /* #2F3542 - Graphite */
  --card-foreground: oklch(1.0000 0 0);               /* #FFFFFF */

  /* Popover Components */
  --popover: oklch(0.3384 0.0132 251.9384);           /* #2F3542 - Graphite */
  --popover-foreground: oklch(1.0000 0 0);            /* #FFFFFF */

  /* Primary Actions */
  --primary: oklch(0.6294 0.2147 22.8475);            /* #FF4757 - Heartbeat red */
  --primary-foreground: oklch(1.0000 0 0);            /* #FFFFFF - Pure white */

  /* Secondary Elements */
  --secondary: oklch(0.7842 0.1684 142.9475);         /* #2ED573 - Endurance green */
  --secondary-foreground: oklch(0.2647 0.0143 251.7384); /* #1E272E - Obsidian */

  /* Accent Highlights */
  --accent: oklch(0.7569 0.1842 58.3847);             /* #FFA502 - Power orange */
  --accent-foreground: oklch(0.2647 0.0143 251.7384); /* #1E272E - Obsidian */

  /* Muted/Subtle Elements */
  --muted: oklch(0.3384 0.0132 251.9384);             /* #2F3542 - Graphite */
  --muted-foreground: oklch(0.7384 0.0089 251.9384);  /* #A4B0BE - Silver */

  /* Destructive Actions */
  --destructive: oklch(0.6294 0.2147 22.8475);        /* #FF4757 - Heartbeat red */
  --destructive-foreground: oklch(1.0000 0 0);        /* #FFFFFF - Pure white */

  /* Borders & Inputs */
  --border: oklch(0.4847 0.0124 252.8471);            /* #57606F - Steel */
  --input: oklch(0.4847 0.0124 252.8471);             /* #57606F */
  --ring: oklch(0.5784 0.1842 252.9384);              /* #1E90FF - Focus blue */

  /* Chart Colors */
  --chart-1: oklch(0.6294 0.2147 22.8475);            /* #FF4757 - Heartbeat red */
  --chart-2: oklch(0.7842 0.1684 142.9475);           /* #2ED573 - Endurance green */
  --chart-3: oklch(0.7569 0.1842 58.3847);            /* #FFA502 - Power orange */
  --chart-4: oklch(0.5784 0.1842 252.9384);           /* #1E90FF - Focus blue */
  --chart-5: oklch(0.7384 0.0089 251.9384);           /* #A4B0BE - Silver */

  /* Sidebar (optional) */
  --sidebar-background: oklch(0.3384 0.0132 251.9384);     /* #2F3542 - Graphite */
  --sidebar-foreground: oklch(1.0000 0 0);                 /* #FFFFFF */
  --sidebar-primary: oklch(0.6294 0.2147 22.8475);         /* #FF4757 - Heartbeat red */
  --sidebar-primary-foreground: oklch(1.0000 0 0);         /* #FFFFFF */
  --sidebar-accent: oklch(0.7842 0.1684 142.9475);         /* #2ED573 - Endurance green */
  --sidebar-accent-foreground: oklch(0.2647 0.0143 251.7384); /* #1E272E */
  --sidebar-border: oklch(0.4847 0.0124 252.8471);         /* #57606F - Steel */
  --sidebar-ring: oklch(0.5784 0.1842 252.9384);           /* #1E90FF */

  /* Design System */
  --radius: 0.25rem;                                   /* Subtle 4px rounding for athletic aesthetic */
}
```

**Typography Scale (Fitness Pulse):**
```
5X Large: 3rem (48px) - Bold hero headlines
4X Large: 2.25rem (36px) - Large section headers
3X Large: 1.875rem (30px) - Section headers
2X Large: 1.5rem (24px) - Subsection headers
X Large: 1.25rem (20px) - Card titles
Large: 1.125rem (18px) - Emphasized body
Base: 1rem (16px) - Body text
Small: 0.875rem (14px) - Supporting text
X Small: 0.75rem (12px) - Labels & captions

Font Families: "Rajdhani" (all text), sans-serif (fallback)
Font Weight: Use SemiBold (600) and Bold (700) for athletic strength
```

**Effects & Shadows (Fitness Pulse):**
```
Border Radius: 0.25rem (4px for modern athletic aesthetic)
Shadows: Strong, directional shadows for depth and energy
  - Primary: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)
  - Elevated: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)
  - Emphasis: 0 4px 16px oklch(0.6294 0.2147 22.8475 / 0.3) [red glow on primary actions]
  - Use subtle drop shadows for card elevation
```

**Design Rules (Fitness Pulse):**
```
- Use bold typography (SemiBold 600, Bold 700) to convey strength and energy
- Apply 0.25rem (4px) border-radius for modern athletic aesthetic
- Use vibrant accent colors (red, green, orange) for energy states and progress
- Maintain high contrast with dark obsidian backgrounds
- Apply directional shadows to create depth and dynamic feel
- Maintain 8px base grid for all spacing
- Ensure all touch targets are minimum 44×44px
- Use subtle pulse animations on heartbeat red elements for lifelike energy
```

#### 🎯 Theme 4: Retro Synthwave

```css
:root {
  /* Base Colors */
  --background: oklch(0.9647 0.0051 237.8942);        /* Lightened void black */
  --foreground: oklch(0.1284 0.0284 252.8471);        /* #0A0E27 - Void black */

  /* Card Components */
  --card: oklch(0.9647 0.0051 237.8942);              /* Lightened void black */
  --card-foreground: oklch(0.1284 0.0284 252.8471);   /* #0A0E27 */

  /* Popover Components */
  --popover: oklch(0.9647 0.0051 237.8942);           /* Lightened void black */
  --popover-foreground: oklch(0.1284 0.0284 252.8471); /* #0A0E27 */

  /* Primary Actions */
  --primary: oklch(0.5842 0.2847 344.9384);           /* #FF006E - Hot pink */
  --primary-foreground: oklch(1.0000 0 0);            /* #FFFFFF - Pure white */

  /* Secondary Elements */
  --secondary: oklch(0.4847 0.2384 292.8471);         /* #8338EC - Deep purple */
  --secondary-foreground: oklch(1.0000 0 0);          /* #FFFFFF - Pure white */

  /* Accent Highlights */
  --accent: oklch(0.8942 0.1847 165.9384);            /* #06FFA5 - Mint green */
  --accent-foreground: oklch(0.1284 0.0284 252.8471); /* #0A0E27 - Void black */

  /* Muted/Subtle Elements */
  --muted: oklch(0.2847 0.0189 252.8471);             /* #2A2F4A - Horizon */
  --muted-foreground: oklch(0.7847 0.0384 283.9384);  /* #B8B8FF - Chrome */

  /* Destructive Actions */
  --destructive: oklch(0.5842 0.2847 344.9384);       /* #FF006E - Hot pink */
  --destructive-foreground: oklch(1.0000 0 0);        /* #FFFFFF - Pure white */

  /* Borders & Inputs */
  --border: oklch(0.3384 0.0189 252.8471);            /* #3A3F5A - Border */
  --input: oklch(0.3384 0.0189 252.8471);             /* #3A3F5A */
  --ring: oklch(0.5784 0.1842 252.9384);              /* #3A86FF - Electric blue */

  /* Chart Colors */
  --chart-1: oklch(0.5842 0.2847 344.9384);           /* #FF006E - Hot pink */
  --chart-2: oklch(0.4847 0.2384 292.8471);           /* #8338EC - Deep purple */
  --chart-3: oklch(0.8942 0.1847 165.9384);           /* #06FFA5 - Mint green */
  --chart-4: oklch(0.5784 0.1842 252.9384);           /* #3A86FF - Electric blue */
  --chart-5: oklch(0.7847 0.0384 283.9384);           /* #B8B8FF - Chrome */

  /* Sidebar (optional) */
  --sidebar-background: oklch(0.2847 0.0189 252.8471);     /* #2A2F4A - Horizon */
  --sidebar-foreground: oklch(1.0000 0 0);                 /* #FFFFFF */
  --sidebar-primary: oklch(0.5842 0.2847 344.9384);        /* #FF006E - Hot pink */
  --sidebar-primary-foreground: oklch(1.0000 0 0);         /* #FFFFFF */
  --sidebar-accent: oklch(0.8942 0.1847 165.9384);         /* #06FFA5 - Mint green */
  --sidebar-accent-foreground: oklch(0.1284 0.0284 252.8471); /* #0A0E27 */
  --sidebar-border: oklch(0.3384 0.0189 252.8471);         /* #3A3F5A */
  --sidebar-ring: oklch(0.5784 0.1842 252.9384);           /* #3A86FF */

  /* Design System */
  --radius: 0.25rem;                                   /* Subtle 4px rounding for vaporwave aesthetic */
}

.dark {
  /* Base Colors */
  --background: oklch(0.1284 0.0284 252.8471);        /* #0A0E27 - Void black */
  --foreground: oklch(1.0000 0 0);                    /* #FFFFFF - Pure white */

  /* Card Components */
  --card: oklch(0.2384 0.0189 252.8471);              /* #1A1F3A - Twilight */
  --card-foreground: oklch(1.0000 0 0);               /* #FFFFFF */

  /* Popover Components */
  --popover: oklch(0.2384 0.0189 252.8471);           /* #1A1F3A - Twilight */
  --popover-foreground: oklch(1.0000 0 0);            /* #FFFFFF */

  /* Primary Actions */
  --primary: oklch(0.5842 0.2847 344.9384);           /* #FF006E - Hot pink */
  --primary-foreground: oklch(1.0000 0 0);            /* #FFFFFF - Pure white */

  /* Secondary Elements */
  --secondary: oklch(0.4847 0.2384 292.8471);         /* #8338EC - Deep purple */
  --secondary-foreground: oklch(1.0000 0 0);          /* #FFFFFF - Pure white */

  /* Accent Highlights */
  --accent: oklch(0.8942 0.1847 165.9384);            /* #06FFA5 - Mint green */
  --accent-foreground: oklch(0.1284 0.0284 252.8471); /* #0A0E27 - Void black */

  /* Muted/Subtle Elements */
  --muted: oklch(0.2384 0.0189 252.8471);             /* #1A1F3A - Twilight */
  --muted-foreground: oklch(0.7847 0.0384 283.9384);  /* #B8B8FF - Chrome */

  /* Destructive Actions */
  --destructive: oklch(0.5842 0.2847 344.9384);       /* #FF006E - Hot pink */
  --destructive-foreground: oklch(1.0000 0 0);        /* #FFFFFF - Pure white */

  /* Borders & Inputs */
  --border: oklch(0.3384 0.0189 252.8471);            /* #3A3F5A - Border */
  --input: oklch(0.3384 0.0189 252.8471);             /* #3A3F5A */
  --ring: oklch(0.5784 0.1842 252.9384);              /* #3A86FF - Electric blue */

  /* Chart Colors */
  --chart-1: oklch(0.5842 0.2847 344.9384);           /* #FF006E - Hot pink */
  --chart-2: oklch(0.4847 0.2384 292.8471);           /* #8338EC - Deep purple */
  --chart-3: oklch(0.8942 0.1847 165.9384);           /* #06FFA5 - Mint green */
  --chart-4: oklch(0.5784 0.1842 252.9384);           /* #3A86FF - Electric blue */
  --chart-5: oklch(0.7847 0.0384 283.9384);           /* #B8B8FF - Chrome */

  /* Sidebar (optional) */
  --sidebar-background: oklch(0.2384 0.0189 252.8471);     /* #1A1F3A - Twilight */
  --sidebar-foreground: oklch(1.0000 0 0);                 /* #FFFFFF */
  --sidebar-primary: oklch(0.5842 0.2847 344.9384);        /* #FF006E - Hot pink */
  --sidebar-primary-foreground: oklch(1.0000 0 0);         /* #FFFFFF */
  --sidebar-accent: oklch(0.8942 0.1847 165.9384);         /* #06FFA5 - Mint green */
  --sidebar-accent-foreground: oklch(0.1284 0.0284 252.8471); /* #0A0E27 */
  --sidebar-border: oklch(0.2847 0.0189 252.8471);         /* #2A2F4A - Horizon */
  --sidebar-ring: oklch(0.5784 0.1842 252.9384);           /* #3A86FF */

  /* Design System */
  --radius: 0.25rem;                                   /* Subtle 4px rounding for vaporwave aesthetic */
}
```

**Typography Scale (Retro Synthwave):**
```
5X Large: 3rem (48px) - Futuristic hero headlines
4X Large: 2.25rem (36px) - Large section headers
3X Large: 1.875rem (30px) - Section headers
2X Large: 1.5rem (24px) - Subsection headers
X Large: 1.25rem (20px) - Card titles
Large: 1.125rem (18px) - Emphasized body
Base: 1rem (16px) - Body text
Small: 0.875rem (14px) - Supporting text
X Small: 0.75rem (12px) - Labels & captions

Font Families: "Orbitron" (all text), sans-serif (fallback)
Letter Spacing: Increased tracking (0.05em) for futuristic aesthetic
```

**Effects & Shadows (Retro Synthwave):**
```
Border Radius: 0.25rem (4px for sleek vaporwave aesthetic)
Shadows: Vibrant gradient glows with vaporwave colors
  - Hot Pink Glow: 0 0 20px oklch(0.5842 0.2847 344.9384), 0 0 40px oklch(0.5842 0.2847 344.9384 / 0.4)
  - Purple Glow: 0 0 20px oklch(0.4847 0.2384 292.8471), 0 0 40px oklch(0.4847 0.2384 292.8471 / 0.4)
  - Mint Glow: 0 0 20px oklch(0.8942 0.1847 165.9384), 0 0 40px oklch(0.8942 0.1847 165.9384 / 0.4)
  - Gradient borders: linear-gradient(135deg, hot pink, purple, mint) for emphasis
  - Apply chromatic aberration effects on hover for retro CRT aesthetic
```

**Design Rules (Retro Synthwave):**
```
- Use intense gradient glows with multiple color layers for dramatic vaporwave effects
- Apply 0.25rem (4px) border-radius for sleek futuristic aesthetic
- Use gradient borders (hot pink to purple to mint) on primary interactive elements
- Increase letter-spacing (0.05em) on all text for sci-fi aesthetic
- Apply subtle chromatic aberration effects on hover states
- Maintain 8px base grid for all spacing
- Ensure all touch targets are minimum 44×44px
- Use grid line overlays and horizon effects for retro-futuristic depth
- Layer multiple glow effects for intense neon emphasis on CTAs
```

#### 🎮 Theme 5: Game Boy Shell Hardware (For Full Device Mockups)

**Purpose:** Use this theme when creating full Game Boy device mockups with hardware chrome. This provides the physical Game Boy colors (beige body, gray bezel, magenta buttons) while the LCD screen area uses DMG green colors.

```css
:root {
  /* Shell Hardware Colors */
  --background: oklch(0.8745 0.0089 89.2847);        /* #D7D5CA - Warm beige body */
  --foreground: oklch(0.1284 0 0);                    /* #1C1C1C - Glossy black (D-pad, text) */

  /* Card Components (Bezel/Frame) */
  --card: oklch(0.6245 0 0);                          /* #9A9A9A - Cool gray bezel */
  --card-foreground: oklch(0.1284 0 0);               /* #1C1C1C - Glossy black */

  /* Popover Components */
  --popover: oklch(0.6245 0 0);                       /* #9A9A9A - Cool gray */
  --popover-foreground: oklch(0.1284 0 0);            /* #1C1C1C */

  /* Primary Actions (A/B Buttons) */
  --primary: oklch(0.5284 0.1847 342.8471);           /* #B64A75 - Deep magenta buttons */
  --primary-foreground: oklch(1.0000 0 0);            /* #FFFFFF - White text */

  /* Secondary Elements (Start/Select Buttons) */
  --secondary: oklch(0.6384 0 0);                     /* #9E9E9E - Cool gray buttons */
  --secondary-foreground: oklch(0.1284 0 0);          /* #1C1C1C - Glossy black */

  /* Accent Highlights (Blue Nintendo Branding) */
  --accent: oklch(0.4284 0.1247 265.8471);            /* #2C3FA3 - Royal blue */
  --accent-foreground: oklch(1.0000 0 0);             /* #FFFFFF - White text */

  /* Muted/Subtle Elements (Recess/Shadow) */
  --muted: oklch(0.4384 0 0);                         /* #6C6B6B - Deep gray recess */
  --muted-foreground: oklch(0.8745 0.0089 89.2847);   /* #D7D5CA - Beige (reversed) */

  /* LCD Screen Colors (DMG Palette for Screen Content) */
  --lcd-background: oklch(0.9533 0.1124 127.8456);    /* #9BBC0F - Neon grass glow */
  --lcd-foreground: oklch(0.2368 0.0531 136.0921);    /* #0F380F - Deep forest shadow */
  --lcd-accent: oklch(0.6839 0.1089 127.5847);        /* #8BAC0F - Lime highlight */
  --lcd-border: oklch(0.4112 0.0442 136.2584);        /* #306230 - Pine border */

  /* Destructive Actions (Power LED Red) */
  --destructive: oklch(0.5284 0.2247 29.2847);        /* #FF0000 - Red LED */
  --destructive-foreground: oklch(1.0000 0 0);        /* #FFFFFF */

  /* Borders & Inputs */
  --border: oklch(0.4384 0 0);                        /* #6C6B6B - Deep gray */
  --input: oklch(0.6245 0 0);                         /* #9A9A9A - Cool gray */
  --ring: oklch(0.4284 0.1247 265.8471);              /* #2C3FA3 - Royal blue focus */

  /* Chart Colors */
  --chart-1: oklch(0.5284 0.1847 342.8471);           /* #B64A75 - Magenta */
  --chart-2: oklch(0.4284 0.1247 265.8471);           /* #2C3FA3 - Blue */
  --chart-3: oklch(0.6245 0 0);                       /* #9A9A9A - Gray */
  --chart-4: oklch(0.4384 0 0);                       /* #6C6B6B - Dark gray */
  --chart-5: oklch(0.8745 0.0089 89.2847);            /* #D7D5CA - Beige */

  /* Sidebar (optional) */
  --sidebar-background: oklch(0.6245 0 0);            /* #9A9A9A - Gray */
  --sidebar-foreground: oklch(0.1284 0 0);            /* #1C1C1C - Black */
  --sidebar-primary: oklch(0.5284 0.1847 342.8471);   /* #B64A75 - Magenta */
  --sidebar-primary-foreground: oklch(1.0000 0 0);    /* #FFFFFF */
  --sidebar-accent: oklch(0.4284 0.1247 265.8471);    /* #2C3FA3 - Blue */
  --sidebar-accent-foreground: oklch(1.0000 0 0);     /* #FFFFFF */
  --sidebar-border: oklch(0.4384 0 0);                /* #6C6B6B */
  --sidebar-ring: oklch(0.4284 0.1247 265.8471);      /* #2C3FA3 */

  /* Design System */
  --radius: 0rem;                                      /* Pure retro - no rounding for hardware */
}

.dark {
  /* Shell Hardware Colors (Same - hardware doesn't change in dark mode) */
  --background: oklch(0.8745 0.0089 89.2847);         /* #D7D5CA - Warm beige body */
  --foreground: oklch(0.1284 0 0);                    /* #1C1C1C - Glossy black */

  /* Card Components */
  --card: oklch(0.6245 0 0);                          /* #9A9A9A - Cool gray bezel */
  --card-foreground: oklch(0.1284 0 0);               /* #1C1C1C */

  /* Popover Components */
  --popover: oklch(0.6245 0 0);                       /* #9A9A9A */
  --popover-foreground: oklch(0.1284 0 0);            /* #1C1C1C */

  /* Primary Actions */
  --primary: oklch(0.5284 0.1847 342.8471);           /* #B64A75 - Magenta */
  --primary-foreground: oklch(1.0000 0 0);            /* #FFFFFF */

  /* Secondary Elements */
  --secondary: oklch(0.6384 0 0);                     /* #9E9E9E - Gray buttons */
  --secondary-foreground: oklch(0.1284 0 0);          /* #1C1C1C */

  /* Accent Highlights */
  --accent: oklch(0.4284 0.1247 265.8471);            /* #2C3FA3 - Royal blue */
  --accent-foreground: oklch(1.0000 0 0);             /* #FFFFFF */

  /* Muted/Subtle Elements */
  --muted: oklch(0.4384 0 0);                         /* #6C6B6B - Deep gray */
  --muted-foreground: oklch(0.8745 0.0089 89.2847);   /* #D7D5CA - Beige */

  /* LCD Screen Colors (Dark mode: inverted DMG) */
  --lcd-background: oklch(0.2368 0.0531 136.0921);    /* #0F380F - Deep forest */
  --lcd-foreground: oklch(0.9533 0.1124 127.8456);    /* #9BBC0F - Neon grass */
  --lcd-accent: oklch(0.6839 0.1089 127.5847);        /* #8BAC0F - Lime */
  --lcd-border: oklch(0.4112 0.0442 136.2584);        /* #306230 - Pine */

  /* Destructive Actions */
  --destructive: oklch(0.5284 0.2247 29.2847);        /* #FF0000 - Red */
  --destructive-foreground: oklch(1.0000 0 0);        /* #FFFFFF */

  /* Borders & Inputs */
  --border: oklch(0.4384 0 0);                        /* #6C6B6B */
  --input: oklch(0.6245 0 0);                         /* #9A9A9A */
  --ring: oklch(0.4284 0.1247 265.8471);              /* #2C3FA3 */

  /* Chart Colors */
  --chart-1: oklch(0.5284 0.1847 342.8471);           /* #B64A75 */
  --chart-2: oklch(0.4284 0.1247 265.8471);           /* #2C3FA3 */
  --chart-3: oklch(0.6245 0 0);                       /* #9A9A9A */
  --chart-4: oklch(0.4384 0 0);                       /* #6C6B6B */
  --chart-5: oklch(0.8745 0.0089 89.2847);            /* #D7D5CA */

  /* Sidebar */
  --sidebar-background: oklch(0.6245 0 0);            /* #9A9A9A */
  --sidebar-foreground: oklch(0.1284 0 0);            /* #1C1C1C */
  --sidebar-primary: oklch(0.5284 0.1847 342.8471);   /* #B64A75 */
  --sidebar-primary-foreground: oklch(1.0000 0 0);    /* #FFFFFF */
  --sidebar-accent: oklch(0.4284 0.1247 265.8471);    /* #2C3FA3 */
  --sidebar-accent-foreground: oklch(1.0000 0 0);     /* #FFFFFF */
  --sidebar-border: oklch(0.4384 0 0);                /* #6C6B6B */
  --sidebar-ring: oklch(0.4284 0.1247 265.8471);      /* #2C3FA3 */

  /* Design System */
  --radius: 0rem;                                      /* Pure retro */
}
```

**Typography Scale (Game Boy Shell):**
```
5X Large: 3rem (48px) - Large device branding
4X Large: 2.25rem (36px) - Logo text
3X Large: 1.875rem (30px) - Screen content headers
2X Large: 1.5rem (24px) - Screen content subheaders
X Large: 1.25rem (20px) - Card titles
Large: 1.125rem (18px) - Emphasized body
Base: 1rem (16px) - Body text
Small: 0.875rem (14px) - Supporting text
X Small: 0.75rem (12px) - Hardware labels
XX Small: 0.625rem (10px) - "Nintendo", "Game Boy" branding

Font Families:
- Hardware Labels: "Press Start 2P" (Nintendo, Game Boy, button labels)
- Screen Content: DMG Classic fonts (Press Start 2P for headers, Montserrat for body)
```

**Effects & Shadows (Game Boy Shell):**
```
Border Radius: 0rem (sharp corners for authentic hardware)
Shadows: Hard, defined shadows for physical depth
  - Device Shadow: 8px 8px 0 rgba(0,0,0,0.15) (device casting shadow on surface)
  - Button Inset: inset 2px 2px 4px rgba(0,0,0,0.3) (convex button effect)
  - Bezel Depth: inset 4px 4px 0 oklch(0.4384 0 0) (LCD screen recess)
  - No soft blur shadows (authentic retro aesthetic)
```

**Design Rules (Game Boy Shell):**
```
HARDWARE ELEMENTS (Shell, Bezel, Buttons):
- Use var(--background) for device body (#D7D5CA beige)
- Use var(--card) for screen bezel (#9A9A9A gray)
- Use var(--muted) for recessed areas (#6C6B6B deep gray)
- Use var(--primary) for A/B buttons (#B64A75 magenta)
- Use var(--secondary) for Start/Select buttons (#9E9E9E gray)
- Use var(--accent) for Nintendo branding text (#2C3FA3 blue)
- Use var(--foreground) for D-pad and labels (#1C1C1C black)

LCD SCREEN CONTENT:
- Use var(--lcd-background) for screen background (#9BBC0F light green)
- Use var(--lcd-foreground) for screen text (#0F380F dark green)
- Use var(--lcd-accent) for screen highlights (#8BAC0F lime)
- Use var(--lcd-border) for screen borders (#306230 pine)

LAYER SEPARATION:
- Shell elements: Use standard theme variables (--background, --card, --primary, etc.)
- Screen content: Use LCD-specific variables (--lcd-background, --lcd-foreground, etc.)
- This ensures clear visual separation between hardware and display

ACCESSIBILITY:
- Maintain zero border-radius for authentic aesthetic
- Use 3px-8px borders for defined edges
- Apply hard shadows (no blur) for physical depth
- Ensure all touch targets are minimum 44×44px
- Hardware labels should be small (6-10px) for authenticity but remain readable
```

**Usage Example in MagicPath.ai:**
```
After importing this theme, use it in your full device mockup prompts:

HARDWARE ELEMENTS:
- Device body: var(--background)
- Screen bezel: var(--card) with var(--border) for inner recess
- A/B buttons: var(--primary) background
- Start/Select: var(--secondary) background
- D-pad: var(--foreground)
- Nintendo branding: var(--accent)

LCD SCREEN CONTENT:
- Screen background: var(--lcd-background)
- Screen text: var(--lcd-foreground)
- Screen buttons/highlights: var(--lcd-accent)
- Screen borders: var(--lcd-border)

This creates a clear visual distinction between the physical hardware
and the virtual LCD display content.
```

---

**How to Import:**
1. Open MagicPath.ai theme panel
2. Click "Import CSS Theme"
3. Copy-paste ONE of the five theme blocks above (both light and dark variants)
4. Save as "16BitFit-[ThemeName]"
5. Apply to your project

**Recommended Fonts to Add:**
- DMG Classic: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (Google Fonts)
- Neon Arcade: [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) (Google Fonts)
- Fitness Pulse: [Rajdhani](https://fonts.google.com/specimen/Rajdhani) (Google Fonts)
- Retro Synthwave: [Orbitron](https://fonts.google.com/specimen/Orbitron) (Google Fonts)
- Game Boy Shell: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (Google Fonts)

---

### Step 1: Create 16BitFit Theme in MagicPath.ai (Legacy/Manual Method)

**Alternative to Step 0**: If you prefer to manually configure the theme instead of importing CSS, set up the design system as a reusable theme:

```
Create a new Design System called "16BitFit - Retro Fitness" with the following specifications:

COLORS (DMG Game Boy Palette):
- Primary Background: #0F380F (darkest forest green)
- Elevated Surfaces: #306230 (pine green)
- Primary Accent: #8BAC0F (lime green - buttons, highlights)
- Text Primary: #9BBC0F (bright lime - headers, body text)
- Text Secondary: #8BAC0F (muted lime - captions, helper text)
- Text Tertiary: #306230 (dark pine - disabled, placeholders)
- Border Default: #306230 (3px width)
- Border Highlight: #8BAC0F (4px width for selected states)

TYPOGRAPHY:
- Display Font: 'Press Start 2P', monospace (for headers, buttons)
  - H1: 32px, line-height 1.4, uppercase, #9BBC0F
  - H2: 24px, line-height 1.4, uppercase, #9BBC0F
  - H3: 16px, line-height 1.4, uppercase, #9BBC0F
  - Button: 16px, line-height 1.25, uppercase, #0F380F on #8BAC0F background

- Body Font: 'Montserrat', sans-serif (for body text, forms)
  - Body: 16px, line-height 1.5, #9BBC0F
  - Body Large: 18px, line-height 1.5, #9BBC0F
  - Body Small: 14px, line-height 1.5, #8BAC0F
  - Caption: 12px, line-height 1.375, #306230

SPACING (8px Base Grid):
- space-1: 8px
- space-2: 16px
- space-3: 24px
- space-4: 32px
- space-5: 40px
- space-6: 48px
- space-8: 64px

BORDERS & EFFECTS:
- Border Width: 3px default, 4px for emphasis, zero border-radius
- Pixel Shadow: 4px × 4px offset, hard edge (no blur), color #0F380F
- No soft shadows or gradients (retro aesthetic)

BUTTON STYLES:
- Primary: #8BAC0F background, #0F380F text, 4px border, 4×4px pixel shadow
- Secondary: transparent background, #8BAC0F border (4px), #8BAC0F text
- Tertiary: transparent, no border, #8BAC0F underlined text

Save this as "16BitFit-DMG" theme and apply to all new projects.
```

### Alternative Theme 1: Neon Arcade (Optional)

```
Create alternate Design System "16BitFit - Neon Arcade":

COLORS (Neon Synthwave Palette):
- Background: #1B2853 (deep space navy)
- Elevated: #2A3A6B (lighter navy)
- Primary Accent: #00D0FF (electric cyan)
- Secondary Accent: #FF006E (hot pink)
- Text Primary: #FFFFFF (white)
- Text Secondary: #B8C5E0 (soft blue-gray)
- Border Default: #3D4E7A
- Border Highlight: #00D0FF
- Glow Effect: 0 0 10px #00D0FF (for selected states)

TYPOGRAPHY:
- Display Font: 'Chakra Petch', sans-serif (for headers, buttons)
  - H1: 32px, line-height 1.3, uppercase, #FFFFFF
  - H2: 24px, line-height 1.3, uppercase, #FFFFFF
  - H3: 16px, line-height 1.3, uppercase, #00D0FF
  - Button: 16px, line-height 1.25, uppercase, #1B2853 on #00D0FF background

- Body Font: 'Chakra Petch', sans-serif (for body text, forms)
  - Body: 16px, line-height 1.5, #FFFFFF
  - Body Large: 18px, line-height 1.5, #FFFFFF
  - Body Small: 14px, line-height 1.5, #B8C5E0
  - Caption: 12px, line-height 1.375, #B8C5E0

SPACING: Same 8px base grid as DMG theme

BORDERS & EFFECTS:
- Border Width: 2px default, 3px for emphasis, 4px border-radius
- Neon Glow: 0 0 10px currentColor, 0 0 20px currentColor (for CTAs)
- Box Shadow: 0 4px 8px rgba(0, 208, 255, 0.15) for depth
- CRT Scanlines: Optional 1px horizontal lines at 10% opacity

BUTTON STYLES:
- Primary: #00D0FF background, #1B2853 text, 3px border, neon glow effect
- Secondary: transparent background, #8A2CE2 border (3px), #8A2CE2 text, subtle glow
- Tertiary: transparent, no border, #00D0FF underlined text with glow

Save this as "16BitFit-Neon" theme.
```

### Alternative Theme 2: Fitness Pulse (Optional)

```
Create alternate Design System "16BitFit - Fitness Pulse":

COLORS (Athletic Performance Palette):
- Background: #1E272E (rich obsidian black)
- Elevated: #2F3542 (charcoal gray)
- Primary Accent: #FF4757 (heartbeat red - cardio)
- Secondary Accent: #2ED573 (endurance green - stamina)
- Tertiary Accent: #FFA502 (power orange - strength)
- Text Primary: #FFFFFF (pure white)
- Text Secondary: #A4B0BE (silver gray)
- Text Tertiary: #57606F (steel gray)
- Border Default: #57606F (steel gray)
- Border Highlight: #2ED573 (endurance green)
- Focus Ring: #1E90FF (electric blue)

TYPOGRAPHY:
- Display Font: 'Rajdhani', sans-serif (for headers, buttons)
  - H1: 36px, line-height 1.2, uppercase, font-weight 700, #FFFFFF
  - H2: 28px, line-height 1.2, uppercase, font-weight 700, #FFFFFF
  - H3: 20px, line-height 1.3, uppercase, font-weight 600, #FFFFFF
  - Button: 16px, line-height 1.25, uppercase, font-weight 700, #FFFFFF on #FF4757 background

- Body Font: 'Rajdhani', sans-serif (for body text, forms)
  - Body: 18px, line-height 1.5, font-weight 500, #FFFFFF
  - Body Large: 20px, line-height 1.5, font-weight 500, #FFFFFF
  - Body Small: 16px, line-height 1.5, font-weight 400, #A4B0BE
  - Caption: 14px, line-height 1.4, font-weight 400, #A4B0BE

SPACING: Same 8px base grid as DMG theme

BORDERS & EFFECTS:
- Border Width: 2px default, 3px for emphasis, 4px border-radius (subtle rounding)
- Emphasis Shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2) (directional bottom shadow)
- Glow Effect: 0 0 12px currentColor (for primary CTAs)
- Gradient Overlays: Linear gradients for hero sections (90deg, #FF4757 0%, #FFA502 100%)

BUTTON STYLES:
- Primary: #FF4757 background, #FFFFFF text, 3px border, bottom shadow, pulse on hover
- Secondary: #2ED573 background, #1E272E text, 3px border, bottom shadow
- Tertiary: transparent background, #FF4757 border (2px), #FF4757 text
- Disabled: #57606F background, 40% opacity

SPECIALIZED FITNESS COLORS:
- Cardio: #FF4757 (heart rate zones, running)
- Strength: #FFA502 (power moves, lifting)
- Flexibility: #5F27CD (yoga, stretching)
- Balance: #1E90FF (core, stability)
- Endurance: #2ED573 (long-distance, stamina)

Save this as "16BitFit-Pulse" theme.
```

### Alternative Theme 3: Retro Synthwave (Optional)

```
Create alternate Design System "16BitFit - Retro Synthwave":

COLORS (Vaporwave 80s Palette):
- Background: #0A0E27 (void black - deep space)
- Elevated: #1A1F3A (twilight atmosphere)
- Horizon: #2A2F4A (elevated surfaces)
- Primary Accent: #FF006E (hot pink neon)
- Secondary Accent: #8338EC (deep royal purple)
- Tertiary Accent: #3A86FF (electric blue)
- Success: #06FFA5 (neon mint green)
- Warning: #FFBE0B (sunset gold)
- Text Primary: #FFFFFF (pure white)
- Text Secondary: #B8B8FF (chrome metallic)
- Border Default: #3A3F5A (muted border)
- Border Neon: #FF006E (hot pink glow)
- Focus Ring: #3A86FF (electric blue)
- Grid Lines: rgba(255, 0, 110, 0.2) (subtle pink grid)

TYPOGRAPHY:
- Display Font: 'Orbitron', sans-serif (for headers, buttons)
  - H1: 40px, line-height 1.2, uppercase, letter-spacing 0.05em, #FFFFFF
  - H2: 32px, line-height 1.2, uppercase, letter-spacing 0.05em, #FFFFFF
  - H3: 24px, line-height 1.3, uppercase, letter-spacing 0.03em, #B8B8FF
  - Button: 16px, line-height 1.25, uppercase, letter-spacing 0.08em, #FFFFFF on #FF006E background

- Body Font: 'Orbitron', sans-serif (for body text, forms)
  - Body: 16px, line-height 1.6, letter-spacing 0.02em, #FFFFFF
  - Body Large: 18px, line-height 1.6, letter-spacing 0.02em, #FFFFFF
  - Body Small: 14px, line-height 1.5, letter-spacing 0.01em, #B8B8FF
  - Caption: 12px, line-height 1.4, letter-spacing 0.03em, #B8B8FF

SPACING: Same 8px base grid as DMG theme

BORDERS & EFFECTS:
- Border Width: 2px default, 3px for emphasis, 4px border-radius
- Neon Glow (Intense): 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor
- Subtle Glow: 0 0 5px currentColor, 0 0 10px currentColor
- Success Glow: 0 0 10px #06FFA5, 0 0 20px #06FFA5
- Gradient Overlays:
  - Hero: linear-gradient(180deg, #0A0E27 0%, #1A1F3A 60%, #2A2F4A 100%)
  - CTA Primary: linear-gradient(135deg, #FF006E 0%, #8338EC 100%)
  - Achievement: linear-gradient(90deg, #FFBE0B 0%, #FF006E 50%, #8338EC 100%)

BUTTON STYLES:
- Primary: Gradient #FF006E → #8338EC, #FFFFFF text, intense neon glow, border 0
- Secondary: Gradient #3A86FF → #06FFA5, #0A0E27 text, subtle glow, border 0
- Tertiary: transparent background, #FF006E border (2px), #FF006E text, neon glow on hover
- Ghost: transparent, no border, #B8B8FF text with subtle glow

SPECIAL EFFECTS:
- Retro Grid Overlay: 1px solid rgba(255, 0, 110, 0.2) in grid pattern (optional)
- Chromatic Aberration: text-shadow with RGB offset for epic moments
- Scanline Animation: Subtle moving scanlines on hero sections (1px height, 5% opacity)
- Horizon Line: Gradient border-top on sections (90deg, #FF006E, #8338EC, #3A86FF)

Save this as "16BitFit-Synthwave" theme.
```

---

## LCD Screen-Only Prompts (Use with Theme 6: LCD Screen Content)

**IMPORTANT**: The prompts below are designed to work with **Theme 6: LCD Screen Content (329×584pt)** defined in Step 0A above. Before using these prompts:

1. Import Theme 6 CSS into MagicPath.ai
2. Set viewport to **329×584pt**
3. Add fonts: Press Start 2P + Montserrat
4. Save theme as "16BitFit-LCD-Content"

These prompts are **ultra-simplified** - they reference the theme system, so you don't need to repeat color codes, spacing values, or typography specifications. Just paste and generate!

---

### LCD WelcomeScreen (Screen-Only, No Shell)

```
Design the 16BitFit WelcomeScreen using the imported LCD Screen Content theme (329×584pt viewport).

LAYOUT:
- Viewport: 329×584pt
- Safe areas: 20pt top/bottom
- Horizontal margins: 24px (280px content width)
- Background: var(--background)
- Center-aligned vertical layout

CONTENT (Top to Bottom):

Progress Indicator (20pt from top):
- 3 dots: ● ○ ○ (active, inactive, inactive)
- Active: 16×16px var(--primary), Inactive: 12×12px var(--muted) 40% opacity
- Gap: 12px
- Below: "Step 1 of 3" (Montserrat, 12px, var(--muted-foreground))

Logo Section (40pt below progress):
- Icon: 80×80px pixel art dumbbell+heart
- DMG 4-color palette, crisp pixels
- 20pt gap below

Title:
- Text: "16BITFIT"
- Press Start 2P, 24px, uppercase, var(--foreground)
- Center-aligned
- 12pt gap below

Tagline:
- Text: "Your fitness journey starts here. Level up your health, one step at a time."
- Montserrat, 14px, line-height 1.5, var(--muted-foreground)
- Center-aligned, max-width 240px
- 12pt gap below

CTA Section (24pt from bottom):
- Primary Button: "GET STARTED"
  - 280×44px, var(--primary) background, var(--primary-foreground) text
  - Press Start 2P, 12px, uppercase
  - 3px border var(--border), 4×4px pixel shadow (no blur)
  - Border-radius: var(--radius)
- 12pt gap below
- Link: "I already have an account"
  - Montserrat, 12px, var(--muted-foreground), underline

ANIMATIONS (on load):
1. Logo: fade 0→1, scale 0.9→1.0 (400ms ease-out, delay 0ms)
2. Tagline: fade 0→1, translateY 20px→0 (300ms ease-out, delay 200ms)
3. Button: fade 0→1, scale 0.95→1.0 spring (300ms, delay 400ms)

Generate as screen content only (no Game Boy shell hardware).
```

### LCD ProfileSetupScreen (Screen-Only, No Shell)

```
Design the 16BitFit ProfileSetupScreen using the imported LCD Screen Content theme (329×584pt viewport).

LAYOUT:
- Viewport: 329×584pt
- Safe areas: 20pt top/bottom
- Horizontal margins: 24px
- Background: var(--background)

CONTENT:

Progress Indicator (20pt from top):
- 3 dots: ● ● ○ (two active, one inactive)
- "Step 2 of 3"

Header (40pt below progress):
- Title: "CREATE PROFILE"
  - Press Start 2P, 20px, uppercase, var(--foreground)
- 12pt gap
- Subtitle: "Choose your unique username and optional display name."
  - Montserrat, 14px, line-height 1.5, var(--muted-foreground)
  - Max-width 240px

Form Section (24pt below header):

Username Field:
- Label: "Username *" (Montserrat SemiBold, 12px, var(--foreground))
  - Asterisk: var(--destructive)
- 8pt gap
- Input: 280×44px
  - Border: 3px var(--border), Background: var(--input)
  - Padding: 12px horizontal
  - Text: Montserrat 14px var(--foreground)
  - Placeholder: "Enter username..." (var(--muted-foreground) 60% opacity)
  - Border-radius: var(--radius)
  - Focus: 4px var(--ring)
- 6pt gap
- Helper: "3-20 characters" (Montserrat, 10px, var(--muted-foreground))

16pt gap

Display Name Field (same styling, optional):
- Label: "Display Name" (no asterisk)
- Input: "Optional display name..."
- Helper: "How others see you"

CTA Section (24pt from bottom):
- Button: "CREATE ACCOUNT"
  - 280×44px, var(--primary), Press Start 2P 12px
  - 3px border, 4×4px shadow
- 12pt gap
- Link: "Skip for now"

INPUT STATES:
- Default: 3px var(--border)
- Focus: 4px var(--ring) (150ms)
- Error: 3px var(--destructive) + shake animation
- Success: 3px var(--secondary) + checkmark icon

Generate as screen content only (no Game Boy shell hardware).
```

### LCD ArchetypeSelectionScreen (Screen-Only, No Shell)

```
Design the 16BitFit ArchetypeSelectionScreen using the imported LCD Screen Content theme (329×584pt viewport).

LAYOUT:
- Viewport: 329×584pt
- Safe areas: 20pt top/bottom
- Horizontal margins: 24px
- Background: var(--background)
- Scrollable (5 cards + CTA)

CONTENT:

Progress Indicator (20pt from top):
- 3 dots: ● ● ● (all active)
- "Step 3 of 3"

Header (32pt below progress):
- Title: "SELECT ARCHETYPE"
  - Press Start 2P, 18px, uppercase, var(--foreground)
- 10pt gap
- Subtitle: "Choose your fitness style. You can change this later."
  - Montserrat, 12px, line-height 1.4, var(--muted-foreground)
  - Max-width 240px

Archetype Grid (20pt below header):
- 2-column grid, 12px gap
- Grid width: 280px
- Card size: 134×156px

Card Specifications (5 cards):

Structure:
- Dimensions: 134×156px
- Padding: 12px
- Border: 3px var(--border) (default)
- Border (selected): 4px var(--primary)
- Background: var(--card)
- Border-radius: var(--radius)
- Vertical layout, center-aligned, 6px gaps

Contents:
1. Avatar: 60×60px pixel art sprite (DMG palette, crisp pixels)
2. Name: Press Start 2P, 12px, uppercase, var(--card-foreground)
3. Description: Montserrat, 9px, var(--muted-foreground), 2 lines max, line-height 1.3

Data (create these 5):
1. TRAINER - "Balanced fitness variety"
2. RUNNER - "Built for endurance"
3. YOGA - "Flexibility & mindfulness"
4. BUILDER - "Strength & muscle focus"
5. CYCLIST - "Cardio & leg strength"

Interaction:
- Default: 3px border, scale 1.0
- Selected: 4px var(--primary), scale 1.03, checkmark (12×12px) top-right
- Press: scale 0.98 (100ms)

CTA Section (20pt from bottom):
- Button: "CONTINUE"
  - 280×44px, var(--primary), Press Start 2P 12px
  - 3px border, 4×4px shadow
  - Disabled: 40% opacity (until selection)

Staggered Animation:
- Cards 1-5: fade+translateY 30px→0 (250ms, delays: 0/50/100/150/200ms)

Generate as screen content only (no Game Boy shell hardware).
```

---

## Full-Screen Prompts (Use with Themes 1-4: DMG, Neon, Pulse, Synthwave)

**IMPORTANT**: The prompts below are designed for **full-screen viewports (393×852pt)** and work with Themes 1-4 defined in Step 0B. Use these when designing for larger screens or when you want more breathing room in your layouts.

---

## Screen 1: WelcomeScreen Prompts

### Base Screen Generation

```
Design the Welcome Screen for 16BitFit, a retro fitness mobile app (393×852pt viewport, iPhone 14 Pro safe areas).

IMPORTANT: Use your imported theme colors (DMG Classic, Neon Arcade, Fitness Pulse, or Retro Synthwave).
All color references below use semantic tokens that map to your active theme.

LAYOUT & STRUCTURE:
- Mobile-first vertical layout, centered content
- Safe area top: 59pt, bottom: 34pt
- Background: var(--background)

TOP SECTION (Progress Indicator):
- Position: 79pt from top (59pt safe area + 20pt margin)
- Component: 3 dots progress indicator (● ○ ○)
  - Active dot: 16×16px, var(--primary) background
  - Inactive dots: 12×12px, var(--muted) background, 40% opacity
  - 12px gap between dots
  - Below dots: "Step 1 of 3" text (Montserrat, 12px, var(--muted-foreground))

LOGO SECTION (Center, 400pt tall):
- 80pt spacer from progress indicator
- Logo: 96×96px pixel art fitness logo (placeholder: retro dumbbell + heart)
  - Request pixel art style, use theme color palette
  - Crisp pixel rendering (no anti-aliasing)
- 24pt gap below logo
- Title: "16BITFIT"
  - Press Start 2P, 32px, uppercase, var(--foreground)
  - Center-aligned, 45pt height including line-height
- 16pt gap below title
- Tagline: "Your fitness journey starts here. Level up your health, one step at a time."
  - Montserrat, 18px, line-height 1.5, var(--muted-foreground)
  - Center-aligned, max-width 300px, 2 lines max

CTA SECTION (Bottom, 144pt tall):
- Flexible spacer pushes CTAs to bottom
- Primary Button: "GET STARTED"
  - Width: 321px (393pt - 72px margins)
  - Height: 48px (meets 44px minimum touch target)
  - Background: var(--primary), Text: var(--primary-foreground)
  - Press Start 2P font, 16px, uppercase
  - Border: 4px solid var(--primary)
  - Hard pixel shadow: 4×4px offset, var(--foreground) color, no blur
  - Border-radius: var(--radius)
- 16pt gap below button
- Secondary Link: "I already have an account"
  - Montserrat, 14px, var(--muted-foreground), underline
  - Touch target: 240×44px (centered)
- 40pt bottom padding (above home indicator)

ANIMATIONS (Staggered Entrance):
Apply these on screen load:
1. Logo: fade opacity 0→1, scale 0.9→1.0 (400ms, ease-out, delay 0ms)
2. Tagline: fade opacity 0→1, translateY 20px→0 (300ms, ease-out, delay 200ms)
3. CTA Button: fade opacity 0→1, scale 0.95→1.0 with spring ease (300ms, delay 400ms)

Make the screen pixel-perfect, retro aesthetic matching your chosen theme.
```

### Refinement Prompts

```
// Adjust logo if needed
"Replace the placeholder logo with a custom 96×96px pixel art sprite:
- Character holding a dumbbell
- 16-bit style, limited to theme color palette
- Front-facing pose, simple silhouette
- Export as crisp PNG-8, no anti-aliasing"

// Tighten spacing
"Reduce the gap between tagline and CTA button by 40pt to bring the button higher on screen"

// Enhance button interaction
"Add hover state to primary button: brightness increase by 10%, 100ms transition"

// Add CRT screen effect (optional)
"Apply subtle CRT scan lines overlay to entire screen (1px horizontal lines, 10% opacity, repeating pattern)"
```

---

## Screen 2: ProfileSetupScreen Prompts

### Base Screen Generation

```
Design the Profile Setup Screen for 16BitFit (393×852pt, Step 2 of 3).

IMPORTANT: Use your imported theme colors (DMG Classic, Neon Arcade, Fitness Pulse, or Retro Synthwave).
All color references below use semantic tokens that map to your active theme.

LAYOUT & STRUCTURE:
- KeyboardAvoidingView enabled (iOS padding behavior)
- ScrollView with 180pt bottom padding for sticky CTA
- Safe areas: top 59pt, bottom 34pt
- Background: var(--background)

TOP SECTION:
- Progress Indicator: ● ● ○ "Step 2 of 3" (same style as WelcomeScreen, positioned 79pt from top)

SCROLLABLE CONTENT (starts at 139pt from top):

HEADER (108pt tall):
- Title: "CREATE PROFILE"
  - Press Start 2P, 24px, uppercase, center-aligned, var(--foreground)
  - 45pt from progress indicator
- 12pt gap
- Subtitle: "Choose your unique username and optional display name."
  - Montserrat, 16px, line-height 1.5, center-aligned, var(--muted-foreground)
  - Max-width: 280px, 3 lines max

32pt gap after header

FORM SECTION:

Username Field (112pt total height):
- Label: "Username *" (asterisk in var(--destructive) color)
  - Montserrat SemiBold, 14px, var(--foreground)
  - 8pt margin below label
- Input Field (48pt height):
  - Border: 3px solid var(--border) (default)
  - Border (focused): 4px solid var(--ring)
  - Border (error): 3px solid var(--destructive)
  - Background: var(--input)
  - Padding: 16px horizontal, 16px vertical
  - Text: Montserrat, 16px, var(--foreground)
  - Placeholder: "Enter username..." (var(--muted-foreground), 60% opacity)
  - Border-radius: var(--radius)
- 8pt margin below input
- Helper Text: "3-20 characters (letters, numbers, underscore)"
  - Montserrat, 12px, var(--muted-foreground)
  - Changes to var(--destructive) on error state

24pt gap between fields

Display Name Field (112pt total height, optional):
- Label: "Display Name" (no asterisk - optional field)
  - Montserrat SemiBold, 14px, var(--foreground)
- Input Field: same styling as username
  - Placeholder: "Optional display name..."
- Helper Text: "This is how others will see you"

STICKY CTA SECTION (144pt tall, absolute positioned at bottom):
- Border-top: 3px solid var(--border)
- Background: var(--background)
- Padding: 24pt top, 40pt bottom, 24pt horizontal
- Primary Button: "CREATE ACCOUNT"
  - Full width (345px), height 48px
  - Same button style as WelcomeScreen
  - Background: var(--primary), Text: var(--primary-foreground)
  - Disabled state: 40% opacity
  - Loading state: Replace text with spinner
- 12pt gap
- Secondary Link: "Skip for now"
  - Montserrat, 14px, var(--muted-foreground), underline, center-aligned

INPUT STATES & ANIMATIONS:
1. Focus state: Border width 3px→4px, color var(--border)→var(--ring) (150ms ease-out)
2. Error state: Border color→var(--destructive), shake animation (left-right 10px, 500ms, 7 keyframes)
3. Success state: Border color→var(--secondary), checkmark icon appears right side (20×20px)

KEYBOARD BEHAVIOR:
- When keyboard appears, scroll active input into view
- Maintain sticky CTA section visibility
- Keyboard offset: account for 291pt keyboard height (iOS)

Generate with pixel-perfect styling and clear validation states matching your chosen theme.
```

### Refinement Prompts

```
// Add real-time validation
"Add real-time username validation:
- As user types, check length (3-20 chars)
- Check characters (alphanumeric + underscore only)
- Show green checkmark icon (20×20px) on right side when valid
- Show red error icon when invalid"

// Enhance error handling
"When validation fails, trigger shake animation:
- Input field moves: 0 → -10px → 10px → -10px → 10px → -5px → 5px → 0
- Duration: 500ms total
- Easing: ease-in-out
- Simultaneous border color change to var(--destructive)"

// Add Skip confirmation dialog
"When user taps 'Skip for now', show confirmation modal:
- Modal: 400×300px centered overlay
- Title: 'SKIP ACCOUNT CREATION?' (Press Start 2P, 20px)
- Message: 'You can create an account later to save your progress across devices.' (Montserrat, 14px)
- Two buttons: 'Cancel' (secondary), 'Skip' (primary destructive style)
- Backdrop: rgba(0,0,0,0.8)"

// Optimize for smaller screens
"Create responsive variant for iPhone SE (375×667pt):
- Reduce header vertical spacing by 20pt
- Adjust sticky CTA to 120pt tall
- Maintain all touch targets ≥44×44px"
```

---

## Screen 3: ArchetypeSelectionScreen Prompts

### Base Screen Generation

```
Design the Archetype Selection Screen for 16BitFit (393×852pt, Step 3 of 3).

IMPORTANT: Use your imported theme colors (DMG Classic, Neon Arcade, Fitness Pulse, or Retro Synthwave).
All color references below use semantic tokens that map to your active theme.

LAYOUT & STRUCTURE:
- ScrollView with 100pt bottom padding for sticky CTA
- Safe areas: top 59pt, bottom 34pt
- Background: var(--background)

TOP SECTION:
- Progress Indicator: ● ● ● "Step 3 of 3" (79pt from top)

SCROLLABLE CONTENT:

HEADER (108pt tall, starts 139pt from top):
- Title: "SELECT ARCHETYPE"
  - Press Start 2P, 24px, uppercase, center-aligned, var(--foreground)
- 12pt gap
- Subtitle: "Choose your fitness style. You can change this later."
  - Montserrat, 16px, line-height 1.5, center-aligned, var(--muted-foreground)
  - Max-width: 300px

32pt gap after header

ARCHETYPE GRID (starts 279pt from top):
- Layout: 2-column grid with 16px gap
- Grid width: 345px (393 - 48px screen margins)
- Card width: 164.5px per card ((345 - 16) / 2)
- Card height: 200px

ARCHETYPE CARD SPECIFICATIONS (Create 5 cards):

Card Structure:
- Dimensions: 164.5×200px
- Padding: 16px internal
- Border: 3px solid var(--border) (default)
- Border (selected): 4px solid var(--primary)
- Background: var(--card)
- Border-radius: var(--radius)
- Vertical layout, center-aligned items
- 12px gap between internal elements

Card Contents:
1. Avatar: 80×80px pixel art sprite (top, centered)
   - Style: 16-bit retro, front-facing character
   - Use theme color palette
   - Crisp pixel rendering (no anti-aliasing)
   - 8pt margin below

2. Name: Archetype name (Press Start 2P, 16px, uppercase, var(--card-foreground))
   - Center-aligned, single line
   - 4pt margin below

3. Description: Brief description (Montserrat, 12px, var(--muted-foreground))
   - Center-aligned, max 2 lines (36px height)
   - Line-height: 1.5

ARCHETYPE DATA (Create these 5 cards):

Row 1 (2 cards):
1. TRAINER
   - Avatar: Balanced trainer character (placeholder: athletic person with whistle)
   - Description: "Balanced fitness with variety of exercises"

2. RUNNER
   - Avatar: Running character (placeholder: person in running pose)
   - Description: "Built for endurance and speed"

Row 2 (2 cards):
3. YOGA
   - Avatar: Yoga character (placeholder: person in tree pose)
   - Description: "Focus on flexibility and mindfulness"

4. BODYBUILDER
   - Avatar: Muscular character (placeholder: person flexing)
   - Description: "Strength and muscle building focus"

Row 3 (1 card, centered):
5. CYCLIST
   - Avatar: Cycling character (placeholder: person on bike)
   - Description: "Cardio and leg strength specialist"

CARD INTERACTION STATES:
- Default: 3px border var(--border), scale 1.0
- Selected: 4px border var(--primary), scale 1.05, subtle glow using var(--primary) at 30% opacity
- Hover (web): Slight border brightening, 200ms transition
- Touch feedback: Brief scale to 0.98 on press (100ms)

STICKY CTA SECTION (104pt tall, bottom):
- Border-top: 3px solid var(--border)
- Background: var(--background)
- Padding: 24pt top, 40pt bottom, 24pt horizontal
- Primary Button: "CONTINUE"
  - Full width (345px), height 48px
  - Same button style as previous screens
  - Background: var(--primary), Text: var(--primary-foreground)
  - Disabled state: 40% opacity (until archetype selected)

STAGGERED ENTRANCE ANIMATION:
Apply on screen load:
1. Card 1: fade + translateY (250ms, ease-out, delay 0ms)
2. Card 2: fade + translateY (250ms, ease-out, delay 50ms)
3. Card 3: fade + translateY (250ms, ease-out, delay 100ms)
4. Card 4: fade + translateY (250ms, ease-out, delay 150ms)
5. Card 5: fade + translateY (250ms, ease-out, delay 200ms)
- Initial state: opacity 0, translateY 30px
- Final state: opacity 1, translateY 0
- Total animation time: 450ms

SELECTION ANIMATION:
When user taps card:
1. Deselect previous (if any): scale 1.05→1.0, border 4px→3px, shadow fade out (150ms)
2. Select new: scale 1.0→1.05, border 3px→4px, shadow fade in (200ms spring easing)
3. Haptic: Medium vibration
4. Toast notification: "[Name] selected!" (top, 2s auto-dismiss, var(--secondary) border)

Generate with pixel-perfect styling, responsive grid layout, and smooth selection feedback matching your chosen theme.
```

### Refinement Prompts

```
// Replace placeholder avatars with specific sprites
"Replace TRAINER avatar with detailed 80×80px pixel art:
- Character: Athletic person wearing cap and holding clipboard
- Style: 16-bit, front-facing, use active theme color palette
- Details: Simple facial features, defined body shape, professional trainer aesthetic"

// Enhance selection feedback
"Add pulse animation to selected card:
- After selection, card gently pulses: scale 1.05→1.07→1.05 (800ms, ease-in-out)
- Glow intensity pulses: shadowOpacity 0.6→0.8→0.6
- Loop 3 times then stop
- Confirms to user their selection is active"

// Add card hover preview (desktop)
"On desktop hover (pointer device detected):
- Card scales to 1.02 (200ms ease-out)
- Border brightens slightly (increase brightness by 20%)
- Cursor: pointer
- Brief description tooltip appears above card (300ms delay)"

// Create responsive tablet variant
"Generate tablet variant (iPad Air, 820×1180pt):
- Change grid to 3 columns (3 archetypes per row, 2 rows)
- Card width: 246px each ((820 - 160 margins - 32 gaps) / 3)
- Card height: 220px (slightly taller)
- Avatar: 96×96px (larger on tablet)
- Maintain all spacing proportions"

// Add empty state handling
"If no archetypes available (error state):
- Show empty state: 96×96px sad pixel art icon
- Message: 'ARCHETYPES UNAVAILABLE' (Press Start 2P, 20px)
- Subtitle: 'Please check your connection and try again.' (Montserrat, 16px)
- Retry button below message"
```

---

## Component Library Prompts (Using Flow Tool)

**IMPORTANT**: These prompts are optimized for **MagicPath.ai's Flow tool** to generate individual UI components that can be reused across your screens. Use these AFTER you've imported Theme 6 (LCD Screen Content) or Theme 5 (Game Boy Shell).

### How to Use Component Prompts in MagicPath.ai

1. **Set up theme** (Theme 6 for components, viewport 329×584pt)
2. **Start with simplest component** (e.g., PixelButton)
3. **Generate using prompt below**
4. **Save to Library** in MagicPath.ai
5. **Recall in future prompts** using `@ComponentName`
6. **Export to React Native** when satisfied

---

### Atomic Component Prompts (Building Blocks)

#### 1. PixelButton (Primary CTA)

```
Create a React Native button component using the imported LCD Screen Content theme.

Component Name: PixelButton
Viewport: 329×584pt (for preview)
Platform: React Native with TypeScript

VISUAL SPECIFICATIONS:
- Dimensions: 280×44px (full content width × minimum touch target)
- Padding: 12px horizontal (text padding inside border)
- Border: 3px solid var(--border)
- Background: var(--primary) (#8BAC0F lime green)
- Text: Press Start 2P font, 12px, uppercase, var(--primary-foreground) (#0F380F)
- Shadow: Hard pixel shadow 4×4px offset, var(--border) color, no blur
- Border-radius: var(--radius) (0rem - sharp corners)

STATES:
1. Default: scale 1.0, shadow 4×4px, opacity 1.0
2. Pressed: scale 0.98, shadow 2×2px (100ms sharp easing)
3. Hover: brightness +10% (200ms ease-out) [web only]
4. Disabled: opacity 0.4, pointer-events none
5. Loading: show spinner (var(--primary-foreground)), hide text

ANIMATION:
- Press: scale 1.0→0.98 + shadow 4×4→2×2 (100ms ease-in)
- Release: scale 0.98→1.0 + shadow 2×2→4×4 (100ms ease-out)
- Use native driver for GPU acceleration

VARIANTS:
- Primary: var(--primary) background, var(--primary-foreground) text
- Secondary: transparent background, 3px var(--border) border, var(--foreground) text, no shadow
- Tertiary: transparent background, no border, var(--accent) underlined text, no shadow

PROPS:
- variant?: 'primary' | 'secondary' | 'tertiary' (default 'primary')
- disabled?: boolean
- loading?: boolean
- fullWidth?: boolean (default true for LCD)
- onPress: () => void
- children: string

ACCESSIBILITY:
- Minimum touch target: 44×44px (add transparent padding if text is small)
- accessibilityRole: 'button'
- accessibilityLabel: descriptive
- accessibilityHint: result of action

Generate as reusable component. Display in center of viewport for preview.
```

#### 2. PixelInput (Form Text Field)

```
Create a React Native text input component using the imported LCD Screen Content theme.

Component Name: PixelInput
Viewport: 329×584pt
Platform: React Native with TypeScript

VISUAL SPECIFICATIONS:
- Dimensions: 280×44px (full content width)
- Padding: 12px horizontal, 12px vertical
- Border: 3px solid var(--border) (default state)
- Background: var(--input) (#9BBC0F)
- Text: Montserrat, 14px, var(--foreground) (#0F380F)
- Placeholder: Montserrat, 14px, var(--muted-foreground), 60% opacity
- Border-radius: var(--radius) (0rem)

STATES:
1. Default: border 3px var(--border) (#306230)
2. Focused: border 4px var(--ring) (#8BAC0F), transition 150ms ease-out
3. Error: border 3px var(--destructive) (#306230 - muted red)
4. Success: border 3px var(--secondary) (#306230), checkmark icon right side
5. Disabled: opacity 0.5, pointer-events none

ERROR SHAKE ANIMATION:
When error prop changes false→true:
- translateX: 0 → -10 → 10 → -10 → 10 → -5 → 5 → 0 (px)
- Duration: 500ms total (7 keyframes, ~71ms each)
- Easing: ease-in-out
- Simultaneously change border to var(--destructive)

PROPS:
- value: string
- onChangeText: (text: string) => void
- onFocus?: () => void
- onBlur?: () => void
- placeholder?: string
- error?: boolean
- success?: boolean
- disabled?: boolean
- secureTextEntry?: boolean
- autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
- keyboardType?: 'default' | 'email-address' | 'numeric'
- maxLength?: number

ACCESSIBILITY:
- accessibilityLabel: field purpose
- accessibilityHint: expected input
- accessibilityState: { disabled: boolean }

Generate as reusable component. Display in center with example text.
```

#### 3. PixelSprite (Pixel Art Image)

```
Create a React Native image component for crisp pixel art rendering using the imported LCD theme.

Component Name: PixelSprite
Viewport: 329×584pt
Platform: React Native with TypeScript

PURPOSE:
Display pixel art with nearest-neighbor scaling (no anti-aliasing blur)

VISUAL SPECIFICATIONS:
- Always square dimensions (size × size px)
- No interpolation/smoothing - crisp pixel edges
- Optional 3px border var(--border)
- Optional background var(--muted) for transparency handling
- Border-radius: 0 (sharp corners)

SIZE PRESETS:
- tiny: 16×16px
- small: 24×24px
- medium: 32×32px (default)
- large: 48×48px
- xl: 60×60px (archetype card avatars)
- xxl: 80×80px (logo, hero icons)

PROPS:
- source: ImageSourcePropType (require() or { uri })
- size?: 16 | 24 | 32 | 48 | 60 | 80 (default 32)
- bordered?: boolean (default false)
- borderColor?: string (default var(--border))
- alt?: string (accessibility description)

IMPLEMENTATION:
- resizeMode: 'pixelated' (iOS) or 'contain' (Android)
- For web: style={{ imageRendering: 'pixelated' }}
- Width and height must be exact (no aspect ratio calculation)

ACCESSIBILITY:
- accessibilityLabel: alt prop or 'Pixel art image'
- accessibilityRole: 'image'

Generate as reusable component. Display 3 size examples (32px, 60px, 80px) with placeholder pixel art.
```

#### 4. ProgressIndicator (Step Dots)

```
Create a React Native step progress indicator using the imported LCD Screen Content theme.

Component Name: ProgressIndicator
Viewport: 329×584pt
Platform: React Native with TypeScript

VISUAL SPECIFICATIONS:
Layout: Vertical stack (dots + label), center-aligned, 8px gap

DOTS ROW:
- Horizontal row, center-aligned, 12px gap between dots
- Inactive dots: 12×12px, var(--muted) background, 40% opacity
- Active dots: 16×16px (larger), var(--primary) background, 100% opacity
- Shape: Square (border-radius 0) - matches retro aesthetic

LABEL:
- Position: Below dots, 8px gap
- Text: "Step X of Y"
- Font: Montserrat, 12px, var(--muted-foreground)
- Alignment: center

ANIMATION (when currentStep changes):
- New active dot: scale 0.8→1.0 (200ms spring easing)
- Label: opacity 0.5→1.0 (150ms ease-out)

PROPS:
- totalSteps: number (e.g., 3 for onboarding)
- currentStep: number (1-indexed, e.g., 1, 2, or 3)
- showLabel?: boolean (default true)

ACCESSIBILITY:
- accessibilityRole: 'progressbar'
- accessibilityLabel: `Step ${currentStep} of ${totalSteps}`
- accessibilityValue: { min: 1, max: totalSteps, now: currentStep }

Generate as reusable component. Display example showing "Step 2 of 3" (● ● ○).
```

---

### Molecular Component Prompts (Composed Components)

#### 5. FormField (Complete Input with Label)

```
Create a complete form field component using PixelInput and the LCD Screen Content theme.

Component Name: FormField
Viewport: 329×584pt
Platform: React Native with TypeScript

STRUCTURE (vertical stack, 8px gaps):

1. Label (top):
   - Font: Montserrat SemiBold, 12px, var(--foreground)
   - Required asterisk (*) in var(--destructive) if required=true
   - 8px margin below

2. Input:
   - Use PixelInput component (280×44px)
   - Pass through all input props

3. Helper/Error/Success Text (bottom):
   - Font: Montserrat, 10px
   - Colors:
     - Default helper: var(--muted-foreground)
     - Error: var(--destructive)
     - Success: var(--secondary)
   - 6px margin above

VALIDATION STATES:
- Default: Show helperText in var(--muted-foreground)
- Error: Show errorText in var(--destructive), trigger shake on input
- Success: Show successText in var(--secondary), show checkmark icon

PROPS:
- label: string
- value: string
- onChangeText: (text: string) => void
- placeholder?: string
- helperText?: string
- errorText?: string
- successText?: string
- error?: boolean
- success?: boolean
- required?: boolean
- All PixelInput props (secureTextEntry, keyboardType, etc.)

ACCESSIBILITY:
- Label is accessibilityLabel for input
- Helper text is accessibilityHint
- Error/success announced via accessibilityLiveRegion

Generate as reusable component. Display example with label "Username *" and helper text.
```

#### 6. ArchetypeCard (Selectable Card)

```
Create a selectable card component for fitness archetypes using the LCD Screen Content theme.

Component Name: ArchetypeCard
Viewport: 329×584pt
Platform: React Native with TypeScript

VISUAL SPECIFICATIONS:
- Dimensions: 134×156px (fits 2 columns in 280px width with 12px gap)
- Padding: 12px internal
- Border: 3px solid var(--border) (default)
- Border (selected): 4px solid var(--primary)
- Background: var(--card)
- Border-radius: var(--radius) (0)
- Layout: Vertical flex, center-aligned, 6px gaps between items

CONTENT STRUCTURE (top to bottom):
1. Avatar: PixelSprite component, 60×60px
   - Crisp pixel art, DMG palette
   - Centered

2. Name:
   - Font: Press Start 2P, 12px, uppercase, var(--card-foreground)
   - Center-aligned, single line, no wrap

3. Description:
   - Font: Montserrat, 9px, var(--muted-foreground)
   - Center-aligned, max 2 lines, line-height 1.3

STATES & ANIMATIONS:
1. Default:
   - scale: 1.0
   - border: 3px var(--border)
   - no shadow

2. Selected:
   - scale: 1.03 (spring easing, 200ms)
   - border: 4px var(--primary)
   - Small checkmark icon (12×12px) top-right corner

3. Pressed (tap feedback):
   - scale: 0.98 (100ms)
   - Brief haptic feedback

SELECTION ANIMATION:
When selecting new card (deselecting previous):
- Previous card: scale 1.03→1.0, border 4px→3px (150ms)
- New card: scale 1.0→1.03, border 3px→4px (200ms spring)
- Animations run in parallel

PROPS:
- id: string
- name: string (e.g., "TRAINER", "RUNNER")
- description: string (e.g., "Balanced fitness variety")
- avatarSource: ImageSourcePropType
- selected: boolean
- onSelect: (id: string) => void

ACCESSIBILITY:
- accessibilityRole: 'button'
- accessibilityLabel: `Select ${name} archetype`
- accessibilityHint: description
- accessibilityState: { selected: boolean }
- Minimum 134×156px touch area (entire card tappable)

Generate as reusable component. Display 2 cards side-by-side (one selected, one not) with example data.
```

#### 7. ToastNotification (Temporary Alert)

```
Create a React Native toast notification component using the imported LCD Screen Content theme.

Component Name: ToastNotification
Viewport: 329×584pt
Platform: React Native with TypeScript

PURPOSE:
Temporary overlay message for success/error/info feedback (auto-dismisses)

VISUAL SPECIFICATIONS:
- Position: Absolute, top 40pt (below safe area + margin)
- Width: 280px (matches content width, 24px margins from screen edges)
- Min-height: 56px (auto-expand for longer messages)
- Padding: 12px horizontal, 10px vertical
- Border: 3px solid (color varies by variant)
- Background: var(--card) (#9BBC0F slightly elevated)
- Border-radius: var(--radius) (0rem - sharp corners)
- z-index: 9999 (always on top)

LAYOUT:
Horizontal row, 12px gap, center-aligned vertically:

1. Icon (left):
   - Size: 16×16px pixel art icon
   - Colors by variant:
     - success: var(--secondary) (#306230) - checkmark ✓
     - error: var(--destructive) (#306230) - X icon
     - warning: var(--accent) (#8BAC0F) - ! icon
     - info: var(--ring) (#8BAC0F) - i icon

2. Message (center):
   - Font: Montserrat Medium, 12px, var(--foreground)
   - flex: 1 (takes remaining space)
   - Max 2 lines, line-height 1.4
   - Overflow: ellipsis if too long

3. Close Button (optional, right):
   - Size: 16×16px touchable
   - Icon: X (var(--muted-foreground))
   - Only shown if dismissible=true

VARIANTS (border colors):
- success: 3px solid var(--secondary) (#306230 - green tone)
- error: 3px solid var(--destructive) (#306230 - red tone)
- warning: 3px solid var(--accent) (#8BAC0F - yellow tone)
- info: 3px solid var(--ring) (#8BAC0F - blue tone)

ANIMATIONS:
Entry (when visible changes false→true):
- translateY: -80px → 0px (slides down from top)
- opacity: 0 → 1
- Duration: 300ms
- Easing: spring (slight bounce at end)

Exit (when visible changes true→false or auto-dismiss):
- translateY: 0px → -80px (slides up)
- opacity: 1 → 0
- Duration: 200ms
- Easing: ease-in

Auto-Dismiss:
- Start timer when visible=true
- After duration (default 3000ms), trigger exit animation
- Call onDismiss callback after animation completes

PROPS:
- message: string (required)
- variant?: 'success' | 'error' | 'warning' | 'info' (default 'info')
- duration?: number (milliseconds, default 3000, 0 = no auto-dismiss)
- visible: boolean (controls show/hide)
- onDismiss?: () => void (called when dismissed)
- dismissible?: boolean (show close button, default false)

STATES:
1. Hidden: opacity 0, translateY -80px, not rendered in DOM
2. Entering: opacity 0→1, translateY -80→0 (300ms spring)
3. Visible: opacity 1, translateY 0, timer running (if duration > 0)
4. Exiting: opacity 1→0, translateY 0→-80 (200ms ease-in)

EXAMPLES (show 4 variants):
1. Success: "Profile saved successfully!"
2. Error: "Username already taken"
3. Warning: "Internet connection slow"
4. Info: "Swipe to see more archetypes"

ACCESSIBILITY:
- accessibilityLiveRegion: 'polite' (announces to screen readers)
- accessibilityRole: 'alert'
- accessibilityLabel: `${variant}: ${message}`
- Announced immediately when visible=true
- Does not interrupt screen reader navigation

IMPLEMENTATION NOTES:
- Use React Native Reanimated useSharedValue for translateY and opacity
- withSpring for entry animation (bouncy feel)
- withTiming for exit animation (smooth)
- Use useEffect to handle auto-dismiss timer
- Clear timer on manual dismiss or component unmount
- Render in absolute position OR use Portal/Overlay component for proper z-index

USAGE PATTERN:
- Parent component manages visible state
- Toast shows on user action (form submit, selection, etc.)
- Auto-dismisses after duration
- User can manually dismiss if dismissible=true
- Only one toast visible at a time (queue if multiple)

Generate as reusable component. Display all 4 variants stacked vertically (20px gaps) for preview.
```

---

### Save Components as Reusable Library

After generating each component in MagicPath.ai:

```
Save the following components to a new Library called "16BitFit-Components-v1":

1. PixelButton (Primary variant)
2. PixelButton (Secondary variant)
3. PixelButton (Tertiary variant)
4. PixelInput (Form text field)
5. PixelSprite (Pixel art image component)
6. ProgressIndicator (Step dots component)
7. FormField (Complete input with label/helper/error)
8. ArchetypeCard (Selectable card component)
9. ToastNotification (Success/error message overlay)

For each component, ensure:
- States are included (default, hover, active, disabled, error, success)
- Animations are preserved
- Component uses theme tokens (not hardcoded values)
- Component is named consistently (@16BitFit/ComponentName)
```

### Recall Components in New Projects

```
// Use saved components in new screens
"Create a new dashboard screen using @16BitFit/PixelButton for the CTA and @16BitFit/ProgressIndicator at the top"

// Customize saved component
"Use @16BitFit/ArchetypeCard but change it to display workout exercises instead of archetypes"

// Create variant of existing component
"Generate a variant of @16BitFit/FormField for password input with show/hide toggle icon"
```

---

## Animation & Micro-Interaction Prompts

### AI-to-AI Workflow: Technical Animation Specs

Use these prompts with ChatGPT/Gemini first to generate precise specs, then paste into MagicPath.ai:

#### Prompt for External LLM (ChatGPT/Gemini):

```
I am designing animations for a retro fitness app in MagicPath.ai. Generate a precise Motion Spec for the following interaction:

[DESCRIBE YOUR DESIRED ANIMATION]

Output the spec in this format:
1. Target/Trigger: [Element selector and trigger event]
2. Initial/Final States: [CSS properties with values]
3. Timeline: [Duration, delay, iterations]
4. Easing: [Cubic-bezier values for precise timing]
5. Transform-origin: [If using scale/rotate]
6. 3D Properties: [If applicable]
7. Reduced-motion variant: [Accessibility fallback]
8. Performance notes: [will-change, requestAnimationFrame, etc.]

Provide implementation-ready CSS/JS specifications that MagicPath.ai can execute.
```

### Example Animation Prompts (Ready for MagicPath.ai)

#### Button Press Animation (Pop Effect)

```
Apply micro-interaction to @16BitFit/PixelButton (primary variant):

TARGET: .btn-primary button element
TRIGGER: click event (also on Enter key when focused)

ANIMATION SEQUENCE:
1. Press state (mousedown/touchstart):
   - transform: scale(0.95)
   - duration: 100ms
   - easing: cubic-bezier(0.4, 0, 1, 1) [ease-in, sharp]
   - Simultaneously: box-shadow reduces from 4px×4px to 2px×2px

2. Release state (mouseup/touchend):
   - transform: scale(1.0) with brief overshoot
   - duration: 100ms
   - easing: cubic-bezier(0.175, 0.885, 0.32, 1.275) [bounce effect]
   - box-shadow returns to 4px×4px

3. Haptic feedback: Medium vibration on press

ACCESSIBILITY:
- @media (prefers-reduced-motion: reduce): Skip scale animation, keep shadow change
- Keyboard users: Same animation on Enter/Space keypress
- Focus visible: 4px outline #00D0FF

PERFORMANCE:
- Use will-change: transform, box-shadow
- Runs on GPU via transform
- Target 60fps
```

#### Staggered Card Entrance

```
Apply staggered entrance animation to archetype cards grid on ArchetypeSelectionScreen:

TARGET: .archetype-card elements (5 total)
TRIGGER: on page load / scroll into viewport

INITIAL STATE:
- opacity: 0
- transform: translateY(30px)

FINAL STATE:
- opacity: 1
- transform: translateY(0)

TIMELINE:
- Duration: 250ms per card
- Easing: cubic-bezier(0, 0, 0.2, 1) [ease-out]
- Stagger: 50ms delay increment per card
  - Card 1: delay 0ms
  - Card 2: delay 50ms
  - Card 3: delay 100ms
  - Card 4: delay 150ms
  - Card 5: delay 200ms
- Total sequence: 450ms (250ms animation + 200ms stagger)

IMPLEMENTATION:
- Use CSS animation-delay with :nth-child(n) selectors
- Alternative: JavaScript IntersectionObserver to trigger on scroll into view

ACCESSIBILITY:
- @media (prefers-reduced-motion: reduce): Remove translateY, instant opacity 0→1

PERFORMANCE:
- will-change: transform, opacity
- Use native driver (GPU accelerated)
```

#### Form Input Error Shake

```
Apply error shake animation to form inputs on ProfileSetupScreen:

TARGET: .form-field input element
TRIGGER: Validation failure (username invalid, form submission error)

ANIMATION:
- Property: transform: translateX()
- Keyframes: 0 → -10px → 10px → -10px → 10px → -5px → 5px → 0
- Duration: 500ms total (7 keyframes, ~71ms each)
- Easing: ease-in-out

SIMULTANEOUS EFFECTS:
- Border color changes: #306230 → #FF4757 (200ms ease-out)
- Error icon appears: fade opacity 0→1 (150ms)
- Haptic: Error vibration (triple buzz pattern: [0, 100, 100, 100])

ACCESSIBILITY:
- @media (prefers-reduced-motion: reduce): Skip shake, show error color/icon only
- Screen reader: Announce error message via aria-live="polite"

PERFORMANCE:
- Use transform (not left/right position)
- will-change: transform
```

#### Loading Skeleton Shimmer

```
Create skeleton loader animation for data loading states:

TARGET: .skeleton-card placeholder elements
TRIGGER: While content is loading (data fetch in progress)

VISUAL STRUCTURE:
- Base color: #306230 (elevated surface)
- Shimmer overlay: linear-gradient moving left→right
  - Colors: #306230 → #8BAC0F → #306230
  - Gradient stops: 0% dark, 50% light, 100% dark

ANIMATION:
- Property: background-position
- Keyframes: background-position: -200% 0 → 200% 0 (moves gradient across)
- Duration: 1500ms
- Easing: linear
- Iterations: infinite (loops continuously)

IMPLEMENTATION:
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-card {
  background: linear-gradient(
    90deg,
    #306230 0%,
    #8BAC0F 50%,
    #306230 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1500ms linear infinite;
}

ACCESSIBILITY:
- aria-hidden="true" on skeleton (hide from screen readers)
- aria-busy="true" on parent container
- @media (prefers-reduced-motion: reduce): Static gradient (no animation)

PERFORMANCE:
- will-change: background-position
- Remove when content loads (transition opacity to 0, remove from DOM after 200ms)
```

---

## Iteration & Refinement Prompts

### Visual Adjustments

```
// Tighten spacing
"Reduce vertical spacing between all elements by 8pt to fit more content above the fold"

// Adjust colors
"Shift the primary accent color from #8BAC0F to #9BBC0F (brighter) for better contrast"

// Change font weights
"Make all Press Start 2P text slightly bolder by adding text-shadow: 1px 1px 0 currentColor for faux-bold effect"

// Enhance borders
"Increase all border widths from 3px to 4px for stronger retro aesthetic"

// Add texture
"Apply subtle noise texture overlay to background (10% opacity, small grain)"
```

### Responsive Adjustments

```
// Create mobile variant
"Generate iPhone SE variant (375×667pt):
- Reduce card width to 155px
- Maintain 16px gap
- Adjust font sizes down by 10% (H1: 29px, H2: 22px, Body: 15px)
- Keep all touch targets ≥44×44px"

// Create tablet variant
"Generate iPad Air landscape variant (1180×820pt):
- 3-column archetype grid
- Increase card width to 260px
- Larger avatar: 96×96px
- Side margins: 80px (more breathing room)"

// Create desktop variant
"Generate desktop variant (1440×900pt):
- Center content in 600px container
- Larger logos and typography (H1: 40px)
- Add hover states to all interactive elements"
```

### Accessibility Enhancements

```
// Improve contrast
"Audit all text/background contrast ratios. Ensure:
- Body text (#9BBC0F on #0F380F): minimum 4.5:1
- Captions (#8BAC0F on #0F380F): minimum 4.5:1
- Adjust colors if needed to meet WCAG AA"

// Add keyboard navigation
"Ensure all interactive elements are keyboard accessible:
- Tab order follows visual layout (top→bottom)
- Focus indicators: 4px solid #00D0FF outline, 2px offset
- Escape key closes modals
- Enter/Space activates buttons"

// Add screen reader labels
"Add proper ARIA labels:
- Buttons: aria-label describing action
- Form inputs: aria-describedby linking to helper text
- Progress indicator: aria-label 'Step 2 of 3'
- Cards: aria-label with archetype name + description"

// Reduce motion support
"Add @media (prefers-reduced-motion: reduce) rules:
- Disable all staggered entrance animations
- Disable shake animations
- Reduce all transition durations to 0ms or 100ms max
- Keep functional animations only (focus rings, state changes)"
```

### Performance Optimizations

```
// Optimize assets
"Compress all sprite assets:
- Export as PNG-8 (8-bit color depth)
- Ensure file sizes <30KB each
- Use crisp pixel rendering (image-rendering: pixelated)
- Generate @1x, @2x, @3x variants"

// Optimize animations
"Ensure all animations use GPU acceleration:
- Only animate transform and opacity properties
- Set will-change: transform on animated elements
- Use CSS transitions/animations (not JavaScript when possible)
- Target 60fps (16.67ms per frame)"

// Lazy load images
"Implement lazy loading for archetype avatars:
- Load placeholder (solid color) first
- Fade in actual sprite when loaded (300ms fade)
- Use IntersectionObserver for below-fold images"
```

### Variant Generation

```
// Generate color variants
"Generate 3 color variants of the ProfileSetupScreen:
1. Original DMG palette (green)
2. Neon Arcade palette (cyan/magenta)
3. Sepia retro palette (browns/yellows)"

// Generate layout variants
"Generate 3 layout variants of the ArchetypeSelectionScreen:
1. Original 2-column grid
2. Horizontal carousel (1 card visible, swipe to next)
3. Vertical list (1 card per row, larger cards)"

// Generate button variants
"Generate 5 variants of the primary button with different retro styles:
1. Original (pixel shadow)
2. Neon glow effect
3. Embossed 3D style
4. Scanline overlay
5. Pixelated border pattern"
```

---

## Best Practices Summary

### Do's ✅

1. **Always specify theme first**: Apply "16BitFit-DMG" system before generating screens
2. **Use exact measurements**: Provide pt values for iOS, px for web
3. **Include states**: Define default, hover, active, disabled, error for all interactive elements
4. **Specify animations**: Include duration, easing (cubic-bezier), delay, iterations
5. **Reference components**: Use `@ComponentName` to recall saved Library components
6. **Generate variants**: Ask for 3-5 options to explore quickly
7. **Attach references**: Upload screenshots to match visual style
8. **Test responsiveness**: Generate mobile, tablet, desktop variants
9. **Accessibility first**: Include focus states, ARIA labels, reduced motion
10. **Save to Library**: Convert polished components to reusable Library items

### Don'ts ❌

1. **Don't be vague**: Avoid "make it look cool" - specify colors, sizes, effects
2. **Don't skip animations**: Static designs feel incomplete - add micro-interactions
3. **Don't ignore constraints**: Always mention viewport size, safe areas, scroll behavior
4. **Don't hardcode values**: Reference theme tokens (not raw hex codes)
5. **Don't generate huge screens at once**: Build components first, then assemble
6. **Don't forget states**: Buttons need hover/active/disabled, not just default
7. **Don't skip variants**: Generate options to avoid prompt fatigue
8. **Don't ignore accessibility**: Touch targets, contrast, keyboard nav are required
9. **Don't forget exports**: Specify if you need React, Vue, HTML/CSS output
10. **Don't skip testing**: Use Web Preview to validate interactions before export

---

## Game Boy Shell Mockup Variant (Full Device View)

### Purpose
This variant shows the complete Game Boy Classic hardware aesthetic with the onboarding screen content displayed on the virtual LCD. Use this for stakeholder presentations and to visualize how the app content appears within the authentic Game Boy hardware frame.

### Full Device Mockup Prompt (WelcomeScreen Example)

```
Design a complete Game Boy Classic device mockup for the 16BitFit WelcomeScreen (393×852pt viewport, iPhone 14 Pro).

DEVICE STRUCTURE - TWO LAYER APPROACH:

=== LAYER 1: GAME BOY HARDWARE SHELL ===

SHELL CONTAINER (Full screen background):
- Dimensions: 393×852pt (fill entire viewport)
- Background: #D7D5CA (warm light gray-beige - Game Boy body)
- Padding: 24pt all sides (creates device edges)

DEVICE BODY ELEMENTS:

1. TOP SECTION (Above Screen):
   - Height: 80pt
   - Background: #D7D5CA
   - Nintendo Logo area:
     - "Nintendo" text (8pt from top, centered)
     - Font: Press Start 2P, 8px, #1C1C1C (glossy black)
   - Brand text: "GAME BOY™"
     - Position: Below Nintendo, 4pt gap
     - Font: Press Start 2P, 10px, #2C3FA3 (royal blue accent)
     - Letter-spacing: 0.15em
   - Decorative elements:
     - Purple accent line (2px height, #B64A75) above screen bezel
     - Text: "DOT MATRIX WITH STEREO SOUND"
     - Position: Right side of purple line
     - Font: System font, 6px, #1C1C1C, uppercase

2. SCREEN BEZEL (LCD Frame):
   - Dimensions: 345×600pt (centered within shell)
   - Position: 104pt from top (80pt header + 24pt margin)
   - Outer border: 8px solid #9A9A9A (cool gray bezel)
   - Inner border: 4px solid #6C6B6B (deep gray recess - shadow effect)
   - Background: #9A9A9A (bezel color)
   - Border-radius: 0 (sharp corners, authentic retro)

3. BOTTOM SECTION (Controls):
   - Height: 188pt (from bottom of screen to bottom of device)
   - Background: #D7D5CA
   - Layout: Horizontal flexbox, space-between alignment

   LEFT SIDE CONTROLS:
   - D-Pad (Directional Pad):
     - Position: 32pt from left edge, 32pt below screen
     - Dimensions: 64×64pt cross shape
     - Color: #1C1C1C (glossy black)
     - Structure:
       - Horizontal bar: 64×20pt
       - Vertical bar: 20×64pt (centered, overlapping)
       - Slight shadow: 2px 2px 0 #6C6B6B (creates depth)
     - Border-radius: 2px (subtle rounding on edges)

   CENTER CONTROLS:
   - START/SELECT Buttons:
     - Position: Centered horizontally, 48pt below screen
     - Layout: Horizontal pair, 20pt gap between
     - Dimensions: 40×12pt each (pill-shaped)
     - Color: #9E9E9E (cool gray)
     - Border: 2px solid #6C6B6B
     - Border-radius: 6px (pill shape)
     - Labels below buttons:
       - "SELECT" and "START"
       - Font: Press Start 2P, 6px, #2C3FA3 (royal blue)
       - Position: 4pt below each button
     - Slight rotation: -15deg for SELECT, -15deg for START (angled like original)

   RIGHT SIDE CONTROLS:
   - A/B Buttons:
     - Position: 32pt from right edge, 32pt below screen
     - Layout: Diagonal arrangement (B lower-left, A upper-right)
     - Dimensions: 48×48pt each (circles)
     - Color: #B64A75 (deep magenta - authentic Game Boy color)
     - Border: 3px solid #6C6B6B (creates depth)
     - Border-radius: 50% (perfect circles)
     - Shadow: inset 2px 2px 4px rgba(0,0,0,0.3) (convex button effect)
     - Labels below buttons:
       - "B" below left button, "A" below right button
       - Font: Press Start 2P, 10px, #2C3FA3 (royal blue)
       - Position: 8pt below each button

4. SPEAKER GRILLE (Bottom):
   - Position: Bottom-left corner, 16pt from edges
   - Dimensions: 48×32pt
   - Pattern: 6 vertical slots (1px wide, 16pt tall, 3px spacing)
   - Color: #6C6B6B (deep gray recess)
   - Creates realistic speaker vent aesthetic

5. BATTERY INDICATOR:
   - Position: Top-left corner, 8pt from edges
   - Icon: Small red dot (4×4pt circle)
   - Label: "BATTERY" text
   - Font: System font, 5px, #1C1C1C

=== LAYER 2: VIRTUAL LCD SCREEN CONTENT ===

LCD SCREEN AREA:
- Dimensions: 329×584pt (fits inside bezel with 8pt padding)
- Position: Absolute, centered within bezel frame
- Background: #9BBC0F (neon grass glow - DMG lightest green)
- Border-radius: 0 (sharp corners)
- All content uses strict 4-color DMG palette:
  - Background: #9BBC0F (lightest)
  - Text primary: #0F380F (darkest)
  - Accent: #8BAC0F (medium-light)
  - Borders: #306230 (medium-dark)

SCREEN CONTENT (WelcomeScreen - Story 1.4):

TOP SECTION (Progress Indicator):
- Position: 24pt from top of LCD screen
- Component: 3 dots progress indicator (● ○ ○)
  - Active dot: 16×16px, #8BAC0F background
  - Inactive dots: 12×12px, #306230 background, 40% opacity
  - 12px gap between dots
- Below dots: "Step 1 of 3" text (Montserrat, 12px, #8BAC0F)

LOGO SECTION (Center):
- 60pt spacer from progress indicator
- Logo: 96×96px pixel art fitness logo
  - Style: Retro dumbbell + heart icon
  - Colors: DMG 4-color palette only
  - Crisp pixel rendering (no anti-aliasing)
- 24pt gap below logo
- Title: "16BITFIT"
  - Press Start 2P, 32px, uppercase, #0F380F
  - Center-aligned
- 16pt gap below title
- Tagline: "Your fitness journey starts here. Level up your health, one step at a time."
  - Montserrat, 16px, line-height 1.5, #306230
  - Center-aligned, max-width 280px

CTA SECTION (Bottom of LCD):
- Flexible spacer pushes CTAs to bottom
- Primary Button: "GET STARTED"
  - Width: 280px, Height: 48px
  - Background: #8BAC0F, Text: #0F380F
  - Press Start 2P font, 14px, uppercase
  - 3px solid border (#306230)
  - Hard pixel shadow: 4×4px offset, #306230 color, no blur
  - Zero border-radius
- 16pt gap below button
- Secondary Link: "I already have an account"
  - Montserrat, 14px, #306230, underline
- 24pt bottom padding (from LCD bottom edge)

SUBTLE LCD EFFECTS (Optional authenticity):
- Slight scanline overlay: 1px horizontal lines repeating every 2px, 5% opacity #0F380F
- Very subtle radial gradient vignette: Darker edges (#306230 at 10% opacity) toward center
- Creates authentic LCD screen depth

PIXEL GRID TEXTURE (Optional):
- Apply to entire LCD screen for authentic pixelated look
- 1px grid pattern, 3% opacity #0F380F
- Makes content feel like true Game Boy display

===

DEVICE DIMENSIONS REFERENCE (Based on Original Game Boy):
- Original GB: 90mm wide × 148mm tall × 32mm deep
- Screen: 47mm × 43mm (2.6 inch diagonal)
- Our mockup maintains these proportions scaled to mobile viewport
- Screen-to-body ratio: ~35% (authentic to original)

COLOR PALETTE REFERENCE:
Shell Palette (Hardware):
- Body: #D7D5CA (warm beige)
- Bezel: #9A9A9A (cool gray)
- Recess/Shadow: #6C6B6B (deep gray)
- Text/D-Pad: #1C1C1C (glossy black)
- A/B Buttons: #B64A75 (deep magenta)
- Start/Select: #9E9E9E (cool gray)
- Accent (blue text): #2C3FA3 (royal blue)

Screen Palette (LCD Content):
- Background: #9BBC0F (lightest green)
- Text: #0F380F (darkest green)
- Accent: #8BAC0F (medium-light green)
- Borders: #306230 (medium-dark green)

DESIGN NOTES:
- The LCD screen should take up ~70% of the visible device height
- Controls (D-Pad, A/B buttons) should be clearly visible but not dominate
- Maintain authentic Game Boy proportions and spacing
- All shell elements use hardware colors; all screen content uses DMG green palette
- Zero border-radius throughout for pure retro aesthetic
- Use hard shadows and defined edges (no soft gradients or modern effects)

RESPONSIVE BEHAVIOR:
- On smaller viewports (iPhone SE 375×667pt):
  - Scale entire device down proportionally (90% scale)
  - Maintain aspect ratio
  - Reduce LCD padding from 24pt to 16pt
- On larger viewports (iPhone 14 Pro Max 430×932pt):
  - Scale device up slightly (110% scale)
  - Increase LCD padding to 32pt
  - Maintain button sizes for touch targets

ANIMATIONS:
Apply same entrance animations as screen-only variant:
1. Device shell: fade opacity 0→1 (400ms, ease-out, delay 0ms)
2. LCD content logo: fade + scale 0.9→1.0 (400ms, ease-out, delay 200ms)
3. LCD content tagline: fade + translateY (300ms, ease-out, delay 400ms)
4. LCD content CTA: fade + scale with spring (300ms, delay 600ms)

Generate this as a complete, pixel-perfect Game Boy Classic device mockup with authentic hardware details and DMG screen content.
```

### Full Device Mockup Prompt (ProfileSetupScreen - Screen 2 of 3)

```
Design a complete Game Boy Classic device mockup for the 16BitFit ProfileSetupScreen (393×852pt viewport, iPhone 14 Pro).

DEVICE STRUCTURE - TWO LAYER APPROACH:

=== LAYER 1: GAME BOY HARDWARE SHELL ===

[USE EXACT SAME HARDWARE SPECIFICATIONS AS WELCOMESCREEN ABOVE]
- Shell Container: 393×852pt, #D7D5CA background
- Top Section: Nintendo logo, "GAME BOY™" branding
- Screen Bezel: 345×600pt centered frame
- Bottom Controls: D-Pad, START/SELECT, A/B buttons
- Speaker Grille, Battery Indicator
- All hardware colors and dimensions identical to WelcomeScreen mockup

=== LAYER 2: VIRTUAL LCD SCREEN CONTENT ===

LCD SCREEN AREA:
- Dimensions: 329×584pt (fits inside bezel with 8pt padding)
- Position: Absolute, centered within bezel frame
- Background: #9BBC0F (neon grass glow - DMG lightest green)
- Border-radius: 0 (sharp corners)
- All content uses strict 4-color DMG palette

SCREEN CONTENT (ProfileSetupScreen - Story 1.4):

TOP SECTION (Progress Indicator):
- Position: 20pt from top of LCD screen
- Component: 3 dots progress indicator (● ● ○)
  - First two dots active: 16×16px, #8BAC0F background
  - Last dot inactive: 12×12px, #306230 background, 40% opacity
  - 12px gap between dots
- Below dots: "Step 2 of 3" text (Montserrat, 12px, #8BAC0F)

HEADER SECTION:
- Position: 40pt below progress indicator
- Title: "CREATE PROFILE"
  - Press Start 2P, 20px, uppercase, center-aligned, #0F380F
- 12pt gap below title
- Subtitle: "Choose your unique username and optional display name."
  - Montserrat, 14px, line-height 1.5, center-aligned, #306230
  - Max-width: 240px

FORM SECTION (24pt below header):

Username Field:
- Label: "Username *" (asterisk in #306230)
  - Montserrat SemiBold, 12px, #0F380F
  - 8pt margin below
- Input Field: 280px width, 44px height
  - Border: 3px solid #306230
  - Background: #9BBC0F (slightly elevated)
  - Padding: 12px horizontal
  - Text: Montserrat, 14px, #0F380F
  - Placeholder: "Enter username..." (#306230, 60% opacity)
  - Border-radius: 0 (sharp corners)
- 6pt margin below
- Helper Text: "3-20 characters" (Montserrat, 10px, #306230)

16pt gap between fields

Display Name Field:
- Label: "Display Name" (Montserrat SemiBold, 12px, #0F380F)
- Input Field: Same styling as username
  - Placeholder: "Optional display name..."
- Helper Text: "How others see you" (Montserrat, 10px, #306230)

STICKY CTA SECTION (Bottom of LCD):
- Position: 24pt from bottom of LCD screen
- Primary Button: "CREATE ACCOUNT"
  - Width: 280px, Height: 44px
  - Background: #8BAC0F, Text: #0F380F
  - Press Start 2P font, 12px, uppercase
  - 3px solid border (#306230)
  - Hard pixel shadow: 4×4px offset, #306230 color, no blur
  - Zero border-radius
- 12pt gap below button
- Secondary Link: "Skip for now"
  - Montserrat, 12px, #306230, underline
  - Center-aligned

IMPORTANT ADJUSTMENTS FOR LCD SCREEN:
- Reduce all font sizes by 15-20% compared to full-screen version
- Reduce spacing between elements by 20% to fit within 329×584pt LCD
- Maintain touch target sizes (44×44px minimum)
- Ensure all content fits without scrolling in LCD viewport
- Use DMG 4-color palette exclusively for all screen content

SUBTLE LCD EFFECTS (Optional):
- Scanline overlay: 1px horizontal lines every 2px, 5% opacity #0F380F
- Subtle vignette: Darker edges (#306230 at 10% opacity)
- Creates authentic LCD screen depth

Generate this as a complete Game Boy device mockup with ProfileSetupScreen displayed on the LCD.
```

### Full Device Mockup Prompt (ArchetypeSelectionScreen - Screen 3 of 3)

```
Design a complete Game Boy Classic device mockup for the 16BitFit ArchetypeSelectionScreen (393×852pt viewport, iPhone 14 Pro).

DEVICE STRUCTURE - TWO LAYER APPROACH:

=== LAYER 1: GAME BOY HARDWARE SHELL ===

[USE EXACT SAME HARDWARE SPECIFICATIONS AS WELCOMESCREEN ABOVE]
- Shell Container: 393×852pt, #D7D5CA background
- Top Section: Nintendo logo, "GAME BOY™" branding
- Screen Bezel: 345×600pt centered frame
- Bottom Controls: D-Pad, START/SELECT, A/B buttons
- Speaker Grille, Battery Indicator
- All hardware colors and dimensions identical to WelcomeScreen mockup

=== LAYER 2: VIRTUAL LCD SCREEN CONTENT ===

LCD SCREEN AREA:
- Dimensions: 329×584pt (fits inside bezel with 8pt padding)
- Position: Absolute, centered within bezel frame
- Background: #9BBC0F (neon grass glow - DMG lightest green)
- Border-radius: 0 (sharp corners)
- All content uses strict 4-color DMG palette

SCREEN CONTENT (ArchetypeSelectionScreen - Story 1.4):

TOP SECTION (Progress Indicator):
- Position: 20pt from top of LCD screen
- Component: 3 dots progress indicator (● ● ●)
  - All three dots active: 16×16px, #8BAC0F background
  - 12px gap between dots
- Below dots: "Step 3 of 3" text (Montserrat, 12px, #8BAC0F)

HEADER SECTION:
- Position: 32pt below progress indicator
- Title: "SELECT ARCHETYPE"
  - Press Start 2P, 18px, uppercase, center-aligned, #0F380F
- 10pt gap below title
- Subtitle: "Choose your fitness style. You can change this later."
  - Montserrat, 12px, line-height 1.4, center-aligned, #306230
  - Max-width: 240px

ARCHETYPE GRID (20pt below header):
- Layout: 2-column grid with 12px gap
- Grid width: 280px (centered)
- Card width: 134px per card ((280 - 12) / 2)
- Card height: 156px

ARCHETYPE CARD SPECIFICATIONS (Create 5 cards):

Card Structure:
- Dimensions: 134×156px
- Padding: 12px internal
- Border: 3px solid #306230 (default)
- Border (selected): 4px solid #8BAC0F
- Background: #9BBC0F (slightly elevated - use #8BAC0F at 20% opacity)
- Border-radius: 0 (sharp corners)
- Vertical layout, center-aligned

Card Contents:
1. Avatar: 60×60px pixel art sprite (top, centered)
   - Style: Simple 16-bit retro, front-facing
   - Use DMG 4-color palette only
   - Crisp pixel rendering
   - 6pt margin below

2. Name: Archetype name (Press Start 2P, 12px, uppercase, #0F380F)
   - Center-aligned, single line
   - 4pt margin below

3. Description: Brief text (Montserrat, 9px, #306230)
   - Center-aligned, max 2 lines
   - Line-height: 1.3
   - Abbreviated for LCD space constraints

ARCHETYPE DATA (Create 5 cards in grid):

Row 1 (2 cards):
1. TRAINER
   - Avatar: Balanced trainer with whistle
   - Description: "Balanced fitness variety"

2. RUNNER
   - Avatar: Running pose character
   - Description: "Built for endurance"

Row 2 (2 cards):
3. YOGA
   - Avatar: Tree pose character
   - Description: "Flexibility & mindfulness"

4. BUILDER
   - Avatar: Muscular flexing character
   - Description: "Strength & muscle focus"

Row 3 (1 card, centered):
5. CYCLIST
   - Avatar: Cycling character
   - Description: "Cardio & leg strength"

CARD INTERACTION:
- Default: 3px border #306230, scale 1.0
- Selected: 4px border #8BAC0F, scale 1.03
- Selected cards get checkmark icon (12×12px) in top-right corner

STICKY CTA SECTION (Bottom of LCD):
- Position: 20pt from bottom of LCD screen
- Primary Button: "CONTINUE"
  - Width: 280px, Height: 44px
  - Background: #8BAC0F, Text: #0F380F
  - Press Start 2P font, 12px, uppercase
  - 3px solid border (#306230)
  - Hard pixel shadow: 4×4px offset, #306230 color, no blur
  - Zero border-radius
  - Disabled state: 40% opacity (until archetype selected)

IMPORTANT ADJUSTMENTS FOR LCD SCREEN:
- Scale all elements down by 20% compared to full-screen version
- Reduce spacing to fit 5 cards + header + CTA within 329×584pt LCD
- Grid layout must fit comfortably without scrolling
- Card avatars simplified for small LCD screen rendering
- All text sizes reduced but remain readable
- Use DMG 4-color palette exclusively

SUBTLE LCD EFFECTS (Optional):
- Scanline overlay: 1px horizontal lines every 2px, 5% opacity #0F380F
- Subtle vignette: Darker edges (#306230 at 10% opacity)
- Creates authentic LCD screen depth

Generate this as a complete Game Boy device mockup with ArchetypeSelectionScreen displayed on the LCD.
```

### Refinement Prompts for Shell Mockup

```
// Add realistic button depth
"Enhance A/B buttons with 3D effect:
- Add inset shadow: inset 2px 2px 6px rgba(0,0,0,0.4)
- Add outer highlight: 1px top/left border #D896B3 (lighter magenta)
- Creates convex button surface like original hardware"

// Add subtle shell texture
"Apply subtle texture to Game Boy body (#D7D5CA areas):
- Very fine noise pattern (2% opacity)
- Simulates plastic surface finish
- Does not affect screen or buttons"

// Add power LED indicator
"Add power LED indicator:
- Position: Top-right of LCD bezel, 4pt from edge
- Dimensions: 6×6pt circle
- Color: #FF0000 (red) with subtle glow
- Label: 'POWER' in 5px system font, #1C1C1C
- Creates authentic 'device is on' visual cue"

// Add contrast mode button
"Add contrast adjustment dial (decorative):
- Position: Right side of device, aligned with screen center
- Dimensions: 12×32pt vertical rectangle
- Color: #9E9E9E with horizontal grooves (3×1px lines)
- Label: 'CONTRAST' in vertical orientation, 5px font
- Purely decorative (non-functional in prototype)"

// Create tablet variant with larger device
"Generate iPad variant (820×1180pt):
- Scale entire Game Boy mockup to 130% size
- LCD screen: 429×760pt
- Maintain proportions and spacing ratios
- Increase button sizes: D-Pad 80×80pt, A/B 60×60pt
- Larger fonts: Nintendo logo 12px, Game Boy 14px"

// Add screen-off state variant
"Create 'device off' variant:
- LCD screen: Dark gray (#6C6B6B) instead of green
- Slight reflection effect on screen (subtle gradient)
- Red power LED turns off (gray instead)
- Use for app launch screen or loading state"
```

### Usage Guidance

**When to Use This Shell Mockup:**
- ✅ Stakeholder presentations showing full Game Boy aesthetic
- ✅ Marketing materials and App Store screenshots
- ✅ User testing to gauge authentic retro appeal
- ✅ Design exploration and visual direction validation

**When to Use Screen-Only Variant:**
- ✅ Production UI/UX design work in MagicPath.ai
- ✅ Developer handoff for React Native components
- ✅ Layout and spacing refinement
- ✅ Accessibility and usability testing

**Using the Flow Tool in MagicPath.ai:**

When creating the complete onboarding flow with Game Boy Shell mockups:

1. **Start with the first prompt** (WelcomeScreen Shell Mockup above)
2. **Use the Flow tool** to generate the remaining screens:
   - Click "Flow" in MagicPath.ai
   - MagicPath will automatically understand to maintain the Game Boy Shell aesthetic
   - Simply describe the screen changes: "Show Screen 2 (ProfileSetupScreen)" or "Show Screen 3 (ArchetypeSelectionScreen)"
   - The Flow tool preserves hardware shell elements and updates only the LCD screen content

3. **Alternative approach** - Paste each prompt individually:
   - First: WelcomeScreen Shell Mockup prompt
   - Second: ProfileSetupScreen Shell Mockup prompt
   - Third: ArchetypeSelectionScreen Shell Mockup prompt
   - MagicPath will maintain consistency across all three screens

**Flow Tool Benefits:**
- Maintains exact Game Boy hardware specifications across all screens
- Only updates LCD screen content between frames
- Creates smooth onboarding flow visualization
- Preserves hardware details (D-Pad, buttons, bezel, branding)
- Perfect for stakeholder demos showing complete user journey

**Implementation Strategy:**
1. Design onboarding screens as **screen content only** in MagicPath.ai
2. Export clean React Native components for the LCD content
3. Create a separate `GameBoyShell.tsx` wrapper component in React Native
4. The shell wrapper renders the hardware chrome around the screen content
5. Toggle shell visibility via settings or build configuration

**Component Architecture:**
```typescript
<GameBoyShell showShell={true}>
  <WelcomeScreen /> {/* Pure screen content */}
</GameBoyShell>
```

This allows you to design efficiently (screen-only) while maintaining the option to show the full device aesthetic when needed.

---

## Story 1.5: Photo Upload & Avatar Generation (LCD Screen-Only)

### Context

Story 1.5 implements the photo upload and AI avatar generation flow for the onboarding process. Users upload a headshot (camera or gallery), which is sent to the `avatar-generator` Edge Function that uses OpenAI's gpt-image-1 Image Edit API to apply DMG pixel art styling while preserving their facial identity.

**Backend:** See `apps/supabase-functions/avatar-generator/index.ts` for implementation details.

**MagicPath Workflow:**
1. Generate PhotoUploadScreen (choose camera/gallery → upload → preview)
2. Generate AvatarPreviewScreen (display generated avatar → confirm/retry)
3. Export React Native components
4. Integrate with existing `imageService.ts` and atomic components

---

### LCD PhotoUploadScreen (Screen Only, No Shell)

**Purpose:** Allow users to capture or select a headshot photo for avatar generation.

**Viewport:** 329×584pt (LCD screen dimensions from Game Boy mockup)

**Theme:** Theme 6 - LCD Screen Content

**Full Prompt:**

```
Create a Game Boy DMG-style photo upload screen for the 16BitFit onboarding flow using the LCD Screen Content theme (329×584pt viewport).

LAYOUT STRUCTURE (Top to Bottom):

1. Progress Indicator (Top, 20px from LCD edge)
   - Four progress dots arranged horizontally
   - Dot 1, 2, 3: Filled circle (#8BAC0F, 16×16px)
   - Dot 4: Outline only (#306230, 16×16px, 3px border)
   - 12px gap between dots
   - Centered horizontally

2. Header Section (48px below progress dots)
   - Title: "Upload Your Photo" (Press Start 2P, 20px, #0F380F)
   - Subtitle: "We'll create your pixel art avatar" (Montserrat, 14px, #306230)
   - Center-aligned
   - 8px vertical spacing between title and subtitle

3. Photo Selection Buttons (Center of screen, if no photo selected)
   - Button 1: "Take Photo"
     - Width: 280px, Height: 48px
     - Background: #8BAC0F (lime highlight)
     - Text: "TAKE PHOTO" (Montserrat Bold, 16px, #0F380F)
     - Icon: Camera icon (20×20px, #0F380F) to the left of text
     - Border: 3px solid #306230
     - Pixel shadow: 4×4px offset, #306230, no blur
   
   - Button 2: "Choose from Gallery" (16px below Button 1)
     - Width: 280px, Height: 48px
     - Background: #9BBC0F (lightest green)
     - Text: "CHOOSE FROM GALLERY" (Montserrat SemiBold, 14px, #0F380F)
     - Icon: Image/folder icon (20×20px, #0F380F) to the left of text
     - Border: 3px solid #306230
     - Pixel shadow: 4×4px offset, #306230, no blur

4. Photo Preview State (if photo selected, replaces buttons)
   - Image container: 200×200px square, centered
   - Border: 4px solid #306230
   - Placeholder: Show a 3:4 portrait photo placeholder
   - 16px margin below image
   
   - "Choose Different Photo" button
     - Width: 280px, Height: 40px
     - Background: #9BBC0F
     - Text: "CHOOSE DIFFERENT PHOTO" (Montserrat, 12px, #0F380F)
     - Border: 3px solid #306230

5. Generate Button (Bottom, if photo selected)
   - Position: 24px from bottom of LCD screen
   - Width: 280px, Height: 48px
   - Background: #8BAC0F (lime highlight)
   - Text: "GENERATE MY AVATAR" (Montserrat Bold, 16px, #0F380F)
   - Border: 3px solid #0F380F (emphasized)
   - Pixel shadow: 4×4px offset, #0F380F
   - Center-aligned

6. Loading State (when generating)
   - Replace "Generate" button with:
     - Spinning pixel icon (16×16px, #0F380F)
     - Text below: "Generating Avatar..." (Montserrat, 14px, #306230)
     - Subtitle: "This may take up to 15 seconds" (Montserrat, 12px, #306230)

DESIGN SYSTEM (LCD Screen Content):
- Background: #9BBC0F (neon grass glow - lightest green)
- Primary text: #0F380F (deep forest shadow - darkest green)
- Secondary text: #306230 (pine border - medium-dark green)
- Primary button: #8BAC0F background (lime highlight)
- Secondary button: #9BBC0F background (same as screen background)
- All borders: #306230, 3px width, zero border-radius
- Emphasis borders: #0F380F, 3px-4px width
- Pixel shadows: 4×4px offset, matching border color, no blur
- Touch targets: Minimum 44×44px (buttons exceed this)

TYPOGRAPHY:
- Headings: Press Start 2P, 18-20px
- Body text: Montserrat Regular, 12-14px
- Button text: Montserrat SemiBold/Bold, 14-16px
- Helper text: Montserrat Regular, 12px
- Line height: 1.4-1.5 for readability

SPACING (LCD Optimized - 8px grid):
- Screen top margin: 20px
- Section gaps: 24-32px
- Button gaps: 16px
- Text gaps: 8-12px
- Bottom margin: 24px

INTERACTIONS:
- Button press: Scale to 0.98, duration 100ms
- Focus state: Border width 3px → 4px, color to #8BAC0F
- No border-radius (sharp corners for retro aesthetic)
- Provide clear visual feedback for all touch interactions

CONSTRAINTS:
- Design for 329×584pt LCD viewport (no shell)
- Strict 4-color DMG palette (no gradients, no other colors)
- All elements must fit without scrolling (except during generation state)
- Maintain 24px horizontal margins for 280px content width
- Ensure WCAG AA contrast ratios (DMG palette naturally complies)
```

---

### LCD AvatarPreviewScreen (Screen Only, No Shell)

**Purpose:** Display the generated DMG pixel art avatar and allow user to confirm or regenerate.

**Viewport:** 329×584pt (LCD screen dimensions from Game Boy mockup)

**Theme:** Theme 6 - LCD Screen Content

**Full Prompt:**

```
Create a Game Boy DMG-style avatar preview screen for the 16BitFit onboarding flow using the LCD Screen Content theme (329×584pt viewport).

LAYOUT STRUCTURE (Top to Bottom):

1. Progress Indicator (Top, 20px from LCD edge)
   - Four progress dots arranged horizontally
   - All dots filled: (#8BAC0F, 16×16px) - showing 4 of 4 complete
   - 12px gap between dots
   - Centered horizontally

2. Header Section (48px below progress dots)
   - Title: "Your Avatar" (Press Start 2P, 20px, #0F380F)
   - Subtitle: "Looking good, trainer!" (Montserrat, 14px, #306230)
   - Center-aligned
   - 8px vertical spacing between title and subtitle

3. Avatar Display (Center of screen)
   - Container: 240×240px square, centered
   - Border: 4px solid #0F380F (emphasized border)
   - Pixel shadow: 6×6px offset, #306230, no blur (deeper shadow for emphasis)
   - Background: #9BBC0F
   - Display: Generated DMG pixel art avatar (placeholder: show a pixelated character portrait)
   - 24px margin below avatar

4. Avatar Description (Below avatar)
   - Text: "Stage 1 Trainer" (Montserrat SemiBold, 14px, #0F380F)
   - Archetype badge (if applicable): Small pill badge (#8BAC0F background, #0F380F text, 3px border #306230)
   - Center-aligned
   - 32px margin below text

5. Action Buttons (Bottom section)
   - Primary Button: "Looks Great!"
     - Position: 60px from bottom of LCD screen
     - Width: 280px, Height: 48px
     - Background: #8BAC0F (lime highlight)
     - Text: "LOOKS GREAT!" (Montserrat Bold, 16px, #0F380F)
     - Border: 4px solid #0F380F (emphasized)
     - Pixel shadow: 4×4px offset, #0F380F
     - Center-aligned
   
   - Secondary Button: "Try Again" (48px below primary button)
     - Width: 280px, Height: 40px
     - Background: #9BBC0F (lightest green - matches screen)
     - Text: "TRY AGAIN" (Montserrat SemiBold, 14px, #306230)
     - Border: 3px solid #306230
     - Pixel shadow: 4×4px offset, #306230
     - Center-aligned

6. Helper Text (Bottom, 16px below "Try Again" button)
   - Text: "You can always change this later" (Montserrat, 10px, #306230)
   - Center-aligned
   - 12px from bottom of LCD screen

DESIGN SYSTEM (LCD Screen Content):
- Background: #9BBC0F (neon grass glow - lightest green)
- Primary text: #0F380F (deep forest shadow - darkest green)
- Secondary text: #306230 (pine border - medium-dark green)
- Avatar border: #0F380F, 4px (emphasized)
- Primary button: #8BAC0F background, #0F380F border
- Secondary button: #9BBC0F background, #306230 border
- All borders: Zero border-radius (sharp corners)
- Pixel shadows: 4-6×4-6px offset, no blur
- Strict 4-color palette only

TYPOGRAPHY:
- Headings: Press Start 2P, 18-20px
- Subheadings: Montserrat SemiBold, 14px
- Body text: Montserrat Regular, 12-14px
- Button text: Montserrat Bold/SemiBold, 14-16px
- Helper text: Montserrat Regular, 10px
- Line height: 1.4-1.5

SPACING (LCD Optimized - 8px grid):
- Screen top margin: 20px
- Avatar to buttons: 56px
- Button gap: 12px
- Bottom margin: 24px total
- Horizontal margins: 24px (280px content width)

INTERACTIONS:
- Primary button press: Scale to 0.98, duration 100ms
- Secondary button press: Scale to 0.98, duration 100ms
- Focus states: Border width increases by 1px, color change to #8BAC0F
- Smooth transition to next screen (fade out, 300ms)

SUCCESS STATE:
- Show brief celebration animation before proceeding
- Consider pixel sparkle/shine effect around avatar (optional)
- Green checkmark icon (16×16px) briefly appears above avatar

CONSTRAINTS:
- Design for 329×584pt LCD viewport (no shell)
- Strict 4-color DMG palette
- All elements must fit without scrolling
- Avatar image is the focal point - give it emphasis
- Clear hierarchy: Avatar → Primary CTA → Secondary option
- Maintain 24px horizontal margins
```

---

### Component Integration Notes

After generating these screens in MagicPath.ai and exporting:

**PhotoUploadScreen Integration:**
1. Replace generic buttons with `<PixelButton>` atomic component
2. Wire camera/gallery actions to `imageService.openCamera()` / `imageService.openGallery()`
3. Add `Image` component from React Native for photo preview
4. Connect "Generate" button to `imageService.generateAvatar()`
5. Add loading state with `<LoadingSpinner>` molecular component
6. Handle errors with `<ToastNotification>` molecular component

**AvatarPreviewScreen Integration:**
1. Receive `avatarUrl` from navigation params
2. Display avatar using `<Image source={{ uri: avatarUrl }}>`
3. "Looks Great!" button → Update Zustand store → Navigate to Home
4. "Try Again" button → Navigate back to PhotoUploadScreen with `regen_reason: 'retry'`
5. Add `<ProgressIndicator currentStep={4} totalSteps={4}>` molecular component

**Shared Services:**
- `imageService.ts` - Camera, gallery, upload, and generation logic
- `onboardingStore.ts` - Zustand store for onboarding state (selectedArchetype, avatarUrl)
- `navigationService.ts` - Navigation helpers for onboarding flow

---

## Export & Handoff

### When You're Ready to Export

```
"Export the complete 16BitFit onboarding flow (3 screens) as:
- Format: React Native components (TypeScript)
- Include: All animations, states, and theme variables
- Structure: Separate component files for reusability
- Assets: Export all sprites as PNG-8 (@1x, @2x, @3x)
- Comments: Add inline code comments for animation timings
- Accessibility: Include ARIA labels and screen reader support"
```

### Code Quality Checklist

Before exporting, verify:
- [ ] All theme tokens referenced (not hardcoded colors)
- [ ] All animations use native driver (GPU accelerated)
- [ ] All touch targets ≥44×44px
- [ ] All text contrast ratios ≥4.5:1
- [ ] All interactive elements keyboard accessible
- [ ] All states defined (default, hover, active, disabled, error)
- [ ] All assets optimized (<30KB sprites, <50KB logo)
- [ ] All components saved to Library for reuse
- [ ] Responsive breakpoints defined
- [ ] Reduced motion variants included

---

## Next Steps After MagicPath.ai Prototyping

1. **Review in Web Preview**: Test all interactions, animations, states
2. **Share public link**: Get feedback from team/stakeholders
3. **Generate variants**: Explore 3-5 options for critical screens
4. **Export code**: Download production-ready React Native components
5. **Import to project**: Add to 16BitFit codebase
6. **Refactor if needed**: Clean up exported code, optimize performance
7. **Test on device**: Validate on real iOS/Android hardware
8. **Iterate**: Use learnings to refine remaining screens

---

## Version History

- **v1.2** (2025-11-20): Added Story 1.5 (Photo Upload & Avatar Generation) prompts
  - PhotoUploadScreen: Camera/gallery selection, photo preview, generation workflow
  - AvatarPreviewScreen: Generated avatar display, confirm/retry actions
  - Component integration notes for imageService and atomic components
  - Complete specifications matching LCD Screen Content theme (329×584pt)
  - All prompts follow DMG 4-color palette and retro aesthetic

- **v1.1** (2025-11-02): Added LCD Screen-Only theme and prompts
  - New Theme 6: LCD Screen Content (329×584pt) for production development
  - Ultra-simplified screen-only prompts (WelcomeScreen, ProfileSetupScreen, ArchetypeSelectionScreen)
  - Comprehensive design system matching LCD specs from Game Boy Shell mockups
  - Quick Start Guide with three workflow options
  - Updated Table of Contents and document structure
  - All specifications match the successfully generated Game Boy shell mockups

- **v1.0** (2025-10-31): Initial MagicPath.ai prompt library - Complete Story 1.4 prompts, design system setup, advanced techniques from deep research, animation specs, component library, iteration workflows.

---

**Document Owner:** UI/UX Specialist (Sally)
**Approved By:** Architect (Pending)
**Last Updated:** 2025-11-20
