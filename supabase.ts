import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

/**
 * Browser-safe client — uses the public anon/publishable key only.
 * Safe to import in client components.
 */
export const supabaseBrowser = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Server-only client — uses the service_role key, bypasses Row Level Security.
 * NEVER import this file from a client component. Only use inside
 * app/api/** route handlers or server components.
 */
export function supabaseAdmin() {
  if (typeof window !== "undefined") {
    throw new Error(
      "supabaseAdmin() must never be called from the browser — service_role key would leak."
    );
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
