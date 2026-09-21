# Runly Web

Marketing site for [runly.mx](https://runly.mx) — RUNLY ERP, by Racoon Devs. Astro 5 (static site generation), Tailwind CSS, bilingual (ES/EN). Separate from the `runly-erp` application repository.

This is a **fully static site**: `pnpm build` emits plain HTML/CSS/JS into `dist/`, served directly by Nginx. There is no Node runtime, no adapter, and no Docker container in production.

## Development

Requirements: Node 20+, pnpm.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Site runs at `http://localhost:4321` (Spanish) and `http://localhost:4321/en/` (English).

Run tests: `pnpm test`. Typecheck: `pnpm astro check`. Production build: `pnpm build`.

## Environment variables

See `.env.example`.

| Variable | Purpose |
|---|---|
| `PUBLIC_SITE_URL` | Canonical site URL, used in SEO tags and the sitemap |
| `PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key rendered in the contact form |
| `PUBLIC_CONTACT_API_URL` | External API the contact form posts to (e.g. `https://api.runly.mx/public/contact`). Left blank, the form shows an error on submit instead of pretending to succeed. |

All three are `PUBLIC_`-prefixed or otherwise non-secret — they get inlined into the static build and shipped to the browser. **No SMTP credentials or reCAPTCHA secret key exist in this repository or build**; that logic lives in [`contact-api-reference/`](contact-api-reference/) as a spec for the real backend/API (see that folder's README for the migration plan).

## Content that must be confirmed before launch

- `CONTACT_WHATSAPP_NUMBER`, `CONTACT_SALES_EMAIL`, `CONTACT_SUPPORT_EMAIL` in `src/consts.ts` are `PENDING_CONFIRM_*` placeholders, not real values.
- The hero product screenshot (`public/brand/product-dashboard-preview.svg`) and the Open Graph cover image (`public/brand/og-cover.svg`) are placeholder illustrations (the real isotype on a brand-colored background), not real product screenshots. Replace both with real assets before launch — note social platforms (Facebook/Twitter/LinkedIn link previews) generally do not render SVG for `og:image`, so the OG cover in particular should become a real PNG/JPG before going live.
- `PUBLIC_CONTACT_API_URL` must point at a real, deployed contact backend before launch, or the form will not submit.

## Deploy

```bash
pnpm install --frozen-lockfile
pnpm build

rm -rf /var/www/runly.mx/*
cp -r dist/* /var/www/runly.mx/
```

`dist/` is a self-contained static tree (both locales, sitemap, robots.txt, assets). Nothing needs to run afterwards — no process to keep alive, no port to expose.

### Nginx

Minimal server block; adjust paths/TLS to match the rest of the VPS's Nginx config:

```nginx
server {
    listen 80;
    server_name runly.mx www.runly.mx;
    root /var/www/runly.mx;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    error_page 404 /404.html;
}
```

No `proxy_pass`, no upstream — this block only serves files from disk.

## Contact form

The form in `ContactSection.astro` is fully functional client-side (validation, honeypot, reCAPTCHA v3, submit states) and posts JSON to `PUBLIC_CONTACT_API_URL` via `fetch`. That endpoint is not part of this repository — see [`contact-api-reference/`](contact-api-reference/) for the exact contract it must implement and what needs to be migrated from the previous SSR implementation.
