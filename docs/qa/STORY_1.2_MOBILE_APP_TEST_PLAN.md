# Story 1.2 - Mobile App Test Plan

**Test Date:** October 28, 2025
**Environment:** Development (iOS Simulator)
**Tester:** Development Team
**Story:** 1.2 - Supabase Backend Setup & Basic Auth

---

## 🎯 Test Objectives

Validate that the deferred user upgrade functionality works correctly in the mobile app environment after backend fixes have been applied.

**Success Criteria:**
- ✅ Normal email/password signup creates authenticated user with correct username
- ✅ Deferred user can be created and used without authentication
- ✅ Deferred user can upgrade to authenticated account with data preservation
- ✅ Session persistence works across app restarts

---

## 🔧 Prerequisites

### Before Testing:
1. ✅ Story 1.2 backend tests all passing (5/5)
2. ✅ Database migrations applied
3. ✅ Edge Function deployed with JWT verification disabled
4. ✅ Mobile app running in development mode
5. ✅ Supabase client configured in mobile app

### Check Configuration:
```typescript
// Verify in apps/mobile-shell/src/services/supabaseClient.ts
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Start the App:
```bash
# Terminal 1: Start Metro bundler
cd apps/mobile-shell
npm start

# Terminal 2: Run iOS simulator
npm run ios
```

---

## 📋 Test Cases

### Test 1: Normal Email/Password Signup ✅

**Objective:** Verify normal signup flow creates user with email-based username

**Steps:**
1. Open the mobile app
2. Navigate to signup screen
3. Enter test credentials:
   - Email: `testuser1@16bitfit.test`
   - Password: `TestPass123!`
   - Username: (should auto-populate or be extracted from email)
4. Tap "Sign Up"

**Expected Result:**
- ✅ User account created successfully
- ✅ Username is `testuser1` (extracted from email prefix)
- ✅ User profile created in database
- ✅ User redirected to home screen
- ✅ Session persists across app restarts

**Verification Query:**
```sql
SELECT id, username, auth_status, email
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE au.email = 'testuser1@16bitfit.test';
```

**Expected:**
```json
{
  "username": "testuser1",
  "auth_status": "authenticated"
}
```

---

### Test 2: Deferred User Creation ✅

**Objective:** Verify deferred auth allows app usage without signup

**Steps:**
1. Open the mobile app
2. On login screen, tap "Skip for now" or "Try without signing up"
3. Enter username: `test_deferred_user_1`
4. Continue through onboarding
5. Use the app (view home screen, etc.)
6. Close and reopen the app

**Expected Result:**
- ✅ Deferred profile created successfully
- ✅ User can access app features
- ✅ Session persists (deferred user stays logged in)
- ✅ Profile stored in `user_profiles` with `auth_status = 'deferred'`

**Verification Query:**
```sql
SELECT id, username, auth_status, created_at
FROM user_profiles
WHERE username = 'test_deferred_user_1';
```

**Expected:**
```json
{
  "username": "test_deferred_user_1",
  "auth_status": "deferred"
}
```

---

### Test 3: Deferred User Upgrade (Critical) ✅

**Objective:** Verify deferred user can upgrade to authenticated account with full data preservation

**Prerequisites:**
- Deferred user created from Test 2
- User has some data (workouts, avatar, etc.) - optional but recommended

**Steps:**
1. As deferred user, navigate to "Create Account" or "Upgrade" screen
2. Enter credentials:
   - Email: `upgraded@16bitfit.test`
   - Password: `UpgradePass123!`
3. Tap "Create Account" / "Upgrade"
4. Wait for upgrade process

**Expected Result:**
- ✅ Success message displayed
- ✅ User now authenticated
- ✅ Original username `test_deferred_user_1` preserved
- ✅ All user data preserved (workouts, avatar, profile settings)
- ✅ Original `created_at` timestamp preserved
- ✅ Deferred profile deleted from database
- ✅ New auth user created with email `upgraded@16bitfit.test`

**Verification Query:**
```sql
-- Check authenticated profile exists with preserved data
SELECT
  up.id,
  up.username,
  up.auth_status,
  up.created_at,
  au.email
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE au.email = 'upgraded@16bitfit.test';

