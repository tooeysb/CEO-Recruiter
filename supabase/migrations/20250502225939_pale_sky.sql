/*
  # Complete Database Schema Update

  1. New Tables
    - employments
    - educations
    - engagement_team
    - candidate_notes
    - recommendation_sources
    - candidate_recommendations
    - candidate_emails
    - endorsers
    - detractors
    - call_transcripts
    - meetings

  2. Updates to Existing Tables
    - candidates: Add missing columns
    - engagement_details: Add missing columns

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Update candidates table with missing columns
ALTER TABLE public.candidates
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS current_title text,
ADD COLUMN IF NOT EXISTS current_employer text,
ADD COLUMN IF NOT EXISTS employer_stock_symbol text,
ADD COLUMN IF NOT EXISTS employer_revenue_usd bigint,
ADD COLUMN IF NOT EXISTS employer_industry text,
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS x_com_url text,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS dq_reason text,
ADD COLUMN IF NOT EXISTS hungry_examples text,
ADD COLUMN IF NOT EXISTS humble_examples text,
ADD COLUMN IF NOT EXISTS smart_examples text,
ADD COLUMN IF NOT EXISTS exec_staff boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS global_experience_details text;

-- Create employments table
CREATE TABLE IF NOT EXISTS public.employments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE CASCADE,
  employer_name text NOT NULL,
  title text NOT NULL,
  start_year integer,
  end_year integer,
  description text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create educations table
CREATE TABLE IF NOT EXISTS public.educations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE CASCADE,
  degree text,
  field_of_study text,
  institution text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create engagement_team table
CREATE TABLE IF NOT EXISTS public.engagement_team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid REFERENCES public.engagement_details(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL,
  email text,
  office_phone text,
  mobile_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recommendation_sources table
CREATE TABLE IF NOT EXISTS public.recommendation_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create candidate_recommendations table
CREATE TABLE IF NOT EXISTS public.candidate_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE CASCADE,
  source_id uuid REFERENCES public.recommendation_sources(id) ON DELETE RESTRICT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create candidate_emails table
CREATE TABLE IF NOT EXISTS public.candidate_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE CASCADE,
  sender text NOT NULL,
  recipient text NOT NULL,
  subject text,
  body text,
  sent_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create endorsers table
CREATE TABLE IF NOT EXISTS public.endorsers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create detractors table
CREATE TABLE IF NOT EXISTS public.detractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create call_transcripts table
CREATE TABLE IF NOT EXISTS public.call_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE CASCADE,
  transcript_content text NOT NULL,
  call_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE CASCADE,
  meeting_date date NOT NULL,
  meeting_time time,
  location text,
  is_virtual boolean DEFAULT false,
  meeting_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.employments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endorsers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all new tables
CREATE POLICY "Enable read access for authenticated users"
  ON public.employments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.employments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.employments FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON public.educations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.educations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.educations FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON public.engagement_team FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.engagement_team FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.engagement_team FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON public.recommendation_sources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.recommendation_sources FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.recommendation_sources FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON public.candidate_recommendations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.candidate_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.candidate_recommendations FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON public.candidate_emails FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.candidate_emails FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.candidate_emails FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON public.endorsers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.endorsers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.endorsers FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON public.detractors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.detractors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.detractors FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON public.call_transcripts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.call_transcripts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.call_transcripts FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON public.meetings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.meetings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.meetings FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_candidates_name ON public.candidates(name);
CREATE INDEX IF NOT EXISTS idx_candidates_location ON public.candidates(location);
CREATE INDEX IF NOT EXISTS idx_employments_candidate_id ON public.employments(candidate_id);
CREATE INDEX IF NOT EXISTS idx_educations_candidate_id ON public.educations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_engagement_team_engagement_id ON public.engagement_team(engagement_id);
CREATE INDEX IF NOT EXISTS idx_candidate_recommendations_candidate_id ON public.candidate_recommendations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_recommendations_source_id ON public.candidate_recommendations(source_id);
CREATE INDEX IF NOT EXISTS idx_candidate_emails_candidate_id ON public.candidate_emails(candidate_id);
CREATE INDEX IF NOT EXISTS idx_endorsers_candidate_id ON public.endorsers(candidate_id);
CREATE INDEX IF NOT EXISTS idx_detractors_candidate_id ON public.detractors(candidate_id);
CREATE INDEX IF NOT EXISTS idx_call_transcripts_candidate_id ON public.call_transcripts(candidate_id);
CREATE INDEX IF NOT EXISTS idx_meetings_candidate_id ON public.meetings(candidate_id);

-- Insert initial recommendation source
INSERT INTO public.recommendation_sources (source_name)
VALUES ('Heidrick')
ON CONFLICT (source_name) DO NOTHING;