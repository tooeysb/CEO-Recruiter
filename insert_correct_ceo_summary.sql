-- Insert CEO Glassdoor summary with the correct employment ID
INSERT INTO ceo_glassdoor_summary (
  employment_id, 
  total_reviews, 
  average_rating, 
  approval_percentage, 
  recommend_percentage, 
  positive_outlook_percentage
) 
VALUES (
  '24ce215f-dbc1-4035-ac6e-89002093e58f',  -- Correct employment ID
  458,                                      -- Total reviews
  3.7,                                      -- Average rating (out of 5)
  67,                                       -- Approval percentage
  71,                                       -- Recommend percentage
  63                                        -- Positive outlook percentage
)
ON CONFLICT (employment_id) DO UPDATE SET
  total_reviews = EXCLUDED.total_reviews,
  average_rating = EXCLUDED.average_rating,
  approval_percentage = EXCLUDED.approval_percentage,
  recommend_percentage = EXCLUDED.recommend_percentage,
  positive_outlook_percentage = EXCLUDED.positive_outlook_percentage,
  updated_at = CURRENT_TIMESTAMP
RETURNING id;

-- Verify the insertion
SELECT * FROM ceo_glassdoor_summary 
WHERE employment_id = '24ce215f-dbc1-4035-ac6e-89002093e58f'; 