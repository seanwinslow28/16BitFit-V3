# Claude Code on the Web - Autonomous Implementation Prompt
## Prevention Strategy Implementation (Phases 1-2)

**Repository:** `seanwinslow28/16BitFit-V3`
**Branch:** `fix/p0-build-stabilization`
**Environment:** Claude Code on the Web (Trusted Sources)
**Duration:** ~1.5 hours
**Goal:** Implement ESLint rules + Expo environment variable migration

---

## 🎯 Your Mission

You are Claude Code on the Web, tasked with implementing **Phases 1-2 of the prevention strategy** for 16BitFit V3. This will prevent the TypeScript compilation errors that blocked the overnight development session on 2025-11-14.

**What you'll do:**
1. ✅ **Phase 1 (30 min):** Add ESLint rules to prevent web library imports
2. ✅ **Phase 2 (1 hour):** Migrate from `env.ts` to Expo environment variables

**Success criteria:**
- ESLint catches forbidden imports in VS Code
- Environment variables use modern Expo approach
- TypeScript compilation: 0 errors
- All tests pass
- Two git commits created with detailed messages

---

## 📚 Required Reading (CRITICAL - Read First)

**Before starting ANY work, read these files IN ORDER:**

### 1. **PREVENTION_IMPLEMENTATION_MASTER_GUIDE.md** (PRIMARY SOURCE)
**Location:** `docs/PREVENTION_IMPLEMENTATION_MASTER_GUIDE.md`
**Read:** Entire document (~13,500 words)
**Why:** Contains complete step-by-step instructions for both phases

### 2. **BUILD_ISSUES_ANALYSIS.md** (CONTEXT)
**Location:** Root directory
**Read:** Sections "The 3 Critical Issues" and "Root Cause"
**Why:** Understand what broke and why

### 3. **PREVENTION_STRATEGY_ANALYSIS.md** (RATIONALE)
**Location:** Root directory
**Read:** Section "Cost-Benefit Analysis by Prevention Strategy"
**Why:** Understand WHY we're doing this and the ROI

### 4. **Current Codebase State**
**Files to inspect:**
- `apps/mobile-shell/.eslintrc.js` (ESLint config)
- `apps/mobile-shell/src/services/supabaseClient.ts` (Current env approach)
- `apps/mobile-shell/src/config/env.ts` (To be replaced)
- `apps/mobile-shell/.gitignore` (Verify .env is gitignored)

**Command to verify current state:**
```bash
cd apps/mobile-shell
npx tsc --noEmit  # Should show 0 errors (critical fixes already applied)
ls -la src/config/ # Should see env.ts and env.example.ts
grep "EXPO_PUBLIC" src/services/supabaseClient.ts || echo "Not using Expo vars yet"
```

---

## 🚨 CRITICAL PREREQUISITES

**Before you start, VERIFY these conditions:**

### ✅ Pre-Flight Checklist

Run these commands and verify output:

```bash
# 1. TypeScript compilation works (0 errors expected)
cd apps/mobile-shell
npx tsc --noEmit
echo "✅ TypeScript status: $?"

# 2. Tests pass (OnboardingContext should PASS)
npm test -- OnboardingContext.test.tsx
echo "✅ OnboardingContext tests: PASS"

# 3. Git status is clean (no uncommitted changes blocking work)
cd ..
git status
echo "✅ Git status checked"

# 4. On correct branch
git branch | grep "* fix/p0-build-stabilization"
echo "✅ Branch: fix/p0-build-stabilization"
```

**Expected results:**
- TypeScript: 0 errors ✅
- OnboardingContext tests: PASS ✅
- Git: On `fix/p0-build-stabilization` branch ✅

**If ANY of these fail:** STOP and report the issue. Do NOT proceed.

---

## 📋 Phase 1: ESLint Prevention Rules

### Time Estimate: 30 minutes

### Goal

Add ESLint `no-restricted-imports` rule to prevent web library imports in React Native code.

### Why This Matters

