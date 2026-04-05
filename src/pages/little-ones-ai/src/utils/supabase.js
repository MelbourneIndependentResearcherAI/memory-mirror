import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[little-ones-ai] Supabase credentials are not configured. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file. ' +
    'Database features (free trial sign-up) will not work until credentials are provided.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

/**
 * Fetch the subscription status for a given email address.
 * Returns the subscriber row or null if not found.
 */
export async function getSubscriberStatus(email) {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', email)
    .eq('app', 'little-ones-ai')
    .single();
  if (error) return null;
  return data;
}
