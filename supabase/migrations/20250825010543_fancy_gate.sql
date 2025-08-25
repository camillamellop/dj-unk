/*
  # Create self_care_activities table

  1. New Tables
    - `self_care_activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text)
      - `content` (text)
      - `date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `self_care_activities` table
    - Add policy for users to manage their own activities
*/

CREATE TABLE IF NOT EXISTS self_care_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  content text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE self_care_activities ENABLE ROW LEVEL SECURITY;

-- Users can manage their own self care activities
CREATE POLICY "Users can manage own self care activities"
  ON self_care_activities
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);