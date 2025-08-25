/*
  # Create auxiliary tables for self-care features

  1. New Tables
    - `gratitude_aux` (auxiliary table for gratitude tracking)
      - `id` (serial, primary key)
      - `text` (text)
      - `created_at` (timestamp)

    - `metrics_aux` (auxiliary table for metrics tracking)
      - `id` (serial, primary key)
      - `name` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on auxiliary tables
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS gratitude_aux (
  id serial PRIMARY KEY,
  text text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS metrics_aux (
  id serial PRIMARY KEY,
  name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gratitude_aux ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics_aux ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to insert into auxiliary tables
CREATE POLICY "Authenticated users can insert gratitude"
  ON gratitude_aux
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert metrics"
  ON metrics_aux
  FOR INSERT
  TO authenticated
  WITH CHECK (true);