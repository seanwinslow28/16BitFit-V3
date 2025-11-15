/**
 * FormField - Composite form field with label, input, validation, and error
 * Features: DMG palette, shake animation on error
 * CRITICAL for Story 1.4 - Profile Setup
 */

import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { PixelText } from '../../atoms/PixelText';
import { PixelInput } from '../../atoms/PixelInput';
import { PixelIcon } from '../../atoms/PixelIcon';
import { spacing } from '../../../design-system/tokens';
import { durations } from '../../../design-system/animations';

export interface FormFieldProps {
  /**
   * Field label
   */
  label: string;

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
   * Field state
   */
  state?: 'default' | 'error' | 'success';

  /**
   * Error message
   */
  errorMessage?: string;

  /**
   * Help text
   */
  helpText?: string;

  /**
   * Required field
   */
  required?: boolean;

  /**
   * Input type
   */
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';

  /**
   * Auto-capitalize
   */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  state = 'default',
  errorMessage,
  helpText,
  required = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Shake animation on error
  useEffect(() => {
    if (state === 'error') {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: durations.fast / 4,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: durations.fast / 4,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: durations.fast / 4,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: durations.fast / 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [state, shakeAnim]);

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      <View style={styles.labelContainer}>
        <PixelText variant="pixel" size="xs" color="darkest">
          {label}
          {required && (
            <PixelText variant="pixel" size="xs" color="dark">
              {' '}*
            </PixelText>
          )}
        </PixelText>
      </View>

      {/* Input with validation icon */}
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <View style={styles.inputContainer}>
          <PixelInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            state={state}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            containerStyle={styles.input}
          />
          {state === 'success' && (
            <View style={styles.icon}>
              <PixelIcon name="check" size="xs" color="light" />
            </View>
          )}
          {state === 'error' && (
            <View style={styles.icon}>
              <PixelIcon name="error" size="xs" color="darkest" />
            </View>
          )}
        </View>
      </Animated.View>

      {/* Error message or help text */}
      {state === 'error' && errorMessage && (
        <View style={styles.messageContainer}>
          <PixelText variant="body" size="xs" color="darkest">
            {errorMessage}
          </PixelText>
        </View>
      )}
      {state === 'default' && helpText && (
        <View style={styles.messageContainer}>
          <PixelText variant="body" size="xs" color="dark">
            {helpText}
          </PixelText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  labelContainer: {
    marginBottom: spacing.xs,
  },

  inputContainer: {
    position: 'relative',
  },

  input: {
    flex: 1,
  },

  icon: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -8 }],
  },

  messageContainer: {
    marginTop: spacing.xs,
  },
});

export default FormField;
