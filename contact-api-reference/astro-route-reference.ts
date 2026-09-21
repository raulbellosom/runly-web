// REFERENCE ONLY — this is no longer wired into the Astro build (runly-web
// is a static site now). It documents the exact request handling the real
// Runly backend/API needs to reproduce. See README.md in this folder.
import type { APIRoute } from "astro";
import { createRateLimiter } from "./src/rate-limit";
import { createTransporter, sendContactEmail } from "./src/mailer";
import { handleContactRequest } from "./src/handle-contact-request";
import { isHumanRecaptcha } from "./src/recaptcha";

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
      verifyRecaptcha: (token) =>
        env.RECAPTCHA_SECRET_KEY ? isHumanRecaptcha(token, env.RECAPTCHA_SECRET_KEY) : Promise.resolve(true),
    },
  });

  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: { "Content-Type": "application/json" },
  });
};
