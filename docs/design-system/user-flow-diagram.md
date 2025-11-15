# 16BitFit User Flow Diagram
## Version 1.0 | Story 1.4 Onboarding Flow

This document provides a comprehensive visual and textual representation of the user journey through Story 1.4: Onboarding & Profile Setup.

---

## Flow Overview

**User Story:** "As a New User, I want to be guided through creating a basic profile (optional login) and selecting my desired Fitness Archetype (Trainer, Runner, Yoga, Bodybuilder, Cyclist), so that I can begin personalizing my experience."

**Total Steps:** 3 screens
**Estimated Completion Time:** 2-3 minutes
**Success Criteria:** User completes profile and selects archetype

---

## High-Level Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP LAUNCH                                │
│                     (First Time User)                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ WELCOME SCREEN │
                 │  (Step 1/3)    │
                 └───────┬───────┘
                         │
           ┌─────────────┼─────────────┐
           │                           │
           ▼                           ▼
    [Get Started]           [I already have account]
           │                           │
           │                           └──────► (Future: Login Flow)
           │
           ▼
   ┌───────────────────┐
   │ PROFILE SETUP      │
   │   (Step 2/3)       │
   │                    │
   │ • Username Input   │
   │ • Display Name     │
   └─────────┬─────────┘
             │
   ┌─────────┴─────────┐
   │                   │
   ▼                   ▼
[Create Account]  [Skip for now]
   │                   │
   │ (validation)      └────────┐
   │                            │
   ├─ Success ──────────────────┤
   │                            │
   ├─ Error (username taken)    │
   │   └─► Show toast           │
   │       Stay on screen       │
   │                            │
   ▼                            ▼
┌──────────────────────────────────┐
│  ARCHETYPE SELECTION             │
│      (Step 3/3)                  │
│                                  │
│  [Trainer] [Runner] [Yoga]       │
│  [Bodybuilder] [Cyclist]         │
└──────────────┬───────────────────┘
               │
               ▼
          [Continue]
               │
               ├─ No selection ──► Button disabled
               │
               ├─ Selection made ──► Button enabled
               │
               ▼
        ┌─────────────┐
        │   SUCCESS   │
        │ Profile saved│
        └──────┬──────┘
               │
               ▼
        (Story 1.5: Photo Upload Screen)
