// Script to update all 'Calibration profile' status values to 'Calibration'
// Run with: node src/scripts/update-status-values.js

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or API key not found. Make sure they are set in your environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const updateStatusValues = async () => {
  try {
    console.log('Fetching candidates with "Calibration profile" status...');
    
    const { data: candidates, error: fetchError } = await supabase
      .from('candidates')
      .select('id, update_status')
      .eq('update_status', 'Calibration profile');
    
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`Found ${candidates.length} candidates with "Calibration profile" status.`);
    
    if (candidates.length === 0) {
      console.log('No candidates need to be updated. Exiting.');
      return;
    }
    
    console.log('Updating status values to "Calibration"...');
    
    const { error: updateError } = await supabase
      .from('candidates')
      .update({ update_status: 'Calibration' })
      .eq('update_status', 'Calibration profile');
    
    if (updateError) {
      throw updateError;
    }
    
    console.log(`Successfully updated ${candidates.length} candidates.`);
    
    // Verify the update was successful
    const { data: verifyData, error: verifyError } = await supabase
      .from('candidates')
      .select('count')
      .eq('update_status', 'Calibration profile');
    
    if (verifyError) {
      throw verifyError;
    }
    
    const remainingCount = verifyData[0]?.count || 0;
    
    if (remainingCount === 0) {
      console.log('Verification successful. All records updated.');
    } else {
      console.warn(`Warning: ${remainingCount} records still have "Calibration profile" status.`);
    }
    
  } catch (error) {
    console.error('Error updating status values:', error);
    process.exit(1);
  }
};

updateStatusValues(); 