/**
 * Shared Types for 16BitFit
 * This package contains all shared TypeScript interfaces and types
 */

// User related types
export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

// Placeholder types - will be expanded in future stories
export interface Workout {
  id: string;
  user_id: string;
  type: string;
  duration: number;
  calories_burned: number;
  created_at: string;
}

export interface Avatar {
  id: string;
  user_id: string;
  sprite_data: string;
  level: number;
  experience: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
