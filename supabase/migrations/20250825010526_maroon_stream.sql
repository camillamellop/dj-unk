/*
  # Create eventos table

  1. New Tables
    - `eventos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `event_name` (text)
      - `description` (text)
      - `event_date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `location` (text)
      - `producer_name` (text)
      - `cache` (numeric)
      - `status` (text, default 'pending')
      - `shared_with_admin` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `eventos` table
    - Add policies for users and admins
*/

CREATE TABLE IF NOT EXISTS eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE,
  event_name text NOT NULL,
  description text,
  event_date date NOT NULL,
  start_time time,
  end_time time,
  location text,
  producer_name text,
  cache numeric DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  shared_with_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Users can manage their own events
CREATE POLICY "Users can manage own events"
  ON eventos
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all events
CREATE POLICY "Admins can read all events"
  ON eventos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Admins can manage shared events
CREATE POLICY "Admins can manage shared events"
  ON eventos
  FOR ALL
  TO authenticated
  USING (
    shared_with_admin = true AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );