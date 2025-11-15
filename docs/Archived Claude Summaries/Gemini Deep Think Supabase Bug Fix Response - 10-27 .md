This document provides a refined, step-by-step execution and verification plan for Story 1.2 (Supabase Authentication). It enhances the original instructions by integrating detailed analysis of the provided project files (`authService.ts`, `authStore.ts`, `supabaseClient.ts`, migration SQL, `README.md`, and `architecture.md`).

**AGENT**: Follow these instructions sequentially to verify, test, and integrate the authentication system.

---

## **Refined Execution Plan: Story 1.2 (Supabase Authentication)**

**Preamble: Critical Gaps Identified during Analysis**

Initial analysis reveals critical gaps in the provided implementation that must be addressed:

1. **`authStore.ts` \- Missing Deferred Auth Persistence:** The logic to persist `deferredProfile` across app restarts is missing. This must be implemented to meet AC4 and AC5.  
2. **`authService.ts` \- Flawed `upgradeDeferredToAuth` Rollback:** The function attempts a client-side rollback using `supabase.auth.admin.deleteUser()`. This requires the Service Role Key, which is unsafe and unavailable client-side. This logic will fail and must be flagged for refactoring (e.g., moving to an Edge Function).

---

### **🔧 TASK 1: ENVIRONMENT CONFIGURATION**

**Objective**: Ensure the React Native application is correctly configured to access Supabase credentials.

**Step 1.1: Verify `.env` Existence and Content**

**Verify Required Variables**: Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are present in the project root `.env` file.  
Bash  
grep \-E '^(SUPABASE\_URL|SUPABASE\_ANON\_KEY)=' .env

1. *(If missing, alert the user to populate the `.env` file based on `.env.example`.)*

**Step 1.2: Verify Environment Variable Loading Mechanism**

Analysis of `apps/mobile-shell/src/services/supabaseClient.ts` shows it uses an abstraction layer:

TypeScript  
import { ENV } from '../config/env';  
// ...  
export const supabase \= createClient\<Database\>(ENV.SUPABASE\_URL, ENV.SUPABASE\_ANON\_KEY, ...);

1. **Action**: Verify the implementation of `apps/mobile-shell/src/config/env.ts`.  
   * **Check**: This file must use a React Native compatible library (e.g., `react-native-dotenv` or `react-native-config`) to load the variables from the `.env` file and export them in the `ENV` object.  
   * **Expected Snippet (if using react-native-dotenv)**:

TypeScript  
// In src/config/env.ts  
import { SUPABASE\_URL as URL, SUPABASE\_ANON\_KEY as KEY } from '@env';  
export const ENV \= {  
    SUPABASE\_URL: URL,  
    SUPABASE\_ANON\_KEY: KEY,  
};

2.   
   * *(Note: This also requires a corresponding type definition file, e.g., `types/env.d.ts`.)*

**Step 1.3: Verify supabaseClient.ts Configuration**

Review `apps/mobile-shell/src/services/supabaseClient.ts` for correct session persistence configuration.

1. **Verification Points:**  
   * ✅ Imports `AsyncStorage`.  
   * ✅ Uses `AsyncStorage` as the `auth.storage` adapter.  
   * ✅ `autoRefreshToken: true` and `persistSession: true`.

TypeScript  
// Snippet to verify in supabaseClient.ts  
import AsyncStorage from '@react-native-async-storage/async-storage';  
// ...  
  auth: {  
    storage: AsyncStorage,  
    autoRefreshToken: true,  
    persistSession: true,  
    detectSessionInUrl: false, // Correct for mobile  
  },  
// ...

**Confirmation Point 1**: Environment variables are loaded via `config/env.ts` and `supabaseClient.ts` is correctly initialized with AsyncStorage.

---

### **🗄️ TASK 2: DATABASE VERIFICATION**

**Objective**: Verify the database schema, functions, policies, and triggers defined in `supabase/migrations/20251025000000_add_auth_profile_fields.sql` are correctly applied.

*(Execute the following queries in the Supabase SQL Editor.)*

**Step 2.1: Verify Enum Types**

Verify the three enums exist with correct values.

