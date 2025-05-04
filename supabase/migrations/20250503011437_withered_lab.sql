/*
  # Initial data migration for candidates and related tables
  
  1. New Data
    - Candidates with basic information
    - Education records
    - Employment history
    - Recommendation source links
  
  2. Tables Modified
    - candidates
    - educations
    - employments
    - candidate_recommendations
*/

-- Insert candidates
INSERT INTO candidates (
    name, location, current_title, current_employer, employer_stock_symbol, 
    employer_revenue_usd, employer_industry, linkedin_url, notes,
    disqualified, hungry, humble, smart, previous_ceo_experience, 
    exec_staff, global_experience, global_experience_details
) VALUES
(
    'Ryan Aytay',
    'San Francisco, California',
    'President and Chief Executive Officer',
    'Tableau Software, Salesforce, Inc.',
    'CRM',
    34900000000,
    'Application Software',
    NULL,
    NULL,
    FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, NULL
),
(
    'Robert Bernshteyn',
    'San Mateo, California',
    'General Partner',
    'ICONIQ Capital Group, L.P.',
    NULL,
    NULL,
    'Investment Management',
    'https://www.linkedin.com/in/rbernshteyn/',
    'Rob Bernshteyn currently serves as General Partner at ICONIQ Capital. He most recently served as Chief Executive Officer of 525M revenue, a Thoma Bravo backed provider of business spend management SaaS software. Coupa was taken private in a transaction valued at $8B.',
    FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, NULL
),
(
    'Steven Blum',
    'Plano, Texas',
    'Executive Vice President and Chief Operating Officer',
    'Autodesk, Inc.',
    'ADSK',
    6100000000,
    'Application Software',
    NULL,
    'As Autodesk''s Chief Operating Officer, Steve oversees the teams responsible for sales, marketing, customer success, digital platforms, and customer support.',
    FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, 'Led worldwide field operations at Autodesk'
),
(
    'Anil Chakravarthy',
    'Saratoga, California',
    'Director',
    'Bessemer Venture Partners',
    NULL,
    NULL,
    'Venture Capital',
    NULL,
    NULL,
    FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, NULL
),
(
    'Sakee Feld',
    'Franklin Lakes, New Jersey',
    'Executive Vice President and President, Life Sciences',
    'Becton, Dickinson and Company',
    NULL,
    NULL,
    'Medical Devices',
    NULL,
    NULL,
    FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, NULL
),
(
    'Reid French',
    'Atlanta, Georgia',
    'Managing Director',
    'Essex Gate Ventures',
    NULL,
    NULL,
    'Venture Capital',
    NULL,
    NULL,
    FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, NULL
),
(
    'Paolo Guglielmini',
    'Heerbrugg, Switzerland',
    'Former President and Chief Executive Officer',
    'Hexagon AB',
    NULL,
    NULL,
    'Technology',
    NULL,
    NULL,
    FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, NULL
),
(
    'Sachin Gupta',
    'Seattle, Washington',
    'General Partner',
    'Unknown Firm',
    NULL,
    NULL,
    'Venture Capital',
    NULL,
    NULL,
    FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, NULL
),
(
    'Bill Patterson',
    'San Francisco, California',
    'Executive Vice President, Corporate Strategy',
    'Salesforce, Inc.',
    'CRM',
    34900000000,
    'Application Software',
    NULL,
    NULL,
    FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, NULL
),
(
    'Scott Reese',
    'Charlotte, North Carolina',
    'Chief Executive Officer',
    'Guidewire Software, Inc.',
    'GWRE',
    980500000,
    'Insurance Technology',
    NULL,
    NULL,
    FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, NULL
),
(
    'Michael Rosenbaum',
    'San Francisco, California',
    'Chief Executive Officer',
    'Guidewire Software, Inc.',
    'GWRE',
    980500000,
    'Insurance Technology',
    NULL,
    NULL,
    FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, NULL
),
(
    'Christopher Sullens',
    'New York, New York',
    'Chief Executive Officer',
    'Centralreach, Roper Technologies, Inc.',
    'ROP',
    7080000000,
    'Application Software',
    NULL,
    NULL,
    FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, NULL
),
(
    'Amy Zupon',
    'Denver, Colorado',
    'Chief Executive Officer',
    'Vertafore, Roper Technologies, Inc.',
    'ROP',
    7080000000,
    'Application Software',
    'https://www.linkedin.com/in/amy-zupon-3ba47a/',
    'Amy Zupon serves as Chief Executive Officer of Vertafore, a $590M leader in modern insurance technology.',
    FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, NULL
);

