/*
  # Create engagement tables

  1. New Tables
    - `engagement_details`
      - `id` (uuid, primary key)
      - `client_company` (text)
      - `report_title` (text)
      - `report_date` (timestamp with time zone)
      - `confidentiality_notice` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
    
    - `engagement_team`
      - `id` (uuid, primary key)
      - `engagement_id` (uuid, foreign key to engagement_details)
      - `name` (text)
      - `role` (text)
      - `email` (text)
      - `mobile_phone` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read data
*/

-- Create engagement_details table
CREATE TABLE IF NOT EXISTS engagement_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_company text NOT NULL,
  report_title text NOT NULL,
  report_date timestamptz NOT NULL,
  confidentiality_notice text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create engagement_team table
CREATE TABLE IF NOT EXISTS engagement_team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES engagement_details(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL,
  email text,
  mobile_phone text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE engagement_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_team ENABLE ROW LEVEL SECURITY;

-- Create policies for engagement_details
CREATE POLICY "Allow authenticated users to read engagement details"
  ON engagement_details
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for engagement_team
CREATE POLICY "Allow authenticated users to read engagement team"
  ON engagement_team
  FOR SELECT
  TO authenticated
  USING (true);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_engagement_details_updated_at
  BEFORE UPDATE ON engagement_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_engagement_team_updated_at
  BEFORE UPDATE ON engagement_team
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();