```

---

## Detailed Screen-by-Screen Flow

---

## Screen 1: WelcomeScreen

### Entry Point
- User opens app for first time
- App checks: `hasCompletedOnboarding === false`
- Navigates to WelcomeScreen

### Screen State
```javascript
screenState: {
  step: 1,
  totalSteps: 3,
  loading: false,
  error: null,
}
```

### Visual Elements
```
╔═══════════════════════════════════════╗
║                                       ║
║         ● ○ ○  (Step 1 of 3)          ║
║                                       ║
║                                       ║
║          [16BitFit Logo]              ║
║             96×96px                   ║
║                                       ║
║           16BITFIT                    ║
║      (Press Start 2P, 32px)           ║
║                                       ║
║   "Your fitness journey starts        ║
║    here. Level up your health,        ║
║      one step at a time."             ║
║      (Montserrat, 18px)               ║
║                                       ║
║                                       ║
║                                       ║
║   ┌─────────────────────────────┐    ║
║   │      GET STARTED            │    ║
║   │   (Primary CTA, full width) │    ║
║   └─────────────────────────────┘    ║
║                                       ║
║   I already have an account           ║
║   (Tertiary link, underlined)         ║
║                                       ║
╚═══════════════════════════════════════╝
```

### User Actions & Outcomes

#### Action 1: Tap "GET STARTED"
```javascript
onGetStarted() {
  // Haptic: Medium
  triggerMediumHaptic();

  // Animation: Slide left exit (300ms)
  navigation.navigate('ProfileSetup', {
    animation: 'slide_from_right',
    duration: 300,
  });
}
```

**Outcome:** Navigate to ProfileSetupScreen

---

#### Action 2: Tap "I already have an account"
```javascript
onSignIn() {
  // Haptic: Light
  triggerLightHaptic();

  // Navigate to login (Future feature)
  navigation.navigate('Login');
}
```

**Outcome:** Navigate to login screen (not part of Story 1.4)

---

### Animations
- **Entry:** Staggered fade-in
  - Logo: 0-400ms (fade + scale 0.9→1)
  - Tagline: 200-500ms (fade + translateY 20→0)
  - CTA: 400-700ms (fade + scale 0.95→1 with spring)

- **Exit:** Slide left (300ms, easeInOut)

---

### Edge Cases
- **Slow device:** Reduce animation complexity (skip stagger, use instant transitions)
- **Accessibility:** Screen reader announces "Welcome to 16BitFit. Step 1 of 3. Get Started button."

---

## Screen 2: ProfileSetupScreen

### Entry Point
- User tapped "GET STARTED" from WelcomeScreen
- OR user tapped "Skip for now" from previous session and returned

### Screen State
```javascript
screenState: {
  step: 2,
  totalSteps: 3,
  username: '',
  displayName: '',
  usernameValid: false,
  usernameTouched: false,
  usernameError: null,
  loading: false,
  showSkipConfirmation: false,
}
```

### Visual Elements
```
╔═══════════════════════════════════════╗
║                                       ║
║         ● ● ○  (Step 2 of 3)          ║
║                                       ║
║                                       ║
║          CREATE PROFILE               ║
║      (Press Start 2P, 24px)           ║
║                                       ║
║   "Choose your unique username and    ║
║    optional display name."            ║
║      (Montserrat, 16px)               ║
║                                       ║
║   ┌───────────────────────────────┐  ║
║   │ Username *                     │  ║
║   │ ┌───────────────────────────┐ │  ║
║   │ │ Enter username...         │ │  ║
║   │ └───────────────────────────┘ │  ║
║   │ 3-20 characters (letters,     │  ║
║   │ numbers, underscore)           │  ║
║   └───────────────────────────────┘  ║
║                                       ║
║   ┌───────────────────────────────┐  ║
║   │ Display Name                   │  ║
║   │ ┌───────────────────────────┐ │  ║
║   │ │ Optional display name...  │ │  ║
║   │ └───────────────────────────┘ │  ║
║   │ This is how others will see   │  ║
║   │ you                            │  ║
║   └───────────────────────────────┘  ║
║                                       ║
║ ══════════════════════════════════════║
║   ┌─────────────────────────────┐    ║
║   │    CREATE ACCOUNT           │    ║
║   │   (Primary CTA, full width) │    ║
║   └─────────────────────────────┘    ║
║                                       ║
║         Skip for now                  ║
║   (Tertiary link, subtle)             ║
╚═══════════════════════════════════════╝
```

### User Actions & Outcomes

---

#### Action 1: Type in Username Field

**Validation Rules:**
```javascript
validateUsername(text) {
  // Length check
  if (text.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' };
  }
  if (text.length > 20) {
    return { valid: false, message: 'Username must be less than 20 characters' };
  }

  // Character check
  if (!/^[a-zA-Z0-9_]+$/.test(text)) {
    return { valid: false, message: 'Only letters, numbers, and underscores allowed' };
  }

  return { valid: true };
}
```

**Real-time Feedback:**
- ✅ Valid: Green checkmark appears on right side of input
- ❌ Invalid: Error text appears below input (on blur)
- ⚠️ Empty: No feedback until blur

---

#### Action 2: Tap "CREATE ACCOUNT"

**Preconditions:**
- Username must be valid (3-20 chars, alphanumeric + underscore)
- Button disabled if username invalid

**Flow:**
```javascript
async onCreateAccount() {
  // 1. Validate
  const validation = validateUsername(username);
  if (!validation.valid) {
    showToast(validation.message, 'error');
    triggerErrorHaptic();
    triggerErrorShake();  // Input field shakes
    return;
  }

  // 2. Set loading state
  setLoading(true);

  // 3. Haptic feedback
  triggerMediumHaptic();

  // 4. API call (simulated)
  try {
    const response = await createProfile({
      username,
      displayName: displayName || null,
    });

    // 5. Success
    setLoading(false);
    triggerSuccessHaptic();
    showToast('Profile created successfully!', 'success');

    // 6. Navigate to next screen
    navigation.navigate('ArchetypeSelection', {
      userId: response.userId,
      animation: 'slide_from_right',
      duration: 300,
    });

  } catch (error) {
    // 7. Error handling
    setLoading(false);
    triggerErrorHaptic();

    if (error.code === 'USERNAME_TAKEN') {
      showToast('Username already taken. Please try another.', 'error');
      setUsernameError('Username already taken');
    } else {
      showToast('Something went wrong. Please try again.', 'error');
    }
  }
}
```

**Success Outcome:** Navigate to ArchetypeSelectionScreen

**Error Outcomes:**
- Username taken → Show error toast + error text below input
- Network error → Show generic error toast
- Validation failed → Show validation error toast + shake animation

---

#### Action 3: Tap "Skip for now"

**Flow:**
```javascript
onSkip() {
  // 1. Show confirmation dialog
  setShowSkipConfirmation(true);
  triggerLightHaptic();
}

