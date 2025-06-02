/*
  # Complete Database Setup

  1. Tables
    - Profiles
    - Lessons
    - Quests
    - Quest Progress
    - Student Progress
    - Badges
    - Student Badges
    - Curriculum Standards
    - Lesson Templates
    - Lesson Activities

  2. Security
    - Enable RLS on all tables
    - Set up proper RLS policies with correct NEW record handling
    - Ensure proper access control for teachers and students

  3. Functions
    - Student progress tracking
    - Lesson plan generation
    - Progress calculation
*/

-- Reset everything first
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
DROP POLICY IF EXISTS "Teachers can create student profiles" ON profiles;
DROP POLICY IF EXISTS "Teachers can view student profiles" ON profiles;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;

-- Create student progress tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  completed_quests integer DEFAULT 0,
  current_quests integer DEFAULT 0,
  total_points integer DEFAULT 0,
  average_completion_rate integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id)
);

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- Create curriculum-related tables
CREATE TABLE IF NOT EXISTS curriculum_standards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_level text NOT NULL,
  strand text NOT NULL,
  sub_strand text NOT NULL,
  content_description text NOT NULL,
  elaborations jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lesson_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  structure jsonb NOT NULL,
  curriculum_links jsonb,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

CREATE TABLE IF NOT EXISTS lesson_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration interval,
  resources jsonb,
  teaching_strategies jsonb,
  assessment_strategies jsonb,
  differentiation jsonb,
  sequence_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE curriculum_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_activities ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE
USING (auth.uid() = id);

CREATE POLICY "Teachers can create profiles"
ON profiles FOR INSERT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'teacher'
  )
);

-- Lesson Policies
CREATE POLICY "Teachers can manage lessons"
ON lessons FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'teacher'
  )
);

CREATE POLICY "Students can view lessons"
ON lessons FOR SELECT
USING (true);

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

-- Progress Tracking Policies
CREATE POLICY "Students can view own progress"
ON student_progress FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view all progress"
ON student_progress FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'teacher'
  )
);

-- Progress Update Function
CREATE OR REPLACE FUNCTION update_student_progress()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_student_id uuid;
  v_completed_count integer;
  v_in_progress_count integer;
  v_total_points integer;
  v_avg_completion numeric;
BEGIN
  -- Get student ID based on trigger context
  v_student_id := COALESCE(NEW.student_id, OLD.student_id);
  
  -- Calculate stats
  SELECT 
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*) FILTER (WHERE status = 'in_progress'),
    COALESCE(SUM(q.points) FILTER (WHERE qp.status = 'completed'), 0),
    COALESCE(AVG(NULLIF(qp.progress, 0)), 0)
  INTO 
    v_completed_count,
    v_in_progress_count,
    v_total_points,
    v_avg_completion
  FROM quest_progress qp
  LEFT JOIN quests q ON qp.quest_id = q.id
  WHERE qp.student_id = v_student_id;

  -- Update progress
  INSERT INTO student_progress (
    student_id,
    completed_quests,
    current_quests,
    total_points,
    average_completion_rate,
    updated_at
  ) VALUES (
    v_student_id,
    v_completed_count,
    v_in_progress_count,
    v_total_points,
    v_avg_completion::integer,
    now()
  )
  ON CONFLICT (student_id) DO UPDATE SET
    completed_quests = EXCLUDED.completed_quests,
    current_quests = EXCLUDED.current_quests,
    total_points = EXCLUDED.total_points,
    average_completion_rate = EXCLUDED.average_completion_rate,
    updated_at = EXCLUDED.updated_at;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in update_student_progress: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create trigger for progress updates
DROP TRIGGER IF EXISTS update_student_progress_trigger ON quest_progress;
CREATE TRIGGER update_student_progress_trigger
AFTER INSERT OR UPDATE OR DELETE ON quest_progress
FOR EACH ROW
EXECUTE FUNCTION update_student_progress();

-- Lesson Generation Function
CREATE OR REPLACE FUNCTION generate_lesson_plan(
  p_template_id uuid,
  p_year_level text,
  p_strand text,
  p_topic text,
  p_duration text
)
RETURNS uuid
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_lesson_id uuid;
BEGIN
  -- Create new lesson
  INSERT INTO lessons (
    title,
    year_level,
    strand,
    topic,
    duration,
    template_id,
    ai_generated
  )
  VALUES (
    p_topic || ' - Year ' || p_year_level,
    p_year_level,
    p_strand,
    p_topic,
    p_duration,
    p_template_id,
    true
  )
  RETURNING id INTO v_lesson_id;

  -- Generate activities
  INSERT INTO lesson_activities (
    lesson_id,
    title,
    description,
    duration,
    sequence_order
  )
  SELECT
    v_lesson_id,
    'Activity ' || generate_series(1, 3),
    'Description for activity ' || generate_series(1, 3),
    '15 minutes'::interval,
    generate_series(1, 3);

  RETURN v_lesson_id;
END;
$$;