/*
  # Create music_projects table

  1. New Tables
    - `music_projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `status` (text, default 'planning')
      - `deadline` (date)
      - `shared_with_admin` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `music_projects` table
    - Add policies for users and admins
*/

CREATE TABLE IF NOT EXISTS music_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'recording', 'mixing', 'completed')),
  deadline date,
  shared_with_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE music_projects ENABLE ROW LEVEL SECURITY;

-- Users can manage their own projects
CREATE POLICY "Users can manage own music projects"
  ON music_projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read shared projects
CREATE POLICY "Admins can read shared music projects"
  ON music_projects
  FOR SELECT
  TO authenticated
  USING (
    shared_with_admin = true AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );