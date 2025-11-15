/**
 * ProfileHeader - Avatar + Username + Metadata display
 * Features: DMG palette, horizontal layout
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { PixelText } from '../../atoms/PixelText';
import { PixelSprite } from '../../atoms/PixelSprite';
import { spacing } from '../../../design-system/tokens';

export interface ProfileHeaderProps {
  /**
   * User avatar source
   */
  avatarSource: any;

  /**
   * Username
   */
  username: string;

  /**
   * User level (optional)
   */
  level?: number;

  /**
   * User archetype (optional)
   */
  archetype?: string;

  /**
   * Avatar size
   */
  avatarSize?: 'md' | 'lg' | 'xl';

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarSource,
  username,
  level,
  archetype,
  avatarSize = 'lg',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Avatar */}
      <PixelSprite
        source={avatarSource}
        size={avatarSize}
        accessibilityLabel={`${username}'s avatar`}
      />

      {/* User Info */}
      <View style={styles.info}>
        <PixelText variant="pixel" size="md" color="darkest">
          {username}
        </PixelText>

        {(level !== undefined || archetype) && (
          <View style={styles.metadata}>
            {level !== undefined && (
              <PixelText variant="body" size="xs" color="dark">
                Lvl {level}
              </PixelText>
            )}
            {archetype && (
              <PixelText variant="body" size="xs" color="dark">
                {level !== undefined && ' • '}
                {archetype}
              </PixelText>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },

  metadata: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
});

export default ProfileHeader;
