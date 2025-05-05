-- This is a very direct insert statement with no variable substitution
-- that will help us debug the CEO Glassdoor summary issue

-- Direct insert for the specific employment ID - hardcoded
INSERT INTO ceo_glassdoor_summary (
  id,
  employment_id,
  total_reviews,
  average_rating,
  approval_percentage,
  recommend_percentage,
  positive_outlook_percentage
) VALUES (
  '95d5b5d9-6b4a-4b4c-8b5a-5b5d9d5b5d9d', -- Hardcoded UUID
  '1e327c70-f103-4d02-9c7c-94bd40ec10a2', -- The first employment ID from our list
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
  positive_outlook_percentage = EXCLUDED.positive_outlook_percentage;

-- Show all records in the table
SELECT * FROM ceo_glassdoor_summary; 