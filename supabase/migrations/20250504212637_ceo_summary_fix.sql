-- Insert CEO Glassdoor summary data for the specific employment ID
INSERT INTO ceo_glassdoor_summary (
  employment_id,
  total_reviews,
  average_rating,
  approval_percentage,
  recommend_percentage,
  positive_outlook_percentage
) VALUES (
  '1e327c70-f103-4d02-9c7c-94bd40ec10a2', -- This is the first employment ID from the debug output
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