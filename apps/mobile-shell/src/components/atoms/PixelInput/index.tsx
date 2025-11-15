/**
 * PixelInput - Retro Game Boy-style text input component
 * Features: DMG palette, border styles, validation states
 */

import React, { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderWidth, typography, touchTarget } from '../../../design-system/tokens';

export interface PixelInputProps extends Omit<TextInputProps, 'style'> {
  /**
   * Input value
   */
  value: string;

  /**
   * Change handler
   */
  onChangeText: (text: string) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Input state
   */
  state?: 'default' | 'error' | 'success' | 'disabled';

  /**
   * Multiline input
   */
  multiline?: boolean;

  /**
   * Number of lines (multiline only)
   */
  numberOfLines?: number;

  /**
   * Custom container styles
   */
  containerStyle?: ViewStyle;

  /**
   * Custom input styles
   */
  inputStyle?: ViewStyle;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

export const PixelInput: React.FC<PixelInputProps> = ({
  value,
  onChangeText,
  placeholder,
  state = 'default',
  multiline = false,
  numberOfLines = 1,
  containerStyle,
  inputStyle,
  accessibilityLabel,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyles: ViewStyle[] = [
    styles.container,
    styles[state],
    isFocused && styles.focused,
    containerStyle,
  ];

  const inputStyles = [
    styles.input,
    multiline && { height: numberOfLines * 20 },
    inputStyle,
  ];

  return (
    <View style={containerStyles}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.dmg.dark}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={state !== 'disabled'}
        accessibilityLabel={accessibilityLabel}
        style={inputStyles}
        {...textInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: borderWidth.medium,
    borderColor: colors.dmg.dark,
    backgroundColor: colors.dmg.lightest,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: touchTarget.minimum,
  },

  input: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.md,
    color: colors.dmg.darkest,
    padding: 0,
    margin: 0,
  },

  // States
  default: {
    borderColor: colors.dmg.dark,
  },
  error: {
    borderColor: colors.dmg.darkest,
    borderWidth: borderWidth.thick,
  },
  success: {
    borderColor: colors.dmg.light,
    borderWidth: borderWidth.thick,
  },
  disabled: {
    backgroundColor: colors.dmg.dark,
    opacity: 0.5,
  },
  focused: {
    borderColor: colors.dmg.light,
    borderWidth: borderWidth.thick,
  },
});

export default PixelInput;
