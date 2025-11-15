import React from 'react';
import {renderHook, act} from '@testing-library/react-native';
import {
  OnboardingProvider,
  useOnboarding,
  ArchetypeId,
} from '../context/OnboardingContext';

// Wrapper component to provide the context
const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

describe('OnboardingContext', () => {
  it('should initialize with the correct default state', () => {
    const {result} = renderHook(() => useOnboarding(), {wrapper});

    expect(result.current.currentStep).toBe(1);
    expect(result.current.username).toBeNull();
    expect(result.current.displayName).toBeNull();
    expect(result.current.selectedArchetype).toBeNull();
  });

  it('should update username and displayName correctly', () => {
    const {result} = renderHook(() => useOnboarding(), {wrapper});

    act(() => {
      result.current.setUsername('testuser');
      result.current.setDisplayName('Test User');
    });

    expect(result.current.username).toBe('testuser');
    expect(result.current.displayName).toBe('Test User');
  });

  it('should treat empty string or whitespace display name as null', () => {
    const {result} = renderHook(() => useOnboarding(), {wrapper});

    act(() => {
      result.current.setDisplayName('');
    });
    expect(result.current.displayName).toBeNull();

    act(() => {
      result.current.setDisplayName('   '); // Whitespace only
    });
    expect(result.current.displayName).toBeNull();
  });

  it('should update selectedArchetype correctly', () => {
    const {result} = renderHook(() => useOnboarding(), {wrapper});
    const archetype: ArchetypeId = 'runner';

    act(() => {
      result.current.selectArchetype(archetype);
    });

    expect(result.current.selectedArchetype).toBe(archetype);
  });

  it('should handle step navigation (nextStep/previousStep) within bounds', () => {
    const {result} = renderHook(() => useOnboarding(), {wrapper});

    act(() => result.current.nextStep());
    expect(result.current.currentStep).toBe(2);

    act(() => result.current.nextStep());
    expect(result.current.currentStep).toBe(3);

    // Should cap at 3
    act(() => result.current.nextStep());
    expect(result.current.currentStep).toBe(3);

    act(() => result.current.previousStep());
    expect(result.current.currentStep).toBe(2);

    act(() => result.current.previousStep());
    expect(result.current.currentStep).toBe(1);

    // Should bottom out at 1
    act(() => result.current.previousStep());
    expect(result.current.currentStep).toBe(1);
  });

  it('should allow setting the current step directly', () => {
    const {result} = renderHook(() => useOnboarding(), {wrapper});

    act(() => {
      result.current.setCurrentStep(3);
    });
    expect(result.current.currentStep).toBe(3);
  });

  it('should successfully complete onboarding when requirements met', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const {result} = renderHook(() => useOnboarding(), {wrapper});

    act(() => {
      result.current.selectArchetype('yogi');
    });

    await act(async () => {
      await expect(
        result.current.completeOnboarding(),
      ).resolves.toBeUndefined();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Onboarding process finalizing. State:'),
      expect.any(Object),
    );
    consoleSpy.mockRestore();
  });

  it('should throw an error when completing onboarding without an archetype', async () => {
    const {result} = renderHook(() => useOnboarding(), {wrapper});

    // Expect the promise to reject
    await expect(result.current.completeOnboarding()).rejects.toThrow(
      'Archetype selection required.',
    );
  });

  it('should throw an error if useOnboarding is used outside the provider', () => {
    // Suppress the expected console.error output from React boundary
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => renderHook(() => useOnboarding())).toThrow(
      'useOnboarding must be used within an OnboardingProvider',
    );

    consoleErrorSpy.mockRestore();
  });
});
