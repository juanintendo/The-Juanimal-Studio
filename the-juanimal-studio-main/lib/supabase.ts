import { createClient } from "@supabase/supabase-js";

// Server-only client. Uses the service role key so it can write leads/audits
// from the API route. Never import this file from client components.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseServerClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars. Add them in Vercel → Project → Settings → Environment Variables."
    );
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}
