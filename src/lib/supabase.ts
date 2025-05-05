import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log the Supabase configuration for debugging
console.log('Supabase Configuration:');
console.log('URL defined:', !!supabaseUrl);
console.log('URL value:', supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : 'undefined');
console.log('Key defined:', !!supabaseAnonKey);
console.log('Key length:', supabaseAnonKey ? supabaseAnonKey.length : 0);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Please configure your Supabase URL and anon key. Click the "Connect to Supabase" button in the top right to set up Supabase.'
  );
}

// Create Supabase client with debug option
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  },
  global: {
    fetch: (...args) => {
      console.log('Supabase API Request:', args[0]);
      return fetch(...args);
    }
  }
});

// Add a test function to check connectivity
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('Connection URL:', supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : 'undefined');
    
    // Test basic table access with a simple selection
    const { data, error } = await supabase
      .from('glassdoor_reviews')
      .select()
      .limit(1);
      
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }
    
    // Show what columns actually exist in the table
    if (data && data.length > 0) {
      const firstRecord = data[0];
      console.log('Available columns in glassdoor_reviews table:', Object.keys(firstRecord));
      console.log('Sample record:', firstRecord);
    } else {
      console.log('Table exists but has no records');
    }
    
    // Try checking table count
    const { count, error: countError } = await supabase
      .from('glassdoor_reviews')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.log('Count query error:', countError);
    } else {
      console.log('Total records in glassdoor_reviews:', count);
    }
    
    return { success: true, data, count, columns: data && data.length > 0 ? Object.keys(data[0]) : [] };
  } catch (err) {
    console.error('Supabase connection test exception:', err);
    return { success: false, error: err };
  }
};