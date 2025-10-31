# Supabase Setup & Verification Guide
## 16BitFit V3 - Story 1.2 Authentication

This guide covers the complete setup, configuration, and verification of Supabase authentication for the 16BitFit mobile application.

---

## Prerequisites

- Supabase project created ([16BitFit Project](https://supabase.com/dashboard/project/noxwzelpibuytttlgztq))
- Access to Supabase dashboard
- Node.js and npm installed
- Supabase CLI (optional, for type generation)

---

## Part 1: Environment Configuration

### Step 1: Configure Environment Variables

1. **Create `.env` file in project root:**
   ```bash
   touch .env
   ```

2. **Add Supabase credentials** (get these from Supabase Dashboard → Settings → API):
   ```env
   SUPABASE_URL=https://noxwzelpibuytttlgztq.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **Verify `.env` contents:**
   ```bash
   grep -E '^(SUPABASE_URL|SUPABASE_ANON_KEY)=' .env
   ```

### Step 2: Configure Environment Loading

The app uses `apps/mobile-shell/src/config/env.ts` to load environment variables.

**Current implementation** (development mode with hardcoded values):
```typescript
export const ENV = {
  SUPABASE_URL: 'https://noxwzelpibuytttlgztq.supabase.co',
  SUPABASE_ANON_KEY: 'your_anon_key_here',
} as const;
```

**For production**, update to use `react-native-config` or `react-native-dotenv`:

1. Install dependency:
   ```bash
   npm install react-native-dotenv
   ```

2. Update `env.ts`:
   ```typescript
   import { SUPABASE_URL as URL, SUPABASE_ANON_KEY as KEY } from '@env';

   export const ENV = {
     SUPABASE_URL: URL,
     SUPABASE_ANON_KEY: KEY,
   };
   ```

3. Create type definitions (`types/env.d.ts`):
   ```typescript
   declare module '@env' {
     export const SUPABASE_URL: string;
     export const SUPABASE_ANON_KEY: string;
   }
   ```

### Step 3: Verify Supabase Client Configuration

Check `apps/mobile-shell/src/services/supabaseClient.ts` has correct AsyncStorage configuration:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient<Database>(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,          // ✅ Required for session persistence
      autoRefreshToken: true,          // ✅ Required for auto-refresh
      persistSession: true,            // ✅ Required for persistence
      detectSessionInUrl: false,       // ✅ Correct for mobile
    },
  }
);
```

---

## Part 2: Database Migration

### Step 1: Apply the Migration

**Option A: Using Supabase Dashboard (SQL Editor)**

1. Navigate to Supabase Dashboard → SQL Editor
2. Open the migration file: `supabase/migrations/20251025000000_add_auth_profile_fields.sql`
3. Copy and paste the entire SQL content
4. Click "Run" to execute

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref noxwzelpibuytttlgztq

# Apply migrations
supabase db push
```

### Step 2: Verify Migration Applied

Run this query in SQL Editor to check migrations:

```sql
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC
LIMIT 5;
```

Expected output should include: `20251025000000`

---

## Part 3: Database Verification

Use these SQL queries to verify the database schema is correctly configured.

### Verify 1: Enum Types

```sql
SELECT
  t.typname AS enum_name,
  array_agg(e.enumlabel ORDER BY e.enumsortorder) AS values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname IN ('fitness_archetype', 'evolution_stage', 'combat_character')
GROUP BY t.typname;
```

**Expected Output:**
| enum_name | values |
|-----------|--------|
| combat_character | {sean,mary} |
| evolution_stage | {stage_1,stage_2,stage_3} |
| fitness_archetype | {trainer,runner,yoga,bodybuilder,cyclist} |

### Verify 2: user_profiles Table Structure

```sql
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name IN (
    'fitness_archetype', 'avatar_url', 'evolution_stage', 'combat_character',
    'auth_status', 'onboarding_completed', 'photo_upload_url'
  );
```

**Expected Output:** 7 columns with correct types and defaults
- `evolution_stage` default: `'stage_1'::evolution_stage`
- `auth_status` default: `'deferred'::text`
- `onboarding_completed` default: `false`

### Verify 3: Database Functions

```sql
SELECT
  p.proname AS function_name,
  p.prosecdef AS security_definer,
  l.lanname AS language
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
JOIN pg_language l ON p.prolang = l.oid
WHERE n.nspname = 'public'
  AND p.proname IN ('create_deferred_user_profile', 'upgrade_deferred_to_auth', 'handle_new_user');
```

**Expected Output:** All 3 functions with `security_definer = true` and `language = plpgsql`

### Verify 4: Row Level Security (RLS)

```sql
-- Check RLS is enabled
SELECT relrowsecurity FROM pg_class WHERE relname = 'user_profiles';
-- Expected: true (t)

-- Check RLS Policies
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'user_profiles';
```

**Expected Output:** At least 4 policies:
1. "Users can view own profile" (SELECT) - allows viewing own profile OR deferred profiles
2. "Users can update own profile" (UPDATE)
3. "Users can insert own profile" (INSERT)
4. "Service role full access" (ALL)

### Verify 5: Trigger

```sql
SELECT
  t.tgname AS trigger_name,
  p.proname AS function_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth'
  AND c.relname = 'users'
  AND t.tgname = 'on_auth_user_created';
```

**Expected Output:** Trigger exists and calls `handle_new_user` function

### Verify 6: Functional Test (Deferred Profile Creation)

```sql
DO $$
DECLARE
  v_user_id UUID;
  v_username TEXT := 'test_verify_' || substr(md5(random()::text), 1, 6);
BEGIN
  -- Create deferred user
  v_user_id := public.create_deferred_user_profile(v_username, 'Verification Test');

  -- Verify auth_status
  ASSERT (SELECT auth_status FROM public.user_profiles WHERE id = v_user_id) = 'deferred',
    'Auth status should be deferred';

  -- Cleanup
  DELETE FROM public.user_profiles WHERE id = v_user_id;

  RAISE NOTICE 'Deferred profile creation test PASSED for user: %', v_username;
END $$;
```

**Expected Output:** Notice message confirming test passed

---

## Part 4: Type Definition Generation

After applying migrations, regenerate TypeScript types to include new RPC functions:

```bash
# Using Supabase CLI
npx supabase gen types typescript \
  --project-id noxwzelpibuytttlgztq \
  > apps/mobile-shell/src/types/database.types.ts
```

This resolves TypeScript errors for `create_deferred_user_profile` and `upgrade_deferred_to_auth` RPC calls.

---

## Part 5: Testing Authentication

### Manual Testing via Supabase Dashboard

1. **Create a Deferred User:**
   ```sql
   SELECT create_deferred_user_profile('testuser', 'Test User');
   ```

2. **Verify in Database:**
   - Go to Table Editor → user_profiles
   - Find the new profile
   - Confirm `auth_status = 'deferred'`

3. **Create an Authenticated User:**
   - Go to Authentication → Users → Add User
   - Enter email and temporary password

4. **Verify Auto-Profile Creation:**
   - Check user_profiles table
   - Profile should exist with `auth_status = 'authenticated'`
   - Username should be auto-populated from email

### Integration Testing via Mobile App

See `apps/mobile-shell/src/services/__tests__/authService.integration.test.ts` for comprehensive test suite.

**Note:** Tests require React Native environment with AsyncStorage mocks. For quick verification, use manual testing via the app or Supabase Dashboard.

---

## Troubleshooting

### Issue: "Type 'X' is not assignable" errors in authService.ts

**Cause:** Database types not regenerated after migration

**Solution:** Run type generation command (Part 4)

### Issue: Deferred user creation fails with foreign key error

**Cause:** `user_profiles_id_fkey` constraint prevents creating profiles without auth.users record

**Solution:** This should already be fixed. Verify constraint is dropped:
```sql
SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'user_profiles' AND constraint_name = 'user_profiles_id_fkey';
```

Expected: Empty result (constraint should not exist)

### Issue: Session not persisting across app restarts

**Cause:** AsyncStorage not properly configured

**Solution:** Verify Step 3 in Part 1

---

## Security Notes

### Service Role Key

⚠️ **NEVER** expose the Service Role Key in client-side code. It has full database access bypassing RLS.

- ✅ Use ANON_KEY for client-side operations
- ✅ Use Service Role Key only in:
  - Server-side code
  - Supabase Edge Functions
  - Admin scripts (never committed to git)

### Known Security Issue

The `upgradeDeferredToAuth` function in `authService.ts` has a critical flaw:
- Attempts to use `supabase.auth.admin.deleteUser()` client-side for rollback
- This requires Service Role Key and will fail
- **Recommendation:** Refactor to Edge Function for secure transaction handling

---

## Additional Resources

- [Supabase Authentication Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [React Native Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-react-native)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

---

## Support

For issues related to this setup:
1. Check Supabase Dashboard → Logs for error details
2. Run verification queries from Part 3
3. Review Story 1.2 documentation in `docs/stories/1.2.supabase-auth.story.md`
