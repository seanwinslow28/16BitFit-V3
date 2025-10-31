-- 16BitFit V3 - Initial Database Schema
-- Migration: 20251024131738_initial_schema
-- Description: Creates core tables for users, avatars, workouts, and combat sessions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER PROFILES
-- ============================================================================
-- Extends Supabase auth.users with additional profile data

CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_id UUID,
    total_workouts INTEGER DEFAULT 0,
    total_experience INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- Index for username lookups
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);

-- ============================================================================
-- AVATARS
-- ============================================================================
-- Stores pixel art avatar data and combat stats

CREATE TABLE public.avatars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sprite_data JSONB NOT NULL, -- Pixel art sprite configuration

    -- Combat Stats
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    max_hp INTEGER DEFAULT 100,
    current_hp INTEGER DEFAULT 100,
    attack INTEGER DEFAULT 10,
    defense INTEGER DEFAULT 10,
    speed INTEGER DEFAULT 10,

    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT avatar_level_range CHECK (level >= 1 AND level <= 100),
    CONSTRAINT avatar_hp_range CHECK (current_hp >= 0 AND current_hp <= max_hp),
    CONSTRAINT avatar_stats_positive CHECK (attack > 0 AND defense > 0 AND speed > 0)
);

-- Index for user's avatars
CREATE INDEX idx_avatars_user_id ON public.avatars(user_id);
CREATE INDEX idx_avatars_active ON public.avatars(user_id, is_active) WHERE is_active = true;

-- ============================================================================
-- WORKOUTS
-- ============================================================================
-- Stores workout session data

CREATE TYPE workout_type AS ENUM ('cardio', 'strength', 'flexibility', 'mixed');

CREATE TABLE public.workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,

    -- Workout Details
    workout_type workout_type NOT NULL,
    duration_seconds INTEGER NOT NULL,
    calories_burned INTEGER,
    distance_meters INTEGER,
    heart_rate_avg INTEGER,

    -- Gamification
    experience_gained INTEGER DEFAULT 0,
    combat_session_id UUID, -- Links to combat session

    -- Metadata
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT workout_duration_positive CHECK (duration_seconds > 0),
    CONSTRAINT workout_calories_positive CHECK (calories_burned IS NULL OR calories_burned >= 0),
    CONSTRAINT workout_time_valid CHECK (completed_at >= started_at)
);

-- Indexes for workout queries
CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_completed_at ON public.workouts(completed_at DESC);
CREATE INDEX idx_workouts_user_completed ON public.workouts(user_id, completed_at DESC);

-- ============================================================================
-- COMBAT SESSIONS
-- ============================================================================
-- Stores pixel art combat game session data

CREATE TABLE public.combat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    avatar_id UUID NOT NULL REFERENCES public.avatars(id),
    workout_id UUID REFERENCES public.workouts(id),

    -- Combat Details
    boss_name TEXT NOT NULL,
    boss_level INTEGER NOT NULL,
    victory BOOLEAN NOT NULL,

    -- Combat Stats
    damage_dealt INTEGER DEFAULT 0,
    damage_received INTEGER DEFAULT 0,
    duration_seconds INTEGER NOT NULL,

    -- Rewards
    experience_gained INTEGER DEFAULT 0,

    -- Game State
    combat_log JSONB, -- Detailed turn-by-turn log

    -- Metadata
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT combat_duration_positive CHECK (duration_seconds > 0),
    CONSTRAINT combat_time_valid CHECK (completed_at >= started_at)
);

-- Indexes for combat session queries
CREATE INDEX idx_combat_sessions_user_id ON public.combat_sessions(user_id);
CREATE INDEX idx_combat_sessions_avatar_id ON public.combat_sessions(avatar_id);
CREATE INDEX idx_combat_sessions_completed ON public.combat_sessions(completed_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combat_sessions ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Avatars Policies
CREATE POLICY "Users can view their own avatars"
    ON public.avatars FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own avatars"
    ON public.avatars FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own avatars"
    ON public.avatars FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own avatars"
    ON public.avatars FOR DELETE
    USING (user_id = auth.uid());

-- Workouts Policies
CREATE POLICY "Users can view their own workouts"
    ON public.workouts FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own workouts"
    ON public.workouts FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Combat Sessions Policies
CREATE POLICY "Users can view their own combat sessions"
    ON public.combat_sessions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own combat sessions"
    ON public.combat_sessions FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_avatars_updated_at
    BEFORE UPDATE ON public.avatars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', 'Player')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate level from experience
CREATE OR REPLACE FUNCTION public.calculate_level(exp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Simple level calculation: level = floor(sqrt(experience / 100)) + 1
    -- Can be customized based on game design
    RETURN LEAST(FLOOR(SQRT(exp / 100.0)) + 1, 100)::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update user stats after workout
CREATE OR REPLACE FUNCTION public.update_user_stats_after_workout()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user_profiles
    SET
        total_workouts = total_workouts + 1,
        total_experience = total_experience + COALESCE(NEW.experience_gained, 0),
        level = public.calculate_level(total_experience + COALESCE(NEW.experience_gained, 0))
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update user stats when workout is inserted
CREATE TRIGGER after_workout_insert
    AFTER INSERT ON public.workouts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_stats_after_workout();

-- ============================================================================
-- INITIAL DATA / SEED
-- ============================================================================

-- Create a test boss template (this could be expanded to a bosses table)
COMMENT ON TABLE public.combat_sessions IS
'Combat sessions link workouts to boss battles. Boss data can be stored in boss_name and boss_level, or in a separate bosses table in future migrations.';

-- Migration complete
COMMENT ON SCHEMA public IS '16BitFit V3 - Initial schema created';
