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

let cached: SupabaseClient | null = null;

function getServerSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  cached = createClient(url, key, {
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
