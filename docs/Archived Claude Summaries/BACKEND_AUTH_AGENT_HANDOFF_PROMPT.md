# Backend/Auth Agent - Story 1.2 Critical Bug Fix

**Priority:** 🔴 CRITICAL - BLOCKING
**Agent Role:** Backend/Auth Agent
**Task:** Fix deferred user upgrade bug and validate all tests pass
**Estimated Time:** 75-120 minutes

---

## SITUATION BRIEFING

The Story 1.2 automated test suite identified a **CRITICAL BUG** that prevents deferred users from upgrading to authenticated accounts. The bug has been thoroughly analyzed and a solution has been architected.

### Current Status
- ✅ Test 1: Create deferred user - **PASSED**
- ❌ Test 2: Successful upgrade - **FAILED** (duplicate key violation)
- ⬜ Tests 3-5: Not yet run (blocked by Test 2 failure)

### The Bug
When a deferred user attempts to upgrade to authenticated:
```
ERROR: duplicate key value violates unique constraint "user_profiles_pkey"
```

### Root Cause (3 Architectural Flaws)
1. **Trigger-RPC Race Condition:** `handle_new_user()` trigger creates a profile before `upgrade_deferred_to_auth()` RPC can execute, causing a primary key collision
2. **Primary Key Update Attempt:** RPC tries to UPDATE the primary key, which violates database best practices and fails if child records exist
3. **No Child Record Handling:** Workouts, avatars, and combat_sessions are not transferred during upgrade

### The Solution: Copy-Merge-Delete Pattern
Instead of updating the primary key, work WITH the trigger:
1. Let trigger create authenticated profile
2. Copy deferred data INTO authenticated profile
3. Transfer child records to new profile ID
4. Delete deferred profile

---

## YOUR MISSION

Execute the fix designed by the architect (Winston). Follow the implementation plan exactly as specified in the architectural analysis document.

**Success Criteria:**
- ✅ All 5 tests in test plan PASS
- ✅ No orphaned records in database
- ✅ Child records transfer correctly
- ✅ Original usernames and timestamps preserved
- ✅ Story 1.2 acceptance criteria met

---

## REQUIRED READING (Read in This Order)

### 1. **Architectural Analysis (PRIMARY GUIDE)** 🔴 CRITICAL
**File:** `docs/ARCHITECT_REVIEW_STORY_1.2_CRITICAL_BUG_ANALYSIS.md`

This document contains:
- Complete root cause analysis (all 3 flaws explained)
- Solution comparison (4 options evaluated, 1 recommended)
- **Production-ready SQL migration** (Phase 1)
- **Exact Edge Function modifications** (Phase 2)
- **Complete test sequence** (Phase 3)
- Risk assessment and rollback procedures
- Foreign key analysis and data integrity considerations

**What to focus on:**
- Section: "Recommended Implementation Plan" (starting around line 600)
- Subsection: "Phase 1: Create Migration" - Contains complete SQL
- Subsection: "Phase 2: Update Edge Function" - Contains TypeScript changes
- Subsection: "Phase 3: Testing & Validation" - Contains test sequence

---

### 2. **Test Results (UNDERSTAND THE FAILURE)** 🟡 HIGH
**File:** `docs/qa/STORY_1.2_AUTOMATED_TEST_RESULTS.md`

This document shows:
- Exact error message from Test 2 failure
- Current execution flow (broken)
- What was expected vs what actually happened
- Database state at time of failure

**What to focus on:**
- Section: "Test 2: Successful Upgrade Flow" (lines 90-117)
- Section: "Root Cause Analysis" (lines 121-217)
- Appendix: Error details and trigger chain

---

### 3. **Test Plan (VALIDATION CRITERIA)** 🟡 HIGH
**File:** `docs/qa/STORY_1.2_AUTOMATED_TEST_PLAN.md`

This document defines:
- All 5 tests with exact SQL queries
- Expected results for each test
- Verification queries for data integrity
- Edge Function invocation examples

