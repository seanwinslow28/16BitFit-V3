/**
 * Environment Variable Type Declarations
 *
 * Defines TypeScript types for Expo environment variables.
 * These variables are loaded from .env file during development
 * and from EAS Secrets during production builds.
 *
 * All client-accessible variables must use EXPO_PUBLIC_ prefix.
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * Supabase project URL
       * @example "https://noxwzelpibuytttlgztq.supabase.co"
       */
      EXPO_PUBLIC_SUPABASE_URL: string;

      /**
       * Supabase anonymous key (public, embedded in app)
       * This key is safe to expose as it only allows operations
       * permitted by Row Level Security policies.
       */
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}

export {};
