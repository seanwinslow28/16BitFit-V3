/**
 * 16BitFit Mobile Shell
 * Main Application Entry Point
 * Story 1.3: Integrated with health data sync on launch and foreground
 */
import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { syncRecentData } from './src/services/health/syncService';

// Throttle sync to prevent excessive API calls
const SYNC_THROTTLE_MS = 15 * 60 * 1000; // 15 minutes

function App(): JSX.Element {
  const lastSyncTime = useRef<number>(0);
  const appState = useRef(AppState.currentState);

  // Throttled sync function
  const performSync = async () => {
    const now = Date.now();
    if (now - lastSyncTime.current < SYNC_THROTTLE_MS) {
      console.log('Sync throttled - too soon since last sync');
      return;
    }

    try {
      lastSyncTime.current = now;
      await syncRecentData();
      console.log('Health data sync completed');
    } catch (error) {
      console.error('Health data sync failed:', error);
    }
  };

  // Initial sync on app launch
  useEffect(() => {
    performSync();
  }, []);

  // Sync when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to foreground - syncing health data');
        performSync();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default App;
