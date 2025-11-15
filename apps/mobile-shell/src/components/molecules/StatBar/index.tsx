/**
 * StatBar - Labeled progress bar for character stats
 * Features: DMG palette, label + value + progress bar
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { PixelText } from '../../atoms/PixelText';
import { PixelProgressBar } from '../../atoms/PixelProgressBar';
import { spacing } from '../../../design-system/tokens';

export interface StatBarProps {
  /**
   * Stat label (e.g., "Strength")
   */
  label: string;

  /**
   * Current value
   */
  value: number;

  /**
   * Maximum value
   */
  max: number;

  /**
   * Show numeric value
   */
  showValue?: boolean;

  /**
   * Bar height
   */
  barHeight?: number;

  /**
   * Enable color thresholds
   */
  colorThresholds?: boolean;

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  max,
  showValue = true,
  barHeight = 12,
  colorThresholds = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Label and value */}
      <View style={styles.header}>
        <PixelText variant="body" size="sm" color="darkest">
          {label}
        </PixelText>
        {showValue && (
          <PixelText variant="body" size="sm" color="dark">
            {value}/{max}
          </PixelText>
        )}
      </View>

      {/* Progress bar */}
      <PixelProgressBar
        value={value}
        max={max}
        height={barHeight}
        colorThresholds={colorThresholds}
        animated
        accessibilityLabel={`${label}: ${value} out of ${max}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
});

export default StatBar;
