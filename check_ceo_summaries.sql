-- Check if specific employment IDs exist in the ceo_glassdoor_summary table
SELECT EXISTS(SELECT 1 FROM ceo_glassdoor_summary WHERE employment_id = '1e327c70-f103-4d02-9c7c-94bd40ec10a2') AS emp1_exists,
       EXISTS(SELECT 1 FROM ceo_glassdoor_summary WHERE employment_id = 'c4ca03a4-329b-476e-9a5b-4c3fa3dbebac') AS emp2_exists,
       EXISTS(SELECT 1 FROM ceo_glassdoor_summary WHERE employment_id = '56517746-8bc5-49f6-a211-8b8da0aba26d') AS emp3_exists;

-- Check total count
SELECT COUNT(*) FROM ceo_glassdoor_summary;

-- Check all columns in the table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ceo_glassdoor_summary'
ORDER BY ordinal_position;

-- Check for any summaries that might exist
SELECT * FROM ceo_glassdoor_summary LIMIT 5;

-- Try direct insert for a specific employment ID
INSERT INTO ceo_glassdoor_summary (
  employment_id, 
  total_reviews, 
  average_rating, 
  approval_percentage, 
  recommend_percentage, 
  positive_outlook_percentage
) 
VALUES (
  '1e327c70-f103-4d02-9c7c-94bd40ec10a2',   -- First employment ID from the list
  458,                                       -- Random total reviews
  3.7,                                       -- Random rating
  67,                                        -- Random approval percentage
  71,                                        -- Random recommend percentage
  63                                         -- Random outlook percentage
)
ON CONFLICT (employment_id) DO NOTHING
RETURNING id;