**What to focus on:**
- Test 1: Create Test Deferred User (lines 29-55)
- Test 2: Successful Upgrade Flow (lines 58-115)
- Test 3: Rollback on Duplicate Email (lines 119-173)
- Test 4: Rollback on Invalid Deferred ID (lines 177-216)
- Test 5: Edge Function Permissions (lines 220-239)

---

### 4. **Deep Think Analysis Review (SITUATIONAL AWARENESS)** 🟢 MEDIUM
**File:** `docs/DEEP_THINK_ANALYSIS_REVIEW.md`

This document explains:
- Why Google Deep Think's response doesn't address this bug
- What Deep Think analyzed (general auth setup, not the bug)
- Why we're using the architect's plan instead
- Validation that architect's approach is correct

**What to focus on:**
- Section: "Comparison Analysis" (lines 12-50)
- Section: "My Recommendation: Option A" (lines 165-170)

---

### 5. **Story Definition (ACCEPTANCE CRITERIA)** 🟢 MEDIUM
**File:** `docs/stories/1.2.supabase-auth.story.md`

This document contains:
- Original requirements and acceptance criteria
- Implementation notes and file references
- Known issues from previous remediation

**What to focus on:**
- Section: "Acceptance Criteria" (lines 13-19)
- Section: "Dev Agent Record" (lines 229-267)

---

### 6. **Current Migration (REFERENCE ONLY)** 🟢 LOW
**File:** `supabase/migrations/20251025000000_add_auth_profile_fields.sql`

This is the CURRENT BROKEN implementation. Read it to understand what exists, but DO NOT use this SQL. You will create a NEW migration to fix it.

**What to focus on:**
- Lines 118-145: Current broken `upgrade_deferred_to_auth()` RPC
- Lines 151-176: Current `handle_new_user()` trigger
- Understanding what needs to be REPLACED

---

### 7. **Current Edge Function (NEEDS MODIFICATION)** 🟡 HIGH
**File:** `supabase/functions/upgrade-deferred-user/index.ts`

This is the Edge Function that orchestrates the upgrade. It works correctly but needs modification to pass username in metadata.

**What to focus on:**
- Lines 34-47: Where `createUser()` is called (needs modification)
- Lines 52-76: RPC call and rollback logic (works correctly)
- Understanding current flow so you can modify it correctly

---

## EXECUTION PLAN (Follow Sequentially)

### ⚠️ IMPORTANT: Use MCP Tools Only

You have Supabase MCP tools available:
- `mcp__supabase__execute_sql` - For verification queries
- `mcp__supabase__apply_migration` - For applying the fix
- `mcp__supabase__deploy_edge_function` - For deploying updated Edge Function
- `mcp__supabase__list_edge_functions` - For checking deployment
- `Bash` with `curl` - For invoking Edge Function during tests

DO NOT attempt to use interactive shells, manual file edits, or other non-MCP methods.

---

### PHASE 1: PRE-FLIGHT VERIFICATION (10 minutes)

**Goal:** Verify current database state before making changes

**Step 1.1:** Verify Supabase connection
```typescript
mcp__supabase__list_projects()
// Confirm project noxwzelpibuytttlgztq is ACTIVE_HEALTHY
```

**Step 1.2:** Verify current RPC function signature
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT pg_get_functiondef(oid) as definition
    FROM pg_proc
    WHERE proname = 'upgrade_deferred_to_auth';
  `
})
// Document the current implementation
```

**Step 1.3:** Verify current trigger function
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT pg_get_functiondef(oid) as definition
    FROM pg_proc
    WHERE proname = 'handle_new_user';
  `
})
// Document the current implementation
```

**Step 1.4:** Check for existing deferred users with child records
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT
      COUNT(DISTINCT up.id) as deferred_users_with_data,
      COUNT(DISTINCT w.id) as workouts,
      COUNT(DISTINCT a.id) as avatars,
      COUNT(DISTINCT cs.id) as combat_sessions
    FROM user_profiles up
    LEFT JOIN workouts w ON w.user_id = up.id
    LEFT JOIN avatars a ON a.user_id = up.id
    LEFT JOIN combat_sessions cs ON cs.user_id = up.id
    WHERE up.auth_status = 'deferred';
  `
})
// If > 0, note that production data exists and be extra careful
```

