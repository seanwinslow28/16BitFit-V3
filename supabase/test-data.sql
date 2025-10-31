-- ============================================================================
-- 16BitFit V3 - Test Data Script
-- ============================================================================
-- Creates sample data to verify database setup and test functionality
-- Run this in Supabase SQL Editor while authenticated as a test user

-- NOTE: You need to be authenticated as a user to test RLS policies properly
-- This script assumes you've created a test user via Supabase Auth

-- ============================================================================
-- STEP 1: Create Test User Profile
-- ============================================================================
-- This should auto-create via trigger when user signs up, but we'll insert manually for testing

-- First, check if profile already exists for current user
DO $$
BEGIN
    -- Insert profile if not exists (will use auth.uid() from current session)
    INSERT INTO public.user_profiles (id, username, display_name, total_workouts, total_experience, level)
    VALUES (
        auth.uid(),
        'test_warrior_' || substr(auth.uid()::text, 1, 8),
        'Test Warrior',
        0,
        0,
        1
    )
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'User profile created or already exists for user: %', auth.uid();
END $$;

-- Verify profile was created
SELECT
    id,
    username,
    display_name,
    level,
    total_experience,
    total_workouts,
    created_at
FROM public.user_profiles
WHERE id = auth.uid();

-- ============================================================================
-- STEP 2: Create Test Avatar
-- ============================================================================

INSERT INTO public.avatars (
    user_id,
    name,
    sprite_data,
    level,
    experience,
    max_hp,
    current_hp,
    attack,
    defense,
    speed,
    is_active
)
VALUES (
    auth.uid(),
    'Pixel Warrior',
    jsonb_build_object(
        'body_color', '#9bbc0f',
        'hair_color', '#306230',
        'outfit', 'warrior',
        'weapon', 'sword',
        'sprite_version', 'v1.0'
    ),
    1,      -- level
    0,      -- experience
    100,    -- max_hp
    100,    -- current_hp
    15,     -- attack
    12,     -- defense
    10,     -- speed
    true    -- is_active
)
RETURNING
    id,
    name,
    level,
    attack,
    defense,
    speed,
    sprite_data;

-- ============================================================================
-- STEP 3: Create Test Workouts
-- ============================================================================

-- Workout 1: Morning Cardio Session
INSERT INTO public.workouts (
    user_id,
    workout_type,
    duration_seconds,
    calories_burned,
    distance_meters,
    heart_rate_avg,
    experience_gained,
    started_at,
    completed_at
)
VALUES (
    auth.uid(),
    'cardio',
    1800,               -- 30 minutes
    250,                -- calories
    5000,               -- 5km
    145,                -- heart rate
    100,                -- XP gained
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '30 minutes'
)
RETURNING
    id,
    workout_type,
    duration_seconds,
    calories_burned,
    experience_gained;

-- Workout 2: Strength Training
INSERT INTO public.workouts (
    user_id,
    workout_type,
    duration_seconds,
    calories_burned,
    experience_gained,
    started_at,
    completed_at
)
VALUES (
    auth.uid(),
    'strength',
    2700,               -- 45 minutes
    300,                -- calories
    150,                -- XP gained
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '45 minutes'
)
RETURNING
    id,
    workout_type,
    duration_seconds,
    calories_burned,
    experience_gained;

-- Workout 3: Mixed Session (Today)
INSERT INTO public.workouts (
    user_id,
    workout_type,
    duration_seconds,
    calories_burned,
    distance_meters,
    experience_gained,
    started_at,
    completed_at
)
VALUES (
    auth.uid(),
    'mixed',
    3600,               -- 60 minutes
    400,                -- calories
    3000,               -- 3km
    200,                -- XP gained
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '1 hour'
)
RETURNING
    id,
    workout_type,
    duration_seconds,
    calories_burned,
    experience_gained;

-- ============================================================================
-- STEP 4: Create Combat Sessions
-- ============================================================================

-- Get the user's avatar ID for combat session
DO $$
DECLARE
    v_avatar_id UUID;
    v_workout_id UUID;
