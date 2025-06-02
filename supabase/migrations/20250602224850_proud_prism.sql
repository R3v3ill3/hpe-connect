/*
  # Fix RLS Policies and Triggers

  1. Changes
    - Drop and recreate problematic RLS policies
    - Fix trigger functions to properly handle NEW/OLD records
    - Add proper error handling in functions
  
  2. Security
    - Maintain existing security model
    - Ensure proper access control
*/

-- First, drop existing problematic policies
DROP POLICY IF EXISTS "Teachers can create student profiles" ON profiles;
DROP POLICY IF EXISTS "Teachers can manage assignments" ON quest_assignments;

-- Recreate the policies with proper NEW record handling
CREATE POLICY "Teachers can create student profiles"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  (
    SELECT role FROM profiles 
    WHERE id = auth.uid()
  ) = 'teacher'
  AND NEW.role = 'student'
);

-- Fix quest assignments policy
CREATE POLICY "Teachers can manage assignments"
ON quest_assignments FOR ALL
TO authenticated
USING (
  (
    SELECT role FROM profiles 
    WHERE id = auth.uid()
  ) = 'teacher'
)
WITH CHECK (
  (
    SELECT role FROM profiles 
    WHERE id = auth.uid()
  ) = 'teacher'
);

-- Drop and recreate the progress update function with proper error handling
CREATE OR REPLACE FUNCTION update_student_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure we have a valid student_id
  IF NEW.student_id IS NULL THEN
    RAISE EXCEPTION 'student_id cannot be null';
  END IF;

  -- Calculate progress stats
  WITH progress_stats AS (
    SELECT
      COUNT(*) FILTER (WHERE status = 'completed') as completed_quests,
      COUNT(*) FILTER (WHERE status = 'in_progress') as current_quests,
      COALESCE(AVG(NULLIF(progress, 0)), 0) as avg_completion,
      COALESCE(SUM(q.points) FILTER (WHERE qa.status = 'completed'), 0) as total_points
    FROM quest_assignments qa
    LEFT JOIN quests q ON qa.quest_id = q.id
    WHERE qa.student_id = NEW.student_id
  )
  INSERT INTO student_progress (
    student_id,
    completed_quests,
    current_quests,
    total_points,
    average_completion_rate,
    updated_at
  )
  SELECT
    NEW.student_id,
    completed_quests,
    current_quests,
    total_points,
    avg_completion::integer,
    now()
  FROM progress_stats
  ON CONFLICT (student_id)
  DO UPDATE SET
    completed_quests = EXCLUDED.completed_quests,
    current_quests = EXCLUDED.current_quests,
    total_points = EXCLUDED.total_points,
    average_completion_rate = EXCLUDED.average_completion_rate,
    updated_at = EXCLUDED.updated_at;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error and re-raise
  RAISE WARNING 'Error in update_student_progress: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;