# LCD Screen-Only Palette - Compliance Checklist
## Mandatory Requirements for ALL 16BitFit Screens & Components

**Version:** 1.0
**Last Updated:** 2025-11-09
**Authority:** Design System Core Team
**Status:** 🔴 CRITICAL - MUST FOLLOW

---

## ⚠️ BEFORE YOU START

**This checklist is MANDATORY for:**
- All new screens
- All new components
- All style updates
- All pull requests

**Non-compliance will result in:**
- ❌ PR rejection
- ❌ Build failure (once linting rules are added)
- ❌ Design system review required

---

## 🎨 THE 4 SACRED COLORS

**ONLY these 4 colors are allowed in the entire 16BitFit app:**

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Neon Grass Glow** | `#9BBC0F` | rgb(155, 188, 15) | Lightest - backgrounds, buttons |
| **Deep Forest Shadow** | `#0F380F` | rgb(15, 56, 15) | Darkest - text, shadows |
| **Lime Highlight** | `#8BAC0F` | rgb(139, 172, 15) | Medium-light - highlights, active states |
| **Pine Border** | `#306230` | rgb(48, 98, 48) | Medium-dark - borders, secondary text |

**Source:** `docs/design-system/design-tokens-LCD.md` (LCD Screen-Only Theme)

---

## ✅ COMPLIANCE RULES

### Rule 1: No Custom Colors ❌
**NEVER** use hardcoded hex values outside the 4 LCD colors.
**ALWAYS** use design system tokens.

**❌ WRONG:**
```typescript
backgroundColor: '#FFFFFF'
backgroundColor: '#FF5733'
color: '#000000'
```

**✅ CORRECT:**
```typescript
backgroundColor: tokens.colors.background.primary  // #9BBC0F
borderColor: tokens.colors.border.default         // #306230
color: tokens.colors.text.primary                 // #0F380F
```

---

### Rule 2: No Gradients ❌
**NEVER** use `LinearGradient`, `RadialGradient`, or CSS gradients.
**ALWAYS** use solid colors from the LCD palette.

**❌ WRONG:**
```typescript
<LinearGradient
  colors={['#9BBC0F', '#8BAC0F']}
  style={styles.container}
/>
```

**✅ CORRECT:**
```typescript
<View style={{
  backgroundColor: tokens.colors.background.primary  // Solid #9BBC0F
}} />
```

---

### Rule 3: No Transparency (Except Modals) ❌
**NEVER** use `opacity < 1.0` for regular UI elements.
**ONLY** use transparency for modal overlays (80% opacity).

**❌ WRONG:**
```typescript
opacity: 0.5  // Regular element
backgroundColor: 'rgba(155, 188, 15, 0.7)'  // Non-modal
```

**✅ CORRECT:**
```typescript
// Regular elements - no transparency
opacity: 1.0
backgroundColor: tokens.colors.background.primary

// Modal overlays ONLY
backgroundColor: 'rgba(15, 56, 15, 0.8)'  // Deep forest at 80%
```

---

### Rule 4: Zero Border Radius ❌
**NEVER** use rounded corners.
**ALWAYS** use sharp, pixel-perfect edges.

**❌ WRONG:**
```typescript
borderRadius: 8
borderRadius: 4
borderTopLeftRadius: 12
```

**✅ CORRECT:**
```typescript
borderRadius: 0  // ALWAYS ZERO
borderRadius: tokens.borders.radius  // Also 0
```

---

### Rule 5: Zero Shadow Radius ❌
**NEVER** use blurred shadows.
**ALWAYS** use hard pixel shadows.

**❌ WRONG:**
```typescript
shadowRadius: 4
shadowBlur: 8
```

**✅ CORRECT:**
```typescript
shadowRadius: 0  // NO BLUR
shadowOffset: { width: 4, height: 4 }
shadowColor: tokens.colors.border.dark  // #0F380F
shadowOpacity: 1
```

---

## 🔍 PRE-PR AUDIT CHECKLIST

**Before submitting any pull request, verify ALL of the following:**

### Code Audit

- [ ] No hardcoded hex colors (search for `#[0-9A-Fa-f]` in code)
- [ ] No `borderRadius` values > 0
- [ ] No `shadowRadius` values > 0
- [ ] No `LinearGradient` components
- [ ] No `RadialGradient` components
- [ ] No `opacity` < 1.0 (except modal overlays)
- [ ] All colors reference `tokens.colors.*`
- [ ] All shadows use `shadowRadius: 0`

### Visual Verification

- [ ] All screens use only the 4 LCD colors
- [ ] No rounded corners visible
- [ ] Shadows are hard-edged (no blur)
- [ ] No gradients visible
- [ ] No semi-transparent elements (except modals)

---

## 🛠️ HOW TO FIX NON-COMPLIANCE

### Step 1: Search for Violations

```bash
# Find hardcoded colors
grep -r "#[0-9A-Fa-f]" src/

# Find border radius
grep -r "borderRadius:" src/

# Find shadow radius
grep -r "shadowRadius:" src/

# Find gradients
grep -r "LinearGradient" src/
grep -r "RadialGradient" src/

# Find opacity
grep -r "opacity:" src/
```

### Step 2: Replace with Tokens

