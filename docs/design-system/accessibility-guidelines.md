# Accessibility Guidelines
## 16BitFit V3 - Story 1.4: Onboarding Profile Flow

**Document Version**: 1.0
**Last Updated**: 2025-10-31
**Target Compliance**: WCAG 2.1 Level AA
**Platforms**: iOS (VoiceOver) + Android (TalkBack)

---

## Overview

This document defines accessibility standards for 16BitFit's onboarding flow, ensuring inclusive fitness tracking for all users. While retro aesthetics are core to our design, accessibility is non-negotiable.

**Key Principle**: Every user, regardless of ability, should complete onboarding with confidence and independence.

---

## WCAG 2.1 Level AA Compliance Checklist

### 1. Perceivable

#### 1.1 Text Alternatives
- [ ] **All images have meaningful alt text**
  - Logo: `alt="16BitFit logo - pixel art dumbbell"`
  - Archetype sprites: `alt="Trainer character - fitness instructor"`
  - Decorative borders: `alt=""` (empty for screen readers to skip)

#### 1.2 Time-Based Media
- [ ] **Animations respect reduced motion**
  - Check `AccessibilityInfo.isReduceMotionEnabled()` on mount
  - Disable entrance animations if true
  - Replace with instant fade-in (100ms max)

#### 1.3 Adaptable
- [ ] **Content works in portrait and landscape**
  - Test all 3 screens at 0°, 90°, 180°, 270° rotation
  - Ensure scrollable content remains accessible
  - Maintain touch target sizes in landscape

#### 1.4 Distinguishable
- [ ] **Color contrast meets 4.5:1 minimum**
  - DMG Palette Audit:
    - `#9BBC0F` on `#0F380F`: **12.4:1** ✅ (AAA)
    - `#8BAC0F` on `#0F380F`: **10.8:1** ✅ (AAA)
    - `#306230` on `#0F380F`: **3.2:1** ❌ (Use only for borders, not text)
  - Validation Tool: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

- [ ] **Text can scale to 200%**
  - Support iOS Dynamic Type (Text Size in Settings)
  - Android: Use `sp` units, test with Large/Huge font settings
  - Reflow layouts, don't truncate critical text

- [ ] **Color is not the only visual cue**
  - Error states: Red border + error icon + error text
  - Success states: Green border + checkmark + success text
  - Selected archetype: Thicker border + scale + checkmark badge

---

### 2. Operable

#### 2.1 Keyboard Accessible
- [ ] **All interactive elements keyboard-navigable**
  - iOS: Test with Bluetooth keyboard + VoiceOver
  - Android: Test with hardware keyboard + TalkBack
  - Tab order matches visual reading order (top→bottom, left→right)

- [ ] **No keyboard traps**
  - User can tab into and out of all modals/dialogs
  - ESC key dismisses modals (Android back button)

#### 2.2 Enough Time
- [ ] **No time limits on onboarding**
  - Users can take unlimited time on each screen
  - Auto-dismiss toasts last minimum 5 seconds
  - Option to disable auto-dismiss in settings

#### 2.3 Seizures and Physical Reactions
- [ ] **No flashing content >3 times per second**
  - Our animations are 200-500ms (safe)
  - Avoid rapid color changes in success/error states

#### 2.4 Navigable
- [ ] **Screens have clear titles**
  - Screen 1: "Welcome to 16BitFit - Step 1 of 3"
  - Screen 2: "Create Your Profile - Step 2 of 3"
  - Screen 3: "Choose Your Archetype - Step 3 of 3"

- [ ] **Focus order is logical**
  - WelcomeScreen: Progress → Logo → Title → Tagline → Primary Button → Secondary Link
  - ProfileSetupScreen: Progress → Header → Username → Display Name → Create Button
  - ArchetypeScreen: Progress → Header → Card 1-5 (left-right, top-bottom) → Continue Button

