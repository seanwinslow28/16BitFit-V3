import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';
import type { Database } from '../types/database.types';

/**
 * Supabase Client Configuration
 * Connects to 16BitFit Supabase backend
 *
 * Project: noxwzelpibuytttlgztq
 * URL: https://noxwzelpibuytttlgztq.supabase.co
 *
 * Features enabled:
 * - Authentication (email/password, OAuth)
 * - Database with Row Level Security
 * - Realtime subscriptions
 * - Edge Functions
 * - Storage
 *
 * Session persistence:
 * - Uses AsyncStorage to persist auth sessions across app restarts
 * - Auto-refreshes tokens to maintain session validity
 */

export const supabase = createClient<Database>(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
  auth: {
    // Persist session in React Native AsyncStorage
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Not applicable for mobile
  },
});

/**
 * Database Type Definitions
 * These should be generated from Supabase CLI:
 * npx supabase gen types typescript --project-id noxwzelpibuytttlgztq > src/types/database.types.ts
 *
 * TODO: Generate types in database setup story
 */
