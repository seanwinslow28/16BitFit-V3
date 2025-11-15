import React from 'react';
import { View, StyleSheet } from 'react-native';
import { tokens } from '@/design-system';
import { PixelText } from '@/components/atoms';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  /**
   * Optional test identifier for locating the component in tests.
   * Defaults to "progress-indicator" to match existing test expectations.
   */
  testID?: string;
}

/**
 * Renders a retro-style progress indicator using square pixels (■ ■ □ Step 2 of 3).
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = React.memo(({ currentStep, totalSteps, testID = 'progress-indicator' }) => {
  const renderDots = () => {
    const dots = [];
    for (let i = 1; i <= totalSteps; i++) {
      const isActive = i <= currentStep;
      dots.push(
        <View
          key={`step-${i}`}
          style={[
            styles.dot,
            isActive ? styles.dotActive : styles.dotInactive
          ]}
          accessibilityLabel={`Step ${i} ${isActive ? 'completed' : 'pending'}`}
        />
      );
    }
    return dots;
  };

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      aria-valuemax={totalSteps}
      aria-valuenow={currentStep}
      testID={testID}
      accessible={true}
    >
      <View style={styles.dotsContainer}>
        {renderDots()}
      </View>
      <PixelText variant="caption" colorKey="secondary">
        {`Step ${currentStep} of ${totalSteps}`}
      </PixelText>
    </View>
  );
});

const DOT_SIZE = 8; // Matches tokens.spacing[2]

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centered alignment based on mockups
    paddingVertical: tokens.spacing[3], // 16pt
    // Assuming background.primary is the light green color from the mockups (#9BBC0F)
    backgroundColor: tokens.colors.background.primary,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginRight: tokens.spacing[2], // 8pt gap between dots and text
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    // Pure retro aesthetic (tokens.border.radius = 0)
    marginHorizontal: tokens.spacing[1], // 4pt gap between dots
  },
  dotActive: {
    // Darkest color for active dots
    backgroundColor: tokens.colors.text.primary, // #0F380F
  },
  dotInactive: {
    // Medium color with an outline for inactive dots
    backgroundColor: tokens.colors.background.elevated, // #8BAC0F
    borderWidth: tokens.border.width.pixel,
    borderColor: tokens.colors.border.default, // #306230
  },
});

export default ProgressIndicator;
