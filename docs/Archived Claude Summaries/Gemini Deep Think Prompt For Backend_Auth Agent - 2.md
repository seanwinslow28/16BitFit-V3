# **Remediation Plan for Story 1.2 Issues**

**Date:** October 27, 2025 **Objective:** Address the two critical outstanding issues identified during the Story 1.2 verification: the flawed rollback logic in `upgradeDeferredToAuth` and the missing native deep linking configuration.

---

## **Overview**

This plan details the steps required to refactor the deferred user upgrade process into a secure Supabase Edge Function, ensuring atomic transactions and secure rollback. It also covers the necessary configuration for native iOS and Android projects to handle OAuth redirects via the `com.16bitfit://auth/callback` URI.

This plan utilizes an optimized strategy where the Edge Function handles both the atomic transaction and the generation of the user session, minimizing client-side network requests.

---

## **Execution Plan**

### **TASK 1: Create and Deploy Supabase Edge Function**

We will create a new Edge Function, `upgrade-deferred-user`, to securely manage the upgrade transaction using the `SUPABASE_SERVICE_ROLE_KEY`.

#### **Step 1.1: Create the Edge Function Structure**

Based on the project's monorepo structure defined in `architecture.md`, Edge Functions reside in `apps/supabase-functions`.

Create the necessary directory and file:  
Bash  
mkdir \-p apps/supabase-functions/upgrade-deferred-user  
touch apps/supabase-functions/upgrade-deferred-user/index.ts

1. 

#### **Step 1.2: Implement the Edge Function Logic**

Implement the function logic in `apps/supabase-functions/upgrade-deferred-user/index.ts`.

TypeScript  
// apps/supabase-functions/upgrade-deferred-user/index.ts  
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';  
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders \= {  
  'Access-Control-Allow-Origin': '\*',  
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',  
};

