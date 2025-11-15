# Google Deep Think Prompt - Story 1.2 Critical Bug Remediation

**Purpose:** Generate a comprehensive, step-by-step implementation guide for the backend/auth agent to fix the Story 1.2 deferred user upgrade bug with zero errors.

---

## PROMPT FOR GOOGLE DEEP THINK

```
You are a senior database architect and Supabase expert tasked with creating an implementation guide for a critical bug fix. Your audience is a backend/auth agent that will execute the fix autonomously using Supabase MCP tools.

CONTEXT:
A production React Native fitness app (16BitFit) has a critical bug in its deferred user upgrade flow. Users can create "deferred" accounts without authentication, but when they try to upgrade to authenticated accounts, the process fails due to a trigger-RPC conflict.

YOUR TASK:
Analyze the provided files and create a detailed, sequential implementation plan that includes:
1. The exact SQL migration to apply (with rollback)
2. The exact TypeScript changes for the Edge Function
3. The precise test sequence to validate the fix
4. Potential edge cases and how to handle them
5. Rollback procedures if anything goes wrong
6. Verification steps to confirm success

CRITICAL REQUIREMENTS:
- The backend/auth agent will be using Supabase MCP connector tools
- Every SQL statement must be production-ready (no placeholders)
- Every step must be atomic and reversible
- Consider data integrity, concurrent users, and edge cases
- Provide exact commands, not pseudo-code
- Anticipate common errors and provide solutions

PROBLEM SUMMARY:
The upgrade flow has 3 architectural flaws:
1. Trigger-RPC race condition: handle_new_user() creates a profile before upgrade_deferred_to_auth() can run
2. Primary key update: RPC tries to UPDATE the primary key, which violates best practices
3. Child record handling: No transfer of related data (workouts, avatars, combat_sessions)

SOLUTION ARCHITECTURE:
Copy-Merge-Delete Pattern - Let the trigger create the authenticated profile, then:
1. Fetch deferred profile username
2. Pass username in user_metadata when creating auth user
3. Trigger creates authenticated profile with correct username
4. RPC copies deferred data to authenticated profile
5. RPC transfers child records to new profile ID
6. RPC deletes deferred profile
7. Edge Function returns session

YOUR OUTPUT SHOULD INCLUDE:

## Part 1: Pre-Implementation Verification
- Database state checks to run BEFORE making any changes
- How to verify current functions/triggers
- How to check for existing deferred users with child records

## Part 2: Migration Implementation
- Complete SQL migration with all DDL statements
- Transaction structure (if needed)
- Index additions for performance
- Comments and documentation
- Expected execution time

## Part 3: Migration Rollback Plan
- Complete SQL to reverse the migration
- Conditions under which to rollback
- Data preservation during rollback

## Part 4: Edge Function Updates
- Exact code changes with line numbers
- Where to add username fetching logic
- Where to add user_metadata passing
- Error handling improvements
- Expected behavior changes

## Part 5: Testing Sequence
- Exact order of test execution
- SQL queries to run for each test
- Expected results for each test
- How to verify data integrity after each test
- What to check in Supabase Dashboard

## Part 6: Edge Cases & Error Handling
- What happens if deferred user has 100+ workouts?
- What happens if username is already taken?
- What happens if RPC fails mid-transaction?
- What happens if Edge Function times out?
- Concurrent upgrade attempts by same user
- Network interruptions during upgrade

## Part 7: Post-Deployment Verification
- Queries to verify the fix is working
- Metrics to monitor
- Signs of success vs failure
- When to rollback vs troubleshoot

## Part 8: Step-by-Step Execution Guide
Create a numbered, sequential checklist that the backend/auth agent can follow exactly:
1. Run verification query A
2. Apply migration B
3. Verify migration C
4. Update Edge Function D
5. Deploy Edge Function E
6. Run test F
7. Verify result G
... etc.

CONSTRAINTS:
- Project ID: noxwzelpibuytttlgztq
- Database: PostgreSQL 17.4.1.064
- Edge Function: upgrade-deferred-user (version 1)
- Tools available: Supabase MCP connector (execute_sql, apply_migration, deploy_edge_function)
- The agent cannot use interactive shells or manual interventions
- All operations must be scriptable and automatable

ANALYSIS APPROACH:
1. First, review all provided files to understand current state
2. Identify any discrepancies between documentation and implementation
3. Consider transaction boundaries and atomicity
4. Think through failure modes at each step
5. Ensure backward compatibility (don't break existing authenticated users)
6. Validate that the solution handles all 3 architectural flaws
7. Consider performance impact (the RPC will run for every upgrade)
8. Ensure proper error messages are returned to clients

OUTPUT FORMAT:
Provide your response in Markdown format with:
- Clear section headers
- Code blocks with language syntax highlighting
- Numbered steps for sequential operations
- Warning callouts for critical steps
- Success criteria for each phase

THINK DEEPLY ABOUT:
- Transaction isolation levels
- Race conditions between concurrent upgrades
- Foreign key constraint checking timing
- Trigger execution order and timing
- Index usage and query performance
- Error propagation from RPC → Edge Function → Client
- Data loss scenarios and prevention
- Rollback safety and completeness

Your output will be used directly by an autonomous agent, so precision and completeness are critical. Assume the agent has no prior context beyond what you provide.
```

