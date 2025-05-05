/*
  # Add Glassdoor Reviews table
  
  1. New Table
    - `glassdoor_reviews`
      - Individual employee reviews from Glassdoor
      - Linked to employment records and candidates
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS glassdoor_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employment_id uuid REFERENCES employments(id) ON DELETE CASCADE,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  rating numeric(3,1) NOT NULL,
  review_date date NOT NULL,
  review_title text NOT NULL,
  pros text,
  cons text,
  role text,
  location text,
  helpful_count integer DEFAULT 0,
  review_link text NOT NULL,
  employment_status text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rating_range CHECK (rating BETWEEN 1.0 AND 5.0)
);

-- Enable RLS
ALTER TABLE glassdoor_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users"
  ON glassdoor_reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_glassdoor_reviews_employment_id 
  ON glassdoor_reviews(employment_id);

CREATE INDEX idx_glassdoor_reviews_candidate_id 
  ON glassdoor_reviews(candidate_id);

CREATE INDEX idx_glassdoor_reviews_review_date 
  ON glassdoor_reviews(review_date);

-- Insert Glassdoor reviews for Sumit Dhawan at Proofpoint
DO $$
DECLARE
  candidate_id uuid;
  employment_id uuid;
BEGIN
  -- Get Sumit Dhawan's candidate ID
  SELECT id INTO candidate_id FROM candidates WHERE name = 'Sumit Dhawan';
  
  -- Get Proofpoint employment ID
  SELECT id INTO employment_id FROM employments 
  WHERE candidate_id = candidate_id AND employer_name = 'Proofpoint';
  
  -- Insert reviews
  INSERT INTO glassdoor_reviews (
    employment_id,
    candidate_id,
    rating,
    review_date,
    review_title,
    pros,
    cons,
    role,
    location,
    helpful_count,
    review_link
  ) VALUES
    (
      employment_id,
      candidate_id,
      2.0,
      '2024-02-02',
      'New CEO Sumit is killing everything that was once good',
      'After Feb 2024, no Pros to list here',
      'Since New CEO Sumit Dhawan was hired on Dec 2023, here is what happened:
- Return to Office mandate, no exceptions
- Layoffs for the first time since company was founded, right after we finished Q4 2023 as the best Quarter in company history, in the best year of the company. Who lays off people after they made the most money ever?
- All terminated positions will be filled in global centers (overseas, to save money)
- All terminated employees last day is on 5 months from now. No option to choose to leave now, otherwise that counts as resigning and thus giving up any chance at severance or unvested stock. Pretty cruel way to force people out, or force them to train their own replacements with a promise (no guarantee) that they won''t get rid of you before your termination date. Disgusting
- This was the best company I worked for, until they hired this new CEO',
      'Product support engineer',
      'Draper, UT',
      89,
      'https://www.glassdoor.com/Reviews/Employee-Review-Proofpoint-E39140-RVW84007234.htm'
    ),
    (
      employment_id,
      candidate_id,
      1.0,
      '2024-02-04',
      'Proofpoint Gone. Find Another Employer.',
      'Use to be a great place to work. Good people, and an amazing place to work. As an employee, you felt as though you worked for a place that truely cared about their employees. Employees wellbeing was prioirty with the leaders. That has all changed. Proofpoint is unrecognizable.',
      'There is a new regime and a ruthless, cold CEO who is full of lies. The day Sumit started his reign of terror at Proofpoint, he stated that he was responsible for all emoloyees and their families, and he took that seriously. What happened Sumit ? You should not make such a strong statement and then do the opposite. I understand you are a puppet; but you are the CEO, and you should be careful with the false advertisements. You have no problem instilling fear into your leaders and emoloyees. Nor do you care about destroying the lives of your employees and their families.

The layoffs were so horrific. Sumit sends an email notification that there will be a reduction in the workforce. This email notification was sent 48 hour prior to the actually layoffs taking place. This created an insane amount of panic throughout the employment poplulation. The layoffs were handled so poorly that they left the affacted employees feeling degraded, humilated and helpless. Most of the staff who conducted the layoffs were cruel, cold and stuck to a dialogue. There was no empathy, compassion or thanks for all the years of service. This place is unrecognizable.',
      'Human resources',
      'Pittsburgh, PA',
      51,
      'https://www.glassdoor.com/Reviews/Employee-Review-Proofpoint-E39140-RVW84047789.htm'
    ),
    (
      employment_id,
      candidate_id,
      3.0,
      '2024-02-02',
      'Not the same company',
      'Great products
Good management 
Good people',
      'Since the new CFO & CEO came in, the company culture became nonexistent. Their whole goal was to hire cheaper outside the US to replace the 280 employees laid off. Upon the new CEO introduction to the company, he mentioned he doesn''t look at us as "just employees." That he "cares for our family, your children." None of that was remotely true.

Speaking of remotely… He installed a 3 week notice of mandatory return to site. This left many employees scrambling to get their ends covered to RTS.

Now, let''s talk about these layoffs. The CEO sent an email in the late afternoon on 1/30 announcing the 280 jobs being cut on 2/1 and that half of them will be replaced outside US. This put TREMENDOUS amounts of stress & anxiety on employees throughout the company. Why not announce it and do the layoffs the following day?

Going back to RTS, he announced the layoffs on the SECOND day of RTS. Why not postpone the RTS till the following week if he knew he was doing layoffs that week?

He has mentioned this quote multiple times in various platforms. "My problems are your problems & your problems are your problems." Comes across as a real class act.',
      'Recruiter',
      'Sunnyvale, CA',
      50,
      'https://www.glassdoor.com/Reviews/Employee-Review-Proofpoint-E39140-RVW83997039.htm'
    ),
    (
      employment_id,
      candidate_id,
      1.0,
      '2024-02-03',
      'Terrible management under new CEO',
      'The people who keep the company running that AREN''T in Leadership, the growth and direction we all once had.
Great technology within cybersecurity',
      'Forced Hybrid (RTS) with no flexibility, sudden layoffs, lack of time/concern to accommodate company requests, cutthroat CEO that only cares about margins over people, terrible/sub-par 401k Match, egotistical, weak-minded CEO & CFO that think free food and soda cans will keep people happy',
      'Business analyst',
      'Sunnyvale, CA',
      41,
      'https://www.glassdoor.com/Reviews/Employee-Review-Proofpoint-E39140-RVW84031785.htm'
    ),
    (
      employment_id,
      candidate_id,
      1.0,
      '2024-02-10',
      'Good Luck in 2024',
      'The best company prior to the end of 2023.',
      'I noticed below that the current CFO wrote a review below but added no detail to his review.
He is second at the helm so one would think he knows how to sell this place. It is obvious his review is an extremely lazy effort to clean up the chaos and disarray he and his boss have created.

I have never worked for an organization where the two top guys are so disliked by the employees. I have seen the morale at Proofpoint go from 10 to 0 quickly. But what do you expect when the CEO states in every meeting, "If you don''t like it here find another place to work". Also, stop the lies you know very well there be another mass layoff because you have stated that to your leaders. Quality and values is no longer the theme at Proofpoint. It is all about money for these two and their TB bosses.',
      'Executive',
      'Sunnyvale, CA',
      31,
      'https://www.glassdoor.com/Reviews/Employee-Review-Proofpoint-E39140-RVW84256807.htm'
    ),
    (
      employment_id,
      candidate_id,
      2.0,
      '2024-01-12',
      'Use to be an amazing to place to work',
      'Unlimited PTO, great products, interesting industry',
      'New CEO mandated return to office with minimal warning leaving many employees with children, disabilities, and other commitments struggling. Communications since change in management has gone downhill. Rumors of layoffs not being addressed when publicly asked. 401k funding severely lacking.',
      'Employee',
      'Sunnyvale, CA',
      29,
      'https://www.glassdoor.com/Reviews/Employee-Review-Proofpoint-E39140-RVW83301347.htm'
    ),
    (
      employment_id,
      candidate_id,
      1.0,
      '2024-02-06',
      'Steer clear…not the same company.',
      'If you asked me a month ago the list would be a mile long. Now…Sumit and Remi have destroyed all that was good.',
      'I loved the company, I felt respected, that I value added to my org and team and that I was well liked by leadership. All of that was true but didn''t do anything to sway management when they were making the list of who to get rid of as part of the rift. They let Remi and a VP that was about a minute on the job make unilateral decisions. The actual conversation when being laid off was cold and lacked all empathy. Proofpoint is a prime example of what is wrong with corporate America. Keep those people at the top rich and screw the rest of us. Oh and we have had two huge years….and they are saying the equity has only gone up by a dollar in two years. I''m no math whizz but if you are paying out 135% bonuses on the year…. Then your valuation is bull poop. Run from here. There will be more layoffs. All they care about is a big IPO. Who cares about those of us who got them there.',
      'Recruiter',
      'Sunnyvale, CA',
      28,
      'https://www.glassdoor.com/Reviews/Employee-Review-Proofpoint-E39140-RVW84126070.htm'
    ),
    (
      employment_id,
      candidate_id,
      1.0,
      '2024-01-30',
      'New CEO is Ruining Proofpoint',
      'Old CEO was great 
Used to be fully remote with options to go into offices 
Unlimited PTO
People mattered',
      'New CEO does not care about employees. He came in Q4 we had our most successful year thanks to our old leadership but new CEO claimed all the glory and rewarded the hard-working employees with mandatory return to office and possible layoffs',
      'Program manager',
      'Salt Lake City, UT',
      27,
      'https://www.glassdoor.com/Reviews/Employee-Review-Proofpoint-E39140-RVW83894391.htm'
    ),
    (
      employment_id,
      candidate_id,
      1.0,
      '2024-02-21',
      'Worst of the Worst',
      'Prior to 2023: Great products, great people, collaborative company. The best of the best in Cyber.',
      'The Proofpoint of yesteryear is LONG gone. No autonomy, do as we say or get out. If you want to become a clock punching robot then this is the place for you. Nepism and butt kissers DO apply and are welcomed. The people that propelled the company to the VERY best quarter EVER are rewarded by fear and a new regime that only promises nothing but more layoffs, crazy RTO policies and a like it or leave attitude. Work harder with less people so the upper and newly appointed TB and other leadership is made richer. They DO NOT CARE about the employees. The new regime were the kids that had no one to sit with at the lunch table back in their youth and thrive on their "power."
 A former great company with great products and so much promise being burned to the ground. I expected so much more from you Proofpoint! Too bad. Get out while you can!',
      'Human resources',
      'Current employee, more than 5 years',
      26,
      'https://www.glassdoor.com/Reviews/Employee-Review-Proofpoint-E39140-RVW84617415.htm'
    );
END $$; 