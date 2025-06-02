/*
  # Add missing RLS policies
  
  This migration adds new RLS policies without duplicating existing ones.
  
  1. New Policies
    - Users can delete their own profile
    - Teachers can delete their own lessons
    - Students can update their own quest progress
    - Students can earn badges
*/

-- Add delete policy for profiles
CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Add delete policy for lessons
CREATE POLICY "Teachers can delete own lessons"
  ON lessons FOR DELETE
  USING (created_by = auth.uid());

-- Add update policy for quest progress
CREATE POLICY "Students can update own progress"
  ON quest_progress FOR UPDATE
  USING (auth.uid() = student_id);

-- Add insert policy for student badges
CREATE POLICY "Students can earn badges"
  ON student_badges FOR INSERT
  WITH CHECK (auth.uid() = student_id);