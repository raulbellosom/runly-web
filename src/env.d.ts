/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  // Runly storefront SDK config — the contact form submits straight into the
  // Growth module of the Runly ERP instance at PUBLIC_RUNLY_ERP_URL (no
  // custom backend). All of these are meant to be public (same as a Supabase
  // anon key or a reCAPTCHA site key) — see README's Contact form section
  // and @raulbellosom/runly-sdk's docs.
  readonly PUBLIC_RUNLY_ERP_URL: string;
  readonly PUBLIC_RUNLY_COMPANY: string;
  // This site's UUID inside the ERP's Website module. Scopes form
  // submissions (and future analytics/chat) to runly.mx specifically.
  readonly PUBLIC_RUNLY_SITE_ID: string;
  readonly PUBLIC_RUNLY_CONTACT_FORM_ID: string;
  // Only needed once auth/guest-chat features are wired up — plain form
  // submissions work without them (see @raulbellosom/runly-sdk's
  // createStorefrontClient: supabase creds are optional).
  readonly PUBLIC_RUNLY_SUPABASE_URL: string;
  readonly PUBLIC_RUNLY_SUPABASE_ANON_KEY: string;
  // Cloudflare Turnstile site key (optional spam protection for the contact
  // form, verified by the Growth module's forms.submit). Skipped when unset.
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
