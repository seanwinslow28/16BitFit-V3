/**
 * ActionSheet - Bottom sheet modal for actions
 * Features: DMG palette, slide-up animation
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal,
  Animated,
  Pressable,
  StyleSheet,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { PixelText } from '../../atoms/PixelText';
import { PixelBorder } from '../../atoms/PixelBorder';
import { PixelButton } from '../../atoms/PixelButton';
import { colors, spacing, opacity, zIndex } from '../../../design-system/tokens';
import { durations, easings } from '../../../design-system/animations';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ActionSheetOption {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'destructive';
}

export interface ActionSheetProps {
  /**
   * Visibility state
   */
  visible: boolean;

  /**
   * Sheet title
   */
  title?: string;

  /**
   * Action options
   */
  options: ActionSheetOption[];

  /**
   * Dismiss handler
   */
  onDismiss: () => void;

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  title,
  options,
  onDismiss,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
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
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
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
  }, [visible, slideAnim, opacityAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Animated.View
          style={[
            styles.backdropOverlay,
            { opacity: opacityAnim },
          ]}
        />
      </Pressable>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideAnim }] },
          style,
        ]}
      >
        <PixelBorder
          thickness="medium"
          borderColor="darkest"
          backgroundColor="lightest"
          padding="lg"
        >
          {/* Title */}
          {title && (
            <View style={styles.titleContainer}>
              <PixelText variant="pixel" size="md" color="darkest" align="center">
                {title}
              </PixelText>
            </View>
          )}

          {/* Options */}
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <PixelButton
                key={index}
                onPress={() => {
                  option.onPress();
                  onDismiss();
                }}
                variant={option.variant === 'destructive' ? 'secondary' : 'primary'}
                fullWidth
                style={styles.option}
              >
                {option.label}
              </PixelButton>
            ))}
          </View>

          {/* Cancel button */}
          <PixelButton
            onPress={onDismiss}
            variant="ghost"
            fullWidth
            style={styles.cancelButton}
          >
            Cancel
          </PixelButton>
        </PixelBorder>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },

  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.dmg.darkest,
    opacity: opacity.visible,
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: zIndex.modal,
  },

  titleContainer: {
    marginBottom: spacing.md,
  },

  optionsContainer: {
    gap: spacing.sm,
  },

  option: {
    marginBottom: spacing.sm,
  },

  cancelButton: {
    marginTop: spacing.md,
  },
});

export default ActionSheet;
