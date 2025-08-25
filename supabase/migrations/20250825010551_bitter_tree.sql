/*
  # Create branding table

  1. New Tables
    - `branding`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `brand_name` (text)
      - `brand_colors` (text array)
      - `logo_url` (text)
      - `description` (text)
      - `target_audience` (text)
      - `values` (text array)
      - `voice_tone` (text)
      - `visual_style` (text)
      - `social_media_strategy` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `branding` table
    - Add policies for users and admins
*/

CREATE TABLE IF NOT EXISTS branding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE UNIQUE NOT NULL,
  brand_name text,
  brand_colors text[] DEFAULT '{}',
  logo_url text,
  description text,
  target_audience text,
  values text[] DEFAULT '{}',
  voice_tone text,
  visual_style text,
  social_media_strategy text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE branding ENABLE ROW LEVEL SECURITY;

-- Users can read their own branding
CREATE POLICY "Users can read own branding"
  ON branding
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all branding
CREATE POLICY "Admins can manage all branding"
  ON branding
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );