/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SMTP_HOST: string;
  readonly SMTP_PORT: string;
  readonly SMTP_SECURE: string;
  readonly SMTP_USER: string;
  readonly SMTP_PASSWORD: string;
  readonly SMTP_FROM: string;
  readonly CONTACT_TO_EMAIL: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_RECAPTCHA_SITE_KEY: string;
  readonly RECAPTCHA_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
