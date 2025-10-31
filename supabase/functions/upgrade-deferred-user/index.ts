// apps/supabase-functions/upgrade-deferred-user/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    // 1. Initialize Supabase Admin Client (using Service Role Key)
    // Used for admin operations (createUser, deleteUser, RPC bypass RLS)
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 2. Validate Input
    const { deferredUserId, email, password } = await req.json();
    if (!deferredUserId || !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Create the Auth User (Admin Context)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email as this is an upgrade flow
    });

    if (authError || !authData.user) {
      console.error('Failed to create auth user:', authError);
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400, // e.g., duplicate email
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const newAuthUserId = authData.user.id;

    // 4. Call the RPC function to upgrade the profile
    const { error: rpcError } = await supabaseAdmin.rpc('upgrade_deferred_to_auth', {
      p_deferred_user_id: deferredUserId,
      p_auth_user_id: newAuthUserId,
    });

    // 5. Handle RPC Failure and Rollback
    if (rpcError) {
      console.error('RPC call failed. Rolling back auth user creation:', rpcError);

      // CRITICAL: Rollback the created auth user
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(newAuthUserId);

      if (deleteError) {
        console.error('Rollback failed! Auth user orphaned:', deleteError);
        // This is a critical failure state
        return new Response(JSON.stringify({ error: `Upgrade failed and rollback failed: ${rpcError.message}. Contact support.` }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: `Upgrade failed: ${rpcError.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 6. Success: Generate a session for the client
    // Initialize a standard client (using ANON KEY) to sign the user in
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data: sessionData, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError || !sessionData.session) {
        // Highly unexpected if the previous steps succeeded
        console.warn("User upgraded but sign-in failed:", signInError);
        return new Response(JSON.stringify({ message: "Account upgraded, but failed to generate session. Please sign in.", user: authData.user }), {
            status: 200, // Still return 200 as the upgrade transaction succeeded
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // 7. Return the session and user data
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
