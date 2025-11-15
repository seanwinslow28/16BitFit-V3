/**
 * PixelButton - Retro Game Boy-style button component
 * Features: DMG palette, haptic feedback, press animations
 */

import React, { useCallback, useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
  AccessibilityRole,
} from 'react-native';
import { colors, spacing, borderWidth, typography, touchTarget } from '../../../design-system/tokens';
import { durations, easings } from '../../../design-system/animations';

export interface PixelButtonProps {
  /**
   * Button text label
   */
  children: string;

  /**
   * Press handler
   */
  onPress: () => void;

  /**
   * Button variant
   * - primary: Light background, dark text (default)
   * - secondary: Dark background, light text
   * - ghost: Transparent background, bordered
   */
  variant?: 'primary' | 'secondary' | 'ghost';

  /**
   * Button size
   * - small: 32px height
   * - medium: 44px height (default)
   * - large: 60px height
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Full width button
   */
  fullWidth?: boolean;

  /**
   * Custom accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Custom accessibility hint
   */
  accessibilityHint?: string;

  /**
   * Custom styles for container
   */
  style?: ViewStyle;

  /**
   * Custom styles for text
   */
  textStyle?: TextStyle;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: durations.fast,
      easing: easings.easeOut,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: durations.fast,
      easing: easings.spring,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      onPress();
    }
  }, [disabled, onPress]);

  const containerStyle: ViewStyle[] = [
    styles.base,
    styles[size],
    styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const labelStyle: TextStyle[] = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles],
    styles[`${size}Text` as keyof typeof styles],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole={'button' as AccessibilityRole}
        accessibilityLabel={accessibilityLabel || children}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        style={containerStyle}
      >
        <Text style={labelStyle}>{children}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borderWidth.medium,
    paddingHorizontal: spacing.md,
  },

  // Sizes
  small: {
    minHeight: 32,
    paddingVertical: spacing.xs,
  },
  medium: {
    minHeight: touchTarget.minimum,
    paddingVertical: spacing.sm,
  },
  large: {
    minHeight: touchTarget.optimal,
    paddingVertical: spacing.md,
  },

  // Variants
  primary: {
    backgroundColor: colors.dmg.light,
    borderColor: colors.dmg.dark,
  },
  secondary: {
    backgroundColor: colors.dmg.dark,
    borderColor: colors.dmg.darkest,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.dmg.dark,
  },

  // Disabled state
  disabled: {
    backgroundColor: colors.dmg.dark,
    borderColor: colors.dmg.darkest,
    opacity: 0.5,
  },

  // Full width
  fullWidth: {
    width: '100%',
  },

  // Text styles
  text: {
    fontFamily: typography.fonts.pixel,
    textAlign: 'center',
  },

  // Variant text styles
  primaryText: {
    color: colors.dmg.darkest,
    fontSize: typography.sizes.sm,
  },
  secondaryText: {
    color: colors.dmg.lightest,
    fontSize: typography.sizes.sm,
  },
  ghostText: {
    color: colors.dmg.dark,
    fontSize: typography.sizes.sm,
  },

  // Size text styles
  smallText: {
    fontSize: typography.sizes.xs,
  },
  mediumText: {
    fontSize: typography.sizes.sm,
  },
  largeText: {
    fontSize: typography.sizes.md,
  },

  // Disabled text
  disabledText: {
    color: colors.dmg.darkest,
  },
});

export default PixelButton;
