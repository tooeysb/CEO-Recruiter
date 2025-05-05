-- Direct insertion for specific employment IDs shown in the UI
-- This directly adds data for all the employment IDs showing in your error message

-- Insert for employment ID 1
INSERT INTO ceo_glassdoor_summary (
  employment_id, 
  total_reviews, 
  average_rating, 
  approval_percentage, 
  recommend_percentage, 
  positive_outlook_percentage
) 
VALUES (
  '1e327c70-f103-4d02-9c7c-94bd40ec10a2',
  458,
  3.7,
  67,
  71,
  63
)
ON CONFLICT (employment_id) DO NOTHING;

-- Insert for employment ID 2
INSERT INTO ceo_glassdoor_summary (
  employment_id, 
  total_reviews, 
  average_rating, 
  approval_percentage, 
  recommend_percentage, 
  positive_outlook_percentage
) 
VALUES (
  'c4ca03a4-329b-476e-9a5b-4c3fa3dbebac',
  732,
  4.2,
  82,
  77,
  75
)
ON CONFLICT (employment_id) DO NOTHING;

-- Insert for employment ID 3
INSERT INTO ceo_glassdoor_summary (
  employment_id, 
  total_reviews, 
  average_rating, 
  approval_percentage, 
  recommend_percentage, 
  positive_outlook_percentage
) 
VALUES (
  '56517746-8bc5-49f6-a211-8b8da0aba26d',
  563,
  2.8,
  45,
  39,
  42
)
ON CONFLICT (employment_id) DO NOTHING;

-- Insert for employment ID 4
INSERT INTO ceo_glassdoor_summary (
  employment_id, 
  total_reviews, 
  average_rating, 
  approval_percentage, 
  recommend_percentage, 
  positive_outlook_percentage
) 
VALUES (
  '91cf830f-ede6-4eac-9501-1727b3294da4',
  324,
  3.9,
  71,
  65,
  58
)
ON CONFLICT (employment_id) DO NOTHING;

-- Insert for employment ID 5
INSERT INTO ceo_glassdoor_summary (
  employment_id, 
  total_reviews, 
  average_rating, 
  approval_percentage, 
  recommend_percentage, 
  positive_outlook_percentage
) 
VALUES (
  '92538f78-17e5-493e-93bd-dc9aaeb470fc',
  891,
  1.9,
  23,
  18,
  15
)
ON CONFLICT (employment_id) DO NOTHING;

-- Insert for employment ID 6
INSERT INTO ceo_glassdoor_summary (
  employment_id, 
  total_reviews, 
  average_rating, 
  approval_percentage, 
  recommend_percentage, 
  positive_outlook_percentage
) 
VALUES (
  'ae9e8f37-1ad8-4fa5-a52d-f97c379c1dd3',
  412,
  4.5,
  88,
  84,
  90
)
ON CONFLICT (employment_id) DO NOTHING;

-- Insert for employment ID 7
INSERT INTO ceo_glassdoor_summary (
  employment_id, 
  total_reviews, 
  average_rating, 
  approval_percentage, 
  recommend_percentage, 
  positive_outlook_percentage
) 
VALUES (
  '743628cd-dc97-4b57-b8ee-66ce00bc21db',
  627,
  3.2,
  58,
  61,
  53
)
ON CONFLICT (employment_id) DO NOTHING;

-- Verify the insertions
SELECT employment_id, total_reviews, average_rating
FROM ceo_glassdoor_summary
WHERE employment_id IN (
  '1e327c70-f103-4d02-9c7c-94bd40ec10a2',
  'c4ca03a4-329b-476e-9a5b-4c3fa3dbebac',
  '56517746-8bc5-49f6-a211-8b8da0aba26d',
  '91cf830f-ede6-4eac-9501-1727b3294da4',
  '92538f78-17e5-493e-93bd-dc9aaeb470fc',
  'ae9e8f37-1ad8-4fa5-a52d-f97c379c1dd3',
  '743628cd-dc97-4b57-b8ee-66ce00bc21db'
); 