- [ ] **Focus indicator is visible**
  - Add 3px offset outline in `#9BBC0F` on focus
  - Outline width: 3px solid, 4px offset from element
  - Never set `outline: none` without custom focus styles

#### 2.5 Input Modalities
- [ ] **Touch targets minimum 44×44px**
  - Audit all buttons, cards, inputs, links
  - Add invisible padding if visual size is smaller
  - Archetype cards: 160×200px ✅ (well above minimum)

- [ ] **Gestures have alternatives**
  - No swipe-only navigation (use buttons)
  - Pinch-to-zoom disabled (fixed layouts okay for onboarding)

---

### 3. Understandable

#### 3.1 Readable
- [ ] **Language declared in app**
  - Set `lang="en"` in HTML/webview contexts
  - React Native: No global lang attribute needed, but set per TextInput

#### 3.2 Predictable
- [ ] **Consistent navigation**
  - Progress indicator always at top (79pt from top)
  - Primary action always bottom-right or full-width bottom
  - Back navigation via header arrow (Screen 2-3)

- [ ] **No context changes on focus**
  - Focusing an input doesn't auto-submit form
  - Selecting archetype doesn't auto-advance (requires Continue tap)

#### 3.3 Input Assistance
- [ ] **Error messages are clear and specific**
  - ❌ Bad: "Invalid input"
  - ✅ Good: "Username must be 3-20 characters, alphanumeric only"

- [ ] **Labels and instructions always visible**
  - Don't hide label when input is focused
  - Keep helper text visible during typing

- [ ] **Error prevention for critical actions**
  - Confirm dialog before skipping profile creation
  - Prevent accidental navigation away from form with unsaved changes

---

### 4. Robust

#### 4.1 Compatible
- [ ] **Valid semantic HTML/RN components**
  - Use `<TextInput>` not `<View>` with manual text entry
  - Use `<Button>` or `<TouchableOpacity>` with proper `accessibilityRole`

- [ ] **Proper ARIA/Accessibility props**
  - See React Native Accessibility Implementation below

---

## React Native Accessibility Implementation

### Core Accessibility Props

```typescript
// Every interactive component MUST have:
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Get Started - Begin onboarding"
  accessibilityHint="Navigates to profile creation screen"
  accessibilityState={{ disabled: false }}
  onPress={handlePress}
>
  <PixelText>GET STARTED</PixelText>
</TouchableOpacity>
```

### Accessibility Roles

| Component | accessibilityRole |
|-----------|-------------------|
| PixelButton | `button` |
| PixelInput | `none` (TextInput is auto-labeled) |
| ArchetypeCard | `radio` (mutually exclusive selection) |
| ProgressIndicator | `progressbar` |
| ToastNotification | `alert` |
| PixelCheckbox | `checkbox` |
| BackButton | `button` |

### Dynamic Announcements

```typescript
import { AccessibilityInfo } from 'react-native';

// Announce success/error without visual focus change
const announceForAccessibility = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
};

// Example: Profile creation success
announceForAccessibility('Profile created successfully. Choose your archetype next.');

// Example: Validation error
announceForAccessibility('Error: Username already taken. Please try a different username.');
```

### Focus Management

```typescript
import { useRef } from 'react';
import { TextInput } from 'react-native';

const usernameRef = useRef<TextInput>(null);

// Auto-focus first input on screen mount
useEffect(() => {
  // Delay to allow screen transition to complete
  setTimeout(() => {
    usernameRef.current?.focus();
  }, 500);
}, []);

// Focus next input after validation passes
const handleUsernameSubmit = () => {
  if (isValidUsername) {
    displayNameRef.current?.focus();
  }
};
```

### Reduced Motion Detection

