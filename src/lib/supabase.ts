import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

// Single shared Supabase client instance — avoids multiple GoTrueClient warnings
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);