// In ConfirmDialog
onConfirmSkip() {
  // 1. Create anonymous profile
  const tempUserId = generateTempUserId();

  // 2. Store in local storage
  await AsyncStorage.setItem('tempUserId', tempUserId);
  await AsyncStorage.setItem('accountDeferred', 'true');

  // 3. Navigate to next screen
  navigation.navigate('ArchetypeSelection', {
    userId: tempUserId,
    deferred: true,
  });
}
```

**Confirmation Dialog:**
```
┌───────────────────────────────────┐
│                                   │
│       SKIP ACCOUNT CREATION?      │
│                                   │
│  You can create an account later  │
│  to save your progress across     │
│  devices.                         │
│                                   │
│  ┌──────────┐    ┌──────────┐   │
│  │  Cancel  │    │  Skip    │   │
│  └──────────┘    └──────────┘   │
│                                   │
└───────────────────────────────────┘
```

**Outcome:** Navigate to ArchetypeSelectionScreen with deferred account flag

---

### Animations
- **Entry:** Slide in from right (300ms, easeOut)
- **Input focus:** Border width 3→4px, color change (150ms)
- **Validation error:** Shake animation (500ms, left-right-left)
- **Loading state:** Button shows spinner, form disabled
- **Exit:** Slide left (300ms, easeInOut)

---

### Edge Cases
- **Keyboard covers CTA:** KeyboardAvoidingView pushes content up
- **Very long display name:** Truncate at 30 characters
- **Special characters in username:** Show error immediately on input
- **Network timeout:** Show retry option after 10 seconds
- **Offline mode:** Show "You're offline" banner, disable "Create Account", allow "Skip"

---

## Screen 3: ArchetypeSelectionScreen

### Entry Point
- User tapped "CREATE ACCOUNT" from ProfileSetupScreen (with account)
- OR User tapped "Skip" from ProfileSetupScreen (deferred account)

### Screen State
```javascript
screenState: {
  step: 3,
  totalSteps: 3,
  userId: '[user-id]',
  deferred: boolean,
  selectedArchetype: null,
  archetypes: [
    { id: 'trainer', name: 'TRAINER', description: 'Balanced fitness...', avatar: '...' },
    { id: 'runner', name: 'RUNNER', description: 'Built for endurance...', avatar: '...' },
    { id: 'yoga', name: 'YOGA', description: 'Focus on flexibility...', avatar: '...' },
    { id: 'bodybuilder', name: 'BODYBUILDER', description: 'Strength and muscle...', avatar: '...' },
    { id: 'cyclist', name: 'CYCLIST', description: 'Cardio and leg strength...', avatar: '...' },
  ],
  loading: false,
}
```

### Visual Elements
```
╔═══════════════════════════════════════╗
║                                       ║
║         ● ● ●  (Step 3 of 3)          ║
║                                       ║
║                                       ║
║        SELECT ARCHETYPE               ║
║      (Press Start 2P, 24px)           ║
║                                       ║
║   "Choose your fitness style. You     ║
║    can change this later."            ║
║      (Montserrat, 16px)               ║
║                                       ║
║   ┌────────┐  ┌────────┐             ║
║   │[Avatar]│  │[Avatar]│             ║
║   │TRAINER │  │ RUNNER │             ║
║   │Balanced│  │Built   │             ║
║   │fitness │  │for end.│             ║
║   └────────┘  └────────┘             ║
║                                       ║
║   ┌────────┐  ┌────────┐             ║
║   │[Avatar]│  │[Avatar]│             ║
║   │  YOGA  │  │BODYBLD │             ║
║   │Focus on│  │Strength│             ║
║   │flex... │  │and mus.│             ║
║   └────────┘  └────────┘             ║
║                                       ║
║      ┌────────┐                       ║
║      │[Avatar]│                       ║
║      │CYCLIST │                       ║
║      │Cardio  │                       ║
║      │and leg │                       ║
║      └────────┘                       ║
║                                       ║
║ ══════════════════════════════════════║
║   ┌─────────────────────────────┐    ║
║   │       CONTINUE              │    ║
║   │  (Primary CTA, disabled     │    ║
║   │   until selection made)     │    ║
║   └─────────────────────────────┘    ║
╚═══════════════════════════════════════╝
```

### User Actions & Outcomes

---

#### Action 1: Tap Archetype Card

**Flow:**
```javascript
onSelectArchetype(archetypeId) {
  // 1. Deselect previous (if any)
  if (selectedArchetype) {
    animateDeselect(selectedArchetype);
  }

  // 2. Select new
  setSelectedArchetype(archetypeId);

  // 3. Animate selection
  animateSelect(archetypeId);
  // - Border: 3→4px
  // - Color: default → highlight
  // - Scale: 1→1.05 (spring)
  // - Shadow: appear with glow

  // 4. Haptic feedback
  triggerMediumHaptic();

  // 5. Show success toast
  const archetype = archetypes.find(a => a.id === archetypeId);
  showToast(`${archetype.name} selected!`, 'success');

  // 6. Enable continue button
  setContinueButtonDisabled(false);
}
```

**Visual Feedback:**
- Selected card: Scale 1.05x, 4px highlight border, neon glow shadow
- Deselected cards: Scale 1.0x, 3px default border, no shadow

---

#### Action 2: Tap "CONTINUE"

**Preconditions:**
- Archetype must be selected
- Button disabled if no selection

**Flow:**
```javascript
async onContinue() {
  if (!selectedArchetype) return;

  // 1. Set loading state
  setLoading(true);

  // 2. Haptic feedback (heavy = success moment)
  triggerHeavyHaptic();

  // 3. Save selection
  try {
    await updateUserProfile({
      userId,
      archetype: selectedArchetype,
    });

    // 4. Success animation (optional)
    // - Brief "level up" style animation
    // - Particle burst from selected card

    // 5. Navigate to next screen
    setLoading(false);
    navigation.navigate('PhotoUpload', {  // Story 1.5
      userId,
      archetype: selectedArchetype,
      animation: 'fade',
      duration: 300,
    });

  } catch (error) {
    // 6. Error handling
    setLoading(false);
    triggerErrorHaptic();
    showToast('Failed to save selection. Please try again.', 'error');
  }
}
```

**Success Outcome:** Navigate to Photo Upload Screen (Story 1.5)

**Error Outcome:** Show error toast, stay on screen, keep selection

---

### Animations
- **Entry:** Slide in from right + staggered card entrance
  - Screen: Slide right (300ms)
  - Cards: Fade + translateY (250ms each, 50ms stagger)
    - Card 1: 0ms delay
    - Card 2: 50ms delay
    - Card 3: 100ms delay
    - Card 4: 150ms delay
    - Card 5: 200ms delay
  - Total animation time: ~450ms

- **Card selection:**
  - Deselect previous: Scale 1.05→1.0, border 4→3px (150ms)
  - Select new: Scale 1.0→1.05, border 3→4px (200ms spring)

- **Exit:** Fade out (300ms, easeOut)

---

### Edge Cases
- **No selection:** Continue button disabled, light gray
- **Tap Continue without selection:** No action (button disabled)
- **Change selection multiple times:** Previous selection animates back, new selection animates in
- **Network error on save:** Show retry option, don't lose selection
- **Offline mode:** Store selection locally, sync when online
- **Very slow device:** Reduce stagger delay from 50ms to 25ms

---

## Decision Tree (Complete Flow)

```
START: App Launch
    │
    ├─ Has completed onboarding? ──YES──► Go to Dashboard
    │
    └─ NO
        │
        ▼
    WelcomeScreen (Step 1/3)
        │
        ├─ [Get Started] ────► ProfileSetupScreen
        │
        └─ [I have account] ─► LoginScreen (Future)
                                    │
    ┌───────────────────────────────┘
    │
    ▼
