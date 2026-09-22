// src/lib/runly-sdk.ts
import { createStorefrontClient } from "@raulbellosom/runly-sdk";

const baseUrl = import.meta.env.PUBLIC_RUNLY_ERP_URL;
const company = import.meta.env.PUBLIC_RUNLY_COMPANY;
const siteId = import.meta.env.PUBLIC_RUNLY_SITE_ID;
const supabaseUrl = import.meta.env.PUBLIC_RUNLY_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_RUNLY_SUPABASE_ANON_KEY;

// Shared by every page's analytics bootstrap (BaseLayout) and by the contact
// form (ContactSection) — createStorefrontClient() opens a Supabase client
// internally, and a second instance on the same page trips "Multiple
// GoTrueClient instances" warnings. `null` when PUBLIC_RUNLY_ERP_URL /
// PUBLIC_RUNLY_COMPANY aren't configured for this build yet.
export const runlySdk =
  baseUrl && company
    ? createStorefrontClient({
        baseUrl,
        company,
        ...(siteId ? { siteId } : {}),
        ...(supabaseUrl && supabaseAnonKey ? { supabaseUrl, supabaseAnonKey } : {}),
      })
    : null;
