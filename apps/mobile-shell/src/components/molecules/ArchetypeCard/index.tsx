/**
 * ArchetypeCard - Selectable fitness archetype card
 *
 * Card component for selecting fitness archetype during onboarding (Story 1.4).
 * Features selection animation with scale and glow effects.
 *
 * @example
 * <ArchetypeCard
 *   archetype={archetypeData}
 *   selected={isSelected}
 *   onSelect={() => handleSelect(archetype.id)}
 * />
 */

import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated, ImageSourcePropType } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { PixelSprite, PixelText } from '@/components/atoms';
import { tokens, durations } from '@/design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface Archetype {
  id: string;
  name: string;
  description: string;
  avatarSource: ImageSourcePropType;
}

export interface ArchetypeCardProps {
  /** Archetype data */
  archetype: Archetype;
  /** Whether this card is selected */
  selected: boolean;
  /** Callback when card is selected */
  onSelect: () => void;
  /** Whether the card is disabled */
  disabled?: boolean;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const ArchetypeCard: React.FC<ArchetypeCardProps> = React.memo(
  ({ archetype, selected, onSelect, disabled = false }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const borderWidthAnim = useRef(new Animated.Value(3)).current;

    // Animate selection state
    useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: selected ? 1.05 : 1,
          damping: 12,
          stiffness: 150,
          useNativeDriver: true,
        }),
        Animated.timing(borderWidthAnim, {
          toValue: selected ? 4 : 3,
          duration: durations.fast, // 150ms
          useNativeDriver: false, // borderWidth doesn't support native driver
        }),
      ]).start();
    }, [selected, scaleAnim, borderWidthAnim]);

    const handlePress = () => {
      if (disabled) return;
      ReactNativeHapticFeedback.trigger('impactMedium');
      onSelect();
    };

    // Note: borderWidth animation requires non-native driver, so we use
    // a simpler approach - just change the style
    const containerStyle = [
      styles.container,
      selected && styles.selected,
      disabled && styles.disabled,
    ];

    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.9}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Select ${archetype.name} archetype`}
        accessibilityHint={archetype.description}
        accessibilityState={{ selected, disabled }}
      >
        <Animated.View
          style={[
            containerStyle,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Avatar */}
          <PixelSprite
            source={archetype.avatarSource}
            size={80}
            alt={archetype.name}
          />

          {/* Name */}
          <PixelText
            variant="h3"
            style={styles.name}
            numberOfLines={1}
          >
            {archetype.name.toUpperCase()}
          </PixelText>

          {/* Description */}
          <PixelText
            variant="bodySmall"
            colorKey="secondary"
            numberOfLines={2}
          >
            {archetype.description}
          </PixelText>
        </Animated.View>
      </TouchableOpacity>
    );
  }
);

ArchetypeCard.displayName = 'ArchetypeCard';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: 160,
    minHeight: 200,
    padding: 16,
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.colors.border.default,
    backgroundColor: tokens.colors.background.elevated,
    alignItems: 'center',
    gap: 12,
  },
  selected: {
    borderWidth: 4,
    borderColor: tokens.colors.border.highlight,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: tokens.colors.border.highlight,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  avatar: {
    marginBottom: 8,
  },
  name: {
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    flex: 1,
    textAlign: 'center',
  },
});

export default ArchetypeCard;