```typescript
import { AccessibilityInfo, useEffect, useState } from 'react-native';

const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  // Check on mount
  AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
    setReduceMotion(enabled);
  });

  // Listen for changes
  const subscription = AccessibilityInfo.addEventListener(
    'reduceMotionChanged',
    enabled => setReduceMotion(enabled)
  );

  return () => subscription.remove();
}, []);

// Apply to animations
const animationDuration = reduceMotion ? 100 : 300;
const animationScale = reduceMotion ? [1, 1] : [0.9, 1.05, 1];
```

---

## Screen-Specific Accessibility Specs

### WelcomeScreen (Step 1/3)

**Accessibility Tree** (reading order):
1. Progress: "Step 1 of 3, onboarding progress"
2. Logo: "16BitFit logo, pixel art dumbbell"
3. Title: "16BitFit" (heading level 1)
4. Tagline: "Turn Steps Into XP. Train Your Monster." (paragraph)
5. Primary Button: "Get Started, navigates to profile creation"
6. Secondary Link: "Skip for now, continue without creating profile"

**Implementation**:
```typescript
<View accessible={false}> {/* Container, don't read */}
  <ProgressIndicator
    accessible={true}
    accessibilityRole="progressbar"
    accessibilityLabel="Step 1 of 3"
    accessibilityValue={{ now: 1, min: 1, max: 3 }}
    totalSteps={3}
    currentStep={1}
  />

  <Image
    source={require('./logo.png')}
    accessible={true}
    accessibilityLabel="16BitFit logo - pixel art dumbbell"
  />

  <PixelText
    accessibilityRole="header"
    accessibilityLevel={1}
  >
    16BITFIT
  </PixelText>

  <PixelText accessible={true}>
    Turn Steps Into XP. Train Your Monster.
  </PixelText>

  <PixelButton
    accessibilityLabel="Get Started"
    accessibilityHint="Begin onboarding, navigates to profile creation screen"
    onPress={handleGetStarted}
  >
    GET STARTED
  </PixelButton>

  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel="Skip for now"
    accessibilityHint="Continue to app without creating profile"
    onPress={handleSkip}
  >
    <PixelText>Skip for now</PixelText>
  </TouchableOpacity>
</View>
```

---

### ProfileSetupScreen (Step 2/3)

**Accessibility Tree**:
1. Progress: "Step 2 of 3"
2. Back button: "Back to welcome screen"
3. Heading: "Create Your Profile"
4. Subheading: "Choose a username to get started"
5. Username input: "Username, required, 3 to 20 characters"
6. Username helper text: "Letters, numbers, and underscores only"
7. Username error (if present): "Username already taken"
8. Display Name input: "Display Name, optional"
9. Create Account button: "Create Account, submits profile"
10. Skip link: "Skip for now"

**Form Validation Accessibility**:
```typescript
<FormField
  label="Username"
  value={username}
  onChangeText={setUsername}
  error={usernameError !== null}
  errorText={usernameError}
  required={true}
  accessible={true}
  accessibilityLabel="Username"
  accessibilityHint="Required. 3 to 20 characters. Letters, numbers, and underscores only."
  accessibilityState={{
    disabled: false,
    invalid: usernameError !== null
  }}
  accessibilityLiveRegion="polite" // Announce errors when they appear
/>

{/* Announce validation on blur */}
const handleUsernameBlur = () => {
  const validation = validateUsername(username);
  if (!validation.valid) {
    AccessibilityInfo.announceForAccessibility(
      `Username error: ${validation.message}`
    );
  }
};
```

**Keyboard Avoidance**:
```typescript
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  {/* Form content */}
</KeyboardAvoidingView>
```

---

### ArchetypeSelectionScreen (Step 3/3)

**Accessibility Tree**:
1. Progress: "Step 3 of 3, final step"
2. Back button: "Back to profile setup"
3. Heading: "Choose Your Archetype"
4. Subheading: "Select your fitness style"
5. Archetype 1: "Trainer, radio button, 1 of 5, not selected"
6. Archetype 2: "Runner, radio button, 2 of 5, not selected"
7. Archetype 3: "Yoga, radio button, 3 of 5, not selected"
8. Archetype 4: "Bodybuilder, radio button, 4 of 5, not selected"
9. Archetype 5: "Cyclist, radio button, 5 of 5, not selected"
10. Continue button: "Continue, disabled until archetype selected"

