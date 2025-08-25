/*
  # Create metrics table

  1. New Tables
    - `metrics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles, unique)
      - `diasAtivos` (integer, default 0)
      - `horasSono` (integer, default 0)
      - `hidratacao` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `metrics` table
    - Add policy for users to manage their own metrics
*/

CREATE TABLE IF NOT EXISTS metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE UNIQUE NOT NULL,
  "diasAtivos" integer DEFAULT 0,
  "horasSono" integer DEFAULT 0,
  hidratacao integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Users can manage their own metrics
CREATE POLICY "Users can manage own metrics"
  ON metrics
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);