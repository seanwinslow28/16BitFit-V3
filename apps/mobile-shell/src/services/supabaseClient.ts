import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '../types/database.types';

/**
 * Supabase Client Configuration
 * Uses Expo environment variables (EXPO_PUBLIC_ prefix)
 *
 * Setup:
 * 1. Copy apps/mobile-shell/.env.example to .env
 * 2. Fill in your Supabase project URL and anon key
 * 3. Never commit .env to git (contains secrets)
 *
 * Production:
 * - Use EAS Secrets: eas secret:push --scope project EXPO_PUBLIC_SUPABASE_URL
 * - See: https://docs.expo.dev/eas/environment-variables/
 */

const isTestEnv = process.env.NODE_ENV === 'test';
const fallbackUrl = 'https://example.supabase.co';
const fallbackAnonKey = 'test-anon-key';

// Load environment variables (allow safe fallbacks in Jest)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? (isTestEnv ? fallbackUrl : undefined);
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? (isTestEnv ? fallbackAnonKey : undefined);

// Validation: Fail early if required variables are missing outside of tests
if ((!SUPABASE_URL || !SUPABASE_ANON_KEY) && !isTestEnv) {
  const missingVars: string[] = [];
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL) missingVars.push('EXPO_PUBLIC_SUPABASE_URL');
  if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) missingVars.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');

  throw new Error(
    `❌ Missing required environment variables:\n` +
    `${missingVars.map(v => `  - ${v}`).join('\n')}\n\n` +
    `Setup instructions:\n` +
    `1. Copy .env.example to .env:\n` +
    `   cd apps/mobile-shell\n` +
    `   cp .env.example .env\n\n` +
    `2. Edit .env and add your Supabase credentials\n\n` +
    `See: apps/mobile-shell/.env.example for template`
  );
}

/**
 * Supabase client instance
 * Configured with AsyncStorage for session persistence
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Persist session in React Native AsyncStorage
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Not applicable for mobile
  },
});

/**
 * Supabase Configuration Details
 *
 * Project: 16BitFit V3
 * URL: https://noxwzelpibuytttlgztq.supabase.co
 *
 * Features enabled:
 * - Authentication (email/password, OAuth)
 * - Database with Row Level Security (RLS)
 * - Realtime subscriptions
 * - Edge Functions
 * - Storage
 *
 * Session persistence:
 * - Uses AsyncStorage to persist auth sessions across app restarts
 * - Auto-refreshes tokens to maintain session validity
 * - Sessions survive app force-quit and device restart
 */