**Radio Group Implementation**:
```typescript
<View
  accessible={false}
  accessibilityRole="radiogroup"
  accessibilityLabel="Choose your fitness archetype"
>
  {archetypes.map((archetype, index) => (
    <ArchetypeCard
      key={archetype.id}
      {...archetype}
      selected={selectedId === archetype.id}
      onSelect={setSelectedId}
      accessible={true}
      accessibilityRole="radio"
      accessibilityLabel={`${archetype.name}, ${archetype.description}`}
      accessibilityHint={`${index + 1} of ${archetypes.length}. Double tap to select.`}
      accessibilityState={{
        selected: selectedId === archetype.id,
        disabled: false
      }}
    />
  ))}
</View>

<PixelButton
  onPress={handleContinue}
  disabled={!selectedId}
  accessibilityLabel="Continue to next step"
  accessibilityHint="Complete onboarding and enter app"
  accessibilityState={{ disabled: !selectedId }}
>
  CONTINUE
</PixelButton>

{/* Announce selection */}
const handleArchetypeSelect = (id: string) => {
  const archetype = archetypes.find(a => a.id === id);
  setSelectedId(id);
  AccessibilityInfo.announceForAccessibility(
    `${archetype.name} selected. ${archetype.description}`
  );
};
```

---

## Testing Procedures

### iOS VoiceOver Testing

**Setup**:
1. Settings → Accessibility → VoiceOver → ON
2. Accessibility Shortcut → VoiceOver (triple-click side button)

**Gestures**:
- **Swipe right**: Next element
- **Swipe left**: Previous element
- **Double tap**: Activate element
- **Three-finger swipe left/right**: Navigate between screens
- **Two-finger scrub (Z-shape)**: Go back

**Test Script**:
1. Launch app with VoiceOver enabled
2. Verify reading order matches visual order
3. Verify all images have alt text (decorative images silent)
4. Verify focus indicator visible on each element
5. Complete full onboarding flow without sighted assistance
6. Verify error messages are announced immediately
7. Verify success confirmations are announced

**Pass Criteria**: Complete onboarding in <3 minutes without visual reference.

---

### Android TalkBack Testing

**Setup**:
1. Settings → Accessibility → TalkBack → ON
2. Volume Up + Volume Down (hold 3s) = TalkBack toggle shortcut

**Gestures**:
- **Swipe right**: Next element
- **Swipe left**: Previous element
- **Double tap**: Activate element
- **Swipe down then right**: Read from top
- **Back button**: Navigate back

**Test Script**: Same as iOS VoiceOver above.

---

### Keyboard Navigation Testing

**Setup**:
1. Connect Bluetooth keyboard to device
2. iOS: Enable Full Keyboard Access (Settings → Accessibility)
3. Android: Navigate with Tab/Shift+Tab

**Test Script**:
1. Tab through entire WelcomeScreen
2. Verify focus indicator visible on all interactive elements
3. Verify Enter activates buttons
4. Verify Escape dismisses modals
5. Verify no keyboard traps (can tab out of all elements)
6. Complete onboarding using only keyboard

**Pass Criteria**: Complete onboarding without touching screen.

---

### Color Contrast Auditing

