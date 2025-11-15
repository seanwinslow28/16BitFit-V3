import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { PixelButton, PixelText, PixelInput } from '@/components/atoms';
import { tokens } from '@/design-system';
import ProgressIndicator from './components/ProgressIndicator';
import { OnboardingStackParamList } from './navigation/OnboardingNavigator';
import { useOnboarding } from './context/OnboardingContext';

type ProfileSetupScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'ProfileSetup'>;

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const DEBOUNCE_DELAY = 300; // ms

// Validation function (pure)
const validateUsername = (text: string): string | null => {
    if (!text) return 'Username is required';
    if (text.length < 3) return 'Username must be at least 3 characters';
    if (text.length > 20) return 'Username must be 20 characters or less';
    if (!USERNAME_REGEX.test(text)) return 'Only letters, numbers, and underscores allowed';
    return null;
};

const ProfileSetupScreen: React.FC = () => {
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const {
    username: contextUsername,
    displayName: contextDisplayName,
    setUsername,
    setDisplayName,
    setCurrentStep,
    nextStep
  } = useOnboarding();

  // Local state for inputs, initialized from context
  const [username, setUsernameLocal] = useState(contextUsername || '');
  const [displayName, setDisplayNameLocal] = useState(contextDisplayName || '');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isPristine, setIsPristine] = useState(true); // Tracks if user has typed yet

  const validationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  // Debounced validation implementation using setTimeout and useRef
  const debouncedValidation = useCallback((text: string) => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    validationTimeoutRef.current = setTimeout(() => {
      const error = validateUsername(text);
      setUsernameError(error);
    }, DEBOUNCE_DELAY);
  }, []);

  const handleUsernameChange = useCallback((text: string) => {
    setIsPristine(false);
    setUsernameLocal(text);
    debouncedValidation(text);
  }, [debouncedValidation]);

  const handleDisplayNameChange = useCallback((text: string) => {
    // Enforce soft limit of 50 characters
    if (text.length <= 50) {
        setDisplayNameLocal(text);
    }
  }, []);

  // Determine form validity
  const isFormValid = useMemo(() => {
    // Valid if username is present AND there are no errors currently displayed (debounced result)
    return username.length > 0 && !usernameError;
  }, [usernameError, username]);

  // Handle submission
  const handleCreateAccount = useCallback(() => {
    // Final synchronous validation check before submitting
    const error = validateUsername(username);
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
  }, [username, displayName, isFormValid, navigation, setUsername, setDisplayName, nextStep]);

  const handleSkip = useCallback(() => {
    // Deferred auth
    setUsername(null);
    setDisplayName(null);
    nextStep();
    navigation.navigate('ArchetypeSelection');
  }, [navigation, setUsername, setDisplayName, nextStep]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProgressIndicator currentStep={2} totalSteps={3} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <PixelText variant="h2" align="center" colorKey="primary">
              CREATE PROFILE
            </PixelText>
             <PixelText variant="bodySmall" align="center" colorKey="secondary" style={styles.subtitle}>
                Choose your unique username and optional display name.
            </PixelText>
          </View>

          <View style={styles.form}>
            <PixelInput
              label="Username *"
              value={username}
              onChangeText={handleUsernameChange}
              placeholder="Enter username..."
              // Show error only after interaction and if an error exists
              error={!isPristine && !!usernameError ? usernameError : false}
              // Show success if form is valid and user has interacted
              success={!isPristine && isFormValid}
              accessibilityLabel="Username Input"
              accessibilityHint="Required. 3-20 characters. Letters, numbers, and underscores only."
              autoCapitalize="none"
              autoCorrect={false}
              helperText="3-20 characters"
            />

            <View style={styles.inputSpacer} />

            <PixelInput
              label="Display Name"
              value={displayName}
              onChangeText={handleDisplayNameChange}
              placeholder="Optional"
              accessibilityLabel="Display Name Input"
              accessibilityHint="Optional. How others will see you. Max 50 characters."
              maxLength={50}
              helperText="How others see you"
            />
          </View>
        </ScrollView>

        <View style={styles.ctaContainer}>
          <PixelButton
            variant="primary"
            onPress={handleCreateAccount}
            // Disable if invalid, or if pristine and empty (initial state)
            disabled={!isFormValid && (!isPristine || username.length === 0)}
            accessibilityLabel="Create Account"
            accessibilityHint="Saves profile information and proceeds to the next step."
          >
            CREATE ACCOUNT
          </PixelButton>
          <View style={styles.secondaryCta}>
            <PixelButton
              variant="tertiary"
              onPress={handleSkip}
              accessibilityLabel="Skip for now"
              accessibilityHint="Skips profile creation and proceeds to archetype selection."
            >
              Skip for now
            </PixelButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    paddingTop: tokens.spacing[5], // 32pt
  },
  header: {
    marginBottom: tokens.spacing[5], // 32pt
  },
  subtitle: {
    marginTop: tokens.spacing[2],
  },
  form: {
    flex: 1,
  },
  inputSpacer: {
    height: tokens.spacing[4], // 24pt
  },
  ctaContainer: {
    paddingHorizontal: tokens.component.screenPaddingX,
    paddingBottom: tokens.spacing[6], // 40pt
    paddingTop: tokens.spacing[3],
    backgroundColor: tokens.colors.background.primary,
  },
  secondaryCta: {
    marginTop: tokens.spacing[3], // 16pt
  },
});

export default ProfileSetupScreen;
