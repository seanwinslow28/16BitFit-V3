import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { DiagnosticScreen } from '../screens/DiagnosticScreen';

/**
 * Root Navigation Configuration
 * Placeholder - will be expanded with more screens in future stories
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
      </Tab.Navigator>
    </NavigationContainer>
  );
};
