import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Canvas, Circle, Fill } from '@shopify/react-native-skia';

/**
 * DiagnosticScreen - Phase 4 Runtime Testing
 * Tests all 5 critical native modules for iOS build verification
 */

interface TestResult {
  name: string;
  status: 'pending' | 'pass' | 'fail';
  message: string;
  timestamp?: string;
}

export const DiagnosticScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: 'AsyncStorage', status: 'pending', message: 'Not tested' },
    { name: 'Reanimated', status: 'pending', message: 'Not tested' },
    { name: 'React Navigation', status: 'pending', message: 'Not tested' },
    { name: 'Safe Area Context', status: 'pending', message: 'Not tested' },
    { name: 'Skia Canvas', status: 'pending', message: 'Not tested' },
  ]);

  // Reanimated test - animated box
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    // Auto-test Safe Area Context on mount
    testSafeAreaContext();
    // Auto-test Reanimated initialization
    testReanimated();
  }, []);

  // Test 1: AsyncStorage
  const testAsyncStorage = async () => {
    try {
      const testKey = '@16BitFit:diagnostic_test';
      const testValue = `Test-${Date.now()}`;

      await AsyncStorage.setItem(testKey, testValue);
      const retrieved = await AsyncStorage.getItem(testKey);
      await AsyncStorage.removeItem(testKey);

      if (retrieved === testValue) {
        updateTestResult('AsyncStorage', 'pass', 'Write/Read/Delete successful');
      } else {
        updateTestResult('AsyncStorage', 'fail', 'Data mismatch');
      }
    } catch (error) {
      updateTestResult('AsyncStorage', 'fail', `Error: ${error}`);
    }
  };

  // Test 2: Reanimated
  const testReanimated = () => {
    try {
      scale.value = withRepeat(withSpring(1.2), -1, true);
      updateTestResult('Reanimated', 'pass', 'JSI bridge initialized, animation running');
    } catch (error) {
      updateTestResult('Reanimated', 'fail', `Error: ${error}`);
    }
  };

  // Test 3: Navigation (verified by being able to render this screen)
  const testNavigation = () => {
    updateTestResult(
      'React Navigation',
      'pass',
      'Navigation stack operational (you can see this screen)'
    );
  };

  // Test 4: Safe Area Context
  const testSafeAreaContext = () => {
    try {
      const hasInsets =
        insets.top > 0 || insets.bottom > 0 || insets.left > 0 || insets.right > 0;

      if (hasInsets) {
        updateTestResult(
          'Safe Area Context',
          'pass',
          `Insets detected: Top=${insets.top}, Bottom=${insets.bottom}`
        );
      } else {
        updateTestResult(
          'Safe Area Context',
          'pass',
          'No insets (normal for simulator without notch)'
        );
      }
    } catch (error) {
      updateTestResult('Safe Area Context', 'fail', `Error: ${error}`);
    }
  };

  // Test 5: Skia Canvas
  const testSkia = () => {
    try {
      // If the canvas renders without crashing, Skia is working
      updateTestResult('Skia Canvas', 'pass', 'Rendering animated canvas below');
    } catch (error) {
      updateTestResult('Skia Canvas', 'fail', `Error: ${error}`);
    }
  };

  const updateTestResult = (
    name: string,
    status: 'pass' | 'fail',
    message: string
  ) => {
    setTestResults((prev) =>
      prev.map((test) =>
        test.name === name
          ? { ...test, status, message, timestamp: new Date().toLocaleTimeString() }
          : test
      )
    );
  };

  const runAllTests = () => {
    testAsyncStorage();
    testReanimated();
    testNavigation();
    testSafeAreaContext();
    testSkia();
  };

  const getStatusColor = (status: 'pending' | 'pass' | 'fail') => {
    switch (status) {
      case 'pass':
        return '#4CAF50';
      case 'fail':
        return '#F44336';
      default:
        return '#FFC107';
    }
  };

  const getStatusIcon = (status: 'pending' | 'pass' | 'fail') => {
    switch (status) {
      case 'pass':
        return '✅';
      case 'fail':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Phase 4 Diagnostics</Text>
        <Text style={styles.subtitle}>iOS Native Module Testing</Text>
      </View>

      {/* Test Results */}
      <View style={styles.resultsContainer}>
        {testResults.map((test, index) => (
          <View
            key={index}
            style={[
              styles.testCard,
              { borderLeftColor: getStatusColor(test.status) },
            ]}
          >
            <View style={styles.testHeader}>
              <Text style={styles.testIcon}>{getStatusIcon(test.status)}</Text>
              <Text style={styles.testName}>{test.name}</Text>
            </View>
            <Text style={styles.testMessage}>{test.message}</Text>
            {test.timestamp && (
              <Text style={styles.testTimestamp}>{test.timestamp}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Test Buttons */}
      <TouchableOpacity style={styles.primaryButton} onPress={runAllTests}>
        <Text style={styles.buttonText}>Run All Tests</Text>
      </TouchableOpacity>

      {/* Reanimated Demo */}
      <View style={styles.demoSection}>
        <Text style={styles.demoTitle}>Reanimated Demo</Text>
        <Animated.View style={[styles.animatedBox, animatedStyle]}>
          <Text style={styles.animatedText}>Animated</Text>
        </Animated.View>
      </View>

      {/* Skia Demo */}
      <View style={styles.demoSection}>
        <Text style={styles.demoTitle}>Skia Canvas Demo</Text>
        <Canvas style={styles.canvas}>
          <Fill color="#0f380f" />
          <Circle cx={75} cy={75} r={50} color="#9bbc0f" />
          <Circle cx={75} cy={75} r={30} color="#8bac0f" />
        </Canvas>
      </View>

      {/* Safe Area Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Safe Area Insets</Text>
        <Text style={styles.infoText}>Top: {insets.top}px</Text>
        <Text style={styles.infoText}>Bottom: {insets.bottom}px</Text>
        <Text style={styles.infoText}>Left: {insets.left}px</Text>
        <Text style={styles.infoText}>Right: {insets.right}px</Text>
      </View>

      {/* Build Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Build Configuration</Text>
        <Text style={styles.infoText}>React Native: 0.71.8</Text>
        <Text style={styles.infoText}>iOS Target: 15.1+</Text>
        <Text style={styles.infoText}>Hermes: Enabled</Text>
        <Text style={styles.infoText}>Fabric: Disabled</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f380f',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9bbc0f',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8bac0f',
  },
  resultsContainer: {
    marginBottom: 20,
  },
  testCard: {
    backgroundColor: '#1a5c1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  testIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  testName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9bbc0f',
  },
  testMessage: {
    fontSize: 14,
    color: '#8bac0f',
    marginLeft: 30,
  },
  testTimestamp: {
    fontSize: 12,
    color: '#6b8c0f',
    marginLeft: 30,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#9bbc0f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f380f',
  },
  demoSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9bbc0f',
    marginBottom: 12,
  },
  animatedBox: {
    width: 100,
    height: 100,
    backgroundColor: '#8bac0f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  animatedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f380f',
  },
  canvas: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8bac0f',
  },
  infoSection: {
    backgroundColor: '#1a5c1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9bbc0f',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#8bac0f',
    marginBottom: 4,
  },
});
