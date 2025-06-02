/*
  # Update profiles policies

  1. Security
    - Enable RLS on profiles table
    - Add policies for profile management
    - Allow teachers to create student profiles
    - Allow users to read their own profiles
    - Allow users to update their own profiles
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Allow teachers to create student profiles
CREATE POLICY "Teachers can create student profiles"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'teacher'
  )
  AND NEW.role = 'student'
);

-- Allow teachers to read all student profiles
CREATE POLICY "Teachers can read student profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'teacher'
  )
  OR auth.uid() = id
);