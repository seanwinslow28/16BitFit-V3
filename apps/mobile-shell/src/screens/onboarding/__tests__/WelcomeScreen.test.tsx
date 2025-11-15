import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import WelcomeScreen from '../WelcomeScreen';

// Mock dependencies
jest.mock('@/design-system', () => ({
  tokens: {
    colors: { background: { primary: '#FFF' } },
    component: { screenPaddingX: 24 },
    // Include spacing[9] (80pt) used for the spacer
    spacing: { 3: 16, 4: 24, 6: 40, 9: 80 },
  },
  durations: { slow: 500, moderate: 300 },
  easings: { easeOut: jest.fn(), snappy: jest.fn() },
}));

// Mock atomic components using React Native components (require inside factory)
jest.mock('@/components/atoms', () => {
  const React = require('react');
  const { Button, Text, View } = require('react-native');
  return {
    PixelButton: jest.fn(({ children, onPress, accessibilityLabel }) =>
      React.createElement(Button, { title: String(children), onPress, accessibilityLabel })
    ),
    PixelText: jest.fn(({ children }) =>
      React.createElement(Text, {}, children)
    ),
    PixelSprite: jest.fn(() =>
      React.createElement(View, { testID: 'mock-sprite' })
    ),
  };
});

jest.mock('../components/ProgressIndicator', () => {
  const React = require('react');
  const { View } = require('react-native');
  return jest.fn(() => React.createElement(View, { testID: 'mock-progress-indicator' }));
});

const mockSetCurrentStep = jest.fn();
jest.mock('../context/OnboardingContext', () => ({
  useOnboarding: jest.fn(() => ({
    setCurrentStep: mockSetCurrentStep,
  })),
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('WelcomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderScreen = () => {
    return render(<WelcomeScreen />);
  };

  it('renders correctly with all elements', () => {
    renderScreen();

    // Check for Progress Indicator and Logo
    expect(screen.getByTestId('mock-progress-indicator')).toBeTruthy();
    expect(screen.getByTestId('mock-sprite')).toBeTruthy();

    // Check for Title and Tagline
    expect(screen.getByText('16BITFIT')).toBeTruthy();
    expect(screen.getByText(/Your fitness journey starts here/i)).toBeTruthy();

    // Check for CTAs
    expect(screen.getByLabelText('Get Started')).toBeTruthy();
    expect(screen.getByLabelText('Log In')).toBeTruthy();
  });

  it('calls setCurrentStep(1) on mount', () => {
    renderScreen();
    expect(mockSetCurrentStep).toHaveBeenCalledWith(1);
  });

  it('navigates to ProfileSetup when GET STARTED is pressed', () => {
    renderScreen();

    const getStartedButton = screen.getByLabelText('Get Started');
    fireEvent.press(getStartedButton);

    expect(mockNavigate).toHaveBeenCalledWith('ProfileSetup');
  });

  it('handles the login link press (placeholder)', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    renderScreen();

    const loginLink = screen.getByLabelText('Log In');
    fireEvent.press(loginLink);

    // Check the placeholder console log
    expect(consoleSpy).toHaveBeenCalledWith('Navigate to LoginScreen (Placeholder)');
    consoleSpy.mockRestore();
  });
});
