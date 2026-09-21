// src/lib/rate-limit.ts
interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  now?: () => number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const { windowMs, maxRequests, now = () => Date.now() } = options;
  const hits = new Map<string, number[]>();

  return {
    check(key: string): RateLimitResult {
      const currentTime = now();
      const windowStart = currentTime - windowMs;
      const existing = (hits.get(key) ?? []).filter((t) => t > windowStart);

      if (existing.length >= maxRequests) {
        hits.set(key, existing);
        return { allowed: false, remaining: 0 };
      }

      existing.push(currentTime);
      hits.set(key, existing);
      return { allowed: true, remaining: maxRequests - existing.length };
    },
  };
}
