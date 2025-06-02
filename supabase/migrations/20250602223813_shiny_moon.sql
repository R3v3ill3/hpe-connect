/*
  # Add lesson planning and curriculum integration

  1. New Tables
    - `curriculum_standards` - Stores WA HPE curriculum standards
    - `lesson_templates` - Pre-defined lesson templates
    - `lesson_objectives` - Learning objectives linked to curriculum
    - `lesson_activities` - Structured lesson activities
    
  2. Changes
    - Add curriculum fields to lessons table
    - Add AI generation tracking
    
  3. Security
    - Enable RLS
    - Add policies for teachers
*/

-- Curriculum Standards Table
CREATE TABLE curriculum_standards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_level text NOT NULL,
  strand text NOT NULL,
  sub_strand text NOT NULL,
  content_description text NOT NULL,
  elaborations jsonb,
  created_at timestamptz DEFAULT now()
);

-- Lesson Templates Table
CREATE TABLE lesson_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  structure jsonb NOT NULL,
  curriculum_links jsonb,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- Lesson Objectives Table
CREATE TABLE lesson_objectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  description text NOT NULL,
  curriculum_standard_id uuid REFERENCES curriculum_standards(id),
  created_at timestamptz DEFAULT now()
);

-- Lesson Activities Table
CREATE TABLE lesson_activities (
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

-- Add curriculum fields to lessons
ALTER TABLE lessons 
ADD COLUMN curriculum_links jsonb,
ADD COLUMN ai_generated boolean DEFAULT false,
ADD COLUMN ai_prompts jsonb,
ADD COLUMN template_id uuid REFERENCES lesson_templates(id);

-- Enable RLS
ALTER TABLE curriculum_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Curriculum standards are viewable by everyone"
  ON curriculum_standards FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Teachers can manage lesson templates"
  ON lesson_templates FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can manage lesson objectives"
  ON lesson_objectives FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can manage lesson activities"
  ON lesson_activities FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

-- Function to generate lesson plan
CREATE OR REPLACE FUNCTION generate_lesson_plan(
  template_id uuid,
  year_level text,
  strand text,
  topic text,
  duration text
) RETURNS uuid AS $$
DECLARE
  new_lesson_id uuid;
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
    topic || ' - Year ' || year_level,
    year_level,
    strand,
    topic,
    duration,
    template_id,
    true
  )
  RETURNING id INTO new_lesson_id;

  -- Generate activities from template
  INSERT INTO lesson_activities (
    lesson_id,
    title,
    description,
    duration,
    sequence_order
  )
  SELECT
    new_lesson_id,
    'Activity ' || generate_series(1, 3),
    'Description for activity ' || generate_series(1, 3),
    '15 minutes'::interval,
    generate_series(1, 3);

  RETURN new_lesson_id;
END;
$$ LANGUAGE plpgsql;