serve(async (req) \=\> {  
  // Handle CORS preflight request  
  if (req.method \=== 'OPTIONS') {  
    return new Response('ok', { headers: corsHeaders });  
  }

  try {  
    const SUPABASE\_URL \= Deno.env.get('SUPABASE\_URL') ?? '';  
    const SUPABASE\_SERVICE\_ROLE\_KEY \= Deno.env.get('SUPABASE\_SERVICE\_ROLE\_KEY') ?? '';  
    const SUPABASE\_ANON\_KEY \= Deno.env.get('SUPABASE\_ANON\_KEY') ?? '';

    // 1\. Initialize Supabase Admin Client (using Service Role Key)  
    // Used for admin operations (createUser, deleteUser, RPC bypass RLS)  
    const supabaseAdmin \= createClient(SUPABASE\_URL, SUPABASE\_SERVICE\_ROLE\_KEY);

    // 2\. Validate Input  
    const { deferredUserId, email, password } \= await req.json();  
    if (\!deferredUserId || \!email || \!password) {  
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {  
        status: 400,  
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },  
      });  
    }

    // 3\. Create the Auth User (Admin Context)  
    const { data: authData, error: authError } \= await supabaseAdmin.auth.admin.createUser({  
      email: email,  
      password: password,  
      email\_confirm: true, // Auto-confirm email as this is an upgrade flow  
    });

    if (authError || \!authData.user) {  
      console.error('Failed to create auth user:', authError);  
      return new Response(JSON.stringify({ error: authError.message }), {  
        status: 400, // e.g., duplicate email  
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },  
      });  
    }

    const newAuthUserId \= authData.user.id;

    // 4\. Call the RPC function to upgrade the profile  
    const { error: rpcError } \= await supabaseAdmin.rpc('upgrade\_deferred\_to\_auth', {  
      p\_deferred\_user\_id: deferredUserId,  
      p\_auth\_user\_id: newAuthUserId,  
    });

    // 5\. Handle RPC Failure and Rollback  
    if (rpcError) {  
      console.error('RPC call failed. Rolling back auth user creation:', rpcError);

      // CRITICAL: Rollback the created auth user  
      const { error: deleteError } \= await supabaseAdmin.auth.admin.deleteUser(newAuthUserId);

      if (deleteError) {  
        console.error('Rollback failed\! Auth user orphaned:', deleteError);  
        // This is a critical failure state  
        return new Response(JSON.stringify({ error: \`Upgrade failed and rollback failed: ${rpcError.message}. Contact support.\` }), {  
          status: 500,  
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },  
        });  
      }

      return new Response(JSON.stringify({ error: \`Upgrade failed: ${rpcError.message}\` }), {  
        status: 400,  
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },  
      });  
    }

    // 6\. Success: Generate a session for the client  
    // Initialize a standard client (using ANON KEY) to sign the user in  
    const supabaseClient \= createClient(SUPABASE\_URL, SUPABASE\_ANON\_KEY);

    const { data: sessionData, error: signInError } \= await supabaseClient.auth.signInWithPassword({  
        email,  
        password,  
    });

    if (signInError || \!sessionData.session) {  
        // Highly unexpected if the previous steps succeeded  
        console.warn("User upgraded but sign-in failed:", signInError);  
        return new Response(JSON.stringify({ message: "Account upgraded, but failed to generate session. Please sign in.", user: authData.user }), {  
            status: 200, // Still return 200 as the upgrade transaction succeeded  
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },  
        });  
    }

    // 7\. Return the session and user data  
    return new Response(JSON.stringify(sessionData), {  
      status: 200,  
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },  
    });

  } catch (error) {  
    console.error('Internal Server Error:', error);  
    return new Response(JSON.stringify({ error: error.message }), {  
      status: 500,  
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },  
    });  
  }  
});

#### **Step 1.3: Deploy the Edge Function**

Deploy the function using the Supabase CLI.

*Note: This requires the Supabase CLI to be installed, authenticated, and linked to the project `noxwzelpibuytttlgztq`.*

Bash  
\# Deploy the function. We use \--no-verify-jwt because the user is not yet authenticated (deferred) when calling this function.  
supabase functions deploy upgrade-deferred-user \--project-ref noxwzelpibuytttlgztq \--no-verify-jwt

### **TASK 2: Modify Client-Side Authentication Service**

Update `authService.ts` to invoke the new Edge Function, handle the response, and remove the flawed client-side logic.

#### **Step 2.1: Refactor `upgradeDeferredToAuth`**

Modify `apps/mobile-shell/src/services/authService.ts`. Replace the existing implementation of `upgradeDeferredToAuth` (lines 177-228, including the flawed logic and comments) entirely with the following code:

TypeScript  
// apps/mobile-shell/src/services/authService.ts

/\*\*  
 \* Upgrade a deferred user account to authenticated  
 \* Invokes the secure Edge Function 'upgrade-deferred-user' to handle the atomic transaction  
 \* and retrieve the new session.  
 \*/  
export async function upgradeDeferredToAuth(  
  deferredUserId: string,  
  email: string,  
  password: string  
): Promise\<AuthResult\> {  
  try {  
    // 1\. Invoke the Supabase Edge Function  
    const { data, error } \= await supabase.functions.invoke('upgrade-deferred-user', {  
      body: {  
        deferredUserId,  
        email,  
        password,  
      },  
    });

    // Handle invocation errors (e.g., network issues, function crash)  
    if (error) {  
      console.error('Edge Function invocation error:', error);  
      return { success: false, error: error instanceof Error ? error : new Error(String(error)) };  
    }

    // Handle application-level errors returned by the Edge Function (status 4xx/5xx)  
    if (data && data.error) {  
        console.error('Edge Function logic error:', data.error);  
        return { success: false, error: new Error(data.error) };  
    }

    // 2\. On success, the Edge Function returns the full session data.  
    if (data && data.session && data.user) {  
        // CRITICAL: Manually set the session in the client-side Supabase instance.  
        // functions.invoke does not automatically update the client's internal auth state.  
        await supabase.auth.setSession({  
            access\_token: data.session.access\_token,  
            refresh\_token: data.session.refresh\_token,  
        });

        // The onAuthStateChange listener in authStore will update the state automatically.  
        return {  
            success: true,  
            user: data.user,  
            session: data.session,  
        };  
    }

    // Handle the edge case where the upgrade succeeded but session generation failed (Step 6 in EF)  
    if (data && data.user) {  
        return {  
            success: true,  
            user: data.user,  
            session: undefined,  
            error: data.message ? new Error(data.message) : undefined, // Inform user to sign in manually  
        }  
    }

    // Fallback error if the response structure is unexpected  
    console.error('Upgrade failed with unexpected response structure:', data);  
    return { success: false, error: new Error('Upgrade failed with unexpected response.') };

  } catch (error) {  
    console.error('Unexpected error during upgrade:', error);  
    return {  
      success: false,  
      error: error as Error,  
    };  
  }  
}

### **TASK 3: Configure Native Deep Linking**

Configure the native iOS and Android projects to handle the custom URL scheme `com.16bitfit` required for OAuth redirects.

#### **Step 3.1: Configure iOS (Info.plist)**

Modify `apps/mobile-shell/ios/MobileShell/Info.plist` to register the URL scheme.

Add the following keys and values within the main `<dict>` tag:

XML  
\<key\>CFBundleURLTypes\</key\>  
\<array\>  
  \<dict\>  
    \<key\>CFBundleTypeRole\</key\>  
    \<string\>Editor\</string\>  
    \<key\>CFBundleURLSchemes\</key\>  
    \<array\>  
      \<string\>com.16bitfit\</string\>  
    \</array\>  
  \</dict\>  
\</array\>

*Note: If `CFBundleURLTypes` already exists, merge the `com.16bitfit` scheme into the existing configuration.*

#### **Step 3.2: Configure Android (AndroidManifest.xml)**

Modify `apps/mobile-shell/android/app/src/main/AndroidManifest.xml`. Add an intent filter to the `MainActivity`.

Within the `<activity android:name=".MainActivity" ...>` tag, add the following:

XML  
\<activity  
    android:name=".MainActivity"  
    ...  
    android:exported="true"\>

    \<intent-filter\>  
        \<action android:name="android.intent.action.VIEW" /\>  
        \<category android:name="android.intent.category.DEFAULT" /\>  
        \<category android:name="android.intent.category.BROWSABLE" /\>  
        \<data android:scheme="com.16bitfit" /\>  
    \</intent-filter\>

\</activity\>

### **TASK 4: Verification and Testing**

Rigorous testing is required to validate the fixes.

#### **Step 4.1: (Optional but Recommended) Regenerate Database Types**

To resolve potential TypeScript errors and address Issue 3 from the Developer Report, regenerate the Supabase types.

Bash  
npx supabase gen types typescript \\  
  \--project-id noxwzelpibuytttlgztq \\  
  \> apps/mobile-shell/src/types/database.types.ts

#### **Step 4.2: Test the Upgrade Flow (End-to-End)**

1. **Create Deferred User:** Use the app or integration tests to create a deferred user.  
2. **Execute Upgrade:** Call `upgradeDeferredToAuth` with the deferred user ID and new credentials.  
3. **Verify Success:**  
   * The function should return a valid session.  
   * The `authStore` should immediately reflect the `authenticated` status (due to `setSession` and the `onAuthStateChange` listener).  
   * In the Supabase Dashboard (`user_profiles`), verify the profile's `auth_status` is now `authenticated` and linked correctly.

#### **Step 4.3: Test Rollback Logic (Crucial)**

We must ensure the critical flaw is resolved by testing failure scenarios.

1. **Test Duplicate Email:**  
   * Attempt to upgrade a deferred user using an email address that is already registered.  
   * **Expected Result:** The Edge Function fails at Step 3 (`createUser`). The client receives an error (e.g., "Email already in use"). The deferred user remains deferred.  
2. **Test Invalid Deferred ID (Simulates RPC failure and tests rollback):**  
   * Attempt to upgrade using a non-existent `deferredUserId` (e.g., a random UUID) and new credentials.  
   * **Expected Result:** The Edge Function creates the user (Step 3\) but fails at Step 4 (RPC call, assuming the RPC validates the ID). The rollback (Step 5\) executes.  
   * **Verification:** Verify in `auth.users` that **no new user record exists** for the credentials used. This confirms the rollback was successful.

#### **Step 4.4: Test Deep Linking (OAuth Flow)**

*Prerequisite: Configure an OAuth provider (e.g., Google) in the Supabase Dashboard.*

1. **Rebuild Native Apps:** Apply the configuration changes by rebuilding the native projects (requires local development environment).  
2. **Initiate OAuth:** Call `signInWithProvider('google')` from the app.  
3. **Redirect & Handle:** After authenticating, the system must successfully redirect back to the app using the `com.16bitfit://` scheme.  
4. **Session Establishment:** Verify the Supabase client automatically handles the redirect and the `authStore` updates the status to `authenticated`.

### **TASK 5: Update Documentation**

Update the story file to reflect the completed remediation.

#### **Step 5.1: Update Story File**

Modify `docs/stories/1.2.supabase-auth.story.md`.

1. **Update AC Status:** Change AC3 and AC4 from ⚠️ PARTIAL to ✅ PASS.  
2. **Update Dev Agent Record:** Add a summary of the remediation effort and update the status of the known issues.

Markdown  
\#\# Dev Agent Record

\#\#\# Remediation Results (October 27, 2025\)  
\- ✅ Refactored \`upgradeDeferredToAuth\` logic into a secure Supabase Edge Function (\`upgrade-deferred-user\`).  
\- ✅ Resolved the critical rollback flaw by implementing server-side atomic transaction handling.  
\- ✅ Optimized upgrade flow: Edge function now generates and returns the session, reducing client-side requests.  
\- ✅ Modified \`authService.ts\` to invoke the Edge Function and manually set the session post-upgrade.  
\- ✅ Configured native deep linking for iOS (\`Info.plist\`) and Android (\`AndroidManifest.xml\`).

\#\#\# Known Issues and Recommendations  
1\. \*\*CRITICAL: \`upgradeDeferredToAuth\` Rollback Flaw\*\*  
   \- Status: ✅ \*\*RESOLVED\*\*

2\. \*\*Pending: Native Deep Linking Configuration\*\*  
   \- Status: ✅ \*\*RESOLVED\*\*

3\. \*\*Database Type Definitions Need Regeneration\*\*  
    \- Status: ✅ \*\*RESOLVED\*\* (If Step 4.1 executed)

4\. \*\*Integration Tests Require React Native Environment\*\*  
   \- (Remains as known limitation).

\#\#\# File List (Remediation Updates)  
\- \`apps/supabase-functions/upgrade-deferred-user/index.ts\` \- \*\*Created:\*\* New Edge Function implementation.  
\- \`apps/mobile-shell/src/services/authService.ts\` \- \*\*Modified:\*\* Refactored \`upgradeDeferredToAuth\`.  
\- \`apps/mobile-shell/ios/MobileShell/Info.plist\` \- \*\*Modified:\*\* Added URL scheme configuration.  
\- \`apps/mobile-shell/android/app/src/main/AndroidManifest.xml\` \- \*\*Modified:\*\* Added intent filter for deep linking.  
\- \`apps/mobile-shell/src/types/database.types.ts\` \- \*\*Modified:\*\* Regenerated types.

\#\#\# Acceptance Criteria Status (Final)  
\- \*\*AC1:\*\* ✅ PASS  
\- \*\*AC2:\*\* ✅ PASS  
\- \*\*AC3:\*\* ✅ PASS \- Email/OAuth configured and native deep linking implemented.  
\- \*\*AC4:\*\* ✅ PASS \- Deferred auth implemented and upgrade mechanism is secure and atomic.  
\- \*\*AC5:\*\* ✅ PASS  
