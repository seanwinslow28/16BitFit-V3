/**
 * ProgressIndicator - Step dots showing "Step X of Y"
 * Features: DMG palette, current step highlighting
 * CRITICAL for Story 1.4 - Onboarding Flow
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { PixelText } from '../../atoms/PixelText';
import { colors, spacing } from '../../../design-system/tokens';

export interface ProgressIndicatorProps {
  /**
   * Current step (1-based)
   */
  currentStep: number;

  /**
   * Total number of steps
   */
  totalSteps: number;

  /**
   * Show step label ("Step X of Y")
   */
  showLabel?: boolean;

  /**
   * Dot size
   */
  dotSize?: number;

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  showLabel = true,
  dotSize = 12,
  style,
}) => {
  const dots = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={[styles.container, style]}>
      {/* Dots */}
      <View style={styles.dotsContainer}>
        {dots.map((step) => {
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <View
              key={step}
              style={[
                styles.dot,
                { width: dotSize, height: dotSize, borderRadius: dotSize / 2 },
                isActive && styles.activeDot,
                isCompleted && styles.completedDot,
              ]}
              accessibilityLabel={`Step ${step} of ${totalSteps}${isActive ? ' (current)' : ''}${isCompleted ? ' (completed)' : ''}`}
            />
          );
        })}
      </View>

      {/* Label */}
      {showLabel && (
        <View style={styles.labelContainer}>
          <PixelText variant="body" size="xs" color="dark" align="center">
            Step {currentStep} of {totalSteps}
          </PixelText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  dot: {
    backgroundColor: colors.dmg.dark,
    borderWidth: 2,
    borderColor: colors.dmg.darkest,
  },

  activeDot: {
    backgroundColor: colors.dmg.light,
    borderColor: colors.dmg.darkest,
  },

  completedDot: {
    backgroundColor: colors.dmg.light,
    borderColor: colors.dmg.dark,
  },

  labelContainer: {
    marginTop: spacing.sm,
  },
});

export default ProgressIndicator;