**Checkpoint 1:** Document pre-flight state. You should now have:
- Current RPC function definition
- Current trigger function definition
- Count of deferred users (if any)
- Confirmation that project is healthy

---

### PHASE 2: APPLY DATABASE MIGRATION (15 minutes)

**Goal:** Update RPC and trigger functions to implement copy-merge-delete pattern

**Step 2.1:** Get the complete migration SQL

From the architect's document (`ARCHITECT_REVIEW_STORY_1.2_CRITICAL_BUG_ANALYSIS.md`), locate the section:
**"Phase 1: Create Migration (Immediate)"** (around line 600)

Copy the ENTIRE SQL migration from the code block. The migration includes:
1. Updated `upgrade_deferred_to_auth()` RPC (copy-merge-delete logic)
2. Updated `handle_new_user()` trigger (username from metadata)
3. Index additions
4. Comments

**Step 2.2:** Apply the migration

```typescript
mcp__supabase__apply_migration({
  project_id: "noxwzelpibuytttlgztq",
  name: "fix_upgrade_conflict",
  query: `
    -- PASTE THE COMPLETE SQL FROM ARCHITECT'S DOCUMENT HERE
    -- Do NOT modify the SQL - use it exactly as provided
  `
})
```

**Step 2.3:** Verify migration applied successfully

```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    -- Verify function updated (should include child record transfer logic)
    SELECT
      p.proname,
      pg_get_functiondef(p.oid) LIKE '%Transfer child records%' as has_child_transfer,
      pg_get_functiondef(p.oid) LIKE '%DELETE FROM public.user_profiles%' as has_delete
    FROM pg_proc p
    WHERE p.proname = 'upgrade_deferred_to_auth';
  `
})
// Expected: has_child_transfer = true, has_delete = true
```

**Step 2.4:** Check migration history

```typescript
mcp__supabase__list_migrations({
  project_id: "noxwzelpibuytttlgztq"
})
// Verify new migration appears in the list
```

**Checkpoint 2:** Migration applied. You should have:
- ✅ Migration applied successfully
- ✅ RPC function updated with copy-merge-delete logic
- ✅ Trigger function updated to extract username from metadata
- ✅ Verification queries confirm changes

---

### PHASE 3: UPDATE EDGE FUNCTION (10 minutes)

**Goal:** Modify Edge Function to fetch username and pass in metadata

**Step 3.1:** Read current Edge Function

```typescript
mcp__supabase__get_edge_function({
  project_id: "noxwzelpibuytttlgztq",
  function_slug: "upgrade-deferred-user"
})
// Review current implementation
```

**Step 3.2:** Create modified version

From the architect's document, locate **"Phase 2: Update Edge Function"** (around line 750)

The modifications needed:
1. **BEFORE `createUser()` call (around line 34):** Add username fetching
2. **IN `createUser()` call (around line 38):** Add `user_metadata` with username

Create the modified Edge Function with these changes applied.

**Step 3.3:** Deploy updated Edge Function

```typescript
mcp__supabase__deploy_edge_function({
  project_id: "noxwzelpibuytttlgztq",
  name: "upgrade-deferred-user",
  files: [{
    name: "index.ts",
    content: `
      // PASTE THE COMPLETE MODIFIED EDGE FUNCTION HERE
      // Include all original code + the username fetching modifications
    `
  }],
  entrypoint_path: "index.ts"
})
```

**Step 3.4:** Verify deployment

```typescript
mcp__supabase__list_edge_functions({
  project_id: "noxwzelpibuytttlgztq"
})
// Confirm version incremented and status is ACTIVE
```

**Checkpoint 3:** Edge Function updated. You should have:
- ✅ Username fetching added before createUser()
- ✅ user_metadata passed to createUser()
- ✅ Edge Function deployed successfully
- ✅ Version number incremented

---

### PHASE 4: EXECUTE TEST SUITE (30-45 minutes)

**Goal:** Run all 5 tests from test plan and verify they PASS

Follow the test plan document (`STORY_1.2_AUTOMATED_TEST_PLAN.md`) exactly.

#### Test 1: Create Test Deferred User

**Execute:**
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: "SELECT create_deferred_user_profile('test_upgrade_user', 'Test Upgrade User');"
})
```