**Error #1 (2025-11-14)** was caused by importing `@testing-library/react` instead of `@testing-library/react-native`. This rule will:
- Show instant red squiggly line in VS Code
- Prevent autonomous agents from making same mistake
- Catch error at write-time, not compile-time

### Implementation Steps

**Follow the MASTER GUIDE exactly:**
- Location: `docs/PREVENTION_IMPLEMENTATION_MASTER_GUIDE.md`
- Section: "Phase 1: ESLint Prevention Rules"
- Steps: 1-8

**Key tasks:**
1. Edit `apps/mobile-shell/.eslintrc.js`
2. Add `no-restricted-imports` rule with 4 forbidden libraries
3. Test rule works (intentionally break it, verify error)
4. Add documentation comments
5. Commit changes

### Exact ESLint Rule to Add

**File:** `apps/mobile-shell/.eslintrc.js`

**Add this to `rules:` section:**

```javascript
// Prevent web library imports in React Native
// React Native uses @testing-library/react-native, NOT @testing-library/react
// This rule prevents Error #1 type issues (see: BUILD_ISSUES_ANALYSIS.md)
// Added: 2025-11-15 after overnight autonomous dev session failure
'no-restricted-imports': [
  'error',
  {
    paths: [
      {
        name: '@testing-library/react',
        message: 'Use @testing-library/react-native for React Native projects. See: https://callstack.github.io/react-native-testing-library/',
      },
      {
        name: 'react-dom',
        message: 'Do not use react-dom in React Native projects. React Native uses native components, not DOM.',
      },
      {
        name: '@testing-library/react-hooks',
        message: 'Use renderHook from @testing-library/react-native instead (React 18+). See: https://callstack.github.io/react-native-testing-library/docs/api/#renderhook',
      },
      {
        name: 'enzyme',
        message: 'Enzyme is deprecated for React 18+. Use @testing-library/react-native instead.',
      },
    ],
  },
],
```

### Validation Commands

**After implementing Phase 1, run:**

```bash
cd apps/mobile-shell

# 1. Verify no ESLint errors in existing code
npx eslint src/

# 2. Test rule catches forbidden imports
echo "import { render } from '@testing-library/react';" > /tmp/test-eslint.tsx
npx eslint /tmp/test-eslint.tsx
# Expected: Error message about using react-native version

# 3. Verify TypeScript still works
npx tsc --noEmit
# Expected: 0 errors

# 4. Verify tests still pass
npm test
# Expected: All tests pass
```

**If all pass:** ✅ Proceed to commit

### Git Commit

```bash
cd /Users/seanwinslow/Desktop/Claude\ Desktop\ Access\ Folders/16BitFit-V3

git add apps/mobile-shell/.eslintrc.js

git commit -m "feat: Add ESLint rules to prevent web library imports

Prevents Error #1 type issues (testing library import confusion).

Added no-restricted-imports rule to catch:
- @testing-library/react (use react-native version)
- react-dom (incompatible with React Native)
- @testing-library/react-hooks (deprecated in React 18+)
- enzyme (deprecated)

Benefits:
- VS Code shows instant red squiggly line
- AI agents see ESLint error and self-correct
- Prevents 90% of similar import errors

Related:
- Phase 1 of prevention strategy
- See: docs/PREVENTION_IMPLEMENTATION_MASTER_GUIDE.md
- Analysis: PREVENTION_STRATEGY_ANALYSIS.md

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 📋 Phase 2: Expo Environment Variables Migration

### Time Estimate: 1 hour

### Goal

Migrate from manual `env.ts` file to Expo environment variables using `.env` files and `EXPO_PUBLIC_` prefix.

### Why This Matters

**Error #3 (2025-11-14)** was caused by missing `env.ts` file. Current approach requires manual `cp env.example.ts env.ts` which:
- Is brittle and error-prone
- Autonomous agents don't know to do this
- Not aligned with 2025 Expo best practices

### Implementation Steps

**Follow the MASTER GUIDE exactly:**
- Location: `docs/PREVENTION_IMPLEMENTATION_MASTER_GUIDE.md`
- Section: "Phase 2: Expo Environment Variables Migration"
- Steps: 1-8

**Key tasks:**
1. Create `.env.example` template
2. Create local `.env` file (gitignored)
3. Update `supabaseClient.ts` to use `process.env.EXPO_PUBLIC_*`
4. Delete old `src/config/env.ts` and `env.example.ts`
5. Update `.gitignore` (verify)
6. Test app starts without errors
7. Update README with setup instructions
8. Commit changes

### Critical Files to Modify

#### File 1: Create `.env.example`

**Location:** `apps/mobile-shell/.env.example`

**Content:**
```bash
# Supabase Configuration
# Copy this file to .env and fill in your actual values
# DO NOT commit .env to git (it contains secrets)

EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Notes:
# - EXPO_PUBLIC_ prefix makes variables available to client code
# - These are PUBLIC variables (embedded in compiled app)
# - Never put truly secret keys here (they will be visible in app bundle)
# - For production builds, use EAS Secrets: https://docs.expo.dev/eas/environment-variables/
```

---

#### File 2: Create Local `.env`

**Location:** `apps/mobile-shell/.env`

**⚠️ CRITICAL:** Use actual Supabase credentials from existing `src/config/env.ts`

**Content:**
```bash
EXPO_PUBLIC_SUPABASE_URL=https://noxwzelpibuytttlgztq.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<copy_from_existing_env.ts>
```

**How to get the anon key:**
```bash
# Read from existing env.ts
cat apps/mobile-shell/src/config/env.ts | grep SUPABASE_ANON_KEY
```

---

#### File 3: Update supabaseClient.ts

**Location:** `apps/mobile-shell/src/services/supabaseClient.ts`

**Replace entire file with:**

```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '../types/database.types';

/**
 * Supabase Client Configuration
 * Uses Expo environment variables (EXPO_PUBLIC_ prefix)
 *
 * Setup:
 * 1. Copy apps/mobile-shell/.env.example to .env
 * 2. Fill in your Supabase project URL and anon key
 * 3. Never commit .env to git (contains secrets)
 *
 * Production:
 * - Use EAS Secrets: eas secret:push --scope project EXPO_PUBLIC_SUPABASE_URL
 * - See: https://docs.expo.dev/eas/environment-variables/
 */

// Load environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validation: Fail early if required variables are missing
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  const missingVars: string[] = [];
  if (!SUPABASE_URL) missingVars.push('EXPO_PUBLIC_SUPABASE_URL');
  if (!SUPABASE_ANON_KEY) missingVars.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');

  throw new Error(
    `❌ Missing required environment variables:\n` +
    `${missingVars.map(v => `  - ${v}`).join('\n')}\n\n` +
    `Setup instructions:\n` +
    `1. Copy .env.example to .env:\n` +
    `   cd apps/mobile-shell\n` +
    `   cp .env.example .env\n\n` +
    `2. Edit .env and add your Supabase credentials\n\n` +
    `See: apps/mobile-shell/.env.example for template`
  );
}

/**
 * Supabase client instance
 * Configured with AsyncStorage for session persistence
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Persist session in React Native AsyncStorage
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Not applicable for mobile
  },
});

/**
 * Supabase Configuration Details
 *
 * Project: 16BitFit V3
 * URL: https://noxwzelpibuytttlgztq.supabase.co
 *
 * Features enabled:
 * - Authentication (email/password, OAuth)
 * - Database with Row Level Security (RLS)
 * - Realtime subscriptions
 * - Edge Functions
 * - Storage
 *
 * Session persistence:
 * - Uses AsyncStorage to persist auth sessions across app restarts
 * - Auto-refreshes tokens to maintain session validity
 * - Sessions survive app force-quit and device restart
 */
```

---

#### File 4: Delete Old Config Files

```bash
cd apps/mobile-shell/src/config
rm env.ts env.example.ts
cd ..
rmdir config 2>/dev/null || echo "Config directory has other files"
```

---

### Validation Commands

**After implementing Phase 2, run:**

```bash
cd apps/mobile-shell

