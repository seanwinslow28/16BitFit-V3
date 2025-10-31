-- 16BitFit V3 - User Steps Table
-- Migration: 20251029121640_create_user_steps_table
-- Description: Creates table for storing daily step count data from HealthKit/Health Connect
-- Story: 1.3 - HealthKit/Connect Integration & Step Sync

-- ============================================================================
-- USER STEPS
-- ============================================================================
-- Stores daily step count data synced from native health APIs

CREATE TABLE IF NOT EXISTS public.user_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  step_count INTEGER NOT NULL DEFAULT 0,
  source VARCHAR(20) NOT NULL CHECK (source IN ('HealthKit', 'HealthConnect')),
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT step_count_positive CHECK (step_count >= 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Unique constraint to enable idempotent upserts (prevents duplicate entries per user per day)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_steps_unique
  ON public.user_steps(user_id, date);

-- Index for performance on queries filtering by user and date
CREATE INDEX IF NOT EXISTS idx_user_steps_user_date
  ON public.user_steps(user_id, date DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE public.user_steps ENABLE ROW LEVEL SECURITY;

-- Users can only view their own step data
CREATE POLICY "Users can view own steps"
  ON public.user_steps
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own step data
CREATE POLICY "Users can insert own steps"
  ON public.user_steps
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own step data
CREATE POLICY "Users can update own steps"
  ON public.user_steps
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_user_steps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the update function before each UPDATE
CREATE TRIGGER update_user_steps_timestamp
  BEFORE UPDATE ON public.user_steps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_steps_updated_at();
