import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://bkidxhsahwggipciiwpm.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_-J8CZBppahRZaTK3WFw1Cw_S1u7MouV';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
