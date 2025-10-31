/**
 * Dependency Import Tests
 * Verifies that all core dependencies can be imported without errors
 */

describe('Core Dependencies', () => {
  it('can import React Native', () => {
    const RN = require('react-native');
    expect(RN).toBeDefined();
    expect(RN.View).toBeDefined();
    expect(RN.Text).toBeDefined();
  });

  it('can import Supabase client', () => {
    const { createClient } = require('@supabase/supabase-js');
    expect(createClient).toBeDefined();
    expect(typeof createClient).toBe('function');
  });

  it('can import React Navigation', () => {
    const nav = require('@react-navigation/native');
    expect(nav.NavigationContainer).toBeDefined();
  });

  it('can import React Navigation Bottom Tabs', () => {
    const tabs = require('@react-navigation/bottom-tabs');
    expect(tabs.createBottomTabNavigator).toBeDefined();
  });

  it('can import Zustand', () => {
    const { create } = require('zustand');
    expect(create).toBeDefined();
    expect(typeof create).toBe('function');
  });

  it('can import React Native Reanimated', () => {
    const Animated = require('react-native-reanimated');
    expect(Animated).toBeDefined();
  });

  it('can import React Native Skia', () => {
    const Skia = require('@shopify/react-native-skia');
    expect(Skia).toBeDefined();
  });

  it('can import shared types package', () => {
    const types = require('@packages/shared-types');
    expect(types).toBeDefined();
  });

  it('can import bridge interface package', () => {
    const bridge = require('@packages/bridge-interface');
    expect(bridge).toBeDefined();
    expect(bridge.BridgeMessageType).toBeDefined();
  });
});
