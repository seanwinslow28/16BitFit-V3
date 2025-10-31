# Story 1.2 - Quick Mobile Testing Guide

**Environment Ready:**
- ✅ Metro Bundler: Running on port 8081
- ✅ iOS Simulator: iPhone 17 Pro (Booted)
- ✅ Auth Components: Implemented

---

## 🚀 Quick Start

### Option 1: Manual Testing (Recommended)

The mobile app should already be running on your simulator. If not:

```bash
# From project root
cd apps/mobile-shell
npm run ios
```

### Option 2: Use React Native Debugger

If the app has UI screens for auth, you can manually test through the UI. Otherwise, you can use the React Native Debugger console to test the auth functions directly.

---

## 📱 Manual Testing Steps

### Test 1: Verify App is Running

1. Check your iPhone 17 Pro simulator
2. Look for the 16BitFit app
3. If not visible, run: `npm run ios` from `apps/mobile-shell`

### Test 2: Test Auth Functions via Console

Open React Native Debugger and test the auth functions:

```javascript
// Import the auth store (if using Zustand)
import { useAuthStore } from './stores/authStore';

// Test 1: Create deferred user
const { createDeferred } = useAuthStore.getState();
await createDeferred('mobile_test_user', 'Mobile Test User');

// Test 2: Check auth status
const { authStatus, deferredProfile } = useAuthStore.getState();
console.log('Auth Status:', authStatus);
console.log('Deferred Profile:', deferredProfile);

// Test 3: Upgrade to authenticated (if deferred user exists)
const { upgradeToAuth } = useAuthStore.getState();
await upgradeToAuth(
  deferredProfile.id,
  'mobiletest@16bitfit.test',
  'TestPass123!'
);
```

### Test 3: Test via UI (If Screens Exist)

If your app has auth screens implemented:

1. **Sign Up Flow:**
   - Navigate to sign up screen
   - Enter: `uitest@16bitfit.test` / `TestPass123!`
   - Verify user is created and logged in

2. **Deferred Flow:**
   - Look for "Skip" or "Try without signing up" button
   - Create deferred user
   - Verify app works without authentication

3. **Upgrade Flow:**
   - As deferred user, find "Create Account" option
   - Enter credentials
   - Verify upgrade succeeds

---

## 🔍 Verification Queries

After each test, verify the database state:

### Check Latest User Profiles
```sql
SELECT
  id,
  username,
  auth_status,
  created_at,
  email
FROM user_profiles up
LEFT JOIN auth.users au ON up.id = au.id
ORDER BY up.created_at DESC
LIMIT 5;
```

### Check for Orphaned Records
```sql
-- Orphaned auth users (should be 1 from earlier - normaluser@test.com)
SELECT COUNT(*) as orphaned_auth_users
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL;

-- Orphaned profiles (should be 0)
SELECT COUNT(*) as orphaned_profiles
FROM user_profiles up
LEFT JOIN auth.users au ON up.id = au.id
WHERE up.auth_status = 'authenticated' AND au.id IS NULL;
```

---

## ⚠️ Important Notes

### Current App State

Based on the Story 1.2 implementation, the app SHOULD have:
- ✅ `authService.ts` - Auth functions implemented
- ✅ `authStore.ts` - Zustand store with persistence
- ✅ Supabase client configured
- ❓ UI screens - May or may not be implemented yet

**If UI screens don't exist yet:**
- That's okay! Story 1.2 focuses on backend functionality
- You can validate using React Native Debugger console
- Or create simple test screens temporarily
- Or proceed to Story 1.4 (Onboarding) which will create the UI

### Expected Behavior

**Normal Signup:**
```typescript
// When user signs up with testuser@example.com
// Expected result:
{
  username: "testuser",  // Extracted from email
  auth_status: "authenticated",
  email: "testuser@example.com"
}
```

**Deferred User:**
```typescript
// When user creates deferred account
// Expected result:
{
  username: "user_provided_username",
  auth_status: "deferred",
  email: null  // No email yet
}
```

**Upgrade:**
```typescript
// When deferred user upgrades
// Expected result:
{
  username: "user_provided_username",  // PRESERVED!
  auth_status: "authenticated",
  email: "upgraded@example.com",
  created_at: "[original timestamp]"  // PRESERVED!
}
```

---

## 🎯 Simplified Test Plan

If you don't have UI screens yet, you can validate Story 1.2 as complete based on:

1. ✅ **Backend Tests:** All 5 automated tests passed
2. ✅ **Database Validation:** Migrations applied, functions working
3. ✅ **Auth Service:** Implemented and available
4. ✅ **Auth Store:** Implemented with persistence
5. ⏳ **UI Testing:** Can be deferred to Story 1.4 (Onboarding Flow)

### Recommendation

**Option A: Full Mobile Testing**
- Create temporary test screens
- Manually test all auth flows
- Time: 1-2 hours

**Option B: Skip to Story 1.4**
- Mark Story 1.2 as complete (backend validated)
- Build UI screens in Story 1.4
- Test end-to-end auth flow then
- Time: 15 minutes to mark complete

**Option C: Console Testing Only**
- Test auth functions via React Native Debugger
- Verify basic functionality
- Don't create full UI yet
- Time: 30 minutes

---

## 💡 My Recommendation

Given that:
- ✅ All backend tests passing
- ✅ Database validated
- ✅ Auth service implemented
- ✅ No UI screens exist yet (likely)

I recommend **Option B**:
1. Mark Story 1.2 as **BACKEND COMPLETE**
2. Add note: "UI validation deferred to Story 1.4"
3. Move to Story 1.3 (HealthKit Integration)
4. Validate full auth flow in Story 1.4 when UI is built

This follows best practices:
- Backend-first approach ✅
- Don't build throwaway UI ✅
- Test integration when full flow exists ✅

---

## ❓ What Would You Like to Do?

1. **Full Mobile Testing** - Create test screens and validate everything
2. **Console Testing** - Quick validation via debugger
3. **Skip to Story 1.4** - Mark backend complete, test UI later (Recommended)

Let me know and I'll help you execute your preferred option!
