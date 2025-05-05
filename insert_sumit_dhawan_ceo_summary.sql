-- Insert CEO Glassdoor summary specifically for Sumit Dhawan at Proofpoint
INSERT INTO ceo_glassdoor_summary (
  employment_id, 
  total_reviews, 
  average_rating, 
  approval_percentage, 
  recommend_percentage, 
  positive_outlook_percentage
) 
VALUES (
  '1e327c70-f103-4d02-9c7c-94bd40ec10a2',  -- Sumit Dhawan's Proofpoint employment ID
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
WHERE employment_id = '1e327c70-f103-4d02-9c7c-94bd40ec10a2'; 