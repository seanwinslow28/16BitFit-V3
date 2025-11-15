/**
 * ToastNotification - Slide-in toast notification
 * Features: DMG palette, auto-dismiss, slide animation
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { PixelText } from '../../atoms/PixelText';
import { PixelIcon, IconName } from '../../atoms/PixelIcon';
import { PixelBorder } from '../../atoms/PixelBorder';
import { colors, spacing, zIndex } from '../../../design-system/tokens';
import { durations, easings } from '../../../design-system/animations';

export interface ToastNotificationProps {
  /**
   * Toast message
   */
  message: string;

  /**
   * Toast variant
   */
  variant?: 'success' | 'error' | 'warning' | 'info';

  /**
   * Visibility state
   */
  visible: boolean;

  /**
   * Auto-dismiss duration (ms), 0 to disable
   */
  duration?: number;

  /**
   * Dismiss handler
   */
  onDismiss: () => void;

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

const variantConfig: Record<string, { icon: IconName; bgColor: keyof typeof colors.dmg }> = {
  success: { icon: 'check', bgColor: 'light' },
  error: { icon: 'error', bgColor: 'darkest' },
  warning: { icon: 'info', bgColor: 'lightest' },
  info: { icon: 'info', bgColor: 'dark' },
};

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  variant = 'info',
  visible,
  duration = 3000,
  onDismiss,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const config = variantConfig[variant];

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: durations.normal,
        easing: easings.emphasized,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss
      if (duration > 0) {
        const timer = setTimeout(() => {
          // Slide out
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: durations.normal,
            easing: easings.decelerated,
            useNativeDriver: true,
          }).start(() => {
            onDismiss();
          });
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      // Slide out
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: durations.normal,
        easing: easings.decelerated,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, duration, slideAnim, onDismiss]);

  if (!visible && slideAnim._value === -100) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
        style,
      ]}
    >
      <PixelBorder
        thickness="medium"
        borderColor="darkest"
        backgroundColor={config.bgColor}
        padding="md"
      >
        <View style={styles.content}>
          <PixelIcon name={config.icon} size="sm" color="lightest" />
          <PixelText
            variant="body"
            size="sm"
            color={variant === 'error' || variant === 'info' ? 'lightest' : 'darkest'}
            style={styles.message}
          >
            {message}
          </PixelText>
        </View>
      </PixelBorder>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.md,
    right: spacing.md,
    zIndex: zIndex.toast,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  message: {
    flex: 1,
  },
});

export default ToastNotification;
