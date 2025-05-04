/*
  # Create database schema and insert sample data
  
  1. Tables Created:
    - candidates
    - employments 
    - educations
    - engagement_details
    - engagement_team
    - candidate_notes
    - recommendation_sources
    - candidate_recommendations
    - candidate_emails
    - endorsers
    - detractors
    - call_transcripts
    - meetings

  2. Data Inserted:
    - Sample candidates with profiles
    - Education and employment history
    - Recommendation sources and links
*/

-- Create tables
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    current_title VARCHAR(255),
    current_employer VARCHAR(255),
    employer_stock_symbol VARCHAR(20),
    employer_revenue_usd BIGINT,
    employer_industry VARCHAR(255),
    linkedin_url VARCHAR(255),
    x_com_url VARCHAR(255),
    notes TEXT,
    update_status VARCHAR(255) DEFAULT 'Calibration profile',
    disqualified BOOLEAN DEFAULT FALSE,
    dq_reason TEXT,
    hungry BOOLEAN DEFAULT FALSE,
    hungry_examples TEXT,
    humble BOOLEAN DEFAULT FALSE,
    humble_examples TEXT,
    smart BOOLEAN DEFAULT FALSE,
    smart_examples TEXT,
    previous_ceo_experience BOOLEAN DEFAULT FALSE,
    exec_staff BOOLEAN DEFAULT FALSE,
    global_experience BOOLEAN DEFAULT FALSE,
    global_experience_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    employer_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_year INTEGER,
    end_year INTEGER,
    description TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    degree VARCHAR(255),
    field_of_study VARCHAR(255),
    institution VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendation_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidate_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    source_id UUID REFERENCES recommendation_sources(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert recommendation source
INSERT INTO recommendation_sources (source_name)
VALUES ('Heidrick');

-- Insert candidates
INSERT INTO candidates (
    name,
    location,
    current_title,
    current_employer,
    employer_stock_symbol,
    employer_revenue_usd,
    employer_industry,
    linkedin_url,
    update_status,
    notes,
    hungry,
    humble,
    smart,
    previous_ceo_experience,
    exec_staff,
    global_experience,
    global_experience_details
) VALUES
(
    'David Wadhwani',
    'San Francisco, California',
    'President, Digital Media Business',
    'Adobe Inc.',
    'ADBE',
    21500000000,
    'Application Software',
    'https://www.linkedin.com/in/davidwadhwani/',
    'Sourced',
    'David Wadhwani is responsible for the success of Adobe''s global Digital Media business across Adobe, including all product management, product marketing, engineering, strategic partnerships, customer support and go-to-market across geographies.',
    false,
    false,
    false,
    true,
    true,
    true,
    'Led Adobe''s global Digital Media business'
),
(
    'Adam Selipsky',
    'Seattle, Washington',
    'Former Chief Executive Officer, Amazon Web Services',
    'Amazon.com, Inc.',
    'AMZN',
    638080000000,
    'Retail and eCommerce',
    NULL,
    'Contacted',
    NULL,
    false,
    false,
    false,
    true,
    false,
    true,
    'Led Amazon Web Services globally'
),
(
    'Robert D. Thomas',
    'New Canaan, Connecticut',
    'Senior Vice President, Software and Chief Commercial Officer',
    'International Business Machines Corporation',
    'IBM',
    62880000000,
    'IT Consulting and Other Services',
    'https://www.linkedin.com/in/robertdthomas/',
    'Interview',
    'Rob Thomas is Senior Vice President Software and Chief Commercial Officer, IBM. He leads IBM''s software business, including product management and design, product development and business development. In addition, Rob has global responsibility for IBM revenue and profit, including worldwide sales, strategic partnerships and ecosystem.',
    false,
    false,
    false,
    false,
    true,
    true,
    'Led global markets and software at IBM'
);

-- Insert education records for new candidates
INSERT INTO educations (candidate_id, degree, field_of_study, institution)
SELECT 
    id as candidate_id,
    'BS' as degree,
    'Computer Science' as field_of_study,
    'Brown University' as institution
FROM candidates
WHERE name = 'David Wadhwani';

INSERT INTO educations (candidate_id, degree, field_of_study, institution)
SELECT 
    id as candidate_id,
    'AB' as degree,
    'Government' as field_of_study,
    'Harvard University' as institution
FROM candidates
WHERE name = 'Adam Selipsky'
UNION
SELECT 
    id as candidate_id,
    'MBA' as degree,
    NULL as field_of_study,
    'Harvard University' as institution
FROM candidates
WHERE name = 'Adam Selipsky';

INSERT INTO educations (candidate_id, degree, field_of_study, institution)
SELECT 
    id as candidate_id,
    'MBA' as degree,
    NULL as field_of_study,
    'University of Florida' as institution
FROM candidates
WHERE name = 'Robert D. Thomas'
UNION
SELECT 
    id as candidate_id,
    'BA' as degree,
    'Economics' as field_of_study,
    'Vanderbilt University' as institution
FROM candidates
WHERE name = 'Robert D. Thomas';

-- Insert employment records for new candidates
INSERT INTO employments (candidate_id, employer_name, title, start_year, end_year, description)
SELECT 
    c.id as candidate_id,
    'Adobe Inc.' as employer_name,
    'President, Digital Media Business' as title,
    2021 as start_year,
    NULL as end_year,
    NULL as description
FROM candidates c
WHERE c.name = 'David Wadhwani';

INSERT INTO employments (candidate_id, employer_name, title, start_year, end_year, description)
SELECT 
    c.id as candidate_id,
    'Adobe Inc.' as employer_name,
    'Executive Vice President and Chief Business Officer, Digital Media' as title,
    2021 as start_year,
    2021 as end_year,
    NULL as description
FROM candidates c
WHERE c.name = 'David Wadhwani';

INSERT INTO employments (candidate_id, employer_name, title, start_year, end_year, description)
SELECT 
    c.id as candidate_id,
    'International Business Machines Corporation' as employer_name,
    'Senior Vice President, Software and Chief Commercial Officer' as title,
    2023 as start_year,
    NULL as end_year,
    NULL as description
FROM candidates c
WHERE c.name = 'Robert D. Thomas';

INSERT INTO employments (candidate_id, employer_name, title, start_year, end_year, description)
SELECT 
    c.id as candidate_id,
    'International Business Machines Corporation' as employer_name,
    'Senior Vice President, Global Markets' as title,
    2021 as start_year,
    2023 as end_year,
    NULL as description
FROM candidates c
WHERE c.name = 'Robert D. Thomas';

-- Link new candidates to recommendation source
INSERT INTO candidate_recommendations (candidate_id, source_id)
SELECT 
    c.id as candidate_id,
    rs.id as source_id
FROM candidates c
CROSS JOIN recommendation_sources rs
WHERE c.name IN ('David Wadhwani', 'Adam Selipsky', 'Robert D. Thomas')
AND rs.source_name = 'Heidrick';