ProfileSetupScreen (Step 2/3)
    │
    ├─ [Create Account]
    │   │
    │   ├─ Username invalid? ──YES──► Show error, stay on screen
    │   │
    │   └─ NO
    │       │
    │       ├─ Username taken? ──YES──► Show error toast, stay on screen
    │       │
    │       └─ NO ──► Create profile ──► ArchetypeSelectionScreen
    │
    └─ [Skip for now]
        │
        ├─ Show confirmation ──► [Cancel] ──► Stay on screen
        │
        └─ [Skip] ──► Create temp profile ──► ArchetypeSelectionScreen
                            │
    ┌───────────────────────┘
    │
    ▼
ArchetypeSelectionScreen (Step 3/3)
    │
    ├─ No archetype selected ──► Continue button disabled
    │
    └─ Archetype selected
        │
        ├─ [Continue]
        │   │
        │   ├─ Save failed? ──YES──► Show error toast, stay on screen
        │   │
        │   └─ NO ──► Save successful
        │               │
        │               ▼
        │           PhotoUploadScreen (Story 1.5)
        │               │
        │               ▼
        │           Dashboard (Main App)
        │
        └─ [Change selection] ──► Update selection, enable Continue
```

---

## Error States & Recovery

### Network Errors

#### Lost Connection During Profile Creation
```
Error: "No internet connection"
Recovery:
  - Show toast: "You're offline. Please check your connection."
  - Disable "Create Account" button
  - Enable "Skip for now" to continue offline
  - Show offline banner at top of screen
