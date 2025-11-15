/**
 * PixelIcon - Simple icon component using SVG-like shapes
 * Features: DMG palette, scalable icons
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, iconSize } from '../../../design-system/tokens';

export type IconName =
  | 'arrow-right'
  | 'arrow-left'
  | 'check'
  | 'close'
  | 'error'
  | 'info'
  | 'user'
  | 'heart'
  | 'star'
  | 'settings';

export interface PixelIconProps {
  /**
   * Icon name
   */
  name: IconName;

  /**
   * Icon size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * Icon color
   */
  color?: 'darkest' | 'dark' | 'light' | 'lightest';

  /**
   * Custom styles
   */
  style?: ViewStyle;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

export const PixelIcon: React.FC<PixelIconProps> = ({
  name,
  size = 'md',
  color = 'darkest',
  style,
  accessibilityLabel,
}) => {
  const iconColor = colors.dmg[color];
  const iconDimension = iconSize[size];

  // Simple geometric icons using View components
  // In a real implementation, you'd use react-native-svg
  const renderIcon = (): React.ReactNode => {
    switch (name) {
      case 'check':
        return (
          <View
            style={[
              styles.icon,
              { width: iconDimension, height: iconDimension, backgroundColor: iconColor },
            ]}
            accessibilityLabel={accessibilityLabel || 'Check icon'}
          />
        );
      case 'close':
        return (
          <View
            style={[
              styles.icon,
              { width: iconDimension, height: iconDimension, backgroundColor: iconColor },
            ]}
            accessibilityLabel={accessibilityLabel || 'Close icon'}
          />
        );
      case 'error':
        return (
          <View
            style={[
              styles.icon,
              { width: iconDimension, height: iconDimension, backgroundColor: iconColor },
            ]}
            accessibilityLabel={accessibilityLabel || 'Error icon'}
          />
        );
      case 'info':
        return (
          <View
            style={[
              styles.icon,
              { width: iconDimension, height: iconDimension, backgroundColor: iconColor },
            ]}
            accessibilityLabel={accessibilityLabel || 'Info icon'}
          />
        );
      case 'heart':
        return (
          <View
            style={[
              styles.icon,
              { width: iconDimension, height: iconDimension, backgroundColor: iconColor },
            ]}
            accessibilityLabel={accessibilityLabel || 'Heart icon'}
          />
        );
      case 'star':
        return (
          <View
            style={[
              styles.icon,
              { width: iconDimension, height: iconDimension, backgroundColor: iconColor },
            ]}
            accessibilityLabel={accessibilityLabel || 'Star icon'}
          />
        );
      default:
        return (
          <View
            style={[
              styles.icon,
              { width: iconDimension, height: iconDimension, backgroundColor: iconColor },
            ]}
            accessibilityLabel={accessibilityLabel || `${name} icon`}
          />
        );
    }
  };

  return <View style={style}>{renderIcon()}</View>;
};

const styles = StyleSheet.create({
  icon: {
    // Base icon styles
  },
});

export default PixelIcon;
