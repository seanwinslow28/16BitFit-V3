# Interaction Patterns
## 16BitFit V3 - Story 1.4: Onboarding Profile Flow

**Document Version**: 1.0
**Last Updated**: 2025-10-31
**Focus**: Micro-interactions, feedback, state transitions, haptics

---

## Overview

This document catalogs every interactive moment in the onboarding flow, defining precise timing, visual feedback, haptic response, and audio cues. These patterns establish the "feel" of 16BitFit—snappy, responsive, and satisfying.

**Design Philosophy**: Every interaction should feel tactile and rewarding, like pressing physical buttons on a Game Boy.

---

## Core Interaction Principles

### 1. Immediate Feedback (The 100ms Rule)
- **User action → Visual response** must happen in <100ms
- Even if processing takes longer, show *something* immediately
- Examples: Button press scale, input field glow, spinner appears

### 2. Clear Affordances
- Interactive elements **look** interactive (borders, shadows, hover states)
- Disabled states are visually distinct (50% opacity, no shadow)
- Focus states are obvious (thicker border, glow, scale)

### 3. Forgiving Interactions
- Large touch targets (44×44px minimum)
- Generous hit areas (extend beyond visual bounds)
- Undo/cancel options for destructive actions

### 4. Celebration Moments
- Success states are rewarding (animation + haptic + sound)
- Progress is visible (step indicators, loading states)
- Achievements feel earned (epic animations for milestones)

---

## Interaction Pattern Catalog

### Pattern 1: Button Press (Primary CTA)

**Trigger**: User taps primary button (e.g., "GET STARTED", "CREATE ACCOUNT")

**Visual Response**:
```typescript
// State: DEFAULT → PRESSED → RELEASED → DEFAULT
const buttonPressAnimation = {
  states: {
    default: {
      scale: 1.0,
      shadowOffset: { x: 4, y: 4 },
      shadowOpacity: 0.4,
      borderWidth: 4,
    },
    pressed: {
      scale: 0.95,
      shadowOffset: { x: 2, y: 2 },
      shadowOpacity: 0.2,
      borderWidth: 4,
    },
  },
  transitions: {
    'default → pressed': {
      duration: 100,
      easing: Easing.in(Easing.cubic),
    },
    'pressed → default': {
      duration: 150,
      easing: Easing.out(Easing.cubic),
      overshoot: 1.05, // Brief scale to 1.05 before settling at 1.0
    },
  },
};
```

**Haptic Response**:
- **Timing**: Fires immediately on press (not on release)
- **Pattern**: `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)`
- **Duration**: ~20ms

**Audio Response** (Optional):
- **Sound**: `button-press.wav` (8-bit blip, 50ms)
- **Volume**: 40% of system volume
- **Trigger**: On press, not release

**Implementation**:
```typescript
import { Haptics } from 'expo-haptics';
import { Audio } from 'expo-av';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const PixelButton = ({ onPress, children, ...props }) => {
  const scale = useSharedValue(1);
  const shadowOffset = useSharedValue(4);

  const [sound, setSound] = useState<Audio.Sound>();

  useEffect(() => {
    Audio.Sound.createAsync(require('./button-press.wav'))
      .then(({ sound }) => setSound(sound));

    return () => sound?.unloadAsync();
  }, []);

  const handlePressIn = () => {
    // Immediate feedback
    scale.value = withTiming(0.95, { duration: 100, easing: Easing.in(Easing.cubic) });
    shadowOffset.value = withTiming(2, { duration: 100 });

    // Haptic
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Audio
    sound?.replayAsync();
  };

  const handlePressOut = () => {
    // Overshoot animation
    scale.value = withSequence(
      withTiming(1.05, { duration: 75, easing: Easing.out(Easing.cubic) }),
      withTiming(1.0, { duration: 75, easing: Easing.inOut(Easing.cubic) })
    );
    shadowOffset.value = withTiming(4, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOffset: {
      width: shadowOffset.value,
      height: shadowOffset.value,
    },
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};
```

**Usage**: All primary/secondary buttons (PixelButton component)

---

### Pattern 2: Card Selection (Archetype Cards)

