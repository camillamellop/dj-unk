/*
  # Create tarefas table

  1. New Tables
    - `tarefas`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `titulo` (text)
      - `description` (text)
      - `priority` (text, default 'medium')
      - `status` (text, default 'todo')
      - `due_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tarefas` table
    - Add policies for users and admins
*/

CREATE TABLE IF NOT EXISTS tarefas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  titulo text NOT NULL,
  description text,
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status text DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;

-- Users can manage their own tasks
CREATE POLICY "Users can manage own tasks"
  ON tarefas
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all tasks
CREATE POLICY "Admins can read all tasks"
  ON tarefas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );