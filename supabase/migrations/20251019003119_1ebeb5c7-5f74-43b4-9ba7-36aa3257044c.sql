-- Add character customization fields to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS character_color text DEFAULT '#9b87f5',
ADD COLUMN IF NOT EXISTS character_shape text DEFAULT 'circle',
ADD COLUMN IF NOT EXISTS character_face text DEFAULT 'happy',
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Create daily check-ins table
CREATE TABLE IF NOT EXISTS daily_check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mood integer NOT NULL CHECK (mood >= 1 AND mood <= 5),
  note text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on daily_check_ins
ALTER TABLE daily_check_ins ENABLE ROW LEVEL SECURITY;

-- RLS policies for daily_check_ins
CREATE POLICY "Users can view own check-ins"
  ON daily_check_ins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins"
  ON daily_check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  target_days integer DEFAULT 7,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- RLS policies for goals
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- Create habit completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  goal_id uuid REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on habit_completions
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- RLS policies for habit_completions
CREATE POLICY "Users can view own completions"
  ON habit_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON habit_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own completions"
  ON habit_completions FOR DELETE
  USING (auth.uid() = user_id);