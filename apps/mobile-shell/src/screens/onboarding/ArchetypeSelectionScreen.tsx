import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { PixelButton, PixelText, PixelSprite, PixelBorder } from '@/components/atoms';
import { tokens, durations, easings } from '@/design-system';
import ProgressIndicator from './components/ProgressIndicator';
import { useOnboarding, ArchetypeId } from './context/OnboardingContext';

// --- Archetype Data Definition ---

interface Archetype {
  id: ArchetypeId;
  name: string;
  description: string;
  sprite: any; // ImageRequireSource or { uri: string }
}

const archetypes: Archetype[] = [
  {
    id: 'trainer',
    name: 'TRAINER',
    description: 'Balanced fitness style',
    sprite: require('../../../assets/images/archetypes/trainer-80.png'),
  },
  {
    id: 'runner',
    name: 'RUNNER',
    description: 'Cardio specialist',
    sprite: require('../../../assets/images/archetypes/runner-80.png'),
  },
  {
    id: 'yogi',
    name: 'YOGI',
    description: 'Flexibility & mindfulness',
    sprite: require('../../../assets/images/archetypes/yogi-80.png'),
  },
  {
    id: 'builder',
    name: 'BUILDER',
    description: 'Strength training',
    sprite: require('../../../assets/images/archetypes/builder-80.png'),
  },
  {
    id: 'cyclist',
    name: 'CYCLIST',
    description: 'Endurance & biking',
    sprite: require('../../../assets/images/archetypes/cyclist-80.png'),
  },
];

// --- ArchetypeCard Component ---

interface ArchetypeCardProps {
  archetype: Archetype;
  isSelected: boolean;
  onSelect: (id: ArchetypeId) => void;
}

const ArchetypeCard: React.FC<ArchetypeCardProps> = React.memo(({ archetype, isSelected, onSelect }) => {
  // Animation value: 1 (selected) or 0 (deselected)
  const selectionAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(selectionAnim, {
      toValue: isSelected ? 1 : 0,
      duration: isSelected ? durations.normal : durations.fast + 50, // 200ms select, 150ms deselect
      easing: isSelected ? easings.springGentle : easings.easeOut,
      useNativeDriver: true, // GPU accelerated for transform
    }).start();
  }, [isSelected, selectionAnim]);

  const handlePress = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    onSelect(archetype.id);
  }, [onSelect, archetype.id]);

  // Interpolate the scale value: 1.0 -> 1.05
  const scale = selectionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={archetype.name}
        accessibilityHint={`Select ${archetype.description} as your fitness archetype`}
      >
        <PixelBorder
          borderWidth={isSelected ? "thick" : "default"} // 4px vs 3px
          borderColor={isSelected ? tokens.colors.border.highlight : tokens.colors.border.default}
          backgroundColorKey="elevated" // #8BAC0F
          shadow={isSelected ? "medium" : "none"}
          padding={3} // 16pt
          style={styles.card}
        >
          <PixelSprite source={archetype.sprite} size={80} alt={`${archetype.name} sprite`} />
          <PixelText variant="h3" align="center" style={styles.cardTitle}>
            {archetype.name}
          </PixelText>
          <PixelText variant="bodySmall" align="center" colorKey="secondary">
            {archetype.description}
          </PixelText>
        </PixelBorder>
      </TouchableOpacity>
    </Animated.View>
  );
});

// --- ArchetypeSelectionScreen Component ---

const ArchetypeSelectionScreen: React.FC = () => {
  const { selectedArchetype, selectArchetype, completeOnboarding, setCurrentStep } = useOnboarding();
  // Local state manages the current selection on this screen, initialized from context
  const [selectedId, setSelectedId] = useState<ArchetypeId | null>(selectedArchetype);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  const handleSelect = useCallback((id: ArchetypeId) => {
    setSelectedId(id);
  }, []);

  const handleContinue = useCallback(async () => {
    if (selectedId) {
      setIsLoading(true);
      // Update context immediately before starting async operation
      selectArchetype(selectedId);
      try {
        // Attempt to finalize onboarding
        await completeOnboarding();
        // Navigation to the main app is handled after completeOnboarding resolves (in the root navigator)
      } catch (error) {
        console.error("Failed to complete onboarding:", error);
        Alert.alert("Error", (error as Error).message || "Could not complete setup. Please try again.");
        setIsLoading(false);
      }
    }
  }, [selectedId, selectArchetype, completeOnboarding]);

  const renderItem = useCallback(({ item }: { item: Archetype }) => (
    <ArchetypeCard
      archetype={item}
      isSelected={selectedId === item.id}
      onSelect={handleSelect}
    />
  ), [selectedId, handleSelect]);

  const ListHeader = (
    <View style={styles.header}>
        <PixelText variant="h2" align="center" colorKey="primary">
        SELECT ARCHETYPE
        </PixelText>
        <PixelText variant="bodySmall" align="center" colorKey="secondary" style={styles.subtext}>
        Choose your fitness style (you can change this later).
        </PixelText>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProgressIndicator currentStep={3} totalSteps={3} />

      <FlatList
        data={archetypes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        accessibilityRole='radiogroup'
      />

      <View style={styles.ctaContainer}>
        <PixelButton
          variant="primary"
          onPress={handleContinue}
          disabled={!selectedId}
          isLoading={isLoading}
          accessibilityLabel="Continue"
          accessibilityHint="Confirms archetype selection and finishes onboarding."
        >
          CONTINUE
        </PixelButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background.primary,
  },
  listContent: {
    flexGrow: 1,
    // Adjust padding to account for card margins (8pt)
    paddingHorizontal: tokens.component.screenPaddingX - tokens.spacing[2],
    paddingBottom: tokens.spacing[4],
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  header: {
    paddingTop: tokens.spacing[4], // 24pt
    marginBottom: tokens.spacing[4], // 24pt
    paddingHorizontal: tokens.spacing[2],
  },
  subtext: {
    marginTop: tokens.spacing[2], // 8pt
  },
  cardWrapper: {
    flex: 1/2,
    padding: tokens.spacing[2], // 8pt margin around cards
  },
  card: {
    alignItems: 'center',
    minHeight: 180, // Ensure consistent height
  },
  cardTitle: {
    marginTop: tokens.spacing[2], // 8pt
    marginBottom: tokens.spacing[1], // 4pt
  },
  ctaContainer: {
    paddingHorizontal: tokens.component.screenPaddingX,
    paddingBottom: tokens.spacing[6], // 40pt
    paddingTop: tokens.spacing[3],
    backgroundColor: tokens.colors.background.primary,
    // Add a top border to separate CTA from scrollable content
    borderTopWidth: tokens.border.width.pixel,
    borderTopColor: tokens.colors.border.default,
  },
});

export default ArchetypeSelectionScreen;
