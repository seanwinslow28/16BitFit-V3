# Story 1.2 - Automated Backend Testing Plan

**Agent:** Backend/Auth Agent
**Tools Required:** Supabase MCP connector
**Estimated Time:** 15-20 minutes
**Objective:** Verify the Edge Function logic, database operations, and rollback mechanisms work correctly

---

## Test Suite Overview

This automated test suite verifies:
1. ✅ Edge Function can create auth users and upgrade profiles
2. ✅ Rollback works on duplicate email (auth user is NOT created/deleted)
3. ✅ Rollback works on invalid deferred ID (auth user is properly deleted)
4. ✅ Database state is correct after success and failure scenarios

---

## Prerequisites

1. Supabase MCP connection active
2. Project ID: `noxwzelpibuytttlgztq`
3. Edge Function `upgrade-deferred-user` deployed
4. Database migrations applied

---

## Test 1: Create Test Deferred User

**Purpose:** Set up a deferred user for upgrade testing

**SQL to Execute:**
```sql
-- Create a test deferred user
SELECT create_deferred_user_profile('test_upgrade_user', 'Test Upgrade User');
```

**Expected Result:**
- Returns a UUID (the deferred user profile ID)

**Save this UUID as:** `DEFERRED_USER_ID_1`

**Verification Query:**
```sql
-- Verify deferred user exists
SELECT id, username, auth_status, display_name
FROM user_profiles
WHERE username = 'test_upgrade_user';
```

**Expected:**
- `auth_status` = 'deferred'
- `username` = 'test_upgrade_user'

---

## Test 2: Successful Upgrade Flow

**Purpose:** Verify the Edge Function successfully upgrades a deferred user

**Method:** Invoke Edge Function via HTTP request or Supabase MCP

**Request:**
```json
{
  "deferredUserId": "<DEFERRED_USER_ID_1>",
  "email": "test_upgrade_success@16bitfit.test",
  "password": "SecureTestPassword123!"
}
```

**Expected Response:**
```json
{
  "session": {
    "access_token": "<token>",
    "refresh_token": "<token>",
    "expires_in": 3600,
    ...
  },
  "user": {
    "id": "<auth_user_id>",
    "email": "test_upgrade_success@16bitfit.test",
    ...
  }
}
```

**Verification Queries:**

1. Check auth user was created:
```sql
-- Query auth.users (requires admin/service role access)
SELECT id, email, email_confirmed_at
FROM auth.users
WHERE email = 'test_upgrade_success@16bitfit.test';
```

Expected:
- User exists
- `email_confirmed_at` IS NOT NULL (auto-confirmed)

2. Check profile was upgraded:
```sql
SELECT id, username, auth_status, display_name, created_at
FROM user_profiles
WHERE username = 'test_upgrade_user';
```

Expected:
- `auth_status` = 'authenticated'
- `id` matches the auth user ID from auth.users

**Result:** ✅ PASS / ❌ FAIL

---

## Test 3: Rollback on Duplicate Email

**Purpose:** Verify rollback when attempting to upgrade with an existing email

### Step 3.1: Create Second Deferred User

```sql
SELECT create_deferred_user_profile('test_duplicate_check', 'Test Duplicate Check');
```

**Save this UUID as:** `DEFERRED_USER_ID_2`

### Step 3.2: Attempt Upgrade with Existing Email

**Request:**
```json
{
  "deferredUserId": "<DEFERRED_USER_ID_2>",
  "email": "test_upgrade_success@16bitfit.test",
  "password": "AnotherPassword123!"
}
```

**Expected Response:**
```json
{
  "error": "User already registered" // or similar Supabase auth error
}
```

**Status Code:** 400

### Step 3.3: Verify No Side Effects

1. Check NO new auth user was created:
```sql
-- Count auth users with this email
SELECT COUNT(*) as user_count
FROM auth.users
WHERE email = 'test_upgrade_success@16bitfit.test';
```

Expected: `user_count` = 1 (only the original from Test 2)

2. Check deferred user remains deferred:
```sql
SELECT id, username, auth_status
FROM user_profiles
WHERE username = 'test_duplicate_check';
```

Expected:
- `auth_status` = 'deferred' (NOT upgraded)

**Result:** ✅ PASS / ❌ FAIL

---

## Test 4: Rollback on Invalid Deferred ID

**Purpose:** Verify rollback when RPC fails (simulated by invalid deferred ID)

### Step 4.1: Attempt Upgrade with Fake Deferred ID

**Request:**
```json
{
  "deferredUserId": "00000000-0000-0000-0000-000000000000",
  "email": "test_rollback_check@16bitfit.test",
  "password": "RollbackTestPassword123!"
}
```

**Expected Response:**
```json
{
  "error": "Upgrade failed: <RPC error message>"
}
```

**Status Code:** 400

### Step 4.2: Verify Rollback Executed

**CRITICAL:** Check NO auth user was left orphaned:

```sql
-- Verify NO user exists with this email
SELECT COUNT(*) as user_count
FROM auth.users
WHERE email = 'test_rollback_check@16bitfit.test';
```

**Expected:** `user_count` = 0

If `user_count` > 0, the rollback FAILED (critical bug).

**Result:** ✅ PASS / ❌ FAIL

---

## Test 5: Edge Function Permissions

**Purpose:** Verify the Edge Function is correctly configured with `--no-verify-jwt`

### Step 5.1: Invoke Without Auth Header

Call the Edge Function without providing an `Authorization` header (simulating an unauthenticated deferred user calling the function).

**Request:**
```json
{
  "deferredUserId": "<any_valid_uuid>",
  "email": "test_permissions@16bitfit.test",
  "password": "TestPassword123!"
}
```

**Expected:** Request should NOT be rejected with 401 Unauthorized.

**Result:** ✅ PASS / ❌ FAIL

---

## Cleanup

**SQL to Execute:**

```sql
-- Delete test profiles
DELETE FROM user_profiles WHERE username IN ('test_upgrade_user', 'test_duplicate_check');

-- Delete test auth users (requires service role)
-- Note: Deleting auth users via SQL is not recommended. Use Supabase Dashboard or Admin API.
-- For automated cleanup, you may use the Supabase MCP delete_user function or skip cleanup.
```

---

## Test Execution Summary Template

| Test | Status | Notes |
|------|--------|-------|
| Test 1: Create Deferred User | ⬜ | UUID: _____________ |
| Test 2: Successful Upgrade | ⬜ | |
| Test 3: Duplicate Email Rollback | ⬜ | |
| Test 4: Invalid ID Rollback | ⬜ | |
| Test 5: No-JWT Permissions | ⬜ | |

**Overall Result:** ⬜ PASS / ⬜ FAIL

**Executed By:** [Agent Name]
**Execution Date:** [Date]
**Time Taken:** [Duration]

---

## Agent Instructions

1. Execute tests in order (Test 1 → Test 5)
2. Record all UUIDs and results
3. If any test fails, STOP and report the failure immediately
4. Document all SQL query results
5. Save final summary to: `docs/qa/STORY_1.2_AUTOMATED_TEST_RESULTS.md`
