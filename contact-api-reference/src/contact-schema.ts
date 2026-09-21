// src/lib/contact-schema.ts
import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(2).max(160),
  email: z.email().trim().max(200),
  phone: z.string().trim().min(7).max(30),
  teamSize: z.string().trim().max(60).optional().default(""),
  interest: z.string().trim().min(2).max(160),
  needs: z.string().trim().min(10).max(2000),
  consent: z.literal(true),
  website: z.string().max(0), // honeypot: must be empty
  locale: z.enum(["es", "en"]),
  renderedAtMs: z.number().int().positive(),
  // reCAPTCHA v3 token. Optional at the schema level (not every deployment
  // has reCAPTCHA configured) — whether it is actually required is decided
  // in handleContactRequest, based on whether a secret key is configured.
  recaptchaToken: z.string().trim().optional().default(""),
});

export type ContactFormPayload = z.infer<typeof contactSchema>;
