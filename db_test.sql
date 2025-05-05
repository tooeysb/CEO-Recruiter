-- Comprehensive database test for CEO Glassdoor Summary

-- 1. Check table definition
\d ceo_glassdoor_summary

-- 2. Count records
SELECT COUNT(*) FROM ceo_glassdoor_summary;

-- 3. View all existing records
SELECT * FROM ceo_glassdoor_summary;

-- 4. Check employments for our candidate
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
  c.id = '24ce215f-dbc1-4035-ac6e-89002093e58f';

-- 5. Check if any summaries exist for these employments
SELECT 
  cgs.*, 
  e.employer_name 
FROM 
  ceo_glassdoor_summary cgs
JOIN 
  employments e ON cgs.employment_id = e.id
WHERE 
  e.candidate_id = '24ce215f-dbc1-4035-ac6e-89002093e58f';

-- 6. Delete any incorrect/conflicting entries (optional, uncomment if needed)
-- DELETE FROM ceo_glassdoor_summary WHERE employment_id IN (
--   SELECT id FROM employments WHERE candidate_id = '24ce215f-dbc1-4035-ac6e-89002093e58f'
-- );

-- 7. Insert a record for the first employment
INSERT INTO ceo_glassdoor_summary (
  id,
  employment_id,
  total_reviews,
  average_rating,
  approval_percentage,
  recommend_percentage,
  positive_outlook_percentage
) VALUES (
  gen_random_uuid(),
  '1e327c70-f103-4d02-9c7c-94bd40ec10a2',  -- First employment ID
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

-- 8. Verify record was inserted correctly
SELECT 
  cgs.*, 
  e.employer_name, 
  c.name AS candidate_name 
FROM 
  ceo_glassdoor_summary cgs
JOIN 
  employments e ON cgs.employment_id = e.id
JOIN 
  candidates c ON e.candidate_id = c.id
WHERE 
  e.id = '1e327c70-f103-4d02-9c7c-94bd40ec10a2';

-- 9. Enable Row Level Security if needed
ALTER TABLE ceo_glassdoor_summary ENABLE ROW LEVEL SECURITY;

-- 10. Create or replace policies for authenticated users
CREATE POLICY IF NOT EXISTS "Allow authenticated read" 
  ON ceo_glassdoor_summary 
  FOR SELECT 
  TO authenticated 
  USING (true);
  
-- 11. Refresh materialized views if any exist
-- REFRESH MATERIALIZED VIEW my_view_name;

-- 12. Final verification check  
SELECT 
  cgs.*, 
  e.employer_name 
FROM 
  ceo_glassdoor_summary cgs
JOIN 
  employments e ON cgs.employment_id = e.id
WHERE 
  e.candidate_id = '24ce215f-dbc1-4035-ac6e-89002093e58f'; 