SQL  
SELECT  
  t.typname AS enum\_name,  
  array\_agg(e.enumlabel ORDER BY e.enumsortorder) AS values  
FROM pg\_type t  
JOIN pg\_enum e ON t.oid \= e.enumtypid  
WHERE t.typname IN ('fitness\_archetype', 'evolution\_stage', 'combat\_character')  
GROUP BY t.typname;

* **Expected Output**: Must match the enums defined in the migration file (e.g., `fitness_archetype`: `{trainer,runner,yoga,bodybuilder,cyclist}`).

**Step 2.2: Verify user\_profiles Table Structure**

Verify the 7 new columns exist with correct types and defaults.

SQL  
SELECT  
  column\_name,  
  data\_type,  
  column\_default  
FROM information\_schema.columns  
WHERE table\_schema \= 'public'  
  AND table\_name \= 'user\_profiles'  
  AND column\_name IN (  
    'fitness\_archetype', 'avatar\_url', 'evolution\_stage', 'combat\_character',  
    'auth\_status', 'onboarding\_completed', 'photo\_upload\_url'  
  );

* **Key Checks**: Verify defaults: `evolution_stage` ('stage\_1'), `auth_status` ('deferred'), `onboarding_completed` (false).

**Step 2.3: Verify Database Functions and Security Context**

Verify the three functions exist and are correctly set as `SECURITY DEFINER`.

SQL  
SELECT  
  p.proname AS function\_name,  
  p.prosecdef AS security\_definer,  
  l.lanname AS language  
FROM pg\_proc p  
JOIN pg\_namespace n ON p.pronamespace \= n.oid  
JOIN pg\_language l ON p.prolang \= l.oid  
WHERE n.nspname \= 'public'  
  AND p.proname IN ('create\_deferred\_user\_profile', 'upgrade\_deferred\_to\_auth', 'handle\_new\_user');

* **Expected Output**: All three functions must show `security_definer` as `true` (t) and language as `plpgsql`.

**Step 2.4: Verify Row-Level Security (RLS) Policies**

Verify RLS is enabled and the four policies are active and correct.

SQL  
\-- Verify RLS enabled  
SELECT relrowsecurity FROM pg\_class WHERE relname \= 'user\_profiles';  
\-- Expected: true (t)

\-- Verify Policies Definitions  
SELECT  
  policyname,  
  cmd,  
  qual, \-- The USING clause  
  with\_check  
FROM pg\_policies  
WHERE schemaname \= 'public' AND tablename \= 'user\_profiles';

* **Key Checks**:  
  * **"Users can view own profile"** (SELECT): `qual` must include `(auth.uid() = id) OR (auth_status = 'deferred'::text)`.  
  * **"Service role full access"** (ALL): Must check for `auth.role() = 'service_role'::text`.

**Step 2.5: Verify Database Trigger**

Verify the trigger on `auth.users` calls `handle_new_user`.

SQL  
SELECT  
  t.tgname AS trigger\_name,  
  p.proname AS function\_name  
FROM pg\_trigger t  
JOIN pg\_class c ON t.tgrelid \= c.oid  
JOIN pg\_proc p ON t.tgfoid \= p.oid  
JOIN pg\_namespace n ON c.relnamespace \= n.oid  
WHERE n.nspname \= 'auth'  
  AND c.relname \= 'users'  
  AND t.tgname \= 'on\_auth\_user\_created';

* **Expected Output**: Trigger `on_auth_user_created` exists and calls `handle_new_user`.

**Step 2.6: Functional Test of Deferred Profile Creation (Idempotent)**

Execute this PL/pgSQL block to functionally test and clean up deferred user creation.

SQL  
DO $$  
DECLARE  
  v\_user\_id UUID;  
  v\_username TEXT := 'test\_agent\_deferred\_' || substr(md5(random()::text), 1, 6);  
BEGIN  
  \-- 1\. Create the user  
  v\_user\_id := public.create\_deferred\_user\_profile(v\_username, 'Agent Test');

  \-- 2\. Verify creation and auth\_status  
  ASSERT (SELECT auth\_status FROM public.user\_profiles WHERE id \= v\_user\_id) \= 'deferred', 'Auth status should be deferred';

  \-- 3\. Clean up (requires appropriate permissions, usually service role)  
  DELETE FROM public.user\_profiles WHERE id \= v\_user\_id;

  RAISE NOTICE 'Deferred profile creation functional test PASSED for %', v\_username;  