**Trigger**: User taps archetype card to select fitness style

**Visual Response**:
```typescript
const cardSelectionAnimation = {
  states: {
    unselected: {
      scale: 1.0,
      borderWidth: 3,
      borderColor: tokens.border.default,
      shadowOpacity: 0,
    },
    selected: {
      scale: 1.05,
      borderWidth: 4,
      borderColor: tokens.border.highlight,
      shadowOpacity: 0.6,
      shadowColor: tokens.interactive.primary,
      shadowRadius: 12,
    },
  },
  transitions: {
    'unselected → selected': {
      duration: 200,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1), // Spring with overshoot
    },
    'selected → unselected': {
      duration: 150,
      easing: Easing.out(Easing.cubic),
    },
  },
};
```

**Checkmark Badge**:
- Appears in top-right corner of selected card
- **Animation**: Scale from 0 → 1.2 → 1.0 (spring)
- **Timing**: Starts 100ms after card scale begins
- **Icon**: 24×24px checkmark circle, `#9BBC0F` fill

**Haptic Response**:
- **Pattern**: `Haptics.selectionAsync()` (light, 10ms)
- **Timing**: Fires on selection change (both select and deselect)

**Audio Response**:
- **Select**: `select.wav` (8-bit chime, ascending)
- **Deselect**: `deselect.wav` (8-bit blip, descending)

**Deselection Behavior**:
- When another card is tapped, previously selected card smoothly deselects
- **Stagger**: Deselect starts 50ms before new selection (feels natural)

**Implementation**:
```typescript
const ArchetypeCard = ({ id, selected, onSelect, ...props }) => {
  const scale = useSharedValue(selected ? 1.05 : 1.0);
  const borderWidth = useSharedValue(selected ? 4 : 3);
  const shadowOpacity = useSharedValue(selected ? 0.6 : 0);
  const checkmarkScale = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    if (selected) {
      // Selection animation
      scale.value = withTiming(1.05, { duration: 200, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
      borderWidth.value = withTiming(4, { duration: 200 });
      shadowOpacity.value = withTiming(0.6, { duration: 200 });

      // Checkmark appears 100ms after card starts scaling
      checkmarkScale.value = withDelay(
        100,
        withSequence(
          withTiming(1.2, { duration: 100 }),
          withTiming(1.0, { duration: 100 })
        )
      );

      // Haptic + Audio
      Haptics.selectionAsync();
      playSound('select');
    } else {
      // Deselection animation
      scale.value = withTiming(1.0, { duration: 150 });
      borderWidth.value = withTiming(3, { duration: 150 });
      shadowOpacity.value = withTiming(0, { duration: 150 });
      checkmarkScale.value = withTiming(0, { duration: 100 });

      Haptics.selectionAsync();
      playSound('deselect');
    }
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: borderWidth.value,
    shadowOpacity: shadowOpacity.value,
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
    opacity: checkmarkScale.value, // Fade in as it scales
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={() => onSelect(id)}>
        {/* Card content */}
        {selected && (
          <Animated.View style={[styles.checkmarkBadge, checkmarkStyle]}>
            <PixelIcon name="checkmark" size={16} />
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
```

**Usage**: ArchetypeSelectionScreen (Step 3/3)

---

### Pattern 3: Form Input Focus/Blur

**Trigger**: User taps text input field or focuses via keyboard

**Visual Response**:
```typescript
const inputFocusAnimation = {
  states: {
    default: {
      borderColor: tokens.border.default,
      borderWidth: 3,
      shadowOpacity: 0,
    },
    focused: {
      borderColor: tokens.interactive.primary,
      borderWidth: 4,
      shadowOpacity: 0.3,
      shadowColor: tokens.interactive.primary,
      shadowRadius: 8,
    },
    error: {
      borderColor: tokens.status.error,
      borderWidth: 4,
      shadowOpacity: 0,
    },
    success: {
      borderColor: tokens.status.success,
      borderWidth: 4,
      shadowOpacity: 0,
    },
  },
  transitions: {
    'default → focused': { duration: 200, easing: Easing.out(Easing.cubic) },
    'focused → default': { duration: 150, easing: Easing.inOut(Easing.cubic) },
    'focused → error': { duration: 100 },
  },
};
```

