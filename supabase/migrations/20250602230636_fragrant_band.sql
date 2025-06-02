-- Drop existing tables and policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Teachers can create student profiles" ON profiles;
DROP POLICY IF EXISTS "Teachers can read student profiles" ON profiles;

DROP TABLE IF EXISTS student_badges;
DROP TABLE IF EXISTS badges;
DROP TABLE IF EXISTS quest_progress;
DROP TABLE IF EXISTS quests;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS profiles;

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL CHECK (role IN ('teacher', 'student')),
  year_level text,
  school text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  year_level text NOT NULL,
  strand text NOT NULL,
  topic text NOT NULL,
  duration text,
  activities jsonb,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quests table
CREATE TABLE quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  points integer DEFAULT 0,
  duration text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quest_progress table
CREATE TABLE quest_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE,
  progress integer DEFAULT 0,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, quest_id)
);

-- Create badges table
CREATE TABLE badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  points integer DEFAULT 0,
  requirements jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create student_badges table
CREATE TABLE student_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at timestamptz DEFAULT now(),
  UNIQUE(student_id, badge_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Teachers can create student profiles"
  ON profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
    OR auth.uid() = id
  );

-- Lesson Policies
CREATE POLICY "Everyone can view lessons"
  ON lessons FOR SELECT
  USING (true);

CREATE POLICY "Teachers can manage lessons"
  ON lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

-- Quest Policies
CREATE POLICY "Everyone can view quests"
  ON quests FOR SELECT
  USING (true);

CREATE POLICY "Teachers can manage quests"
  ON quests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

-- Quest Progress Policies
CREATE POLICY "Students can view own progress"
  ON quest_progress FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can update own progress"
  ON quest_progress FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Students can start quests"
  ON quest_progress FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Badge Policies
CREATE POLICY "Everyone can view badges"
  ON badges FOR SELECT
  USING (true);

CREATE POLICY "Teachers can manage badges"
  ON badges FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

-- Student Badge Policies
CREATE POLICY "Students can view own badges"
  ON student_badges FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "System can award badges"
  ON student_badges FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
    OR auth.uid() = student_id
  );