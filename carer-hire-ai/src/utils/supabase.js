import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch the subscription status for a given email address.
 * Returns the subscriber row or null if not found.
 */
export async function getSubscriberStatus(email) {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', email)
    .eq('app', 'carer-hire-ai')
    .single();
  if (error) return null;
  return data;
}
