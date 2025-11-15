/**
 * PixelSprite - Image component for pixel art sprites
 * Features: Scaled rendering, DMG palette integration
 */

import React from 'react';
import { Image, ImageProps, StyleSheet, ViewStyle } from 'react-native';
import { iconSize } from '../../../design-system/tokens';

export interface PixelSpriteProps extends Omit<ImageProps, 'style'> {
  /**
   * Image source
   */
  source: ImageProps['source'];

  /**
   * Sprite size preset
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'hero';

  /**
   * Custom width (overrides size)
   */
  width?: number;

  /**
   * Custom height (overrides size)
   */
  height?: number;

  /**
   * Custom styles
   */
  style?: ViewStyle;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

export const PixelSprite: React.FC<PixelSpriteProps> = ({
  source,
  size = 'md',
  width,
  height,
  style,
  accessibilityLabel,
  ...imageProps
}) => {
  const spriteSize = width && height
    ? { width, height }
    : styles[size];

  const imageStyles: ViewStyle[] = [
    styles.base,
    spriteSize,
    style,
  ];

  return (
    <Image
      source={source}
      style={imageStyles}
      resizeMode="pixelated"
      accessibilityLabel={accessibilityLabel}
      {...imageProps}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    // Pixel-perfect rendering
  },

  // Size presets
  xs: {
    width: iconSize.xs,
    height: iconSize.xs,
  },
  sm: {
    width: iconSize.sm,
    height: iconSize.sm,
  },
  md: {
    width: iconSize.md,
    height: iconSize.md,
  },
  lg: {
    width: iconSize.lg,
    height: iconSize.lg,
  },
  xl: {
    width: iconSize.xl,
    height: iconSize.xl,
  },
  xxl: {
    width: iconSize.xxl,
    height: iconSize.xxl,
  },
  hero: {
    width: iconSize.hero,
    height: iconSize.hero,
  },
});

export default PixelSprite;
