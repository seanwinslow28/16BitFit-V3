/**
 * EmptyState - Empty state placeholder with icon, title, description, and CTA
 * Features: DMG palette, centered layout
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { PixelText } from '../../atoms/PixelText';
import { PixelIcon, IconName } from '../../atoms/PixelIcon';
import { PixelButton } from '../../atoms/PixelButton';
import { spacing } from '../../../design-system/tokens';

export interface EmptyStateProps {
  /**
   * Icon name
   */
  icon?: IconName;

  /**
   * Title text
   */
  title: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * CTA button label
   */
  ctaLabel?: string;

  /**
   * CTA button handler
   */
  onCtaPress?: () => void;

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'info',
  title,
  description,
  ctaLabel,
  onCtaPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Icon */}
      {icon && (
        <View style={styles.iconContainer}>
          <PixelIcon name={icon} size="lg" color="dark" />
        </View>
      )}

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

      {/* Description */}
      {description && (
        <PixelText
          variant="body"
          size="sm"
          color="dark"
          align="center"
          style={styles.description}
        >
          {description}
        </PixelText>
      )}

      {/* CTA Button */}
      {ctaLabel && onCtaPress && (
        <View style={styles.ctaContainer}>
          <PixelButton onPress={onCtaPress} variant="primary">
            {ctaLabel}
          </PixelButton>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },

  iconContainer: {
    marginBottom: spacing.lg,
  },

  title: {
    marginBottom: spacing.sm,
  },

  description: {
    marginBottom: spacing.lg,
  },

  ctaContainer: {
    marginTop: spacing.md,
  },
});

export default EmptyState;
