/**
 * ArchetypeCard - 160x200px selectable archetype card
 * Features: DMG palette, scale animation on select, sprite display
 * CRITICAL for Story 1.4 - Archetype Selection
 */

import React, { useRef, useCallback } from 'react';
import {
  Pressable,
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  AccessibilityRole,
} from 'react-native';
import { PixelText } from '../../atoms/PixelText';
import { PixelSprite } from '../../atoms/PixelSprite';
import { PixelBorder } from '../../atoms/PixelBorder';
import { colors, spacing, borderWidth } from '../../../design-system/tokens';
import { durations, easings } from '../../../design-system/animations';

export interface ArchetypeCardProps {
  /**
   * Archetype ID
   */
  id: string;

  /**
   * Archetype name
   */
  name: string;

  /**
   * Archetype description
   */
  description: string;

  /**
   * Sprite source (local or remote)
   */
  spriteSource: any;

  /**
   * Selected state
   */
  selected: boolean;

  /**
   * Selection handler
   */
  onSelect: (id: string) => void;

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

export const ArchetypeCard: React.FC<ArchetypeCardProps> = ({
  id,
  name,
  description,
  spriteSource,
  selected,
  onSelect,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(selected ? 1.05 : 1)).current;

  const handlePress = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

  // Animate scale when selected changes
  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: selected ? 1.05 : 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [selected, scaleAnim]);

  const containerStyles: ViewStyle[] = [
    styles.container,
    selected && styles.selected,
    style,
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        accessibilityRole={'button' as AccessibilityRole}
        accessibilityLabel={`${name} archetype`}
        accessibilityHint={`Select ${name} as your character archetype`}
        accessibilityState={{ selected }}
        style={containerStyles}
      >
        <PixelBorder
          thickness={selected ? 'thick' : 'medium'}
          borderColor={selected ? 'light' : 'dark'}
          backgroundColor="lightest"
          padding="md"
        >
          <View style={styles.content}>
            <PixelSprite
              source={spriteSource}
              size="xxl"
              accessibilityLabel={`${name} sprite`}
            />
            <PixelText
              variant="pixel"
              size="sm"
              color="darkest"
              align="center"
              style={styles.name}
            >
              {name}
            </PixelText>
            <PixelText
              variant="body"
              size="xs"
              color="dark"
              align="center"
              numberOfLines={2}
              style={styles.description}
            >
              {description}
            </PixelText>
          </View>
        </PixelBorder>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 200,
  },

  selected: {
    // Additional selected styles if needed
  },

  content: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },

  name: {
    marginTop: spacing.sm,
  },

  description: {
    marginTop: spacing.xs,
  },
});

export default ArchetypeCard;
