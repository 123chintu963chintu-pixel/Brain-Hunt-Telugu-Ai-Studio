import { z } from "zod";

const envSchema = z.object({
  // Database (Prisma / Supabase Postgres)
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Auth
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  OWNER_SESSION_COOKIE_NAME: z.string().default("bh_owner_session"),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // AI providers (optional at this stage — Part 3 needs at least one)
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  FAL_API_KEY: z.string().optional(),
  RUNWAY_API_KEY: z.string().optional(),
  STABILITY_API_KEY: z.string().optional(),
  PIKA_API_KEY: z.string().optional(),

  // Rate limiting (optional — falls back to DB-based limiting if absent)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

// Fails the build loudly if any required variable is missing or malformed —
// this is intentional so misconfiguration never becomes a silent runtime bug.
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
  );
  throw new Error("Invalid environment variables — see log above.");
}

export const env = parsed.data;