**Label Animation**:
- Placeholder text fades out as user types (opacity 1 → 0)
- Label stays visible above input at all times (don't float)

**Cursor Blink**:
- Use system default cursor (React Native TextInput handles this)
- Color: `tokens.interactive.primary` (#8BAC0F)

**Haptic Response**:
- **Focus**: `Haptics.selectionAsync()` (light, 10ms)
- **Blur**: None

**Validation Timing**:
- **On blur** (user leaves field): Validate and show error if invalid
- **On submit**: Validate all fields, focus first error
- **Real-time validation**: Only show success checkmark, not errors

**Implementation**:
```typescript
const PixelInput = ({ value, onChangeText, error, success, ...props }) => {
  const borderColor = useSharedValue(tokens.border.default);
  const borderWidth = useSharedValue(3);
  const shadowOpacity = useSharedValue(0);

  const handleFocus = () => {
    borderColor.value = withTiming(tokens.interactive.primary, { duration: 200 });
    borderWidth.value = withTiming(4, { duration: 200 });
    shadowOpacity.value = withTiming(0.3, { duration: 200 });

    Haptics.selectionAsync();
  };

  const handleBlur = () => {
    if (error) {
      borderColor.value = withTiming(tokens.status.error, { duration: 100 });
    } else if (success) {
      borderColor.value = withTiming(tokens.status.success, { duration: 100 });
    } else {
      borderColor.value = withTiming(tokens.border.default, { duration: 150 });
    }

    borderWidth.value = withTiming(error || success ? 4 : 3, { duration: 150 });
    shadowOpacity.value = withTiming(0, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    borderWidth: borderWidth.value,
    shadowOpacity: shadowOpacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </Animated.View>
  );
};
```

**Usage**: ProfileSetupScreen form fields

---

### Pattern 4: Form Validation Error (Shake Animation)

**Trigger**: User submits form with invalid field(s)

**Visual Response**:
```typescript
const errorShakeAnimation = {
  keyframes: [
    { translateX: 0, duration: 0 },
    { translateX: -10, duration: 50 },
    { translateX: 10, duration: 50 },
    { translateX: -8, duration: 50 },
    { translateX: 8, duration: 50 },
    { translateX: -4, duration: 50 },
    { translateX: 4, duration: 50 },
    { translateX: 0, duration: 50 },
  ],
  totalDuration: 350,
};
```

**Border Color Change**:
- Simultaneously change border to error color (red)
- Border width: 3 → 4px
- Duration: 100ms (happens before shake)

**Error Text Appearance**:
- Fades in below input field (opacity 0 → 1)
- Slides down 8px (translateY -8 → 0)
- Duration: 200ms
- Timing: Starts with shake animation

**Haptic Response**:
- **Pattern**: `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)`
- **Duration**: ~30ms (longer, more intense)
- **Timing**: Fires at start of shake

**Audio Response**:
- **Sound**: `error.wav` (8-bit "wrong" buzzer)
- **Volume**: 50% of system volume

**Focus Management**:
- After shake completes, auto-focus the invalid field
- Delay: 400ms (after shake finishes)

**Implementation**:
```typescript
const PixelInput = ({ error, ...props }) => {
  const translateX = useSharedValue(0);
  const prevError = useRef(error);

  useEffect(() => {
    // Only shake on new error (not if error was already showing)
    if (error && !prevError.current) {
      // Shake animation
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-4, { duration: 50 }),
        withTiming(4, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );

      // Haptic + Audio
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      playSound('error');
    }

    prevError.current = error;
  }, [error]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {/* Input + error text */}
    </Animated.View>
  );
};
```

**Usage**: All form validation errors

---

### Pattern 5: Success Confirmation (Form Submit)

**Trigger**: User successfully submits profile (username created)

**Visual Response (Multi-stage)**:

**Stage 1: Button State Change (0-100ms)**
```typescript
{
  buttonText: 'CREATE ACCOUNT' → 'CREATING...',
  spinner: appears next to text,
  scale: 0.98, // Slight press-in
  opacity: 0.8,
  disabled: true,
}
```

**Stage 2: Success State (after server response, ~500ms)**
```typescript
{
  buttonText: 'CREATING...' → '✓ CREATED',
  spinner: fades out,
  backgroundColor: tokens.status.success,
  scale: 1.0 → 1.05 → 1.0, // Bounce
  duration: 400,
}
```

**Stage 3: Confetti Burst (800ms total)**
```typescript
{
  particles: 20,
  colors: [tokens.dmg.lightest, tokens.dmg.light, tokens.dmg.dark],
  startPosition: button center,
  spread: radial, 360°,
  velocity: 200px/s,
  gravity: 300px/s²,
  fadeOut: true,
  duration: 800,
}
```

**Stage 4: Screen Transition (1000ms after success)**
```typescript
{
  transition: 'slide-left',
  duration: 300,
  destination: 'ArchetypeSelectionScreen',
}
```

**Haptic Response (Sequence)**:
1. **Submit press**: Medium impact (20ms)
2. **Success**: Success pattern (0ms, 50ms, 50ms, 100ms - triple pulse)
3. **Screen transition**: Light impact (10ms)

**Audio Response**:
- **Loading**: Subtle loop `loading-loop.wav` (quiet, 60bpm)
- **Success**: `success-fanfare.wav` (8-bit melody, 800ms)

**Implementation**:
```typescript
const handleCreateAccount = async () => {
  // Stage 1: Loading
  setButtonState('loading');

  try {
    const response = await createProfile(username, displayName);

    if (response.success) {
      // Stage 2: Success state
      setButtonState('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playSound('success-fanfare');

      // Stage 3: Confetti
      triggerConfetti();

      // Stage 4: Navigate
      setTimeout(() => {
        navigation.navigate('ArchetypeSelection');
      }, 1000);
    }
  } catch (error) {
    setButtonState('error');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    playSound('error');
  }
};
```

**Usage**: ProfileSetupScreen submit, ArchetypeSelectionScreen submit

---

### Pattern 6: Screen Transition (Navigation)

**Trigger**: User navigates between onboarding steps

**Forward Navigation (Step 1 → 2, 2 → 3)**:
```typescript
const forwardTransition = {
  type: 'slide',
  direction: 'left', // New screen slides in from right
  duration: 300,
  easing: Easing.out(Easing.cubic),
  outgoingScreen: {
    translateX: 0 → -100, // Slides off to left
    opacity: 1.0 → 0.8, // Slight fade
  },
  incomingScreen: {
    translateX: 100 → 0, // Slides in from right
    opacity: 0.9 → 1.0,
  },
};
```

**Backward Navigation (Step 2 → 1, 3 → 2)**:
```typescript
const backwardTransition = {
  type: 'slide',
  direction: 'right', // Previous screen slides in from left
  duration: 250, // Slightly faster than forward
  easing: Easing.inOut(Easing.cubic),
  outgoingScreen: {
    translateX: 0 → 100, // Slides off to right
    opacity: 1.0 → 0.8,
  },
  incomingScreen: {
    translateX: -50 → 0, // Slides in from left (less distance)
    opacity: 1.0, // Already fully visible
  },
};
```

**Progress Indicator Update**:
- Updates simultaneously with screen transition
- Dot fill animates from empty → filled (200ms)
- Timing: Starts 100ms after transition begins

**Haptic Response**:
- **Forward**: Light impact (10ms) at transition start
- **Backward**: Selection async (10ms) at transition start

**Audio Response** (Optional):
- **Forward**: `advance.wav` (8-bit ascending tone, 150ms)
- **Backward**: `back.wav` (8-bit descending tone, 150ms)

**React Navigation Configuration**:
```typescript
import { TransitionPresets } from '@react-navigation/stack';

const Stack = createStackNavigator();

<Stack.Navigator
  screenOptions={{
    ...TransitionPresets.SlideFromRightIOS, // iOS default
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    transitionSpec: {
      open: {
        animation: 'timing',
        config: { duration: 300, easing: Easing.out(Easing.cubic) },
      },
      close: {
        animation: 'timing',
        config: { duration: 250, easing: Easing.inOut(Easing.cubic) },
      },
    },
  }}
>
  <Stack.Screen name="Welcome" component={WelcomeScreen} />
  <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
  <Stack.Screen name="ArchetypeSelection" component={ArchetypeSelectionScreen} />
</Stack.Navigator>
```

**Usage**: All onboarding screen transitions

---

### Pattern 7: Toast Notification (Transient Feedback)

**Trigger**: System event requiring user notification (error, success, info)

**Visual Response**:
```typescript
const toastAnimation = {
  entrance: {
    translateY: -100 → 0, // Slides down from top
    opacity: 0 → 1,
    scale: 0.95 → 1.0,
    duration: 300,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1), // Spring
  },
  exit: {
    translateY: 0 → -100, // Slides back up
    opacity: 1 → 0,
    duration: 250,
    easing: Easing.in(Easing.cubic),
  },
  duration: {
    error: 5000, // 5 seconds (user needs time to read)
    success: 3000, // 3 seconds (quicker)
    info: 4000, // 4 seconds
  },
};
```

**Toast Variants**:
```typescript
const toastStyles = {
  error: {
    backgroundColor: tokens.status.error,
    borderColor: tokens.status.errorDark,
    icon: 'error-circle',
    iconColor: '#FFFFFF',
  },
  success: {
    backgroundColor: tokens.status.success,
    borderColor: tokens.status.successDark,
    icon: 'checkmark-circle',
    iconColor: '#FFFFFF',
  },
  info: {
    backgroundColor: tokens.border.default,
    borderColor: tokens.dmg.dark,
    icon: 'info-circle',
    iconColor: tokens.dmg.lightest,
  },
};
```

**Positioning**:
- **Top of screen**: 64pt from top (below status bar + safe area)
- **Width**: Screen width - 32pt (16pt margin each side)
- **Height**: Auto (min 64px, max 120px)
- **Z-index**: 9999 (above all content)

**Dismiss Behavior**:
1. **Auto-dismiss**: Fades out after duration
2. **Swipe-up**: User can swipe up to dismiss early (velocity threshold: 500px/s)
3. **Tap to dismiss**: Tap anywhere on toast to dismiss

**Haptic Response**:
- **Error**: Notification error (30ms)
- **Success**: Notification success (30ms)
- **Info**: Selection (10ms)

**Audio Response**:
- **Error**: `error.wav`
- **Success**: `success-short.wav` (200ms chime)
- **Info**: None

**Queue Behavior**:
- If multiple toasts triggered, queue them (don't stack)
- Max queue: 3 toasts (drop oldest if more)
- Delay between toasts: 200ms

**Implementation**:
```typescript
import { Notifier, Easing } from 'react-native-notifier';

const showToast = (message: string, type: 'error' | 'success' | 'info') => {
  Notifier.showNotification({
    title: message,
    Component: PixelToast, // Custom component
    componentProps: { type },
    duration: type === 'error' ? 5000 : type === 'success' ? 3000 : 4000,
    showAnimationDuration: 300,
    hideAnimationDuration: 250,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    onPress: () => Notifier.hideNotification(),
    swipeEnabled: true,
  });

  // Haptic + Audio
  if (type === 'error') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    playSound('error');
  } else if (type === 'success') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playSound('success-short');
  } else {
    Haptics.selectionAsync();
  }
};

// Usage
showToast('Username already taken. Try another!', 'error');
showToast('Profile created successfully!', 'success');
```

**Usage**: Form errors, network errors, success confirmations

---

### Pattern 8: Loading State (Skeleton/Spinner)

**Trigger**: Data is loading, screen is not yet ready

**Skeleton Approach (Preferred)**:
```typescript
const skeletonAnimation = {
  shimmer: {
    gradient: [
      { color: tokens.dmg.dark, position: 0 },
      { color: tokens.dmg.light, position: 0.5 },
      { color: tokens.dmg.dark, position: 1 },
    ],
    translateX: -200 → 200, // Moves across skeleton shapes
    duration: 1500,
    loop: true,
    easing: Easing.linear,
  },
};
```

**Spinner Approach (Fallback)**:
```typescript
const spinnerAnimation = {
  rotation: 0 → 360,
  duration: 1000,
  loop: true,
  easing: Easing.linear,
};

const spinnerStyle = {
  size: 32,
  color: tokens.interactive.primary,
  borderWidth: 4,
  style: 'circular', // or 'dots' for 8-bit style
};
```

**When to Use**:
- **Skeleton**: Initial screen load, list of items loading
- **Spinner**: Button loading state (inline), quick operations (<2s)
- **Progress Bar**: File upload, multi-step process with known duration

**Reduced Motion**:
- Disable shimmer animation
- Show static gray placeholders
- Spinner: Rotate slowly (2s duration instead of 1s)

**Implementation**:
```typescript
import { Skeleton } from 'moti/skeleton';

const SkeletonCard = () => (
  <Skeleton
    colorMode="light"
    colors={[tokens.dmg.dark, tokens.dmg.light, tokens.dmg.dark]}
    width={160}
    height={200}
    radius={0} // Sharp corners for pixel aesthetic
  />
);

// Usage
{isLoading ? (
  <SkeletonCard />
) : (
  <ArchetypeCard {...props} />
)}
```

**Usage**: Any loading state in onboarding flow

---

### Pattern 9: Disabled State (Unmet Requirements)

**Trigger**: Button/action is not yet available (e.g., no archetype selected)

**Visual Response**:
```typescript
const disabledState = {
  opacity: 0.4,
  backgroundColor: tokens.dmg.dark, // Grayed out
  borderColor: tokens.border.disabled,
  cursor: 'not-allowed',
  shadowOpacity: 0, // No shadow
};
```

**Interaction Behavior**:
- **No press animation**: Button doesn't respond to touch
- **No haptic**: No feedback on press attempt
- **Optional tooltip**: Show reason why disabled (e.g., "Select an archetype first")

**Tooltip Implementation**:
```typescript
const DisabledButtonWithTooltip = ({ disabled, disabledReason, ...props }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDisabledPress = () => {
    if (disabled) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  return (
    <>
      <PixelButton
        disabled={disabled}
        onPress={disabled ? handleDisabledPress : props.onPress}
        {...props}
      />
      {showTooltip && (
        <PixelTooltip position="above" text={disabledReason} />
      )}
    </>
  );
};
```

**Usage**: "Continue" button on ArchetypeSelectionScreen (until selection made)

---

### Pattern 10: Empty State (No Content Yet)

**Trigger**: User reaches screen with no data (edge case in onboarding)

**Visual Response**:
```typescript
const emptyState = {
  icon: 'pixel-sprite', // Sad Game Boy character
  iconSize: 80,
  title: 'NOTHING HERE YET',
  titleFont: 'Press Start 2P',
  titleSize: 24,
  description: 'Complete the previous steps first.',
  descriptionFont: 'Montserrat',
  descriptionSize: 16,
  cta: 'GO BACK',
  ctaVariant: 'secondary',
};
```

**Animation**:
- Icon: Gentle floating animation (2s loop, translateY ±8px)
- Text: Staggered fade-in (icon → title → description → CTA)

**Usage**: Rare in onboarding, but good pattern for later app screens

---

## Haptic Feedback Reference

### iOS Haptic Patterns

```typescript
import * as Haptics from 'expo-haptics';

// Impact Styles (collision-like feedback)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);   // 10ms - subtle
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);  // 20ms - standard
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);   // 30ms - strong

// Notification Styles (system-level feedback)
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Triple pulse
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); // Double pulse
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);   // Sharp buzz

// Selection Style (picker/toggle feedback)
Haptics.selectionAsync(); // 10ms - light, quick
```

### Android Haptic Patterns

```typescript
import { Vibration, Platform } from 'react-native';

// Simple vibration
Vibration.vibrate(20); // Duration in ms

// Pattern: [wait, vibrate, wait, vibrate, ...]
Vibration.vibrate([0, 10, 50, 20]); // Success pattern

// Cross-platform wrapper
const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
  if (Platform.OS === 'ios') {
    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } else {
    // Android fallback
    switch (type) {
      case 'light':
        Vibration.vibrate(10);
        break;
      case 'medium':
        Vibration.vibrate(20);
        break;
      case 'heavy':
        Vibration.vibrate(30);
        break;
      case 'success':
        Vibration.vibrate([0, 10, 50, 10, 50, 20]);
        break;
      case 'error':
        Vibration.vibrate([0, 30, 100, 30]);
        break;
    }
  }
};
```

---

## Audio Feedback Reference

### 8-Bit Sound Library

**Required Sound Assets** (all <50KB, `.wav` format):

| File | Duration | Use Case |
|------|----------|----------|
| `button-press.wav` | 50ms | Button tap |
| `select.wav` | 100ms | Card selection (ascending chime) |
| `deselect.wav` | 100ms | Card deselection (descending blip) |
| `error.wav` | 200ms | Validation error (buzzer) |
| `success-short.wav` | 200ms | Quick success (single chime) |
| `success-fanfare.wav` | 800ms | Profile created (melody) |
| `advance.wav` | 150ms | Forward navigation (ascending) |
| `back.wav` | 150ms | Backward navigation (descending) |
| `loading-loop.wav` | 2000ms | Loading state (subtle loop) |

**Audio Implementation**:
```typescript
import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';

const useSound = (soundFile: string) => {
  const sound = useRef<Audio.Sound>();

  useEffect(() => {
    Audio.Sound.createAsync(soundFile).then(({ sound: loadedSound }) => {
      sound.current = loadedSound;
    });

    return () => {
      sound.current?.unloadAsync();
    };
  }, [soundFile]);

  const play = async () => {
    await sound.current?.replayAsync();
  };

  return { play };
};

// Usage
const { play: playButtonPress } = useSound(require('./button-press.wav'));

<PixelButton onPress={() => {
  playButtonPress();
  handlePress();
}}>
  GET STARTED
</PixelButton>
```

**Volume Levels**:
- UI sounds: 40% of system volume
- Success fanfares: 60% of system volume
- Error sounds: 50% of system volume
- Background loops: 20% of system volume

**Settings**:
- Allow users to disable sound effects in app settings
- Check system "Silent Mode" before playing sounds

---

## State Transition Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ ONBOARDING FLOW - STATE TRANSITIONS                            │
└─────────────────────────────────────────────────────────────────┘

[WelcomeScreen]
    │
    ├─→ [Get Started] → (slide-left, 300ms) → [ProfileSetupScreen]
    │
    └─→ [Skip for now] → (fade, 200ms) → [Dashboard] (temp profile)

[ProfileSetupScreen]
    │
    ├─→ [Create Account]
    │     │
    │     ├─→ (validation passes) → (loading, 500ms) → (success, 400ms)
    │     │                          → (navigate, 300ms) → [ArchetypeSelectionScreen]
    │     │
    │     └─→ (validation fails) → (shake, 350ms) → (stay on screen)
    │
    ├─→ [Skip for now] → (fade, 200ms) → [ArchetypeSelectionScreen] (temp profile)
    │
    └─→ [Back] → (slide-right, 250ms) → [WelcomeScreen]

[ArchetypeSelectionScreen]
    │
    ├─→ [Select Archetype]
    │     │
    │     └─→ (card animation, 200ms) → (checkmark, 100ms) → (enable Continue button)
    │
    ├─→ [Continue]
    │     │
    │     └─→ (success, 400ms) → (confetti, 800ms) → (navigate, 300ms) → [Dashboard]
    │
    └─→ [Back] → (slide-right, 250ms) → [ProfileSetupScreen]
```

---

## Performance Considerations

### Animation Performance Checklist

- [ ] **Use `useNativeDriver: true`** for all transform/opacity animations
  - ✅ Good: `scale`, `translateX/Y`, `opacity`, `rotate`
  - ❌ Bad: `width`, `height`, `backgroundColor`, `borderWidth` (requires `useNativeDriver: false`)

- [ ] **Avoid animating layout properties**
  - Use `transform` instead of `left/top`
  - Use `scale` instead of `width/height`

- [ ] **Limit concurrent animations**
  - Max 3-4 simultaneous animations per screen
  - Stagger complex animations (don't start all at once)

- [ ] **Optimize gesture handlers**
  - Use `react-native-gesture-handler` (not built-in Touchables)
  - Cache animated values with `useMemo`

- [ ] **Test on low-end devices**
  - Target: iPhone SE 2nd gen, Samsung Galaxy A series
  - Minimum: 60fps for critical interactions, 30fps acceptable for decorative animations

### Memory Management

```typescript
// Clean up animations on unmount
useEffect(() => {
  return () => {
    animationRef.current?.cancel();
    soundRef.current?.unloadAsync();
  };
}, []);

// Preload sounds on mount (don't load on every press)
useEffect(() => {
  Audio.Sound.createAsync(require('./button-press.wav'))
    .then(({ sound }) => setSoundObject(sound));
}, []);
```

---

## Reduced Motion Support

### Detecting Reduced Motion

```typescript
import { AccessibilityInfo } from 'react-native';
import { useEffect, useState } from 'react';

const useReducedMotion = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
      setReduceMotion(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      enabled => setReduceMotion(enabled)
    );

    return () => subscription.remove();
  }, []);

  return reduceMotion;
};

