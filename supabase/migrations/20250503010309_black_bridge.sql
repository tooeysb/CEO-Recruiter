/*
  # Insert engagement data
  
  1. New Data
    - Insert engagement details for Procore Technologies
    - Insert engagement team members
    
  2. Security
    - Data will be accessible through existing RLS policies
*/

-- Insert engagement details
INSERT INTO engagement_details (client_company, report_title, report_date, confidentiality_notice)
VALUES (
  'Procore Technologies',
  'Engagement Status Report',
  '2025-04-29',
  'This report has been prepared exclusively for the client company named above. It is to be used for discussion purposes only. Executive details may not be verified and no contact should be made with any individuals without the consent of Heidrick & Struggles.'
);

-- Insert engagement team members
INSERT INTO engagement_team (engagement_id, name, role, email, mobile_phone)
SELECT 
  id as engagement_id,
  'Jeffrey Sanders' as name,
  'Consultant' as role,
  'jsanders@heidrick.com' as email,
  '+16502555561' as mobile_phone
FROM engagement_details
WHERE client_company = 'Procore Technologies';

INSERT INTO engagement_team (engagement_id, name, role, email, mobile_phone)
SELECT 
  id as engagement_id,
  'Julie Ann Maggio' as name,
  'Executive Assistant' as role,
  'jmaggio@heidrick.com' as email,
  '+14157060390' as mobile_phone
FROM engagement_details
WHERE client_company = 'Procore Technologies';

INSERT INTO engagement_team (engagement_id, name, role, email)
SELECT 
  id as engagement_id,
  'Noah Markowitz' as name,
  'Associate' as role,
  'nmarkowitz@heidrick.com' as email
FROM engagement_details
WHERE client_company = 'Procore Technologies';