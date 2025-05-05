-- Create function to check and log glassdoor reviews data
CREATE OR REPLACE FUNCTION check_glassdoor_data() 
RETURNS TABLE (
  id uuid,
  employment_id uuid,
  candidate_id uuid,
  rating numeric,
  review_date date,
  review_title text,
  pros text,
  cons text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id,
    g.employment_id,
    g.candidate_id,
    g.rating,
    g.review_date,
    g.review_title,
    g.pros,
    g.cons
  FROM 
    glassdoor_reviews g
  LIMIT 10;
END;
$$;

-- Create a function to get reviews by candidate
CREATE OR REPLACE FUNCTION get_glassdoor_reviews_for_candidate(candidate_uuid uuid)
RETURNS SETOF glassdoor_reviews
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM glassdoor_reviews 
  WHERE candidate_id = candidate_uuid
  OR employment_id IN (
    SELECT id FROM employments WHERE candidate_id = candidate_uuid
  )
  ORDER BY review_date DESC;
$$; 