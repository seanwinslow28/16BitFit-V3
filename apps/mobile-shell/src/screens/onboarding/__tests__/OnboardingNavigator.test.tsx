import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingNavigator from '../navigation/OnboardingNavigator';
import { OnboardingProvider } from '../context/OnboardingContext';

/**
 * OnboardingNavigator Test Suite
 * Tests the navigation stack configuration and initial routing
 */
describe('OnboardingNavigator', () => {
  const renderNavigator = () => {
    return render(
      <NavigationContainer>
        <OnboardingProvider>
          <OnboardingNavigator />
        </OnboardingProvider>
      </NavigationContainer>
    );
  };

  it('should render without crashing', () => {
    const { getByText } = renderNavigator();
    // Welcome screen should be the initial route
    expect(getByText('16BITFIT')).toBeTruthy();
  });

  it('should render WelcomeScreen as initial route', () => {
    const { getByText } = renderNavigator();
    // Check for Welcome screen specific content
    expect(getByText('GET STARTED')).toBeTruthy();
    expect(getByText(/Transform your fitness journey/i)).toBeTruthy();
  });

  it('should display progress indicator', () => {
    const { getByTestId } = renderNavigator();
    // Progress indicator should be present
    const progressIndicator = getByTestId('progress-indicator');
    expect(progressIndicator).toBeTruthy();
  });

  it('should have correct header options', () => {
    const { queryByText } = renderNavigator();
    // Header should be hidden for onboarding screens
    // This is a basic check - full header testing would require navigation utilities
    expect(queryByText('Welcome')).toBeFalsy(); // No header title should be visible
  });

  // Note: Full navigation flow testing (screen transitions, navigation actions)
  // would require more complex setup with navigation test utilities or E2E testing
  // These basic tests verify initial mounting and rendering
});
