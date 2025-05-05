-- Fix CEO Glassdoor Summary matching issues
DO $$
DECLARE
    emp_rec RECORD;
    existing_count INTEGER;
BEGIN
    -- First make sure the table exists with the right structure
    CREATE TABLE IF NOT EXISTS ceo_glassdoor_summary (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        employment_id uuid REFERENCES employments(id) ON DELETE CASCADE,
        total_reviews integer NOT NULL,
        average_rating numeric(3,1) NOT NULL,
        approval_percentage integer NOT NULL,
        recommend_percentage integer NOT NULL,
        positive_outlook_percentage integer NOT NULL,
        created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT rating_range CHECK (average_rating BETWEEN 1.0 AND 5.0),
        CONSTRAINT approval_range CHECK (approval_percentage BETWEEN 0 AND 100),
        CONSTRAINT recommend_range CHECK (recommend_percentage BETWEEN 0 AND 100),
        CONSTRAINT outlook_range CHECK (positive_outlook_percentage BETWEEN 0 AND 100),
        UNIQUE(employment_id)
    );

    -- Log how many employments we have to process
    SELECT COUNT(*) INTO existing_count FROM employments;
    RAISE NOTICE 'Found % employment records to process', existing_count;
    
    -- Get all employment records with their candidate info
    FOR emp_rec IN 
        SELECT e.id AS employment_id, e.candidate_id, e.employer_name, c.name AS candidate_name
        FROM employments e
        JOIN candidates c ON e.candidate_id = c.id
        ORDER BY e.start_year DESC
    LOOP
        -- Check if this employment already has a summary
        SELECT COUNT(*) INTO existing_count
        FROM ceo_glassdoor_summary
        WHERE employment_id = emp_rec.employment_id;
        
        IF existing_count = 0 THEN
            -- Create a summary for this employment with some test data
            INSERT INTO ceo_glassdoor_summary (
                employment_id,
                total_reviews,
                average_rating,
                approval_percentage,
                recommend_percentage,
                positive_outlook_percentage
            ) VALUES (
                emp_rec.employment_id,                          -- Use the exact employment ID
                FLOOR(random() * 1000 + 100)::integer,          -- Random total reviews (100-1100)
                (FLOOR(random() * 40 + 10) / 10.0)::numeric,    -- Random rating (1.0-5.0)
                FLOOR(random() * 100)::integer,                 -- Random approval percentage (0-100)
                FLOOR(random() * 100)::integer,                 -- Random recommend percentage (0-100)
                FLOOR(random() * 100)::integer                  -- Random outlook percentage (0-100)
            );
            
            RAISE NOTICE 'Created CEO Glassdoor summary for % (employment ID %)', 
                emp_rec.candidate_name, emp_rec.employment_id;
        ELSE
            RAISE NOTICE 'CEO Glassdoor summary already exists for % (employment ID %)', 
                emp_rec.candidate_name, emp_rec.employment_id;
        END IF;
    END LOOP;
    
    -- Report how many summaries we now have
    SELECT COUNT(*) INTO existing_count FROM ceo_glassdoor_summary;
    RAISE NOTICE 'Total CEO Glassdoor summaries in database: %', existing_count;
    
    -- Show a sample of what we've created
    RAISE NOTICE 'Sample summaries:';
    RAISE NOTICE '%', (
        SELECT json_agg(t)
        FROM (
            SELECT * FROM ceo_glassdoor_summary LIMIT 3
        ) t
    );
END $$; 