/*
  # Create frases_autocuidado table

  1. New Tables
    - `frases_autocuidado`
      - `id` (serial, primary key)
      - `frases` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `frases_autocuidado` table
    - Add policy for all authenticated users to read
    - Add policy for admins to manage

  3. Sample Data
    - Insert some inspirational quotes
*/

CREATE TABLE IF NOT EXISTS frases_autocuidado (
  id serial PRIMARY KEY,
  frases text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE frases_autocuidado ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read quotes
CREATE POLICY "Authenticated users can read quotes"
  ON frases_autocuidado
  FOR SELECT
  TO authenticated
  USING (true);

-- Admins can manage quotes
CREATE POLICY "Admins can manage quotes"
  ON frases_autocuidado
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Insert sample inspirational quotes
INSERT INTO frases_autocuidado (frases) VALUES
  ('Conecte-se consigo mesmo antes de conectar-se com o público.'),
  ('Sua criatividade floresce quando você cuida da sua energia.'),
  ('Cada batida é uma oportunidade de expressar sua essência.'),
  ('A música é o reflexo da sua alma. Cuide bem dela.'),
  ('Seu bem-estar é tão importante quanto sua performance.'),
  ('Respire fundo, sinta o ritmo e deixe a música fluir.'),
  ('Cuidar de si mesmo é o primeiro passo para cuidar da sua arte.'),
  ('Sua saúde mental é o alicerce da sua criatividade.'),
  ('Cada dia é uma nova chance de criar algo incrível.'),
  ('A pausa também faz parte da música da vida.')
ON CONFLICT DO NOTHING;