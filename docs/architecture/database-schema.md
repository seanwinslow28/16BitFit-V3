# **Database Schema**

This section defines the PostgreSQL schema for 16BitFit-V3, based on the conceptual data models. It includes table definitions, primary keys, foreign keys, basic indexes, enables Row Level Security (RLS), and notes where PostgreSQL Functions will handle logic.

SQL  
\-- Enable UUID generation  
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\-- \#\# User Profile Table \#\#  
\-- Stores core user information, linked to Supabase Auth  
CREATE TABLE public.user\_profiles (  
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, \-- Links to auth.users  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
  updated\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
  email TEXT UNIQUE, \-- Can be NULL initially if deferred auth  
  selected\_archetype TEXT CHECK (selected\_archetype IN ('Trainer', 'Runner', 'Yoga', 'Bodybuilder', 'Cyclist')), \--  
  selected\_combat\_character TEXT CHECK (selected\_combat\_character IN ('Sean', 'Mary')), \--  
  home\_avatar\_url TEXT, \-- URL to generated avatar  
  current\_evolution\_stage INTEGER NOT NULL DEFAULT 1, \-- Starts at stage 1  
  evolution\_progress REAL NOT NULL DEFAULT 0.0, \-- Progress points  
  fitness\_streak INTEGER NOT NULL DEFAULT 0, \-- Daily activity streak  
  last\_activity\_date DATE \-- For streak calculation  
);

\-- Enable RLS for user\_profiles  
ALTER TABLE public.user\_profiles ENABLE ROW LEVEL SECURITY;

\-- Policy: Users can view their own profile  
CREATE POLICY "Allow individual user read access" ON public.user\_profiles  
  FOR SELECT USING (auth.uid() \= id);

\-- Policy: Users can update their own profile (selectively)  
CREATE POLICY "Allow individual user update access" ON public.user\_profiles  
  FOR UPDATE USING (auth.uid() \= id)  
  WITH CHECK (auth.uid() \= id);

\-- Trigger to update updated\_at timestamp  
CREATE OR REPLACE FUNCTION public.handle\_updated\_at()  
RETURNS TRIGGER AS $$  
BEGIN  
  NEW.updated\_at \= now();  
  RETURN NEW;  
END;  
$$ LANGUAGE plpgsql;

CREATE TRIGGER on\_user\_profiles\_updated  
  BEFORE UPDATE ON public.user\_profiles  
  FOR EACH ROW  
  EXECUTE PROCEDURE public.handle\_updated\_at();

\-- \#\# Workout Log Table \#\#  
\-- Records manually logged workouts  
CREATE TABLE public.workout\_logs (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  user\_id UUID NOT NULL REFERENCES public.user\_profiles(id) ON DELETE CASCADE,  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
  workout\_type TEXT NOT NULL CHECK (workout\_type IN ('Strength', 'Cardio', 'Flexibility')), \--  
  duration\_minutes INTEGER NOT NULL CHECK (duration\_minutes \> 0),  
  start\_time TIMESTAMPTZ NOT NULL,  
  end\_time TIMESTAMPTZ NOT NULL CHECK (end\_time \> start\_time),  
  evolution\_points\_gained REAL NOT NULL DEFAULT 0.0 \-- \-- Note: Calculation likely handled by PG Function triggered on insert  
);

\-- Index for querying workouts by user  
CREATE INDEX idx\_workout\_logs\_user\_id ON public.workout\_logs(user\_id);

\-- Enable RLS for workout\_logs  
ALTER TABLE public.workout\_logs ENABLE ROW LEVEL SECURITY;

\-- Policy: Users can manage their own workout logs  
CREATE POLICY "Allow individual user management" ON public.workout\_logs  
  FOR ALL USING (auth.uid() \= user\_id);

\-- \#\# Daily Steps Table \#\#  
\-- Stores daily step counts synced from health platforms  
CREATE TABLE public.daily\_steps (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  user\_id UUID NOT NULL REFERENCES public.user\_profiles(id) ON DELETE CASCADE,  
  date DATE NOT NULL,  
  step\_count INTEGER NOT NULL DEFAULT 0 CHECK (step\_count \>= 0), \--  
  last\_synced\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
  energy\_generated REAL NOT NULL DEFAULT 0.0, \-- Calculated energy \-- Note: Calculation likely handled by PG Function triggered on insert/update  
  evolution\_points\_gained REAL NOT NULL DEFAULT 0.0, \-- Calculated points \-- Note: Calculation likely handled by PG Function triggered on insert/update  
  UNIQUE (user\_id, date) \-- Ensure only one record per user per day  
);

\-- Index for querying steps by user and date  
CREATE INDEX idx\_daily\_steps\_user\_date ON public.daily\_steps(user\_id, date DESC);

\-- Enable RLS for daily\_steps  
ALTER TABLE public.daily\_steps ENABLE ROW LEVEL SECURITY;

\-- Policy: Users can manage their own step data  
CREATE POLICY "Allow individual user step management" ON public.daily\_steps  
  FOR ALL USING (auth.uid() \= user\_id);

\-- \#\# PostgreSQL Functions & Triggers (Conceptual) \#\#  
\-- Note: Actual function definitions will reside in Supabase migrations.  
\-- Example Trigger Concept:  
\-- CREATE TRIGGER calculate\_epp\_after\_steps\_upsert  
\--   AFTER INSERT OR UPDATE ON public.daily\_steps  
\--   FOR EACH ROW  
\--   EXECUTE FUNCTION update\_evolution\_progress\_from\_steps(); \-- Assumes this PG function exists

\-- Example Trigger Concept:  
\-- CREATE TRIGGER calculate\_epp\_after\_workout\_log  
\--   AFTER INSERT ON public.workout\_logs  
\--   FOR EACH ROW  
\--   EXECUTE FUNCTION update\_evolution\_progress\_from\_workout(); \-- Assumes this PG function exists

\-- Example Function Concept (updates profile and triggers broadcast):  
\-- CREATE OR REPLACE FUNCTION update\_evolution\_progress\_from\_steps() RETURNS TRIGGER ...  
\-- BEGIN  
\--   \-- Calculate EPP based on NEW.step\_count using asymptotic formula  
\--   \-- UPDATE public.user\_profiles SET evolution\_progress \= evolution\_progress \+ calculated\_epp WHERE id \= NEW.user\_id;  
\--   \-- Perform Realtime Broadcast using pg\_notify or Supabase realtime.broadcast function  
\--   RETURN NEW;  
\-- END;  
\-- $$ LANGUAGE plpgsql SECURITY DEFINER; \-- Use SECURITY DEFINER carefully

\-- Note: CombatCharacterStats are initially defined as static config, not a DB table.
