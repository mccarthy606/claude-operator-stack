/**
 * Server-side Supabase client.
 *
 * Uses the service role key — never import this module from a client component.
 * For browser-side reads use a separate client with the anon key.
 *
 * The Supabase JS client talks to PostgREST, not raw Postgres, so the
 * Supavisor pooling discussion in cookbook recipe 07 does not apply here.
 * It applies if you later add Prisma or Drizzle.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate at module load so misconfiguration fails fast on boot rather than
// surfacing as a generic 500 on the first lead submission. Skipped under tests
// so unit tests can import this module without provisioning a Supabase env.
if (process.env.NODE_ENV !== "test") {
  if (!SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
}

let cached: SupabaseClient | null = null;

function getServerSupabase(): SupabaseClient {
  if (cached) return cached;

  cached = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cached;
}

export { getServerSupabase };

export type LeadInsert = {
  email: string;
  name: string | null;
  message: string | null;
  source: string | null;
};