-- Insert education records
WITH education_data (name, degree, field_of_study, institution) AS (
    VALUES 
    ('Ryan Aytay', 'MBA', NULL, 'University of Minnesota'),
    ('Ryan Aytay', 'BA', 'Business Administration', 'Augsburg University'),
    ('Robert Bernshteyn', 'MBA', NULL, 'Harvard University'),
    ('Robert Bernshteyn', 'BS', 'Information Systems', 'State University of New York at Albany'),
    ('Steven Blum', 'BS', 'Electrical Engineering', 'University of Florida'),
    ('Michael Rosenbaum', 'MBA', NULL, 'University of California, Berkeley'),
    ('Michael Rosenbaum', 'BS', 'Systems Engineering', 'United States Naval Academy'),
    ('Christopher Sullens', 'MBA', NULL, 'The University of Chicago'),
    ('Christopher Sullens', 'BS', 'Mechanical Engineering', 'Virginia Polytechnic Institute and State University'),
    ('Amy Zupon', 'BA', 'Mathematics', 'Northwestern University')
)
INSERT INTO educations (candidate_id, degree, field_of_study, institution)
SELECT c.id, ed.degree, ed.field_of_study, ed.institution
FROM education_data ed
JOIN candidates c ON c.name = ed.name;

-- Insert employment records
WITH employment_data (name, employer_name, title, start_year, end_year, description) AS (
    VALUES 
    ('Ryan Aytay', 'Tableau Software, Salesforce, Inc.', 'President and Chief Executive Officer', 2023, NULL, NULL),
    ('Robert Bernshteyn', 'ICONIQ Capital Group, L.P.', 'General Partner', 2024, NULL, NULL),
    ('Robert Bernshteyn', 'Coupa Software Incorporated', 'Chairman and Chief Executive Officer', 2009, 2023, 'Acquired by Thoma Bravo, L.P. in 2023'),
    ('Steven Blum', 'Autodesk, Inc.', 'Executive Vice President and Chief Operating Officer', 2021, NULL, NULL),
    ('Anil Chakravarthy', 'Bessemer Venture Partners', 'Director', NULL, NULL, NULL),
    ('Sakee Feld', 'Becton, Dickinson and Company', 'Executive Vice President and President, Life Sciences', NULL, NULL, NULL),
    ('Reid French', 'Essex Gate Ventures', 'Managing Director', NULL, NULL, NULL),
    ('Paolo Guglielmini', 'Hexagon AB', 'President and Chief Executive Officer', NULL, NULL, NULL),
    ('Sachin Gupta', 'Unknown Firm', 'General Partner', NULL, NULL, NULL),
    ('Bill Patterson', 'Salesforce, Inc.', 'Executive Vice President, Corporate Strategy', NULL, NULL, NULL),
    ('Scott Reese', 'Guidewire Software, Inc.', 'Chief Executive Officer', NULL, NULL, NULL),
    ('Michael Rosenbaum', 'Guidewire Software, Inc.', 'Chief Executive Officer', 2019, NULL, NULL),
    ('Christopher Sullens', 'Roper Technologies, Inc.', 'Chief Executive Officer, Centralreach', NULL, NULL, NULL),
    ('Amy Zupon', 'Roper Technologies, Inc.', 'Chief Executive Officer, Vertafore', 2020, NULL, NULL)
)
INSERT INTO employments (candidate_id, employer_name, title, start_year, end_year, description)
SELECT c.id, ed.employer_name, ed.title, ed.start_year, ed.end_year, ed.description
FROM employment_data ed
JOIN candidates c ON c.name = ed.name;

-- Link candidates to recommendation source
INSERT INTO candidate_recommendations (candidate_id, source_id)
SELECT c.id, rs.id
FROM candidates c
CROSS JOIN recommendation_sources rs
WHERE c.name IN (
    'Ryan Aytay', 'Robert Bernshteyn', 'Steven Blum', 'Anil Chakravarthy',
    'Sakee Feld', 'Reid French', 'Paolo Guglielmini', 'Sachin Gupta',
    'Bill Patterson', 'Scott Reese', 'Michael Rosenbaum', 'Christopher Sullens',
    'Amy Zupon'
)
AND rs.source_name = 'Heidrick';