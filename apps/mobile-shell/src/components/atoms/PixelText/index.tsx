/**
 * PixelText - Retro pixel font text component
 * Supports both pixel font and body font with DMG palette
 */

import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { colors, typography } from '../../../design-system/tokens';

export interface PixelTextProps {
  /**
   * Text content
   */
  children: React.ReactNode;

  /**
   * Font variant
   * - pixel: Press Start 2P font (default)
   * - body: Montserrat font
   */
  variant?: 'pixel' | 'body';

  /**
   * Font weight (only for body variant)
   */
  weight?: 'regular' | 'semibold' | 'bold';

  /**
   * Text size preset
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  /**
   * Text color from DMG palette
   */
  color?: 'darkest' | 'dark' | 'light' | 'lightest';

  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Number of lines before truncation
   */
  numberOfLines?: number;

  /**
   * Custom styles
   */
  style?: TextStyle;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

export const PixelText: React.FC<PixelTextProps> = ({
  children,
  variant = 'pixel',
  weight = 'regular',
  size = 'md',
  color = 'darkest',
  align = 'left',
  numberOfLines,
  style,
  accessibilityLabel,
}) => {
  const textStyles: TextStyle[] = [
    styles.base,
    styles[variant],
    variant === 'body' && styles[weight],
    styles[size],
    styles[color],
    align !== 'left' && { textAlign: align },
    style,
  ];

  return (
    <Text
      style={textStyles}
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    textAlign: 'left',
  },

  // Variants
  pixel: {
    fontFamily: typography.fonts.pixel,
  },
  body: {
    fontFamily: typography.fonts.body,
  },

  // Weights (body only)
  regular: {
    fontFamily: typography.fonts.body,
  },
  semibold: {
    fontFamily: typography.fonts.bodySemiBold,
  },
  bold: {
    fontFamily: typography.fonts.bodyBold,
  },

  // Sizes
  xs: {
    fontSize: typography.sizes.xs,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
  },
  sm: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  md: {
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * typography.lineHeights.normal,
  },
  lg: {
    fontSize: typography.sizes.lg,
    lineHeight: typography.sizes.lg * typography.lineHeights.normal,
  },
  xl: {
    fontSize: typography.sizes.xl,
    lineHeight: typography.sizes.xl * typography.lineHeights.normal,
  },
  xxl: {
    fontSize: typography.sizes.xxl,
    lineHeight: typography.sizes.xxl * typography.lineHeights.normal,
  },

  // Colors
  darkest: {
    color: colors.dmg.darkest,
  },
  dark: {
    color: colors.dmg.dark,
  },
  light: {
    color: colors.dmg.light,
  },
  lightest: {
    color: colors.dmg.lightest,
  },
});

export default PixelText;