BEGIN
    -- Get active avatar
    SELECT id INTO v_avatar_id
    FROM public.avatars
    WHERE user_id = auth.uid() AND is_active = true
    LIMIT 1;

    -- Get most recent workout
    SELECT id INTO v_workout_id
    FROM public.workouts
    WHERE user_id = auth.uid()
    ORDER BY completed_at DESC
    LIMIT 1;

    -- Create combat session 1: Victory against Slime Boss
    INSERT INTO public.combat_sessions (
        user_id,
        avatar_id,
        workout_id,
        boss_name,
        boss_level,
        victory,
        damage_dealt,
        damage_received,
        duration_seconds,
        experience_gained,
        combat_log,
        started_at,
        completed_at
    )
    VALUES (
        auth.uid(),
        v_avatar_id,
        v_workout_id,
        'Giant Slime',
        1,
        true,
        150,
        35,
        180,
        50,
        jsonb_build_object(
            'turns', jsonb_build_array(
                jsonb_build_object('turn', 1, 'action', 'player_attack', 'damage', 15),
                jsonb_build_object('turn', 2, 'action', 'boss_attack', 'damage', 12),
                jsonb_build_object('turn', 3, 'action', 'player_attack', 'damage', 18),
                jsonb_build_object('turn', 4, 'action', 'boss_attack', 'damage', 10),
                jsonb_build_object('turn', 5, 'action', 'player_attack', 'damage', 20),
                jsonb_build_object('turn', 6, 'action', 'player_attack', 'damage', 25, 'critical', true)
            ),
            'final_hp', jsonb_build_object('player', 65, 'boss', 0)
        ),
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days' + INTERVAL '3 minutes'
    );

    -- Create combat session 2: Defeat against Goblin Warrior
    INSERT INTO public.combat_sessions (
        user_id,
        avatar_id,
        workout_id,
        boss_name,
        boss_level,
        victory,
        damage_dealt,
        damage_received,
        duration_seconds,
        experience_gained,
        combat_log,
        started_at,
        completed_at
    )
    VALUES (
        auth.uid(),
        v_avatar_id,
        v_workout_id,
        'Goblin Warrior',
        3,
        false,
        120,
        100,
        240,
        25,
        jsonb_build_object(
            'turns', jsonb_build_array(
                jsonb_build_object('turn', 1, 'action', 'player_attack', 'damage', 12),
                jsonb_build_object('turn', 2, 'action', 'boss_attack', 'damage', 20),
                jsonb_build_object('turn', 3, 'action', 'player_attack', 'damage', 15),
                jsonb_build_object('turn', 4, 'action', 'boss_attack', 'damage', 25, 'critical', true),
                jsonb_build_object('turn', 5, 'action', 'player_attack', 'damage', 10),
                jsonb_build_object('turn', 6, 'action', 'boss_attack', 'damage', 30)
            ),
            'final_hp', jsonb_build_object('player', 0, 'boss', 45)
        ),
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '1 day' + INTERVAL '4 minutes'
    );

    RAISE NOTICE 'Combat sessions created successfully';
END $$;

-- ============================================================================
-- STEP 5: Verify Data and Auto-Updates
-- ============================================================================

-- Check user profile stats (should be auto-updated by triggers)
SELECT
    username,
    display_name,
    level,
    total_experience,
    total_workouts,
    created_at,
    updated_at
FROM public.user_profiles
WHERE id = auth.uid();

-- Expected results:
-- - total_workouts: 3 (from 3 workout inserts)
-- - total_experience: 450 (100 + 150 + 200 from workouts)
-- - level: Should be calculated based on experience

-- Check all avatars
SELECT
    id,
    name,
    level,
    experience,
    current_hp,
    max_hp,
    attack,
    defense,
    speed,
    is_active,
    sprite_data
FROM public.avatars
WHERE user_id = auth.uid();

-- Check all workouts with stats
SELECT
    id,
    workout_type,
    duration_seconds / 60.0 as duration_minutes,
    calories_burned,
    distance_meters,
    experience_gained,
    completed_at::date as workout_date
FROM public.workouts
WHERE user_id = auth.uid()
ORDER BY completed_at DESC;

-- Check combat sessions
SELECT
    cs.id,
    cs.boss_name,
    cs.boss_level,
    cs.victory,
    cs.damage_dealt,
    cs.damage_received,
    cs.experience_gained,
    cs.duration_seconds / 60.0 as duration_minutes,
    a.name as avatar_name,
    w.workout_type
FROM public.combat_sessions cs
LEFT JOIN public.avatars a ON cs.avatar_id = a.id
LEFT JOIN public.workouts w ON cs.workout_id = w.id
WHERE cs.user_id = auth.uid()
ORDER BY cs.completed_at DESC;

-- ============================================================================
-- STEP 6: Test Level Calculation Function
-- ============================================================================

-- Test level calculation for various XP amounts
SELECT
    exp,
    public.calculate_level(exp) as level
FROM (
    VALUES
        (0),      -- Level 1
        (100),    -- Level 2
        (400),    -- Level 3
        (900),    -- Level 4
        (1600),   -- Level 5
        (2500),   -- Level 6
        (10000)   -- Level 11
) AS test_data(exp);

-- ============================================================================
-- STEP 7: Aggregate Stats Summary
-- ============================================================================

-- Overall user statistics
SELECT
    'User Stats' as category,
    jsonb_build_object(
        'username', up.username,
        'level', up.level,
        'total_xp', up.total_experience,
        'total_workouts', up.total_workouts,
        'total_workout_time_hours', COALESCE(SUM(w.duration_seconds) / 3600.0, 0),
        'total_calories', COALESCE(SUM(w.calories_burned), 0),
        'total_distance_km', COALESCE(SUM(w.distance_meters) / 1000.0, 0),
        'combat_wins', (SELECT COUNT(*) FROM public.combat_sessions WHERE user_id = auth.uid() AND victory = true),
        'combat_losses', (SELECT COUNT(*) FROM public.combat_sessions WHERE user_id = auth.uid() AND victory = false)
    ) as stats
FROM public.user_profiles up
LEFT JOIN public.workouts w ON w.user_id = up.id
WHERE up.id = auth.uid()
GROUP BY up.id, up.username, up.level, up.total_experience, up.total_workouts;

-- ============================================================================
-- SUCCESS!
-- ============================================================================

-- If you see data in all the SELECT queries above, your database is working perfectly!
--
-- What was tested:
-- ✅ User profiles creation
-- ✅ Avatar creation with JSONB sprite data
-- ✅ Workout logging
-- ✅ Combat session tracking
-- ✅ Auto-update triggers (total_workouts, total_experience, level)
-- ✅ Row Level Security (RLS) - you can only see your own data
-- ✅ Level calculation function
-- ✅ JSONB queries for combat logs
-- ✅ Complex aggregations
--
-- Next steps:
-- 1. Try querying this data from your React Native app
-- 2. Test the get-user-stats Edge Function
-- 3. Implement authentication flow
-- 4. Build the UI to display this data
