# Runly Web

Marketing site for [runly.mx](https://runly.mx) — RUNLY ERP, by Racoon Devs. Astro 5, Tailwind CSS, bilingual (ES/EN), SMTP-backed contact form. Separate from the `runly-erp` application repository.

## Development

Requirements: Node 20+, pnpm.

```bash
pnpm install
cp .env.example .env   # fill in SMTP_* and CONTACT_TO_EMAIL, see below
pnpm dev
```

Site runs at `http://localhost:4321` (Spanish) and `http://localhost:4321/en/` (English).

Run tests: `pnpm test`. Typecheck: `pnpm astro check`. Production build: `pnpm astro build`.

## Environment variables

See `.env.example`. The contact form requires real SMTP credentials to actually deliver email — until they are set, `/api/contact` will return a `502` on submit rather than pretending to succeed.

| Variable | Purpose |
|---|---|
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASSWORD` | SMTP connection used by the contact form |
| `SMTP_FROM` | From address for outgoing contact emails |
| `CONTACT_TO_EMAIL` | Inbox that receives contact form submissions |
| `PUBLIC_SITE_URL` | Canonical site URL, used in SEO tags and the sitemap |

## Content that must be confirmed before launch

- `CONTACT_WHATSAPP_NUMBER`, `CONTACT_SALES_EMAIL`, `CONTACT_SUPPORT_EMAIL` in `src/consts.ts` are `PENDING_CONFIRM_*` placeholders, not real values.
- The hero product screenshot (`public/brand/product-dashboard-preview.svg`) and the Open Graph cover image (`public/brand/og-cover.svg`) are placeholder illustrations (the real isotype on a brand-colored background), not real product screenshots. Replace both with real assets before launch — note social platforms (Facebook/Twitter/LinkedIn link previews) generally do not render SVG for `og:image`, so the OG cover in particular should become a real PNG/JPG before going live.
- SMTP credentials (see above) must be set to real values for the contact form to deliver email.

## Docker deploy

```bash
docker compose up -d --build
```

This runs the site on port 4321 inside the container. **Not yet verified in this environment**: the container build/run was not smoke-tested here because the local Docker daemon was not running during development — run `docker compose up -d --build` yourself and confirm `curl http://localhost:4321/` returns 200 before relying on it in production.

This does **not** configure DNS, reverse proxy, or TLS — those are separate, manual steps:

1. Point `runly.mx` and `www.runly.mx` DNS to the VPS hosting this container.
2. Configure the reverse proxy (Nginx or Cloudflare, whichever this infra already uses) to forward `runly.mx` to `localhost:4321` (or the container's published port).
3. Issue/renew a TLS certificate for `runly.mx`.

None of these three steps are executed by this repository or its tooling — they are infrastructure changes outside the scope of the landing page build, and must be done deliberately against the real production environment.
