-- ============================================================================
-- 16BitFit V3 - Simple Test Data Script (No Auth Required)
-- ============================================================================
-- Creates sample data using a hardcoded test user UUID
-- Run this in Supabase SQL Editor (uses service role, bypasses RLS)

-- ============================================================================
-- STEP 1: Create a Test User ID
-- ============================================================================
-- We'll use a fixed UUID for testing
-- In production, this would be created by Supabase Auth

-- Generate a test UUID (you can replace this with any valid UUID)
DO $$
DECLARE
    test_user_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
    -- First, insert into auth.users (simulating user signup)
    -- Note: In production, Supabase Auth handles this
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        test_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'test@16bitfit.com',
        crypt('testpassword123', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"username":"test_warrior"}'::jsonb,
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    )
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Test user created with ID: %', test_user_id;
END $$;

-- ============================================================================
-- STEP 2: Create User Profile
-- ============================================================================
-- The trigger should auto-create this, but we'll do it manually for testing

INSERT INTO public.user_profiles (
    id,
    username,
    display_name,
    total_workouts,
    total_experience,
    level
)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'test_warrior',
    'Test Warrior',
    0,
    0,
    1
)
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name;

-- Verify profile
SELECT * FROM public.user_profiles WHERE id = '11111111-1111-1111-1111-111111111111';

-- ============================================================================
-- STEP 3: Create Test Avatar
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
    '11111111-1111-1111-1111-111111111111',
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
ON CONFLICT (id) DO NOTHING
RETURNING id, name, level, attack, defense, speed;

-- Verify avatar
SELECT * FROM public.avatars WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- ============================================================================
-- STEP 4: Create Test Workouts
-- ============================================================================

-- Workout 1: Morning Cardio
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
    '11111111-1111-1111-1111-111111111111',
    'cardio',
    1800,               -- 30 minutes
    250,                -- calories
    5000,               -- 5km
    145,                -- heart rate
    100,                -- XP gained
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '30 minutes'
);

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
    '11111111-1111-1111-1111-111111111111',
    'strength',
    2700,               -- 45 minutes
    300,                -- calories
    150,                -- XP gained
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '45 minutes'
);

-- Workout 3: Mixed Session
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
    '11111111-1111-1111-1111-111111111111',
    'mixed',
    3600,               -- 60 minutes
    400,                -- calories
    3000,               -- 3km
    200,                -- XP gained
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '1 hour'
);

-- Verify workouts
SELECT
    id,
    workout_type,
    duration_seconds / 60.0 as duration_minutes,
    calories_burned,
    experience_gained,
    completed_at::date as workout_date
FROM public.workouts
WHERE user_id = '11111111-1111-1111-1111-111111111111'
ORDER BY completed_at DESC;

-- ============================================================================
-- STEP 5: Create Combat Sessions
-- ============================================================================

-- Get avatar ID first
DO $$
DECLARE
    v_avatar_id UUID;
    v_workout_id UUID;
    test_user_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
    -- Get avatar
    SELECT id INTO v_avatar_id
    FROM public.avatars
    WHERE user_id = test_user_id AND is_active = true
    LIMIT 1;

    -- Get most recent workout
    SELECT id INTO v_workout_id
    FROM public.workouts
    WHERE user_id = test_user_id
    ORDER BY completed_at DESC
    LIMIT 1;

    -- Combat Session 1: Victory
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
        test_user_id,
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

    -- Combat Session 2: Defeat
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
        test_user_id,
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

    RAISE NOTICE 'Combat sessions created!';
END $$;

-- ============================================================================
-- STEP 6: Verify All Data
-- ============================================================================

-- User Profile (should show auto-updated stats from triggers)
SELECT
    username,
    display_name,
    level,
    total_experience,
    total_workouts,
    created_at
FROM public.user_profiles
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Avatar
SELECT
    name,
    level,
    current_hp,
    max_hp,
    attack,
    defense,
    speed,
    sprite_data
FROM public.avatars
WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- Workouts Summary
SELECT
    COUNT(*) as total_workouts,
    SUM(duration_seconds) / 60.0 as total_minutes,
    SUM(calories_burned) as total_calories,
    SUM(experience_gained) as total_xp
FROM public.workouts
WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- Combat Sessions
SELECT
    boss_name,
    boss_level,
    victory,
    damage_dealt,
    damage_received,
    experience_gained
FROM public.combat_sessions
WHERE user_id = '11111111-1111-1111-1111-111111111111'
ORDER BY completed_at DESC;

-- Level Calculation Test
SELECT
    exp,
    public.calculate_level(exp) as level
FROM (
    VALUES
        (0),      -- Level 1
        (100),    -- Level 2
        (400),    -- Level 3
        (450),    -- Level 3 (our test user's XP)
        (900),    -- Level 4
        (2500)    -- Level 6
) AS test_data(exp);

-- ============================================================================
-- FINAL SUMMARY
-- ============================================================================

SELECT
    'Test Data Created Successfully!' as status,
    jsonb_build_object(
        'user', jsonb_build_object(
            'username', up.username,
            'level', up.level,
            'total_xp', up.total_experience,
            'total_workouts', up.total_workouts
        ),
        'avatar', jsonb_build_object(
            'name', a.name,
            'hp', a.current_hp || '/' || a.max_hp,
            'attack', a.attack,
            'defense', a.defense
        ),
        'stats', jsonb_build_object(
            'workouts', (SELECT COUNT(*) FROM public.workouts WHERE user_id = '11111111-1111-1111-1111-111111111111'),
            'combat_sessions', (SELECT COUNT(*) FROM public.combat_sessions WHERE user_id = '11111111-1111-1111-1111-111111111111'),
            'victories', (SELECT COUNT(*) FROM public.combat_sessions WHERE user_id = '11111111-1111-1111-1111-111111111111' AND victory = true),
            'defeats', (SELECT COUNT(*) FROM public.combat_sessions WHERE user_id = '11111111-1111-1111-1111-111111111111' AND victory = false)
        )
    ) as test_data_summary
FROM public.user_profiles up
LEFT JOIN public.avatars a ON a.user_id = up.id AND a.is_active = true
WHERE up.id = '11111111-1111-1111-1111-111111111111';

-- ✅ If you see the summary above, everything is working!
--
-- Expected Results:
-- - User: level 3, 450 total XP, 3 workouts
-- - Avatar: Pixel Warrior with combat stats
-- - 3 workouts logged
-- - 2 combat sessions (1 win, 1 loss)
--
-- Next Steps:
-- 1. View data in Table Editor
-- 2. Test from React Native app
-- 3. Deploy Edge Function to query this data
