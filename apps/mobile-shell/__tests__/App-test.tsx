/**
 * @format
 */

import 'react-native';
import React from 'react';
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('@/hooks/useFonts', () => ({
  useCustomFonts: () => ({ fontsLoaded: true, error: null }),
}));

import App from '../App';

// Note: test renderer must be required after react-native.
import renderer, { act } from 'react-test-renderer';

it('renders correctly', () => {
  let tree: renderer.ReactTestRenderer | undefined;
  act(() => {
    tree = renderer.create(<App />);
  });

  act(() => {
    tree?.unmount();
  });
});