# 1. Verify .env file exists and is gitignored
ls -la .env
cd ..
git status | grep -v ".env" || echo "✅ .env is gitignored"

# 2. Verify old config files are deleted
ls apps/mobile-shell/src/config/ 2>&1 | grep "No such file" || echo "⚠️ Config dir still exists"

# 3. TypeScript compilation
cd apps/mobile-shell
npx tsc --noEmit
# Expected: 0 errors

# 4. Tests pass
npm test
# Expected: All tests pass

# 5. App starts without errors
npx expo start --clear
# Expected: No environment variable errors
# Press Ctrl+C after verifying it starts
```

**If all pass:** ✅ Proceed to commit

### Git Commit

```bash
cd /Users/seanwinslow/Desktop/Claude\ Desktop\ Access\ Folders/16BitFit-V3

git add apps/mobile-shell/.env.example
git add apps/mobile-shell/src/services/supabaseClient.ts
git add apps/mobile-shell/.gitignore
git add README.md

# Verify .env is NOT in staging area
git status | grep "\.env$" && echo "❌ ERROR: .env should not be committed!" || echo "✅ .env is gitignored"

git commit -m "feat: Migrate to Expo environment variables (2025 best practice)

Replaces manual env.ts file with standard .env approach.

Changes:
- Created .env.example template with EXPO_PUBLIC_ prefix
- Updated supabaseClient.ts to use process.env
- Deleted src/config/env.ts and env.example.ts
- Added helpful error messages if variables missing
- Updated README with setup instructions

Benefits:
- Industry standard .env pattern
- Automatic Expo environment variable loading
- EAS integration for production builds
- Better DX (every dev knows .env files)
- Prevents Error #3 type provisioning failures

Migration:
- Phase 2 of prevention strategy
- See: docs/PREVENTION_IMPLEMENTATION_MASTER_GUIDE.md
- Analysis: PREVENTION_STRATEGY_ANALYSIS.md

References:
- Expo Docs: https://docs.expo.dev/guides/environment-variables/
- EAS Secrets: https://docs.expo.dev/eas/environment-variables/

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## ✅ Final Validation (After Both Phases)

### Complete System Check

```bash
cd apps/mobile-shell

echo "🔍 FINAL VALIDATION SUITE"
echo ""

echo "1. TypeScript Compilation:"
npx tsc --noEmit && echo "✅ PASS" || echo "❌ FAIL"
echo ""

echo "2. ESLint Check:"
npx eslint src/ && echo "✅ PASS" || echo "❌ FAIL"
echo ""

echo "3. Test Suite:"
npm test && echo "✅ PASS" || echo "❌ FAIL"
echo ""

echo "4. Environment Variables:"
npx expo start --clear &
sleep 10
kill %1
echo "✅ App started (manual verification)"
echo ""

echo "5. Git Status:"
cd ..
git status --short
echo ""

echo "6. Commits Created:"
git log --oneline -2
echo ""
```

**Expected output:**
- TypeScript: ✅ PASS (0 errors)
- ESLint: ✅ PASS (0 errors)
- Tests: ✅ PASS (all tests passing)
- Environment: ✅ App starts without crashes
- Git: 2 new commits visible

---

## 🎯 Success Criteria

Your implementation is successful if ALL of these are true:

### Phase 1 Success Criteria

- [ ] ESLint rule added to `.eslintrc.js`
- [ ] Rule includes all 4 forbidden libraries
- [ ] Test with forbidden import shows error
- [ ] VS Code shows red squiggly for forbidden imports (manual check)
- [ ] TypeScript compilation: 0 errors
- [ ] All tests pass
- [ ] Git commit created with proper message

### Phase 2 Success Criteria

- [ ] `.env.example` created with EXPO_PUBLIC_ prefix
- [ ] Local `.env` file created (gitignored)
- [ ] `supabaseClient.ts` updated to use `process.env`
- [ ] Old `src/config/env.ts` deleted
- [ ] `.env` confirmed gitignored (not in git status)
- [ ] TypeScript compilation: 0 errors
- [ ] All tests pass
- [ ] App starts without environment errors
- [ ] README updated with setup instructions
- [ ] Git commit created with proper message

