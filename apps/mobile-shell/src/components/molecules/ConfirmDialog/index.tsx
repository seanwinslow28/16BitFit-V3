/**
 * ConfirmDialog - Confirmation modal dialog
 * Features: DMG palette, modal overlay, confirm/cancel actions
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal,
  Animated,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { PixelText } from '../../atoms/PixelText';
import { PixelBorder } from '../../atoms/PixelBorder';
import { PixelButton } from '../../atoms/PixelButton';
import { colors, spacing, opacity, zIndex } from '../../../design-system/tokens';
import { durations, easings } from '../../../design-system/animations';

export interface ConfirmDialogProps {
  /**
   * Visibility state
   */
  visible: boolean;

  /**
   * Dialog title
   */
  title: string;

  /**
   * Dialog message
   */
  message?: string;

  /**
   * Confirm button label
   */
  confirmLabel?: string;

  /**
   * Cancel button label
   */
  cancelLabel?: string;

  /**
   * Confirm button variant
   */
  confirmVariant?: 'primary' | 'secondary' | 'ghost';

  /**
   * Confirm handler
   */
  onConfirm: () => void;

  /**
   * Cancel handler
   */
  onCancel: () => void;

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: durations.normal,
          easing: easings.emphasized,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: durations.normal,
          easing: easings.standard,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: durations.normal,
          easing: easings.decelerated,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: durations.normal,
          easing: easings.standard,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Animated.View
          style={[
            styles.backdropOverlay,
            { opacity: opacityAnim },
          ]}
        />
      </Pressable>

      {/* Dialog */}
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.dialog,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
            style,
          ]}
        >
          <PixelBorder
            thickness="thick"
            borderColor="darkest"
            backgroundColor="lightest"
            padding="lg"
          >
            {/* Title */}
            <PixelText
              variant="pixel"
              size="md"
              color="darkest"
              align="center"
              style={styles.title}
            >
              {title}
            </PixelText>

            {/* Message */}
            {message && (
              <PixelText
                variant="body"
                size="sm"
                color="dark"
                align="center"
                style={styles.message}
              >
                {message}
              </PixelText>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <View style={styles.actionButton}>
                <PixelButton
                  onPress={onCancel}
                  variant="ghost"
                  fullWidth
                >
                  {cancelLabel}
                </PixelButton>
              </View>
              <View style={styles.actionButton}>
                <PixelButton
                  onPress={() => {
                    onConfirm();
                    onCancel(); // Close dialog after confirm
                  }}
                  variant={confirmVariant}
                  fullWidth
                >
                  {confirmLabel}
                </PixelButton>
              </View>
            </View>
          </PixelBorder>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.dmg.darkest,
    opacity: opacity.visible,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },

  dialog: {
    width: '100%',
    maxWidth: 400,
    zIndex: zIndex.modal,
  },

  title: {
    marginBottom: spacing.md,
  },

  message: {
    marginBottom: spacing.lg,
  },

  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  actionButton: {
    flex: 1,
  },
});

export default ConfirmDialog;
