/**
 * Environment Configuration Example
 * This is a TEMPLATE file. DO NOT commit actual credentials.
 *
 * For actual configuration:
 * 1. Copy this file to env.ts (gitignored)
 * 2. Replace placeholder values with real credentials from .env
 * 3. Never commit env.ts to version control
 *
 * Better approach (recommended for production):
 * Use expo-constants to read from environment variables instead of hardcoding.
 */

import Constants from 'expo-constants';

// Option 1: Use Expo environment variables (RECOMMENDED)
export const ENV = {
  SUPABASE_URL: Constants.expoConfig?.extra?.supabaseUrl || '',
  SUPABASE_ANON_KEY: Constants.expoConfig?.extra?.supabaseAnonKey || '',
} as const;

// Option 2: Hardcode for local development only (NOT RECOMMENDED)
// Uncomment and replace with your actual values from .env
// export const ENV = {
//   SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
//   SUPABASE_ANON_KEY: 'your_anon_key_here',
// } as const;

// Validate that required environment variables are set
const validateEnv = () => {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'] as const;

  for (const key of required) {
    if (!ENV[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
};

// Run validation on module load
validateEnv();
