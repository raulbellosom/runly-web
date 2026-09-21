# Contact API — reference implementation (to be migrated)

`runly-web` was converted to a fully static site (see the repo root
README). Static sites cannot run a server-side endpoint, so the contact
form's backend logic — previously `src/pages/api/contact.ts` plus its
`src/lib/*` helpers — was extracted here. **None of this code runs in
production anymore.** It exists purely as an accurate spec for whoever
implements the real endpoint in Runly's backend/API service.

`pnpm test` at the repo root still runs the tests in `src/__tests__/` so
this reference stays correct until it's actually ported, but this folder
is excluded from `tsconfig.json` and is not part of the Astro build —
nothing here is bundled into the static site, and none of its secrets
(SMTP credentials, reCAPTCHA secret key) ever reach the frontend build.

## What the frontend now expects

`src/components/sections/ContactSection.astro` posts the form as JSON to
`PUBLIC_CONTACT_API_URL` (build-time env var, e.g.
`https://api.runly.mx/public/contact`). If that var is unset, the form
shows its existing error state on submit instead of calling anything —
there's no `/api/contact` on the static site to fall back to. The
external API must serve CORS headers for `https://runly.mx` (and
`https://runly.mx/en/`, same origin) since it's a cross-origin request —
this repo has no proxy_pass in front of it.

## Endpoint contract to reproduce

`POST /public/contact` (or whatever path `PUBLIC_CONTACT_API_URL` points
to), `Content-Type: application/json`.

Request body — see `src/contact-schema.ts` for the exact Zod schema:

```jsonc
{
  "fullName": "string, 2-120 chars",
  "companyName": "string, 2-160 chars",
  "email": "string, valid email, max 200",
  "phone": "string, 7-30 chars",
  "teamSize": "string, optional, max 60",
  "interest": "string, 2-160 chars",
  "needs": "string, 10-2000 chars",
  "consent": true, // must be exactly `true`
  "website": "", // honeypot — must be empty, reject otherwise
  "locale": "es | en",
  "renderedAtMs": 1234567890, // Date.now() at form render, for the min-fill-time check
  "recaptchaToken": "string, optional" // reCAPTCHA v3 token
}
```

Response: `{ "ok": true }` on success, or `{ "ok": false, "error": "<code>" }`
with a matching HTTP status. See `handle-contact-request.ts` for the exact
flow and error codes:

1. **Rate limit** — `rate-limit.ts`: 5 requests / 10 minutes per IP →
   `429 { error: "rate_limited" }`. In-memory `Map` here; the real backend
   should probably back this with Redis or similar if it runs multiple
   instances.
2. **Schema validation** — `contact-schema.ts` → `400 { error: "invalid_payload" }`.
3. **Honeypot / fill-time check** — reject if `Date.now() - renderedAtMs`
   is under 1500ms → `400 { error: "submitted_too_fast" }`.
4. **reCAPTCHA v3** — `recaptcha.ts`: verify token against Google's
   `siteverify`, requiring `action === "contact_submit"` and
   `score >= 0.5`. Skipped only when no secret key is configured →
   `400 { error: "recaptcha_failed" }`.
5. **Send email** — `mailer.ts`: Nodemailer over SMTP, plain-text email
   built from the payload, `replyTo` set to the submitter's email →
   `502 { error: "email_delivery_failed" }` on failure.
6. Success → `200 { ok: true }`.

## Env vars the backend needs

See `.env.example` in this folder: `SMTP_HOST`, `SMTP_PORT`,
`SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`,
`CONTACT_TO_EMAIL`, `RECAPTCHA_SECRET_KEY`. These must live only on the
backend — never in `runly-web`'s `.env`/`.env.example` again.

## Migration steps

1. Port `src/{contact-schema,rate-limit,recaptcha,mailer,handle-contact-request}.ts`
   into the Runly backend/API repo (framework-agnostic, no Astro
   dependency other than the route wiring itself).
2. Re-implement `astro-route-reference.ts` as a plain route/handler in
   whatever framework the backend uses (Express, Fastify, Next API route,
   etc.) — it's a thin wrapper: parse JSON, call `handleContactRequest`,
   return its `{ status, body }`.
3. Add CORS for `https://runly.mx`.
4. Point `runly-web`'s production `PUBLIC_CONTACT_API_URL` at the new
   endpoint and rebuild/redeploy the static site.
5. Delete this folder once the migration is live.