**Save the returned UUID as:** `DEFERRED_USER_ID_1`

**Verify:**
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT id, username, auth_status, display_name
    FROM user_profiles
    WHERE username = 'test_upgrade_user';
  `
})
```

**Expected:** auth_status = 'deferred', username = 'test_upgrade_user'

**Result:** ✅ PASS or ❌ FAIL

---

#### Test 2: Successful Upgrade Flow (THIS IS THE CRITICAL TEST)

**Execute:** Invoke Edge Function via curl

Get project URL and anon key first:
```typescript
mcp__supabase__get_project_url({ project_id: "noxwzelpibuytttlgztq" })
mcp__supabase__get_anon_key({ project_id: "noxwzelpibuytttlgztq" })
```

Then invoke Edge Function:
```bash
Bash({
  command: `curl -X POST "https://noxwzelpibuytttlgztq.supabase.co/functions/v1/upgrade-deferred-user" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer {ANON_KEY}" \
    -d '{
      "deferredUserId": "{DEFERRED_USER_ID_1}",
      "email": "test_upgrade_success@16bitfit.test",
      "password": "SecureTestPassword123!"
    }'`,
  description: "Invoke Edge Function for successful upgrade test"
})
```

**Expected Response:** JSON with `session` and `user` objects (NOT an error)

**Verify auth user created:**
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT id, email, email_confirmed_at
    FROM auth.users
    WHERE email = 'test_upgrade_success@16bitfit.test';
  `
})
```

**Expected:** User exists, email_confirmed_at IS NOT NULL

**Verify profile upgraded:**
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT id, username, auth_status, display_name, created_at
    FROM user_profiles
    WHERE username = 'test_upgrade_user';
  `
})
```

**Expected:**
- auth_status = 'authenticated'
- id matches auth user id
- username = 'test_upgrade_user' (preserved)
- display_name = 'Test Upgrade User' (preserved)

**Verify deferred profile deleted:**
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT COUNT(*) as count
    FROM user_profiles
    WHERE id = '{DEFERRED_USER_ID_1}';
  `
})
```

**Expected:** count = 0 (deferred profile deleted)

**Result:** ✅ PASS or ❌ FAIL

**⚠️ CRITICAL:** If Test 2 FAILS, STOP immediately and report the error. Do not proceed to Tests 3-5.

---

#### Test 3: Rollback on Duplicate Email

**Step 3.1:** Create second deferred user
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: "SELECT create_deferred_user_profile('test_duplicate_check', 'Test Duplicate Check');"
})
```

**Save UUID as:** `DEFERRED_USER_ID_2`

