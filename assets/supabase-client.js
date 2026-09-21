import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// A publishable key is safe to use in browser code. Access is enforced by Supabase RLS.
export const supabase = createClient(
  "https://cbqlbkgvxsgflyxeaijy.supabase.co",
  "sb_publishable_nrNewLCMpHDtdKb6CXs7hw_KQ6AbveU"
);
