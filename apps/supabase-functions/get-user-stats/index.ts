/**
 * Get User Stats Edge Function
 * Retrieves user profile, avatar, and workout statistics
 *
 * This demonstrates:
 * - Supabase client usage in Edge Functions
 * - Database queries with RLS
 * - CORS handling
 * - Error handling
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, errorResponse, successResponse } from '../shared/utils.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    // Initialize Supabase client with user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return errorResponse('Unauthorized', 401);
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return errorResponse(`Failed to fetch profile: ${profileError.message}`, 400);
    }

    // Fetch active avatar
    const { data: avatar, error: avatarError } = await supabaseClient
      .from('avatars')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Avatar might not exist yet (optional)
    if (avatarError && avatarError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.warn('Avatar fetch warning:', avatarError);
    }

    // Fetch workout statistics
    const { data: workoutStats, error: statsError } = await supabaseClient
      .from('workouts')
      .select('workout_type, duration_seconds, calories_burned, experience_gained')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(10);

    if (statsError) {
      return errorResponse(`Failed to fetch workout stats: ${statsError.message}`, 400);
    }

    // Calculate aggregate stats
    const totalWorkouts = workoutStats?.length || 0;
    const totalDuration = workoutStats?.reduce((sum, w) => sum + w.duration_seconds, 0) || 0;
    const totalCalories = workoutStats?.reduce((sum, w) => sum + (w.calories_burned || 0), 0) || 0;
    const totalExp = workoutStats?.reduce((sum, w) => sum + (w.experience_gained || 0), 0) || 0;

    // Return user stats
    return successResponse({
      user: {
        id: user.id,
        email: user.email,
      },
      profile: {
        username: profile.username,
        display_name: profile.display_name,
        level: profile.level,
        total_experience: profile.total_experience,
        total_workouts: profile.total_workouts,
      },
      avatar: avatar
        ? {
            id: avatar.id,
            name: avatar.name,
            level: avatar.level,
            stats: {
              hp: avatar.current_hp,
              max_hp: avatar.max_hp,
              attack: avatar.attack,
              defense: avatar.defense,
              speed: avatar.speed,
            },
          }
        : null,
      recent_stats: {
        recent_workouts_count: totalWorkouts,
        total_duration_seconds: totalDuration,
        total_calories_burned: totalCalories,
        total_experience_gained: totalExp,
        recent_workouts: workoutStats,
      },
    });
  } catch (error) {
    console.error('Edge Function Error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500
    );
  }
});
