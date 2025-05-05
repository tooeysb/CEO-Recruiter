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
    id,
    employment_id,
    total_reviews,
    average_rating,
    approval_percentage,
    recommend_percentage,
    positive_outlook_percentage,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    employment_id,
    1245,
    1.8,
    15,
    11,
    9,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
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