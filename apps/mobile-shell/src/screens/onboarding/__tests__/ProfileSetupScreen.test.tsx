import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react-native';
import ProfileSetupScreen from '../ProfileSetupScreen';
import { useOnboarding } from '../context/OnboardingContext';
import { PixelInput } from '@/components/atoms';

// Mock dependencies
jest.mock('@/design-system', () => ({
  tokens: {
    colors: { background: { primary: '#FFF' } },
    component: { screenPaddingX: 24 },
    spacing: { 2: 8, 3: 16, 4: 24, 5: 32, 6: 40 },
  },
}));

// Mock atomic components (require inside factory)
jest.mock('@/components/atoms', () => {
  const React = require('react');
  const { TouchableOpacity, Text, View, TextInput } = require('react-native');
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
    // Mock PixelInput to render TextInput and capture critical props for verification
    PixelInput: jest.fn(({ value, onChangeText, accessibilityLabel }) =>
      React.createElement(TextInput, { value, onChangeText, accessibilityLabel })
    ),
  };
});

jest.mock('../components/ProgressIndicator', () => {
  const React = require('react');
  const { View } = require('react-native');
  return jest.fn(() => React.createElement(View, { testID: 'mock-progress-indicator' }));
});

const mockSetUsername = jest.fn();
const mockSetDisplayName = jest.fn();
const mockSetCurrentStep = jest.fn();
const mockNextStep = jest.fn();
const mockUseOnboarding = useOnboarding as jest.Mock;

jest.mock('../context/OnboardingContext', () => ({
  useOnboarding: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('ProfileSetupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOnboarding.mockReturnValue({
      username: null,
      displayName: null,
      setUsername: mockSetUsername,
      setDisplayName: mockSetDisplayName,
      setCurrentStep: mockSetCurrentStep,
      nextStep: mockNextStep,
    });
    // Use fake timers for debounce testing
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
  });

  const renderScreen = () => {
    return render(<ProfileSetupScreen />);
  };

  it('renders correctly and button is disabled initially', () => {
    renderScreen();
    expect(screen.getByText('CREATE PROFILE')).toBeTruthy();
    expect(screen.getByLabelText('Username Input')).toBeTruthy();
    // Button should be disabled initially (pristine and empty)
    expect(screen.getByLabelText('Create Account').props.accessibilityState.disabled).toBe(true);
  });

  it('calls setCurrentStep(2) on mount', () => {
    renderScreen();
    expect(mockSetCurrentStep).toHaveBeenCalledWith(2);
  });

  describe('Username Validation (Debounced)', () => {

    it('shows error for too short username after debounce', async () => {
        renderScreen();
        const input = screen.getByLabelText('Username Input');
        fireEvent.changeText(input, 'ab');

        // Before debounce (300ms), validation should not have finalized

        // Advance timers past debounce
        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(PixelInput).toHaveBeenCalledWith(expect.objectContaining({
          error: 'Username must be at least 3 characters',
        }), expect.anything());
        expect(screen.getByLabelText('Create Account').props.accessibilityState.disabled).toBe(true);
      });

    it('shows error for invalid characters', async () => {
        renderScreen();
        const input = screen.getByLabelText('Username Input');
        fireEvent.changeText(input, 'user!');

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(PixelInput).toHaveBeenCalledWith(expect.objectContaining({
          error: 'Only letters, numbers, and underscores allowed',
        }), expect.anything());
      });

      it('shows success state and enables button when valid', async () => {
        renderScreen();
        const input = screen.getByLabelText('Username Input');
        fireEvent.changeText(input, 'valid_user123');

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(PixelInput).toHaveBeenCalledWith(expect.objectContaining({
          error: false,
          success: true,
        }), expect.anything());
        // Button should be enabled
        expect(screen.getByLabelText('Create Account').props.accessibilityState.disabled).toBe(false);
      });
  });

  describe('Form Submission', () => {
    it('submits the form successfully when valid', async () => {
        renderScreen();
        const usernameInput = screen.getByLabelText('Username Input');
        const displayNameInput = screen.getByLabelText('Display Name Input');
        const submitButton = screen.getByLabelText('Create Account');

        fireEvent.changeText(usernameInput, 'player_one');
        fireEvent.changeText(displayNameInput, 'Player 1');

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(submitButton.props.accessibilityState.disabled).toBe(false);

        fireEvent.press(submitButton);

        expect(mockSetUsername).toHaveBeenCalledWith('player_one');
        expect(mockSetDisplayName).toHaveBeenCalledWith('Player 1');
        expect(mockNextStep).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('ArchetypeSelection');
      });

      it('handles skip functionality', () => {
        renderScreen();
        const skipButton = screen.getByLabelText('Skip for now');
        fireEvent.press(skipButton);

        expect(mockSetUsername).toHaveBeenCalledWith(null);
        expect(mockSetDisplayName).toHaveBeenCalledWith(null);
        expect(mockNextStep).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('ArchetypeSelection');
      });
  });
});
