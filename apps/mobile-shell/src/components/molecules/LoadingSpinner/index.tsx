/**
 * LoadingSpinner - Loading indicator with optional message
 *
 * Rotating pixel icon spinner for loading states.
 *
 * @example
 * <LoadingSpinner message="Loading..." size="medium" />
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { PixelIcon, PixelText } from '@/components/atoms';
import { tokens } from '@/design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface LoadingSpinnerProps {
  /** Optional loading message */
  message?: string;
  /** Spinner size */
  size?: 'small' | 'medium' | 'large';
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(
  ({ message, size = 'medium' }) => {
    const rotation = useRef(new Animated.Value(0)).current;

    const iconSize = size === 'small' ? 24 : size === 'large' ? 32 : 32;

    useEffect(() => {
      const rotateAnimation = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      rotateAnimation.start();

      return () => rotateAnimation.stop();
    }, [rotation]);

    const rotateInterpolate = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            transform: [{ rotate: rotateInterpolate }],
          }}
        >
          <PixelIcon
            name="settings"
            size={iconSize}
            color={tokens.colors.interactive.primary}
          />
        </Animated.View>

        {message && (
          <PixelText
            variant="body"
            colorKey="secondary"
            style={styles.message}
          >
            {message}
          </PixelText>
        )}
      </View>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