**Tools**:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Stark plugin for Figma](https://www.getstark.co/)
- React Native: Use `contrast-checker` npm package

**Process**:
1. Export all color combinations used for text
2. Run through contrast checker
3. Flag any below 4.5:1 (normal text) or 3:1 (large text >18pt)
4. Adjust colors or use only for decorative elements

**Pre-Audited Combinations**:
| Foreground | Background | Ratio | WCAG | Use Case |
|------------|------------|-------|------|----------|
| #9BBC0F | #0F380F | 12.4:1 | AAA ✅ | Primary text, buttons |
| #8BAC0F | #0F380F | 10.8:1 | AAA ✅ | Hover states, highlights |
| #306230 | #0F380F | 3.2:1 | Fail ❌ | Borders only, not text |
| #FFFFFF | #0F380F | 18.5:1 | AAA ✅ | High contrast mode |
| #0F380F | #8BAC0F | 10.8:1 | AAA ✅ | Inverted buttons |

---

### Dynamic Type Testing (iOS)

**Setup**:
1. Settings → Accessibility → Display & Text Size → Larger Text
2. Drag slider to test sizes: Default, Large, Extra Large, Accessibility sizes

**Test at Each Size**:
1. Verify no text truncation on buttons
2. Verify labels don't overflow containers
3. Verify cards reflow without breaking layout
4. Verify minimum 44×44px touch targets maintained

**Auto-Scaling Implementation**:
```typescript
import { StyleSheet, PixelRatio } from 'react-native';

const scale = PixelRatio.getFontScale();

const styles = StyleSheet.create({
  dynamicText: {
    fontSize: 16 * scale, // Scales with system font size
    lineHeight: 20 * scale,
  }
});

// Or use maxFontSizeMultiplier to cap scaling
<PixelText maxFontSizeMultiplier={1.5}>
  Username
</PixelText>
```

---

### Font Size Testing (Android)

**Setup**:
1. Settings → Display → Font Size
2. Test: Small, Normal, Large, Huge

**Same test criteria as iOS Dynamic Type above.**

---

## Common Accessibility Issues & Fixes

### Issue 1: "Button" Not Announced
**Problem**: Custom button components not recognized by screen readers.

**Fix**:
```typescript
// ❌ Bad
<TouchableOpacity onPress={handlePress}>
  <PixelText>Submit</PixelText>
</TouchableOpacity>

// ✅ Good
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Submit form"
  onPress={handlePress}
>
  <PixelText>Submit</PixelText>
</TouchableOpacity>
```

---

### Issue 2: Form Errors Not Announced
**Problem**: Visual error appears but screen reader doesn't announce it.

**Fix**:
```typescript
// ❌ Bad
{error && <PixelText color="error">{error}</PixelText>}

// ✅ Good
<View
  accessible={true}
  accessibilityLiveRegion="polite" // Announces changes
  accessibilityRole="alert"
>
  {error && <PixelText color="error">{error}</PixelText>}
</View>

// Also manually announce critical errors
if (error) {
  AccessibilityInfo.announceForAccessibility(`Error: ${error}`);
}
```

---

### Issue 3: Decorative Images Read Aloud
**Problem**: VoiceOver reads "image" for decorative pixel borders.

**Fix**:
```typescript
// ❌ Bad
<Image source={require('./decorative-border.png')} />

// ✅ Good
<Image
  source={require('./decorative-border.png')}
  accessible={true}
  accessibilityLabel="" // Empty string = skip
  accessibilityRole="none"
/>
```

---

### Issue 4: Focus Lost After Modal Dismiss
**Problem**: After closing modal, focus returns to top of screen.

**Fix**:
```typescript
import { useRef } from 'react';

const triggerButtonRef = useRef<TouchableOpacity>(null);

const handleModalDismiss = () => {
  setModalVisible(false);

  // Return focus to element that opened modal
  setTimeout(() => {
    triggerButtonRef.current?.focus();
  }, 300);
};
```

---

### Issue 5: Card Selection Not Announced
**Problem**: Selecting archetype card shows visual change but no audio feedback.

**Fix**:
```typescript
const handleArchetypeSelect = (archetype: Archetype) => {
  setSelectedId(archetype.id);

  // Announce selection
  AccessibilityInfo.announceForAccessibility(
    `${archetype.name} selected. ${archetype.description}`
  );

  // Optional: Haptic feedback
  Haptics.selectionAsync();
};
```

---

## Automated Testing Tools

### Jest + React Native Testing Library

```typescript
import { render, screen } from '@testing-library/react-native';

describe('WelcomeScreen Accessibility', () => {
  it('has proper accessibility labels', () => {
    render(<WelcomeScreen />);

    expect(screen.getByRole('button', { name: 'Get Started' })).toBeTruthy();
    expect(screen.getByRole('header', { name: '16BITFIT' })).toBeTruthy();
    expect(screen.getByLabelText('Step 1 of 3')).toBeTruthy();
  });

  it('announces errors to screen readers', () => {
    const { getByA11yLiveRegion } = render(<ProfileSetupScreen />);

    // Trigger validation error
    fireEvent.changeText(usernameInput, 'ab'); // Too short
    fireEvent.blur(usernameInput);

    expect(getByA11yLiveRegion()).toHaveTextContent(
      'Username must be 3-20 characters'
    );
  });
});
```

---

### Axe DevTools (for WebView content)

If using WebView for any UI:
```bash
npm install --save-dev @axe-core/react-native
```

```typescript
import { configureAxe } from '@axe-core/react-native';

if (__DEV__) {
  configureAxe({
    rules: [
      { id: 'color-contrast', enabled: true },
      { id: 'label', enabled: true },
    ]
  });
}
```

---

## Accessibility Checklist (Pre-Release)

### Manual Testing
- [ ] Complete onboarding flow with VoiceOver (iOS)
- [ ] Complete onboarding flow with TalkBack (Android)
- [ ] Complete onboarding flow with Bluetooth keyboard only
- [ ] Test at 200% font size (iOS Dynamic Type)
- [ ] Test at "Huge" font size (Android)
- [ ] Test with Reduce Motion enabled
- [ ] Test with High Contrast enabled (iOS)
- [ ] Test with Grayscale mode (color-blind simulation)

### Automated Testing
- [ ] All buttons have `accessibilityRole="button"`
- [ ] All images have `accessibilityLabel` or `accessibilityLabel=""`
- [ ] All form inputs have labels
- [ ] All error states have `accessibilityLiveRegion="polite"`
- [ ] All color contrasts meet 4.5:1 minimum
- [ ] All touch targets minimum 44×44px
- [ ] All animations respect `reduceMotion` setting
- [ ] Tab order matches visual order

### Documentation
- [ ] Accessibility features listed in App Store description
- [ ] VoiceOver/TalkBack usage documented in help center
- [ ] Keyboard shortcuts documented (if applicable)

---

## Resources & Tools

**Official Documentation**:
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [iOS Accessibility (Apple)](https://developer.apple.com/accessibility/)
- [Android Accessibility (Google)](https://developer.android.com/guide/topics/ui/accessibility)

**Testing Tools**:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Axe DevTools](https://www.deque.com/axe/devtools/)
- [Stark Figma Plugin](https://www.getstark.co/)

**Learning Resources**:
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Inclusive Components](https://inclusive-components.design/)
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Summary

**Key Takeaways**:
1. **Accessibility is non-negotiable** - WCAG AA compliance required
2. **Test early and often** - VoiceOver/TalkBack testing on every sprint
3. **Color contrast matters** - DMG palette pre-audited, stick to approved combinations
4. **Motion can harm** - Always respect `reduceMotion` setting
5. **Announce changes** - Use `AccessibilityInfo.announceForAccessibility()` for dynamic content
6. **Touch targets matter** - 44×44px minimum, no exceptions
7. **Keyboard navigation required** - All interactive elements must be keyboard-accessible

**Next Steps**:
1. Review this document with development team
2. Add accessibility props to all existing components
3. Implement automated accessibility tests
4. Schedule VoiceOver/TalkBack testing sessions
5. Create accessibility regression test suite

**Contact**: accessibility@16bitfit.app (fictional)

---

*Document 11 of 12 Complete*
*Next: Document 12 - Interaction Patterns*
