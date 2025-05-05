-- Check the existing CEO Glassdoor Summary data
SELECT 
  cgs.*,
  e.candidate_id,
  e.employer_name,
  c.name as candidate_name
FROM 
  ceo_glassdoor_summary cgs
JOIN 
  employments e ON cgs.employment_id = e.id
JOIN
  candidates c ON e.candidate_id = c.id;

-- Check specific employment record for Sumit Dhawan
SELECT 
  e.id as employment_id,
  e.candidate_id,
  e.employer_name,
  c.name as candidate_name
FROM 
  employments e
JOIN
  candidates c ON e.candidate_id = c.id
WHERE 
  c.name = 'Sumit Dhawan' 
  OR c.id = '24ce215f-dbc1-4035-ac6e-89002093e58f';

-- Count all CEO Glassdoor Summary records
SELECT COUNT(*) FROM ceo_glassdoor_summary; 