// Usage
const reduceMotion = useReducedMotion();
const animationDuration = reduceMotion ? 100 : 300;
const animationScale = reduceMotion ? [1, 1] : [0.95, 1.05, 1.0];
```

### Reduced Motion Alternatives

| Original Animation | Reduced Motion Alternative |
|--------------------|---------------------------|
| Staggered fade-in (300ms each) | Instant fade-in (100ms all at once) |
| Bouncy spring (overshoot) | Linear ease-out (no overshoot) |
| Parallax scroll | Static background |
| Card flip (3D) | Instant swap (200ms fade) |
| Confetti burst | Simple checkmark (no particles) |
| Skeleton shimmer | Static gray placeholders |

---

## Testing Interaction Patterns

### Manual Testing Checklist

- [ ] **Tap all buttons** - Verify press animation fires immediately (<100ms)
- [ ] **Select all archetypes** - Verify selection animation + deselection animation
- [ ] **Focus all inputs** - Verify focus glow appears
- [ ] **Trigger all errors** - Verify shake + error text + haptic
- [ ] **Complete success flow** - Verify confetti + haptic + sound
- [ ] **Navigate forward/back** - Verify slide transitions smooth
- [ ] **Show toast notifications** - Verify entrance/exit animations
- [ ] **Test on slow device** - iPhone SE, Galaxy A series (maintain 60fps)
- [ ] **Test with Reduce Motion ON** - Verify simplified animations
- [ ] **Test with Sound OFF** - App still functional without audio

### Automated Testing (Jest)

```typescript
import { render, fireEvent } from '@testing-library/react-native';

describe('PixelButton Interaction', () => {
  it('triggers haptic feedback on press', () => {
    const mockHaptic = jest.spyOn(Haptics, 'impactAsync');
    const { getByText } = render(<PixelButton>Press Me</PixelButton>);

    fireEvent.press(getByText('Press Me'));

    expect(mockHaptic).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
  });

  it('shows loading state after press', async () => {
    const { getByText, findByText } = render(<PixelButton onPress={asyncAction}>Submit</PixelButton>);

    fireEvent.press(getByText('Submit'));

    expect(await findByText('LOADING...')).toBeTruthy();
  });
});
```

---

## Summary

**Interaction Patterns Defined**: 10 core patterns covering all onboarding interactions
**Haptic Library**: 5 iOS patterns + Android fallbacks
**Audio Library**: 9 sound effects (8-bit retro style)
**Performance**: Optimized for 60fps with `useNativeDriver: true`
**Accessibility**: Full Reduced Motion support for all animations

**Next Steps**:
1. Implement core patterns in reusable components
2. Create sound asset library (9 `.wav` files)
3. Build haptic feedback utilities
4. Test on range of devices (high-end + low-end)
5. User test for "feel" feedback

---

*Document 12 of 12 Complete*
*All Design System Documentation Complete!*
