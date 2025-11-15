/**
 * ArchetypeSelectionScreen - Character archetype selection screen
 * Story 1.4 - Second screen in onboarding flow
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { PixelText } from '../../components/atoms/PixelText';
import { PixelButton } from '../../components/atoms/PixelButton';
import { ArchetypeCard } from '../../components/molecules/ArchetypeCard';
import { ProgressIndicator } from '../../components/molecules/ProgressIndicator';
import { ARCHETYPES, Archetype } from '../../constants/archetypes';
import { colors, spacing } from '../../design-system/tokens';

interface ArchetypeSelectionScreenProps {
  navigation: any; // In real app, use proper navigation type
}

export const ArchetypeSelectionScreen: React.FC<ArchetypeSelectionScreenProps> = ({
  navigation,
}) => {
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);

  const handleSelectArchetype = (id: string): void => {
    setSelectedArchetype(id);
  };

  const handleContinue = (): void => {
    if (selectedArchetype) {
      navigation.navigate('ProfileSetup', { archetypeId: selectedArchetype });
    }
  };

  const handleBack = (): void => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={2} totalSteps={4} />

        {/* Header */}
        <View style={styles.header}>
          <PixelText variant="pixel" size="xl" color="darkest" align="center">
            Choose Your Archetype
          </PixelText>
          <PixelText
            variant="body"
            size="sm"
            color="dark"
            align="center"
            style={styles.subtitle}
          >
            Select a character that matches your fitness style
          </PixelText>
        </View>

        {/* Archetype Cards */}
        <FlatList
          data={ARCHETYPES}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <ArchetypeCard
                id={item.id}
                name={item.name}
                description={item.description}
                spriteSource={item.spriteSource}
                selected={selectedArchetype === item.id}
                onSelect={handleSelectArchetype}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={styles.grid}
        />
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <View style={styles.actions}>
          <View style={styles.actionButton}>
            <PixelButton onPress={handleBack} variant="ghost" fullWidth>
              Back
            </PixelButton>
          </View>
          <View style={styles.actionButton}>
            <PixelButton
              onPress={handleContinue}
              variant="primary"
              fullWidth
              disabled={!selectedArchetype}
            >
              Continue
            </PixelButton>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dmg.lightest,
  },

  content: {
    flexGrow: 1,
    padding: spacing.xl,
  },

  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },

  subtitle: {
    marginTop: spacing.sm,
  },

  grid: {
    paddingBottom: spacing.xl,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  cardContainer: {
    marginHorizontal: spacing.xs,
  },

  footer: {
    padding: spacing.xl,
    borderTopWidth: 3,
    borderTopColor: colors.dmg.dark,
    backgroundColor: colors.dmg.lightest,
  },

  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  actionButton: {
    flex: 1,
  },
});

export default ArchetypeSelectionScreen;
