/**
 * PixelDivider - Horizontal divider component
 * Features: DMG palette, configurable thickness
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { colors, borderWidth, spacing } from '../../../design-system/tokens';

export interface PixelDividerProps {
  /**
   * Divider thickness
   */
  thickness?: 'thin' | 'medium' | 'thick';

  /**
   * Divider color
   */
  color?: 'darkest' | 'dark' | 'light' | 'lightest';

  /**
   * Vertical margin
   */
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg';

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

export const PixelDivider: React.FC<PixelDividerProps> = ({
  thickness = 'thin',
  color = 'dark',
  spacing: spacingProp = 'md',
  style,
}) => {
  const dividerStyles: ViewStyle[] = [
    styles.base,
    { height: borderWidth[thickness] },
    { backgroundColor: colors.dmg[color] },
    spacingProp !== 'none' && { marginVertical: spacing[spacingProp] },
    style,
  ];

  return <View style={dividerStyles} accessibilityRole="none" />;
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
  },
});

export default PixelDivider;