```

#### Timeout During API Call
```
Error: "Request timeout"
Recovery:
  - Show toast: "Request timed out. Please try again."
  - Re-enable form
  - Add "Retry" button
  - Log error for debugging
```

---

### Validation Errors

#### Username Already Taken
```
Error: "Username already taken"
Recovery:
  - Show error toast: "Username already taken. Please try another."
  - Show error text below username input
  - Keep display name value
  - Trigger error shake animation
  - Trigger error haptic
  - Focus username input
```

#### Invalid Characters
```
Error: "Invalid characters"
Recovery:
  - Show error text immediately on input
  - Highlight invalid characters
  - Show helper text: "Only letters, numbers, and underscores allowed"
  - Don't wait for blur event
```

---

### System Errors

#### Device Storage Full
```
Error: "Storage full"
Recovery:
  - Show toast: "Unable to save data. Please free up storage."
  - Disable profile creation
  - Allow user to exit onboarding
  - Prompt to complete onboarding later
```

#### App Crashes During Onboarding
```
Recovery on relaunch:
  - Check AsyncStorage for onboarding progress
  - Resume from last completed step
  - Pre-fill any saved data (username, display name)
  - Show toast: "Welcome back! Let's continue where you left off."
```

---

## Success Metrics (Analytics)

### Key Events to Track

```javascript
// Screen views
analytics.logEvent('onboarding_welcome_viewed');
analytics.logEvent('onboarding_profile_viewed');
analytics.logEvent('onboarding_archetype_viewed');

