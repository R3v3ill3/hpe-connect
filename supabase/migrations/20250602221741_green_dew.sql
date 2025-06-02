/*
  # Add Progress Tracking Tables

  1. New Tables
    - `student_progress`
      - Tracks overall student progress and statistics
      - Links to profile
      - Stores completion rates and points
    
    - `quest_assignments`
      - Tracks which quests are assigned to which students
      - Manages quest status and completion
    
  2. Security
    - Enable RLS on all tables
    - Add policies for student and teacher access
*/

-- Student Progress Table
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

-- Quest Assignments Table
CREATE TABLE IF NOT EXISTS quest_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE,
  progress integer DEFAULT 0,
  status text DEFAULT 'not_started',
  assigned_by uuid REFERENCES profiles(id),
  assigned_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(student_id, quest_id),
  CONSTRAINT status_check CHECK (status IN ('not_started', 'in_progress', 'completed'))
);

-- Enable RLS
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for student_progress
CREATE POLICY "Students can view own progress"
  ON student_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view all progress"
  ON student_progress FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'teacher'
  ));

-- Policies for quest_assignments
CREATE POLICY "Students can view own assignments"
  ON quest_assignments FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can update own assignments"
  ON quest_assignments FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can manage assignments"
  ON quest_assignments FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'teacher'
  ));

-- Function to update student progress
CREATE OR REPLACE FUNCTION update_student_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update student_progress when quest_assignments changes
  WITH progress_stats AS (
    SELECT
      COUNT(*) FILTER (WHERE status = 'completed') as completed_quests,
      COUNT(*) FILTER (WHERE status = 'in_progress') as current_quests,
      COALESCE(AVG(progress), 0) as avg_completion
    FROM quest_assignments
    WHERE student_id = NEW.student_id
  )
  INSERT INTO student_progress (
    student_id,
    completed_quests,
    current_quests,
    average_completion_rate
  )
  SELECT
    NEW.student_id,
    completed_quests,
    current_quests,
    avg_completion::integer
  FROM progress_stats
  ON CONFLICT (student_id)
  DO UPDATE SET
    completed_quests = EXCLUDED.completed_quests,
    current_quests = EXCLUDED.current_quests,
    average_completion_rate = EXCLUDED.average_completion_rate,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update progress
CREATE TRIGGER update_student_progress_trigger
AFTER INSERT OR UPDATE ON quest_assignments
FOR EACH ROW
EXECUTE FUNCTION update_student_progress();