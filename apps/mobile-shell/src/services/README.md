# Services Layer

API interaction layer for 16BitFit mobile app.

## Architecture

The services layer acts as an abstraction between the UI and backend, providing:
- Clean separation of concerns
- Centralized error handling
- Type-safe API calls
- Consistent response patterns

## Available Services

### `supabaseClient.ts`
Configured Supabase client for all backend operations.

**Usage:**
```typescript
import { supabase } from '@/services/supabaseClient';

// Query data
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId);

// Subscribe to realtime changes
const subscription = supabase
  .channel('workouts')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'workouts' },
    (payload) => console.log('New workout:', payload)
  )
  .subscribe();
```

## Service Guidelines

1. **One service per domain** - Create separate files for each major feature:
   - `authService.ts` - Authentication operations
   - `workoutService.ts` - Workout CRUD operations
   - `avatarService.ts` - Avatar management
   - `combatService.ts` - Combat session handling

2. **Export functions, not classes** - Use functional approach:
```typescript
// Good
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase...
  if (error) throw error;
  return data;
}

// Avoid
export class UserService {
  async getProfile(userId: string) { ... }
}
```

3. **Handle errors consistently**:
```typescript
export async function updateProfile(userId: string, updates: ProfileUpdate) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile update failed:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    // Log to error tracking service (e.g., Sentry)
    console.error('updateProfile error:', error);
    throw error;
  }
}
```

4. **Use TypeScript types from shared-types package**:
```typescript
import type { User, Workout, Avatar } from '@packages/shared-types';

export async function getWorkouts(userId: string): Promise<Workout[]> {
  // Implementation
}
```

5. **Keep services thin** - Complex business logic belongs in stores or utilities, not services.

## Environment Configuration

Environment variables are managed via `src/config/env.ts`.

**Production Setup:**
For production builds, consider using:
- [`react-native-config`](https://github.com/luggit/react-native-config) for env vars
- [`react-native-dotenv`](https://github.com/goatandsheep/react-native-dotenv) for .env support

**Current Setup:**
Development credentials are imported from `config/env.ts`. Update this file when deploying to production.

## Testing Services

Mock Supabase client in tests:
```typescript
import { supabase } from './supabaseClient';

jest.mock('./supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));
```

## Best Practices

1. ✅ Always handle both `data` and `error` from Supabase responses
2. ✅ Use TypeScript for type safety
3. ✅ Log errors for debugging but don't expose sensitive data
4. ✅ Keep functions small and focused
5. ✅ Export individual functions, not classes
6. ❌ Don't put business logic in services
7. ❌ Don't directly manipulate UI state in services
8. ❌ Don't hardcode credentials (use env.ts)

## Resources

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
