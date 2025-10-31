/**
 * Environment Configuration
 * Centralizes environment variable access for React Native
 *
 * Note: React Native doesn't support process.env by default.
 * For production, use react-native-config or expo-constants.
 * For now, we'll hardcode values from .env for development.
 */

export const ENV = {
  SUPABASE_URL: 'https://noxwzelpibuytttlgztq.supabase.co',
  SUPABASE_ANON_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5veHd6ZWxwaWJ1eXR0dGxnenRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1Njc2ODQsImV4cCI6MjA2ODE0MzY4NH0.wLBAe5q8t8GImd7YGzW_AYwGAzs5xmkg1kFlqUGweLY',
} as const;

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
