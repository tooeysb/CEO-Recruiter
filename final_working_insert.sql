-- Direct SQL insert for the EXACT IDs mentioned in debug output
-- Candidate ID: 24ce215f-dbc1-4035-ac6e-89002093e58f
-- Employment ID: 1e327c70-f103-4d02-9c7c-94bd40ec10a2

-- First delete any existing records for this employment ID to avoid conflicts
DELETE FROM ceo_glassdoor_summary
WHERE employment_id = '1e327c70-f103-4d02-9c7c-94bd40ec10a2';

-- Now insert with all fields matching the expected schema
INSERT INTO ceo_glassdoor_summary (
  employment_id,
  overall_rating,
  total_reviews,
  recommendation_rate,
  ceo_name,
  ceo_approval_rate,
  business_outlook_positive,
  culture_and_values,
  diversity_equity_inclusion,
  work_life_balance,
  senior_management,
  compensation_and_benefits,
  career_opportunities,
  five_star_percentage,
  four_star_percentage,
  three_star_percentage,
  two_star_percentage,
  one_star_percentage
) 
VALUES (
  '1e327c70-f103-4d02-9c7c-94bd40ec10a2',  -- EXACT Employment ID from debug output
  3.7,                                      -- Overall rating
  31,                                       -- Total reviews
  60,                                       -- Recommendation rate
  'Sumit Dhawan',                           -- CEO name
  57,                                       -- CEO approval rate
  75,                                       -- Business outlook positive
  3.5,                                      -- Culture & values
  4.3,                                      -- Diversity, Equity & Inclusion
  4.0,                                      -- Work/Life balance
  3.2,                                      -- Senior management
  4.1,                                      -- Compensation and benefits
  3.1,                                      -- Career opportunities
  53,                                       -- 5 stars percentage (sums to 100%)
  32,                                       -- 4 stars percentage
  6,                                        -- 3 stars percentage
  6,                                        -- 2 stars percentage
  3                                         -- 1 star percentage
); 