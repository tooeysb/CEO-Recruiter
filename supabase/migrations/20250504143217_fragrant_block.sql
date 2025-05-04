/*
  # Add Glassdoor URL to candidates table
  
  1. Changes
    - Add glassdoor_url column to candidates table
*/

ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS glassdoor_url VARCHAR(255);