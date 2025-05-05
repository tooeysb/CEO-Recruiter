-- Direct SQL script to add CEO Glassdoor summary for Sumit Dhawan
DO $$
DECLARE
  target_candidate_id uuid := '24ce215f-dbc1-4035-ac6e-89002093e58f'; -- This is the specific candidate ID
  target_employment_id uuid;
  existing_data_count integer;
BEGIN
  -- First, check if the table exists, create it if not
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

  -- Get employment ID for this candidate
  SELECT id INTO target_employment_id 
  FROM employments 
  WHERE candidate_id = target_candidate_id
  ORDER BY start_year DESC
  LIMIT 1;
  
  -- If no employment ID is found, raise an error
  IF target_employment_id IS NULL THEN
    RAISE EXCEPTION 'No employment record found for candidate ID: %', target_candidate_id;
  END IF;
  
  -- Check if we already have data for this employment
  SELECT COUNT(*) INTO existing_data_count
  FROM ceo_glassdoor_summary
  WHERE employment_id = target_employment_id;
  
  RAISE NOTICE 'Found employment ID % for candidate ID %', target_employment_id, target_candidate_id;
  RAISE NOTICE 'Existing data count: %', existing_data_count;
  
  -- Insert or update the data
  INSERT INTO ceo_glassdoor_summary (
    employment_id,
    total_reviews,
    average_rating,
    approval_percentage,
    recommend_percentage,
    positive_outlook_percentage
  ) VALUES (
    target_employment_id,
    1245,
    1.8,
    15,
    11,
    9
  )
  ON CONFLICT (employment_id) 
  DO UPDATE SET 
    total_reviews = EXCLUDED.total_reviews,
    average_rating = EXCLUDED.average_rating,
    approval_percentage = EXCLUDED.approval_percentage,
    recommend_percentage = EXCLUDED.recommend_percentage,
    positive_outlook_percentage = EXCLUDED.positive_outlook_percentage,
    updated_at = CURRENT_TIMESTAMP;
    
  -- Verify the data was inserted/updated
  RAISE NOTICE 'CEO Glassdoor summary data after insert/update:';
  RAISE NOTICE '%', (
    SELECT row_to_json(t)
    FROM (
      SELECT * FROM ceo_glassdoor_summary WHERE employment_id = target_employment_id
    ) t
  );
END $$; 