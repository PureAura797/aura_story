/**
 * In-memory rate limiter for API endpoints.
 * 
 * On serverless (Vercel), each cold start resets the map — this is acceptable
 * because it still provides meaningful protection during a single instance lifetime.
 * For persistent rate limiting, use Redis/Upstash.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // timestamp ms
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  /** Unique namespace for this limiter (e.g. "login", "recovery") */
  prefix: string;
  /** Max requests allowed in the window */
  maxAttempts: number;
  /** Window size in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

/**
 * Check and consume one rate limit token.
 * @param identifier - Usually IP address or "ip:action"
 * @param config - Rate limit configuration
 */
export function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  const key = `${config.prefix}:${identifier}`;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  let entry = store.get(key);

  // Window expired — reset
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(key, entry);
  }

  entry.count++;

  const remaining = Math.max(0, config.maxAttempts - entry.count);
  const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);

  if (entry.count > config.maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    remaining,
    resetAt: entry.resetAt,
    retryAfterSeconds: 0,
  };
}

/* ─── Preset Configs ─── */

/** Login: max 5 attempts per 15 minutes */
export const LOGIN_LIMIT: RateLimitConfig = {
  prefix: "login",
  maxAttempts: 5,
  windowSeconds: 15 * 60, // 15 min
};

/** Recovery: max 3 requests per hour */
export const RECOVERY_LIMIT: RateLimitConfig = {
  prefix: "recovery",
  maxAttempts: 3,
  windowSeconds: 60 * 60, // 1 hour
};

/** Recovery code verify: max 5 attempts per 15 min */
export const RECOVERY_VERIFY_LIMIT: RateLimitConfig = {
  prefix: "recovery_verify",
  maxAttempts: 5,
  windowSeconds: 15 * 60,
};

/** Generic API mutation: max 30 per minute */
export const API_MUTATION_LIMIT: RateLimitConfig = {
  prefix: "api_mutation",
  maxAttempts: 30,
  windowSeconds: 60,
};
