/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_RECAPTCHA_SITE_KEY: string;
  // External contact API the static site posts to (e.g. https://api.runly.mx/public/contact).
  // No server secrets live in this build — see contact-api-reference/README.md.
  readonly PUBLIC_CONTACT_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
