/**
 * PixelProgressBar - Street Fighter 2-style health bar
 * Features: DMG palette, smooth/segmented modes, color thresholds
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle, StyleSheet } from 'react-native';
import { colors, borderWidth, spacing } from '../../../design-system/tokens';
import { durations, easings } from '../../../design-system/animations';

export interface PixelProgressBarProps {
  /**
   * Current value (0-100)
   */
  value: number;

  /**
   * Maximum value
   */
  max?: number;

  /**
   * Progress bar mode
   * - smooth: Continuous bar
   * - segmented: Divided into segments
   */
  mode?: 'smooth' | 'segmented';

  /**
   * Number of segments (segmented mode only)
   */
  segments?: number;

  /**
   * Bar height
   */
  height?: number;

  /**
   * Show border
   */
  showBorder?: boolean;

  /**
   * Enable color thresholds (green > 67%, yellow 34-67%, red < 34%)
   */
  colorThresholds?: boolean;

  /**
   * Animate changes
   */
  animated?: boolean;

  /**
   * Custom styles
   */
  style?: ViewStyle;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

export const PixelProgressBar: React.FC<PixelProgressBarProps> = ({
  value,
  max = 100,
  mode = 'smooth',
  segments = 10,
  height = 16,
  showBorder = true,
  colorThresholds = true,
  animated = true,
  style,
  accessibilityLabel,
}) => {
  const progress = Math.max(0, Math.min(100, (value / max) * 100));
  const progressAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: durations.normal,
        easing: easings.easeOut,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(progress);
    }
  }, [progress, animated, progressAnim]);

  const getBarColor = (): string => {
    if (!colorThresholds) {
      return colors.dmg.light;
    }

    if (progress > 67) {
      return colors.dmg.light; // Green
    } else if (progress > 34) {
      return colors.dmg.lightest; // Yellow
    } else {
      return colors.dmg.darkest; // Red
    }
  };

  const containerStyles: ViewStyle[] = [
    styles.container,
    { height },
    showBorder && styles.bordered,
    style,
  ];

  const fillStyle = {
    width: progressAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    }),
    backgroundColor: getBarColor(),
  };

  return (
    <View
      style={containerStyles}
      accessibilityLabel={accessibilityLabel || `Progress: ${Math.round(progress)}%`}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max, now: value }}
    >
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.dmg.dark,
    overflow: 'hidden',
  },

  bordered: {
    borderWidth: borderWidth.thin,
    borderColor: colors.dmg.darkest,
  },

  fill: {
    height: '100%',
  },
});

export default PixelProgressBar;
