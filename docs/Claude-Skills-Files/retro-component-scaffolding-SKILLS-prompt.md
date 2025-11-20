**UI-UX-SPECIALIST AGENT: Retro Component Scaffolding Skill Creation**
**Mission Briefing**

You are tasked with creating a **Claude Agent Skill** called retro-component-scaffolding that will dramatically accelerate React Native component development for the 16BitFit V3 project. This skill must enforce the strict **LCD Screen-Only 4-color palette**, atomic design principles, accessibility standards, and 60fps performance requirements.

---

## **🚨 CRITICAL UPDATES (2025-11-17) - READ FIRST**

The design system underwent a major audit and correction. **This prompt has been updated** with the latest changes:

### **1. Terminology Change: "DMG" → "LCD Screen-Only Theme"**
- ❌ OLD: "DMG Game Boy palette"
- ✅ NEW: "LCD Screen-Only 4-color theme"
- **Source of Truth:** `docs/design-system/design-tokens-LCD.md`

### **2. Color Token Corrections (Background/Text Were Inverted)**
- ❌ OLD: `background.primary: '#0F380F'` (dark) + `text.primary: '#9BBC0F'` (light)
- ✅ NEW: `background.primary: '#9BBC0F'` (light) + `text.primary: '#0F380F'` (dark)
- **Impact:** Proper Game Boy LCD appearance (light greenish bg + dark text)

### **3. New Semantic Token Categories Added**
- ✅ `tokens.colors.button` (primary, primaryText, secondary, secondaryText)
- ✅ `tokens.colors.input` (background, border, text, placeholder, focus)
- ✅ `tokens.colors.states` (active, inactive, disabled, hover)
- ✅ `tokens.colors.text.muted` (replaces deprecated `tertiary`)

### **4. Component Status Update**
- ✅ **All 10 atomic components complete** (PixelButton, PixelText, PixelInput, etc.)
- ⏳ **0/10 molecular components started** (ArchetypeCard, FormField, StatBar, etc.)
- **Priority:** Focus skill on **molecular component generation**

### **5. Validation Requirements Updated**
- ✅ TypeScript strict mode passes (zero type errors)
- ✅ All color references use semantic tokens (not hardcoded hex)
- ✅ No usage of deprecated `text.tertiary` (use `text.muted` instead)

---

**Success Criteria:**

