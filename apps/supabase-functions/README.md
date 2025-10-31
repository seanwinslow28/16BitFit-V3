# Supabase Edge Functions

Edge Functions for 16BitFit V3, running on Deno runtime.

## Available Functions

### `get-user-stats`
Retrieves comprehensive user statistics including profile, avatar, and recent workouts.

**Endpoint:** `POST /functions/v1/get-user-stats`

**Authentication:** Requires Authorization header with Supabase JWT

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "profile": {
    "username": "player123",
    "display_name": "Player",
    "level": 5,
    "total_experience": 2500,
    "total_workouts": 15
  },
  "avatar": {
    "id": "uuid",
    "name": "Warrior",
    "level": 5,
    "stats": {
      "hp": 100,
      "max_hp": 100,
      "attack": 15,
      "defense": 12,
      "speed": 10
    }
  },
  "recent_stats": {
    "recent_workouts_count": 10,
    "total_duration_seconds": 3600,
    "total_calories_burned": 500,
    "total_experience_gained": 250,
    "recent_workouts": [...]
  }
}
```

### `avatar-generator` (Placeholder)
Will generate pixel art avatars for user profiles.

### `record-workout` (Placeholder)
Will record workout data and calculate fitness metrics.

## Local Development

### Prerequisites
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- Deno runtime (installed automatically by Supabase CLI)

### Running Locally

1. Start Supabase local development:
```bash
supabase start
```

2. Serve functions locally:
```bash
supabase functions serve
```

3. Test a function:
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/get-user-stats' \
  --header 'Authorization: Bearer YOUR_SUPABASE_JWT' \
  --header 'Content-Type: application/json'
```

## Deployment

Deploy all functions:
```bash
supabase functions deploy
```

Deploy a specific function:
```bash
supabase functions deploy get-user-stats
```

## Environment Variables

Edge Functions automatically have access to:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (use with caution)

Additional environment variables can be set via:
```bash
supabase secrets set MY_SECRET=value
```

## Shared Utilities

Common utilities are available in `shared/utils.ts`:
- `corsHeaders()` - CORS headers for API responses
- `errorResponse()` - Standardized error responses
- `successResponse()` - Standardized success responses

## Testing

Test Edge Functions with Deno's built-in test runner:
```bash
deno test --allow-all apps/supabase-functions/get-user-stats/index.test.ts
```

## Best Practices

1. **Always validate user authentication** before processing requests
2. **Use Row Level Security (RLS)** - Edge Functions respect RLS policies
3. **Handle CORS** properly for web/mobile clients
4. **Log errors** for debugging but don't expose sensitive info to clients
5. **Keep functions small** - Each function should do one thing well
6. **Use shared utilities** to maintain consistency across functions

## Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/manual)
- [Deno Deploy](https://deno.com/deploy)
