-- Create the prompt_templates table
CREATE TABLE IF NOT EXISTS prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert a default template (only if the table has no records)
INSERT INTO prompt_templates (name, content, is_default)
SELECT 'Default CEO Analysis Template', 
       'Please analyze this CEO candidate profile and provide a comprehensive summary of their experience, skills, and potential fit for executive roles. Consider the following aspects:
- Overall career trajectory and progression
- Leadership experience and style based on their history
- Key strengths and potential areas for development
- Industry expertise and transferable skills
- Educational background and its relevance
- Cultural fit indicators based on their values (hungry/humble/smart attributes)
- Any red flags or areas that require further investigation

Provide a balanced assessment that highlights both strengths and potential concerns.', 
       true
WHERE NOT EXISTS (SELECT 1 FROM prompt_templates); 