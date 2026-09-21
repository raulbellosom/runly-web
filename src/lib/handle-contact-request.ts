// src/lib/handle-contact-request.ts
import { contactSchema } from "./contact-schema";
import type { createRateLimiter } from "./rate-limit";

interface HandleContactRequestArgs {
  body: unknown;
  ip: string;
  deps: {
    rateLimiter: ReturnType<typeof createRateLimiter>;
    sendEmail: (payload: ReturnType<typeof contactSchema.parse>) => Promise<{ ok: true } | { ok: false; error: string }>;
    minFillTimeMs: number;
  };
}

interface HandleContactRequestResult {
  status: number;
  body: { ok: true } | { ok: false; error: string };
}

export async function handleContactRequest({
  body,
  ip,
  deps,
}: HandleContactRequestArgs): Promise<HandleContactRequestResult> {
  const rateLimit = deps.rateLimiter.check(ip);
  if (!rateLimit.allowed) {
    return { status: 429, body: { ok: false, error: "rate_limited" } };
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: "invalid_payload" } };
  }

  const fillTimeMs = Date.now() - parsed.data.renderedAtMs;
  if (fillTimeMs < deps.minFillTimeMs) {
    return { status: 400, body: { ok: false, error: "submitted_too_fast" } };
  }

  const sendResult = await deps.sendEmail(parsed.data);
  if (!sendResult.ok) {
    return { status: 502, body: { ok: false, error: "email_delivery_failed" } };
  }

  return { status: 200, body: { ok: true } };
}
