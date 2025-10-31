-- 16BitFit V3 - Add Authentication & Profile Fields
-- Migration: 20251025000000_add_auth_profile_fields
-- Description: Adds fields for archetype selection, avatar URL, and evolution stage
--              Also configures authentication settings for Story 1.2

-- ============================================================================
-- ADD PROFILE FIELDS FOR ONBOARDING
-- ============================================================================

-- Create fitness archetype enum
CREATE TYPE fitness_archetype AS ENUM ('trainer', 'runner', 'yoga', 'bodybuilder', 'cyclist');

-- Create evolution stage enum
CREATE TYPE evolution_stage AS ENUM ('stage_1', 'stage_2', 'stage_3');

-- Create combat character enum (Sean or Mary)
CREATE TYPE combat_character AS ENUM ('sean', 'mary');

-- Add new columns to user_profiles
ALTER TABLE public.user_profiles
  ADD COLUMN fitness_archetype fitness_archetype,
  ADD COLUMN avatar_url TEXT,
  ADD COLUMN evolution_stage evolution_stage DEFAULT 'stage_1',
  ADD COLUMN combat_character combat_character,
  ADD COLUMN auth_status TEXT DEFAULT 'deferred' CHECK (auth_status IN ('deferred', 'authenticated')),
  ADD COLUMN onboarding_completed BOOLEAN DEFAULT false,
  ADD COLUMN photo_upload_url TEXT; -- Stores the user's uploaded headshot

-- Add comment explaining auth_status
COMMENT ON COLUMN public.user_profiles.auth_status IS
  'Tracks whether user has completed authentication. "deferred" allows app usage without login, "authenticated" means user has signed in.';

-- ============================================================================
-- UPDATE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Drop existing RLS policies for user_profiles if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Enable RLS on user_profiles (if not already enabled)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR auth_status = 'deferred' -- Allow deferred users to view their own profiles
  );

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 4: Service role can manage all profiles (for deferred auth)
CREATE POLICY "Service role full access" ON public.user_profiles
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- HELPER FUNCTION: Create Deferred User Profile
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_deferred_user_profile(
  p_username TEXT,
  p_display_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Generate a UUID for the deferred user
  v_user_id := uuid_generate_v4();

  -- Insert the profile with deferred auth status
  INSERT INTO public.user_profiles (
    id,
    username,
    display_name,
    auth_status,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    p_username,
    COALESCE(p_display_name, p_username),
    'deferred',
    NOW(),
    NOW()
  );

  RETURN v_user_id;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Username already taken';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating deferred profile: %', SQLERRM;
END;
$$;

-- ============================================================================
-- HELPER FUNCTION: Upgrade Deferred User to Authenticated
-- ============================================================================

CREATE OR REPLACE FUNCTION public.upgrade_deferred_to_auth(
  p_deferred_user_id UUID,
  p_auth_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the user profile to link with authenticated user
  UPDATE public.user_profiles
  SET
    id = p_auth_user_id,
    auth_status = 'authenticated',
    updated_at = NOW()
  WHERE id = p_deferred_user_id
    AND auth_status = 'deferred';

  IF FOUND THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error upgrading user: %', SQLERRM;
END;
$$;

-- ============================================================================
-- TRIGGER: Auto-create profile on auth.users insert
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-create a user profile when a new auth user is created
  INSERT INTO public.user_profiles (id, username, auth_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'authenticated'
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Username already exists, append random suffix
    INSERT INTO public.user_profiles (id, username, auth_status)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)) || '_' || substr(md5(random()::text), 1, 4),
      'authenticated'
    );
    RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new auth users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Allow authenticated users to execute deferred profile creation
GRANT EXECUTE ON FUNCTION public.create_deferred_user_profile TO anon, authenticated;

-- Allow authenticated users to upgrade deferred accounts
GRANT EXECUTE ON FUNCTION public.upgrade_deferred_to_auth TO authenticated;

