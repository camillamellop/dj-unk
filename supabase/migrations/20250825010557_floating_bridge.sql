/*
  # Create financial tables

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text, income/expense)
      - `category` (text)
      - `description` (text)
      - `amount` (numeric)
      - `date` (date)
      - `isRecurring` (boolean, default false)
      - `created_at` (timestamp)

    - `financial_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `targetAmount` (numeric)
      - `currentAmount` (numeric, default 0)
      - `deadline` (date)
      - `category` (text)
      - `created_at` (timestamp)

    - `caches`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `eventTitle` (text)
      - `amount` (numeric)
      - `date` (date)
      - `producer` (text)
      - `status` (text, default 'pending')
      - `paymentProof` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all financial tables
    - Add policies for users to manage their own data
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  date date NOT NULL,
  "isRecurring" boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS financial_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  "targetAmount" numeric NOT NULL,
  "currentAmount" numeric DEFAULT 0,
  deadline date NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS caches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  "eventTitle" text NOT NULL,
  amount numeric NOT NULL,
  date date NOT NULL,
  producer text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  "paymentProof" text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE caches ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
CREATE POLICY "Users can manage own transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for financial goals
CREATE POLICY "Users can manage own financial goals"
  ON financial_goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for caches
CREATE POLICY "Users can manage own caches"
  ON caches
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);