END $$;

**Confirmation Point 2**: Database schema, functions, RLS policies, triggers, and functional logic are verified against the migration SQL.

---

### **🧪 TASK 3: CODE REVIEW & REMEDIATION**

**Objective**: Verify implementation of `authService.ts` and `authStore.ts` and address critical gaps.

**Step 3.1: Review `authService.ts` and Address Critical Flaw**

Review `apps/mobile-shell/src/services/authService.ts`.

1. **`signUpWithEmail` Metadata**:  
   * **Check**: Verify `username` and `display_name` are in `options.data`.  
   * **Status**: ✅ Correct.  
2. **`signInWithProvider` Redirect URI**:  
   * **Check**: Verify `redirectTo` is `com.16bitfit://auth/callback`.  
   * **Status**: ✅ Correct. (Note: Native deep linking setup must be verified separately).  
3. **CRITICAL FLAW: `upgradeDeferredToAuth` Rollback**:  
   * **Check**: Analyze the rollback mechanism.

TypeScript  
if (upgradeError) {  
  // Rollback: delete the auth user we just created  
  await supabase.auth.admin.deleteUser(signUpData.user.id); // \<-- FLAW  
  // ...  
}

4.   
   * **Status**: ❌ **FLAWED**. The client-side SDK (using `ANON_KEY`) cannot execute `supabase.auth.admin` methods. This rollback will fail.  
   * **Action Required**: Flag this immediately. This logic must be moved to a Supabase Edge Function to securely use the Service Role Key and ensure atomicity.

**Step 3.2: Review and Fix `authStore.ts` (Deferred Persistence)**

Review `apps/mobile-shell/src/stores/authStore.ts`.

**CRITICAL GAP IDENTIFIED**: The implementation does not persist `deferredProfile`. The `initialize` function confirms this:  
TypeScript  
// Check for deferred profile in AsyncStorage  
// For now, just set to unauthenticated

*   
* **Action Required**: Implement persistence using Zustand's `persist` middleware and `AsyncStorage`.

**Modify `authStore.ts`**:  
TypeScript  
// apps/mobile-shell/src/stores/authStore.ts

import { create } from 'zustand';  
import { persist, createJSONStorage } from 'zustand/middleware'; // Import middleware  
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage  
// ... other imports ...

// Update create call to wrap the store with persist middleware  
export const useAuthStore \= create\<AuthState\>()(  
  persist(  
    (set, get) \=\> ({  
      // ... Initial state ...  
      user: null,  
      // ... (rest of initial state)

      // Initialize auth state  
      initialize: async () \=\> {  
        // The 'persist' middleware handles restoring deferredProfile.  
        // We now rely on the onAuthStateChange listener and initial session check to sync state.  
        try {  
          set({ isLoading: true, authStatus: 'loading' });

          // Set up auth state change listener  
          supabase.auth.onAuthStateChange((\_event, session) \=\> {  
            if (session) {  
              set({  
                session,  
                user: session.user,  
                authStatus: 'authenticated',  
                deferredProfile: null, // Clear deferred profile on auth  
                isLoading: false,  
              });  
            } else {  
              const currentState \= get();  
              if (currentState.deferredProfile) {  
                // Keep deferred state if persisted  
                set({  
                  session: null,  
                  user: null,  
                  authStatus: 'deferred',  
                  isLoading: false,  
                });  
              } else {  
                set({  
                  session: null,  
                  user: null,  
                  authStatus: 'unauthenticated',  
                  isLoading: false,  
                });  
              }  
            }  
          });

          // Perform initial session check to expedite loading  
          const session \= await getCurrentSession();  
          if (\!session && \!get().deferredProfile) {  
             // If no session AND no persisted deferred profile, set unauthenticated immediately  
             set({ authStatus: 'unauthenticated', isLoading: false });  
          }  
          // Otherwise, the listener will handle the update shortly.

        } catch (error) {  
          // ... error handling ...  
        }  
      },

      // ... other actions (signUp, signIn, createDeferred, etc.) ...  
      // Changes to deferredProfile will now automatically persist.

    }),  
    {  
      name: 'auth-storage', // unique name for storage  
      storage: createJSONStorage(() \=\> AsyncStorage),  
      // Only persist the deferredProfile. Supabase client handles auth session.  
      partialize: (state) \=\> ({ deferredProfile: state.deferredProfile }),  
    }  
  )  
);

