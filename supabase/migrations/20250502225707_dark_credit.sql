/*
  # Create tables for candidate tracking system

  1. New Tables
    - `candidates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `update_status` (text)
      - `updated_at` (timestamp)
      - `disqualified` (boolean)
      - `hungry` (boolean)
      - `humble` (boolean)
      - `smart` (boolean)
      - `previous_ceo_experience` (boolean)
      - `global_experience` (boolean)
      - `created_at` (timestamp)

    - `engagement_details`
      - `id` (uuid, primary key)
      - `client_company` (text)
      - `report_date` (timestamp)
      - `report_title` (text)
      - `confidentiality_notice` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read and modify their data
*/

-- Create candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  update_status text,
  updated_at timestamptz DEFAULT now(),
  disqualified boolean DEFAULT false,
  hungry boolean DEFAULT false,
  humble boolean DEFAULT false,
  smart boolean DEFAULT false,
  previous_ceo_experience boolean DEFAULT false,
  global_experience boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for candidates
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for candidates
CREATE POLICY "Enable read access for authenticated users"
  ON public.candidates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.candidates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.candidates
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create engagement_details table
CREATE TABLE IF NOT EXISTS public.engagement_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_company text NOT NULL,
  report_date timestamptz DEFAULT now(),
  report_title text NOT NULL,
  confidentiality_notice text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for engagement_details
ALTER TABLE public.engagement_details ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for engagement_details
CREATE POLICY "Enable read access for authenticated users"
  ON public.engagement_details
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.engagement_details
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.engagement_details
  FOR UPDATE
  TO authenticated
  USING (true);