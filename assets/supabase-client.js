import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// This publishable browser key is intentionally public. Supabase RLS policies
// must enforce which rows anonymous and authenticated visitors can access.
export const supabase = createClient(
  "https://cbqlbkgvxsgflyxeaijy.supabase.co",
  "sb_publishable_nrNewLCMpHDtdKb6CXs7hw_KQ6AbveU"
);