### Overall Success Criteria

- [ ] 2 git commits created (one per phase)
- [ ] Both commits have detailed messages
- [ ] TypeScript: 0 errors
- [ ] Tests: All passing
- [ ] No secrets committed to git
- [ ] Documentation updated

---

## 🚨 Common Pitfalls to Avoid

### ❌ DON'T DO THIS:

1. **Don't commit `.env` file**
   - It contains secrets
   - Should be gitignored
   - Double-check with `git status`

2. **Don't skip validation steps**
   - Always run TypeScript + tests after each phase
   - Catch errors early

3. **Don't use wrong import names**
   - ESLint rule should block `@testing-library/react` (web)
   - NOT `@testing-library/react-native` (correct)

4. **Don't forget EXPO_PUBLIC_ prefix**
   - Variables MUST start with `EXPO_PUBLIC_`
   - Otherwise they won't be accessible in app

5. **Don't modify other files**
   - Stick to the plan
   - Don't refactor unrelated code

### ✅ DO THIS:

1. **Read master guide thoroughly first**
   - Don't skip the reading phase
   - Understand WHY before HOW

2. **Validate after each step**
   - Run TypeScript check
   - Run tests
   - Verify changes worked

3. **Use exact code from guide**
   - Copy-paste when provided
   - Don't improvise

4. **Commit with detailed messages**
   - Use provided commit message templates
   - Include context and reasoning

5. **Test ESLint rule actually works**
   - Intentionally break it
   - Verify error appears

---

## 📊 Time Tracking

Track your time for each phase:

**Phase 1: ESLint Rules**
- Start time: [record when you start]
- Reading: ~10 min
- Implementation: ~15 min
- Validation: ~5 min
- Total: ~30 min

**Phase 2: Expo Environment Variables**
- Start time: [record when you start]
- Reading: ~15 min
- Implementation: ~30 min
- Validation: ~15 min
- Total: ~1 hour

**Total expected: ~1.5 hours**

---

## 🆘 If Something Goes Wrong

### Troubleshooting Steps

**If TypeScript errors appear:**
1. Read error message carefully
2. Check if you deleted wrong files
3. Verify imports are correct
4. Consult MASTER GUIDE troubleshooting section

**If tests fail:**
1. Check which tests failed
2. Did you modify test files accidentally?
3. Are environment variables set correctly?
4. Restart Metro: `npx expo start --clear`

**If ESLint not working:**
1. Restart VS Code
2. Check rule syntax in `.eslintrc.js`
3. Run `npx eslint --version` to verify install
4. Test with known forbidden import

**If environment variables undefined:**
1. Verify `.env` exists in `apps/mobile-shell/`
2. Restart Metro bundler
3. Check variable names are exact
4. Ensure EXPO_PUBLIC_ prefix present

### Emergency Rollback

**If you need to undo everything:**

```bash
# Discard all changes
git reset --hard HEAD
git clean -fd

# Verify back to starting state
npx tsc --noEmit
npm test
```

**Then:** Re-read guide and try again

---

## 📝 Deliverables

When you're done, you should have:

### Files Created/Modified

**Phase 1:**
- ✅ `apps/mobile-shell/.eslintrc.js` (modified)

**Phase 2:**
- ✅ `apps/mobile-shell/.env.example` (created)
- ✅ `apps/mobile-shell/.env` (created, gitignored)
- ✅ `apps/mobile-shell/src/services/supabaseClient.ts` (modified)
- ✅ `apps/mobile-shell/src/config/env.ts` (deleted)
- ✅ `apps/mobile-shell/src/config/env.example.ts` (deleted)
- ✅ `apps/mobile-shell/.gitignore` (verified)
- ✅ `README.md` (updated)

### Git Commits

**Commit 1:** "feat: Add ESLint rules to prevent web library imports"
**Commit 2:** "feat: Migrate to Expo environment variables (2025 best practice)"

### Validation Results

