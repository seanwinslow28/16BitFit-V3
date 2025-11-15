import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react-native';
import ArchetypeSelectionScreen from '../ArchetypeSelectionScreen';
import { useOnboarding } from '../context/OnboardingContext';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('@/design-system', () => ({
  tokens: {
    colors: {
        background: { primary: '#FFF' },
        border: { highlight: '#00FF00', default: '#000' }
    },
    component: { screenPaddingX: 24 },
    spacing: { 1: 4, 2: 8, 3: 16, 4: 24, 6: 40 },
    border: { width: { pixel: 1 }},
  },
  durations: { normal: 200, fast: 100 },
  easings: { springGentle: jest.fn(), easeOut: jest.fn() },
}));

jest.mock('@/components/atoms', () => {
  const React = require('react');
  const { TouchableOpacity, Text, View } = require('react-native');
  return {
    PixelButton: jest.fn(({ children, onPress, disabled, isLoading, accessibilityLabel }) => {
      const isDisabled = Boolean(disabled || isLoading);
      return React.createElement(
        TouchableOpacity,
        {
          onPress,
          disabled: isDisabled,
          accessibilityLabel,
          accessibilityRole: 'button',
          accessibilityState: { disabled: isDisabled },
        },
        React.createElement(Text, {}, children)
      );
    }),
    PixelText: jest.fn(({ children }) =>
      React.createElement(Text, {}, children)
    ),
    PixelSprite: jest.fn(() =>
      React.createElement(View, { testID: 'mock-sprite' })
    ),
    PixelBorder: jest.fn(({ children }) =>
      React.createElement(View, {}, children)
    ),
  };
});

jest.mock('../components/ProgressIndicator', () => {
  const React = require('react');
  const { View } = require('react-native');
  return jest.fn(() => React.createElement(View, { testID: 'mock-progress-indicator' }));
});

const mockSelectArchetype = jest.fn();
const mockSetCurrentStep = jest.fn();
// Default mock implementation resolves successfully
const mockCompleteOnboarding = jest.fn().mockResolvedValue(undefined);
const mockUseOnboarding = useOnboarding as jest.Mock;

jest.mock('../context/OnboardingContext', () => ({
  ...jest.requireActual('../context/OnboardingContext'),
  useOnboarding: jest.fn(),
}));

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

// Mock Alert for error handling tests
jest.spyOn(Alert, 'alert');

describe('ArchetypeSelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOnboarding.mockReturnValue({
      selectedArchetype: null,
      selectArchetype: mockSelectArchetype,
      completeOnboarding: mockCompleteOnboarding,
      setCurrentStep: mockSetCurrentStep,
    });
  });

  const renderScreen = () => {
    return render(<ArchetypeSelectionScreen />);
  };

  it('renders correctly with all 5 archetypes and disabled button', () => {
    renderScreen();
    expect(screen.getByText('SELECT ARCHETYPE')).toBeTruthy();

    expect(screen.getByText('TRAINER')).toBeTruthy();
    expect(screen.getByText('RUNNER')).toBeTruthy();
    expect(screen.getByText('YOGI')).toBeTruthy();
    expect(screen.getByText('BUILDER')).toBeTruthy();
    expect(screen.getByText('CYCLIST')).toBeTruthy();

    // Continue button should be disabled initially
    expect(screen.getByLabelText('Continue').props.accessibilityState.disabled).toBe(true);
  });

  it('calls setCurrentStep(3) on mount', () => {
    renderScreen();
    expect(mockSetCurrentStep).toHaveBeenCalledWith(3);
  });

  it('handles selection, triggers haptics, and enables the continue button', () => {
    renderScreen();
    // Target the TouchableOpacity via accessibilityRole
    const runnerCard = screen.getByRole('radio', { name: /RUNNER/i });

    expect(runnerCard.props.accessibilityState.selected).toBe(false);

    fireEvent.press(runnerCard);

    // Check if selection state updated locally
    expect(runnerCard.props.accessibilityState.selected).toBe(true);

    // Check if haptic feedback was triggered
    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('impactMedium');

    // Continue button should now be enabled
    expect(screen.getByLabelText('Continue').props.accessibilityState.disabled).toBe(false);
  });

  it('handles single selection behavior', () => {
    renderScreen();
    const trainerCard = screen.getByRole('radio', { name: 'TRAINER' });
    const builderCard = screen.getByRole('radio', { name: 'BUILDER' });

    fireEvent.press(trainerCard);
    expect(trainerCard.props.accessibilityState.selected).toBe(true);

    fireEvent.press(builderCard);
    // Check updated state after re-render simulation (RTL handles this)
    expect(screen.getByRole('radio', { name: 'TRAINER' }).props.accessibilityState.selected).toBe(false);
    expect(screen.getByRole('radio', { name: 'BUILDER' }).props.accessibilityState.selected).toBe(true);
  });

  it('calls context functions and completes onboarding when CONTINUE is pressed', async () => {
    renderScreen();
    const cyclistCard = screen.getByRole('radio', { name: /CYCLIST/i });
    fireEvent.press(cyclistCard);

    const continueButton = screen.getByLabelText('Continue');

    await act(async () => {
        fireEvent.press(continueButton);
    });

    // Check if context functions were called
    expect(mockSelectArchetype).toHaveBeenCalledWith('cyclist');
    expect(mockCompleteOnboarding).toHaveBeenCalledTimes(1);
  });

  it('handles errors during onboarding completion', async () => {
    const errorMessage = 'API Failure';
    mockCompleteOnboarding.mockRejectedValueOnce(new Error(errorMessage));

    renderScreen();
    fireEvent.press(screen.getByRole('radio', { name: /TRAINER/i }));
    const continueButton = screen.getByLabelText('Continue');

    await act(async () => {
        fireEvent.press(continueButton);
    });

    expect(mockCompleteOnboarding).toHaveBeenCalled();
    // Check if Alert was shown
    expect(Alert.alert).toHaveBeenCalledWith("Error", errorMessage);

    // Button should exit loading state (enabled again)
    expect(continueButton.props.accessibilityState.disabled).toBe(false);
  });
});
