import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Please configure your Supabase URL and anon key. Click the "Connect to Supabase" button in the top right to set up Supabase.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);