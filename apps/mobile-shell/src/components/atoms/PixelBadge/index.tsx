/**
 * PixelBadge - Notification badge component
 * Features: DMG palette, count display, dot mode
 */

import React from 'react';
import { View, Text, ViewStyle, StyleSheet } from 'react-native';
import { colors, spacing, borderWidth, typography } from '../../../design-system/tokens';

export interface PixelBadgeProps {
  /**
   * Badge count (optional)
   */
  count?: number;

  /**
   * Maximum count to display (shows "99+" if exceeded)
   */
  maxCount?: number;

  /**
   * Badge variant
   */
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral';

  /**
   * Show as dot (no count)
   */
  dot?: boolean;

  /**
   * Custom styles
   */
  style?: ViewStyle;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

export const PixelBadge: React.FC<PixelBadgeProps> = ({
  count = 0,
  maxCount = 99,
  variant = 'error',
  dot = false,
  style,
  accessibilityLabel,
}) => {
  if (count === 0 && !dot) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const containerStyles: ViewStyle[] = [
    styles.base,
    styles[variant],
    dot && styles.dot,
    style,
  ];

  return (
    <View
      style={containerStyles}
      accessibilityLabel={accessibilityLabel || `${count} notifications`}
      accessibilityRole="text"
    >
      {!dot && <Text style={styles.text}>{displayCount}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    minWidth: 20,
    minHeight: 20,
    borderRadius: 10,
    borderWidth: borderWidth.thin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },

  dot: {
    minWidth: 8,
    minHeight: 8,
    borderRadius: 4,
    paddingHorizontal: 0,
  },

  // Variants
  success: {
    backgroundColor: colors.dmg.light,
    borderColor: colors.dmg.dark,
  },
  error: {
    backgroundColor: colors.dmg.darkest,
    borderColor: colors.dmg.dark,
  },
  warning: {
    backgroundColor: colors.dmg.light,
    borderColor: colors.dmg.darkest,
  },
  info: {
    backgroundColor: colors.dmg.dark,
    borderColor: colors.dmg.darkest,
  },
  neutral: {
    backgroundColor: colors.dmg.dark,
    borderColor: colors.dmg.darkest,
  },

  text: {
    fontFamily: typography.fonts.pixel,
    fontSize: typography.sizes.xs,
    color: colors.dmg.lightest,
  },
});

export default PixelBadge;
