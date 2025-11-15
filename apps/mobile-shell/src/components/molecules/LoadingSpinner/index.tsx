/**
 * LoadingSpinner - Rotating pixel icon loading indicator
 * Features: DMG palette, rotation animation
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { PixelIcon, IconName } from '../../atoms/PixelIcon';
import { PixelText } from '../../atoms/PixelText';
import { spacing } from '../../../design-system/tokens';
import { durations } from '../../../design-system/animations';

export interface LoadingSpinnerProps {
  /**
   * Icon to rotate
   */
  icon?: IconName;

  /**
   * Spinner size
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Loading text
   */
  text?: string;

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  icon = 'star',
  size = 'md',
  text,
  style,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous rotation animation
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: durations.slow * 2,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <PixelIcon name={icon} size={size} color="light" />
      </Animated.View>

      {text && (
        <PixelText
          variant="body"
          size="sm"
          color="dark"
          align="center"
          style={styles.text}
        >
          {text}
        </PixelText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    marginTop: spacing.md,
  },
});

export default LoadingSpinner;
