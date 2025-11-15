This is the complete implementation of the 16BitFit onboarding flow, including all screens, navigation, context, and associated test files, adhering strictly to the provided design system, atomic components, and requirements.

---

## **Implementation Files**

---

═══════════════════════════════════════════════════════════ FILE 1/12: apps/mobile-shell/src/screens/onboarding/OnboardingContext.tsx ═══════════════════════════════════════════════════════════

TypeScript  
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define the available archetype IDs  
export type ArchetypeId \= 'trainer' | 'runner' | 'yogi' | 'builder' | 'cyclist';

interface OnboardingState {  
  currentStep: 1 | 2 | 3;  
  username: string | null;  
  displayName: string | null;  
  selectedArchetype: ArchetypeId | null;  
}

// Interface matching the requirements specified in the prompt  
interface OnboardingContextValue extends OnboardingState {  
  setUsername: (username: string | null) \=\> void;  
  setDisplayName: (name: string | null) \=\> void;  
  selectArchetype: (archetypeId: ArchetypeId) \=\> void;  
  nextStep: () \=\> void;  
  previousStep: () \=\> void;  
  setCurrentStep: (step: 1 | 2 | 3\) \=\> void; // Added for flexibility on screen mount  
  completeOnboarding: () \=\> Promise\<void\>;  
}

const OnboardingContext \= createContext\<OnboardingContextValue | undefined\>(undefined);

const initialState: OnboardingState \= {  
  currentStep: 1,  
  username: null,  
  displayName: null,  
  selectedArchetype: null,  
};

export const OnboardingProvider: React.FC\<{ children: ReactNode }\> \= ({ children }) \=\> {  
  const \[state, setState\] \= useState\<OnboardingState\>(initialState);

  const setUsername \= useCallback((username: string | null) \=\> {  
    setState(prev \=\> ({ ...prev, username }));  
  }, \[\]);

  const setDisplayName \= useCallback((name: string | null) \=\> {  
    // Normalize empty string or whitespace-only string to null  
    const normalizedName \= name?.trim() \=== '' ? null : name;  
    setState(prev \=\> ({ ...prev, displayName: normalizedName }));  
  }, \[\]);

  const selectArchetype \= useCallback((archetypeId: ArchetypeId) \=\> {  
    setState(prev \=\> ({ ...prev, selectedArchetype: archetypeId }));  
  }, \[\]);

  const nextStep \= useCallback(() \=\> {  
    setState(prev \=\> ({ ...prev, currentStep: Math.min(prev.currentStep \+ 1, 3\) as 1 | 2 | 3 }));  
  }, \[\]);

  const previousStep \= useCallback(() \=\> {  
    setState(prev \=\> ({ ...prev, currentStep: Math.max(prev.currentStep \- 1, 1\) as 1 | 2 | 3 }));  
  }, \[\]);

  const setCurrentStep \= useCallback((step: 1 | 2 | 3\) \=\> {  
    setState(prev \=\> ({ ...prev, currentStep: step }));  
  }, \[\]);

  const completeOnboarding \= useCallback(async () \=\> {  
    // TODO: Implement persistence logic (e.g., Supabase/Firebase auth and profile creation)  
    console.log('Onboarding process finalizing. State:', state);

    if (\!state.selectedArchetype) {  
      console.error('Error: Cannot complete onboarding without an archetype.');  
      // Throwing an error allows the UI layer to catch it and provide feedback.  
      throw new Error('Archetype selection required.');  
    }

    // Placeholder for asynchronous operation (e.g., API call)  
    await new Promise(resolve \=\> setTimeout(resolve, 500));

    console.log('User profile created (simulated). Navigation to main app should follow.');  
    // Navigation to the main app stack is typically handled by the root navigator based on auth state changes.  
  }, \[state\]);

  return (  
    \<OnboardingContext.Provider  
      value={{  
        ...state,  
        setUsername,  
        setDisplayName,  
        selectArchetype,  
        nextStep,  
        previousStep,  
        setCurrentStep,  
        completeOnboarding,  
      }}  
    \>  
      {children}  
    \</OnboardingContext.Provider\>  
  );  
};

/\*\*  
 \* Hook to access the onboarding state and actions.  
 \* @throws Error if used outside of OnboardingProvider.  
 \*/  
export const useOnboarding \= (): OnboardingContextValue \=\> {  
  const context \= useContext(OnboardingContext);  
  if (context \=== undefined) {  
    throw new Error('useOnboarding must be used within an OnboardingProvider');  
  }  
  return context;  
};

USAGE NOTES:

* Manages the shared state and progression logic for the onboarding flow.  
* Includes both `nextStep`/`previousStep` and `setCurrentStep` for flexible flow control.  
* `completeOnboarding` includes placeholder logic; this must be replaced with actual backend integration.

═══════════════════════════════════════════════════════════ FILE 2/12: apps/mobile-shell/src/screens/onboarding/components/ProgressIndicator.tsx ═══════════════════════════════════════════════════════════

TypeScript  
import React from 'react';  
import { View, StyleSheet } from 'react-native';  
import { tokens } from '@/design-system';  
import { PixelText } from '@/components/atoms';

interface ProgressIndicatorProps {  
  currentStep: number;  
  totalSteps: number;  
}

/\*\*  
 \* Renders a retro-style progress indicator using square pixels (■ ■ □ Step 2 of 3).  
 \*/  