---

## FILES TO PROVIDE TO GOOGLE DEEP THINK

### Essential Files (MUST INCLUDE)

1. **Architectural Analysis Report**
   - File: `docs/ARCHITECT_REVIEW_STORY_1.2_CRITICAL_BUG_ANALYSIS.md`
   - Why: Contains full problem analysis, solution comparison, and recommended implementation
   - Priority: 🔴 CRITICAL

2. **Test Results Report**
   - File: `docs/qa/STORY_1.2_AUTOMATED_TEST_RESULTS.md`
   - Why: Shows exact failure modes and test expectations
   - Priority: 🔴 CRITICAL

3. **Current Migration File**
   - File: `supabase/migrations/20251025000000_add_auth_profile_fields.sql`
   - Why: Contains current RPC and trigger definitions that need modification
   - Priority: 🔴 CRITICAL

4. **Current Edge Function**
   - File: `supabase/functions/upgrade-deferred-user/index.ts`
   - Why: Shows exact code that needs updating
   - Priority: 🔴 CRITICAL

5. **Test Plan**
   - File: `docs/qa/STORY_1.2_AUTOMATED_TEST_PLAN.md`
   - Why: Defines expected behavior and test sequence
   - Priority: 🔴 CRITICAL

### Important Context Files (HIGHLY RECOMMENDED)

6. **Story Definition**
   - File: `docs/stories/1.2.supabase-auth.story.md`
   - Why: Defines acceptance criteria and requirements
   - Priority: 🟡 HIGH

7. **Database Schema**
   - File: `supabase/migrations/20251024131738_initial_schema.sql`
   - Why: Shows full schema including foreign keys and constraints
   - Priority: 🟡 HIGH

### Supporting Files (OPTIONAL BUT HELPFUL)

8. **Auth Service Implementation**
   - File: `apps/mobile-shell/src/services/authService.ts`
   - Why: Shows client-side integration (helps understand end-to-end flow)
   - Priority: 🟢 MEDIUM

9. **Type Definitions**
   - File: `apps/mobile-shell/src/types/database.types.ts`
   - Why: Shows current database types and structure
   - Priority: 🟢 MEDIUM

---

## STRUCTURED FILE PROMPT

When uploading files to Google Deep Think, provide them in this order with these descriptions:

```
FILE 1: Architectural Analysis Report
Description: Complete analysis of the bug including root cause, 3 architectural flaws,
solution comparison (4 options evaluated), and recommended Copy-Merge-Delete pattern.
Contains detailed execution flow diagrams and risk assessment.

FILE 2: Test Results Report
Description: Actual test execution results showing the exact failure at Test 2
(duplicate key violation). Includes SQL queries run, error messages received,
and expected vs actual behavior.

FILE 3: Current Migration (20251025000000_add_auth_profile_fields.sql)
Description: The migration that created the problematic RPC function
upgrade_deferred_to_auth() and trigger handle_new_user(). This shows the
CURRENT BROKEN implementation that needs to be fixed.

FILE 4: Current Edge Function (upgrade-deferred-user/index.ts)
Description: The Edge Function that orchestrates the upgrade flow. Currently
creates auth user, calls RPC, handles rollback on failure. Needs modification
to fetch username and pass in user_metadata.

FILE 5: Test Plan (STORY_1.2_AUTOMATED_TEST_PLAN.md)
Description: Comprehensive test suite with 5 tests. Tests 1 passed, Test 2 failed,
Tests 3-5 not yet run. Defines expected behavior for all scenarios including
rollback on duplicate email and invalid deferred ID.

FILE 6: Story Definition (1.2.supabase-auth.story.md)
Description: Original requirements and acceptance criteria. Shows what "done"
looks like and lists all related files.

FILE 7: Initial Schema (20251024131738_initial_schema.sql)
Description: Base schema showing user_profiles table structure, foreign key
relationships, and constraints. Essential for understanding FK cascade rules.
```

---

## EXPECTED OUTPUT FROM GOOGLE DEEP THINK

Google Deep Think should produce a document titled:

**"Story 1.2 Critical Bug Fix - Implementation Playbook for Backend/Auth Agent"**

