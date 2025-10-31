# Edge Function JWT Configuration Guide

## Critical Configuration Required

The `upgrade-deferred-user` Edge Function **MUST** be configured to allow unauthenticated access, as deferred users do not have JWT tokens.

---

## Current Status

**Status:** ⚠️ **MISCONFIGURED**
- Current Setting: `verify_jwt = true`
- Required Setting: `verify_jwt = false`

**Impact:**
- ❌ Deferred users **CANNOT** upgrade to authenticated accounts
- ❌ Test 5 (No-JWT Permissions) **FAILS**
- ✅ All other functionality works correctly

---

## How to Fix (Manual Configuration Required)

### Via Supabase Dashboard

1. Navigate to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **16BitFit** (ID: `noxwzelpibuytttlgztq`)
3. Go to: **Edge Functions** → **upgrade-deferred-user**
4. Click **Settings** or **Edit**
5. Find **JWT Verification** setting
6. Set to: **Disabled** or toggle `verify_jwt = false`
7. Save changes

### Via Supabase CLI (Alternative)

```bash
# Update function configuration
supabase functions deploy upgrade-deferred-user \
  --no-verify-jwt \
  --project-ref noxwzelpibuytttlgztq
```

---

## Why This Setting Is Required

### Deferred User Flow
```
1. User creates deferred profile (no auth user exists)
2. User uses app without authentication (no JWT token)
3. User decides to upgrade → calls Edge Function
4. Edge Function creates auth user and upgrades profile
5. Edge Function returns session with JWT token
```

**Problem:**
- Step 3 requires calling the Edge Function **WITHOUT** a JWT token
- If `verify_jwt = true`, the request is rejected with 401 Unauthorized
- Deferred users cannot complete the upgrade

### Security Considerations

**Q: Is it safe to disable JWT verification?**

**A: Yes, for this specific Edge Function:**

1. **Input Validation:**
   - Function validates `deferredUserId`, `email`, `password`
   - Checks that deferred profile exists and hasn't been upgraded

2. **No Sensitive Data Exposure:**
   - Function only upgrades profiles that the caller provides valid credentials for
   - Cannot access or modify other users' data

3. **Proper Authorization:**
   - Email/password must be unique (enforced by auth system)
   - RPC function uses `SECURITY DEFINER` with proper checks

4. **Atomic Operations:**
   - All operations in transaction with rollback on failure
   - No orphaned records possible

**Analogy:** This is equivalent to a signup endpoint - users without accounts need to call it to create one.

---

## Verification

After applying the configuration, re-run Test 5:

```bash
curl -X POST "https://noxwzelpibuytttlgztq.supabase.co/functions/v1/upgrade-deferred-user" \
  -H "Content-Type: application/json" \
  -d '{
    "deferredUserId": "some-valid-uuid",
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

**Expected:** Function executes (may return 400 if UUID invalid, but NOT 401)
**Current:** Returns 401 Unauthorized

---

## Alternative Solutions (Not Recommended)

### Option 1: Anonymous Key
- Use a special "upgrade" key instead of anon key
- **Rejected:** Adds unnecessary complexity

### Option 2: Temporary Token
- Generate temporary tokens for deferred users
- **Rejected:** Defeats the purpose of deferred auth

### Option 3: Different Endpoint
- Create a public "signup" endpoint that calls upgrade internally
- **Rejected:** Adds redundant layer, no security benefit

---

## Related Files

- Edge Function: `supabase/functions/upgrade-deferred-user/index.ts`
- Test Plan: [docs/qa/STORY_1.2_AUTOMATED_TEST_PLAN.md](qa/STORY_1.2_AUTOMATED_TEST_PLAN.md)
- Test Results: [docs/qa/STORY_1.2_AUTOMATED_TEST_RESULTS.md](qa/STORY_1.2_AUTOMATED_TEST_RESULTS.md)

---

## Status After Configuration

Once `verify_jwt = false` is set:
- ✅ Test 1: Create Deferred User - PASS
- ✅ Test 2: Successful Upgrade - PASS
- ✅ Test 3: Duplicate Email Rollback - PASS
- ✅ Test 4: Invalid ID Rollback - PASS
- ✅ Test 5: No-JWT Permissions - **WILL PASS**

**Story 1.2 will be 5/5 tests passing and fully production-ready.**