1. 

**Confirmation Point 3**: `authService.ts` reviewed, and critical rollback flaw identified. `authStore.ts` modified to implement required deferred authentication persistence.

---

### **🔬 TASK 4: INTEGRATION TESTING**

**Objective**: Execute integration tests against a real Supabase instance.

**Step 4.1: Enhance Integration Test Reliability**

Create/Update `apps/mobile-shell/src/services/tests/authService.integration.test.ts`.

1. **Unique Data**: Ensure all tests use unique usernames and emails (using `Date.now()`) to prevent collisions.  
2. **Cleanup Strategy**: Implement setup/teardown logic. This ideally requires the `SERVICE_ROLE_KEY` in the test environment to initialize an admin client for cleanup.

TypeScript  
// Example addition to authService.integration.test.ts  
describe('Story 1.2: Authentication Integration Tests', () \=\> {  
  const timestamp \= Date.now();

  describe('Deferred Authentication Flow', () \=\> {  
    const deferredUsername \= \`test\_deferred\_${timestamp}\`;  
    let deferredUserId: string;

    it('should create deferred user profile', async () \=\> {  
      const result \= await createDeferredUser(deferredUsername, 'Test Deferred');  
      expect(result.success).toBe(true);  
      expect(result.profile?.authStatus).toBe('deferred');  
      deferredUserId \= result.profile\!.id;  
    });

    it('should upgrade deferred to authenticated', async () \=\> {  
      const authEmail \= \`test\_upgrade\_${timestamp}@example.com\`;  
      const password \= 'testPassword123\!';

      // Note: If this test fails due to the rollback issue identified in Task 3.1, document the failure mode.  
      const upgradeResult \= await upgradeDeferredToAuth(  
        deferredUserId,  
        authEmail,  
        password  
      );

      expect(upgradeResult.success).toBe(true);  
      expect(upgradeResult.user).toBeDefined();  
    });  
  });

  // ... Email/Password Authentication tests ...  
});

**Step 4.2: Execute Tests**

1. Ensure environment variables point to the Supabase instance.

Run the tests:  
Bash  
cd apps/mobile-shell  
npm test \-- authService.integration.test.ts

2. 

**Step 4.3: Corroborate Test Results (Supabase Dashboard)**

After execution, manually verify the state in the Supabase dashboard:

1. **Authentication \> Users**: Verify new authenticated users exist.  
2. **Database \> user\_profiles**:  
   * Verify profiles exist.  
   * Check the `auth_status` column: verify the upgraded user profile now shows `authenticated` and is linked to the correct Auth User ID.  
   * Verify `username` and `display_name` were correctly populated by the trigger during signup.

**Confirmation Point 4**: Integration tests executed. Results verified in the dashboard. Failures related to the `upgradeDeferredToAuth` flaw documented.

---

### **🔍 TASK 5: MCP CONNECTOR USAGE (Refined)**

**Objective**: Use MCP connectors for targeted research on the identified challenges.

**Step 5.1: Context7 MCP \- Addressing Implementation Gaps**

* **Query (Zustand Persistence \- Task 3.2):** `"Query Context7 for Zustand v4.x: documentation for 'persist' middleware, including 'partialize' option and integration with React Native AsyncStorage."`  
* **Query (Supabase Admin Permissions \- Task 3.1):** `"Query Context7 for @supabase/supabase-js@<version>: Clarify permissions required for 'auth.admin.deleteUser'. Confirm if it requires SERVICE_ROLE_KEY and best practices for transactional auth operations."`

**Step 5.2: Firecrawl MCP \- Implementation Patterns**

* **Query (Secure Upgrade Patterns):** `"Crawl https://supabase.com/docs/guides/auth. Synthesize best practices for upgrading anonymous or deferred users to authenticated accounts securely, focusing on transactional integrity and rollback."`

**Step 5.3: GitHub MCP \- OAuth Deep Linking**

* **Query (OAuth Redirects):** `"Search GitHub repositories for React Native projects using Supabase signInWithOAuth. Focus on Info.plist (iOS) and AndroidManifest.xml configurations for custom deep linking schemes."`

**Confirmation Point 5**: Targeted research conducted on identified gaps and best practices.

---

### **✅ TASK 6: ACCEPTANCE CRITERIA VERIFICATION**

**Objective**: Verify all acceptance criteria based on the execution and remediation.

**AC1: Supabase Client Initialized**

* \[✅\] `.env` file configured (Task 1.1).  
* \[✅\] `supabaseClient.ts` successfully creates client using `config/env` (Task 1.2/1.3).

**AC2: Profiles Table Created**

* \[✅\] `user_profiles` structure, columns, and defaults verified (Task 2.2).  
* \[✅\] Enums (3) created and verified (Task 2.1).  
* \[✅\] Database functions (3) exist and are `SECURITY DEFINER` (Task 2.3).  
* \[✅\] RLS policies (4) are active and correct (Task 2.4).  
* \[✅\] Trigger `on_auth_user_created` is active (Task 2.5).

**AC3: Email/Social Auth Configured**

* \[✅\] Email signup/login implemented (Task 3.1) and tested (Task 4.3).  
* \[✅\] OAuth redirect URI configured in `authService.ts` (Task 3.1).  
* \[⚠️\] Deep linking setup in native code (iOS/Android) requires verification (outside provided files).

**AC4: Deferred Auth Implemented**

* \[✅\] `createDeferredUser()` implemented and tested (Task 3.1/4.3).  
* \[✅\] Deferred profiles persist across restarts (`authStore.ts` remediated in Task 3.2).  
* \[⚠️\] `upgradeToAuth()` implemented but contains a critical flaw in rollback logic (Task 3.1). Requires refactoring to Edge Function.

**AC5: Session Persistence**

* \[✅\] Authenticated sessions persist (`supabaseClient.ts` configuration verified in Task 3.3).  
* \[✅\] Deferred profiles persist (`authStore.ts` remediated in Task 3.2).  
* \[✅\] Auto-refresh enabled (Task 3.3).

---

### **📝 TASK 7: DOCUMENTATION & COMPLETION**

**Objective**: Update project documentation to reflect the completed work, remediation, and known issues.

**Step 7.1: Update Story Status**

Update `docs/stories/1.2.supabase-auth.story.md`. Add the "Dev Agent Record" section.

Markdown  
\#\#\# Dev Agent Record

\#\#\#\# Verification Results  
\- ✅ Environment and Database configuration verified.  
\- ✅ Integration tests established and executed.  
\- ✅ Remediation applied to \`authStore.ts\` to enable deferred profile persistence (AC4/AC5).

\#\#\#\# Known Issues and Recommendations  
1\.  \*\*CRITICAL: \`upgradeDeferredToAuth\` Rollback Flaw.\*\* The current implementation in \`authService.ts\` attempts to use \`supabase.auth.admin.deleteUser\` client-side. This is insecure and fails when using \`ANON\_KEY\`.  
    \*   \*\*Recommendation:\*\* Refactor this logic into a Supabase Edge Function to handle the transaction securely using the Service Role Key.  
2\.  \*\*Pending: Native Deep Linking.\*\* While the redirect URI is set in \`authService.ts\`, the native iOS/Android configuration to handle the \`com.16bitfit://\` scheme requires verification.

\#\#\#\# File List  
\- apps/mobile-shell/src/stores/authStore.ts (Modified: Added Persistence)  
\- apps/mobile-shell/src/services/authService.ts (Verified: Flaw Identified)  
\- ... (rest of files verified)

**Step 7.2: Create Integration Guide**

Create `docs/guides/SUPABASE_SETUP_GUIDE-2.md`. Include:

* Instructions on `config/env.ts` and `.env` setup.  
* How to apply the migration SQL.  
* The exact SQL queries from Task 2 for verification.

**Step 7.3: Update README**

Update `README.md` under the "Development" section with the "Authentication Testing" examples provided in the original prompt.

