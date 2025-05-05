-- Create the ceo_glassdoor_summary table if it doesn't exist
CREATE TABLE IF NOT EXISTS ceo_glassdoor_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employment_id uuid REFERENCES employments(id) ON DELETE CASCADE,
  total_reviews integer NOT NULL,
  average_rating numeric(3,1) NOT NULL,
  approval_percentage integer NOT NULL,
  recommend_percentage integer NOT NULL,
  positive_outlook_percentage integer NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rating_range CHECK (average_rating BETWEEN 1.0 AND 5.0),
  CONSTRAINT approval_range CHECK (approval_percentage BETWEEN 0 AND 100),
  CONSTRAINT recommend_range CHECK (recommend_percentage BETWEEN 0 AND 100),
  CONSTRAINT outlook_range CHECK (positive_outlook_percentage BETWEEN 0 AND 100),
  UNIQUE(employment_id)
);

-- Insert CEO Glassdoor summary data for Sumit Dhawan at Proofpoint
DO $$
DECLARE
  candidate_id uuid;
  employment_id uuid;
BEGIN
  -- Get Sumit Dhawan's candidate ID
  SELECT id INTO candidate_id FROM candidates WHERE name = 'Sumit Dhawan';
  
  -- Get Proofpoint employment ID
  SELECT id INTO employment_id FROM employments 
  WHERE candidate_id = candidate_id AND employer_name = 'Proofpoint';
  
  -- Check if we found the data
  IF candidate_id IS NULL OR employment_id IS NULL THEN
    RAISE NOTICE 'Could not find candidate or employment data for Sumit Dhawan at Proofpoint';
    RETURN;
  END IF;
  
  -- Insert CEO Glassdoor summary
  INSERT INTO ceo_glassdoor_summary (
    employment_id,
    total_reviews,
    average_rating,
    approval_percentage,
    recommend_percentage,
    positive_outlook_percentage
  ) VALUES (
    employment_id,
    1245,
    1.8,
    15,
    11,
    9
  )
  ON CONFLICT (employment_id) DO UPDATE
  SET 
    total_reviews = EXCLUDED.total_reviews,
    average_rating = EXCLUDED.average_rating,
    approval_percentage = EXCLUDED.approval_percentage,
    recommend_percentage = EXCLUDED.recommend_percentage,
    positive_outlook_percentage = EXCLUDED.positive_outlook_percentage,
    updated_at = CURRENT_TIMESTAMP;
  
  -- Also directly run query to print current data for debugging
  RAISE NOTICE 'CEO Glassdoor summary data for Sumit Dhawan:';
  RAISE NOTICE '%', (SELECT json_agg(t) FROM (
    SELECT * FROM ceo_glassdoor_summary WHERE employment_id = employment_id
  ) t);
END $$; 