* Generate complete component + test file from specifications in <15 minutes
* Enforce 100% LCD palette compliance (#9BBC0F, #0F380F, #8BAC0F, #306230 only)
* Use correct semantic tokens (background.primary, text.primary, button.primary, etc.)
* Auto-inject WCAG AA accessibility props
* Include haptic feedback patterns for interactive elements
* Generate 60fps Reanimated animations
* Create comprehensive test suites (80%+ coverage)

**Expected ROI:** 60-90 hours saved across 15 remaining components (atomic + molecular)  
**Phase 1: Context Gathering (Read These Files)**

**1\. Project Architecture & Requirements**

**File:** CLAUDE.md

* **Focus Areas:**
  * Design System (LCD Screen-Only 4-color palette rules) **[UPDATED 2025-11-17]**
  * Component Implementation Guidelines (Sections 1-3)
  * Atomic Components status (10 implemented, 0 remaining) **[ALL COMPLETE]**
  * Molecular Components status (0 implemented, 10 remaining) **[PRIORITY]**
  * Code Quality Standards (TypeScript, React Native, Testing, Accessibility)
* **Key Reference:** Section on Color Palette now references `docs/design-system/design-tokens-LCD.md`

**2\. Design Token System** **[UPDATED 2025-11-17]**

**File:** apps/mobile-shell/src/design-system/tokens.ts

* **Extract:**
  * **tokens.colors.dmg** (4 sacred colors - ONLY colors allowed):
    - `lightest: '#9BBC0F'` (Neon grass glow - backgrounds, inverse text)
    - `light: '#8BAC0F'` (Lime highlight - buttons, CTAs, focus)
    - `dark: '#306230'` (Pine border - borders, secondary text)
    - `darkest: '#0F380F'` (Deep forest shadow - primary text, shadows)
  * **tokens.colors.background** (semantic tokens):
    - `primary: '#9BBC0F'` (screen backgrounds)
    - `secondary: '#8BAC0F'` (alternate backgrounds)
    - `elevated: '#306230'` (cards, modals)
  * **tokens.colors.text** (semantic tokens):
    - `primary: '#0F380F'` (main text)
    - `secondary: '#306230'` (muted text)
    - `muted: '#8BAC0F'` (helper text)
    - `inverse: '#9BBC0F'` (text on dark backgrounds)
  * **tokens.colors.button** (NEW - semantic tokens):
    - `primary: '#8BAC0F'` (primary buttons)
    - `primaryText: '#0F380F'` (text on primary buttons)
  * **tokens.colors.input** (NEW - semantic tokens)
  * **tokens.colors.states** (NEW - semantic tokens)
  * tokens.spacing (8px grid system)
  * tokens.border.width (pixel-perfect borders: 2/3/4px)
  * tokens.shadow (hard pixel shadows, no blur)
  * tokens.iconSize + tokens.touchTarget (accessibility minimums: 44×44dp)

**CRITICAL:** Always use semantic tokens (`tokens.colors.background.primary`) instead of raw DMG references (`tokens.colors.dmg.lightest`). This ensures maintainability and correct theme application.

**3\. Exemplar Component Pattern**

**File:** apps/mobile-shell/src/components/atoms/PixelButton/index.tsx

* **Study Pattern:**  
  * TypeScript interface structure (PixelButtonProps)  
  * React.memo optimization  
  * Animated press feedback (Animated.Value \+ useNativeDriver)  
  * Haptic feedback integration (ReactNativeHapticFeedback.trigger('impactMedium'))  
  * Variant system (primary | secondary | tertiary | icon)  
  * Accessibility props (accessibilityRole, accessibilityLabel, accessibilityState)  
  * StyleSheet organization (container → content → variants → disabled)

**4\. Exemplar Test Pattern**

**File:** apps/mobile-shell/src/components/atoms/PixelButton/**tests**/PixelButton.test.tsx

* **Study Test Structure:**  
  * 4 test suites: Rendering, Interaction, Accessibility, States  
  * React Native Testing Library patterns (render, fireEvent, getByRole)  
  * Accessibility validation (role, label, state)  
  * Interaction testing (onPress, disabled, loading states)  
  * Coverage: All variants, edge cases, user flows

**5\. Molecular Component Specifications**

**File:** docs/design-system/molecular-components.md

* **Extract:**  
  * Component index (10 molecular components to build)  
  * Visual specifications (container dimensions, spacing, colors)  
  * Composition patterns (atoms combined into molecules)  
  * React Native implementation examples (ArchetypeCard, FormField, etc.)

**6\. Atomic Component Specifications** **[ALL COMPLETE]**

**File:** docs/design-system/atomic-components.md

* **Status:** All 10 atomic components have been implemented:
  1. ✅ PixelButton (4 variants: primary, secondary, tertiary, icon)
  2. ✅ PixelText (typography wrapper with color variants)
  3. ✅ PixelInput (form input with validation)
  4. ✅ PixelSprite (sprite/avatar component)
  5. ✅ PixelBorder (container with borders and shadows)
  6. ✅ PixelIcon (SVG icons, 16/20/24/32px)
  7. ✅ PixelDivider (horizontal/vertical separators)
  8. ✅ PixelBadge (notification badges with count)
  9. ✅ PixelProgressBar (SF2-style health bars)
  10. ✅ PixelCheckbox (toggle with bounce animation)

**PRIORITY SHIFT:** Focus on **molecular components** (0/10 complete) - see Section 5 above.

**Phase 2: Skill Architecture Design**

**SKILL.md Structure (Based on Anthropic Best Practices)**

Create a file at .claude/skills/retro-component-scaffolding/SKILL.md with this structure:  
\---  
name: retro-component-scaffolding  
description: Generate React Native components for 16BitFit with LCD Screen-Only 4-color palette (#9BBC0F, #0F380F, #8BAC0F, #306230), using semantic tokens (background.primary, text.primary, button.primary), atomic design principles, accessibility (WCAG AA), haptic feedback, and 60fps animations. Use when creating molecules or organisms for the component library (all atoms complete).  
\---  
\# Retro Component Scaffolding  
Generate pixel-perfect React Native components following 16BitFit's strict Game Boy aesthetic and accessibility standards.  
\#\# Quick Start  
\#\#\# Generate Atomic Component  
\`\`\`bash  
python scripts/generate-component.py \\  
  \--type atomic \\  
  \--name PixelIcon \\  
  \--spec docs/design-system/atomic-components.md  
**Generate Molecular Component**

python scripts/generate-component.py \\  
  \--type molecular \\  
  \--name ArchetypeCard \\  
  \--spec docs/design-system/molecular-components.md  
**Component Generation Workflow**

Copy this checklist and check off items as you complete them:  
Task Progress:  
\- \[ \] Step 1: Read component specification from design-system docs  
\- \[ \] Step 2: Validate DMG palette compliance (run validate-dmg-palette.py)  
\- \[ \] Step 3: Generate component file (TypeScript \+ React Native)  
\- \[ \] Step 4: Generate test file (Jest \+ RNTL)  
\- \[ \] Step 5: Verify accessibility (run audit-accessibility.py)  
\- \[ \] Step 6: Run tests and type check  
**Step 1: Read Component Specification** Find the component spec in:

* Atomic: docs/design-system/atomic-components.md  
* Molecular: docs/design-system/molecular-components.md

Extract:

* Visual specifications (dimensions, colors, spacing)  
* Composition (which atoms/molecules are used)  
* Props interface  
* Variants/states  
* Animations

**Step 2: Validate LCD Palette Compliance** **[UPDATED 2025-11-17]**

Before generating, confirm all colors use semantic tokens:

**Correct Usage (Semantic Tokens):**
* `tokens.colors.background.primary` (#9BBC0F - light backgrounds)
* `tokens.colors.text.primary` (#0F380F - dark text on light)
* `tokens.colors.button.primary` (#8BAC0F - primary CTAs)
* `tokens.colors.border.default` (#306230 - borders, dividers)

**Raw DMG Reference (4 colors):**
* `lightest: '#9BBC0F'` (Neon grass glow)
* `light: '#8BAC0F'` (Lime highlight)
* `dark: '#306230'` (Pine border)
* `darkest: '#0F380F'` (Deep forest shadow)

**CRITICAL:** Always prefer semantic tokens over raw DMG references for maintainability.

**Step 3: Generate Component File** Use template: templates/component-template.tsx Required structure:  
/\*\*  
 \* {ComponentName} \- {Brief description}  
 \* {Detailed description with use cases}  
 \*/  
import React, { useRef, useCallback, useMemo } from 'react';  
import { /\* RN imports \*/ } from 'react-native';  
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';  
import { tokens, typography, durations, easings } from '@/design-system';  
// ─── Types & Interfaces ───  
interface {ComponentName}Props {  
  // Props with JSDoc comments  
}  
// ─── Component ───  
const {ComponentName}: React.FC\<{ComponentName}Props\> \= React.memo(({  
  // Destructured props  
}) \=\> {  
  // ─── Refs ───  
  // ─── Callbacks ───  
  // ─── Computed Styles ───  
  // ─── Render ───  
});  
{ComponentName}.displayName \= '{ComponentName}';  
// ─── Styles ───  
const styles \= StyleSheet.create({  
  // Styles using tokens  
});  
export default {ComponentName};  
**Step 4: Generate Test File** Use template: templates/test-template.tsx Required test suites:

1. **Rendering** \- All variants, props, edge cases  
2. **Interaction** \- onPress, gestures, disabled states  
3. **Accessibility** \- role, label, hint, state  
4. **States** \- loading, disabled, error, success

**Step 5: Verify Accessibility** Run: python scripts/audit-accessibility.py {ComponentPath} Check:

*  accessibilityRole defined  
*  accessibilityLabel on all touchables  
*  accessibilityHint for complex interactions  
*  Touch targets ≥ 44×44dp (tokens.touchTarget.minimum)  
*  Color contrast WCAG AA (DMG palette already compliant)

**Step 6: Run Tests**  
\# Type check  
npx tsc \--noEmit  
\# Run tests  
npm test \-- {ComponentName}.test.tsx  
\# Coverage  
npm test \-- \--coverage {ComponentName}.test.tsx  
**LCD Palette Validation Rules** **[UPDATED 2025-11-17]**

**CRITICAL:** Only these 4 colors allowed, accessed via semantic tokens:

```typescript
// ✅ CORRECT (Semantic Tokens - PREFERRED)
backgroundColor: tokens.colors.background.primary  // #9BBC0F (light)
color: tokens.colors.text.primary                  // #0F380F (dark)
borderColor: tokens.colors.border.default          // #306230 (medium-dark)

// ✅ ACCEPTABLE (Raw DMG - only if semantic token doesn't exist)
backgroundColor: tokens.colors.dmg.lightest        // #9BBC0F
color: tokens.colors.dmg.darkest                   // #0F380F

// ❌ WRONG
backgroundColor: '#FFFFFF'      // NOT in LCD palette
borderColor: 'red'              // NOT in LCD palette
backgroundColor: '#0F380F'      // Hardcoded hex (use tokens)
borderRadius: 8                 // NO ROUNDED CORNERS (must be 0)
shadowRadius: 4                 // NO BLUR (must be 0)
```

**Common Mistakes to Avoid:**
- ❌ Using `tokens.colors.text.tertiary` (renamed to `tokens.colors.text.muted`)
- ❌ Inverting background/text (background should be lightest, text should be darkest)
- ❌ Hardcoding hex values instead of using tokens

For validation details, see VALIDATION.md.  
**Animation Patterns**

All animations must target 60fps using useNativeDriver: true. **Allowed animated properties:**

* transform (translateX/Y, scale, rotate)  
* opacity

**Forbidden animated properties:**

* backgroundColor (not native driver compatible)  
* width/height (use scale instead)

For animation examples, see ANIMATIONS.md.  
**Haptic Feedback Integration**

Interactive components must include haptic feedback:  
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';  
// On press  
ReactNativeHapticFeedback.trigger('impactMedium');  
// On success  
ReactNativeHapticFeedback.trigger('notificationSuccess');  
// On error  
ReactNativeHapticFeedback.trigger('notificationError');  
For full haptic patterns, see HAPTICS.md.  
**File Naming Conventions**

components/{type}/{ComponentName}/  
├── index.tsx                    \# Component implementation  
├── {ComponentName}.types.ts     \# TypeScript interfaces (if complex)  
├── {ComponentName}.styles.ts    \# StyleSheet (if \>50 lines)  
└── \_\_tests\_\_/  
    └── {ComponentName}.test.tsx \# Jest tests  
**Common Patterns**

**Template Pattern: Strict Output Format**

When generating component files, ALWAYS use this exact structure (see Step 3).  
**Examples Pattern: Reference Implementations**

Study these exemplars before generating:

* Atomic: PixelButton  
* Test: PixelButton.test.tsx

**Conditional Workflow: Type-Specific Generation**

* **Atomic component?** → Simpler, self-contained, no internal atoms  
* **Molecular component?** → Compose atoms, delegate complex logic  
* **Organism component?** → Compose molecules, manage state

\---  
\#\#\# \*\*Supporting Files Structure\*\*  
.claude/skills/retro-component-scaffolding/ ├── SKILL.md \# Main instructions (above) ├── VALIDATION.md \# DMG palette validation rules ├── ANIMATIONS.md \# 60fps animation patterns ├── HAPTICS.md \# Haptic feedback reference ├── templates/ │ ├── component-template.tsx \# Base component scaffold │ ├── test-template.tsx \# Base test scaffold │ ├── atomic-component-template.tsx \# Atomic-specific template │ └── molecular-component-template.tsx \# Molecular-specific template └── scripts/ ├── generate-component.py \# Component generator ├── validate-dmg-palette.py \# Color compliance checker └── audit-accessibility.py \# WCAG AA validator  
\---  
\#\# \*\*Phase 3: Script Implementation\*\*  
\#\#\# \*\*1. generate-component.py\*\*  
This script should:  
1\. Parse command-line arguments (\`--type\`, \`--name\`, \`--spec\`)  
2\. Read component specification from markdown  
3\. Load appropriate template (atomic vs molecular)  
4\. Substitute placeholders with component details  
5\. Generate component file \+ test file  
6\. Create directory structure  
7\. Output success message with next steps  
\#\#\# \*\*2. validate-dmg-palette.py\*\*  
This script should:  
1\. Scan generated component file for color values  
2\. Extract all \`backgroundColor\`, \`borderColor\`, \`color\`, \`shadowColor\` properties  
3\. Validate against DMG palette (\#9BBC0F, \#0F380F, \#8BAC0F, \#306230)  
4\. Report violations with line numbers  
5\. Exit code 0 (pass) or 1 (fail)  
\#\#\# \*\*3. audit-accessibility.py\*\*  
This script should:  
1\. Scan component file for interactive elements (TouchableOpacity, Pressable, Button)  
2\. Check for required accessibility props  
3\. Validate touch target sizes (≥44×44dp)  
4\. Generate accessibility report  
5\. Suggest fixes for violations  
\---  
\#\# \*\*Phase 4: Template Creation\*\*  
\#\#\# \*\*component-template.tsx\*\* (Base Structure)  
\`\`\`typescript  
/\*\*  
 \* {COMPONENT\_NAME} \- {BRIEF\_DESCRIPTION}  
 \* {DETAILED\_DESCRIPTION}  
 \*  
 \* @example  
 \* \<{COMPONENT\_NAME} {EXAMPLE\_PROPS}\>  
 \*   {EXAMPLE\_CHILDREN}  
 \* \</{COMPONENT\_NAME}\>  
 \*/  
import React, { useRef, useCallback, useMemo } from 'react';  
import {  
  {RN\_IMPORTS}  
} from 'react-native';  
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';  
import { tokens, typography, durations, easings } from '@/design-system';  
// ─── Types & Interfaces ───  
interface {COMPONENT\_NAME}Props {  
  {PROPS\_INTERFACE}  
}  
// ─── Component ───  
const {COMPONENT\_NAME}: React.FC\<{COMPONENT\_NAME}Props\> \= React.memo(({  
  {DESTRUCTURED\_PROPS}  
}) \=\> {  
  // ─── Refs ───  
  {REFS}  
  // ─── Callbacks ───  
  {CALLBACKS}  
  // ─── Computed Styles ───  
  {COMPUTED\_STYLES}  
  // ─── Render ───  
  return (  
    {RENDER\_JSX}  
  );  
});  
{COMPONENT\_NAME}.displayName \= '{COMPONENT\_NAME}';  
// ─── Styles ───  
const styles \= StyleSheet.create({  
  {STYLES}  
});  
export default {COMPONENT\_NAME};  
**test-template.tsx (Base Structure)**

/\*\*  
 \* {COMPONENT\_NAME} Component Tests  
 \*/  
import React from 'react';  
import { render, fireEvent } from '@testing-library/react-native';  
import {COMPONENT\_NAME} from '../index';  
describe('{COMPONENT\_NAME}', () \=\> {  
  describe('Rendering', () \=\> {  
    {RENDERING\_TESTS}  
  });  
  describe('Interaction', () \=\> {  
    {INTERACTION\_TESTS}  
  });  
  describe('Accessibility', () \=\> {  
    {ACCESSIBILITY\_TESTS}  
  });  
  describe('States', () \=\> {  
    {STATE\_TESTS}  
  });  
});  
**Phase 5: Deliverables & Testing**

**Create the Skill with:**

1. **SKILL.md** (main instructions, \~500 lines)  
2. **VALIDATION.md** (DMG palette rules, \~100 lines)  
3. **ANIMATIONS.md** (60fps patterns, \~150 lines)  
4. **HAPTICS.md** (feedback reference, \~75 lines)  
5. **templates/** (4 template files, \~200 lines each)  
6. **scripts/** (3 Python scripts, \~150 lines each)

**Test the Skill by generating:**

**Test Case 1: Molecular Component (FormField)** **[UPDATED - Atoms Complete]**

* Input: docs/design-system/molecular-components.md (FormField section)
* Expected Output:
  * apps/mobile-shell/src/components/molecules/FormField/index.tsx (~250 lines)
  * apps/mobile-shell/src/components/molecules/FormField/__tests__/FormField.test.tsx (~180 lines)
  * LCD palette: ✅ Pass (using semantic tokens)
  * Accessibility: ✅ Pass
  * Tests: ✅ 80%+ coverage
* **Note:** FormField already exists, use as reference/validation example

**Test Case 2: Molecular Component (ArchetypeCard)**

* Input: docs/design-system/molecular-components.md (ArchetypeCard section)  
* Expected Output:  
  * apps/mobile-shell/src/components/molecules/ArchetypeCard/index.tsx (\~250 lines)  
  * apps/mobile-shell/src/components/molecules/ArchetypeCard/\_\_tests\_\_/ArchetypeCard.test.tsx (\~180 lines)  
  * DMG palette: ✅ Pass  
  * Accessibility: ✅ Pass  
  * Tests: ✅ 80%+ coverage

**Measure ROI:**

**Baseline (Manual Component Creation):**

* Time: \~2-3 hours per component  
* Steps: Read spec → Write component → Write tests → Debug → Accessibility audit

**With Skill (Automated):**

* Time: \~15-20 minutes per component  
* Steps: Run generate-component.py → Review output → Run tests

**Time Saved:** 1.5-2.5 hours per component × 15 components \= **22.5-37.5 hours saved**  
**Phase 6: Iteration & Refinement**

After testing the skill, answer:

1. **Did Claude trigger the skill correctly?** (Check description matching)  
2. **Were all files read in the right order?** (SKILL.md → templates → specs)  
3. **Did generated components pass validation?** (DMG palette, accessibility, tests)  
4. **Were there any unexpected errors?** (Template substitution, import paths)  
5. **What can be improved?** (More examples, clearer instructions, better scripts)

**Iterate based on observations:**

* If Claude skipped validation → Make validation step more prominent  
* If wrong colors used → Add stronger DMG palette warnings  
* If tests incomplete → Improve test template examples  
* If accessibility missing → Add clearer accessibility checklist

**Success Metrics**

✅ **Skill triggers correctly** when user says "create PixelIcon component"  
✅ **Component generated in \<5 minutes** (vs 2-3 hours manual)  
✅ **DMG palette 100% compliant** (validate-dmg-palette.py passes)  
✅ **Accessibility 100% compliant** (audit-accessibility.py passes)  
✅ **Tests pass with 80%+ coverage** (npm test passes)  
✅ **TypeScript strict mode passes** (npx tsc \--noEmit)  
✅ **15 remaining components completed in 5-7 hours** (vs 30-45 hours manual)  
**Your Task**

Create the complete retro-component-scaffolding skill directory structure with all files. Focus on:

1. **Progressive disclosure** (SKILL.md → reference files → scripts)  
2. **Conciseness** (assume Claude is smart, avoid over-explaining)  
3. **Workflows with checklists** (copy-paste progress tracking)  
4. **Validation loops** (generate → validate → fix → repeat)  
5. **Examples over explanation** (show PixelButton pattern, don't describe it)

**Start by creating the .claude/skills/retro-component-scaffolding/ directory and SKILL.md file.**

---

## **📋 Quick Reference: Key Changes (2025-11-17)**

### **Semantic Token Usage (REQUIRED)**

```typescript
// ✅ CORRECT - Always use semantic tokens
import { tokens } from '@/design-system';

// Backgrounds
backgroundColor: tokens.colors.background.primary    // #9BBC0F (light)
backgroundColor: tokens.colors.background.secondary  // #8BAC0F (alt)
backgroundColor: tokens.colors.background.elevated   // #306230 (cards)

// Text
color: tokens.colors.text.primary      // #0F380F (dark on light)
color: tokens.colors.text.secondary    // #306230 (muted)
color: tokens.colors.text.muted        // #8BAC0F (helper text)
color: tokens.colors.text.inverse      // #9BBC0F (light on dark)

// Buttons
backgroundColor: tokens.colors.button.primary      // #8BAC0F
color: tokens.colors.button.primaryText            // #0F380F

// Borders
borderColor: tokens.colors.border.default          // #306230
borderColor: tokens.colors.border.highlight        // #8BAC0F
```

### **Deprecated Tokens (DO NOT USE)**

```typescript
// ❌ REMOVED - Use alternatives
color: tokens.colors.text.tertiary     // Use: tokens.colors.text.muted

// ⚠️ LEGACY - Prefer semantic tokens over raw DMG
backgroundColor: tokens.colors.dmg.lightest  // Use: tokens.colors.background.primary
color: tokens.colors.dmg.darkest            // Use: tokens.colors.text.primary
```

### **Component Priority Matrix**

| Type | Status | Priority | Examples |
|------|--------|----------|----------|
| **Atoms** | ✅ 10/10 Complete | ⏸️ Paused | PixelButton, PixelText, PixelInput |
| **Molecules** | ⏳ 0/10 Started | 🔴 **HIGH** | ArchetypeCard, FormField, StatBar |
| **Organisms** | ⏳ 0/10 Started | 🟡 Medium | ScreenLayout, NavigationHeader |

### **Validation Checklist**

Before submitting generated components:

- [ ] All colors use `tokens.colors.*` (no hardcoded hex)
- [ ] Semantic tokens preferred over `tokens.colors.dmg.*`
- [ ] No usage of `text.tertiary` (use `text.muted`)
- [ ] Background is light (#9BBC0F), text is dark (#0F380F)
- [ ] `npx tsc --noEmit` passes (zero errors)
- [ ] Tests achieve 80%+ coverage
- [ ] Accessibility props present (`accessibilityRole`, `accessibilityLabel`)
- [ ] Touch targets ≥ 44×44dp
- [ ] Animations use `useNativeDriver: true`

---

**END OF PROMPT**

* 		  
  ~~Create detailed prompt for ui-ux-specialist agent~~

  Test retro-component-scaffolding skill with ui-ux-specialist

  Measure time saved vs baseline (manual component creation)

  Iterate skill based on ui-ux-specialist results

Perfect\! I've created an **extremely detailed, production-ready prompt** for the ui-ux-specialist agent. Here's what I've included:  
📋 **Prompt Highlights**

✅ **Complete Context (Phase 1\)**

* 6 critical files to read with specific focus areas  
* Design tokens, exemplar patterns, test structures  
* Both atomic and molecular component specifications

✅ **Skill Architecture (Phase 2\)**

* Full SKILL.md structure (\~500 lines) following Anthropic best practices  
* Progressive disclosure with supporting files (VALIDATION.md, ANIMATIONS.md, HAPTICS.md)  
* 6-step workflow with copy-paste checklist  
* DMG palette validation rules, animation patterns, haptic feedback

✅ **Implementation Details (Phases 3-4)**

* 3 Python scripts with specific requirements:  
  * generate-component.py (component scaffolding)  
  * validate-dmg-palette.py (color compliance)  
  * audit-accessibility.py (WCAG AA validator)  
* 4 TypeScript templates (base \+ atomic \+ molecular \+ test)

✅ **Testing & ROI (Phases 5-6)**

* 2 concrete test cases (PixelIcon, ArchetypeCard)  
* Expected outputs with line counts  
* Time saved calculation: **22.5-37.5 hours** (conservative estimate)  
* Success metrics checklist

🚀 **Next Steps**

**Copy the entire prompt above** and hand it to the **ui-ux-specialist** agent using this exact command:  
\*ui-ux-specialist \-- \[PASTE THE ENTIRE PROMPT FROM ABOVE\]  
The agent will:

1. Read all 6 specified files  
2. Create the complete .claude/skills/retro-component-scaffolding/ directory  
3. Generate SKILL.md \+ supporting files \+ templates \+ scripts  
4. Test on PixelIcon and ArchetypeCard  
5. Report back with results and iteration recommendations

**The prompt is ready to go\!** Let me know when you want to launch the ui-ux-specialist agent, or if you'd like me to refine any section of the prompt first.  