**Step 3.2:** Attempt upgrade with existing email
```bash
Bash({
  command: `curl -X POST "https://noxwzelpibuytttlgztq.supabase.co/functions/v1/upgrade-deferred-user" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer {ANON_KEY}" \
    -d '{
      "deferredUserId": "{DEFERRED_USER_ID_2}",
      "email": "test_upgrade_success@16bitfit.test",
      "password": "AnotherPassword123!"
    }'`,
  description: "Test rollback on duplicate email"
})
```

**Expected Response:** JSON with `error` field (status 400)

**Step 3.3:** Verify no side effects

Check NO new auth user created:
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT COUNT(*) as user_count
    FROM auth.users
    WHERE email = 'test_upgrade_success@16bitfit.test';
  `
})
```

**Expected:** user_count = 1 (only original from Test 2)

Check deferred user remains deferred:
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT id, username, auth_status
    FROM user_profiles
    WHERE username = 'test_duplicate_check';
  `
})
```

**Expected:** auth_status = 'deferred' (NOT upgraded)

**Result:** ✅ PASS or ❌ FAIL

---

#### Test 4: Rollback on Invalid Deferred ID

**Step 4.1:** Attempt upgrade with fake deferred ID
```bash
Bash({
  command: `curl -X POST "https://noxwzelpibuytttlgztq.supabase.co/functions/v1/upgrade-deferred-user" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer {ANON_KEY}" \
    -d '{
      "deferredUserId": "00000000-0000-0000-0000-000000000000",
      "email": "test_rollback_check@16bitfit.test",
      "password": "RollbackTestPassword123!"
    }'`,
  description: "Test rollback on invalid deferred ID"
})
```

**Expected Response:** JSON with `error` field (status 400)

**Step 4.2:** Verify rollback executed (CRITICAL CHECK)
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT COUNT(*) as user_count
    FROM auth.users
    WHERE email = 'test_rollback_check@16bitfit.test';
  `
})
```

**Expected:** user_count = 0 (NO orphaned auth user)

**If user_count > 0:** ❌ CRITICAL FAILURE - Rollback did not work

**Result:** ✅ PASS or ❌ FAIL

---

#### Test 5: Edge Function Permissions (No-JWT)

**Step 5.1:** Invoke Edge Function WITHOUT authorization header
```bash
Bash({
  command: `curl -X POST "https://noxwzelpibuytttlgztq.supabase.co/functions/v1/upgrade-deferred-user" \
    -H "Content-Type: application/json" \
    -d '{
      "deferredUserId": "{DEFERRED_USER_ID_2}",
      "email": "test_permissions@16bitfit.test",
      "password": "TestPassword123!"
    }'`,
  description: "Test Edge Function permissions without JWT"
})
```

**Expected:** Request should NOT be rejected with 401 Unauthorized

**Result:** ✅ PASS or ❌ FAIL

---

**Checkpoint 4:** All tests executed. Document results for each test.

---

### PHASE 5: DATA INTEGRITY VERIFICATION (10 minutes)

**Goal:** Ensure no orphaned records or data corruption

**Step 5.1:** Check for orphaned auth users (without profiles)
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT au.id, au.email
    FROM auth.users au
    LEFT JOIN user_profiles up ON au.id = up.id
    WHERE up.id IS NULL;
  `
})
```

**Expected:** 0 rows (no orphaned auth users)

**Step 5.2:** Check for orphaned profiles (without auth users)
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT up.id, up.username, up.auth_status
    FROM user_profiles up
    LEFT JOIN auth.users au ON up.id = au.id
    WHERE up.auth_status = 'authenticated' AND au.id IS NULL;
  `
})
```

**Expected:** 0 rows (no orphaned authenticated profiles)

**Step 5.3:** Check for deferred profiles that should have been deleted
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    SELECT id, username, auth_status
    FROM user_profiles
    WHERE username IN ('test_upgrade_user', 'test_duplicate_check')
      AND auth_status = 'deferred';
  `
})
```

**Expected:**
- 0 rows for 'test_upgrade_user' (should be deleted)
- 1 row for 'test_duplicate_check' (should still be deferred)

**Checkpoint 5:** Data integrity verified. No orphaned records found.

---

### PHASE 6: CLEANUP (5 minutes)

**Goal:** Remove test data from database

**Execute cleanup:**
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: `
    -- Delete test profiles
    DELETE FROM user_profiles
    WHERE username IN ('test_upgrade_user', 'test_duplicate_check');

    -- Note: Auth users should be deleted via Supabase Dashboard or Admin API
    -- For now, document the test user emails that need manual cleanup
  `
})
```

**Document test users for manual cleanup:**
- test_upgrade_success@16bitfit.test
- (any other test emails used)

**Checkpoint 6:** Test data cleaned up.

---

### PHASE 7: CREATE TEST RESULTS REPORT (10 minutes)

**Goal:** Document test execution and results

**Create/Update file:** `docs/qa/STORY_1.2_AUTOMATED_TEST_RESULTS.md`

**Update the following sections:**

1. **Overall Result:** Change from ❌ CRITICAL FAILURE to ✅ PASS (if all tests passed)

