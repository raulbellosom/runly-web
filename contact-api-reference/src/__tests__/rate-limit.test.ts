// src/lib/__tests__/rate-limit.test.ts
import { describe, expect, it } from "vitest";
import { createRateLimiter } from "../rate-limit";

describe("createRateLimiter", () => {
  it("allows requests under the limit", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 3 });
    expect(limiter.check("1.2.3.4").allowed).toBe(true);
    expect(limiter.check("1.2.3.4").allowed).toBe(true);
    expect(limiter.check("1.2.3.4").allowed).toBe(true);
  });

  it("blocks requests once the limit is exceeded", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 2 });
    limiter.check("5.6.7.8");
    limiter.check("5.6.7.8");
    const third = limiter.check("5.6.7.8");
    expect(third.allowed).toBe(false);
  });

  it("tracks each IP independently", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 1 });
    limiter.check("9.9.9.9");
    const otherIp = limiter.check("1.1.1.1");
    expect(otherIp.allowed).toBe(true);
  });

  it("resets after the window passes", () => {
    let now = 0;
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 1, now: () => now });
    expect(limiter.check("2.2.2.2").allowed).toBe(true);
    expect(limiter.check("2.2.2.2").allowed).toBe(false);
    now += 1001;
    expect(limiter.check("2.2.2.2").allowed).toBe(true);
  });
});
