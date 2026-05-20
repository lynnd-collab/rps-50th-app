import { createClient } from '@supabase/supabase-js'

// NOTE: As of May 30 2026, new tables in the public schema require explicit grants
// to be accessible via the Supabase Data API. Run this in the SQL editor for any new table:
//   GRANT SELECT, INSERT, UPDATE, DELETE ON table_name TO anon, authenticated;

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
