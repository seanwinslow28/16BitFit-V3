/**
 * ProfileSetupScreen - User profile setup screen
 * Story 1.4 - Third screen in onboarding flow
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { PixelText } from '../../components/atoms/PixelText';
import { PixelButton } from '../../components/atoms/PixelButton';
import { FormField } from '../../components/molecules/FormField';
import { ProgressIndicator } from '../../components/molecules/ProgressIndicator';
import { colors, spacing } from '../../design-system/tokens';

interface ProfileSetupScreenProps {
  navigation: any; // In real app, use proper navigation type
  route: {
    params: {
      archetypeId: string;
    };
  };
}

interface FormState {
  username: string;
  displayName: string;
  email: string;
}

interface FormErrors {
  username?: string;
  displayName?: string;
  email?: string;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  navigation,
  route,
}) => {
  const { archetypeId } = route.params;

  const [formData, setFormData] = useState<FormState>({
    username: '',
    displayName: '',
    email: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateUsername = (value: string): string | undefined => {
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (value.length > 20) {
      return 'Username must be less than 20 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return undefined;
  };

  const validateDisplayName = (value: string): string | undefined => {
    if (value.length < 1) {
      return 'Display name is required';
    }
    if (value.length > 50) {
      return 'Display name must be less than 50 characters';
    }
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const handleFieldChange = (field: keyof FormState, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFieldBlur = (field: keyof FormState): void => {
    const value = formData[field];
    let error: string | undefined;

    switch (field) {
      case 'username':
        error = validateUsername(value);
        break;
      case 'displayName':
        error = validateDisplayName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
    }

    if (error) {
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleContinue = (): void => {
    // Validate all fields
    const errors: FormErrors = {
      username: validateUsername(formData.username),
      displayName: validateDisplayName(formData.displayName),
      email: validateEmail(formData.email),
    };

    setFormErrors(errors);

    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error !== undefined);

    if (!hasErrors) {
      // Navigate to next screen (permissions or completion)
      navigation.navigate('OnboardingComplete', {
        archetypeId,
        profile: formData,
      });
    }
  };

  const handleBack = (): void => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Indicator */}
          <ProgressIndicator currentStep={3} totalSteps={4} />

          {/* Header */}
          <View style={styles.header}>
            <PixelText variant="pixel" size="xl" color="darkest" align="center">
              Create Your Profile
            </PixelText>
            <PixelText
              variant="body"
              size="sm"
              color="dark"
              align="center"
              style={styles.subtitle}
            >
              Set up your account to get started
            </PixelText>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <FormField
              label="Username"
              value={formData.username}
              onChangeText={(value) => handleFieldChange('username', value)}
              placeholder="Enter username"
              state={formErrors.username ? 'error' : 'default'}
              errorMessage={formErrors.username}
              helpText="3-20 characters, letters, numbers, and underscores only"
              required
              autoCapitalize="none"
            />

            <FormField
              label="Display Name"
              value={formData.displayName}
              onChangeText={(value) => handleFieldChange('displayName', value)}
              placeholder="Enter display name"
              state={formErrors.displayName ? 'error' : 'default'}
              errorMessage={formErrors.displayName}
              helpText="How you'll appear to other players"
              required
              autoCapitalize="words"
            />

            <FormField
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleFieldChange('email', value)}
              placeholder="Enter email"
              state={formErrors.email ? 'error' : 'default'}
              errorMessage={formErrors.email}
              helpText="For account recovery and notifications"
              required
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <View style={styles.actions}>
            <View style={styles.actionButton}>
              <PixelButton onPress={handleBack} variant="ghost" fullWidth>
                Back
              </PixelButton>
            </View>
            <View style={styles.actionButton}>
              <PixelButton onPress={handleContinue} variant="primary" fullWidth>
                Continue
              </PixelButton>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dmg.lightest,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    padding: spacing.xl,
  },

  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },

  subtitle: {
    marginTop: spacing.sm,
  },

  form: {
    gap: spacing.md,
  },

  footer: {
    padding: spacing.xl,
    borderTopWidth: 3,
    borderTopColor: colors.dmg.dark,
    backgroundColor: colors.dmg.lightest,
  },

  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  actionButton: {
    flex: 1,
  },
});

export default ProfileSetupScreen;
