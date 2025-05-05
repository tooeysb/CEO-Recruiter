-- First, check if records already exist for any of these employment IDs and delete them
DO $$
DECLARE
  employment_id_to_use uuid := '1e327c70-f103-4d02-9c7c-94bd40ec10a2'; -- Use the first employment ID from the list
  existing_count integer;
BEGIN
  -- Check if there's already a record with this employment ID
  SELECT COUNT(*) INTO existing_count
  FROM ceo_glassdoor_summary
  WHERE employment_id = employment_id_to_use;
  
  -- If exists, delete it first
  IF existing_count > 0 THEN
    DELETE FROM ceo_glassdoor_summary
    WHERE employment_id = employment_id_to_use;
  END IF;
END $$;

-- Now insert the new record with the correct employment ID from the debug info
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
  '1e327c70-f103-4d02-9c7c-94bd40ec10a2',  -- First employment ID from the debug info
  3.7,                                      -- Overall rating (from screenshot)
  31,                                       -- Total reviews (from screenshot)
  60,                                       -- Recommendation rate (from screenshot)
  'Sumit Dhawan',                           -- CEO name (from screenshot)
  57,                                       -- CEO approval rate (from screenshot)
  75,                                       -- Business outlook positive (from screenshot)
  3.5,                                      -- Culture & values (from screenshot)
  4.3,                                      -- Diversity, Equity & Inclusion (from screenshot)
  4.0,                                      -- Work/Life balance (from screenshot)
  3.2,                                      -- Senior management (from screenshot)
  4.1,                                      -- Compensation and benefits (from screenshot)
  3.1,                                      -- Career opportunities (from screenshot)
  53,                                       -- 5 stars percentage (adjusted to sum to 100%)
  32,                                       -- 4 stars percentage (from screenshot)
  6,                                        -- 3 stars percentage (from screenshot)
  6,                                        -- 2 stars percentage (from screenshot)
  3                                         -- 1 star percentage (from screenshot)
); 