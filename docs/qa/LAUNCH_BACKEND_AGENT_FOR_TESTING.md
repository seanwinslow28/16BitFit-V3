# Launch Backend/Auth Agent for Story 1.2 Testing

**Purpose:** Quick-start guide to launch an agent for automated backend testing

---

## Option 1: Copy-Paste Prompt (Recommended)

**Copy the text below and send to the Backend/Auth Agent:**

```
You are the Backend/Auth Agent. Execute the automated test plan for Story 1.2.

OBJECTIVE: Verify the Edge Function upgrade-deferred-user works correctly, including rollback scenarios.

INSTRUCTIONS:
1. Read the test plan: docs/qa/STORY_1.2_AUTOMATED_TEST_PLAN.md
2. Execute all 5 tests in order using Supabase MCP
3. Document results for each test
4. Save a summary report to: docs/qa/STORY_1.2_AUTOMATED_TEST_RESULTS.md

PROJECT CONTEXT:
- Project ID: noxwzelpibuytttlgztq
- Edge Function: upgrade-deferred-user (already deployed)
- Database: user_profiles table with auth_status field

CRITICAL VERIFICATIONS:
- Test 2: Successful upgrade creates auth user and updates profile
- Test 3: Duplicate email does NOT create orphaned auth user
- Test 4: Invalid deferred ID triggers rollback (auth user deleted)

Execute the tests now. Report any failures immediately.
```

---

## Option 2: Detailed Agent Setup

If you need to provide more context to the agent:

```
ROLE: Backend/Auth Agent
TASK: Execute Story 1.2 Automated Test Suite

BACKGROUND:
Story 1.2 implemented a secure Edge Function (upgrade-deferred-user) to handle
deferred user upgrades with atomic transactions and rollback. This function was
created to resolve a critical security flaw where client-side rollback was
failing. We need to verify the Edge Function works correctly.

TEST PLAN LOCATION: docs/qa/STORY_1.2_AUTOMATED_TEST_PLAN.md

TOOLS AVAILABLE:
- Supabase MCP connector (for SQL queries and admin operations)
- Edge Function invocation via Supabase Functions API
- Database read/write access

EXECUTION REQUIREMENTS:
1. Execute tests sequentially (Test 1 → Test 2 → Test 3 → Test 4 → Test 5)
2. For each test:
   a. Execute the SQL/API calls as specified
   b. Verify expected results
   c. Document actual results
   d. Mark PASS or FAIL
3. If any test FAILS, STOP and report immediately
4. After all tests complete, create summary report

OUTPUT FORMAT:
Save results to: docs/qa/STORY_1.2_AUTOMATED_TEST_RESULTS.md

Include:
- Test execution summary table
- All SQL query results
- All UUIDs and identifiers captured
- Any errors or unexpected behavior
- Overall PASS/FAIL determination

BEGIN EXECUTION NOW.
```

---

## Option 3: Manual Supabase Dashboard Testing

If agent testing is not available, Winston can execute tests manually:

### Setup
1. Open: https://supabase.com/dashboard/project/noxwzelpibuytttlgztq/editor
2. Open SQL Editor tab
3. Open test plan: docs/qa/STORY_1.2_AUTOMATED_TEST_PLAN.md

### Execution
1. Copy SQL from Test 1 → Execute → Record results
2. Copy SQL from Test 2 → Execute → Record results
3. Continue for all 5 tests
4. Document results in: docs/qa/STORY_1.2_AUTOMATED_TEST_RESULTS.md

---

## Expected Timeline

- Agent setup: 2 minutes
- Test execution: 10-15 minutes
- Results documentation: 3-5 minutes
- **Total: ~20 minutes**

---

## Success Criteria

All 5 tests must PASS:
- ✅ Test 1: Deferred user created
- ✅ Test 2: Upgrade succeeds, profile updated
- ✅ Test 3: Duplicate email rejected, no side effects
- ✅ Test 4: Invalid ID triggers rollback
- ✅ Test 5: Edge Function accepts no-jwt calls

**If any test FAILS:** Stop and report to Winston immediately.

---

## After Testing Completes

1. Review results in: docs/qa/STORY_1.2_AUTOMATED_TEST_RESULTS.md
2. If ALL PASS: Proceed to Phase 2 (Manual Native Testing)
3. If ANY FAIL: Developer Agent must fix issues before proceeding
