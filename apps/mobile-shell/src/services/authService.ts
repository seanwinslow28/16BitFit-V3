/**
 * Authentication Service
 * Handles all authentication operations including:
 * - Email/password signup and signin
 * - Social authentication (Google, Apple)
 * - Deferred authentication (app usage without login)
 * - Session management
 * - Profile creation and upgrades
 */

import { supabase } from './supabaseClient';
import type {
  AuthResponse,
  AuthError,
  User,
  Session,
  Provider,
} from '@supabase/supabase-js';

export interface DeferredUserProfile {
  id: string;
  username: string;
  displayName?: string;
  authStatus: 'deferred';
}

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: Session;
  error?: AuthError | Error;
}

export interface DeferredAuthResult {
  success: boolean;
  profile?: DeferredUserProfile;
  error?: Error;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  username: string,
  displayName?: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName || username,
        },
      },
    });

    if (error) {
      return { success: false, error };
    }

    return {
      success: true,
      user: data.user ?? undefined,
      session: data.session ?? undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error };
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    };
  }
}

/**
 * Sign in with social provider (Google, Apple, etc.)
 */
export async function signInWithProvider(
  provider: Provider
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'com.16bitfit://auth/callback', // Deep link for mobile
      },
    });

    if (error) {
      return { success: false, error };
    }

    return {
      success: true,
      // User and session will be available after redirect callback
    };
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    };
  }
}

/**
 * Create a deferred user profile (allows app usage without authentication)
 * This enables users to try the app before creating an account
 */
export async function createDeferredUser(
  username: string,
  displayName?: string
): Promise<DeferredAuthResult> {
  try {
    const { data, error } = await supabase.rpc('create_deferred_user_profile', {
      p_username: username,
      p_display_name: displayName,
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      profile: {
        id: data as string,
        username,
        displayName,
        authStatus: 'deferred',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    };
  }
}

/**
 * Upgrade a deferred user account to authenticated
 * Invokes the secure Edge Function 'upgrade-deferred-user' to handle the atomic transaction
 * and retrieve the new session.
 */
export async function upgradeDeferredToAuth(
  deferredUserId: string,
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    // 1. Invoke the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('upgrade-deferred-user', {
      body: {
        deferredUserId,
        email,
        password,
      },
    });

    // Handle invocation errors (e.g., network issues, function crash)
    if (error) {
      console.error('Edge Function invocation error:', error);
      return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
    }

    // Handle application-level errors returned by the Edge Function (status 4xx/5xx)
    if (data && data.error) {
        console.error('Edge Function logic error:', data.error);
        return { success: false, error: new Error(data.error) };
    }

    // 2. On success, the Edge Function returns the full session data.
    if (data && data.session && data.user) {
        // CRITICAL: Manually set the session in the client-side Supabase instance.
        // functions.invoke does not automatically update the client's internal auth state.
        await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        });

        // The onAuthStateChange listener in authStore will update the state automatically.
        return {
            success: true,
            user: data.user,
            session: data.session,
        };
    }

    // Handle the edge case where the upgrade succeeded but session generation failed (Step 6 in EF)
    if (data && data.user) {
        return {
            success: true,
            user: data.user,
            session: undefined,
            error: data.message ? new Error(data.message) : undefined, // Inform user to sign in manually
        }
    }

    // Fallback error if the response structure is unexpected
    console.error('Upgrade failed with unexpected response structure:', data);
    return { success: false, error: new Error('Upgrade failed with unexpected response.') };

  } catch (error) {
    console.error('Unexpected error during upgrade:', error);
    return {
      success: false,
      error: error as Error,
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    };
  }
}

/**
 * Get the current session
 */
export async function getCurrentSession(): Promise<Session | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Refresh the current session
 */
export async function refreshSession(): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      return { success: false, error };
    }

    return {
      success: true,
      session: data.session ?? undefined,
      user: data.user ?? undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(
  email: string
): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'com.16bitfit://auth/reset-password',
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    };
  }
}

/**
 * Update user password
 */
export async function updatePassword(
  newPassword: string
): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    };
  }
}
