/**
 * Authentication Store
 * Manages authentication state using Zustand
 * Tracks user session, auth status, and provides auth actions
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Import middleware
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import type { User, Session } from '@supabase/supabase-js';
import type { DeferredUserProfile } from '../services/authService';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithProvider,
  createDeferredUser,
  upgradeDeferredToAuth,
  signOut as authSignOut,
  getCurrentSession,
  getCurrentUser,
  refreshSession,
} from '../services/authService';
import { supabase } from '../services/supabaseClient';

export type AuthStatus = 'loading' | 'authenticated' | 'deferred' | 'unauthenticated';

interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  deferredProfile: DeferredUserProfile | null;
  authStatus: AuthStatus;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, username: string, displayName?: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithSocial: (provider: 'google' | 'apple') => Promise<boolean>;
  createDeferred: (username: string, displayName?: string) => Promise<boolean>;
  upgradeToAuth: (deferredUserId: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      deferredProfile: null,
      authStatus: 'loading',
      isLoading: false,
      error: null,

      // Initialize auth state from stored session
      initialize: async () => {
        // The 'persist' middleware handles restoring deferredProfile.
        // We now rely on the onAuthStateChange listener and initial session check to sync state.
        try {
          set({ isLoading: true, authStatus: 'loading' });

          // Set up auth state change listener
          supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
              set({
                session,
                user: session.user,
                authStatus: 'authenticated',
                deferredProfile: null, // Clear deferred profile on auth
                isLoading: false,
              });
            } else {
              const currentState = get();
              if (currentState.deferredProfile) {
                // Keep deferred state if persisted
                set({
                  session: null,
                  user: null,
                  authStatus: 'deferred',
                  isLoading: false,
                });
              } else {
                set({
                  session: null,
                  user: null,
                  authStatus: 'unauthenticated',
                  isLoading: false,
                });
              }
            }
          });

          // Perform initial session check to expedite loading
          const session = await getCurrentSession();
          if (!session && !get().deferredProfile) {
            // If no session AND no persisted deferred profile, set unauthenticated immediately
            set({ authStatus: 'unauthenticated', isLoading: false });
          }
          // Otherwise, the listener will handle the update shortly.

        } catch (error) {
          console.error('Failed to initialize auth:', error);
          set({
            isLoading: false,
            authStatus: 'unauthenticated',
            error: error instanceof Error ? error.message : 'Failed to initialize',
          });
        }
      },

  // Sign up with email/password
  signUp: async (email, password, username, displayName) => {
    try {
      set({ isLoading: true, error: null });

      const result = await signUpWithEmail(email, password, username, displayName);

      if (result.success && result.user && result.session) {
        set({
          user: result.user,
          session: result.session,
          authStatus: 'authenticated',
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: result.error?.message || 'Sign up failed',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Sign up failed',
        isLoading: false,
      });
      return false;
    }
  },

  // Sign in with email/password
  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const result = await signInWithEmail(email, password);

      if (result.success && result.user && result.session) {
        set({
          user: result.user,
          session: result.session,
          authStatus: 'authenticated',
          deferredProfile: null, // Clear any deferred profile
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: result.error?.message || 'Sign in failed',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Sign in failed',
        isLoading: false,
      });
      return false;
    }
  },

  // Sign in with social provider
  signInWithSocial: async (provider) => {
    try {
      set({ isLoading: true, error: null });

      const result = await signInWithProvider(provider);

      if (result.success) {
        // Session will be set by onAuthStateChange listener after OAuth redirect
        set({ isLoading: false });
        return true;
      } else {
        set({
          error: result.error?.message || 'Social sign in failed',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Social sign in failed',
        isLoading: false,
      });
      return false;
    }
  },

  // Create deferred user (allows app usage without authentication)
  createDeferred: async (username, displayName) => {
    try {
      set({ isLoading: true, error: null });

      const result = await createDeferredUser(username, displayName);

      if (result.success && result.profile) {
        set({
          deferredProfile: result.profile,
          authStatus: 'deferred',
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: result.error?.message || 'Failed to create deferred account',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create deferred account',
        isLoading: false,
      });
      return false;
    }
  },

  // Upgrade deferred user to authenticated
  upgradeToAuth: async (deferredUserId, email, password) => {
    try {
      set({ isLoading: true, error: null });

      const result = await upgradeDeferredToAuth(deferredUserId, email, password);

      if (result.success && result.user && result.session) {
        set({
          user: result.user,
          session: result.session,
          authStatus: 'authenticated',
          deferredProfile: null, // Clear deferred profile
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: result.error?.message || 'Failed to upgrade account',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to upgrade account',
        isLoading: false,
      });
      return false;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });

      const result = await authSignOut();

      if (result.success) {
        set({
          user: null,
          session: null,
          deferredProfile: null,
          authStatus: 'unauthenticated',
          isLoading: false,
        });
      } else {
        set({
          error: result.error?.message || 'Sign out failed',
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Sign out failed',
        isLoading: false,
      });
    }
  },

  // Clear error message
  clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // unique name for storage
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the deferredProfile. Supabase client handles auth session.
      partialize: (state) => ({ deferredProfile: state.deferredProfile }),
    }
  )
);
