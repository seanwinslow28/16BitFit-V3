/**
 * PixelBorder - Retro bordered container component
 * Features: DMG palette, configurable border styles
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { colors, spacing, borderWidth, borderRadius } from '../../../design-system/tokens';

export interface PixelBorderProps {
  /**
   * Content to wrap
   */
  children: React.ReactNode;

  /**
   * Border thickness
   */
  thickness?: 'thin' | 'medium' | 'thick';

  /**
   * Border color
   */
  borderColor?: 'darkest' | 'dark' | 'light' | 'lightest';

  /**
   * Background color
   */
  backgroundColor?: 'darkest' | 'dark' | 'light' | 'lightest' | 'transparent';

  /**
   * Border radius
   */
  rounded?: 'none' | 'subtle' | 'small';

  /**
   * Internal padding
   */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

export const PixelBorder: React.FC<PixelBorderProps> = ({
  children,
  thickness = 'medium',
  borderColor = 'dark',
  backgroundColor = 'transparent',
  rounded = 'none',
  padding = 'md',
  style,
}) => {
  const containerStyles: ViewStyle[] = [
    styles.base,
    { borderWidth: borderWidth[thickness] },
    { borderColor: borderColor === 'transparent' ? 'transparent' : colors.dmg[borderColor] },
    { backgroundColor: backgroundColor === 'transparent' ? 'transparent' : colors.dmg[backgroundColor] },
    { borderRadius: borderRadius[rounded] },
    padding !== 'none' && { padding: spacing[padding] },
    style,
  ];

  return <View style={containerStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    // Base border container
  },
});

export default PixelBorder;
