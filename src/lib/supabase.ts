
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log for debugging
console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

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
    
    // Test query to verify database access
    supabase
      .from('leads')
      .select('count(*)', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) {
          console.error('Error accessing leads table:', error);
        } else {
          console.log(`Found ${count} leads in the database`);
        }
      });
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

// Helper function to insert a lead
export async function insertLead(lead: Lead): Promise<{ data: Lead | null; error: Error | null }> {
  try {
    console.log('Inserting lead:', lead);
    
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        lead_source: lead.lead_source || 'website',
        consent: lead.consent !== undefined ? lead.consent : true,
        downloaded: false
      }])
      .select();
    
    if (error) {
      console.error('Error inserting lead:', error);
      return { data: null, error: new Error(error.message) };
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned from insert');
      return { data: null, error: new Error('No data returned from insert') };
    }
    
    console.log('Lead inserted successfully:', data[0]);
    return { data: data[0] as Lead, error: null };
  } catch (err) {
    console.error('Exception inserting lead:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}