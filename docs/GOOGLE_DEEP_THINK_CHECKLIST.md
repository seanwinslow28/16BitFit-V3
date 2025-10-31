# Google Deep Think - Quick Reference Checklist

## Step 1: Upload Files in This Order

### Critical Files (Must Include)
- [ ] `docs/ARCHITECT_REVIEW_STORY_1.2_CRITICAL_BUG_ANALYSIS.md` - Full architectural analysis
- [ ] `docs/qa/STORY_1.2_AUTOMATED_TEST_RESULTS.md` - Actual test failure details
- [ ] `supabase/migrations/20251025000000_add_auth_profile_fields.sql` - Current broken implementation
- [ ] `supabase/functions/upgrade-deferred-user/index.ts` - Edge Function to modify
- [ ] `docs/qa/STORY_1.2_AUTOMATED_TEST_PLAN.md` - Test specifications

### Highly Recommended
- [ ] `docs/stories/1.2.supabase-auth.story.md` - Requirements and acceptance criteria
- [ ] `supabase/migrations/20251024131738_initial_schema.sql` - Base schema with FK constraints

### Optional (If Deep Think Needs More Context)
- [ ] `apps/mobile-shell/src/services/authService.ts` - Client integration
- [ ] `apps/mobile-shell/src/types/database.types.ts` - Type definitions

---

## Step 2: Copy This Prompt

Open `docs/GEMINI_DEEP_THINK_PROMPT_STORY_1.2_FIX.md` and copy the entire prompt from the triple backticks section.

---

## Step 3: Submit to Google Deep Think

Paste the prompt and wait for the comprehensive implementation playbook.

---

## Step 4: Provide Output to Backend/Auth Agent

Once you receive the playbook from Google Deep Think, provide it to the backend/auth agent with this message:

```
backend/auth agent -- Google Deep Think has analyzed the Story 1.2 bug and created
a comprehensive implementation playbook. Please follow the playbook exactly to fix
the critical upgrade bug. The playbook includes:

1. Pre-flight verification queries
2. Production-ready SQL migration
3. Exact Edge Function code changes
4. Complete test sequence
5. Edge case handling
6. Rollback procedures

Execute each phase sequentially and report status after each phase. If ANY step
fails, STOP immediately and report the error.

[PASTE GOOGLE DEEP THINK OUTPUT HERE]
```

---

## Expected Timeline

- Google Deep Think analysis: 2-5 minutes
- Backend/Auth agent execution: 75-120 minutes
- Total: ~2 hours

---

## Success Criteria

✅ All 5 tests in test plan PASS
✅ No orphaned database records
✅ Child records transfer correctly
✅ Story 1.2 acceptance criteria met

---

## If Things Go Wrong

1. Check the error message against Google Deep Think's edge case section
2. Execute rollback procedure from the playbook
3. Report to architect (Winston) for review
4. Do not attempt manual fixes without review

---

## Quick Reference: What We're Fixing

**Problem:** Deferred user upgrades fail with "duplicate key violation"

**Root Cause:** 3 architectural flaws
1. Trigger-RPC race condition
2. Primary key update attempt
3. No child record handling

**Solution:** Copy-Merge-Delete pattern
1. Let trigger create authenticated profile
2. Copy deferred data to authenticated profile
3. Transfer child records (workouts, avatars)
4. Delete deferred profile

**Implementation:** 1 migration + 1 Edge Function update

**Risk Level:** Medium (has rollback, all changes reversible)

**Impact:** Unblocks Story 1.2 acceptance criteria
