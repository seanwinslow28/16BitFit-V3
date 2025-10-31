import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';

/**
 * HomeScreen Unit Tests
 * Verifies the placeholder screen renders correctly
 */

describe('HomeScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('16BitFit Shell Ready')).toBeTruthy();
  });

  it('displays React Native version info', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('React Native v0.71.8')).toBeTruthy();
  });

  it('displays Phaser initialization status', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Phaser 3 Game Engine Initialized')).toBeTruthy();
  });

  it('displays Supabase connection status', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Supabase Connected')).toBeTruthy();
  });
});