// User actions
analytics.logEvent('onboarding_get_started_tapped');
analytics.logEvent('onboarding_profile_created', { username_length: 12 });
analytics.logEvent('onboarding_profile_skipped');
analytics.logEvent('onboarding_archetype_selected', { archetype: 'trainer' });
analytics.logEvent('onboarding_completed', {
  duration_seconds: 145,
  account_created: true,
  archetype: 'runner',
});

// Errors
analytics.logEvent('onboarding_error', {
  screen: 'profile_setup',
  error_type: 'username_taken',
});

// Drop-offs
analytics.logEvent('onboarding_abandoned', {
  last_screen: 'archetype_selection',
  duration_seconds: 87,
});
```

### Conversion Funnel
```
Step 1: Welcome Screen viewed        → 100%
Step 2: Profile Setup viewed         → 85%  (15% drop-off)
Step 3: Profile created/skipped      → 75%  (10% drop-off)
Step 4: Archetype Selection viewed   → 75%
Step 5: Archetype selected           → 70%  (5% drop-off)
Step 6: Onboarding completed         → 70%

Target: >65% completion rate
```

---

## Accessibility Flow

### Screen Reader Navigation

#### WelcomeScreen
```
1. "Step 1 of 3"
2. "16BitFit logo"
3. "16BitFit. Heading level 1"
4. "Your fitness journey starts here. Level up your health, one step at a time."
5. "Get Started. Button. Double-tap to activate."
6. "I already have an account. Link. Double-tap to activate."
```

#### ProfileSetupScreen
```
1. "Step 2 of 3"
2. "Create Profile. Heading level 2"
3. "Choose your unique username and optional display name."
4. "Username. Text field. Required. Enter username. 3 to 20 characters."
5. "Helper text: 3-20 characters, letters, numbers, underscore"
6. "Display Name. Text field. Optional. Enter optional display name."
7. "Helper text: This is how others will see you"
8. "Create Account. Button. Double-tap to activate."
9. "Skip for now. Link. Double-tap to activate."
```

#### ArchetypeSelectionScreen
```
1. "Step 3 of 3"
2. "Select Archetype. Heading level 2"
3. "Choose your fitness style. You can change this later."
4. "Trainer. Button. Balanced fitness with variety of exercises. Double-tap to select."
5. "Runner. Button. Built for endurance and speed. Double-tap to select."
6. "Yoga. Button. Focus on flexibility and mindfulness. Double-tap to select."
7. "Bodybuilder. Button. Strength and muscle building focus. Double-tap to select."
8. "Cyclist. Button. Cardio and leg strength specialist. Double-tap to select."
9. "Continue. Button. Disabled. Select an archetype to continue."
   (After selection: "Continue. Button. Double-tap to activate.")
```

---

## Next Steps

1. ✅ **Design Tokens Complete**
2. ✅ **Typography System Complete**
3. ✅ **Animation Specifications Complete**
4. ✅ **Atomic Components Spec Complete**
5. ✅ **Molecular Components Spec Complete**
6. ✅ **Organism Components Spec Complete**
7. ✅ **User Flow Diagram Complete** (This Document)
8. ⏭️ **Screen Specifications** (Detailed pixel-perfect specs)
9. ⏭️ **MagicPath.ai Prompt Library** (All prompts ready to use)
10. ⏭️ **21st.dev/magic Component Prompts** (Component generation library)

---

## Version History
- **v1.0** (2025-10-31): Initial user flow diagram - Complete Story 1.4 journey with decision trees, error states, recovery flows, accessibility, and analytics tracking.

---

**Document Owner:** UI/UX Specialist (Sally)
**Approved By:** Architect (Pending)
**Last Updated:** 2025-10-31