2. **Test Execution Summary:** Update the table:
```markdown
| Test | Status | Notes |
|------|--------|-------|
| Test 0: Prerequisites | ✅ PASS | ... |
| Test 1: Create Deferred User | ✅ PASS | UUID: {actual_uuid} |
| Test 2: Successful Upgrade | ✅ PASS | Session returned, profile upgraded |
| Test 3: Duplicate Email Rollback | ✅ PASS | Error returned, no side effects |
| Test 4: Invalid ID Rollback | ✅ PASS | No orphaned auth user |
| Test 5: No-JWT Permissions | ✅ PASS | Request not rejected |
```

3. **Add "Remediation Results" section:**
```markdown
## Remediation Results (October 27, 2025)

### Migration Applied
- Migration: `fix_upgrade_conflict`
- Date: {current_date}
- Execution time: {duration}

### Changes Made
1. Updated `upgrade_deferred_to_auth()` RPC to implement copy-merge-delete pattern
2. Updated `handle_new_user()` trigger to extract username from user_metadata
3. Modified Edge Function to fetch and pass username in metadata

### Test Results
- All 5 tests PASSED
- No orphaned records detected
- Child record transfer verified (if applicable)
- Data integrity checks passed

### Deployment
- Migration version: {version}
- Edge Function version: {version}
- Project status: ACTIVE_HEALTHY
```

**Checkpoint 7:** Test results documented.

---

### PHASE 8: UPDATE STORY STATUS (5 minutes)

**Goal:** Mark Story 1.2 as fully validated

**Update file:** `docs/stories/1.2.supabase-auth.story.md`

**Update status line:**
```markdown
**Status:** ✅ Completed & Validated
```

**Update Dev Agent Record section:**
Add to the end of existing content:
```markdown

### Final Validation (October 27, 2025)
- ✅ Critical bug in upgrade flow FIXED (trigger-RPC conflict resolved)
- ✅ All 5 automated tests PASSED
- ✅ Copy-merge-delete pattern implemented successfully
- ✅ Child record transfer verified
- ✅ Data integrity checks passed
- ✅ All acceptance criteria validated

### Bug Fix Implementation
- Applied migration: `fix_upgrade_conflict`
- Updated Edge Function: `upgrade-deferred-user` (version {X})
- Root cause: Trigger-RPC race condition + primary key update attempt
- Solution: Copy-merge-delete pattern with username preservation
- Execution time: {duration}
```

**Update Acceptance Criteria Status:**
Verify all are marked ✅ PASS (if tests passed)

**Checkpoint 8:** Story documentation updated.

---

## SUCCESS CRITERIA CHECKLIST

Before marking this task complete, verify ALL of the following:

### Database Changes
- [ ] Migration `fix_upgrade_conflict` applied successfully
- [ ] `upgrade_deferred_to_auth()` RPC uses copy-merge-delete pattern
- [ ] `handle_new_user()` trigger extracts username from metadata
- [ ] Indexes added for performance

### Edge Function Changes
- [ ] Username fetching added before createUser()
- [ ] user_metadata passed to createUser() with username
- [ ] Edge Function deployed successfully
- [ ] Version number incremented

### Test Results
- [ ] Test 1: Create Deferred User - ✅ PASS
- [ ] Test 2: Successful Upgrade - ✅ PASS (CRITICAL)
- [ ] Test 3: Duplicate Email Rollback - ✅ PASS
- [ ] Test 4: Invalid ID Rollback - ✅ PASS
- [ ] Test 5: No-JWT Permissions - ✅ PASS

### Data Integrity
- [ ] No orphaned auth users (auth.users without user_profiles)
- [ ] No orphaned profiles (authenticated profiles without auth.users)
- [ ] Test data cleaned up
- [ ] Child records verified (if applicable)

### Documentation
- [ ] Test results report updated
- [ ] Story 1.2 status updated
- [ ] Migration notes documented
- [ ] Known issues resolved

### Acceptance Criteria (Story 1.2)
- [ ] AC1: Supabase client initialized - ✅ PASS
- [ ] AC2: Profiles table created - ✅ PASS
- [ ] AC3: Email/Social auth configured - ✅ PASS
- [ ] AC4: Deferred auth implemented & upgrade works - ✅ PASS
- [ ] AC5: Session persistence works - ✅ PASS

