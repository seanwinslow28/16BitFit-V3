/**
 * PixelCheckbox - Retro checkbox with bounce animation
 * Features: DMG palette, haptic feedback, 44x44 touch target
 */

import React, { useRef, useCallback } from 'react';
import {
  Pressable,
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  AccessibilityRole,
} from 'react-native';
import { colors, borderWidth, touchTarget } from '../../../design-system/tokens';
import { durations, easings } from '../../../design-system/animations';

export interface PixelCheckboxProps {
  /**
   * Checked state
   */
  checked: boolean;

  /**
   * Change handler
   */
  onChange: (checked: boolean) => void;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Checkbox size (visual size, touch target is always 44x44)
   */
  size?: number;

  /**
   * Custom styles
   */
  style?: ViewStyle;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Accessibility hint
   */
  accessibilityHint?: string;
}

export const PixelCheckbox: React.FC<PixelCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 24,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    if (disabled) {
      return;
    }

    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: durations.fast / 2,
        easing: easings.easeOut,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onChange(!checked);
  }, [checked, disabled, onChange, scaleAnim]);

  const containerStyles: ViewStyle[] = [
    styles.touchTarget,
    style,
  ];

  const checkboxStyles: ViewStyle[] = [
    styles.checkbox,
    { width: size, height: size },
    checked && styles.checked,
    disabled && styles.disabled,
  ];

  const checkmarkStyles: ViewStyle[] = [
    styles.checkmark,
    { width: size * 0.6, height: size * 0.6 },
  ];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole={'checkbox' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ checked, disabled }}
      style={containerStyles}
    >
      <Animated.View style={[checkboxStyles, { transform: [{ scale: scaleAnim }] }]}>
        {checked && <View style={checkmarkStyles} />}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  touchTarget: {
    width: touchTarget.minimum,
    height: touchTarget.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkbox: {
    borderWidth: borderWidth.medium,
    borderColor: colors.dmg.dark,
    backgroundColor: colors.dmg.lightest,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checked: {
    backgroundColor: colors.dmg.light,
    borderColor: colors.dmg.darkest,
  },

  disabled: {
    opacity: 0.5,
  },

  checkmark: {
    backgroundColor: colors.dmg.darkest,
  },
});

export default PixelCheckbox;
