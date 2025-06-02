-- Create student progress tracking tables and functions

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

-- Enable RLS
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- Function to calculate and update student progress
CREATE OR REPLACE FUNCTION calculate_student_progress(student_uuid uuid)
RETURNS void AS $$
DECLARE
  completed_count integer;
  in_progress_count integer;
  total_pts integer;
  avg_completion numeric;
BEGIN
  -- Get completed quests count
  SELECT COUNT(*) INTO completed_count
  FROM quest_assignments qa
  WHERE qa.student_id = student_uuid
  AND qa.status = 'completed';

  -- Get in-progress quests count
  SELECT COUNT(*) INTO in_progress_count
  FROM quest_assignments qa
  WHERE qa.student_id = student_uuid
  AND qa.status = 'in_progress';

  -- Calculate total points from completed quests
  SELECT COALESCE(SUM(q.points), 0) INTO total_pts
  FROM quest_assignments qa
  JOIN quests q ON qa.quest_id = q.id
  WHERE qa.student_id = student_uuid
  AND qa.status = 'completed';

  -- Calculate average completion rate
  SELECT COALESCE(AVG(qa.progress), 0) INTO avg_completion
  FROM quest_assignments qa
  WHERE qa.student_id = student_uuid;

  -- Update or insert progress record
  INSERT INTO student_progress (
    student_id,
    completed_quests,
    current_quests,
    total_points,
    average_completion_rate,
    updated_at
  )
  VALUES (
    student_uuid,
    completed_count,
    in_progress_count,
    total_pts,
    avg_completion::integer,
    now()
  )
  ON CONFLICT (student_id) DO UPDATE
  SET
    completed_quests = EXCLUDED.completed_quests,
    current_quests = EXCLUDED.current_quests,
    total_points = EXCLUDED.total_points,
    average_completion_rate = EXCLUDED.average_completion_rate,
    updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update progress
CREATE OR REPLACE FUNCTION update_student_progress()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_student_progress(NEW.student_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on quest_assignments
DROP TRIGGER IF EXISTS update_student_progress_trigger ON quest_assignments;
CREATE TRIGGER update_student_progress_trigger
AFTER INSERT OR UPDATE OR DELETE ON quest_assignments
FOR EACH ROW
EXECUTE FUNCTION update_student_progress();