---

## IF SOMETHING GOES WRONG

### Rollback Procedure

If ANY step fails critically:

1. **STOP immediately** - Do not proceed to next step

2. **Capture error details:**
   - Exact error message
   - Which step failed
   - Database state at failure
   - Edge Function logs (if applicable)

3. **Execute rollback migration:**
```typescript
mcp__supabase__apply_migration({
  project_id: "noxwzelpibuytttlgztq",
  name: "rollback_upgrade_fix",
  query: `
    -- Restore original functions from 20251025000000_add_auth_profile_fields.sql
    -- (Get SQL from line 118-176 of that file)
  `
})
```

4. **Deploy previous Edge Function version:**
Check git history or Supabase dashboard for previous version

5. **Verify rollback:**
```typescript
// Run the pre-flight queries again
// Verify functions match original implementation
```

6. **Report to architect:**
- What failed
- Error messages
- Rollback status
- Request guidance

### Common Errors & Solutions

**Error:** "Migration failed - function already exists"
**Solution:** Add `CREATE OR REPLACE FUNCTION` instead of `CREATE FUNCTION`

**Error:** "Edge Function deployment timed out"
**Solution:** Check Edge Function logs in Supabase Dashboard, verify syntax

**Error:** "Test 2 still fails with duplicate key"
**Solution:** Verify username is being passed in user_metadata correctly

**Error:** "Child records not transferred"
**Solution:** Check RPC function includes UPDATE statements for all child tables

---

## ESTIMATED TIMELINE

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Pre-flight verification | 10 min |
| 2 | Apply database migration | 15 min |
| 3 | Update Edge Function | 10 min |
| 4 | Execute test suite | 30-45 min |
| 5 | Data integrity verification | 10 min |
| 6 | Cleanup | 5 min |
| 7 | Create test results report | 10 min |
| 8 | Update story status | 5 min |

**Total: 75-120 minutes**

**Buffer for troubleshooting: +30 minutes**

---

## FINAL NOTES

### What Makes This Fix Critical

This bug **completely blocks** deferred user upgrades, which is a core feature of Story 1.2. Without this fix:
- Users cannot convert their trial accounts to authenticated accounts
- All their progress (workouts, avatars) would be lost
- Story 1.2 acceptance criteria cannot be validated

### Why This Solution Works

The copy-merge-delete pattern:
1. ✅ Works WITH the trigger instead of against it
2. ✅ Preserves all user data (timestamps, usernames, child records)
3. ✅ Follows database best practices (immutable primary keys)
4. ✅ Handles all edge cases (foreign keys, concurrent access)
5. ✅ Is fully atomic and reversible

### Confidence Level

This solution has been:
- ✅ Thoroughly analyzed by the system architect
- ✅ Validated against all 3 architectural flaws
- ✅ Tested for edge cases and failure modes
- ✅ Designed with rollback safety
- ✅ Mapped to exact SQL and TypeScript code

**Expected success rate: 95%+**

The 5% risk accounts for:
- Unexpected database state
- Typos when copying SQL
- Network/deployment issues

These are mitigated by:
- Pre-flight checks
- Rollback procedures
- Step-by-step verification

---

## YOUR COMMITMENT

By executing this plan, you commit to:
1. ✅ Following the steps exactly as written
2. ✅ Running all verification queries
3. ✅ STOPPING if any test fails
4. ✅ Documenting results thoroughly
5. ✅ Executing rollback if needed

**When complete, report:**
- ✅ All 5 tests PASSED
- ✅ Migration applied successfully
- ✅ Edge Function deployed successfully
- ✅ No orphaned records
- ✅ Documentation updated

---

## BEGIN EXECUTION

You are cleared to proceed. Start with Phase 1: Pre-Flight Verification.

Good luck! 🚀

---

**Prepared by:** Winston (System Architect)
**Approved for execution:** 2025-10-27
**Priority:** CRITICAL
**Blockers:** None
