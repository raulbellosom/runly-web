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
| `PUBLIC_RUNLY_API_URL` | The Runly ERP instance's API the contact form submits into. Copy the "apiUrl" field verbatim from Growth's "Ver código" (e.g. `https://app.runly.mx/api` — the instance may mount the API under a subpath) |
| `PUBLIC_RUNLY_COMPANY` | Company slug assigned to this site inside that ERP instance |
| `PUBLIC_RUNLY_SITE_ID` | This site's UUID inside the ERP's Website module, once `runly.mx` is registered there |
| `PUBLIC_RUNLY_CONTACT_FORM_ID` | UUID of the "contacto" form created in the Growth module's admin |
| `PUBLIC_RUNLY_SUPABASE_URL` / `PUBLIC_RUNLY_SUPABASE_ANON_KEY` | Only needed once auth/guest-chat are wired up here too — plain form submissions work without them |
| `PUBLIC_TURNSTILE_SITE_KEY` | Optional Cloudflare Turnstile site key for spam protection on the contact form |

All of these are `PUBLIC_`-prefixed and non-secret by design (same category as a Supabase anon key) — they get inlined into the static build and shipped to the browser. **No SMTP credentials or server secrets exist in this repository or build.** Delivery is owned entirely by the Growth module on the ERP side; see [Contact form](#contact-form) below.

## Content that must be confirmed before launch

- The hero product screenshot (`public/brand/product-dashboard-preview.png`) is a real dashboard screenshot but still a placeholder in the sense that a cleaner/updated capture (or a short product video) may replace it later. The Open Graph cover image (`public/brand/og-cover.svg`) is still a placeholder illustration (the isotype on a brand-colored background), not a real product screenshot — replace it before launch. Note social platforms (Facebook/Twitter/LinkedIn link previews) generally do not render SVG for `og:image`, so the OG cover in particular should become a real PNG/JPG before going live.
- `PUBLIC_RUNLY_COMPANY`, `PUBLIC_RUNLY_SITE_ID`, and `PUBLIC_RUNLY_CONTACT_FORM_ID` must be set to real values (site registered in the Website module, form created in Growth) before launch, or the contact form will not submit.

## Deploy

Initial setup clones the repo to `/opt/runly-web` on the VPS. After that, shipping a change is:

```bash
cd /opt/runly-web

git pull --ff-only

pnpm install --frozen-lockfile

pnpm build

cp -a dist/. /var/www/runly.mx/

chown -R www-data:www-data /var/www/runly.mx
```

`dist/` is a self-contained static tree (both locales, sitemap, robots.txt, assets). Nothing needs to run afterwards — no process to keep alive, no port to expose. `cp -a dist/.` overlays the build output onto the existing tree (unlike `rm -rf` + `cp -r`, it doesn't leave a brief window with no files served); the `chown` after keeps ownership matching Nginx's `www-data` user.

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

## Runly ERP integration (Growth)

This site is registered in Runly ERP's **Growth** module as an external site (Growth → Sitios conectados → Conectar sitio externo) and integrates via the npm package [`@raulbellosom/runly-sdk`](https://www.npmjs.com/package/@raulbellosom/runly-sdk) — this is "Pattern A" from that package's README (a build with its own bundler, as opposed to "Pattern C", the no-build `<script src=".../runly-sdk.js">` embed for plain HTML sites). `src/lib/runly-sdk.ts` creates a single shared client (`createStorefrontClient`) that both the analytics bootstrap and the contact form import — avoids opening two Supabase clients on the same page.

This requires, on the Runly ERP side:
1. `runly.mx` registered as a site in Growth's "Sitios conectados", giving `PUBLIC_RUNLY_SITE_ID`.
2. A "contacto" form created in the Growth module's admin, with field keys matching what `ContactSection.astro` submits (`fullName`, `companyName`, `email`, `phone`, `teamSize`, `interest`, `needs`, `consent`, `locale`) — its UUID is `PUBLIC_RUNLY_CONTACT_FORM_ID`.

When `PUBLIC_RUNLY_API_URL`/`PUBLIC_RUNLY_COMPANY` are unset, Vite statically resolves `runlySdk` to `null` and tree-shakes the entire SDK (and its bundled `@supabase/supabase-js`) out of the build — confirmed by comparing build output with/without those vars set. Once real values are filled in, the SDK lands in its own shared chunk instead.

### Analytics

`BaseLayout.astro` calls `runlySdk?.analytics.start()` on every page load, which respects whatever `analyticsMode` (`off` / `anonymous` / `consent_required`) is configured for this site in Growth. **This site has no cookie-consent banner**, so the bootstrap deliberately never calls `sdk.analytics.setConsent(...)` — if the site is set to `consent_required` in Growth, no analytics will actually persist until either the mode is changed to `anonymous` or a real consent banner is added here that calls `setConsent('granted')`. Click-tracking via `data-runly-event="..."` attributes is supported by the SDK but not added to any elements yet — add them to specific CTAs if/when that's wanted.

### Contact form

The form in `ContactSection.astro` is fully functional client-side (validation, honeypot, submit states) and submits directly into Growth via `runlySdk.forms.submit(formId, values, options)` — no custom backend lives in or next to this repo. Until the two ERP-side items above are set, the form fails loudly on submit instead of pretending to succeed.

Optional spam protection: set `PUBLIC_TURNSTILE_SITE_KEY` to render a Cloudflare Turnstile widget; left blank, the form still submits without it.

### Live chat (guestChat)

A floating chat button (`src/components/ChatWidgetIsland.tsx`, mounted once in `BaseLayout.astro` via `<ChatWidgetIsland client:idle />`) wraps the SDK's own `ChatWidget` React component, wired to the shared `runlySdk` client. This is the **only piece of this site that uses React** — `@astrojs/react` was added solely so this one prebuilt component could be reused instead of hand-rolling a chat UI; everything else stays plain Astro.

It renders nothing (not even an empty button) when:
- `PUBLIC_RUNLY_API_URL`/`PUBLIC_RUNLY_COMPANY` aren't set (`runlySdk` is `null`), or
- the ERP reports no chat availability — which is also what happens if the `runly.chat` module isn't installed/enabled on the instance, or no agents are online. `useGuestChat` fails soft on any `getAvailability()` error, so a missing module never breaks the page.

Needs no ERP-side setup beyond `runly.chat` being installed and enabled — no separate form/site registration like the contact form needs.

### Known SDK gap

`@raulbellosom/runly-sdk` currently ships without TypeScript declarations (`.d.ts`), even as of 0.5.6 — see `src/types/runly-sdk.d.ts` for the local ambient module workaround. Worth fixing upstream in the SDK's own repo at some point.
