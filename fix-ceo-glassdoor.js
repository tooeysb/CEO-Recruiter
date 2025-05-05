// Script to fix CEO Glassdoor Summary issues
// Run with: node fix-ceo-glassdoor.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client (update these values with your project details)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Starting CEO Glassdoor Summary fix script...');
  
  try {
    // 1. First fetch all employments
    console.log('Fetching employments...');
    const { data: employments, error: employmentsError } = await supabase
      .from('employments')
      .select('id, candidate_id, employer_name');
      
    if (employmentsError) {
      throw new Error(`Error fetching employments: ${employmentsError.message}`);
    }
    
    console.log(`Found ${employments.length} employment records`);
    
    // 2. For each employment, check if a CEO Glassdoor summary already exists
    for (const employment of employments) {
      console.log(`\nProcessing employment ID: ${employment.id}`);
      
      // Check if summary exists
      const { data: existingSummary, error: summaryCheckError } = await supabase
        .from('ceo_glassdoor_summary')
        .select('id')
        .eq('employment_id', employment.id)
        .maybeSingle();
        
      if (summaryCheckError) {
        console.error(`Error checking existing summary: ${summaryCheckError.message}`);
        continue;
      }
      
      if (existingSummary) {
        console.log(`Summary already exists for employment ID ${employment.id}`);
        continue;
      }
      
      // Generate random test data for this employment
      const summaryData = {
        employment_id: employment.id,
        total_reviews: Math.floor(Math.random() * 1000) + 100,
        average_rating: parseFloat((Math.floor(Math.random() * 40) / 10 + 1).toFixed(1)),
        approval_percentage: Math.floor(Math.random() * 100),
        recommend_percentage: Math.floor(Math.random() * 100),
        positive_outlook_percentage: Math.floor(Math.random() * 100)
      };
      
      // Insert the new summary
      console.log('Inserting new summary with data:', summaryData);
      const { data: insertResult, error: insertError } = await supabase
        .from('ceo_glassdoor_summary')
        .insert(summaryData)
        .select();
        
      if (insertError) {
        console.error(`Error inserting summary: ${insertError.message}`);
      } else {
        console.log(`Successfully inserted summary with ID: ${insertResult[0].id}`);
      }
    }
    
    // 3. Verify the number of summaries we have now
    const { data: summaryCount, error: countError } = await supabase
      .from('ceo_glassdoor_summary')
      .select('id', { count: 'exact' });
      
    if (countError) {
      console.error(`Error counting summaries: ${countError.message}`);
    } else {
      console.log(`\nTotal CEO Glassdoor summaries in database: ${summaryCount.length}`);
    }
    
    console.log('\nScript completed successfully!');
    
  } catch (error) {
    console.error('Script failed with error:', error);
  }
}

main(); 