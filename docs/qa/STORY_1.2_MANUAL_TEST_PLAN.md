# Story 1.2 - Manual Testing Plan (Native App Testing)

**Tester:** Human (Winston or QA)
**Environment:** iOS Simulator and/or Android Emulator
**Estimated Time:** 30-45 minutes
**Objective:** Verify OAuth deep linking and client-side state management work correctly

---

## Prerequisites

### 1. Configure OAuth Provider (Google) in Supabase

**Steps:**
1. Go to: https://supabase.com/dashboard/project/noxwzelpibuytttlgztq/auth/providers
2. Click on **Google** provider
3. Enable the provider
4. Add redirect URL: `sixteenbitfitv3://auth/callback`
5. Configure Google OAuth credentials (or use test mode if available)
6. Save configuration

### 2. Rebuild Native Applications

**CRITICAL:** The Info.plist and AndroidManifest.xml changes require a native rebuild.

**For iOS:**
```bash
cd /Users/seanwinslow/Desktop/16BitFit-V3/apps/mobile-shell

# Kill Metro if running
killall -9 node

# Clean build folders
rm -rf ios/build
rm -rf ios/Pods
rm -rf ios/Podfile.lock

# Reinstall pods
cd ios
pod install
cd ..

# Run iOS build
npx react-native run-ios
```

**For Android:**
```bash
cd /Users/seanwinslow/Desktop/16BitFit-V3/apps/mobile-shell

# Kill Metro if running
killall -9 node

# Clean build
cd android
./gradlew clean
cd ..

# Run Android build
npx react-native run-android
```

**Expected:** App launches successfully on simulator/emulator.

---

## Test Suite 1: OAuth Deep Linking (Google Sign-In)

### Test 1.1: Initiate OAuth Flow

**Objective:** Verify the app can initiate OAuth and redirect to Google

**Steps:**
1. Launch the app on iOS simulator
2. Navigate to the Sign In screen
3. Tap "Sign in with Google" button
4. **Expected:**
   - Safari/WebView opens showing Google sign-in page
   - URL contains OAuth parameters from Supabase

**Result:** ✅ PASS / ❌ FAIL

**Notes:** _______________________________________________

---

### Test 1.2: Complete OAuth and Verify Redirect

**Objective:** Verify the custom URL scheme redirects back to the app

**Steps:**
1. Complete Google sign-in in the browser/WebView
2. **Expected:**
   - After successful authentication, the browser/WebView redirects to: `sixteenbitfitv3://auth/callback?...`
   - The iOS app automatically opens and comes to foreground
   - The sign-in screen disappears (or navigates to home)

**Result:** ✅ PASS / ❌ FAIL

**Notes:** _______________________________________________

---

### Test 1.3: Verify Session Establishment

**Objective:** Verify the Supabase client captures the OAuth callback and establishes a session

**Steps:**
1. After OAuth redirect, check the app state
2. **How to verify:**
   - Add console logging to `authStore.ts` initialization or use React Native Debugger
   - Check `authStatus` should be `'authenticated'`
   - Check `user` object is populated with Google account info
   - Check `session` object exists with access/refresh tokens

**Expected State:**
```typescript
{
  authStatus: 'authenticated',
  user: {
    id: '<uuid>',
    email: '<google_email>',
    ...
  },
  session: {
    access_token: '<token>',
    refresh_token: '<token>',
    ...
  }
}
```

**Verification Method:**
- Option 1: Add `console.log(useAuthStore.getState())` to App.tsx and check Metro logs
- Option 2: Use React Native Debugger and inspect Redux/Zustand state
- Option 3: Add a debug UI component showing auth status

**Result:** ✅ PASS / ❌ FAIL

**Notes:** _______________________________________________

---

### Test 1.4: Verify Database Profile Created

**Objective:** Confirm auto-profile creation trigger worked

**Steps:**
1. After successful OAuth sign-in, check Supabase Dashboard
2. Go to: https://supabase.com/dashboard/project/noxwzelpibuytttlgztq/editor
3. Open `user_profiles` table
4. Find the row with the Google account email
5. **Expected:**
   - Profile exists
   - `auth_status` = 'authenticated'
   - `username` is set (or null if not provided)
   - `id` matches the auth.users UUID

**Result:** ✅ PASS / ❌ FAIL

**Notes:** _______________________________________________

---

### Test 1.5: Repeat for Android

**Steps:**
1. Build and run on Android emulator (if available)
2. Repeat Tests 1.1 - 1.4
3. **Expected:** Identical behavior to iOS

**Result:** ✅ PASS / ❌ FAIL / ⏭️ SKIPPED

**Notes:** _______________________________________________

---

## Test Suite 2: Deferred User Upgrade Flow (End-to-End in App)

### Prerequisites

**Add Test UI (Temporary):**

Create a test screen in the app with buttons to trigger auth flows. Example:

```typescript
// apps/mobile-shell/src/screens/AuthTestScreen.tsx
import React, { useState } from 'react';
import { View, Button, Text, TextInput } from 'react-native';
import { useAuthStore } from '../stores/authStore';

export function AuthTestScreen() {
  const { createDeferred, upgradeToAuth, authStatus, user, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deferredId, setDeferredId] = useState('');

  return (
    <View style={{ padding: 20 }}>
      <Text>Auth Status: {authStatus}</Text>
      <Text>User: {user?.email || 'None'}</Text>
      <Text>Error: {error || 'None'}</Text>

      <Button
        title="Create Deferred User"
        onPress={async () => {
          const success = await createDeferred('test_deferred_' + Date.now());
          console.log('Deferred created:', success);
        }}
      />

      <TextInput
        placeholder="Deferred User ID"
        value={deferredId}
        onChangeText={setDeferredId}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Upgrade to Auth"
        onPress={async () => {
          const success = await upgradeToAuth(deferredId, email, password);
          console.log('Upgrade result:', success);
        }}
      />
    </View>
  );
}
```

