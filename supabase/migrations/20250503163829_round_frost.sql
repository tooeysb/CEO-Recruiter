/*
  # Fix duplicate engagement team entries

  1. Changes
    - Remove duplicate entries from engagement_team table
    - Add unique constraint to prevent future duplicates
    - Keep most recent entry when duplicates exist

  2. Security
    - Existing RLS policies remain unchanged
*/

-- Create a temporary table to store unique records with most recent entries
CREATE TEMP TABLE temp_engagement_team AS
SELECT DISTINCT ON (engagement_id, name, role)
  id,
  engagement_id,
  name,
  role,
  email,
  mobile_phone,
  created_at,
  updated_at
FROM engagement_team
ORDER BY engagement_id, name, role, updated_at DESC;

-- Delete all records from the original table
TRUNCATE engagement_team;

-- Insert unique records back
INSERT INTO engagement_team
SELECT * FROM temp_engagement_team;

-- Drop the temporary table
DROP TABLE temp_engagement_team;

-- Add a unique constraint to prevent future duplicates
ALTER TABLE engagement_team
ADD CONSTRAINT unique_engagement_team_member
UNIQUE (engagement_id, name, role);