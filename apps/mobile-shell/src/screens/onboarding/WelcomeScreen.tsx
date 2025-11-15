/**
 * WelcomeScreen - Onboarding welcome screen
 * Story 1.4 - First screen in onboarding flow
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { PixelText } from '../../components/atoms/PixelText';
import { PixelButton } from '../../components/atoms/PixelButton';
import { PixelSprite } from '../../components/atoms/PixelSprite';
import { ProgressIndicator } from '../../components/molecules/ProgressIndicator';
import { colors, spacing } from '../../design-system/tokens';

interface WelcomeScreenProps {
  navigation: any; // In real app, use proper navigation type
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const handleGetStarted = (): void => {
    navigation.navigate('ArchetypeSelection');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={1} totalSteps={4} />

        {/* Hero Section */}
        <View style={styles.hero}>
          <PixelSprite
            source={{ uri: 'https://via.placeholder.com/96' }}
            size="hero"
            accessibilityLabel="16BitFit logo"
          />
          <PixelText
            variant="pixel"
            size="xxl"
            color="darkest"
            align="center"
            style={styles.title}
          >
            16BitFit
          </PixelText>
          <PixelText
            variant="body"
            size="md"
            color="dark"
            align="center"
            style={styles.subtitle}
          >
            Turn your steps into epic battles
          </PixelText>
        </View>

        {/* Description */}
        <View style={styles.description}>
          <PixelText variant="body" size="sm" color="darkest" align="center">
            Transform your daily fitness into a retro RPG adventure. Track steps,
            battle bosses, and level up your character!
          </PixelText>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <PixelText variant="pixel" size="sm" color="light">
              • Real Steps
            </PixelText>
            <PixelText variant="body" size="xs" color="dark">
              Sync with Apple Health / Google Fit
            </PixelText>
          </View>

          <View style={styles.feature}>
            <PixelText variant="pixel" size="sm" color="light">
              • Epic Battles
            </PixelText>
            <PixelText variant="body" size="xs" color="dark">
              Street Fighter-inspired combat
            </PixelText>
          </View>

          <View style={styles.feature}>
            <PixelText variant="pixel" size="sm" color="light">
              • Level Up
            </PixelText>
            <PixelText variant="body" size="xs" color="dark">
              Earn XP and unlock abilities
            </PixelText>
          </View>
        </View>
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.footer}>
        <PixelButton
          onPress={handleGetStarted}
          variant="primary"
          size="large"
          fullWidth
        >
          Get Started
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

  content: {
    flexGrow: 1,
    padding: spacing.xl,
  },

  hero: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },

  title: {
    marginTop: spacing.lg,
  },

  subtitle: {
    marginTop: spacing.sm,
  },

  description: {
    marginBottom: spacing.xl,
  },

  features: {
    gap: spacing.lg,
  },

  feature: {
    gap: spacing.xs,
  },

  footer: {
    padding: spacing.xl,
    borderTopWidth: 3,
    borderTopColor: colors.dmg.dark,
    backgroundColor: colors.dmg.lightest,
  },
});

export default WelcomeScreen;
