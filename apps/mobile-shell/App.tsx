/**
 * 16BitFit Mobile Shell
 * Main Application Entry Point
 * Story 1.4: Onboarding Flow with Custom Fonts
 */
import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useCustomFonts } from '@/hooks/useFonts';
import OnboardingNavigator from '@/screens/onboarding/navigation/OnboardingNavigator';
import './global.css';

// Keep the splash screen visible while we fetch resources.
// This must be called globally before the component renders.
SplashScreen.preventAutoHideAsync();

function App(): JSX.Element | null {
  const { fontsLoaded, error } = useCustomFonts();

  useEffect(() => {
    if (error) {
      console.error('Error loading fonts:', error);
      // In production, log to monitoring service (e.g., Sentry)
    }
  }, [error]);

  // Callback to hide the splash screen once resources are ready or an error occurred.
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || error) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // If fonts are not loaded and no error occurred, return null.
  // The splash screen remains visible.
  if (!fontsLoaded && !error) {
    return null;
  }

  // Once loaded, render the app. We attach the layout handler to a root View.
  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <NavigationContainer>
          <OnboardingNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
