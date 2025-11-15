/**
 * OnboardingCompleteScreen - Onboarding completion screen
 * Story 1.4 - Final screen in onboarding flow
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PixelText } from '../../components/atoms/PixelText';
import { PixelButton } from '../../components/atoms/PixelButton';
import { PixelIcon } from '../../components/atoms/PixelIcon';
import { ProgressIndicator } from '../../components/molecules/ProgressIndicator';
import { colors, spacing } from '../../design-system/tokens';

interface OnboardingCompleteScreenProps {
  navigation: any; // In real app, use proper navigation type
  route: {
    params: {
      archetypeId: string;
      profile: {
        username: string;
        displayName: string;
        email: string;
      };
    };
  };
}

export const OnboardingCompleteScreen: React.FC<OnboardingCompleteScreenProps> = ({
  navigation,
  route,
}) => {
  const { archetypeId, profile } = route.params;

  const handleGetStarted = (): void => {
    // In real app, navigate to main app
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <ProgressIndicator currentStep={4} totalSteps={4} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <PixelIcon name="check" size="lg" color="light" />
        </View>

        {/* Title */}
        <PixelText variant="pixel" size="xxl" color="darkest" align="center">
          You're Ready!
        </PixelText>

        {/* Description */}
        <PixelText
          variant="body"
          size="md"
          color="dark"
          align="center"
          style={styles.description}
        >
          Welcome to 16BitFit, {profile.displayName}! Your character is ready for
          battle. Start tracking your steps to fuel your first fight!
        </PixelText>

        {/* Info */}
        <View style={styles.info}>
          <PixelText variant="body" size="sm" color="darkest" align="center">
            💡 Tip: Every 1,000 steps = 1 Energy Point for battles
          </PixelText>
        </View>
      </View>

      {/* CTA Button */}
      <View style={styles.footer}>
        <PixelButton
          onPress={handleGetStarted}
          variant="primary"
          size="large"
          fullWidth
        >
          Start Your Journey
        </PixelButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dmg.lightest,
  },

  progressContainer: {
    padding: spacing.xl,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },

  iconContainer: {
    marginBottom: spacing.xl,
  },

  description: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },

  info: {
    padding: spacing.md,
    backgroundColor: colors.dmg.light,
    borderRadius: 4,
  },

  footer: {
    padding: spacing.xl,
    borderTopWidth: 3,
    borderTopColor: colors.dmg.dark,
    backgroundColor: colors.dmg.lightest,
  },
});

export default OnboardingCompleteScreen;
