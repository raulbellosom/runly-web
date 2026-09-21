// src/lib/__tests__/handle-contact-request.test.ts
import { describe, expect, it, vi } from "vitest";
import { handleContactRequest } from "../handle-contact-request";
import { createRateLimiter } from "../rate-limit";

const basePayload = {
  fullName: "Raúl Gómez",
  companyName: "Maquinaria y Canteras",
  email: "raul@miempresa.com",
  phone: "+52 55 1234 5678",
  teamSize: "6 a 20 personas",
  interest: "Solicitar demostración virtual",
  needs: "Inventario multialmacén y chat de soporte integrado",
  consent: true,
  website: "",
  locale: "es" as const,
};

function makeDeps(overrides: Partial<Parameters<typeof handleContactRequest>[0]["deps"]> = {}) {
  return {
    rateLimiter: createRateLimiter({ windowMs: 60_000, maxRequests: 5 }),
    sendEmail: vi.fn().mockResolvedValue({ ok: true }),
    minFillTimeMs: 1500,
    ...overrides,
  };
}

describe("handleContactRequest", () => {
  it("sends the email and returns ok for a valid, human-timed submission", async () => {
    const deps = makeDeps();
    const result = await handleContactRequest({
      body: { ...basePayload, renderedAtMs: Date.now() - 5000 },
      ip: "1.2.3.4",
      deps,
    });
    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);
    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("rejects a submission filled faster than minFillTimeMs (likely a bot)", async () => {
    const deps = makeDeps();
    const result = await handleContactRequest({
      body: { ...basePayload, renderedAtMs: Date.now() - 200 },
      ip: "1.2.3.5",
      deps,
    });
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("rejects a non-empty honeypot without calling sendEmail", async () => {
    const deps = makeDeps();
    const result = await handleContactRequest({
      body: { ...basePayload, website: "http://spam.example", renderedAtMs: Date.now() - 5000 },
      ip: "1.2.3.6",
      deps,
    });
    expect(result.status).toBe(400);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("returns 429 once the per-IP rate limit is exceeded", async () => {
    const deps = makeDeps({ rateLimiter: createRateLimiter({ windowMs: 60_000, maxRequests: 1 }) });
    const request = { body: { ...basePayload, renderedAtMs: Date.now() - 5000 }, ip: "1.2.3.7", deps };
    await handleContactRequest(request);
    const second = await handleContactRequest(request);
    expect(second.status).toBe(429);
  });

  it("returns 502 when the email fails to send, and never reports false success", async () => {
    const deps = makeDeps({ sendEmail: vi.fn().mockResolvedValue({ ok: false, error: "smtp_error" }) });
    const result = await handleContactRequest({
      body: { ...basePayload, renderedAtMs: Date.now() - 5000 },
      ip: "1.2.3.8",
      deps,
    });
    expect(result.status).toBe(502);
    expect(result.body.ok).toBe(false);
  });

  it("returns 400 for a schema-invalid payload", async () => {
    const deps = makeDeps();
    const result = await handleContactRequest({
      body: { ...basePayload, email: "not-an-email", renderedAtMs: Date.now() - 5000 },
      ip: "1.2.3.9",
      deps,
    });
    expect(result.status).toBe(400);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
});
