import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define the available archetype IDs
export type ArchetypeId = 'trainer' | 'runner' | 'yogi' | 'builder' | 'cyclist';

interface OnboardingState {
  currentStep: 1 | 2 | 3;
  username: string | null;
  displayName: string | null;
  selectedArchetype: ArchetypeId | null;
}

// Interface matching the requirements specified in the prompt
interface OnboardingContextValue extends OnboardingState {
  setUsername: (username: string | null) => void;
  setDisplayName: (name: string | null) => void;
  selectArchetype: (archetypeId: ArchetypeId) => void;
  nextStep: () => void;
  previousStep: () => void;
  setCurrentStep: (step: 1 | 2 | 3) => void; // Added for flexibility on screen mount
  completeOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

const initialState: OnboardingState = {
  currentStep: 1,
  username: null,
  displayName: null,
  selectedArchetype: null,
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>(initialState);

  const setUsername = useCallback((username: string | null) => {
    setState(prev => ({ ...prev, username }));
  }, []);

  const setDisplayName = useCallback((name: string | null) => {
    // Normalize empty string or whitespace-only string to null
    const normalizedName = name?.trim() === '' ? null : name;
    setState(prev => ({ ...prev, displayName: normalizedName }));
  }, []);

  const selectArchetype = useCallback((archetypeId: ArchetypeId) => {
    setState(prev => ({ ...prev, selectedArchetype: archetypeId }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 3) as 1 | 2 | 3 }));
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) as 1 | 2 | 3 }));
  }, []);

  const setCurrentStep = useCallback((step: 1 | 2 | 3) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const completeOnboarding = useCallback(async () => {
    // TODO: Implement persistence logic (e.g., Supabase/Firebase auth and profile creation)
    console.log('Onboarding process finalizing. State:', state);

    if (!state.selectedArchetype) {
      console.error('Error: Cannot complete onboarding without an archetype.');
      // Throwing an error allows the UI layer to catch it and provide feedback.
      throw new Error('Archetype selection required.');
    }

    // Placeholder for asynchronous operation (e.g., API call)
    await new Promise<void>(resolve => setTimeout(resolve, 500));

    console.log('User profile created (simulated). Navigation to main app should follow.');
    // Navigation to the main app stack is typically handled by the root navigator based on auth state changes.
  }, [state]);

  return (
    <OnboardingContext.Provider
      value={{
        ...state,
        setUsername,
        setDisplayName,
        selectArchetype,
        nextStep,
        previousStep,
        setCurrentStep,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

/**
 * Hook to access the onboarding state and actions.
 * @throws Error if used outside of OnboardingProvider.
 */
export const useOnboarding = (): OnboardingContextValue => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
