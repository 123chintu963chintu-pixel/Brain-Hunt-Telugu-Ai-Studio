import { prisma } from "./prisma";
import { env } from "./env";

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;

let upstashLimiter: import("@upstash/ratelimit").Ratelimit | null = null;

async function getUpstashLimiter() {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  if (upstashLimiter) return upstashLimiter;

  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis } = await import("@upstash/redis");

  upstashLimiter = new Ratelimit({
    redis: new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "60 s"),
  });
  return upstashLimiter;
}

/**
 * Returns true if the request is allowed, false if the caller should be
 * rate limited. `key` should uniquely identify the caller (e.g. IP + route).
 */
export async function checkRateLimit(key: string): Promise<boolean> {
  const limiter = await getUpstashLimiter();

  if (limiter) {
    const { success } = await limiter.limit(key);
    return success;
  }

  // DB fallback (no Upstash configured)
  const windowStart = new Date(Date.now() - WINDOW_MS);

  const existing = await prisma.rateLimitLog.findFirst({
    where: { key, windowAt: { gte: windowStart } },
  });

  if (!existing) {
    await prisma.rateLimitLog.create({ data: { key, count: 1 } });
    return true;
  }

  if (existing.count >= MAX_REQUESTS) return false;

  await prisma.rateLimitLog.update({
    where: { id: existing.id },
    data: { count: { increment: 1 } },
  });
  return true;
}