- ✅ TypeScript: 0 errors
- ✅ ESLint: 0 errors
- ✅ Tests: All passing
- ✅ App: Starts successfully
- ✅ Secrets: Not committed to git

---

## 🎓 Learning Resources

### If you need more context:

**Use Context7 MCP for latest documentation:**
```bash
# ESLint best practices
context7 query "ESLint no-restricted-imports React Native 2025"

# Expo environment variables
context7 query "Expo SDK 52 environment variables EXPO_PUBLIC 2025"
context7 query "EAS Secrets production builds React Native"
```

**Official documentation:**
- ESLint: https://eslint.org/docs/latest/rules/no-restricted-imports
- Expo env vars: https://docs.expo.dev/guides/environment-variables/
- React Native Testing Library: https://callstack.github.io/react-native-testing-library/

---

## 🚀 Ready to Start?

### Pre-execution Checklist

Before you begin autonomous implementation:

- [ ] Read entire AUTONOMOUS_IMPLEMENTATION_PROMPT.md (this file)
- [ ] Read PREVENTION_IMPLEMENTATION_MASTER_GUIDE.md (primary source)
- [ ] Verified TypeScript compilation: 0 errors
- [ ] Verified OnboardingContext tests: PASSING
- [ ] Verified on correct branch: `fix/p0-build-stabilization`
- [ ] Understood the WHY (read BUILD_ISSUES_ANALYSIS.md context)
- [ ] Have 1.5 hours available for focused work
- [ ] Ready to create 2 git commits

**If all checked:** ✅ **BEGIN IMPLEMENTATION**

---

## 🎯 Execution Order

**Follow this exact sequence:**

1. **Pre-flight validation** (5 min)
   - Run TypeScript check
   - Run tests
   - Verify git branch

2. **Phase 1: ESLint Rules** (30 min)
   - Read Phase 1 section in MASTER GUIDE
   - Implement rule in `.eslintrc.js`
   - Validate rule works
   - Commit Phase 1

3. **Phase 2: Expo Env Vars** (1 hour)
   - Read Phase 2 section in MASTER GUIDE
   - Create `.env.example` and `.env`
   - Update `supabaseClient.ts`
   - Delete old config files
   - Validate app starts
   - Update README
   - Commit Phase 2

4. **Final validation** (5 min)
   - Run complete system check
   - Verify 2 commits created
   - Verify no secrets in git

**Total time:** ~1.5 hours

---

## ✅ Final Confirmation

**Before submitting your work, verify:**

- [ ] ESLint rule prevents `@testing-library/react` import
- [ ] Environment variables use `EXPO_PUBLIC_` prefix
- [ ] Old `env.ts` file is deleted
- [ ] `.env` file is gitignored (not in `git status`)
- [ ] TypeScript: 0 errors
- [ ] Tests: All passing
- [ ] 2 commits created with detailed messages
- [ ] No secrets committed to git
- [ ] README updated with environment setup instructions

**If all checked:** ✅ **IMPLEMENTATION COMPLETE**

---

## 📞 Reporting Results

After completing implementation, create a summary file:

**Create:** `PREVENTION_IMPLEMENTATION_RESULTS.md`

**Content:**
```markdown
# Prevention Strategy Implementation Results

**Date:** [timestamp]
**Duration:** [actual time spent]
**Agent:** Claude Code on the Web

## Summary

✅ Phase 1 (ESLint): COMPLETE
✅ Phase 2 (Expo Env): COMPLETE

## Validation Results

- TypeScript: [0 errors | X errors]
- ESLint: [0 errors | X errors]
- Tests: [All pass | X failed]
- App starts: [SUCCESS | FAIL]

## Commits Created

1. [commit hash] - ESLint rules
2. [commit hash] - Expo environment variables

## Issues Encountered

[None | List any issues and how they were resolved]

## Files Modified

[List all files created/modified/deleted]

## Next Steps

Ready for component development. Build is stable.
```

---

**Good luck! You've got this!** 🚀

**Remember:** Read first, implement carefully, validate thoroughly, commit with context.

**The build depends on you.** 🎯
