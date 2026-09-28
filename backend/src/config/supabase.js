import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://bkidxhsahwggipciiwpm.supabase.co';

const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_-J8CZBppahRZaTK3WFw1Cw_S1u7MouV';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function verifySupabaseConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('[SUPABASE] Auth check warning:', error.message);
    } else {
      console.log(`[SUPABASE] Connected successfully to Supabase PostgreSQL at ${supabaseUrl}`);
    }
    return true;
  } catch (err) {
    console.warn('[SUPABASE] Connectivity check failed:', err.message);
    return false;
  }
}
