/*
  # Add CEO Glassdoor Summary table
  
  1. New Table
    - `ceo_glassdoor_summary`
      - Summary statistics for CEO reviews from Glassdoor
      - Linked to employment records
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS ceo_glassdoor_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employment_id uuid REFERENCES employments(id) ON DELETE CASCADE,
  total_reviews integer NOT NULL DEFAULT 0,
  average_rating numeric(3,2) NOT NULL,
  approval_percentage integer NOT NULL,
  recommend_percentage integer NOT NULL,
  positive_outlook_percentage integer NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rating_range CHECK (average_rating BETWEEN 1.00 AND 5.00),
  CONSTRAINT percentage_range CHECK (
    approval_percentage BETWEEN 0 AND 100 AND
    recommend_percentage BETWEEN 0 AND 100 AND
    positive_outlook_percentage BETWEEN 0 AND 100
  )
);

-- Enable RLS
ALTER TABLE ceo_glassdoor_summary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users"
  ON ceo_glassdoor_summary
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_ceo_glassdoor_summary_employment_id 
  ON ceo_glassdoor_summary(employment_id);