-- Verify deferred profile was deleted
SELECT COUNT(*) as deferred_count
FROM user_profiles
WHERE username = 'test_deferred_user_1' AND auth_status = 'deferred';
```

**Expected:**
```json
{
  "username": "test_deferred_user_1",  // Preserved!
  "auth_status": "authenticated",
  "email": "upgraded@16bitfit.test",
  "created_at": "[original timestamp]",
  "deferred_count": 0  // Deferred profile deleted
}
```

---

### Test 4: Session Persistence ✅

**Objective:** Verify authenticated sessions persist across app restarts

**Steps:**
1. Sign up or sign in as any authenticated user
2. Note current user state
3. Close the app completely (swipe up from app switcher)
4. Reopen the app

**Expected Result:**
- ✅ User still logged in
- ✅ No login prompt shown
- ✅ User data loaded correctly
- ✅ Session token refreshed automatically

---

### Test 5: Error Handling - Duplicate Email ✅

**Objective:** Verify duplicate email during upgrade is handled gracefully

**Steps:**
1. Create deferred user
2. Separately create authenticated user with email `duplicate@16bitfit.test`
3. As deferred user, attempt upgrade with email `duplicate@16bitfit.test`

**Expected Result:**
- ❌ Error message displayed: "Email already in use" or similar
- ✅ Deferred user not deleted
- ✅ No orphaned auth users created
- ✅ User can try again with different email

---

### Test 6: Error Handling - Network Failure ✅

**Objective:** Verify network errors during upgrade are handled gracefully

**Steps:**
1. Create deferred user
2. Disable network connection
3. Attempt to upgrade
4. Re-enable network

**Expected Result:**
- ❌ Error message displayed: "Network error" or similar
- ✅ User can retry
- ✅ No data corruption
- ✅ Deferred profile intact

---

## 🧪 Edge Cases to Test

### Edge Case 1: Special Characters in Username
- Test usernames with numbers, underscores
- Verify alphanumeric validation works

### Edge Case 2: Long Email Addresses
- Test email addresses > 50 characters
- Verify username truncation if needed

### Edge Case 3: Rapid Successive Actions
- Tap "Upgrade" button multiple times rapidly
- Verify no duplicate auth users created

### Edge Case 4: App Backgrounding During Upgrade
- Start upgrade process
- Background the app mid-upgrade
- Verify proper recovery when foregrounded

---

## 📊 Test Results Template

| Test Case | Status | Notes | Tester | Date |
|-----------|--------|-------|--------|------|
| Test 1: Normal Signup | ⬜ | | | |
| Test 2: Deferred Creation | ⬜ | | | |
| Test 3: Deferred Upgrade | ⬜ | | | |
| Test 4: Session Persistence | ⬜ | | | |
| Test 5: Duplicate Email Error | ⬜ | | | |
| Test 6: Network Error | ⬜ | | | |

---

## 🐛 Bug Reporting Template

**If any test fails, document using this template:**

```markdown
### Bug: [Short Description]

**Test Case:** Test X - [Name]
**Severity:** Critical / High / Medium / Low
**Environment:** iOS Simulator / Android Emulator / Physical Device

**Steps to Reproduce:**
1.
2.
3.

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots/Logs:**
[Attach if available]

**Database State:**
[Run verification query and paste results]

**Next Steps:**
[Suggested fix or investigation path]
```

---

## ✅ Sign-Off Checklist

Before marking Story 1.2 as complete:

- [ ] All 6 test cases executed
- [ ] All tests passing or acceptable failures documented
- [ ] No critical or high-severity bugs found
- [ ] Edge cases tested
- [ ] Session persistence verified
- [ ] Database integrity confirmed
- [ ] Test results documented above
- [ ] Screenshots/videos captured (optional)

---

## 📞 Support Information

**For Issues During Testing:**
- Backend validation results: [STORY_1.2_AUTOMATED_TEST_RESULTS.md](STORY_1.2_AUTOMATED_TEST_RESULTS.md)
- Story documentation: [1.2.supabase-auth.story.md](../stories/1.2.supabase-auth.story.md)
- Architect review: [ARCHITECT_FINAL_REVIEW_SUMMARY.md](../ARCHITECT_FINAL_REVIEW_SUMMARY.md)

**Quick Debugging:**
```sql
-- Check all auth users
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- Check all profiles
SELECT id, username, auth_status, created_at FROM user_profiles ORDER BY created_at DESC LIMIT 10;

-- Find orphaned records
SELECT 'Orphaned Auth Users', COUNT(*) FROM auth.users au LEFT JOIN user_profiles up ON au.id = up.id WHERE up.id IS NULL
UNION ALL
SELECT 'Orphaned Profiles', COUNT(*) FROM user_profiles up LEFT JOIN auth.users au ON up.id = au.id WHERE up.auth_status = 'authenticated' AND au.id IS NULL;
```

---

**Test Plan Prepared By:** Architect
**Date:** October 28, 2025
**Version:** 1.0
