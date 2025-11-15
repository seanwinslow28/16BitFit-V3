import React from 'react';
import { Easing } from 'react-native';
import { createStackNavigator, StackCardInterpolationProps } from '@react-navigation/stack';

import { durations } from '@/design-system';
import { OnboardingProvider } from '../context/OnboardingContext';
import WelcomeScreen from '../WelcomeScreen';
import ProfileSetupScreen from '../ProfileSetupScreen';
import ArchetypeSelectionScreen from '../ArchetypeSelectionScreen';

// Define the parameter list for the onboarding stack
export type OnboardingStackParamList = {
  Welcome: undefined;
  ProfileSetup: undefined;
  ArchetypeSelection: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

// Custom transition configuration matching the requirements
const transitionSpecConfig = {
    open: {
        animation: 'timing' as const,
        config: {
          duration: durations.moderate, // 300ms
          easing: Easing.out(Easing.ease),
        },
      },
      close: {
        animation: 'timing' as const,
        config: {
          duration: durations.moderate, // 300ms
          easing: Easing.in(Easing.ease),
        },
      },
};

// Custom card style interpolator matching the requirements
const cardStyleInterpolator = ({ current, layouts }: StackCardInterpolationProps) => ({
    cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
        // Subtle fade (0.9 -> 1.0)
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
});

/**
 * Navigator for the multi-step onboarding flow.
 * Wrapped in OnboardingProvider to manage state across screens.
 */
export const OnboardingNavigator: React.FC = () => {
  return (
    <OnboardingProvider>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          transitionSpec: transitionSpecConfig,
          cardStyleInterpolator: cardStyleInterpolator,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="ArchetypeSelection" component={ArchetypeSelectionScreen} />
      </Stack.Navigator>
    </OnboardingProvider>
  );
};

export default OnboardingNavigator;
