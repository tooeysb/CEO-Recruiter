/*
  # Add Glassdoor URL to employments table
  
  1. Changes
    - Add glassdoor_url column to employments table
*/

ALTER TABLE employments
ADD COLUMN IF NOT EXISTS glassdoor_url VARCHAR(255);