**Color Mapping:**
```typescript
// Replace hardcoded colors with tokens
'#9BBC0F' → tokens.colors.background.primary
'#0F380F' → tokens.colors.text.primary
'#8BAC0F' → tokens.colors.button.primary
'#306230' → tokens.colors.border.default
```

**Style Fixes:**
```typescript
// Remove non-LCD styles
borderRadius: 0      // No rounding
shadowRadius: 0      // No blur
opacity: 1.0         // No transparency
```

### Step 3: Test Visually

1. Run app in simulator
2. Navigate to modified screen
3. Visually verify compliance
4. Take screenshot for PR

---

## 📖 CODE EXAMPLES

### ✅ COMPLIANT Button

```typescript
import { tokens } from '@/design-system';

<TouchableOpacity
  style={{
    backgroundColor: tokens.colors.button.primary,      // #8BAC0F
    borderWidth: 2,
    borderColor: tokens.colors.border.dark,             // #0F380F
    borderRadius: 0,                                    // Zero!
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: tokens.colors.border.dark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,                                    // Zero!
  }}
>
  <Text style={{
    color: tokens.colors.button.primaryText,            // #0F380F
    fontFamily: 'PressStart2P-Regular',
    fontSize: 12,
  }}>
    PRESS START
  </Text>
</TouchableOpacity>
```

---

### ✅ COMPLIANT Input Field

```typescript
import { tokens } from '@/design-system';

<TextInput
  style={{
    backgroundColor: tokens.colors.input.background,    // #9BBC0F
    borderWidth: 2,
    borderColor: tokens.colors.input.border,            // #306230
    borderRadius: 0,                                    // Zero!
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: tokens.colors.input.text,                    // #0F380F
    fontFamily: 'Montserrat',
    fontSize: 14,
  }}
  placeholderTextColor={tokens.colors.input.placeholder}  // #8BAC0F
/>
```

---

### ✅ COMPLIANT Card

```typescript
import { tokens } from '@/design-system';

<View style={{
  backgroundColor: tokens.colors.background.primary,    // #9BBC0F
  borderWidth: 4,
  borderColor: tokens.colors.border.default,            // #306230
  borderRadius: 0,                                      // Zero!
  padding: 16,
  shadowColor: tokens.colors.border.dark,               // #0F380F
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 0,                                      // Zero!
}}>
  <Text style={{
    color: tokens.colors.text.primary,                  // #0F380F
    fontFamily: 'PressStart2P-Regular',
    fontSize: 16,
  }}>
    GAME BOY
  </Text>
</View>
```

---

### ❌ NON-COMPLIANT Examples

**Don't do this:**

```typescript
// ❌ Hardcoded colors
backgroundColor: '#FFFFFF'
color: '#000000'

// ❌ Rounded corners
borderRadius: 8
borderTopLeftRadius: 12

// ❌ Blurred shadows
shadowRadius: 4
shadowBlur: 8

// ❌ Gradients
<LinearGradient colors={['#9BBC0F', '#8BAC0F']} />

// ❌ Transparency (except modals)
opacity: 0.5
backgroundColor: 'rgba(155, 188, 15, 0.7)'

// ❌ Colors outside LCD palette
backgroundColor: '#FF5733'
borderColor: '#00FFFF'
```

---

## 📚 REFERENCE DOCUMENTATION

**Must Read:**
1. [`docs/design-system/design-tokens-LCD.md`](design-tokens-LCD.md) - Complete LCD theme specification
2. [`apps/mobile-shell/src/design-system/tokens.ts`](../../apps/mobile-shell/src/design-system/tokens.ts) - Token implementation
3. [`docs/design-system/IMPLEMENTATION-ROADMAP.md`](IMPLEMENTATION-ROADMAP.md) - Phase 4 compliance details
4. [`docs/design-system/magicpath-prompt-library.md`](magicpath-prompt-library.md) - Theme 6: LCD Screen Content

---

## 🚨 ENFORCEMENT

### Automated Checks (Coming Soon)

We plan to add ESLint rules to automatically detect violations:
- Hardcoded hex colors
- Non-zero border radius
- Non-zero shadow radius
- LinearGradient usage

### Manual Review

Until automated checks are in place, **every PR must be manually reviewed** for LCD palette compliance by:
1. UX/UI Specialist
2. Design System Owner
3. Code reviewer

---

## ✅ APPROVAL CHECKLIST

**PR Reviewers: Verify the following before approving:**

- [ ] All colors are from the 4 LCD colors
- [ ] All colors use design tokens (no hardcoded hex)
- [ ] No `borderRadius` > 0
- [ ] No `shadowRadius` > 0
- [ ] No gradients
- [ ] No opacity < 1.0 (except modals)
- [ ] Visual screenshot attached showing compliance
- [ ] grep commands run to verify (no violations found)

---

## 📝 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-09 | Initial LCD Screen-Only palette compliance checklist. 5 mandatory rules, code examples, audit procedures, and enforcement guidelines. |

---

**Document Owner:** Architect
**Approved By:** Product Owner
**Last Review:** 2025-11-09

---

_This checklist ensures visual consistency and authentic Game Boy LCD aesthetics across the entire 16BitFit application._
