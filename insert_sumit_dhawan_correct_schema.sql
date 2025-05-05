-- Insert CEO Glassdoor summary for Sumit Dhawan with correct schema and scraped data
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
  'd333fa14-d7fd-43ef-9851-18cf7e0b9a3a',  -- Employment ID
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
  52,                                       -- 5 stars percentage (from screenshot)
  32,                                       -- 4 stars percentage (from screenshot)
  6,                                        -- 3 stars percentage (from screenshot)
  6,                                        -- 2 stars percentage (from screenshot)
  3                                         -- 1 star percentage (from screenshot)
)
ON CONFLICT (employment_id) DO UPDATE SET
  overall_rating = EXCLUDED.overall_rating,
  total_reviews = EXCLUDED.total_reviews,
  recommendation_rate = EXCLUDED.recommendation_rate,
  ceo_name = EXCLUDED.ceo_name,
  ceo_approval_rate = EXCLUDED.ceo_approval_rate,
  business_outlook_positive = EXCLUDED.business_outlook_positive,
  culture_and_values = EXCLUDED.culture_and_values,
  diversity_equity_inclusion = EXCLUDED.diversity_equity_inclusion,
  work_life_balance = EXCLUDED.work_life_balance,
  senior_management = EXCLUDED.senior_management,
  compensation_and_benefits = EXCLUDED.compensation_and_benefits,
  career_opportunities = EXCLUDED.career_opportunities,
  five_star_percentage = EXCLUDED.five_star_percentage,
  four_star_percentage = EXCLUDED.four_star_percentage,
  three_star_percentage = EXCLUDED.three_star_percentage,
  two_star_percentage = EXCLUDED.two_star_percentage,
  one_star_percentage = EXCLUDED.one_star_percentage,
  updated_at = CURRENT_TIMESTAMP
RETURNING summary_id; 