-- View all records in ceo_glassdoor_summary
SELECT * FROM ceo_glassdoor_summary;

-- Check which employment_id values match our candidates
SELECT 
  e.id AS employment_id,
  e.employer_name,
  e.candidate_id,
  c.name AS candidate_name
FROM 
  employments e
JOIN 
  candidates c ON e.candidate_id = c.id
WHERE 
  e.id IN (
    '1e327c70-f103-4d02-9c7c-94bd40ec10a2',
    'c4ca03a4-329b-476e-9a5b-4c3fa3dbebac',
    '56517746-8bc5-49f6-a211-8b8da0aba26d',
    '91cf830f-ede6-4eac-9501-1727b3294da4',
    '92538f78-17e5-493e-93bd-dc9aaeb470fc',
    'ae9e8f37-1ad8-4fa5-a52d-f97c379c1dd3',
    '743628cd-dc97-4b57-b8ee-66ce00bc21db'
  );

-- Direct insert for the specific employment ID
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
  '1e327c70-f103-4d02-9c7c-94bd40ec10a2', -- The employment ID for Sumit Dhawan at Proofpoint
  1245,
  1.8,
  15,
  11,
  9,
  NOW(),
  NOW()
)
ON CONFLICT (employment_id) DO UPDATE
SET 
  total_reviews = EXCLUDED.total_reviews,
  average_rating = EXCLUDED.average_rating,
  approval_percentage = EXCLUDED.approval_percentage,
  recommend_percentage = EXCLUDED.recommend_percentage,
  positive_outlook_percentage = EXCLUDED.positive_outlook_percentage,
  updated_at = NOW();

-- Confirm the insertion worked
SELECT * FROM ceo_glassdoor_summary; 