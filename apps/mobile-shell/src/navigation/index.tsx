import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { DiagnosticScreen } from '../screens/DiagnosticScreen';
import OnboardingNavigator from '../screens/onboarding/navigation/OnboardingNavigator';

/**
 * Root Navigation Configuration
 * Placeholder - will be expanded with more screens in future stories
 *
 * Story 1.4: Onboarding flow accessible via tab navigator for testing
 * TODO: In production, onboarding should be part of auth flow, not tab navigator
 */

const Tab = createBottomTabNavigator();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen
          name="Diagnostics"
          component={DiagnosticScreen}
          options={{ title: 'Phase 4 Tests' }}
        />
        <Tab.Screen
          name="Onboarding"
          component={OnboardingNavigator}
          options={{ title: 'Story 1.4 Demo', headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
