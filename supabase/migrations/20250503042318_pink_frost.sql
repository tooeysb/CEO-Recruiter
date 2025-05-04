/*
  # Remove duplicate engagement team entries
  
  1. Changes
    - Remove duplicate entries from engagement_team table
    - Keep only one record per team member
*/

-- Create a temporary table to store unique records
CREATE TEMP TABLE temp_engagement_team AS
SELECT DISTINCT ON (engagement_id, name, role) *
FROM engagement_team;

-- Delete all records from the original table
DELETE FROM engagement_team;

-- Insert unique records back
INSERT INTO engagement_team
SELECT * FROM temp_engagement_team;

-- Drop the temporary table
DROP TABLE temp_engagement_team;