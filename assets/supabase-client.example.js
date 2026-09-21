import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Copy this file to supabase-client.js and add your own browser-safe values.
// Never put a Supabase service-role key in client-side code.
export const supabase = createClient(
  "https://YOUR_PROJECT_ID.supabase.co",
  "YOUR_PUBLISHABLE_KEY"
);
