
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log for debugging
console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Found' : 'Missing');

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Test the connection and log the result
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connected successfully');
  }
});

export type Lead = {
  id?: string;
  email?: string;
  phone?: string;
  name?: string;
  lead_source?: string;
  consent?: boolean;
  downloaded?: boolean;
  created_at?: string;
};