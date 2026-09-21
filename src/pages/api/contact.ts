// src/pages/api/contact.ts
import type { APIRoute } from "astro";
import { createRateLimiter } from "../../lib/rate-limit";
import { createTransporter, sendContactEmail } from "../../lib/mailer";
import { handleContactRequest } from "../../lib/handle-contact-request";

export const prerender = false;

const rateLimiter = createRateLimiter({ windowMs: 10 * 60_000, maxRequests: 5 });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const env = import.meta.env;
  const transporter = createTransporter(env);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await handleContactRequest({
    body,
    ip: clientAddress ?? "unknown",
    deps: {
      rateLimiter,
      minFillTimeMs: 1500,
      sendEmail: (payload) =>
        sendContactEmail(payload, transporter, {
          from: env.SMTP_FROM,
          to: env.CONTACT_TO_EMAIL,
        }),
    },
  });

  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: { "Content-Type": "application/json" },
  });
};
