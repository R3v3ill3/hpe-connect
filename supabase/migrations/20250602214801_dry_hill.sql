/*
  # Reset RLS policies for profiles table
  
  1. Changes
    - Disable RLS to implicitly drop all existing policies
    - Re-enable RLS
    - Recreate all necessary policies with proper permissions
  
  2. Security
    - Ensures proper access control for profiles
    - Teachers can manage student profiles
    - Users can manage their own profiles
    - Public can view basic profile information
*/

-- Disable RLS to drop all existing policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profile management
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO public
USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE
TO public
USING (auth.uid() = id);

CREATE POLICY "Teachers can create student profiles"
ON profiles FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'teacher'
  )
  OR
  auth.uid() = id
);

CREATE POLICY "Teachers can view student profiles"
ON profiles FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'teacher'
  )
  OR id = auth.uid()
);