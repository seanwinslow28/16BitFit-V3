import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * HomeScreen - Main landing screen for 16BitFit
 * Placeholder implementation - will be enhanced in UI stories
 */
export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>16BitFit Shell Ready</Text>
      <Text style={styles.subtitle}>React Native v0.71.8</Text>
      <Text style={styles.subtitle}>Phaser 3 Game Engine Initialized</Text>
      <Text style={styles.subtitle}>Supabase Connected</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f380f', // Game Boy darkest green
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#9bbc0f', // Game Boy lightest green
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8bac0f', // Game Boy light green
    marginBottom: 8,
    textAlign: 'center',
  },
});
