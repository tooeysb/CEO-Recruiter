-- Find candidate_id for Sumit Dhawan
SELECT id AS candidate_id, name, current_employer
FROM candidates
WHERE name LIKE '%Sumit Dhawan%';

-- Find employment_id for Proofpoint
SELECT e.id AS employment_id, e.employer_name, c.name AS candidate_name
FROM employments e
JOIN candidates c ON e.candidate_id = c.id
WHERE e.employer_name LIKE '%Proofpoint%';

-- If we know Sumit Dhawan worked at Proofpoint, find that specific record
SELECT 
  c.id AS candidate_id, 
  c.name AS candidate_name,
  e.id AS employment_id,
  e.employer_name,
  e.title
FROM 
  candidates c
JOIN 
  employments e ON c.id = e.candidate_id
WHERE 
  c.name LIKE '%Sumit Dhawan%' 
  AND e.employer_name LIKE '%Proofpoint%'; 