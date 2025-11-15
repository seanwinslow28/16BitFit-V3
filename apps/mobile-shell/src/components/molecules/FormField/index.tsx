/**
 * FormField - Complete form input with label and validation
 *
 * Combines label, input, helper text, and error messages into a cohesive form field.
 * Supports validation states with icons and shake animation for errors.
 *
 * @example
 * <FormField
 *   label="Username"
 *   value={username}
 *   onChangeText={setUsername}
 *   error={usernameError}
 *   required
 * />
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { PixelText, PixelInput, PixelIcon } from '@/components/atoms';
import { tokens, durations } from '@/design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface FormFieldProps {
  /** Field label */
  label: string;
  /** Current value */
  value: string;
  /** Change handler */
  onChangeText: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Helper text (shown when no error) */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  successText?: string;
  /** Whether field is required */
  required?: boolean;
  /** Validation function */
  validate?: (value: string) => { valid: boolean; message?: string };
  /** Secure text entry (password) */
  secureTextEntry?: boolean;
  /** Auto-capitalize behavior */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** Keyboard type */
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  /** Max length */
  maxLength?: number;
  /** Whether field is disabled */
  disabled?: boolean;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const FormField: React.FC<FormFieldProps> = React.memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    helperText,
    error,
    successText,
    required = false,
    validate,
    secureTextEntry = false,
    autoCapitalize = 'sentences',
    keyboardType = 'default',
    maxLength,
    disabled = false,
  }) => {
    const [touched, setTouched] = useState(false);
    const [validationError, setValidationError] = useState<string | undefined>();
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const showError = (error || (touched && validationError)) && !disabled;
    const showSuccess = !showError && value.length > 0 && !disabled;
    const displayErrorText = error || validationError;

    // Shake animation on error
    useEffect(() => {
      if (showError && displayErrorText) {
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: -5,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 5,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -5,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [showError, displayErrorText, shakeAnim]);

    const handleBlur = () => {
      setTouched(true);
      if (validate) {
        const result = validate(value);
        if (!result.valid) {
          setValidationError(result.message);
        } else {
          setValidationError(undefined);
        }
      }
    };

    const handleChangeText = (text: string) => {
      onChangeText(text);
      if (validationError) {
        setValidationError(undefined);
      }
    };

    return (
      <View style={styles.container}>
        {/* Label */}
        <PixelText variant="inputLabel" style={styles.label}>
          {label}
          {required && (
            <PixelText variant="inputLabel" colorKey="secondary">
              {' *'}
            </PixelText>
          )}
        </PixelText>

        {/* Input with shake animation */}
        <Animated.View
          style={[
            styles.inputWrapper,
            {
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        >
          <PixelInput
            value={value}
            onChangeText={handleChangeText}
            onBlur={handleBlur}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            maxLength={maxLength}
            editable={!disabled}
            style={[
              showError && styles.inputError,
              showSuccess && styles.inputSuccess,
            ]}
          />

          {/* Success icon */}
          {showSuccess && (
            <View style={styles.successIcon}>
              <PixelIcon
                name="check"
                size={20}
                color={tokens.colors.dmg.light}
              />
            </View>
          )}
        </Animated.View>

        {/* Error text */}
        {showError && displayErrorText && (
          <PixelText variant="caption" colorKey="secondary">
            {displayErrorText}
          </PixelText>
        )}

        {/* Success text */}
        {showSuccess && successText && (
          <PixelText variant="caption" colorKey="tertiary">
            {successText}
          </PixelText>
        )}

        {/* Helper text */}
        {!showError && !showSuccess && helperText && (
          <PixelText variant="caption" colorKey="secondary">
            {helperText}
          </PixelText>
        )}
      </View>
    );
  }
);

FormField.displayName = 'FormField';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputError: {
    borderColor: tokens.colors.feedback.error,
  },
  inputSuccess: {
    borderColor: tokens.colors.dmg.light,
  },
  successIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10, // Half of icon size for centering
  },
});

export default FormField;
