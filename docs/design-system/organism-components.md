# 16BitFit Organism Components Specification
## Version 1.0 | Component Library - Organisms

This document defines the organism-level components for 16BitFit. Organisms are complex UI components composed of groups of molecules and atoms that form distinct sections of an interface.

**Atomic Design Principle:** Organisms are relatively complex components that combine molecules and atoms into meaningful sections. They can be reused across different templates and pages. For Story 1.4, organisms represent complete screens and major layout patterns.

---

## Component Index

### Screen Organisms (Story 1.4)
1. [WelcomeScreen](#welcomescreen) - Initial onboarding screen
2. [ProfileSetupScreen](#profilesetupscreen) - Username and display name input
3. [ArchetypeSelectionScreen](#archetypeselectionscreen) - Fitness archetype picker

### Layout Organisms (Reusable Templates)
4. [ScreenContainer](#screencontainer) - Base screen wrapper
5. [FormScreen](#formscreen) - Form-based screen template
6. [GridScreen](#gridscreen) - Grid-based selection screen
7. [BottomNavigation](#bottomnavigation) - Bottom tab navigator
8. [HeaderBar](#headerbar) - Top navigation bar

---

## Screen Organisms (Story 1.4)

---

## 1. WelcomeScreen

### Purpose
First screen users see when launching 16BitFit. Introduces the app and provides primary CTA to begin onboarding.

### User Story Context
"As a New User, I want to see a welcoming introduction when I open the app, so I understand what 16BitFit is and can easily begin my fitness journey."

### Visual Specifications

```javascript
welcomeScreen: {
  // Layout
  layout: {
    flex: 1,
    backgroundColor: tokens.background.primary,
    padding: 24,
    justifyContent: 'space-between',  // Space logo/content and CTA
    alignItems: 'center',
  },

  // Logo section (top)
  logoSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },

  // Logo sprite
  logo: {
    size: 96,  // Large retro logo
    marginBottom: 24,
  },

  // App title
  title: {
    fontFamily: 'Press Start 2P',
    fontSize: 32,
    textAlign: 'center',
    color: tokens.text.primary,
    marginBottom: 16,
  },

  // Tagline
  tagline: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    textAlign: 'center',
    color: tokens.text.secondary,
    maxWidth: 300,
  },

  // Content section (middle)
  contentSection: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },

  // Feature list (optional)
  featureList: {
    gap: 16,
    alignItems: 'flex-start',
  },

  // CTA section (bottom)
  ctaSection: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    gap: 16,
    paddingBottom: 40,  // Safe area
  },

  // Primary CTA
  primaryCTA: {
    width: '100%',
    maxWidth: 320,
  },

  // Secondary link
  secondaryLink: {
    marginTop: 16,
  },

  // Progress indicator
  progressIndicator: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
  },
}
```

### Composition
- **ScreenContainer** (base layout)
- **PixelSprite** (app logo, 96×96px)
- **PixelText** (h1 for title, bodyLarge for tagline)
- **PixelButton** (primary CTA: "Get Started")
- **PixelButton** (tertiary: "I already have an account")
- **ProgressIndicator** (Step 1 of 3)

### React Native Implementation

```tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import {
  PixelSprite,
  PixelText,
  PixelButton,
} from '@/components/atoms';
import {
  ProgressIndicator,
} from '@/components/molecules';
import { tokens } from '@/design-system';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSignIn?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onSignIn,
}) => {
  // Staggered entrance animations
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const ctaOpacity = useSharedValue(0);
  const ctaScale = useSharedValue(0.95);

  useEffect(() => {
    // Logo animation (0-400ms)
    logoOpacity.value = withTiming(1, { duration: 400 });
    logoScale.value = withTiming(1, { duration: 400 });

    // Tagline animation (200-500ms, staggered)
    taglineOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
    taglineTranslateY.value = withDelay(200, withTiming(0, { duration: 300 }));

    // CTA animation (400-700ms, staggered)
    ctaOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));
    ctaScale.value = withDelay(400, withSpring(1, {
      damping: 12,
      stiffness: 150,
    }));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const ctaAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ scale: ctaScale.value }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Progress Indicator */}
        <View style={styles.progressIndicator}>
          <ProgressIndicator totalSteps={3} currentStep={1} />
        </View>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Animated.View style={logoAnimatedStyle}>
            <PixelSprite
              source={require('@/assets/logo-96.png')}
              size={96}
            />
          </Animated.View>

          <PixelText variant="h1" align="center" style={styles.title}>
            16BITFIT
          </PixelText>

          <Animated.View style={taglineAnimatedStyle}>
            <PixelText
              variant="bodyLarge"
              align="center"
              color={tokens.text.secondary}
              style={styles.tagline}
            >
              Your fitness journey starts here. Level up your health, one step at a time.
            </PixelText>
          </Animated.View>
        </View>

        {/* CTA Section */}
        <Animated.View style={[styles.ctaSection, ctaAnimatedStyle]}>
          <PixelButton
            onPress={onGetStarted}
            variant="primary"
            fullWidth
            style={styles.primaryCTA}
          >
            GET STARTED
          </PixelButton>

          {onSignIn && (
            <PixelButton
              onPress={onSignIn}
              variant="tertiary"
            >
              I already have an account
            </PixelButton>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.background.primary,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressIndicator: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 10,
  },
  logoSection: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingTop: 80,  // Space for progress indicator
  },
  title: {
    marginBottom: 0,
  },
  tagline: {
    maxWidth: 300,
  },
  ctaSection: {
    flex: 0.4,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    gap: 16,
    paddingBottom: 40,
  },
  primaryCTA: {
    width: '100%',
    maxWidth: 320,
  },
});
```

### Screen Transitions

**Entry:** Fade in with staggered animations
```javascript
entry: {
  logo: { delay: 0, duration: 400 },
  tagline: { delay: 200, duration: 300 },
  cta: { delay: 400, duration: 300 },
}
```

**Exit → Profile Setup:** Slide left with fade
```javascript
exit: {
  type: 'slide',
  direction: 'left',
  duration: 300,
  easing: 'easeInOut',
}
```

### MagicPath.ai Prompt
```
Welcome screen for 16BitFit retro fitness app.
Full screen layout, dark background (#0F380F or #1B2853).
Top: Progress indicator "Step 1 of 3" with 3 dots.
Center: Large 96px pixel art logo, app title "16BITFIT" in Press Start 2P (32px, uppercase), tagline below in Montserrat (18px, gray).
Bottom: Large "GET STARTED" button (full width, bright accent color, 4px border, pixel shadow).
Secondary link below: "I already have an account" (small, underlined, low visual weight).
Staggered entrance animation: logo → tagline → button (200ms delays).
Mobile-first, centered vertical layout.
```

---

## 2. ProfileSetupScreen

### Purpose
Collect username and optional display name from user. First interactive step in onboarding.

### User Story Context
"As a New User, I want to create my basic profile with a username, so I can have a unique identity in the app and start personalizing my experience."

### Visual Specifications

```javascript
profileSetupScreen: {
  // Layout
  layout: {
    flex: 1,
    backgroundColor: tokens.background.primary,
    padding: 24,
  },

  // Scroll container
  scrollView: {
    flex: 1,
  },

  // Content wrapper
  content: {
    paddingTop: 80,  // Space for progress + header
    gap: 24,
  },

  // Header section
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },

  // Title
  title: {
    fontFamily: 'Press Start 2P',
    fontSize: 24,
    textAlign: 'center',
    color: tokens.text.primary,
    marginBottom: 12,
  },

  // Subtitle
  subtitle: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    textAlign: 'center',
    color: tokens.text.secondary,
    maxWidth: 280,
  },

  // Form section
  form: {
    gap: 24,
  },

  // CTA section (sticky bottom)
  ctaSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: tokens.background.primary,
    borderTopWidth: 3,
    borderTopColor: tokens.border.default,
    gap: 12,
  },

  // Progress indicator
  progressIndicator: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
  },
}
```

### Composition
- **ScreenContainer** (base layout with keyboard avoidance)
- **ProgressIndicator** (Step 2 of 3)
- **PixelText** (h2 for title, body for subtitle)
- **FormField** × 2 (username, display name)
- **PixelButton** (primary: "Create Account", secondary: "Skip for now")
- **ToastNotification** (validation errors/success)

### React Native Implementation

```tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  PixelText,
  PixelButton,
} from '@/components/atoms';
import {
  FormField,
  ProgressIndicator,
  ToastNotification,
} from '@/components/molecules';
import { tokens } from '@/design-system';

interface ProfileSetupScreenProps {
  onContinue: (data: { username: string; displayName?: string }) => void;
  onSkip: () => void;
  onBack?: () => void;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  onContinue,
  onSkip,
  onBack,
}) => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

  const validateUsername = (text: string) => {
    if (text.length === 0) {
      return { valid: false };
    }
    if (text.length < 3) {
      return { valid: false, message: 'Username must be at least 3 characters' };
    }
    if (text.length > 20) {
      return { valid: false, message: 'Username must be less than 20 characters' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(text)) {
      return { valid: false, message: 'Only letters, numbers, and underscores allowed' };
    }
    return { valid: true };
  };

  const handleContinue = async () => {
    const validation = validateUsername(username);

    if (!validation.valid) {
      setToastMessage(validation.message || 'Please enter a valid username');
      setToastVariant('error');
      setToastVisible(true);
      return;
    }

    setIsLoading(true);
    triggerMediumHaptic();

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onContinue({ username, displayName: displayName || undefined });
    }, 1000);
  };

  const handleSkip = () => {
    triggerLightHaptic();
    onSkip();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Progress Indicator */}
        <View style={styles.progressIndicator}>
          <ProgressIndicator totalSteps={3} currentStep={2} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <PixelText variant="h2" align="center">
              CREATE PROFILE
            </PixelText>
            <PixelText
              variant="body"
              align="center"
              color={tokens.text.secondary}
              style={styles.subtitle}
            >
              Choose your unique username and optional display name.
            </PixelText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <FormField
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username..."
              helperText="3-20 characters (letters, numbers, underscore)"
              validate={validateUsername}
              required
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
            />

            <FormField
              label="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Optional display name..."
              helperText="This is how others will see you"
              autoCapitalize="words"
              maxLength={30}
            />
          </View>
        </ScrollView>

        {/* CTA Section (Sticky Bottom) */}
        <View style={styles.ctaSection}>
          <PixelButton
            onPress={handleContinue}
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={username.length < 3}
          >
            CREATE ACCOUNT
          </PixelButton>

          <PixelButton
            onPress={handleSkip}
            variant="tertiary"
            disabled={isLoading}
          >
            Skip for now
          </PixelButton>
        </View>

        {/* Toast Notification */}
        <ToastNotification
          message={toastMessage}
          variant={toastVariant}
          visible={toastVisible}
          onDismiss={() => setToastVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  progressIndicator: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 80,
    paddingBottom: 180,  // Space for sticky CTA
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  subtitle: {
    maxWidth: 280,
    marginTop: 12,
  },
  form: {
    gap: 24,
  },
  ctaSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: tokens.background.primary,
    borderTopWidth: 3,
    borderTopColor: tokens.border.default,
    gap: 12,
  },
});
```

### Screen Transitions

**Entry:** Slide in from right
```javascript
entry: {
  type: 'slide',
  direction: 'right',
  duration: 300,
  easing: 'easeOut',
}
```

**Exit → Archetype Selection:** Slide left
```javascript
exit: {
  type: 'slide',
  direction: 'left',
  duration: 300,
  easing: 'easeInOut',
}
```

### MagicPath.ai Prompt
```
Profile setup screen for 16BitFit.
Top: Progress indicator "Step 2 of 3".
Header: Title "CREATE PROFILE" (Press Start 2P, 24px, center), subtitle below (Montserrat, 16px, gray, center).
Form: Two input fields stacked vertically.
  1. Username field: Label "Username *" (required), terminal-style input (3px border, no border-radius), helper text "3-20 characters (letters, numbers, underscore)", real-time validation with error shake animation.
  2. Display Name field: Label "Display Name" (optional), same input style, helper text "This is how others will see you".
Bottom (sticky): Large "CREATE ACCOUNT" button (full width, primary color, disabled if invalid), "Skip for now" link below (subtle, small).
Keyboard-aware scrolling, form padding for safe area.
Mobile portrait layout.
```

---

## 3. ArchetypeSelectionScreen

### Purpose
Display 5 fitness archetypes (Trainer, Runner, Yoga, Bodybuilder, Cyclist) as selectable cards. User chooses one to personalize fitness experience.

### User Story Context
"As a New User, I want to select a fitness archetype that matches my goals, so the app can tailor my experience and provide relevant content."

### Visual Specifications

```javascript
archetypeSelectionScreen: {
  // Layout
  layout: {
    flex: 1,
    backgroundColor: tokens.background.primary,
    padding: 24,
  },

  // Scroll container
  scrollView: {
    flex: 1,
  },

  // Content wrapper
  content: {
    paddingTop: 80,
    paddingBottom: 180,  // Space for sticky CTA
  },

  // Header section
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },

  // Title
  title: {
    fontFamily: 'Press Start 2P',
    fontSize: 24,
    textAlign: 'center',
    color: tokens.text.primary,
    marginBottom: 12,
  },

  // Subtitle
  subtitle: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    textAlign: 'center',
    color: tokens.text.secondary,
    maxWidth: 300,
  },

  // Grid section
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
  },

  // CTA section (sticky bottom)
  ctaSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: tokens.background.primary,
    borderTopWidth: 3,
    borderTopColor: tokens.border.default,
  },

  // Progress indicator
  progressIndicator: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
  },
}
```

### Composition
- **ScreenContainer** (base layout)
- **ProgressIndicator** (Step 3 of 3)
- **PixelText** (h2 for title, body for subtitle)
- **ArchetypeCard** × 5 (grid of selectable cards)
- **PixelButton** (primary: "Continue", disabled until selection)
- **ToastNotification** (success on selection)

### React Native Implementation

```tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  PixelText,
  PixelButton,
} from '@/components/atoms';
import {
  ArchetypeCard,
  ProgressIndicator,
  ToastNotification,
  LoadingSpinner,
} from '@/components/molecules';
import { tokens } from '@/design-system';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface Archetype {
  id: string;
  name: string;
  description: string;
  avatar: any;
}

const ARCHETYPES: Archetype[] = [
  {
    id: 'trainer',
    name: 'TRAINER',
    description: 'Balanced fitness with variety of exercises',
    avatar: require('@/assets/sprites/trainer-80.png'),
  },
  {
    id: 'runner',
    name: 'RUNNER',
    description: 'Built for endurance and speed',
    avatar: require('@/assets/sprites/runner-80.png'),
  },
  {
    id: 'yoga',
    name: 'YOGA',
    description: 'Focus on flexibility and mindfulness',
    avatar: require('@/assets/sprites/yoga-80.png'),
  },
  {
    id: 'bodybuilder',
    name: 'BODYBUILDER',
    description: 'Strength and muscle building focus',
    avatar: require('@/assets/sprites/bodybuilder-80.png'),
  },
  {
    id: 'cyclist',
    name: 'CYCLIST',
    description: 'Cardio and leg strength specialist',
    avatar: require('@/assets/sprites/cyclist-80.png'),
  },
];

interface ArchetypeSelectionScreenProps {
  onContinue: (archetypeId: string) => void;
  onBack?: () => void;
}

export const ArchetypeSelectionScreen: React.FC<ArchetypeSelectionScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Staggered card entrance animations
  const cardOpacities = ARCHETYPES.map(() => useSharedValue(0));
  const cardTranslateYs = ARCHETYPES.map(() => useSharedValue(30));

  useEffect(() => {
    // Stagger card entrances (50ms delay each)
    cardOpacities.forEach((opacity, index) => {
      opacity.value = withDelay(index * 50, withTiming(1, { duration: 250 }));
    });
    cardTranslateYs.forEach((translateY, index) => {
      translateY.value = withDelay(index * 50, withTiming(0, { duration: 250 }));
    });
  }, []);

  const handleSelectArchetype = (id: string) => {
    setSelectedArchetype(id);
    setToastVisible(true);
    triggerMediumHaptic();
  };

  const handleContinue = async () => {
    if (!selectedArchetype) return;

    setIsLoading(true);
    triggerHeavyHaptic();

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onContinue(selectedArchetype);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Progress Indicator */}
        <View style={styles.progressIndicator}>
          <ProgressIndicator totalSteps={3} currentStep={3} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <PixelText variant="h2" align="center">
              SELECT ARCHETYPE
            </PixelText>
            <PixelText
              variant="body"
              align="center"
              color={tokens.text.secondary}
              style={styles.subtitle}
            >
              Choose your fitness style. You can change this later.
            </PixelText>
          </View>

          {/* Archetype Grid */}
          <View style={styles.grid}>
            {ARCHETYPES.map((archetype, index) => {
              const animatedStyle = useAnimatedStyle(() => ({
                opacity: cardOpacities[index].value,
                transform: [{ translateY: cardTranslateYs[index].value }],
              }));

              return (
                <Animated.View key={archetype.id} style={animatedStyle}>
                  <ArchetypeCard
                    id={archetype.id}
                    name={archetype.name}
                    description={archetype.description}
                    avatarSource={archetype.avatar}
                    selected={selectedArchetype === archetype.id}
                    onSelect={handleSelectArchetype}
                  />
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>

        {/* CTA Section (Sticky Bottom) */}
        <View style={styles.ctaSection}>
          <PixelButton
            onPress={handleContinue}
            variant="primary"
            fullWidth
            disabled={!selectedArchetype || isLoading}
            loading={isLoading}
          >
            CONTINUE
          </PixelButton>
        </View>

        {/* Toast Notification */}
        <ToastNotification
          message={`${ARCHETYPES.find(a => a.id === selectedArchetype)?.name} selected!`}
          variant="success"
          visible={toastVisible}
          duration={2000}
          onDismiss={() => setToastVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.background.primary,
  },
  container: {
    flex: 1,
  },
  progressIndicator: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 80,
    paddingBottom: 180,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  subtitle: {
    maxWidth: 300,
    marginTop: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  ctaSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: tokens.background.primary,
    borderTopWidth: 3,
    borderTopColor: tokens.border.default,
  },
});
```

### Screen Transitions

**Entry:** Slide in from right with staggered cards
```javascript
entry: {
  screen: {
    type: 'slide',
    direction: 'right',
    duration: 300,
  },
  cards: {
    stagger: 50,  // 50ms delay between each card
    duration: 250,
    opacity: [0, 1],
    translateY: [30, 0],
  },
}
```

**Exit → Dashboard (Story 1.5):** Fade out with success animation
```javascript
exit: {
  type: 'fade',
  duration: 300,
  easing: 'easeOut',
}
```

### MagicPath.ai Prompt
```
Archetype selection screen for 16BitFit.
Top: Progress indicator "Step 3 of 3".
Header: Title "SELECT ARCHETYPE" (Press Start 2P, 24px, center), subtitle "Choose your fitness style. You can change this later." (Montserrat, 16px, gray, center).
Grid: 5 archetype cards in 2-column grid (2-2-1 layout), centered.
Each card: 160×200px, 80×80px pixel art avatar at top, archetype name below (Press Start 2P, 16px, uppercase), 2-line description (Montserrat, 12px, gray). 3px border (4px + glow when selected).
Cards: Trainer, Runner, Yoga, Bodybuilder, Cyclist.
Staggered entrance: cards fade + slide up with 50ms delay between each.
Bottom (sticky): Large "CONTINUE" button (full width, disabled until selection, primary color).
Toast notification on selection: "[Archetype] selected!" (green, top of screen, auto-dismiss 2s).
Mobile portrait, scrollable content.
```

---

## Layout Organisms (Reusable Templates)

---

## 4. ScreenContainer

### Purpose
Base wrapper for all screens providing consistent padding, safe areas, and background.

### Visual Specifications

```javascript
screenContainer: {
  flex: 1,
  backgroundColor: tokens.background.primary,
  paddingHorizontal: 24,
  paddingTop: 'safe-area-top',
  paddingBottom: 'safe-area-bottom',
}
```

### React Native Implementation

```tsx
import React from 'react';
import { View, StyleSheet, SafeAreaView, ViewStyle } from 'react-native';
import { tokens } from '@/design-system';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  noPadding = false,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, noPadding && styles.noPadding, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.background.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  noPadding: {
    paddingHorizontal: 0,
  },
});
```

---

## 5. FormScreen

### Purpose
Template for form-based screens with keyboard avoidance and sticky CTA.

### React Native Implementation

```tsx
import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { tokens } from '@/design-system';

interface FormScreenProps {
  children: React.ReactNode;
  ctaSection?: React.ReactNode;
  showProgressIndicator?: boolean;
  progressIndicator?: React.ReactNode;
}

export const FormScreen: React.FC<FormScreenProps> = ({
  children,
  ctaSection,
  showProgressIndicator = false,
  progressIndicator,
}) => {
  return (
    <ScreenContainer noPadding>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {showProgressIndicator && progressIndicator && (
          <View style={styles.progressIndicator}>
            {progressIndicator}
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        {ctaSection && (
          <View style={styles.ctaSection}>
            {ctaSection}
          </View>
        )}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  progressIndicator: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 80,
    paddingBottom: 180,
  },
  ctaSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: tokens.background.primary,
    borderTopWidth: 3,
    borderTopColor: tokens.border.default,
  },
});
```

---

## 6. GridScreen

### Purpose
Template for grid-based selection screens (archetype selection, item grids).

### React Native Implementation

```tsx
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { tokens } from '@/design-system';

interface GridScreenProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  ctaSection?: React.ReactNode;
  columns?: 2 | 3 | 4;
  gap?: number;
  showProgressIndicator?: boolean;
  progressIndicator?: React.ReactNode;
}

export const GridScreen: React.FC<GridScreenProps> = ({
  header,
  children,
  ctaSection,
  columns = 2,
  gap = 16,
  showProgressIndicator = false,
  progressIndicator,
}) => {
  return (
    <ScreenContainer noPadding>
      {showProgressIndicator && progressIndicator && (
        <View style={styles.progressIndicator}>
          {progressIndicator}
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {header && <View style={styles.header}>{header}</View>}

        <View style={[styles.grid, { gap }]}>
          {children}
        </View>
      </ScrollView>

      {ctaSection && (
        <View style={styles.ctaSection}>
          {ctaSection}
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  progressIndicator: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 80,
    paddingBottom: 180,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: tokens.background.primary,
    borderTopWidth: 3,
    borderTopColor: tokens.border.default,
  },
});
```

---

## 7. BottomNavigation

### Purpose
Bottom tab navigation bar for primary app sections (future feature, post Story 1.4).

### Visual Specifications

```javascript
bottomNavigation: {
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    backgroundColor: tokens.background.elevated,
    borderTopWidth: 3,
    borderTopColor: tokens.border.default,
    paddingBottom: 'safe-area-bottom',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  icon: {
    size: 24,
  },

  label: {
    fontSize: 10,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },

  activeTab: {
    color: tokens.interactive.primary,
  },

  inactiveTab: {
    color: tokens.text.tertiary,
    opacity: 0.6,
  },
}
```

---

## 8. HeaderBar

### Purpose
Top navigation bar with back button, title, and optional actions.

### Visual Specifications

```javascript
headerBar: {
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: tokens.background.primary,
    borderBottomWidth: 3,
    borderBottomColor: tokens.border.default,
  },

  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },

  centerSection: {
    flex: 2,
    alignItems: 'center',
  },

  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },

  title: {
    fontFamily: 'Press Start 2P',
    fontSize: 16,
    textAlign: 'center',
    color: tokens.text.primary,
  },

  backButton: {
    width: 48,
    height: 48,
  },
}
```

### React Native Implementation

```tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PixelText, PixelIcon } from '@/components/atoms';
import { tokens } from '@/design-system';

interface HeaderBarProps {
  title?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  onBack,
  rightAction,
}) => {
  return (
    <View style={styles.container}>
      {/* Left: Back Button */}
      <View style={styles.leftSection}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <PixelIcon
              name="arrow-left"
              size={24}
              color={tokens.text.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Center: Title */}
      <View style={styles.centerSection}>
        {title && (
          <PixelText variant="h3" align="center" style={styles.title}>
            {title}
          </PixelText>
        )}
      </View>

      {/* Right: Action */}
      <View style={styles.rightSection}>
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: tokens.background.primary,
    borderBottomWidth: 3,
    borderBottomColor: tokens.border.default,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    marginBottom: 0,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

---

## Navigation Flow (Story 1.4)

```
WelcomeScreen
    ↓ [Get Started] (slide left, 300ms)
ProfileSetupScreen
    ↓ [Create Account] (slide left, 300ms)
ArchetypeSelectionScreen
    ↓ [Continue] (fade, 300ms)
(Story 1.5: Photo Upload Screen)
```

### React Navigation Setup

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  WelcomeScreen,
  ProfileSetupScreen,
  ArchetypeSelectionScreen,
} from '@/screens/onboarding';

const Stack = createNativeStackNavigator();

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="ArchetypeSelection" component={ArchetypeSelectionScreen} />
    </Stack.Navigator>
  );
};
```

---

## Accessibility Summary

All organism components MUST:
- ✅ **SafeAreaView** for proper inset handling
- ✅ **KeyboardAvoidingView** for form screens
- ✅ **ScrollView** with `keyboardShouldPersistTaps="handled"`
- ✅ **Screen reader navigation** with proper focus order
- ✅ **Haptic feedback** on major actions
- ✅ **Loading states** with spinners and disabled buttons
- ✅ **Error handling** with toast notifications
- ✅ **Back navigation** support with swipe gestures

---

## Performance Considerations

### Optimization Strategies
1. **useNativeDriver: true** for all transform/opacity animations
2. **React.memo** for card components to prevent unnecessary re-renders
3. **FlatList** instead of ScrollView for large grids (>20 items)
4. **Image optimization**: Use compressed PNG-8 for sprites (<50KB each)
5. **Staggered animations**: Limit to 5-10 items to avoid jank
6. **Skeleton loading**: Show placeholders during data fetch

### Memory Management
```tsx
// Cleanup animations on unmount
useEffect(() => {
  return () => {
    // Cancel any pending animations
    opacity.value = withTiming(0, { duration: 0 });
  };
}, []);
```

---

## Next Steps

1. ✅ **Design Tokens Complete**
2. ✅ **Typography System Complete**
3. ✅ **Animation Specifications Complete**
4. ✅ **Atomic Components Spec Complete**
5. ✅ **Molecular Components Spec Complete**
6. ✅ **Organism Components Spec Complete** (This Document)
7. ⏭️ **User Flow Diagram** (Visual flowchart of Story 1.4)
8. ⏭️ **Screen Specifications** (Detailed mockups + measurements)
9. ⏭️ **MagicPath.ai Prompt Library** (All prompts in one place)
10. ⏭️ **21st.dev/magic Component Prompts** (Ready-to-use component generation)

---

## Version History
- **v1.0** (2025-10-31): Initial organism components specification - 3 complete Story 1.4 screens + 5 reusable layout templates with React Native implementations, navigation flow, performance optimization.

---

**Document Owner:** UI/UX Specialist (Sally)
**Approved By:** Architect (Pending)
**Last Updated:** 2025-10-31