With the following sections:

### Section 1: Pre-Flight Checks (5-10 queries)
```sql
-- Example:
-- Check 1: Verify current RPC function signature
SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'upgrade_deferred_to_auth';

-- Check 2: Count deferred users with child records
SELECT
  COUNT(DISTINCT up.id) as deferred_users_with_data
FROM user_profiles up
LEFT JOIN workouts w ON w.user_id = up.id
LEFT JOIN avatars a ON a.user_id = up.id
WHERE up.auth_status = 'deferred'
  AND (w.id IS NOT NULL OR a.id IS NOT NULL);
```

### Section 2: Migration File (Complete & Production-Ready)
```sql
-- Migration: 20251027HHMMSS_fix_deferred_user_upgrade_conflict.sql
-- Complete SQL with all statements, comments, and verification queries
```

### Section 3: Edge Function Changes (Exact Code)
```typescript
// Line 25: Add this BEFORE createUser()
const { data: deferredProfile, error: fetchError } = await supabaseAdmin
  .from('user_profiles')
  .select('username')
  .eq('id', deferredUserId)
  .eq('auth_status', 'deferred')
  .single();

// Line 35: Modify createUser() to include user_metadata
const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
  email: email,
  password: password,
  email_confirm: true,
  user_metadata: {
    username: deferredProfile.username  // ADD THIS LINE
  }
});
```

### Section 4: Execution Checklist (Numbered Steps)
```
□ Step 1: Verify Supabase connection (Project ID: noxwzelpibuytttlgztq)
□ Step 2: Run pre-flight query A and verify result
□ Step 3: Apply migration using mcp__supabase__apply_migration
□ Step 4: Verify migration success with query B
□ Step 5: Update Edge Function using mcp__supabase__deploy_edge_function
...
□ Step 15: Run full test suite
□ Step 16: Verify all tests pass
□ Step 17: Check for orphaned records (should be 0)
```

### Section 5: Test Execution Script
```sql
-- Test 1: Create deferred user
SELECT create_deferred_user_profile('test_upgrade', 'Test User') as deferred_id;
-- Save result as: $DEFERRED_ID

-- Test 2: Invoke Edge Function (via curl or MCP)
-- Expected: Success, session returned

-- Test 3: Verify profile upgraded
SELECT id, username, auth_status FROM user_profiles WHERE id = $AUTH_ID;
-- Expected: auth_status = 'authenticated', username = 'test_upgrade'

-- Test 4: Verify deferred profile deleted
SELECT id FROM user_profiles WHERE id = $DEFERRED_ID;
-- Expected: 0 rows
```

### Section 6: Edge Case Handling
```
CASE 1: Username already taken
  - Trigger will append random suffix
  - RPC will overwrite with original username from deferred profile
  - Result: User keeps their original username

CASE 2: Deferred user has 100 workouts
  - RPC will UPDATE all workouts in single query
  - Transaction ensures atomicity
  - Expected time: <500ms

CASE 3: RPC fails mid-transaction
  - PostgreSQL will rollback entire transaction
  - Edge Function will detect rpcError
  - Edge Function will delete auth user
  - Result: Deferred profile unchanged, no orphaned data
```

### Section 7: Rollback Procedure
```sql
-- If deployment fails, run this migration:
-- File: 20251027HHMMSS_rollback_upgrade_fix.sql

-- Restore original functions from 20251025000000
CREATE OR REPLACE FUNCTION public.upgrade_deferred_to_auth(...)
-- [Original implementation]
```

### Section 8: Success Verification
```sql
-- Run after deployment to confirm fix is working

-- Query 1: Verify function updated
SELECT
  p.proname,
  pg_get_functiondef(p.oid) LIKE '%Transfer child records%' as has_child_transfer
FROM pg_proc p
WHERE p.proname = 'upgrade_deferred_to_auth';
-- Expected: has_child_transfer = true

-- Query 2: Test upgrade with mock data
-- [Complete test sequence]
```

---

## INSTRUCTIONS FOR BACKEND/AUTH AGENT

Once you receive the output from Google Deep Think, follow this process:

### Phase 1: Review & Validation (5 min)
1. Read the entire implementation playbook
2. Verify all SQL is syntactically correct
3. Check that migration has both UP and DOWN sections
4. Confirm Edge Function changes are TypeScript-valid
5. Ask clarifying questions if anything is ambiguous

### Phase 2: Pre-Flight Checks (5 min)
1. Execute all pre-flight queries from Section 1
2. Document current state (save query results)
3. Verify no production users are mid-upgrade
4. Create a backup reference point