---

### Test 2.1: Create Deferred User via App

**Steps:**
1. Open the test screen or trigger deferred user creation via the actual onboarding flow
2. Tap "Create Deferred User" (or "Skip Login")
3. **Expected:**
   - Function returns success
   - `authStatus` changes to 'deferred'
   - `deferredProfile` is populated
   - Metro logs show the deferred user ID

**Save the deferred user ID for next test**

**Verify in Database:**
```sql
SELECT id, username, auth_status
FROM user_profiles
WHERE username LIKE 'test_deferred_%'
ORDER BY created_at DESC
LIMIT 1;
```

Expected: `auth_status` = 'deferred'

**Result:** ✅ PASS / ❌ FAIL

**Notes:** _______________________________________________

---

### Test 2.2: Upgrade Deferred User via App

**Steps:**
1. In the test screen, enter:
   - **Deferred User ID:** (from Test 2.1)
   - **Email:** `test_app_upgrade@16bitfit.test`
   - **Password:** `TestPassword123!`
2. Tap "Upgrade to Auth"
3. **Expected:**
   - Function returns success
   - `authStatus` changes to 'authenticated'
   - `user` object is populated
   - `session` object is populated
   - Metro logs show success message

**Verify in Database:**
```sql
SELECT id, username, auth_status
FROM user_profiles
WHERE username LIKE 'test_deferred_%'
ORDER BY created_at DESC
LIMIT 1;
```

Expected: `auth_status` = 'authenticated'

**Result:** ✅ PASS / ❌ FAIL

**Notes:** _______________________________________________

---

### Test 2.3: Verify Session Persistence

**Objective:** Ensure session survives app restart

**Steps:**
1. After successful upgrade (Test 2.2), note the current auth status
2. **Force quit the app** (swipe up in iOS app switcher or force stop in Android)
3. **Relaunch the app**
4. **Expected:**
   - App loads and `authStatus` is still 'authenticated'
   - User data is restored from AsyncStorage
   - No re-login required

**Verification:**
- Check Metro logs for "Session restored" or similar
- Check authStore state shows authenticated user

**Result:** ✅ PASS / ❌ FAIL

**Notes:** _______________________________________________

---

### Test 2.4: Test Upgrade Failure (Duplicate Email)

**Steps:**
1. Create ANOTHER deferred user via the app
2. Attempt to upgrade using the SAME email as Test 2.2: `test_app_upgrade@16bitfit.test`
3. **Expected:**
   - Function returns `success: false`
   - Error message shows "User already registered" or similar
   - `authStatus` remains 'deferred' (does NOT change to authenticated)
   - NO crash or unexpected behavior

**Result:** ✅ PASS / ❌ FAIL

**Notes:** _______________________________________________

---

## Test Suite 3: Sign Out and Sign In

### Test 3.1: Sign Out

**Steps:**
1. From an authenticated state, trigger sign out
2. **Expected:**
   - `authStatus` changes to 'unauthenticated'
   - `user` becomes null
   - `session` becomes null
   - User is redirected to login screen

**Result:** ✅ PASS / ❌ FAIL

---

### Test 3.2: Sign In with Email/Password

**Steps:**
1. From signed-out state, navigate to sign-in screen
2. Enter email: `test_app_upgrade@16bitfit.test`
3. Enter password: `TestPassword123!`
4. Tap "Sign In"
5. **Expected:**
   - Function returns success
   - `authStatus` changes to 'authenticated'
   - User is redirected to home screen
   - Profile data loads correctly

**Result:** ✅ PASS / ❌ FAIL

---

## Critical Issues Checklist

**If ANY of these occur, report immediately:**

- ❌ App crashes during OAuth redirect
- ❌ OAuth redirect does NOT return to app (stays in browser)
- ❌ Deferred user upgrade succeeds but session is not set
- ❌ Session does not persist across app restarts
- ❌ Duplicate email creates orphaned auth user (check database)
- ❌ authStore state is inconsistent with database state

---

## Test Execution Summary

| Test | Status | Time | Notes |
|------|--------|------|-------|
| **Suite 1: OAuth Deep Linking** |
| 1.1 Initiate OAuth | ⬜ | | |
| 1.2 Redirect Verification | ⬜ | | |
| 1.3 Session Establishment | ⬜ | | |
| 1.4 Database Profile | ⬜ | | |
| 1.5 Android Testing | ⬜ | | |
| **Suite 2: Deferred Upgrade** |
| 2.1 Create Deferred | ⬜ | | |
| 2.2 Upgrade Success | ⬜ | | |
| 2.3 Session Persistence | ⬜ | | |
| 2.4 Duplicate Email Failure | ⬜ | | |
| **Suite 3: Sign Out/In** |
| 3.1 Sign Out | ⬜ | | |
| 3.2 Sign In | ⬜ | | |

**Overall Result:** ⬜ PASS / ⬜ FAIL

**Executed By:** _______________
**Execution Date:** _______________
**Total Time:** _______________

---

## Reporting Issues

**If tests fail, provide:**
1. Test ID that failed
2. Expected vs actual behavior
3. Metro logs (copy/paste relevant sections)
4. Screenshots/screen recordings
5. Database state (SQL query results)
6. Device/simulator info (iOS 17.0, Android 13, etc.)

**Save results to:** `docs/qa/STORY_1.2_MANUAL_TEST_RESULTS.md`