const ProgressIndicator: React.FC\<ProgressIndicatorProps\> \= React.memo(({ currentStep, totalSteps }) \=\> {  
  const renderDots \= () \=\> {  
    const dots \= \[\];  
    for (let i \= 1; i \<= totalSteps; i++) {  
      const isActive \= i \<= currentStep;  
      dots.push(  
        \<View  
          key={\`step-${i}\`}  
          style={\[  
            styles.dot,  
            isActive ? styles.dotActive : styles.dotInactive  
          \]}  
          accessibilityLabel={\`Step ${i} ${isActive ? 'completed' : 'pending'}\`}  
        /\>  
      );  
    }  
    return dots;  
  };

  return (  
    \<View style={styles.container} accessibilityRole="progressbar" aria-valuemax={totalSteps} aria-valuenow={currentStep}\>  
      \<View style={styles.dotsContainer}\>  
        {renderDots()}  
      \</View\>  
      \<PixelText variant="caption" colorKey="secondary"\>  
        {\`Step ${currentStep} of ${totalSteps}\`}  
      \</PixelText\>  
    \</View\>  
  );  
});

const DOT\_SIZE \= 8; // Matches tokens.spacing\[2\]

const styles \= StyleSheet.create({  
  container: {  
    flexDirection: 'row',  
    alignItems: 'center',  
    justifyContent: 'center', // Centered alignment based on mockups  
    paddingVertical: tokens.spacing\[3\], // 16pt  
    // Assuming background.primary is the light green color from the mockups (\#9BBC0F)  
    backgroundColor: tokens.colors.background.primary,  
  },  
  dotsContainer: {  
    flexDirection: 'row',  
    marginRight: tokens.spacing\[2\], // 8pt gap between dots and text  
  },  
  dot: {  
    width: DOT\_SIZE,  
    height: DOT\_SIZE,  
    // Pure retro aesthetic (tokens.border.radius \= 0\)  
    marginHorizontal: tokens.spacing\[1\], // 4pt gap between dots  
  },  
  dotActive: {  
    // Darkest color for active dots  
    backgroundColor: tokens.colors.text.primary, // \#0F380F  
  },  
  dotInactive: {  
    // Medium color with an outline for inactive dots  
    backgroundColor: tokens.colors.background.elevated, // \#8BAC0F  
    borderWidth: tokens.border.width.pixel,  
    borderColor: tokens.colors.border.default, // \#306230  
  },  
});

export default ProgressIndicator;

USAGE NOTES:

* Used at the top of every onboarding screen.  
* Uses square pixels and centered alignment to match the retro aesthetic shown in the mockups.

═══════════════════════════════════════════════════════════ FILE 3/12: apps/mobile-shell/src/screens/onboarding/WelcomeScreen.tsx ═══════════════════════════════════════════════════════════

TypeScript  
import React, { useCallback, useEffect, useRef } from 'react';  
import { View, StyleSheet, StatusBar, Animated } from 'react-native';  
import { SafeAreaView } from 'react-native-safe-area-context';  
import { useNavigation } from '@react-navigation/native';  
import { StackNavigationProp } from '@react-navigation/stack';

import { PixelButton, PixelText, PixelSprite } from '@/components/atoms';  
import { tokens, durations, easings } from '@/design-system';  
import ProgressIndicator from './components/ProgressIndicator';  
import { OnboardingStackParamList } from './OnboardingNavigator';  
import { useOnboarding } from './OnboardingContext';

// Placeholder logo asset. Replace with require('@/assets/logo-96.png')  
const logoSource \= { uri: 'https://via.placeholder.com/96x96/8BAC0F/0F380F?text=16BIT' };

type WelcomeScreenNavigationProp \= StackNavigationProp\<OnboardingStackParamList, 'Welcome'\>;

const WelcomeScreen: React.FC \= () \=\> {  
  const navigation \= useNavigation\<WelcomeScreenNavigationProp\>();  
  const { setCurrentStep } \= useOnboarding();

  // Animation setup  
  const fadeAnim \= useRef(new Animated.Value(0)).current;  
  const slideAnim \= useRef(new Animated.Value(50)).current;

  useEffect(() \=\> {  
    // Ensure context step is correct when screen mounts  
    setCurrentStep(1);

    // Staggered entrance animation  
    Animated.parallel(\[  
      Animated.timing(fadeAnim, {  
        toValue: 1,  
        duration: durations.slow, // 500ms  
        easing: easings.easeOut,  
        useNativeDriver: true,  
      }),  
      Animated.timing(slideAnim, {  
        toValue: 0,  
        duration: durations.moderate, // 300ms  
        easing: easings.snappy,  
        useNativeDriver: true,  
      }),  
    \]).start();  
  }, \[fadeAnim, slideAnim, setCurrentStep\]);

  const handleGetStarted \= useCallback(() \=\> {  
    navigation.navigate('ProfileSetup');  
  }, \[navigation\]);

  const handleLogin \= useCallback(() \=\> {  
    // Placeholder for navigation to the actual Login screen  
    console.log('Navigate to LoginScreen (Placeholder)');  
    // navigation.navigate('AuthStack', { screen: 'Login' });  
  }, \[\]);

  return (  
    \<SafeAreaView style={styles.safeArea}\>  
      {/\* Assuming background.primary is light green, barStyle should be dark-content \*/}  
      \<StatusBar barStyle="dark-content" backgroundColor={tokens.colors.background.primary} /\>  
      \<ProgressIndicator currentStep={1} totalSteps={3} /\>

      \<View style={styles.container}\>  
        {/\* Main Content Area \*/}  
        \<Animated.View style={\[styles.content, { opacity: fadeAnim, transform: \[{ translateY: slideAnim }\] }\]}\>  
            
          {/\* Explicit Spacer: 80pt (tokens.spacing\[9\]) as required by layout spec \*/}  
          \<View style={{ height: tokens.spacing\[9\] }} /\>

          \<View style={styles.hero}\>  
            \<PixelSprite  
              source={logoSource}  
              size={96}  
              alt="16BitFit Logo \- a pixelated dumbbell icon"  
            /\>  
            \<View style={styles.titleContainer}\>  
              \<PixelText variant="h1" align="center" colorKey="primary"\>  
                16BITFIT  
              \</PixelText\>  
            \</View\>  
            \<PixelText variant="body" align="center" colorKey="secondary"\>  
              Your fitness journey starts here. Level up your health, one step at a time.  
            \</PixelText\>  
          \</View\>  
        \</Animated.View\>

        {/\* Call to Action Area (Bottom aligned) \*/}  
        \<View style={styles.ctaContainer}\>  
          \<PixelButton  
            variant="primary"  
            onPress={handleGetStarted}  
            accessibilityLabel="Get Started"  
            accessibilityHint="Navigates to the profile creation screen"  
          \>  
            GET STARTED  
          \</PixelButton\>  
          \<View style={styles.secondaryCta}\>  
            \<PixelButton  
              variant="tertiary"  
              onPress={handleLogin}  
              accessibilityLabel="Log In"  
              accessibilityHint="Navigates to the login screen for existing users"  
            \>  
              I already have an account  
            \</PixelButton\>  
          \</View\>  
        \</View\>  
      \</View\>  
    \</SafeAreaView\>  
  );  
};

const styles \= StyleSheet.create({  
  safeArea: {  
    flex: 1,  
    // Assuming background.primary is the light green (\#9BBC0F)  
    backgroundColor: tokens.colors.background.primary,  
  },  
  container: {  
    flex: 1,  
    paddingHorizontal: tokens.component.screenPaddingX, // 24pt  
    justifyContent: 'space-between', // Pushes content to top and CTA to bottom  
  },  
  content: {  
    // Content starts after the initial spacer  
  },  
  hero: {  
    alignItems: 'center',  
  },  
  titleContainer: {  
    marginTop: tokens.spacing\[4\], // 24pt gap  
    marginBottom: tokens.spacing\[3\], // 16pt gap  
  },  
  ctaContainer: {  
    paddingBottom: tokens.spacing\[6\], // 40pt bottom padding  
  },  
  secondaryCta: {  
    marginTop: tokens.spacing\[3\], // 16pt gap  
  },  
});

export default WelcomeScreen;

USAGE NOTES:

* Implements the layout as specified in the design mockup, including the explicit 80pt top spacer.  
* Includes a subtle entrance animation using the native driver.  
* Uses placeholder assets for the logo.

═══════════════════════════════════════════════════════════ FILE 4/12: apps/mobile-shell/src/screens/onboarding/ProfileSetupScreen.tsx ═══════════════════════════════════════════════════════════

TypeScript  
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';  
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';  
import { SafeAreaView } from 'react-native-safe-area-context';  
import { useNavigation } from '@react-navigation/native';  
import { StackNavigationProp } from '@react-navigation/stack';

import { PixelButton, PixelText, PixelInput } from '@/components/atoms';  
import { tokens } from '@/design-system';  
import ProgressIndicator from './components/ProgressIndicator';  
import { OnboardingStackParamList } from './OnboardingNavigator';  
import { useOnboarding } from './OnboardingContext';

type ProfileSetupScreenNavigationProp \= StackNavigationProp\<OnboardingStackParamList, 'ProfileSetup'\>;

const USERNAME\_REGEX \= /^\[a-zA-Z0-9\_\]+$/;  
const DEBOUNCE\_DELAY \= 300; // ms

// Validation function (pure)  
const validateUsername \= (text: string): string | null \=\> {  
    if (\!text) return 'Username is required';  
    if (text.length \< 3\) return 'Username must be at least 3 characters';  
    if (text.length \> 20\) return 'Username must be 20 characters or less';  
    if (\!USERNAME\_REGEX.test(text)) return 'Only letters, numbers, and underscores allowed';  
    return null;  
};

const ProfileSetupScreen: React.FC \= () \=\> {  
  const navigation \= useNavigation\<ProfileSetupScreenNavigationProp\>();  
  const {  
    username: contextUsername,  
    displayName: contextDisplayName,  
    setUsername,  
    setDisplayName,  
    setCurrentStep,  
    nextStep  
  } \= useOnboarding();

  // Local state for inputs, initialized from context  
  const \[username, setUsernameLocal\] \= useState(contextUsername || '');  
  const \[displayName, setDisplayNameLocal\] \= useState(contextDisplayName || '');  
  const \[usernameError, setUsernameError\] \= useState\<string | null\>(null);  
  const \[isPristine, setIsPristine\] \= useState(true); // Tracks if user has typed yet

  const validationTimeoutRef \= useRef\<NodeJS.Timeout | null\>(null);

  useEffect(() \=\> {  
    setCurrentStep(2);  
  }, \[setCurrentStep\]);

  // Debounced validation implementation using setTimeout and useRef  
  const debouncedValidation \= useCallback((text: string) \=\> {  
    if (validationTimeoutRef.current) {  
      clearTimeout(validationTimeoutRef.current);  
    }  
    validationTimeoutRef.current \= setTimeout(() \=\> {  
      const error \= validateUsername(text);  
      setUsernameError(error);  
    }, DEBOUNCE\_DELAY);  
  }, \[\]);

  const handleUsernameChange \= useCallback((text: string) \=\> {  
    setIsPristine(false);  
    setUsernameLocal(text);  
    debouncedValidation(text);  
  }, \[debouncedValidation\]);

  const handleDisplayNameChange \= useCallback((text: string) \=\> {  
    // Enforce soft limit of 50 characters  
    if (text.length \<= 50\) {  
        setDisplayNameLocal(text);  
    }  
  }, \[\]);

  // Determine form validity  
  const isFormValid \= useMemo(() \=\> {  
    // Valid if username is present AND there are no errors currently displayed (debounced result)  
    return username.length \> 0 && \!usernameError;  
  }, \[usernameError, username\]);

  // Handle submission  
  const handleCreateAccount \= useCallback(() \=\> {  
    // Final synchronous validation check before submitting  
    const error \= validateUsername(username);  
    if (error) {  
        setUsernameError(error);  
        setIsPristine(false);  
        // PixelInput will automatically shake if the error prop changes  
        return;  
    }

    // Check if the debounced state also agrees it's valid  
    if (isFormValid) {  
      setUsername(username);  
      setDisplayName(displayName || null);  
      nextStep();  
      navigation.navigate('ArchetypeSelection');  
    }  
  }, \[username, displayName, isFormValid, navigation, setUsername, setDisplayName, nextStep\]);

  const handleSkip \= useCallback(() \=\> {  
    // Deferred auth  
    setUsername(null);  
    setDisplayName(null);  
    nextStep();  
    navigation.navigate('ArchetypeSelection');  
  }, \[navigation, setUsername, setDisplayName, nextStep\]);

  // Cleanup timeout on unmount  
  useEffect(() \=\> {  
    return () \=\> {  
      if (validationTimeoutRef.current) {  
        clearTimeout(validationTimeoutRef.current);  
      }  
    };  
  }, \[\]);

  return (  
    \<SafeAreaView style={styles.safeArea}\>  
      \<ProgressIndicator currentStep={2} totalSteps={3} /\>  
      \<KeyboardAvoidingView  
        style={styles.keyboardView}  
        behavior={Platform.OS \=== 'ios' ? 'padding' : 'height'}  
      \>  
        \<ScrollView contentContainerStyle={styles.scrollContent}\>  
          \<View style={styles.header}\>  
            \<PixelText variant="h2" align="center" colorKey="primary"\>  
              CREATE PROFILE  
            \</PixelText\>  
             \<PixelText variant="bodySmall" align="center" colorKey="secondary" style={styles.subtitle}\>  
                Choose your unique username and optional display name.  
            \</PixelText\>  
          \</View\>

          \<View style={styles.form}\>  
            \<PixelInput  
              label="Username \*"  
              value={username}  
              onChangeText={handleUsernameChange}  
              placeholder="Enter username..."  
              // Show error only after interaction and if an error exists  
              error={\!isPristine && \!\!usernameError ? usernameError : false}  
              // Show success if form is valid and user has interacted  
              success={\!isPristine && isFormValid}  
              accessibilityLabel="Username Input"  
              accessibilityHint="Required. 3-20 characters. Letters, numbers, and underscores only."  
              autoCapitalize="none"  
              autoCorrect={false}  
              helperText="3-20 characters"  
            /\>

            \<View style={styles.inputSpacer} /\>

            \<PixelInput  
              label="Display Name"  
              value={displayName}  
              onChangeText={handleDisplayNameChange}  
              placeholder="Optional"  
              accessibilityLabel="Display Name Input"  
              accessibilityHint="Optional. How others will see you. Max 50 characters."  
              maxLength={50}  
              helperText="How others see you"  
            /\>  
          \</View\>  
        \</ScrollView\>

        \<View style={styles.ctaContainer}\>  
          \<PixelButton  
            variant="primary"  
            onPress={handleCreateAccount}  
            // Disable if invalid, or if pristine and empty (initial state)  
            disabled={\!isFormValid && (\!isPristine || username.length \=== 0)}  
            accessibilityLabel="Create Account"  
            accessibilityHint="Saves profile information and proceeds to the next step."  
          \>  
            CREATE ACCOUNT  
          \</PixelButton\>  
          \<View style={styles.secondaryCta}\>  
            \<PixelButton  
              variant="tertiary"  
              onPress={handleSkip}  
              accessibilityLabel="Skip for now"  
              accessibilityHint="Skips profile creation and proceeds to archetype selection."  
            \>  
              Skip for now  
            \</PixelButton\>  
          \</View\>  
        \</View\>  
      \</KeyboardAvoidingView\>  
    \</SafeAreaView\>  
  );  
};

const styles \= StyleSheet.create({  
  safeArea: {  
    flex: 1,  
    backgroundColor: tokens.colors.background.primary,  
  },  
  keyboardView: {  
    flex: 1,  
  },  
  scrollContent: {  
    flexGrow: 1,  
    paddingHorizontal: tokens.component.screenPaddingX,  
    paddingTop: tokens.spacing\[5\], // 32pt  
  },  
  header: {  
    marginBottom: tokens.spacing\[5\], // 32pt  
  },  
  subtitle: {  
    marginTop: tokens.spacing\[2\],  
  },  
  form: {  
    flex: 1,  
  },  
  inputSpacer: {  
    height: tokens.spacing\[4\], // 24pt  
  },  
  ctaContainer: {  
    paddingHorizontal: tokens.component.screenPaddingX,  
    paddingBottom: tokens.spacing\[6\], // 40pt  
    paddingTop: tokens.spacing\[3\],  
    backgroundColor: tokens.colors.background.primary,  
  },  
  secondaryCta: {  
    marginTop: tokens.spacing\[3\], // 16pt  
  },  
});

export default ProfileSetupScreen;

USAGE NOTES:

* Implements the required validation logic with a robust, manually implemented 300ms debounce.  
* Uses `KeyboardAvoidingView` and `ScrollView` for proper form handling on different devices.  
* Button state is managed based on real-time validation results and interaction status (`isPristine`).

═══════════════════════════════════════════════════════════ FILE 5/12: apps/mobile-shell/src/screens/onboarding/ArchetypeSelectionScreen.tsx ═══════════════════════════════════════════════════════════

TypeScript  
import React, { useState, useCallback, useEffect, useRef } from 'react';  
import { View, StyleSheet, FlatList, TouchableOpacity, Animated, Alert } from 'react-native';  
import { SafeAreaView } from 'react-native-safe-area-context';  
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { PixelButton, PixelText, PixelSprite, PixelBorder } from '@/components/atoms';  
import { tokens, durations, easings } from '@/design-system';  
import ProgressIndicator from './components/ProgressIndicator';  
import { useOnboarding, ArchetypeId } from './OnboardingContext';

// \--- Archetype Data Definition \---

interface Archetype {  
  id: ArchetypeId;  
  name: string;  
  description: string;  
  sprite: any; // ImageRequireSource or { uri: string }  
}

// Placeholder assets. Replace with require('@/assets/archetypes/...')  
const archetypes: Archetype\[\] \= \[  
  {  
    id: 'trainer',  
    name: 'TRAINER',  
    description: 'Balanced fitness style',  
    sprite: { uri: 'https://via.placeholder.com/80x80/8BAC0F/0F380F?text=T' },  
  },  
  {  
    id: 'runner',  
    name: 'RUNNER',  
    description: 'Cardio specialist',  
    sprite: { uri: 'https://via.placeholder.com/80x80/8BAC0F/0F380F?text=R' },  
  },  
  {  
    id: 'yogi',  
    name: 'YOGI',  
    description: 'Flexibility & mindfulness',  
    sprite: { uri: 'https://via.placeholder.com/80x80/8BAC0F/0F380F?text=Y' },  
  },  
  {  
    id: 'builder',  
    name: 'BUILDER',  
    description: 'Strength training',  
    sprite: { uri: 'https://via.placeholder.com/80x80/8BAC0F/0F380F?text=B' },  
  },  
  {  
    id: 'cyclist',  
    name: 'CYCLIST',  
    description: 'Endurance & biking',  
    sprite: { uri: 'https://via.placeholder.com/80x80/8BAC0F/0F380F?text=C' },  
  },  
\];

// \--- ArchetypeCard Component \---

interface ArchetypeCardProps {  
  archetype: Archetype;  
  isSelected: boolean;  
  onSelect: (id: ArchetypeId) \=\> void;  
}

const ArchetypeCard: React.FC\<ArchetypeCardProps\> \= React.memo(({ archetype, isSelected, onSelect }) \=\> {  
  // Animation value: 1 (selected) or 0 (deselected)  
  const selectionAnim \= useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() \=\> {  
    Animated.timing(selectionAnim, {  
      toValue: isSelected ? 1 : 0,  
      duration: isSelected ? durations.normal : durations.fast \+ 50, // 200ms select, 150ms deselect  
      easing: isSelected ? easings.springGentle : easings.easeOut,  
      useNativeDriver: true, // GPU accelerated for transform  
    }).start();  
  }, \[isSelected, selectionAnim\]);

  const handlePress \= useCallback(() \=\> {  
    ReactNativeHapticFeedback.trigger('impactMedium');  
    onSelect(archetype.id);  
  }, \[onSelect, archetype.id\]);

  // Interpolate the scale value: 1.0 \-\> 1.05  
  const scale \= selectionAnim.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \[1, 1.05\],  
  });

  return (  
    \<Animated.View style={\[styles.cardWrapper, { transform: \[{ scale }\] }\]}\>  
      \<TouchableOpacity  
        onPress={handlePress}  
        activeOpacity={0.8}  
        accessibilityRole="radio"  
        accessibilityState={{ selected: isSelected }}  
        accessibilityLabel={archetype.name}  
        accessibilityHint={\`Select ${archetype.description} as your fitness archetype\`}  
      \>  
        \<PixelBorder  
          borderWidth={isSelected ? "thick" : "default"} // 4px vs 3px  
          borderColor={isSelected ? tokens.colors.border.highlight : tokens.colors.border.default}  
          backgroundColorKey="elevated" // \#8BAC0F  
          shadow={isSelected ? "medium" : "none"}  
          padding={3} // 16pt  
          style={styles.card}  
        \>  
          \<PixelSprite source={archetype.sprite} size={80} alt={\`${archetype.name} sprite\`} /\>  
          \<PixelText variant="h3" align="center" style={styles.cardTitle}\>  
            {archetype.name}  
          \</PixelText\>  
          \<PixelText variant="bodySmall" align="center" colorKey="secondary"\>  
            {archetype.description}  
          \</PixelText\>  
        \</PixelBorder\>  
      \</TouchableOpacity\>  
    \</Animated.View\>  
  );  
});

// \--- ArchetypeSelectionScreen Component \---

const ArchetypeSelectionScreen: React.FC \= () \=\> {  
  const { selectedArchetype, selectArchetype, completeOnboarding, setCurrentStep } \= useOnboarding();  
  // Local state manages the current selection on this screen, initialized from context  
  const \[selectedId, setSelectedId\] \= useState\<ArchetypeId | null\>(selectedArchetype);  
  const \[isLoading, setIsLoading\] \= useState(false);

  useEffect(() \=\> {  
    setCurrentStep(3);  
  }, \[setCurrentStep\]);

  const handleSelect \= useCallback((id: ArchetypeId) \=\> {  
    setSelectedId(id);  
  }, \[\]);

  const handleContinue \= useCallback(async () \=\> {  
    if (selectedId) {  
      setIsLoading(true);  
      // Update context immediately before starting async operation  
      selectArchetype(selectedId);  
      try {  
        // Attempt to finalize onboarding  
        await completeOnboarding();  
        // Navigation to the main app is handled after completeOnboarding resolves (in the root navigator)  
      } catch (error) {  
        console.error("Failed to complete onboarding:", error);  
        Alert.alert("Error", (error as Error).message || "Could not complete setup. Please try again.");  
        setIsLoading(false);  
      }  
    }  
  }, \[selectedId, selectArchetype, completeOnboarding\]);

  const renderItem \= useCallback(({ item }: { item: Archetype }) \=\> (  
    \<ArchetypeCard  
      archetype={item}  
      isSelected={selectedId \=== item.id}  
      onSelect={handleSelect}  
    /\>  
  ), \[selectedId, handleSelect\]);

  const ListHeader \= (  
    \<View style={styles.header}\>  
        \<PixelText variant="h2" align="center" colorKey="primary"\>  
        SELECT ARCHETYPE  
        \</PixelText\>  
        \<PixelText variant="bodySmall" align="center" colorKey="secondary" style={styles.subtext}\>  
        Choose your fitness style (you can change this later).  
        \</PixelText\>  
    \</View\>  
  );

  return (  
    \<SafeAreaView style={styles.safeArea}\>  
      \<ProgressIndicator currentStep={3} totalSteps={3} /\>

      \<FlatList  
        data={archetypes}  
        renderItem={renderItem}  
        keyExtractor={(item) \=\> item.id}  
        numColumns={2}  
        ListHeaderComponent={ListHeader}  
        contentContainerStyle={styles.listContent}  
        columnWrapperStyle={styles.columnWrapper}  
        showsVerticalScrollIndicator={false}  
        accessibilityRole='radiogroup'  
      /\>

      \<View style={styles.ctaContainer}\>  
        \<PixelButton  
          variant="primary"  
          onPress={handleContinue}  
          disabled={\!selectedId}  
          isLoading={isLoading}  
          accessibilityLabel="Continue"  
          accessibilityHint="Confirms archetype selection and finishes onboarding."  
        \>  
          CONTINUE  
        \</PixelButton\>  
      \</View\>  
    \</SafeAreaView\>  
  );  
};

const styles \= StyleSheet.create({  
  safeArea: {  
    flex: 1,  
    backgroundColor: tokens.colors.background.primary,  
  },  
  listContent: {  
    flexGrow: 1,  
    // Adjust padding to account for card margins (8pt)  
    paddingHorizontal: tokens.component.screenPaddingX \- tokens.spacing\[2\],  
    paddingBottom: tokens.spacing\[4\],  
  },  
  columnWrapper: {  
    justifyContent: 'flex-start',  
  },  
  header: {  
    paddingTop: tokens.spacing\[4\], // 24pt  
    marginBottom: tokens.spacing\[4\], // 24pt  
    paddingHorizontal: tokens.spacing\[2\],  
  },  
  subtext: {  
    marginTop: tokens.spacing\[2\], // 8pt  
  },  
  cardWrapper: {  
    flex: 1/2,  
    padding: tokens.spacing\[2\], // 8pt margin around cards  
  },  
  card: {  
    alignItems: 'center',  
    minHeight: 180, // Ensure consistent height  
  },  
  cardTitle: {  
    marginTop: tokens.spacing\[2\], // 8pt  
    marginBottom: tokens.spacing\[1\], // 4pt  
  },  
  ctaContainer: {  
    paddingHorizontal: tokens.component.screenPaddingX,  
    paddingBottom: tokens.spacing\[6\], // 40pt  
    paddingTop: tokens.spacing\[3\],  
    backgroundColor: tokens.colors.background.primary,  
    // Add a top border to separate CTA from scrollable content  
    borderTopWidth: tokens.border.width.pixel,  
    borderTopColor: tokens.colors.border.default,  
  },  
});

export default ArchetypeSelectionScreen;

USAGE NOTES:

* Includes an optimized `ArchetypeCard` component using `React.memo` and native driver animations for selection feedback.  
* Uses `FlatList` for the 2-column grid layout.  
* Handles the loading state and potential errors during the asynchronous `completeOnboarding` process.

═══════════════════════════════════════════════════════════ FILE 6/12: apps/mobile-shell/src/screens/onboarding/OnboardingNavigator.tsx ═══════════════════════════════════════════════════════════

TypeScript  
import React from 'react';  
import { Easing } from 'react-native';  
import { createStackNavigator, StackCardInterpolationProps } from '@react-navigation/stack';

import { durations } from '@/design-system';  
import { OnboardingProvider } from './OnboardingContext';  
import WelcomeScreen from './WelcomeScreen';  
import ProfileSetupScreen from './ProfileSetupScreen';  
import ArchetypeSelectionScreen from './ArchetypeSelectionScreen';

// Define the parameter list for the onboarding stack  
export type OnboardingStackParamList \= {  
  Welcome: undefined;  
  ProfileSetup: undefined;  
  ArchetypeSelection: undefined;  
};

const Stack \= createStackNavigator\<OnboardingStackParamList\>();

// Custom transition configuration matching the requirements  
const transitionSpecConfig \= {  
    open: {  
        animation: 'timing' as const,  
        config: {  
          duration: durations.moderate, // 300ms  
          easing: Easing.out(Easing.ease),  
        },  
      },  
      close: {  
        animation: 'timing' as const,  
        config: {  
          duration: durations.moderate, // 300ms  
          easing: Easing.in(Easing.ease),  
        },  
      },  
};

// Custom card style interpolator matching the requirements  
const cardStyleInterpolator \= ({ current, layouts }: StackCardInterpolationProps) \=\> ({  
    cardStyle: {  
        transform: \[  
          {  
            translateX: current.progress.interpolate({  
              inputRange: \[0, 1\],  
              outputRange: \[layouts.screen.width, 0\],  
            }),  
          },  
        \],  
        // Subtle fade (0.9 \-\> 1.0)  
        opacity: current.progress.interpolate({  
          inputRange: \[0, 1\],  
          outputRange: \[0.9, 1\],  
        }),  
      },  
});

/\*\*  
 \* Navigator for the multi-step onboarding flow.  
 \* Wrapped in OnboardingProvider to manage state across screens.  
 \*/  
export const OnboardingNavigator: React.FC \= () \=\> {  
  return (  
    \<OnboardingProvider\>  
      \<Stack.Navigator  
        initialRouteName="Welcome"  
        screenOptions={{  
          headerShown: false,  
          gestureEnabled: true,  
          gestureDirection: 'horizontal',  
          transitionSpec: transitionSpecConfig,  
          cardStyleInterpolator: cardStyleInterpolator,  
        }}  
      \>  
        \<Stack.Screen name="Welcome" component={WelcomeScreen} /\>  
        \<Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} /\>  
        \<Stack.Screen name="ArchetypeSelection" component={ArchetypeSelectionScreen} /\>  
      \</Stack.Navigator\>  
    \</OnboardingProvider\>  
  );  
};

export default OnboardingNavigator;

USAGE NOTES:

* Sets up the stack navigator with the required custom slide transitions (300ms, specific easings, slide \+ fade).  
* Wraps the `Stack.Navigator` with `OnboardingProvider`.

---

## **Test Files**

---

*Note: These tests assume a standard Jest environment configured for React Native Testing Library. Mocks for external dependencies are included.*

═══════════════════════════════════════════════════════════ FILE 7/12: apps/mobile-shell/src/screens/onboarding/OnboardingContext.test.tsx ═══════════════════════════════════════════════════════════

TypeScript  
import React from 'react';  
// Using renderHook from @testing-library/react-hooks (or @testing-library/react)  
import { renderHook, act } from '@testing-library/react-hooks';  
import { OnboardingProvider, useOnboarding, ArchetypeId } from './OnboardingContext';

// Wrapper component to provide the context  
const wrapper: React.FC\<{ children: React.ReactNode }\> \= ({ children }) \=\> (  
  \<OnboardingProvider\>{children}\</OnboardingProvider\>  
);

describe('OnboardingContext', () \=\> {

  it('should initialize with the correct default state', () \=\> {  
    const { result } \= renderHook(() \=\> useOnboarding(), { wrapper });

    expect(result.current.currentStep).toBe(1);  
    expect(result.current.username).toBeNull();  
    expect(result.current.displayName).toBeNull();  
    expect(result.current.selectedArchetype).toBeNull();  
  });

  it('should update username and displayName correctly', () \=\> {  
    const { result } \= renderHook(() \=\> useOnboarding(), { wrapper });

    act(() \=\> {  
      result.current.setUsername('testuser');  
      result.current.setDisplayName('Test User');  
    });

    expect(result.current.username).toBe('testuser');  
    expect(result.current.displayName).toBe('Test User');  
  });

  it('should treat empty string or whitespace display name as null', () \=\> {  
    const { result } \= renderHook(() \=\> useOnboarding(), { wrapper });

    act(() \=\> {  
      result.current.setDisplayName('');  
    });  
    expect(result.current.displayName).toBeNull();

    act(() \=\> {  
        result.current.setDisplayName('   '); // Whitespace only  
      });  
    expect(result.current.displayName).toBeNull();  
  });

  it('should update selectedArchetype correctly', () \=\> {  
    const { result } \= renderHook(() \=\> useOnboarding(), { wrapper });  
    const archetype: ArchetypeId \= 'runner';

    act(() \=\> {  
      result.current.selectArchetype(archetype);  
    });

    expect(result.current.selectedArchetype).toBe(archetype);  
  });

  it('should handle step navigation (nextStep/previousStep) within bounds', () \=\> {  
    const { result } \= renderHook(() \=\> useOnboarding(), { wrapper });

    act(() \=\> result.current.nextStep());  
    expect(result.current.currentStep).toBe(2);

    act(() \=\> result.current.nextStep());  
    expect(result.current.currentStep).toBe(3);

    // Should cap at 3  
    act(() \=\> result.current.nextStep());  
    expect(result.current.currentStep).toBe(3);

    act(() \=\> result.current.previousStep());  
    expect(result.current.currentStep).toBe(2);

    act(() \=\> result.current.previousStep());  
    expect(result.current.currentStep).toBe(1);

    // Should bottom out at 1  
    act(() \=\> result.current.previousStep());  
    expect(result.current.currentStep).toBe(1);  
  });

  it('should allow setting the current step directly', () \=\> {  
    const { result } \= renderHook(() \=\> useOnboarding(), { wrapper });

    act(() \=\> {  
      result.current.setCurrentStep(3);  
    });  
    expect(result.current.currentStep).toBe(3);  
  });

  it('should successfully complete onboarding when requirements met', async () \=\> {  
    const consoleSpy \= jest.spyOn(console, 'log').mockImplementation(() \=\> {});  
    const { result } \= renderHook(() \=\> useOnboarding(), { wrapper });

    act(() \=\> {  
        result.current.selectArchetype('yogi');  
    });

    await act(async () \=\> {  
      await expect(result.current.completeOnboarding()).resolves.toBeUndefined();  
    });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Onboarding process finalizing. State:'), expect.any(Object));  
    consoleSpy.mockRestore();  
  });

  it('should throw an error when completing onboarding without an archetype', async () \=\> {  
    const { result } \= renderHook(() \=\> useOnboarding(), { wrapper });

    // Expect the promise to reject  
    await expect(result.current.completeOnboarding()).rejects.toThrow('Archetype selection required.');  
  });

  it('should throw an error if useOnboarding is used outside the provider', () \=\> {  
    // Suppress the expected console.error output from React boundary  
    const consoleErrorSpy \= jest.spyOn(console, 'error').mockImplementation(() \=\> {});

    expect(() \=\> renderHook(() \=\> useOnboarding())).toThrow('useOnboarding must be used within an OnboardingProvider');

    consoleErrorSpy.mockRestore();  
  });  
});

═══════════════════════════════════════════════════════════ FILE 8/12: apps/mobile-shell/src/screens/onboarding/components/ProgressIndicator.test.tsx ═══════════════════════════════════════════════════════════

TypeScript  
import React from 'react';  
import { render, screen } from '@testing-library/react-native';  
import ProgressIndicator from './ProgressIndicator';  
import { tokens } from '@/design-system';  
import { Text } from 'react-native';

// Mock design system tokens based on the expected Light/DMG theme  
jest.mock('@/design-system', () \=\> ({  
  tokens: {  
    spacing: { 1: 4, 2: 8, 3: 16 },  
    colors: {  
      background: { primary: '\#9BBC0F', elevated: '\#8BAC0F' },  
      text: { primary: '\#0F380F', secondary: '\#306230' },  
      border: { default: '\#306230' },  
    },  
    border: { width: { pixel: 1 } },  
  },  
}));

// Mock PixelText  
jest.mock('@/components/atoms', () \=\> ({  
  PixelText: jest.fn(({ children }) \=\> \<Text\>{children}\</Text\>),  
}));

describe('ProgressIndicator', () \=\> {  
  const totalSteps \= 3;

  it('renders the correct step text', () \=\> {  
    render(\<ProgressIndicator currentStep={1} totalSteps={totalSteps} /\>);  
    expect(screen.getByText('Step 1 of 3')).toBeTruthy();  
  });

  it('renders the correct number of dots', () \=\> {  
    render(\<ProgressIndicator currentStep={1} totalSteps={totalSteps} /\>);  
    // Check using the accessibility labels assigned to the dots  
    const dots \= screen.getAllByLabelText(/Step \\d (completed|pending)/);  
    expect(dots.length).toBe(totalSteps);  
  });

  it('styles active and inactive dots correctly (Step 1)', () \=\> {  
    render(\<ProgressIndicator currentStep={1} totalSteps={totalSteps} /\>);  
      
    const step1 \= screen.getByLabelText('Step 1 completed');  
    const step2 \= screen.getByLabelText('Step 2 pending');

    // Active dot style (dark background)  
    expect(step1.props.style).toEqual(expect.arrayContaining(\[  
        expect.objectContaining({ backgroundColor: tokens.colors.text.primary })  
    \]));

    // Inactive dot style (light background, border)  
    expect(step2.props.style).toEqual(expect.arrayContaining(\[  
        expect.objectContaining({   
            backgroundColor: tokens.colors.background.elevated,  
            borderWidth: 1,  
            borderColor: tokens.colors.border.default  
        })  
    \]));  
  });

  it('styles all dots as active for the final step (Step 3)', () \=\> {  
    render(\<ProgressIndicator currentStep={3} totalSteps={totalSteps} /\>);  
      
    const step3 \= screen.getByLabelText('Step 3 completed');

    expect(step3.props.style).toEqual(expect.arrayContaining(\[  
        expect.objectContaining({ backgroundColor: tokens.colors.text.primary })  
    \]));  
  });

  it('has the correct accessibility roles and values', () \=\> {  
    render(\<ProgressIndicator currentStep={2} totalSteps={3} /\>);  
    const progressBar \= screen.getByRole('progressbar');  
    expect(progressBar).toBeTruthy();  
    // Check ARIA attributes used in the component  
    expect(progressBar.props\['aria-valuemax'\]).toBe(3);  
    expect(progressBar.props\['aria-valuenow'\]).toBe(2);  
  });  
});

═══════════════════════════════════════════════════════════ FILE 9/12: apps/mobile-shell/src/screens/onboarding/WelcomeScreen.test.tsx ═══════════════════════════════════════════════════════════

TypeScript  
import React from 'react';  
import { render, fireEvent, screen } from '@testing-library/react-native';  
import WelcomeScreen from './WelcomeScreen';  
import { NavigationContainer } from '@react-navigation/native';  
import { View, Text, Button } from 'react-native';

// Mock dependencies  
jest.mock('@/design-system', () \=\> ({  
  tokens: {  
    colors: { background: { primary: '\#FFF' } },  
    component: { screenPaddingX: 24 },  
    // Include spacing\[9\] (80pt) used for the spacer  
    spacing: { 3: 16, 4: 24, 6: 40, 9: 80 },  
  },  
  durations: { slow: 500, moderate: 300 },  
  easings: { easeOut: jest.fn(), snappy: jest.fn() },  
}));

// Mock atomic components using React Native components  
jest.mock('@/components/atoms', () \=\> ({  
  PixelButton: jest.fn(({ children, onPress, accessibilityLabel }) \=\> \<Button title={String(children)} onPress={onPress} accessibilityLabel={accessibilityLabel} /\>),  
  PixelText: jest.fn(({ children }) \=\> \<Text\>{children}\</Text\>),  
  PixelSprite: jest.fn(() \=\> \<View testID="mock-sprite" /\>),  
}));

jest.mock('./components/ProgressIndicator', () \=\> jest.fn(() \=\> \<View testID="mock-progress-indicator" /\>));

const mockSetCurrentStep \= jest.fn();  
jest.mock('./OnboardingContext', () \=\> ({  
  useOnboarding: jest.fn(() \=\> ({  
    setCurrentStep: mockSetCurrentStep,  
  })),  
}));

const mockNavigate \= jest.fn();  
jest.mock('@react-navigation/native', () \=\> ({  
  ...jest.requireActual('@react-navigation/native'),  
  useNavigation: () \=\> ({  
    navigate: mockNavigate,  
  }),  
}));

describe('WelcomeScreen', () \=\> {  
  beforeEach(() \=\> {  
    jest.clearAllMocks();  
  });

  const renderScreen \= () \=\> {  
    return render(  
      \<NavigationContainer\>  
        \<WelcomeScreen /\>  
      \</NavigationContainer\>  
    );  
  };

  it('renders correctly with all elements', () \=\> {  
    renderScreen();  
      
    // Check for Progress Indicator and Logo  
    expect(screen.getByTestId('mock-progress-indicator')).toBeTruthy();  
    expect(screen.getByTestId('mock-sprite')).toBeTruthy();  
      
    // Check for Title and Tagline  
    expect(screen.getByText('16BITFIT')).toBeTruthy();  
    expect(screen.getByText(/Your fitness journey starts here/i)).toBeTruthy();  
      
    // Check for CTAs  
    expect(screen.getByLabelText('Get Started')).toBeTruthy();  
    expect(screen.getByLabelText('Log In')).toBeTruthy();  
  });

  it('calls setCurrentStep(1) on mount', () \=\> {  
    renderScreen();  
    expect(mockSetCurrentStep).toHaveBeenCalledWith(1);  
  });

  it('navigates to ProfileSetup when GET STARTED is pressed', () \=\> {  
    renderScreen();  
      
    const getStartedButton \= screen.getByLabelText('Get Started');  
    fireEvent.press(getStartedButton);  
      
    expect(mockNavigate).toHaveBeenCalledWith('ProfileSetup');  
  });

  it('handles the login link press (placeholder)', () \=\> {  
    const consoleSpy \= jest.spyOn(console, 'log').mockImplementation(() \=\> {});  
    renderScreen();  
      
    const loginLink \= screen.getByLabelText('Log In');  
    fireEvent.press(loginLink);  
      
    // Check the placeholder console log  
    expect(consoleSpy).toHaveBeenCalledWith('Navigate to LoginScreen (Placeholder)');  
    consoleSpy.mockRestore();  
  });  
});

═══════════════════════════════════════════════════════════ FILE 10/12: apps/mobile-shell/src/screens/onboarding/ProfileSetupScreen.test.tsx ═══════════════════════════════════════════════════════════

TypeScript  
import React from 'react';  
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react-native';  
import ProfileSetupScreen from './ProfileSetupScreen';  
import { NavigationContainer } from '@react-navigation/native';  
import { useOnboarding } from './OnboardingContext';  
import { PixelInput } from '@/components/atoms';  
import { View, Text, Button, TextInput } from 'react-native';

// Mock dependencies  
jest.mock('@/design-system', () \=\> ({  
  tokens: {  
    colors: { background: { primary: '\#FFF' } },  
    component: { screenPaddingX: 24 },  
    spacing: { 2: 8, 3: 16, 4: 24, 5: 32, 6: 40 },  
  },  
}));

// Mock atomic components, ensuring PixelInput captures props like error and success  
jest.mock('@/components/atoms', () \=\> ({  
  PixelButton: jest.fn(({ children, onPress, disabled, accessibilityLabel }) \=\> \<Button title={String(children)} onPress={onPress} disabled={disabled} accessibilityLabel={accessibilityLabel} /\>),  
  PixelText: jest.fn(({ children }) \=\> \<Text\>{children}\</Text\>),  
  // Mock PixelInput to render TextInput and capture critical props for verification  
  PixelInput: jest.fn(({ value, onChangeText, accessibilityLabel }) \=\> (  
    \<TextInput value={value} onChangeText={onChangeText} accessibilityLabel={accessibilityLabel} /\>  
  )),  
}));

jest.mock('./components/ProgressIndicator', () \=\> jest.fn(() \=\> \<View testID="mock-progress-indicator" /\>));

const mockSetUsername \= jest.fn();  
const mockSetDisplayName \= jest.fn();  
const mockSetCurrentStep \= jest.fn();  
const mockNextStep \= jest.fn();  
const mockUseOnboarding \= useOnboarding as jest.Mock;

jest.mock('./OnboardingContext', () \=\> ({  
  useOnboarding: jest.fn(),  
}));

const mockNavigate \= jest.fn();  
jest.mock('@react-navigation/native', () \=\> ({  
  ...jest.requireActual('@react-navigation/native'),  
  useNavigation: () \=\> ({  
    navigate: mockNavigate,  
  }),  
}));

describe('ProfileSetupScreen', () \=\> {  
  beforeEach(() \=\> {  
    jest.clearAllMocks();  
    mockUseOnboarding.mockReturnValue({  
      username: null,  
      displayName: null,  
      setUsername: mockSetUsername,  
      setDisplayName: mockSetDisplayName,  
      setCurrentStep: mockSetCurrentStep,  
      nextStep: mockNextStep,  
    });  
    // Use fake timers for debounce testing  
    jest.useFakeTimers();  
  });

  afterEach(() \=\> {  
    jest.useRealTimers();  
  });

  const renderScreen \= () \=\> {  
    return render(  
      \<NavigationContainer\>  
        \<ProfileSetupScreen /\>  
      \</NavigationContainer\>  
    );  
  };

  it('renders correctly and button is disabled initially', () \=\> {  
    renderScreen();  
    expect(screen.getByText('CREATE PROFILE')).toBeTruthy();  
    expect(screen.getByLabelText('Username Input')).toBeTruthy();  
    // Button should be disabled initially (pristine and empty)  
    expect(screen.getByLabelText('Create Account').props.disabled).toBe(true);  
  });

  it('calls setCurrentStep(2) on mount', () \=\> {  
    renderScreen();  
    expect(mockSetCurrentStep).toHaveBeenCalledWith(2);  
  });

  describe('Username Validation (Debounced)', () \=\> {  
      
    it('shows error for too short username after debounce', async () \=\> {  
        renderScreen();  
        const input \= screen.getByLabelText('Username Input');  
        fireEvent.changeText(input, 'ab');  
    
        // Before debounce (300ms), validation should not have finalized  
          
        // Advance timers past debounce  
        act(() \=\> {  
            jest.advanceTimersByTime(300);  
        });  
    
        await waitFor(() \=\> {  
          // Check if PixelInput was called with the correct error prop  
          expect(PixelInput).toHaveBeenCalledWith(expect.objectContaining({  
            error: 'Username must be at least 3 characters',  
          }), expect.anything());  
        });  
        expect(screen.getByLabelText('Create Account').props.disabled).toBe(true);  
      });

    it('shows error for invalid characters', async () \=\> {  
        renderScreen();  
        const input \= screen.getByLabelText('Username Input');  
        fireEvent.changeText(input, 'user\!');  
    
        act(() \=\> {  
            jest.advanceTimersByTime(300);  
        });  
    
        await waitFor(() \=\> {  
          expect(PixelInput).toHaveBeenCalledWith(expect.objectContaining({  
            error: 'Only letters, numbers, and underscores allowed',  
          }), expect.anything());  
        });  
      });

      it('shows success state and enables button when valid', async () \=\> {  
        renderScreen();  
        const input \= screen.getByLabelText('Username Input');  
        fireEvent.changeText(input, 'valid\_user123');  
    
        act(() \=\> {  
            jest.advanceTimersByTime(300);  
        });  
    
        await waitFor(() \=\> {  
          expect(PixelInput).toHaveBeenCalledWith(expect.objectContaining({  
            error: false,  
            success: true,  
          }), expect.anything());  
        });  
        // Button should be enabled  
        expect(screen.getByLabelText('Create Account').props.disabled).toBe(false);  
      });  
  });

  describe('Form Submission', () \=\> {  
    it('submits the form successfully when valid', async () \=\> {  
        renderScreen();  
        const usernameInput \= screen.getByLabelText('Username Input');  
        const displayNameInput \= screen.getByLabelText('Display Name Input');  
        const submitButton \= screen.getByLabelText('Create Account');  
      
        fireEvent.changeText(usernameInput, 'player\_one');  
        fireEvent.changeText(displayNameInput, 'Player 1');  
      
        act(() \=\> {  
            jest.advanceTimersByTime(300);  
        });  
      
        await waitFor(() \=\> {  
            expect(submitButton.props.disabled).toBe(false);  
        });  
      
        fireEvent.press(submitButton);  
      
        expect(mockSetUsername).toHaveBeenCalledWith('player\_one');  
        expect(mockSetDisplayName).toHaveBeenCalledWith('Player 1');  
        expect(mockNextStep).toHaveBeenCalled();  
        expect(mockNavigate).toHaveBeenCalledWith('ArchetypeSelection');  
      });

      it('handles skip functionality', () \=\> {  
        renderScreen();  
        const skipButton \= screen.getByLabelText('Skip for now');  
        fireEvent.press(skipButton);  
      
        expect(mockSetUsername).toHaveBeenCalledWith(null);  
        expect(mockSetDisplayName).toHaveBeenCalledWith(null);  
        expect(mockNextStep).toHaveBeenCalled();  
        expect(mockNavigate).toHaveBeenCalledWith('ArchetypeSelection');  
      });  
  });  
});

═══════════════════════════════════════════════════════════ FILE 11/12: apps/mobile-shell/src/screens/onboarding/ArchetypeSelectionScreen.test.tsx ═══════════════════════════════════════════════════════════

TypeScript  
import React from 'react';  
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react-native';  
import ArchetypeSelectionScreen from './ArchetypeSelectionScreen';  
import { useOnboarding } from './OnboardingContext';  
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';  
import { View, Text, Button, Alert } from 'react-native';

// Mock dependencies  
jest.mock('@/design-system', () \=\> ({  
  tokens: {  
    colors: {   
        background: { primary: '\#FFF' },  
        border: { highlight: '\#00FF00', default: '\#000' }  
    },  
    component: { screenPaddingX: 24 },  
    spacing: { 1: 4, 2: 8, 3: 16, 4: 24, 6: 40 },  
    border: { width: { pixel: 1 }},  
  },  
  durations: { normal: 200, fast: 100 },  
  easings: { springGentle: jest.fn(), easeOut: jest.fn() },  
}));

jest.mock('@/components/atoms', () \=\> ({  
  PixelButton: jest.fn(({ children, onPress, disabled, isLoading, accessibilityLabel }) \=\> \<Button title={String(children)} onPress={onPress} disabled={disabled || isLoading} accessibilityLabel={accessibilityLabel} /\>),  
  PixelText: jest.fn(({ children }) \=\> \<Text\>{children}\</Text\>),  
  PixelSprite: jest.fn(() \=\> \<View testID="mock-sprite" /\>),  
  PixelBorder: jest.fn(({ children }) \=\> \<View\>{children}\</View\>),  
}));

jest.mock('./components/ProgressIndicator', () \=\> jest.fn(() \=\> \<View testID="mock-progress-indicator" /\>));

const mockSelectArchetype \= jest.fn();  
const mockSetCurrentStep \= jest.fn();  
// Default mock implementation resolves successfully  
const mockCompleteOnboarding \= jest.fn().mockResolvedValue(undefined);  
const mockUseOnboarding \= useOnboarding as jest.Mock;

jest.mock('./OnboardingContext', () \=\> ({  
  ...jest.requireActual('./OnboardingContext'),  
  useOnboarding: jest.fn(),  
}));

jest.mock('react-native-haptic-feedback', () \=\> ({  
  trigger: jest.fn(),  
}));

// Mock Alert for error handling tests  
jest.spyOn(Alert, 'alert');

describe('ArchetypeSelectionScreen', () \=\> {  
  beforeEach(() \=\> {  
    jest.clearAllMocks();  
    mockUseOnboarding.mockReturnValue({  
      selectedArchetype: null,  
      selectArchetype: mockSelectArchetype,  
      completeOnboarding: mockCompleteOnboarding,  
      setCurrentStep: mockSetCurrentStep,  
    });  
  });

  const renderScreen \= () \=\> {  
    return render(\<ArchetypeSelectionScreen /\>);  
  };

  it('renders correctly with all 5 archetypes and disabled button', () \=\> {  
    renderScreen();  
    expect(screen.getByText('SELECT ARCHETYPE')).toBeTruthy();  
      
    expect(screen.getByText('TRAINER')).toBeTruthy();  
    expect(screen.getByText('RUNNER')).toBeTruthy();  
    expect(screen.getByText('YOGI')).toBeTruthy();  
    expect(screen.getByText('BUILDER')).toBeTruthy();  
    expect(screen.getByText('CYCLIST')).toBeTruthy();

    // Continue button should be disabled initially  
    expect(screen.getByLabelText('Continue').props.disabled).toBe(true);  
  });

  it('calls setCurrentStep(3) on mount', () \=\> {  
    renderScreen();  
    expect(mockSetCurrentStep).toHaveBeenCalledWith(3);  
  });

  it('handles selection, triggers haptics, and enables the continue button', () \=\> {  
    renderScreen();  
    // Target the TouchableOpacity via accessibilityRole  
    const runnerCard \= screen.getByRole('radio', { name: /RUNNER/i });  
      
    expect(runnerCard.props.accessibilityState.selected).toBe(false);

    fireEvent.press(runnerCard);

    // Check if selection state updated locally  
    expect(runnerCard.props.accessibilityState.selected).toBe(true);  
      
    // Check if haptic feedback was triggered  
    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('impactMedium');

    // Continue button should now be enabled  
    expect(screen.getByLabelText('Continue').props.disabled).toBe(false);  
  });

  it('handles single selection behavior', () \=\> {  
    renderScreen();  
    const trainerCard \= screen.getByRole('radio', { name: 'TRAINER' });  
    const builderCard \= screen.getByRole('radio', { name: 'BUILDER' });

    fireEvent.press(trainerCard);  
    expect(trainerCard.props.accessibilityState.selected).toBe(true);

    fireEvent.press(builderCard);  
    // Check updated state after re-render simulation (RTL handles this)  
    expect(screen.getByRole('radio', { name: 'TRAINER' }).props.accessibilityState.selected).toBe(false);  
    expect(screen.getByRole('radio', { name: 'BUILDER' }).props.accessibilityState.selected).toBe(true);  
  });

  it('calls context functions and completes onboarding when CONTINUE is pressed', async () \=\> {  
    renderScreen();  
    const cyclistCard \= screen.getByRole('radio', { name: /CYCLIST/i });  
    fireEvent.press(cyclistCard);

    const continueButton \= screen.getByLabelText('Continue');  
      
    await act(async () \=\> {  
        fireEvent.press(continueButton);  
    });

    // Check if context functions were called  
    expect(mockSelectArchetype).toHaveBeenCalledWith('cyclist');  
    expect(mockCompleteOnboarding).toHaveBeenCalledTimes(1);  
  });

  it('handles errors during onboarding completion', async () \=\> {  
    const errorMessage \= 'API Failure';  
    mockCompleteOnboarding.mockRejectedValueOnce(new Error(errorMessage));

    renderScreen();  
    fireEvent.press(screen.getByRole('radio', { name: /TRAINER/i }));  
    const continueButton \= screen.getByLabelText('Continue');  
      
    await act(async () \=\> {  
        fireEvent.press(continueButton);  
    });

    await waitFor(() \=\> {  
        expect(mockCompleteOnboarding).toHaveBeenCalled();  
    });

    // Check if Alert was shown  
    expect(Alert.alert).toHaveBeenCalledWith("Error", errorMessage);  
      
    // Button should exit loading state (enabled again)  
    expect(continueButton.props.disabled).toBe(false);  
  });  
});

═══════════════════════════════════════════════════════════ FILE 12/12: apps/mobile-shell/src/screens/onboarding/OnboardingNavigator.test.tsx ═══════════════════════════════════════════════════════════

TypeScript  
import React from 'react';  
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react-native';  
import { NavigationContainer } from '@react-navigation/native';  
import OnboardingNavigator from './OnboardingNavigator';  
import { View, Text, Button, TextInput } from 'react-native';

// Mock dependencies required by the navigator and the screens rendered within it  
jest.mock('@/design-system', () \=\> ({  
  durations: { moderate: 300, slow: 500, normal: 200, fast: 100 },  
  easings: { easeOut: jest.fn(), easeIn: jest.fn(), snappy: jest.fn(), springGentle: jest.fn() },  
  tokens: { // Provide minimal tokens needed by the actual screens for this integration test  
    colors: { background: { primary: '\#FFF' }, border: { default: '\#000', highlight: '\#00FF00' } },  
    component: { screenPaddingX: 24 },  
    spacing: { 1: 4, 2: 8, 3: 16, 4: 24, 5: 32, 6: 40, 9: 80 },  
    border: { width: { pixel: 1 }},  
  },  
}));

// Mock atomic components used in the screens (We are testing the actual screens here, not mocks)  
jest.mock('@/components/atoms', () \=\> ({  
    PixelButton: jest.fn(({ children, onPress, disabled, accessibilityLabel }) \=\> \<Button title={String(children)} onPress={onPress} disabled={disabled} accessibilityLabel={accessibilityLabel} /\>),  
    PixelText: jest.fn(({ children }) \=\> \<Text\>{children}\</Text\>),  
    PixelSprite: jest.fn(() \=\> \<View testID="mock-sprite" /\>),  
    PixelInput: jest.fn(({ value, onChangeText, accessibilityLabel }) \=\> \<TextInput value={value} onChangeText={onChangeText} accessibilityLabel={accessibilityLabel} /\>),  
    PixelBorder: jest.fn(({ children }) \=\> \<View\>{children}\</View\>),  
}));

// Mock haptics used in ArchetypeSelectionScreen  
jest.mock('react-native-haptic-feedback', () \=\> ({  
    trigger: jest.fn(),  
}));

// We do NOT mock OnboardingContext or the Screens themselves, as this is an integration test for the navigator flow.

describe('OnboardingNavigator Integration Test', () \=\> {  
    // Use fake timers for navigation transitions and ProfileSetup debounce  
    beforeEach(() \=\> {  
        jest.useFakeTimers();  
    });

    afterEach(() \=\> {  
        jest.useRealTimers();  
    });

  const renderNavigator \= () \=\> {  
    return render(  
      \<NavigationContainer\>  
        \<OnboardingNavigator /\>  
      \</NavigationContainer\>  
    );  
  };

  it('renders the WelcomeScreen initially', async () \=\> {  
    renderNavigator();  
    // Wait for initial animations/rendering  
    await act(async () \=\> {  
        jest.advanceTimersByTime(500);  
    });  
    expect(screen.getByText('16BITFIT')).toBeTruthy();  
    expect(screen.getByLabelText('Get Started')).toBeTruthy();  
  });

  it('navigates from WelcomeScreen to ProfileSetupScreen', async () \=\> {  
    renderNavigator();  
      
    const getStartedButton \= await screen.findByLabelText('Get Started');  
    fireEvent.press(getStartedButton);

    // Wait for navigation transition  
    await waitFor(() \=\> {  
        expect(screen.getByText('CREATE PROFILE')).toBeTruthy();  
    });  
    // Verify WelcomeScreen is no longer visible (React Navigation unmounts it)  
    expect(screen.queryByText('16BITFIT')).toBeNull();  
  });

  it('navigates from ProfileSetupScreen to ArchetypeSelectionScreen (Skip)', async () \=\> {  
    renderNavigator();  
      
    // Navigate to ProfileSetup  
    fireEvent.press(await screen.findByLabelText('Get Started'));  
    await screen.findByText('CREATE PROFILE');

    // Press Skip  
    const skipButton \= screen.getByLabelText('Skip for now');  
    fireEvent.press(skipButton);

    // Wait for navigation transition  
    await waitFor(() \=\> {  
        expect(screen.getByText('SELECT ARCHETYPE')).toBeTruthy();  
    });  
  });

  it('navigates through the entire flow (Valid Submit)', async () \=\> {  
    renderNavigator();  
      
    // Step 1 \-\> 2  
    fireEvent.press(await screen.findByLabelText('Get Started'));  
    await screen.findByText('CREATE PROFILE');

    // Step 2: Fill the form  
    const usernameInput \= screen.getByLabelText('Username Input');  
    fireEvent.changeText(usernameInput, 'integration\_test');  
      
    // Advance timers for debounce (300ms)  
    act(() \=\> {  
        jest.advanceTimersByTime(300);  
    });

    // Submit  
    const createAccountButton \= screen.getByLabelText('Create Account');  
    await waitFor(() \=\> expect(createAccountButton.props.disabled).toBe(false));  
    fireEvent.press(createAccountButton);

    // Step 2 \-\> 3  
    await waitFor(() \=\> {  
        expect(screen.getByText('SELECT ARCHETYPE')).toBeTruthy();  
    });

    // Step 3: Select Archetype and Continue  
    const runnerCard \= screen.getByRole('radio', { name: /RUNNER/i });  
    fireEvent.press(runnerCard);

    const continueButton \= screen.getByLabelText('Continue');  
    await waitFor(() \=\> expect(continueButton.props.disabled).toBe(false));  
      
    // Final step completion is async, handled in context/screen  
    await act(async () \=\> {  
        fireEvent.press(continueButton);  
    });  
  });  
});  