### Phase 3: Execute Migration (10 min)
1. Follow execution checklist exactly
2. Apply migration using `mcp__supabase__apply_migration`
3. Verify each step before proceeding to next
4. If any step fails, STOP and rollback immediately
5. Document migration execution time

### Phase 4: Deploy Edge Function (5 min)
1. Update Edge Function code per Deep Think guidance
2. Deploy using `mcp__supabase__deploy_edge_function`
3. Verify deployment success
4. Check Edge Function logs for errors

### Phase 5: Execute Tests (30 min)
1. Run STORY_1.2_AUTOMATED_TEST_PLAN.md test suite
2. Execute tests sequentially (Test 1 → Test 5)
3. For each test:
   - Execute exactly as specified
   - Verify expected results
   - Document actual results
   - If FAIL, STOP and investigate
4. Run edge case tests from Deep Think playbook
5. Verify no orphaned records exist

### Phase 6: Create Results Report (10 min)
1. Update STORY_1.2_AUTOMATED_TEST_RESULTS.md
2. Change overall status from FAIL to PASS (if tests pass)
3. Document:
   - Migration execution time
   - Edge Function deployment time
   - Test results (all should be PASS)
   - Any warnings or issues encountered
   - Verification query results

### Phase 7: Final Verification (5 min)
1. Run success verification queries from Deep Think playbook
2. Check Supabase Dashboard:
   - Edge Function logs (no errors)
   - Database health (no connection issues)
   - Migration history (new migration applied)
3. Verify Story 1.2 acceptance criteria now met

### Phase 8: Documentation (5 min)
1. Update Story 1.2 status to ✅ PASS
2. Add implementation notes to story file
3. Document lessons learned
4. Update architecture docs if needed

---

## ERROR HANDLING PROTOCOL

If ANY step fails:

### STOP Immediately
- Do not proceed to next step
- Do not attempt to "fix" on the fly

### Diagnose
1. Capture exact error message
2. Identify which step failed
3. Check Deep Think playbook for this error scenario
4. Review relevant section of architect analysis

### Decide
- **Option A:** Error is expected and Deep Think provided solution → Apply solution
- **Option B:** Error is unexpected → Rollback and report
- **Option C:** Unclear → Request human intervention

### Rollback (if needed)
1. Execute rollback migration from Deep Think playbook
2. Verify database state restored
3. Deploy previous Edge Function version
4. Confirm all tests return to previous state

### Report
1. Document what failed and why
2. Document rollback actions taken
3. Create incident report
4. Request architectural review

---

## SUCCESS CRITERIA

The implementation is successful when:

✅ All 5 tests in STORY_1.2_AUTOMATED_TEST_PLAN.md PASS
✅ No orphaned records exist (auth users without profiles, or vice versa)
✅ Child records (workouts, avatars) transfer correctly during upgrade
✅ Original usernames and timestamps are preserved
✅ Edge Function returns valid session after upgrade
✅ No errors in Edge Function logs
✅ Verification queries return expected results
✅ Story 1.2 all acceptance criteria met

---

## TIMELINE ESTIMATE

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Review Google Deep Think output | 5 min | 5 min |
| Pre-flight checks | 5 min | 10 min |
| Execute migration | 10 min | 20 min |
| Deploy Edge Function | 5 min | 25 min |
| Execute test suite | 30 min | 55 min |
| Create results report | 10 min | 65 min |
| Final verification | 5 min | 70 min |
| Documentation | 5 min | 75 min |

**Total: 75 minutes (1 hour 15 minutes)**

With troubleshooting buffer: 90-120 minutes (1.5-2 hours)

---

## APPENDIX: MCP Tool Reference

The backend/auth agent has these Supabase MCP tools available:

### For SQL Operations
```typescript
mcp__supabase__execute_sql({
  project_id: "noxwzelpibuytttlgztq",
  query: "SELECT ..."
})
```

### For Migrations
```typescript
mcp__supabase__apply_migration({
  project_id: "noxwzelpibuytttlgztq",
  name: "fix_upgrade_conflict",
  query: "CREATE OR REPLACE FUNCTION..."
})
```

### For Edge Functions
```typescript
mcp__supabase__deploy_edge_function({
  project_id: "noxwzelpibuytttlgztq",
  name: "upgrade-deferred-user",
  files: [{
    name: "index.ts",
    content: "..."
  }],
  entrypoint_path: "index.ts"
})
```

### For Testing
```typescript
// Use Bash tool to invoke Edge Function
Bash({
  command: 'curl -X POST "https://noxwzelpibuytttlgztq.supabase.co/functions/v1/upgrade-deferred-user" ...',
  description: "Test Edge Function upgrade flow"
})
```

---

**END OF GOOGLE DEEP THINK PROMPT**

This document should be provided to Google Deep Think along with the 7 essential files listed above.
