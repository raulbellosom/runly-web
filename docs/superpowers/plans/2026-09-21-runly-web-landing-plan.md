# Runly Web Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the bilingual (ES/EN) Astro marketing site for runly.mx, faithful to the approved Stitch design (`C:\Users\raulb\Downloads\stitch_runly_erp_landing_page\code.html`), with a real module catalog sourced from `runly-erp`, a working SMTP-backed contact form, full SEO, and a Docker deploy config — in the new repo `runly-web`.

**Architecture:** Astro 5 with the `@astrojs/node` standalone adapter (contact form needs a live server), Tailwind CSS for styling (porting the Stitch design tokens), no client-side framework — all interactivity (mobile menu, module filter, FAQ accordion, scroll reveal, MirAI demo, contact form) is vanilla TypeScript inside `<script>` tags, same pattern the Stitch export already uses. `lucide-astro` replaces the Font Awesome CDN for icons (smaller payload, no icon font). Astro's native `i18n` routing serves `/` (Spanish, default) and `/en/` (English) from the same section components, driven by typed dictionaries.

**Tech Stack:** Astro 5, Tailwind CSS 3, `@astrojs/node`, `@astrojs/sitemap`, `lucide-astro`, `@fontsource/plus-jakarta-sans`, Zod, Nodemailer, Vitest (for logic-only unit tests), pnpm, Docker.

---

## Reference source

All section markup ports from `C:\Users\raulb\Downloads\stitch_runly_erp_landing_page\code.html` (1567 lines). Line ranges referenced per task below are from that exact file. The Spanish copy in that file is the approved copy — do not rephrase it. English copy is written fresh per task (faithful translation, same meaning and register, not machine-literal).

## Real module catalog (source of truth)

Pulled from `raulbellosom/runly-erp` at `apps/api/src/manifests/official/core-modules.js` and `feature-modules.js` (public repo, read via `gh api`). This is the exact list to hardcode in `src/data/modules.ts` (Task 8) — do not invent or omit modules:

| key | name (ES) | category | icon | color | version | notes |
|---|---|---|---|---|---|---|
| runly.core | Runly Core | sistema | Layers | #0A7BFF | 0.1.0 | núcleo, siempre presente |
| runly.identity | Identidad | sistema | Shield | #21C7FF | 0.1.0 | |
| runly.files | Archivos | sistema | FolderOpen | #f59e0b | 0.1.0 | |
| runly.company | Empresa | sistema | Building2 | #ec4899 | 0.1.0 | |
| runly.contacts | Contactos | operaciones | ContactRound | #0ea5e9 | 0.1.0 | |
| runly.hr | Recursos Humanos | operaciones | UsersRound | #2563eb | 0.1.0 | |
| runly.fleet | Flota | operaciones | Gauge | #14B8A6 | 0.5.1 | |
| runly.inventory | Inventario | operaciones | Boxes | #7c3aed | 1.0.0 | |
| runly.ledger | Libro de cuentas | finanzas | Landmark | #16a34a | 0.1.3 | |
| runly.pfm | Finanzas personales | finanzas | Wallet | #0ea5e9 | 0.5.0 | |
| runly.catalog | Catálogo | comercial | ShoppingBag | #F97316 | 2.1.0 | |
| runly.pos | POS | comercial | Store | #008C8C | 0.1.0 | punto de venta — YA existe, no es roadmap |
| runly.growth | Growth | comercial | TrendingUp | #7C3AED | 0.1.0 | |
| runly.website | Sitio web | plataforma | Globe | #6366f1 | 0.2.0 | CMS para sitios de clientes (tenant), no confundir con runly-web |
| runly.activity | Actividad | plataforma | Activity | #6366f1 | 0.1.0 | |
| runly.notifications | Notificaciones | plataforma | Bell | #0ea5e9 | 0.1.0 | |
| runly.calendar | Calendario | sistema | Calendar | #7C3AED | 0.1.0 | |
| runly.projects | Proyectos | productividad | SquareKanban | #09090b | 1.0.0 | |
| runly.documents | Documentos | productividad | Files | #0F766E | 0.1.0 | |
| runly.notes | Notas | productividad | NotebookPen | #f59e0b | 0.1.0 | |
| runly.chat | Chat | comunicacion | MessageSquare | #8b5cf6 | 0.2.0 | incluye llamadas y es donde vive MirAI |

**MirAI no tiene entrada propia**: es una capacidad (`chat.mirai.use`, asistente de inventario) dentro de `runly.chat` / `runly.inventory`. Se presenta en su propia sección de la landing (ya cubierta en el Stitch), no como card del catálogo.

**Roadmap honesto** (bloque "esto es solo el comienzo"): Facturación CFDI 4.0, Logística & Envíos, API Pública/Webhooks. **POS se retira del roadmap** porque ya existe como `runly.pos` — el Stitch original lo listaba como "Próximamente" por error de referencia; en `runly-web` se corrige.

Descriptions (ES) — usar tal cual, son las reales del manifiesto:
- core: "Núcleo del sistema: módulos, permisos, bitácora y configuración de instancia."
- identity: "Usuarios, roles, permisos, membresías y control de acceso."
- files: "Gestión de archivos, carga, almacenamiento y acceso seguro."
- company: "Perfil de empresa, dirección, marca visual e identidad corporativa."
- contacts: "Clientes, proveedores, personas y empresas."
- hr: "Colaboradores, notas internas y expedientes."
- fleet: "Gestión de flota vehicular: vehículos, reportes y asignación de conductores."
- inventory: "Gestión de inventario y activos de la empresa."
- ledger: "Registro bancario tipo hoja de cálculo: depósitos, retiros y saldo corriente."
- pfm: "Carteras de efectivo, débito y crédito con registro rápido de ingresos y egresos."
- catalog: "Gestiona productos, categorías, variantes e inventario."
- pos: "Punto de venta para restaurante, tienda y operaciones híbridas."
- growth: "Telemetría web, formularios y seguimiento de leads."
- website: "Sitio web público, editor visual de páginas y publicación de contenido."
- activity: "Bitácora legible de eventos y feed transversal de Runly ERP."
- notifications: "Alertas accionables para eventos importantes del sistema."
- calendar: "Calendario personal y compartido con eventos, recordatorios y vistas por día, semana y mes."
- projects: "Gestión de proyectos y tareas con vistas Kanban, Lista y Timeline."
- documents: "Plantillas versionadas y documentos PDF generados."
- notes: "Notas enriquecidas con editor de texto, carpetas, etiquetas y colaboración en tiempo real."
- chat: "Mensajería interna en tiempo real y chat de soporte para visitantes externos."

English descriptions are written in Task 8 (faithful translations of the above).

## Pending content the user must confirm before going live (do not invent)

- WhatsApp business number (Stitch has placeholder `5210000000000`).
- Support/sales email addresses (Stitch shows `contacto@runly.mx` / `hola@racoondevs.com` — confirm these inboxes exist before publishing).
- Hero product screenshot (Stitch uses a placeholder Google-hosted image; needs a real Runly screenshot or an honest recreation).
- SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `CONTACT_TO_EMAIL`).

These are wired as clearly-named constants/env vars (Tasks 9, 25-28), never hardcoded as if real.

---

## Phase 0 — Scaffold & configuration

### Task 1: Scaffold the Astro project — DONE (commit `3559225`)

**Deviation from the original plan (resolved):** the interactive `create-astro` CLI (`@clack/prompts`) requires a real TTY and hangs when run non-interactively in this environment, so Step 1 below was not run as literally written. The scaffold was hand-authored instead, per the task's own fallback clause, landing on Astro `^7.3.3` (current latest at scaffold time) rather than an assumed older major. This has downstream consequences already folded into Task 2 (Tailwind v4 CSS-first config instead of `tailwind.config.mjs`) and Task 4 (`@tailwindcss/vite` instead of `@astrojs/tailwind`) — read those tasks' own notes before starting them.

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (placeholder), `public/favicon.svg` (placeholder)

- [x] **Step 1: Run the Astro CLI scaffold**

Run:
```bash
pnpm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
```
Expected: creates `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `public/favicon.svg`, `package.json` in the current directory. It may ask to continue in a non-empty directory because `.git` and `docs/` already exist here confirm yes; `--no-git` was passed so it will not touch the existing git repo.

**Actually done:** hand-authored equivalents of all five files (see deviation note above), since the real CLI could not run non-interactively here.

- [x] **Step 2: Install dependencies**

Run: `pnpm install`
Expected: exits 0, creates `pnpm-lock.yaml` and `node_modules/`.

- [x] **Step 3: Verify dev server boots**

Run: `pnpm astro dev --port 4321 &` then `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321` (stop the server after with `kill %1`).
Expected: HTTP 200. Verified (200, body contains the placeholder `<h1>Runly Web</h1>`); also independently re-verified via `pnpm astro build` during code review.

- [x] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml astro.config.mjs tsconfig.json src public
git commit -m "chore: scaffold astro project"
```

### Task 2: Add Tailwind CSS integration (v4, CSS-first config)

**Note on Astro/Tailwind versions:** Task 1 ended up on Astro 7.3.3 (latest) instead of the Astro 5 assumed when this plan was originally drafted, because the interactive `create-astro` CLI could not run in this environment and the scaffold was hand-authored instead. Astro 5+ dropped the old `@astrojs/tailwind` integration in favor of Tailwind v4's own Vite plugin, and Tailwind v4 is CSS-first (no `tailwind.config.mjs` — design tokens live in an `@theme` block inside CSS). This task reflects that reality instead of the old `tailwind.config.mjs` approach.

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/styles/global.css`

- [ ] **Step 1: Add the Tailwind integration**

Run: `pnpm astro add tailwind -y`
Expected: installs `tailwindcss` and `@tailwindcss/vite`, and adds the Vite plugin to `astro.config.mjs` (an import of `@tailwindcss/vite` plus `vite: { plugins: [tailwindcss()] }` in the `defineConfig` call). If the installer instead adds the older `@astrojs/tailwind` integration and creates a `tailwind.config.mjs` (i.e. you are actually on Tailwind v3 tooling), stop and report DONE_WITH_CONCERNS — the steps below assume Tailwind v4; a v3 setup needs the config moved into `tailwind.config.mjs` instead of the `@theme` block in Step 2, and the directives in Task 3 need to stay as `@tailwind base/components/utilities` instead of `@import "tailwindcss";`.

- [ ] **Step 2: Write `src/styles/global.css` with the Runly design tokens in an `@theme` block**

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --font-sans: "Plus Jakarta Sans", system-ui, sans-serif;

  --color-runly-navy: #070d1e;
  --color-runly-midnight: #0b132b;
  --color-runly-darkcard: #111b38;
  --color-runly-orange: #ff5e14;
  --color-runly-amber: #ff9f1c;
  --color-runly-blue: #0e3a8c;
  --color-runly-surface: #f8fafc;
  --color-runly-border: rgba(226, 232, 240, 0.8);

  --shadow-glow-orange: 0 0 35px -5px rgba(255, 94, 20, 0.35);
  --shadow-glass: 0 8px 32px 0 rgba(11, 19, 43, 0.06);
  --shadow-glass-dark: 0 12px 40px 0 rgba(0, 0, 0, 0.45);
}
```

This is the CSS-first equivalent of the old `tailwind.config.mjs` `theme.extend` block: `--color-runly-navy` makes `bg-runly-navy`, `text-runly-navy`, `border-runly-navy`, etc. available automatically, and `--shadow-glow-orange` makes `shadow-glow-orange` available — no separate config file or `content` glob needed, Tailwind v4's Vite plugin scans the module graph automatically.

- [ ] **Step 3: Verify Tailwind builds**

Run: `pnpm astro build`
Expected: exits 0, `dist/` is generated with compiled CSS containing the `070d1e` custom color. At this point in the plan the project is still in the default static output mode (Task 4 switches to `output: "server"`, which moves the build to `dist/client/`), so check the flat path: `grep -ril "070d1e" dist/_astro/*.css | head -1` (or `dist/**/*.css` if Astro nests it further — run `find dist -name "*.css"` first if unsure) returns a match. Tailwind v4 lowercases hex colors in output.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs src/styles/global.css package.json pnpm-lock.yaml
git commit -m "chore: add tailwind v4 with runly design tokens"
```

### Task 3: Global CSS utilities (glass, gradient button, grid pattern, reveal-on-scroll)

**Files:**
- Modify: `src/styles/global.css` (created in Task 2 with the `@theme` block — this task appends to the same file, it does not replace it)

- [ ] **Step 1: Append the utility classes below the `@theme` block from Task 2**

```css
@layer utilities {
  .glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .glass-card-dark {
    background: rgba(17, 27, 56, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .runly-gradient-btn {
    background: linear-gradient(135deg, #ff5e14 0%, #ff9f1c 100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .runly-gradient-btn:hover {
    box-shadow: 0 10px 25px -5px rgba(255, 94, 20, 0.45);
    transform: translateY(-2px);
  }

  .text-gradient-orange {
    background: linear-gradient(135deg, #ff5e14 0%, #ff9f1c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .bg-grid-pattern {
    background-image: radial-gradient(rgba(14, 58, 140, 0.08) 1px, transparent 1px);
    background-size: 24px 24px;
  }

  .bg-grid-pattern-dark {
    background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 24px 24px;
  }
}

.reveal-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal-on-scroll {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "style: add glassmorphism and reveal-on-scroll utilities"
```

### Task 4: Configure i18n, sitemap, and the Node adapter in astro.config.mjs

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Install the remaining integrations**

Run: `pnpm astro add node sitemap -y`
Expected: installs `@astrojs/node` and `@astrojs/sitemap`, updates `astro.config.mjs`.

- [ ] **Step 2: Replace astro.config.mjs with the full config**

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://runly.mx",
  output: "server",
  adapter: node({ mode: "standalone" }),
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: { es: "es-MX", en: "en-US" },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Note: keep whatever Tailwind wiring Task 2 already put in place (the Vite plugin import/config) — this step's job is to add `i18n`, `sitemap`, and the `node` adapter around it, not to remove Tailwind. If Task 2 flagged that this project is actually on Tailwind v3 tooling (`@astrojs/tailwind` integration), keep `import tailwind from "@astrojs/tailwind";` and `tailwind()` in `integrations` instead of the `vite.plugins` block above.

- [ ] **Step 3: Verify build still succeeds**

Run: `pnpm astro build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs package.json pnpm-lock.yaml
git commit -m "chore: configure i18n, sitemap, and node adapter"
```

### Task 5: Add lucide-astro and self-hosted font

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

Run: `pnpm add lucide-astro @fontsource/plus-jakarta-sans`
Expected: both added to dependencies in package.json.

- [ ] **Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add lucide-astro and self-hosted font"
```

### Task 6: Environment variable scaffolding

**Files:**
- Create: `.env.example`, `src/env.d.ts`

- [ ] **Step 1: Write .env.example**

```bash
# SMTP (required for the contact form to actually send email, see docs/superpowers/specs/2026-09-21-runly-web-landing-design.md section 7)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM="Runly <no-reply@runly.mx>"
CONTACT_TO_EMAIL=

# Site
PUBLIC_SITE_URL=https://runly.mx
```

- [ ] **Step 2: Write src/env.d.ts**

```ts
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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 3: Commit**

```bash
git add .env.example src/env.d.ts
git commit -m "chore: document required environment variables"
```

## Phase 1 — Data and i18n foundation

### Task 7: i18n dictionary scaffolding

**Files:**
- Create: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`, `src/i18n/index.ts`
- Test: `src/i18n/__tests__/dictionary.test.ts`

- [ ] **Step 1: Add Vitest**

Run: `pnpm add -D vitest`
Add to package.json scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing test (dictionary key parity)**

```ts
// src/i18n/__tests__/dictionary.test.ts
import { describe, expect, it } from "vitest";
import { es } from "../es";
import { en } from "../en";

function collectKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj).flatMap(([key, value]) =>
    collectKeys(value, prefix ? `${prefix}.${key}` : key),
  );
}

describe("i18n dictionaries", () => {
  it("es and en expose exactly the same keys", () => {
    const esKeys = collectKeys(es).sort();
    const enKeys = collectKeys(en).sort();
    expect(enKeys).toEqual(esKeys);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL, cannot find module `../es` (files do not exist yet).

- [ ] **Step 4: Write the dictionary type contract**

```ts
// src/i18n/types.ts
export interface NavDictionary {
  platform: string;
  modules: string;
  rm3: string;
  mirai: string;
  implementation: string;
  contact: string;
  requestDemo: string;
}

export interface FooterDictionary {
  tagline: string;
  platformHeading: string;
  ecosystemHeading: string;
  legalHeading: string;
  uptime: string;
  copyright: string;
  builtBy: string;
  links: {
    modulesCatalog: string;
    rm3Architecture: string;
    mirai: string;
    customImplementation: string;
    officialModules: string;
    customDevelopment: string;
    communityPartners: string;
    apiDocs: string;
    privacyNotice: string;
    termsOfService: string;
    dataSecurity: string;
    supportContact: string;
  };
}

export interface SiteDictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: NavDictionary;
  footer: FooterDictionary;
}
```

- [ ] **Step 5: Write es.ts and en.ts with the nav and footer content**

```ts
// src/i18n/es.ts
import type { SiteDictionary } from "./types";

export const es: SiteDictionary = {
  meta: {
    title: "RUNLY ERP - Business in motion | Software modular y multiempresa",
    description:
      "RUNLY es el ERP modular, multiempresa y colaborativo de Racoon Devs. Elige los modulos que necesitas, conecta a tu equipo y haz crecer tu negocio.",
  },
  nav: {
    platform: "Plataforma",
    modules: "Modulos",
    rm3: "Arquitectura RM3",
    mirai: "MirAI",
    implementation: "Implementacion",
    contact: "Contacto",
    requestDemo: "Solicitar una demostracion",
  },
  footer: {
    tagline:
      "RUNLY - Business in motion. El sistema operativo modular, multiempresa y colaborativo para empresas que avanzan rapido.",
    platformHeading: "Plataforma",
    ecosystemHeading: "Ecosistema",
    legalHeading: "Legal y Empresa",
    uptime: "Todos los sistemas operativos en linea (99.98% uptime)",
    copyright: "RUNLY ERP - runly.mx. Todos los derechos reservados.",
    builtBy: "Desarrollado con pasion por",
    links: {
      modulesCatalog: "Catalogo de Modulos",
      rm3Architecture: "Arquitectura RM3",
      mirai: "MirAI (Inteligencia Artificial)",
      customImplementation: "Implementacion a Medida",
      officialModules: "Modulos Oficiales",
      customDevelopment: "Desarrollo Custom",
      communityPartners: "Community Partners",
      apiDocs: "Documentacion de API",
      privacyNotice: "Aviso de Privacidad",
      termsOfService: "Terminos de Servicio",
      dataSecurity: "Seguridad de Datos",
      supportContact: "Contacto de Soporte",
    },
  },
};
```

```ts
// src/i18n/en.ts
import type { SiteDictionary } from "./types";

export const en: SiteDictionary = {
  meta: {
    title: "RUNLY ERP - Business in motion | Modular, multi-company software",
    description:
      "RUNLY is Racoon Devs modular, multi-company, collaborative ERP. Pick the modules you need, connect your team, and grow your business.",
  },
  nav: {
    platform: "Platform",
    modules: "Modules",
    rm3: "RM3 Architecture",
    mirai: "MirAI",
    implementation: "Implementation",
    contact: "Contact",
    requestDemo: "Request a demo",
  },
  footer: {
    tagline:
      "RUNLY - Business in motion. The modular, multi-company, collaborative operating system for businesses that move fast.",
    platformHeading: "Platform",
    ecosystemHeading: "Ecosystem",
    legalHeading: "Legal & Company",
    uptime: "All systems operational (99.98% uptime)",
    copyright: "RUNLY ERP - runly.mx. All rights reserved.",
    builtBy: "Built with passion by",
    links: {
      modulesCatalog: "Module Catalog",
      rm3Architecture: "RM3 Architecture",
      mirai: "MirAI (Artificial Intelligence)",
      customImplementation: "Custom Implementation",
      officialModules: "Official Modules",
      customDevelopment: "Custom Development",
      communityPartners: "Community Partners",
      apiDocs: "API Documentation",
      privacyNotice: "Privacy Notice",
      termsOfService: "Terms of Service",
      dataSecurity: "Data Security",
      supportContact: "Support Contact",
    },
  },
};
```

- [ ] **Step 6: Write the locale resolver helper**

```ts
// src/i18n/index.ts
import { es } from "./es";
import { en } from "./en";
import type { SiteDictionary } from "./types";

export const dictionaries = { es, en } as const;
export type Locale = keyof typeof dictionaries;

export function getDictionary(locale: string): SiteDictionary {
  const key = (locale in dictionaries ? locale : "es") as Locale;
  return dictionaries[key];
}

export * from "./types";
```

- [ ] **Step 7: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS (1 test).

- [ ] **Step 8: Commit**

```bash
git add package.json src/i18n
git commit -m "feat: add i18n dictionary contract with parity test"
```

### Task 8: Real module catalog data (src/data/modules.ts)

**Files:**
- Create: `src/data/modules.ts`
- Test: `src/data/__tests__/modules.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/data/__tests__/modules.test.ts
import { describe, expect, it } from "vitest";
import { modules } from "../modules";

describe("modules catalog", () => {
  it("has exactly 21 real Runly modules", () => {
    expect(modules).toHaveLength(21);
  });

  it("every module has an ES and EN name and description", () => {
    for (const mod of modules) {
      expect(mod.name.es.length).toBeGreaterThan(0);
      expect(mod.name.en.length).toBeGreaterThan(0);
      expect(mod.description.es.length).toBeGreaterThan(0);
      expect(mod.description.en.length).toBeGreaterThan(0);
    }
  });

  it("does not list a MirAI entry as its own module", () => {
    expect(modules.find((m) => m.id === "runly.mirai")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL, cannot find module `../modules`.

- [ ] **Step 3: Write src/data/modules.ts**

Use the table in the "Real module catalog" section at the top of this plan for every field. Full file:

```ts
// src/data/modules.ts
export type ModuleStatus = "disponible" | "proximamente";
export type ModuleCategory =
  | "sistema"
  | "operaciones"
  | "finanzas"
  | "comercial"
  | "plataforma"
  | "productividad"
  | "comunicacion";

export interface RunlyModuleEntry {
  id: string;
  name: { es: string; en: string };
  description: { es: string; en: string };
  category: ModuleCategory;
  status: ModuleStatus;
  icon: string;
  color: string;
  version: string;
  order: number;
}

export const modules: RunlyModuleEntry[] = [
  {
    id: "runly.core",
    name: { es: "Runly Core", en: "Runly Core" },
    description: {
      es: "Nucleo del sistema: modulos, permisos, bitacora y configuracion de instancia.",
      en: "System core: modules, permissions, audit log, and instance configuration.",
    },
    category: "sistema",
    status: "disponible",
    icon: "Layers",
    color: "#0A7BFF",
    version: "0.1.0",
    order: 1,
  },
  {
    id: "runly.identity",
    name: { es: "Identidad", en: "Identity" },
    description: {
      es: "Usuarios, roles, permisos, membresias y control de acceso.",
      en: "Users, roles, permissions, memberships, and access control.",
    },
    category: "sistema",
    status: "disponible",
    icon: "Shield",
    color: "#21C7FF",
    version: "0.1.0",
    order: 2,
  },
  {
    id: "runly.files",
    name: { es: "Archivos", en: "Files" },
    description: {
      es: "Gestion de archivos, carga, almacenamiento y acceso seguro.",
      en: "File management, uploads, storage, and secure access.",
    },
    category: "sistema",
    status: "disponible",
    icon: "FolderOpen",
    color: "#f59e0b",
    version: "0.1.0",
    order: 3,
  },
  {
    id: "runly.company",
    name: { es: "Empresa", en: "Company" },
    description: {
      es: "Perfil de empresa, direccion, marca visual e identidad corporativa.",
      en: "Company profile, address, visual brand, and corporate identity.",
    },
    category: "sistema",
    status: "disponible",
    icon: "Building2",
    color: "#ec4899",
    version: "0.1.0",
    order: 4,
  },
  {
    id: "runly.contacts",
    name: { es: "Contactos", en: "Contacts" },
    description: {
      es: "Clientes, proveedores, personas y empresas.",
      en: "Customers, suppliers, people, and companies.",
    },
    category: "operaciones",
    status: "disponible",
    icon: "ContactRound",
    color: "#0ea5e9",
    version: "0.1.0",
    order: 5,
  },
  {
    id: "runly.hr",
    name: { es: "Recursos Humanos", en: "Human Resources" },
    description: {
      es: "Colaboradores, notas internas y expedientes.",
      en: "Employees, internal notes, and personnel files.",
    },
    category: "operaciones",
    status: "disponible",
    icon: "UsersRound",
    color: "#2563eb",
    version: "0.1.0",
    order: 6,
  },
  {
    id: "runly.fleet",
    name: { es: "Flota", en: "Fleet" },
    description: {
      es: "Gestion de flota vehicular: vehiculos, reportes y asignacion de conductores.",
      en: "Vehicle fleet management: vehicles, reports, and driver assignment.",
    },
    category: "operaciones",
    status: "disponible",
    icon: "Gauge",
    color: "#14B8A6",
    version: "0.5.1",
    order: 7,
  },
  {
    id: "runly.inventory",
    name: { es: "Inventario", en: "Inventory" },
    description: {
      es: "Gestion de inventario y activos de la empresa.",
      en: "Inventory and company asset management.",
    },
    category: "operaciones",
    status: "disponible",
    icon: "Boxes",
    color: "#7c3aed",
    version: "1.0.0",
    order: 8,
  },
  {
    id: "runly.ledger",
    name: { es: "Libro de cuentas", en: "Ledger" },
    description: {
      es: "Registro bancario tipo hoja de calculo: depositos, retiros y saldo corriente.",
      en: "Spreadsheet-style bank register: deposits, withdrawals, and running balance.",
    },
    category: "finanzas",
    status: "disponible",
    icon: "Landmark",
    color: "#16a34a",
    version: "0.1.3",
    order: 9,
  },
  {
    id: "runly.pfm",
    name: { es: "Finanzas personales", en: "Personal Finance" },
    description: {
      es: "Carteras de efectivo, debito y credito con registro rapido de ingresos y egresos.",
      en: "Cash, debit, and credit wallets with quick income and expense logging.",
    },
    category: "finanzas",
    status: "disponible",
    icon: "Wallet",
    color: "#0ea5e9",
    version: "0.5.0",
    order: 10,
  },
  {
    id: "runly.catalog",
    name: { es: "Catalogo", en: "Catalog" },
    description: {
      es: "Gestiona productos, categorias, variantes e inventario.",
      en: "Manage products, categories, variants, and inventory.",
    },
    category: "comercial",
    status: "disponible",
    icon: "ShoppingBag",
    color: "#F97316",
    version: "2.1.0",
    order: 11,
  },
  {
    id: "runly.pos",
    name: { es: "POS", en: "POS" },
    description: {
      es: "Punto de venta para restaurante, tienda y operaciones hibridas.",
      en: "Point of sale for restaurants, retail, and hybrid operations.",
    },
    category: "comercial",
    status: "disponible",
    icon: "Store",
    color: "#008C8C",
    version: "0.1.0",
    order: 12,
  },
  {
    id: "runly.growth",
    name: { es: "Growth", en: "Growth" },
    description: {
      es: "Telemetria web, formularios y seguimiento de leads.",
      en: "Web telemetry, forms, and lead tracking.",
    },
    category: "comercial",
    status: "disponible",
    icon: "TrendingUp",
    color: "#7C3AED",
    version: "0.1.0",
    order: 13,
  },
  {
    id: "runly.website",
    name: { es: "Sitio web", en: "Website" },
    description: {
      es: "Sitio web publico, editor visual de paginas y publicacion de contenido.",
      en: "Public website, visual page editor, and content publishing.",
    },
    category: "plataforma",
    status: "disponible",
    icon: "Globe",
    color: "#6366f1",
    version: "0.2.0",
    order: 14,
  },
  {
    id: "runly.activity",
    name: { es: "Actividad", en: "Activity" },
    description: {
      es: "Bitacora legible de eventos y feed transversal de Runly ERP.",
      en: "Human-readable event log and cross-module activity feed.",
    },
    category: "plataforma",
    status: "disponible",
    icon: "Activity",
    color: "#6366f1",
    version: "0.1.0",
    order: 15,
  },
  {
    id: "runly.notifications",
    name: { es: "Notificaciones", en: "Notifications" },
    description: {
      es: "Alertas accionables para eventos importantes del sistema.",
      en: "Actionable alerts for important system events.",
    },
    category: "plataforma",
    status: "disponible",
    icon: "Bell",
    color: "#0ea5e9",
    version: "0.1.0",
    order: 16,
  },
  {
    id: "runly.calendar",
    name: { es: "Calendario", en: "Calendar" },
    description: {
      es: "Calendario personal y compartido con eventos, recordatorios y vistas por dia, semana y mes.",
      en: "Personal and shared calendar with events, reminders, and day/week/month views.",
    },
    category: "sistema",
    status: "disponible",
    icon: "Calendar",
    color: "#7C3AED",
    version: "0.1.0",
    order: 17,
  },
  {
    id: "runly.projects",
    name: { es: "Proyectos", en: "Projects" },
    description: {
      es: "Gestion de proyectos y tareas con vistas Kanban, Lista y Timeline.",
      en: "Project and task management with Kanban, List, and Timeline views.",
    },
    category: "productividad",
    status: "disponible",
    icon: "SquareKanban",
    color: "#09090b",
    version: "1.0.0",
    order: 18,
  },
  {
    id: "runly.documents",
    name: { es: "Documentos", en: "Documents" },
    description: {
      es: "Plantillas versionadas y documentos PDF generados.",
      en: "Versioned templates and generated PDF documents.",
    },
    category: "productividad",
    status: "disponible",
    icon: "Files",
    color: "#0F766E",
    version: "0.1.0",
    order: 19,
  },
  {
    id: "runly.notes",
    name: { es: "Notas", en: "Notes" },
    description: {
      es: "Notas enriquecidas con editor de texto, carpetas, etiquetas y colaboracion en tiempo real.",
      en: "Rich notes with a text editor, folders, tags, and real-time collaboration.",
    },
    category: "productividad",
    status: "disponible",
    icon: "NotebookPen",
    color: "#f59e0b",
    version: "0.1.0",
    order: 20,
  },
  {
    id: "runly.chat",
    name: { es: "Chat", en: "Chat" },
    description: {
      es: "Mensajeria interna en tiempo real y chat de soporte para visitantes externos.",
      en: "Real-time internal messaging and support chat for external visitors.",
    },
    category: "comunicacion",
    status: "disponible",
    icon: "MessageSquare",
    color: "#8b5cf6",
    version: "0.2.0",
    order: 21,
  },
];

export const moduleCategories: { id: ModuleCategory | "all"; label: { es: string; en: string } }[] = [
  { id: "all", label: { es: "Todos", en: "All" } },
  { id: "comunicacion", label: { es: "Comunicacion", en: "Communication" } },
  { id: "operaciones", label: { es: "Operaciones", en: "Operations" } },
  { id: "finanzas", label: { es: "Finanzas", en: "Finance" } },
  { id: "comercial", label: { es: "Comercial", en: "Commercial" } },
  { id: "productividad", label: { es: "Productividad", en: "Productivity" } },
  { id: "plataforma", label: { es: "Plataforma", en: "Platform" } },
  { id: "sistema", label: { es: "Sistema", en: "System" } },
];

export interface RoadmapEntry {
  name: { es: string; en: string };
  icon: string;
}

export const roadmap: RoadmapEntry[] = [
  { name: { es: "Facturacion CFDI 4.0", en: "CFDI 4.0 Invoicing" }, icon: "Receipt" },
  { name: { es: "Logistica y Envios", en: "Logistics & Shipping" }, icon: "Truck" },
  { name: { es: "API Publica y Webhooks", en: "Public API & Webhooks" }, icon: "Plug" },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data
git commit -m "feat: add real Runly module catalog data"
```

### Task 9: Site-wide constants (src/consts.ts)

**Files:**
- Create: `src/consts.ts`

- [ ] **Step 1: Write the constants file**

```ts
// src/consts.ts

// PENDING: replace before production launch, see plan section
// "Pending content the user must confirm before going live".
export const CONTACT_WHATSAPP_NUMBER = "PENDING_CONFIRM_WHATSAPP_NUMBER";
export const CONTACT_SALES_EMAIL = "PENDING_CONFIRM_SALES_EMAIL";
export const CONTACT_SUPPORT_EMAIL = "PENDING_CONFIRM_SUPPORT_EMAIL";

export const SITE_NAME = "RUNLY";
export const SITE_TAGLINE = "Business in motion";
export const SITE_URL = "https://runly.mx";
export const COMPANY_NAME = "Racoon Devs";
export const COMPANY_URL = "https://racoondevs.com";
```

- [ ] **Step 2: Commit**

```bash
git add src/consts.ts
git commit -m "feat: add site-wide constants with pending contact placeholders"
```

## Phase 2 — Layout primitives

### Task 10: BaseLayout and SiteHead (SEO shell)

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/layout/SiteHead.astro`

- [ ] **Step 1: Write SiteHead.astro**

```astro
---
// src/components/layout/SiteHead.astro
import { SITE_URL, SITE_NAME, COMPANY_NAME } from "../../consts";

interface Props {
  title: string;
  description: string;
  locale: "es" | "en";
  path: string; // e.g. "/" or "/modulos" without locale prefix
}

const { title, description, locale, path } = Astro.props;

const esPath = path === "/" ? "/" : path;
const enPath = path === "/" ? "/en/" : `/en${path}`;
const canonicalPath = locale === "es" ? esPath : enPath;
const canonicalUrl = new URL(canonicalPath, SITE_URL).toString();
const esUrl = new URL(esPath, SITE_URL).toString();
const enUrl = new URL(enPath, SITE_URL).toString();

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: COMPANY_NAME,
      url: "https://racoondevs.com",
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description,
    },
  ],
};
---

<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl} />
<link rel="alternate" hreflang="es-MX" href={esUrl} />
<link rel="alternate" hreflang="en-US" href={enUrl} />
<link rel="alternate" hreflang="x-default" href={esUrl} />

<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:site_name" content={SITE_NAME} />
<meta property="og:image" content={new URL("/brand/og-cover.png", SITE_URL).toString()} />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={new URL("/brand/og-cover.png", SITE_URL).toString()} />

<link rel="icon" type="image/svg+xml" href="/favicon.svg" />

<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

- [ ] **Step 2: Write BaseLayout.astro**

```astro
---
// src/layouts/BaseLayout.astro
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "../styles/global.css";
import SiteHead from "../components/layout/SiteHead.astro";

interface Props {
  title: string;
  description: string;
  locale: "es" | "en";
  path: string;
}

const { title, description, locale, path } = Astro.props;
---

<!doctype html>
<html lang={locale} class="scroll-smooth">
  <head>
    <SiteHead title={title} description={description} locale={locale} path={path} />
  </head>
  <body class="bg-[#FCFDFF] text-slate-800 font-sans antialiased selection:bg-orange-500 selection:text-white">
    <slot />
    <script>
      const observerOptions = { root: null, rootMargin: "0px 0px -60px 0px", threshold: 0.1 };
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      }, observerOptions);
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => revealObserver.observe(el));
    </script>
  </body>
</html>
```

- [ ] **Step 3: Verify typecheck**

Run: `pnpm astro check`
Expected: 0 errors (there is nothing importing these files yet, so Astro only checks syntax — that is expected at this stage).

- [ ] **Step 4: Commit**

```bash
git add src/layouts src/components/layout/SiteHead.astro
git commit -m "feat: add base layout and SEO head component"
```

### Task 11: Header with nav and mobile menu

**Files:**
- Create: `src/components/layout/Header.astro`

Port structure from `code.html` lines 90-133. Replace the placeholder Google-hosted logo `src` with `/brand/runly-logo-light.png` (copied in Task 32). Icons: `fa-arrow-right` becomes `ArrowRight`, `fa-bars` becomes `Menu`.

- [ ] **Step 1: Write Header.astro**

```astro
---
// src/components/layout/Header.astro
import { Menu, ArrowRight } from "lucide-astro";
import type { NavDictionary } from "../../i18n/types";

interface Props {
  locale: "es" | "en";
  nav: NavDictionary;
}

const { locale, nav } = Astro.props;
const prefix = locale === "es" ? "" : "/en";

const links = [
  { href: "#hero", label: nav.platform },
  { href: "#modulos", label: nav.modules },
  { href: "#motor-rm3", label: nav.rm3 },
  { href: "#mirai", label: nav.mirai, badge: "IA" },
  { href: "#implementacion", label: nav.implementation },
  { href: "#contacto", label: nav.contact },
];
---

<header class="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all duration-300">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
    <a aria-label="RUNLY" class="flex items-center gap-2" href={`${prefix}/`}>
      <img alt="RUNLY - Business in motion" class="h-9 w-auto object-contain" src="/brand/runly-logo-light.png" width="140" height="36" />
    </a>
    <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
      {links.map((link) => (
        <a class="hover:text-runly-orange transition-colors flex items-center gap-1.5" href={link.href}>
          <span>{link.label}</span>
          {link.badge && (
            <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">{link.badge}</span>
          )}
        </a>
      ))}
    </nav>
    <div class="flex items-center gap-4">
      <a class="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm runly-gradient-btn shadow-sm" href="#contacto">
        <span>{nav.requestDemo}</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <button aria-label="Toggle menu" class="md:hidden p-2 text-slate-700 hover:text-runly-orange rounded-lg focus:outline-none" id="mobileMenuBtn">
        <Menu class="w-6 h-6" />
      </button>
    </div>
  </div>
  <div class="hidden md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3" id="mobileMenu">
    {links.map((link) => (
      <a class="block py-2 text-sm font-medium text-slate-700 hover:text-runly-orange" href={link.href}>{link.label}</a>
    ))}
    <a class="w-full text-center py-3 rounded-xl text-white font-medium text-sm runly-gradient-btn block mt-2" href="#contacto">
      {nav.requestDemo}
    </a>
  </div>
</header>

<script>
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle("hidden");
    });
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target as Node) && !mobileBtn.contains(e.target as Node)) {
        mobileMenu.classList.add("hidden");
      }
    });
  }
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Header.astro
git commit -m "feat: add header with nav and mobile menu"
```

### Task 12: Footer

**Files:**
- Create: `src/components/layout/Footer.astro`

Port content from `code.html` lines 1361-1417. Logo swaps to the real asset; year is computed, not hardcoded.

- [ ] **Step 1: Write Footer.astro**

```astro
---
// src/components/layout/Footer.astro
import type { FooterDictionary } from "../../i18n/types";
import { COMPANY_NAME, COMPANY_URL } from "../../consts";

interface Props {
  locale: "es" | "en";
  footer: FooterDictionary;
}

const { footer } = Astro.props;
const year = new Date().getFullYear();
---

<footer class="bg-runly-navy text-white pt-16 pb-12 border-t border-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
      <div class="lg:col-span-2 space-y-4">
        <img alt="RUNLY" class="h-9 w-auto object-contain" src="/brand/runly-logo-dark.png" width="140" height="36" />
        <p class="text-sm text-slate-400 max-w-sm">{footer.tagline}</p>
        <div class="pt-2 text-xs text-slate-400">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
          <span>{footer.uptime}</span>
        </div>
      </div>
      <div>
        <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">{footer.platformHeading}</h4>
        <ul class="space-y-2.5 text-xs text-slate-400">
          <li><a class="hover:text-orange-400 transition-colors" href="#modulos">{footer.links.modulesCatalog}</a></li>
          <li><a class="hover:text-orange-400 transition-colors" href="#motor-rm3">{footer.links.rm3Architecture}</a></li>
          <li><a class="hover:text-orange-400 transition-colors" href="#mirai">{footer.links.mirai}</a></li>
          <li><a class="hover:text-orange-400 transition-colors" href="#implementacion">{footer.links.customImplementation}</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">{footer.ecosystemHeading}</h4>
        <ul class="space-y-2.5 text-xs text-slate-400">
          <li><a class="hover:text-orange-400 transition-colors" href="#modulos">{footer.links.officialModules}</a></li>
          <li><a class="hover:text-orange-400 transition-colors" href="#modulos">{footer.links.customDevelopment}</a></li>
          <li><span class="cursor-default">{footer.links.communityPartners}</span></li>
          <li><span class="cursor-default">{footer.links.apiDocs}</span></li>
        </ul>
      </div>
      <div>
        <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">{footer.legalHeading}</h4>
        <ul class="space-y-2.5 text-xs text-slate-400">
          <li><span class="cursor-default">{footer.links.privacyNotice}</span></li>
          <li><span class="cursor-default">{footer.links.termsOfService}</span></li>
          <li><span class="cursor-default">{footer.links.dataSecurity}</span></li>
          <li><a class="hover:text-orange-400 transition-colors" href="#contacto">{footer.links.supportContact}</a></li>
        </ul>
      </div>
    </div>
    <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
      <p>&copy; {year} {footer.copyright}</p>
      <p class="flex items-center gap-1">
        <span>{footer.builtBy}</span>
        <a class="text-white hover:text-orange-400 font-semibold transition-colors" href={COMPANY_URL} rel="noopener noreferrer" target="_blank">{COMPANY_NAME}</a>
      </p>
    </div>
  </div>
</footer>
```

Note: `privacyNotice`/`termsOfService`/`dataSecurity` render as plain text, not links, because those pages do not exist yet (do not link to a 404). Add them as real `/legal/*` pages in a follow-up plan once the legal copy exists — out of scope here per the design spec section 11.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.astro
git commit -m "feat: add footer"
```

### Task 13: Shared UI primitives

**Files:**
- Create: `src/components/ui/SectionHeading.astro`, `src/components/ui/GlassCard.astro`

- [ ] **Step 1: Write SectionHeading.astro**

```astro
---
// src/components/ui/SectionHeading.astro
interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}

const { eyebrow, title, description, align = "center", dark = false } = Astro.props;
const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
---

<div class={`max-w-3xl mb-16 ${alignClass}`}>
  <h2 class={`text-sm font-bold uppercase tracking-widest mb-2 ${dark ? "text-orange-400" : "text-orange-600"}`}>{eyebrow}</h2>
  <p class={`text-3xl sm:text-4xl font-extrabold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>{title}</p>
  {description && <p class={`mt-4 text-base sm:text-lg ${dark ? "text-slate-300" : "text-slate-600"}`}>{description}</p>}
</div>
```

- [ ] **Step 2: Write GlassCard.astro**

```astro
---
// src/components/ui/GlassCard.astro
interface Props {
  class?: string;
  dark?: boolean;
}

const { class: className = "", dark = false } = Astro.props;
---

<div class={`${dark ? "glass-card-dark" : "glass-card"} rounded-2xl ${className}`}>
  <slot />
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui
git commit -m "feat: add SectionHeading and GlassCard primitives"
```

## Phase 3 — Content sections

Each section task extends the i18n dictionary (Modify `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts` by adding one new top-level key to `SiteDictionary`) and then adds the matching Astro component. After writing the dictionary addition, re-run `pnpm test` (dictionary parity test from Task 7) before moving on — this catches missing translations immediately.

### Task 14: Hero section

Source: `code.html` lines 136-219.

**Files:**
- Modify: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`
- Create: `src/components/sections/Hero.astro`

- [ ] **Step 1: Add the `hero` key to the dictionary type**

Append inside `SiteDictionary` in `src/i18n/types.ts`:

```ts
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badgeModular: string;
    badgeMultiCompany: string;
    badgeCustomizable: string;
    windowUrl: string;
    floatingMultiBranchTitle: string;
    floatingMultiBranchSubtitle: string;
    floatingMiraiTitle: string;
    floatingMiraiSubtitle: string;
  };
```

- [ ] **Step 2: Add the `hero` content to es.ts (insert before the closing brace of the exported object)**

```ts
  hero: {
    badge: "Tu empresa. Tu manera de trabajar.",
    titleLine1: "Tu empresa en movimiento.",
    titleLine2: "Todo conectado con RUNLY.",
    subtitle:
      "Gestiona tus operaciones desde una sola plataforma. Elige los modulos que necesitas, conecta a tu equipo y haz crecer tu negocio con un ERP que se adapta a ti.",
    ctaPrimary: "Descubre RUNLY",
    ctaSecondary: "Solicitar una demostracion",
    badgeModular: "Modular",
    badgeMultiCompany: "Multiempresa",
    badgeCustomizable: "Personalizable",
    windowUrl: "app.runly.mx/dashboard",
    floatingMultiBranchTitle: "Multisucursal conectada",
    floatingMultiBranchSubtitle: "2 empresas sincronizadas",
    floatingMiraiTitle: "MirAI asistente listo",
    floatingMiraiSubtitle: "100% contextual activo",
  },
```

- [ ] **Step 3: Add the matching `hero` content to en.ts**

```ts
  hero: {
    badge: "Your business. Your way of working.",
    titleLine1: "Your business in motion.",
    titleLine2: "Everything connected with RUNLY.",
    subtitle:
      "Manage your operations from a single platform. Choose the modules you need, connect your team, and grow your business with an ERP that adapts to you.",
    ctaPrimary: "Discover RUNLY",
    ctaSecondary: "Request a demo",
    badgeModular: "Modular",
    badgeMultiCompany: "Multi-company",
    badgeCustomizable: "Customizable",
    windowUrl: "app.runly.mx/dashboard",
    floatingMultiBranchTitle: "Connected multi-branch",
    floatingMultiBranchSubtitle: "2 companies synced",
    floatingMiraiTitle: "MirAI assistant ready",
    floatingMiraiSubtitle: "100% contextual active",
  },
```

- [ ] **Step 4: Run the dictionary parity test**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write Hero.astro**

```astro
---
// src/components/sections/Hero.astro
import { Boxes, Building2, SlidersHorizontal, Lock, Network, Sparkles } from "lucide-astro";
import type { SiteDictionary } from "../../i18n/types";

interface Props {
  dict: SiteDictionary;
}

const { dict } = Astro.props;
const { hero } = dict;
---

<section class="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-grid-pattern" id="hero">
  <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-400/15 via-blue-500/10 to-transparent blur-3xl pointer-events-none rounded-full -z-10"></div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-200 bg-orange-50/80 backdrop-blur text-xs font-semibold text-orange-600 mb-6 shadow-sm">
      <span class="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
      <span>{hero.badge}</span>
    </div>
    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
      {hero.titleLine1} <br class="hidden sm:block" />
      <span class="text-gradient-orange">{hero.titleLine2}</span>
    </h1>
    <p class="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-9 font-normal leading-relaxed">{hero.subtitle}</p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
      <a class="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-semibold text-base runly-gradient-btn shadow-md" href="#modulos">{hero.ctaPrimary}</a>
      <a class="w-full sm:w-auto px-8 py-3.5 rounded-xl text-slate-700 bg-white/90 hover:bg-white border border-slate-300 font-semibold text-base backdrop-blur transition-all hover:border-slate-400 hover:shadow-sm" href="#contacto">{hero.ctaSecondary}</a>
    </div>
    <div class="flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-500 mb-14">
      <span class="flex items-center gap-1.5"><Boxes class="w-4 h-4 text-orange-500" /> {hero.badgeModular}</span>
      <span class="text-slate-300">&bull;</span>
      <span class="flex items-center gap-1.5"><Building2 class="w-4 h-4 text-blue-600" /> {hero.badgeMultiCompany}</span>
      <span class="text-slate-300">&bull;</span>
      <span class="flex items-center gap-1.5"><SlidersHorizontal class="w-4 h-4 text-emerald-500" /> {hero.badgeCustomizable}</span>
    </div>
    <div class="relative max-w-5xl mx-auto mt-6">
      <div class="relative rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200/50 shadow-2xl border border-slate-300/60">
        <div class="bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-800">
          <div class="h-9 px-4 bg-slate-950/80 flex items-center justify-between border-b border-slate-800/80">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Lock class="w-3 h-3 text-emerald-400" />
              <span>{hero.windowUrl}</span>
            </div>
            <div class="w-10"></div>
          </div>
          <div class="relative">
            <img
              alt="RUNLY - interfaz principal"
              class="w-full h-auto object-cover select-none"
              src="/brand/product-dashboard-preview.png"
              width="1600"
              height="960"
              loading="eager"
            />
          </div>
        </div>
      </div>
      <div class="hidden lg:flex items-center gap-3 absolute -left-6 top-1/4 p-3.5 rounded-xl glass-card shadow-glass border border-white/90">
        <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Network class="w-5 h-5" />
        </div>
        <div class="text-left">
          <p class="text-xs font-semibold text-slate-900">{hero.floatingMultiBranchTitle}</p>
          <p class="text-[11px] text-slate-500">{hero.floatingMultiBranchSubtitle}</p>
        </div>
      </div>
      <div class="hidden lg:flex items-center gap-3 absolute -right-6 bottom-1/4 p-3.5 rounded-xl glass-card shadow-glass border border-white/90">
        <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
          <Sparkles class="w-5 h-5" />
        </div>
        <div class="text-left">
          <p class="text-xs font-semibold text-slate-900">{hero.floatingMiraiTitle}</p>
          <p class="text-[11px] text-emerald-600 font-medium">&#9679; {hero.floatingMiraiSubtitle}</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

Note: `product-dashboard-preview.png` does not exist yet. Task 32 (brand assets) copies a real screenshot once the user provides one; until then use a neutral placeholder image of the same aspect ratio so layout does not break, and track this as a known gap in the final report (do not claim it is a real screenshot).

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/components/sections/Hero.astro
git commit -m "feat: add hero section"
```

### Task 15: Flexibility section (4-card grid)

Source: `code.html` lines 220-277.

**Files:**
- Modify: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`
- Create: `src/components/sections/FlexibilitySection.astro`

- [ ] **Step 1: Add the `flexibility` key to types.ts**

```ts
  flexibility: {
    eyebrow: string;
    title: string;
    description: string;
    cards: { icon: string; color: string; title: string; description: string }[];
  };
```

- [ ] **Step 2: Add content to es.ts**

```ts
  flexibility: {
    eyebrow: "Flexibilidad sin ataduras",
    title: "No cambies tu forma de trabajar para adaptarte a un software.",
    description:
      "RUNLY se adapta a tus procesos, tu equipo y tus necesidades. Comienza con las herramientas que necesitas y amplia tu plataforma conforme evoluciona tu empresa.",
    cards: [
      {
        icon: "PuzzlePiece",
        color: "orange",
        title: "Modular por naturaleza",
        description:
          "Instala y utiliza solo lo que necesitas. Activa o desactiva modulos con un clic sin alterar la estabilidad del sistema.",
      },
      {
        icon: "Zap",
        color: "blue",
        title: "Todo conectado",
        description:
          "Informacion sincronizada en tiempo real. Un contacto creado en el chat se refleja inmediatamente en cotizaciones y proyectos.",
      },
      {
        icon: "Building2",
        color: "purple",
        title: "Un espacio para cada empresa",
        description:
          "Multiempresa con aislamiento estricto y roles definidos. Alterna entre razones sociales sin cerrar sesion.",
      },
      {
        icon: "TrendingUp",
        color: "emerald",
        title: "Crece a tu ritmo",
        description:
          "Escalabilidad sin fricciones. Pasa de 3 a 300 colaboradores sin costos desproporcionados ni migraciones dolorosas.",
      },
    ],
  },
```

- [ ] **Step 3: Add content to en.ts**

```ts
  flexibility: {
    eyebrow: "Flexibility without strings attached",
    title: "Do not change how you work to fit a piece of software.",
    description:
      "RUNLY adapts to your processes, your team, and your needs. Start with the tools you need and expand your platform as your company grows.",
    cards: [
      {
        icon: "PuzzlePiece",
        color: "orange",
        title: "Modular by nature",
        description:
          "Install and use only what you need. Turn modules on or off with one click without affecting system stability.",
      },
      {
        icon: "Zap",
        color: "blue",
        title: "Everything connected",
        description:
          "Information synced in real time. A contact created in chat is instantly reflected in quotes and projects.",
      },
      {
        icon: "Building2",
        color: "purple",
        title: "A space for every company",
        description:
          "Multi-company with strict isolation and defined roles. Switch between legal entities without logging out.",
      },
      {
        icon: "TrendingUp",
        color: "emerald",
        title: "Grow at your own pace",
        description:
          "Frictionless scalability. Go from 3 to 300 employees without disproportionate costs or painful migrations.",
      },
    ],
  },
```

- [ ] **Step 4: Run test**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write FlexibilitySection.astro**

```astro
---
// src/components/sections/FlexibilitySection.astro
import { Puzzle, Zap, Building2, TrendingUp } from "lucide-astro";
import SectionHeading from "../ui/SectionHeading.astro";
import type { SiteDictionary } from "../../i18n/types";

interface Props {
  dict: SiteDictionary;
}

const { dict } = Astro.props;
const { flexibility } = dict;

const iconMap = { PuzzlePiece: Puzzle, Zap, Building2, TrendingUp } as const;
const colorMap: Record<string, string> = {
  orange: "bg-orange-100 text-orange-600 hover:border-orange-300",
  blue: "bg-blue-100 text-blue-600 hover:border-blue-300",
  purple: "bg-purple-100 text-purple-600 hover:border-purple-300",
  emerald: "bg-emerald-100 text-emerald-600 hover:border-emerald-300",
};
---

<section class="py-20 bg-slate-50/70 border-y border-slate-200/70 relative reveal-on-scroll">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeading eyebrow={flexibility.eyebrow} title={flexibility.title} description={flexibility.description} />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {flexibility.cards.map((card) => {
        const Icon = iconMap[card.icon as keyof typeof iconMap];
        return (
          <div class={`glass-card p-7 rounded-2xl transition-all duration-300 hover:shadow-lg ${colorMap[card.color]?.split(" ").slice(2).join(" ")}`}>
            <div class={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 ${colorMap[card.color]?.split(" ").slice(0, 2).join(" ")}`}>
              <Icon class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
            <p class="text-sm text-slate-600 leading-relaxed">{card.description}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>
```

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/components/sections/FlexibilitySection.astro
git commit -m "feat: add flexibility section"
```

### Task 16: Modules catalog section (data-driven, filterable)

Source: `code.html` lines 278-539. This is the only section driven by `src/data/modules.ts` (Task 8) instead of literal copy in the dictionary — the dictionary only holds the section heading and the two static microcopy strings (roadmap intro, filter aria-labels).

**Files:**
- Modify: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`
- Create: `src/components/sections/ModulesCatalogSection.astro`

- [ ] **Step 1: Add the `modulesCatalog` key to types.ts**

```ts
  modulesCatalog: {
    eyebrow: string;
    title: string;
    description: string;
    roadmapTitle: string;
    roadmapDescription: string;
    comingSoonLabel: string;
    viewModuleLabel: string;
  };
```

- [ ] **Step 2: Add content to es.ts**

```ts
  modulesCatalog: {
    eyebrow: "Catalogo RUNLY Core",
    title: "Un ecosistema completo para hacer funcionar tu empresa.",
    description:
      "Desde la colaboracion de tu equipo hasta la organizacion de tus recursos y operaciones, RUNLY reune diferentes herramientas en un mismo lugar.",
    roadmapTitle: "Y esto es solo el comienzo. RUNLY evoluciona constantemente.",
    roadmapDescription:
      "Nuestro equipo en Racoon Devs despliega nuevos modulos y mejoras mensualmente. Todos los clientes con soporte activo reciben acceso inmediato a las actualizaciones.",
    comingSoonLabel: "Proximamente",
    viewModuleLabel: "Ver modulo",
  },
```

- [ ] **Step 3: Add content to en.ts**

```ts
  modulesCatalog: {
    eyebrow: "RUNLY Core Catalog",
    title: "A complete ecosystem to run your business.",
    description:
      "From your team collaboration to organizing your resources and operations, RUNLY brings different tools together in one place.",
    roadmapTitle: "And this is just the beginning. RUNLY keeps evolving.",
    roadmapDescription:
      "Our team at Racoon Devs ships new modules and improvements every month. All clients with active support get immediate access to updates.",
    comingSoonLabel: "Coming soon",
    viewModuleLabel: "View module",
  },
```

- [ ] **Step 4: Run test**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write ModulesCatalogSection.astro**

```astro
---
// src/components/sections/ModulesCatalogSection.astro
import * as Icons from "lucide-astro";
import SectionHeading from "../ui/SectionHeading.astro";
import { modules, moduleCategories, roadmap } from "../../data/modules";
import type { SiteDictionary } from "../../i18n/types";

interface Props {
  dict: SiteDictionary;
  locale: "es" | "en";
}

const { dict, locale } = Astro.props;
const { modulesCatalog } = dict;
---

<section class="py-24 bg-white relative" id="modulos">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeading eyebrow={modulesCatalog.eyebrow} title={modulesCatalog.title} description={modulesCatalog.description} />

    <div class="flex flex-wrap items-center justify-center gap-2 mb-12" data-purpose="module-filters">
      {moduleCategories.map((cat, i) => (
        <button
          class={`filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${i === 0 ? "active bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          data-filter={cat.id}
        >
          {cat.label[locale]}{cat.id === "all" ? ` (${modules.length})` : ""}
        </button>
      ))}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="modulesGrid">
      {modules.map((mod) => {
        const Icon = (Icons as Record<string, any>)[mod.icon] ?? Icons.Boxes;
        return (
          <div class="module-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between" data-category={mod.category}>
            <div>
              <div class="w-12 h-12 rounded-xl text-white flex items-center justify-center text-xl mb-3 shadow-sm" style={`background-color:${mod.color}`}>
                <Icon class="w-5 h-5" />
              </div>
              <h3 class="font-bold text-slate-900 text-base">{mod.name[locale]}</h3>
              <p class="text-xs text-slate-400 mb-2">Runly ERP</p>
              <p class="text-xs text-slate-600 leading-relaxed mb-4">{mod.description[locale]}</p>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-400 font-mono">v{mod.version}</span>
            </div>
          </div>
        );
      })}
    </div>

    <div class="mt-16 p-8 rounded-3xl bg-slate-50 border border-dashed border-slate-300">
      <div class="max-w-3xl mb-8">
        <h3 class="text-xl font-bold text-slate-900 mb-2">{modulesCatalog.roadmapTitle}</h3>
        <p class="text-sm text-slate-600">{modulesCatalog.roadmapDescription}</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {roadmap.map((item) => {
          const Icon = (Icons as Record<string, any>)[item.icon] ?? Icons.Boxes;
          return (
            <div class="p-4 rounded-xl bg-white border border-slate-200 text-center hover:border-orange-300 transition-colors">
              <Icon class="w-5 h-5 text-orange-500 mb-2 mx-auto" />
              <p class="text-xs font-bold text-slate-800">{item.name[locale]}</p>
              <span class="text-[10px] text-slate-400 font-medium">{modulesCatalog.comingSoonLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</section>

<script>
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".module-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("bg-slate-900", "text-white");
        b.classList.add("bg-slate-100", "text-slate-600");
      });
      btn.classList.remove("bg-slate-100", "text-slate-600");
      btn.classList.add("bg-slate-900", "text-white");
      const category = btn.getAttribute("data-filter");
      cards.forEach((card) => {
        const match = category === "all" || card.getAttribute("data-category") === category;
        (card as HTMLElement).style.display = match ? "flex" : "none";
      });
    });
  });
</script>
```

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/components/sections/ModulesCatalogSection.astro
git commit -m "feat: add data-driven modules catalog section with filtering"
```

### Task 17: RM3 architecture section

Source: `code.html` lines 540-647.

**Files:**
- Modify: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`
- Create: `src/components/sections/Rm3ArchitectureSection.astro`

- [ ] **Step 1: Add the `rm3` key to types.ts**

```ts
  rm3: {
    badge: string;
    title: string;
    description: string;
    coreTitle: string;
    coreSubtitle: string;
    coreDescription: string;
    leftNodes: { icon: string; label: string; tag: string }[];
    rightNodes: { icon: string; label: string; tag: string }[];
    pillars: { icon: string; title: string; description: string }[];
  };
```

- [ ] **Step 2: Add content to es.ts**

```ts
  rm3: {
    badge: "Arquitectura de vanguardia",
    title: "Una plataforma. Infinitas posibilidades de adaptacion.",
    description:
      "RUNLY esta construido sobre el motor modular RM3, disenado para desacoplar procesos, permitir microservicios estables y garantizar actualizaciones sin interrupciones operativas.",
    coreTitle: "RUNLY CORE",
    coreSubtitle: "Motor Modular RM3",
    coreDescription: "Orquestador de eventos, autenticacion federada, control de acceso RBAC y sincronizacion global.",
    leftNodes: [
      { icon: "Boxes", label: "Inventario Core", tag: "Micro-app" },
      { icon: "MessageCircle", label: "Chat en Tiempo Real", tag: "Websockets" },
      { icon: "Building2", label: "Multi-Tenant Hub", tag: "Aislamiento" },
    ],
    rightNodes: [
      { icon: "Sparkles", label: "Motor MirAI", tag: "LLM Context" },
      { icon: "GitBranch", label: "Modulos Custom", tag: "A la medida" },
      { icon: "CloudUpload", label: "APIs Externas", tag: "Bancos / SAT" },
    ],
    pillars: [
      {
        icon: "Boxes",
        title: "Modulos independientes integrables",
        description:
          "Cada modulo funciona como un componente desacoplado. Puedes actualizar o migrar un area especifica sin riesgo de caidas generales.",
      },
      {
        icon: "Split",
        title: "Ampliacion dinamica",
        description:
          "Incorpora campos personalizados, reportes especificos y nuevos flujos sin romper la compatibilidad con futuras versiones de RUNLY.",
      },
      {
        icon: "ShieldCheck",
        title: "Flexibilidad operativa segura",
        description:
          "Garantia de rendimiento optimo con control minucioso sobre permisos, trazabilidad de accesos y auditoria de cambios.",
      },
    ],
  },
```

- [ ] **Step 3: Add content to en.ts**

```ts
  rm3: {
    badge: "Cutting-edge architecture",
    title: "One platform. Infinite ways to adapt.",
    description:
      "RUNLY is built on the RM3 modular engine, designed to decouple processes, enable stable microservices, and guarantee updates with zero operational downtime.",
    coreTitle: "RUNLY CORE",
    coreSubtitle: "RM3 Modular Engine",
    coreDescription: "Event orchestrator, federated authentication, RBAC access control, and global synchronization.",
    leftNodes: [
      { icon: "Boxes", label: "Core Inventory", tag: "Micro-app" },
      { icon: "MessageCircle", label: "Real-time Chat", tag: "Websockets" },
      { icon: "Building2", label: "Multi-Tenant Hub", tag: "Isolation" },
    ],
    rightNodes: [
      { icon: "Sparkles", label: "MirAI Engine", tag: "LLM Context" },
      { icon: "GitBranch", label: "Custom Modules", tag: "Tailor-made" },
      { icon: "CloudUpload", label: "External APIs", tag: "Banks / Tax authority" },
    ],
    pillars: [
      {
        icon: "Boxes",
        title: "Independent, integrable modules",
        description:
          "Each module works as a decoupled component. You can update or migrate one specific area without risking a system-wide outage.",
      },
      {
        icon: "Split",
        title: "Dynamic expansion",
        description:
          "Add custom fields, specific reports, and new flows without breaking compatibility with future versions of RUNLY.",
      },
      {
        icon: "ShieldCheck",
        title: "Secure operational flexibility",
        description:
          "Guaranteed optimal performance with fine-grained control over permissions, access traceability, and change auditing.",
      },
    ],
  },
```

- [ ] **Step 4: Run test**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write Rm3ArchitectureSection.astro**

```astro
---
// src/components/sections/Rm3ArchitectureSection.astro
import * as Icons from "lucide-astro";
import { Atom } from "lucide-astro";
import type { SiteDictionary } from "../../i18n/types";

interface Props {
  dict: SiteDictionary;
}

const { dict } = Astro.props;
const { rm3 } = dict;

function nodeIcon(name: string) {
  return (Icons as Record<string, any>)[name] ?? Icons.Boxes;
}
---

<section class="py-24 bg-runly-navy text-white relative overflow-hidden bg-grid-pattern-dark reveal-on-scroll" id="motor-rm3">
  <div class="absolute -top-40 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-40 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <span class="text-xs font-bold text-orange-400 uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">{rm3.badge}</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4">{rm3.title}</h2>
      <p class="mt-4 text-base sm:text-lg text-slate-300">{rm3.description}</p>
    </div>

    <div class="my-16 p-8 rounded-3xl glass-card-dark border border-slate-700/60 max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div class="space-y-4">
          {rm3.leftNodes.map((node) => {
            const Icon = nodeIcon(node.icon);
            return (
              <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <Icon class="w-4 h-4 text-orange-400" />
                  <span class="text-sm font-semibold">{node.label}</span>
                </div>
                <span class="text-[10px] font-mono text-slate-400">{node.tag}</span>
              </div>
            );
          })}
        </div>
        <div class="text-center p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-runly-midnight border-2 border-orange-500/80 shadow-glow-orange relative">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-orange-500/20 border border-orange-500 flex items-center justify-center text-orange-400 mb-4">
            <Atom class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-extrabold text-white">{rm3.coreTitle}</h3>
          <p class="text-xs text-orange-400 font-mono mt-1">{rm3.coreSubtitle}</p>
          <p class="text-xs text-slate-300 mt-3">{rm3.coreDescription}</p>
        </div>
        <div class="space-y-4">
          {rm3.rightNodes.map((node) => {
            const Icon = nodeIcon(node.icon);
            return (
              <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <Icon class="w-4 h-4 text-pink-400" />
                  <span class="text-sm font-semibold">{node.label}</span>
                </div>
                <span class="text-[10px] font-mono text-slate-400">{node.tag}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {rm3.pillars.map((pillar) => {
        const Icon = nodeIcon(pillar.icon);
        return (
          <div class="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Icon class="w-6 h-6 text-orange-400 mb-3" />
            <h4 class="text-base font-bold mb-2">{pillar.title}</h4>
            <p class="text-sm text-slate-300 leading-relaxed">{pillar.description}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>
```

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/components/sections/Rm3ArchitectureSection.astro
git commit -m "feat: add RM3 architecture section"
```

### Task 18: Modules classification section (Oficiales / Custom / Community)

Source: `code.html` lines 648-732.

**Files:**
- Modify: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`
- Create: `src/components/sections/ModulesClassificationSection.astro`

- [ ] **Step 1: Add the `classification` key to types.ts**

```ts
  classification: {
    eyebrow: string;
    title: string;
    description: string;
    official: { badge: string; title: string; description: string; bullets: string[] };
    custom: { tag: string; badge: string; title: string; description: string; bullets: string[] };
    community: { badge: string; title: string; description: string; bullets: string[] };
    bannerTitle: string;
    bannerDescription: string;
    bannerCta: string;
  };
```

- [ ] **Step 2: Add content to es.ts**

```ts
  classification: {
    eyebrow: "Ecosistema de soluciones",
    title: "Tu negocio es unico. Tu software tambien puede serlo.",
    description:
      "Amplia RUNLY con herramientas desarrolladas para diferentes necesidades y construye una plataforma que realmente se ajuste a tu operacion.",
    official: {
      badge: "Certificados Racoon",
      title: "Modulos Oficiales",
      description:
        "Desarrollados, mantenidos y soportados directamente por el equipo de ingenieria de Racoon Devs. Maxima estabilidad, actualizaciones automaticas y compatibilidad garantizada.",
      bullets: [
        "Actualizaciones sin costo adicional",
        "Soporte prioritario en espanol",
        "Integracion nativa inmediata",
      ],
    },
    custom: {
      tag: "Hecho a la medida",
      badge: "Flujos especificos",
      title: "Modulos Personalizados",
      description:
        "Tu industria tiene una regla de negocio o calculo unico? Disenamos y programamos modulos custom que se integran con fluidez exacta a tu pantalla de RUNLY.",
      bullets: [
        "Levantamiento tecnico de procesos",
        "Adaptacion a tu software heredado",
        "Exclusivo para tu organizacion",
      ],
    },
    community: {
      badge: "Ecosistema en construccion",
      title: "Modulos Community",
      description:
        "Estamos sentando las bases para que desarrolladores y partners certificados puedan aportar extensiones y conectores en el futuro, bajo revision de seguridad de nuestro equipo.",
      bullets: [
        "Estandares abiertos y SDK en desarrollo",
        "Revision de seguridad y codigo",
        "Aun no disponible publicamente",
      ],
    },
    bannerTitle: "Tienes una idea para un modulo que todavia no existe?",
    bannerDescription: "Construimos la herramienta exacta para resolver la friccion de tu operacion diaria.",
    bannerCta: "Hablemos de tu proyecto",
  },
```

- [ ] **Step 3: Add content to en.ts**

```ts
  classification: {
    eyebrow: "Solutions ecosystem",
    title: "Your business is unique. Your software can be too.",
    description:
      "Extend RUNLY with tools built for different needs and put together a platform that truly fits your operation.",
    official: {
      badge: "Racoon-certified",
      title: "Official Modules",
      description:
        "Built, maintained, and supported directly by the Racoon Devs engineering team. Maximum stability, automatic updates, and guaranteed compatibility.",
      bullets: [
        "Updates at no extra cost",
        "Priority support in Spanish",
        "Immediate native integration",
      ],
    },
    custom: {
      tag: "Made to measure",
      badge: "Specific workflows",
      title: "Custom Modules",
      description:
        "Does your industry have a unique business rule or calculation? We design and build custom modules that integrate seamlessly into your RUNLY screens.",
      bullets: [
        "Technical process discovery",
        "Adapts to your legacy software",
        "Exclusive to your organization",
      ],
    },
    community: {
      badge: "Ecosystem in the works",
      title: "Community Modules",
      description:
        "We are laying the groundwork so certified developers and partners can contribute extensions and connectors in the future, under our team security review.",
      bullets: [
        "Open standards and SDK in progress",
        "Security and code review",
        "Not publicly available yet",
      ],
    },
    bannerTitle: "Have an idea for a module that does not exist yet?",
    bannerDescription: "We build the exact tool to remove the friction from your daily operation.",
    bannerCta: "Let us talk about your project",
  },
```

- [ ] **Step 4: Run test**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write ModulesClassificationSection.astro**

```astro
---
// src/components/sections/ModulesClassificationSection.astro
import { BadgeCheck, SlidersHorizontal, Users, Check } from "lucide-astro";
import type { SiteDictionary } from "../../i18n/types";

interface Props {
  dict: SiteDictionary;
}

const { dict } = Astro.props;
const { classification } = dict;
---

<section class="py-24 bg-slate-50 border-b border-slate-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <h2 class="text-sm font-bold text-orange-600 uppercase tracking-widest mb-2">{classification.eyebrow}</h2>
      <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{classification.title}</p>
      <p class="mt-4 text-base sm:text-lg text-slate-600">{classification.description}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6"><BadgeCheck class="w-5 h-5" /></div>
          <span class="text-xs font-bold text-orange-600 uppercase tracking-wider">{classification.official.badge}</span>
          <h3 class="text-xl font-bold text-slate-900 mt-1 mb-3">{classification.official.title}</h3>
          <p class="text-sm text-slate-600 leading-relaxed mb-6">{classification.official.description}</p>
        </div>
        <ul class="text-xs text-slate-600 space-y-2.5 pt-6 border-t border-slate-100">
          {classification.official.bullets.map((b) => <li class="flex items-center gap-2"><Check class="w-3.5 h-3.5 text-emerald-500" /> {b}</li>)}
        </ul>
      </div>
      <div class="bg-white rounded-2xl p-8 border-2 border-orange-500 shadow-md relative flex flex-col justify-between">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-orange-500 text-white text-[11px] font-bold tracking-wide uppercase">{classification.custom.tag}</div>
        <div>
          <div class="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-6"><SlidersHorizontal class="w-5 h-5" /></div>
          <span class="text-xs font-bold text-orange-600 uppercase tracking-wider">{classification.custom.badge}</span>
          <h3 class="text-xl font-bold text-slate-900 mt-1 mb-3">{classification.custom.title}</h3>
          <p class="text-sm text-slate-600 leading-relaxed mb-6">{classification.custom.description}</p>
        </div>
        <ul class="text-xs text-slate-600 space-y-2.5 pt-6 border-t border-slate-100">
          {classification.custom.bullets.map((b) => <li class="flex items-center gap-2"><Check class="w-3.5 h-3.5 text-emerald-500" /> {b}</li>)}
        </ul>
      </div>
      <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6"><Users class="w-5 h-5" /></div>
          <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">{classification.community.badge}</span>
          <h3 class="text-xl font-bold text-slate-900 mt-1 mb-3">{classification.community.title}</h3>
          <p class="text-sm text-slate-600 leading-relaxed mb-6">{classification.community.description}</p>
        </div>
        <ul class="text-xs text-slate-600 space-y-2.5 pt-6 border-t border-slate-100">
          {classification.community.bullets.map((b) => <li class="flex items-center gap-2"><Check class="w-3.5 h-3.5 text-emerald-500" /> {b}</li>)}
        </ul>
      </div>
    </div>
    <div class="rounded-2xl p-8 bg-gradient-to-r from-slate-900 via-runly-midnight to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h3 class="text-xl font-bold mb-1">{classification.bannerTitle}</h3>
        <p class="text-sm text-slate-300">{classification.bannerDescription}</p>
      </div>
      <a class="whitespace-nowrap px-6 py-3 rounded-xl text-white font-semibold text-sm runly-gradient-btn shadow-md" href="#contacto">{classification.bannerCta} &rarr;</a>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/components/sections/ModulesClassificationSection.astro
git commit -m "feat: add modules classification section"
```

### Task 19: MirAI section (with clearly-labeled demo)

Source: `code.html` lines 733-877. MirAI is a capability of `runly.chat` / `runly.inventory`, not a standalone module (see catalog note at the top of this plan) — the section copy must not imply it is separately installable, and the demo transcript must read as an illustrative example, not a live system.

**Files:**
- Modify: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`
- Create: `src/components/sections/MiraiSection.astro`

- [ ] **Step 1: Add the `mirai` key to types.ts**

```ts
  mirai: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    capabilities: { icon: string; color: string; title: string; description: string }[];
    demoLabel: string;
    demoContext: string;
    demoDisclaimer: string;
    demoUserMessage: string;
    demoAssistantIntro: string;
    demoLineCompanyA: string;
    demoLineCompanyB: string;
    demoTotalLabel: string;
    demoConfirmation: string;
    demoPromptsLabel: string;
    demoPrompt1: string;
    demoPrompt2: string;
  };
```

- [ ] **Step 2: Add content to es.ts**

```ts
  mirai: {
    badge: "Inteligencia Artificial Practica",
    title: "Conoce a MirAI.",
    titleHighlight: "Inteligencia que acompana tu trabajo.",
    description:
      "RUNLY incorpora herramientas impulsadas por inteligencia artificial para facilitar tareas repetitivas, interpretar informacion desestructurada y ayudarte a tomar mejores decisiones en segundos. MirAI vive dentro de Chat y del asistente de Inventario, no es un modulo aparte.",
    capabilities: [
      {
        icon: "MessageCircle",
        color: "purple",
        title: "Asistente conversacional integrado",
        description: "Pregunta sobre el inventario, solicita resumenes de reuniones o consulta el estatus de proyectos usando lenguaje natural en espanol.",
      },
      {
        icon: "FileText",
        color: "orange",
        title: "Interpretacion de tickets y facturas",
        description: "Sube fotos de tickets o comprobantes desde tu telefono; MirAI extrae monto, fecha, RFC y categoria contable de forma automatica.",
      },
      {
        icon: "Brain",
        color: "blue",
        title: "Apoyo contextual por modulo",
        description: "Si estas en Proyectos, MirAI te ayuda a redactar criterios de aceptacion. Si estas en CRM, sugiere follow-ups comerciales.",
      },
      {
        icon: "ShieldCheck",
        color: "emerald",
        title: "Privacidad y base extensible",
        description: "Tus datos empresariales permanecen estrictamente confidenciales y aislados dentro de tu entorno privado.",
      },
    ],
    demoLabel: "MirAI Asistente",
    demoContext: "Ejemplo ilustrativo - no es una conversacion en vivo",
    demoDisclaimer: "Vista de ejemplo de como responde MirAI dentro de Runly ERP",
    demoUserMessage: "MirAI, cual es el saldo proyectado para nomina a fin de mes entre las dos empresas?",
    demoAssistantIntro: "Analizando los libros de cuentas de Racoon Devs y Maquinaria y Canteras:",
    demoLineCompanyA: "Racoon Devs (8 colaboradores): $148,500 MXN",
    demoLineCompanyB: "Maquinaria y Canteras (12 colab.): $210,000 MXN",
    demoTotalLabel: "Compromiso total estimado: $358,500 MXN",
    demoConfirmation: "Tienes liquidez suficiente registrada con los cobros de clientes programados para el 25 de septiembre.",
    demoPromptsLabel: "Prueba preguntar:",
    demoPrompt1: "Resumen de tareas pendientes de la semana",
    demoPrompt2: "Leer ticket de combustible adjunto",
  },
```

- [ ] **Step 3: Add content to en.ts**

```ts
  mirai: {
    badge: "Practical Artificial Intelligence",
    title: "Meet MirAI.",
    titleHighlight: "Intelligence that works alongside you.",
    description:
      "RUNLY includes AI-powered tools to speed up repetitive tasks, make sense of unstructured information, and help you make better decisions in seconds. MirAI lives inside Chat and the Inventory assistant, it is not a separate module.",
    capabilities: [
      {
        icon: "MessageCircle",
        color: "purple",
        title: "Built-in conversational assistant",
        description: "Ask about inventory, request meeting summaries, or check project status using natural Spanish or English.",
      },
      {
        icon: "FileText",
        color: "orange",
        title: "Receipt and invoice interpretation",
        description: "Upload photos of receipts or vouchers from your phone; MirAI extracts amount, date, tax ID, and accounting category automatically.",
      },
      {
        icon: "Brain",
        color: "blue",
        title: "Contextual help per module",
        description: "In Projects, MirAI helps you draft acceptance criteria. In CRM, it suggests sales follow-ups.",
      },
      {
        icon: "ShieldCheck",
        color: "emerald",
        title: "Privacy and an extensible foundation",
        description: "Your business data stays strictly confidential and isolated inside your private environment.",
      },
    ],
    demoLabel: "MirAI Assistant",
    demoContext: "Illustrative example, not a live conversation",
    demoDisclaimer: "Sample view of how MirAI responds inside Runly ERP",
    demoUserMessage: "MirAI, what is the projected payroll balance at month end across both companies?",
    demoAssistantIntro: "Analyzing the ledgers for Racoon Devs and Maquinaria y Canteras:",
    demoLineCompanyA: "Racoon Devs (8 employees): $148,500 MXN",
    demoLineCompanyB: "Maquinaria y Canteras (12 employees): $210,000 MXN",
    demoTotalLabel: "Estimated total commitment: $358,500 MXN",
    demoConfirmation: "You have enough recorded liquidity given the customer payments scheduled for September 25.",
    demoPromptsLabel: "Try asking:",
    demoPrompt1: "Summary of this week pending tasks",
    demoPrompt2: "Read the attached fuel receipt",
  },
```

- [ ] **Step 4: Run test**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write MiraiSection.astro**

```astro
---
// src/components/sections/MiraiSection.astro
import { Sparkles, MessageCircle, FileText, Brain, ShieldCheck, CheckCircle2 } from "lucide-astro";
import type { SiteDictionary } from "../../i18n/types";

interface Props {
  dict: SiteDictionary;
}

const { dict } = Astro.props;
const { mirai } = dict;

const iconMap = { MessageCircle, FileText, Brain, ShieldCheck } as const;
const colorMap: Record<string, string> = {
  purple: "bg-purple-500/20 text-purple-400",
  orange: "bg-orange-500/20 text-orange-400",
  blue: "bg-blue-500/20 text-blue-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
};
---

<section class="py-24 bg-gradient-to-b from-runly-navy via-[#0A1024] to-runly-midnight text-white relative overflow-hidden reveal-on-scroll" id="mirai">
  <div class="absolute top-1/3 left-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-4">
        <Sparkles class="w-3.5 h-3.5" /> {mirai.badge}
      </div>
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
        {mirai.title} <span class="text-gradient-orange">{mirai.titleHighlight}</span>
      </h2>
      <p class="mt-4 text-base sm:text-lg text-slate-300">{mirai.description}</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-5 space-y-6">
        {mirai.capabilities.map((cap) => {
          const Icon = iconMap[cap.icon as keyof typeof iconMap];
          return (
            <div class="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
              <div class="flex items-start gap-4">
                <div class={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 ${colorMap[cap.color]}`}>
                  <Icon class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="text-base font-bold text-white">{cap.title}</h3>
                  <p class="text-xs text-slate-300 mt-1 leading-relaxed">{cap.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div class="lg:col-span-7">
        <div class="rounded-2xl border border-slate-700 bg-slate-900/90 shadow-2xl p-4 sm:p-6 backdrop-blur-xl">
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Sparkles class="w-4 h-4" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-bold text-white text-sm">{mirai.demoLabel}</h4>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">{mirai.demoContext}</span>
                </div>
                <p class="text-xs text-slate-400">{mirai.demoDisclaimer}</p>
              </div>
            </div>
          </div>
          <div class="py-6 space-y-4 text-xs sm:text-sm font-normal">
            <div class="flex items-start justify-end gap-2.5">
              <div class="bg-blue-600 text-white p-3.5 rounded-2xl rounded-tr-none max-w-[85%]">
                <p>{mirai.demoUserMessage}</p>
              </div>
            </div>
            <div class="flex items-start gap-2.5">
              <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
                <Sparkles class="w-3 h-3" />
              </div>
              <div class="bg-slate-800/90 border border-slate-700/80 text-slate-200 p-4 rounded-2xl rounded-tl-none max-w-[90%] space-y-2">
                <p>{mirai.demoAssistantIntro}</p>
                <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-700/50 text-xs font-mono space-y-1">
                  <div class="flex justify-between text-slate-300"><span>{mirai.demoLineCompanyA}</span></div>
                  <div class="flex justify-between text-slate-300"><span>{mirai.demoLineCompanyB}</span></div>
                  <div class="border-t border-slate-700 pt-1 mt-1 flex justify-between text-white font-bold"><span>{mirai.demoTotalLabel}</span></div>
                </div>
                <p class="text-slate-300 text-xs"><CheckCircle2 class="w-3.5 h-3.5 text-emerald-400 inline mr-1" /> {mirai.demoConfirmation}</p>
              </div>
            </div>
          </div>
          <div class="pt-3 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
            <span class="text-slate-400 text-[11px] self-center">{mirai.demoPromptsLabel}</span>
            <button class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700" type="button">{mirai.demoPrompt1}</button>
            <button class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700" type="button">{mirai.demoPrompt2}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Note: the demo prompt chips are visual only (no `onclick`), matching the design spec decision that the MirAI demo is not wired to a real backend in v1.

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/components/sections/MiraiSection.astro
git commit -m "feat: add MirAI section with labeled illustrative demo"
```

### Task 20: Multi-company collaboration section

Source: `code.html` lines 878-994.

**Files:**
- Modify: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`
- Create: `src/components/sections/MultiCompanySection.astro`

- [ ] **Step 1: Add the `multiCompany` key to types.ts**

```ts
  multiCompany: {
    eyebrow: string;
    title: string;
    description: string;
    mockActiveCompany: string;
    mockActiveInstance: string;
    mockAdminUser: string;
    mockSwitcherLabel: string;
    mockCompanyA: string;
    mockCompanyB: string;
    mockChangeLabel: string;
    mockAddCompany: string;
    mockRoleFinance: string;
    mockRoleFinanceAccess: string;
    mockRoleWarehouse: string;
    mockRoleWarehouseAccess: string;
    mockRoleDirection: string;
    mockRoleDirectionAccess: string;
    pillars: { icon: string; color: string; title: string; description: string }[];
  };
```

- [ ] **Step 2: Add content to es.ts**

```ts
  multiCompany: {
    eyebrow: "Multitenancy Nativo",
    title: "Un solo lugar para conectar a todo tu equipo.",
    description:
      "Trabaja con tus colaboradores desde una plataforma que reune informacion, comunicacion y herramientas para las diferentes areas de tu organizacion.",
    mockActiveCompany: "Racoon Devs",
    mockActiveInstance: "Instancia Activa",
    mockAdminUser: "Raul (Admin)",
    mockSwitcherLabel: "Cambiar de razon social / sucursal",
    mockCompanyA: "Racoon Devs S.A.S.",
    mockCompanyB: "Maquinaria y Canteras",
    mockChangeLabel: "Cambiar",
    mockAddCompany: "Crear o vincular nueva empresa",
    mockRoleFinance: "Finanzas",
    mockRoleFinanceAccess: "Acceso Restringido",
    mockRoleWarehouse: "Almacen",
    mockRoleWarehouseAccess: "Lectura/Escritura",
    mockRoleDirection: "Direccion",
    mockRoleDirectionAccess: "Auditoria Global",
    pillars: [
      {
        icon: "Users",
        color: "orange",
        title: "Equipos verdaderamente conectados",
        description: "Evita la dispersion en 5 aplicaciones no conectadas. En RUNLY los chats de proyectos, archivos adjuntos y estados de pago conviven bajo el mismo techo.",
      },
      {
        icon: "Flag",
        color: "blue",
        title: "Diferentes empresas en una plataforma",
        description: "Manejas un grupo empresarial o diversas marcas? Administra cada empresa con catalogo, cuentas bancarias e inventarios completamente independientes.",
      },
      {
        icon: "UserCog",
        color: "emerald",
        title: "Accesos y permisos organizados",
        description: "Control granular por rol. Tus vendedores solo acceden a cotizaciones y catalogo, mientras los contadores gestionan libros y facturas con total seguridad.",
      },
    ],
  },
```

- [ ] **Step 3: Add content to en.ts**

```ts
  multiCompany: {
    eyebrow: "Native Multi-tenancy",
    title: "One place to connect your whole team.",
    description:
      "Work with your team from a platform that brings together information, communication, and tools for every area of your organization.",
    mockActiveCompany: "Racoon Devs",
    mockActiveInstance: "Active Instance",
    mockAdminUser: "Raul (Admin)",
    mockSwitcherLabel: "Switch legal entity / branch",
    mockCompanyA: "Racoon Devs S.A.S.",
    mockCompanyB: "Maquinaria y Canteras",
    mockChangeLabel: "Switch",
    mockAddCompany: "Create or link a new company",
    mockRoleFinance: "Finance",
    mockRoleFinanceAccess: "Restricted access",
    mockRoleWarehouse: "Warehouse",
    mockRoleWarehouseAccess: "Read/Write",
    mockRoleDirection: "Management",
    mockRoleDirectionAccess: "Global audit",
    pillars: [
      {
        icon: "Users",
        color: "orange",
        title: "Truly connected teams",
        description: "Avoid the sprawl of 5 disconnected apps. In RUNLY, project chats, attached files, and payment statuses live under one roof.",
      },
      {
        icon: "Flag",
        color: "blue",
        title: "Different companies, one platform",
        description: "Running a business group or multiple brands? Manage each company with a fully independent catalog, bank accounts, and inventory.",
      },
      {
        icon: "UserCog",
        color: "emerald",
        title: "Organized access and permissions",
        description: "Granular role-based control. Your sales team only accesses quotes and catalog, while accountants manage ledgers and invoices with full security.",
      },
    ],
  },
```

- [ ] **Step 4: Run test**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write MultiCompanySection.astro**

```astro
---
// src/components/sections/MultiCompanySection.astro
import { Users, Flag, UserCog, Check, Plus } from "lucide-astro";
import type { SiteDictionary } from "../../i18n/types";

interface Props {
  dict: SiteDictionary;
}

const { dict } = Astro.props;
const { multiCompany } = dict;

const iconMap = { Users, Flag, UserCog } as const;
const colorMap: Record<string, string> = {
  orange: "bg-orange-100 text-orange-600",
  blue: "bg-blue-100 text-blue-600",
  emerald: "bg-emerald-100 text-emerald-600",
};
---

<section class="py-24 bg-white border-b border-slate-200 relative">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <h2 class="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">{multiCompany.eyebrow}</h2>
      <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{multiCompany.title}</p>
      <p class="mt-4 text-base sm:text-lg text-slate-600">{multiCompany.description}</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-6 order-2 lg:order-1">
        <div class="relative max-w-md mx-auto rounded-2xl p-6 bg-slate-50 border border-slate-200 shadow-xl">
          <div class="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">RD</div>
              <div>
                <p class="text-xs font-bold text-slate-800">{multiCompany.mockActiveCompany}</p>
                <p class="text-[10px] text-slate-400">{multiCompany.mockActiveInstance}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span class="text-xs font-semibold text-slate-600">{multiCompany.mockAdminUser}</span>
            </div>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{multiCompany.mockSwitcherLabel}</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold">RD</div>
                  <span class="text-xs font-bold text-slate-800">{multiCompany.mockCompanyA}</span>
                </div>
                <Check class="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div class="p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-md bg-sky-500 text-white flex items-center justify-center text-xs font-bold">MY</div>
                  <span class="text-xs font-medium text-slate-700">{multiCompany.mockCompanyB}</span>
                </div>
                <span class="text-[10px] text-slate-400">{multiCompany.mockChangeLabel}</span>
              </div>
              <div class="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-orange-600">
                <Plus class="w-3.5 h-3.5" />
                <span>{multiCompany.mockAddCompany}</span>
              </div>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-200 grid grid-cols-3 gap-2 text-center">
            <div class="p-2 rounded-lg bg-white border border-slate-200">
              <span class="block text-xs font-bold text-slate-800">{multiCompany.mockRoleFinance}</span>
              <span class="text-[10px] text-emerald-600 font-semibold">{multiCompany.mockRoleFinanceAccess}</span>
            </div>
            <div class="p-2 rounded-lg bg-white border border-slate-200">
              <span class="block text-xs font-bold text-slate-800">{multiCompany.mockRoleWarehouse}</span>
              <span class="text-[10px] text-blue-600 font-semibold">{multiCompany.mockRoleWarehouseAccess}</span>
            </div>
            <div class="p-2 rounded-lg bg-white border border-slate-200">
              <span class="block text-xs font-bold text-slate-800">{multiCompany.mockRoleDirection}</span>
              <span class="text-[10px] text-purple-600 font-semibold">{multiCompany.mockRoleDirectionAccess}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="lg:col-span-6 space-y-6 order-1 lg:order-2">
        {multiCompany.pillars.map((pillar) => {
          const Icon = iconMap[pillar.icon as keyof typeof iconMap];
          return (
            <div class="flex items-start gap-4">
              <div class={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorMap[pillar.color]}`}>
                <Icon class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-900">{pillar.title}</h3>
                <p class="text-sm text-slate-600 mt-1 leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/components/sections/MultiCompanySection.astro
git commit -m "feat: add multi-company collaboration section"
```

### Task 21: Custom implementation section

Source: `code.html` lines 995-1071.

**Files:**
- Modify: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`
- Create: `src/components/sections/ImplementationSection.astro`

- [ ] **Step 1: Add the `implementation` key to types.ts**

```ts
  implementation: {
    badge: string;
    title: string;
    description: string;
    steps: { number: string; title: string; description: string }[];
    valueTitle: string;
    valueDescription: string;
    valueCta: string;
  };
```

- [ ] **Step 2: Add content to es.ts**

```ts
  implementation: {
    badge: "Transparencia y honestidad comercial",
    title: "No vendemos paquetes. Construimos la solucion que necesitas.",
    description:
      "Cada empresa tiene necesidades diferentes. Por eso, en RUNLY ofrecemos implementaciones personalizadas que se ajustan a tu operacion, tus objetivos y tu presupuesto.",
    steps: [
      { number: "01", title: "Cuentanos sobre tu empresa", description: "Analizamos tus procesos actuales, dolores operativos y las herramientas que tu equipo ya utiliza en el dia a dia." },
      { number: "02", title: "Disenamos tu solucion", description: "Seleccionamos los modulos precisos y definimos las adaptaciones a la medida requeridas, sin modulos innecesarios." },
      { number: "03", title: "Implementamos RUNLY", description: "Configuramos tu instancia cloud, migramos catalogos base y capacitamos a tus lideres de area de forma practica." },
      { number: "04", title: "Evolucionamos contigo", description: "Acompanamiento continuo, soporte directo con desarrolladores e incorporacion agil de nuevos modulos cuando tu negocio crezca." },
    ],
    valueTitle: "Software empresarial accesible, sin pagar por lo que no necesitas.",
    valueDescription:
      "Buscamos que la tecnologia empresarial de alto nivel este al alcance de mas negocios en Mexico y Latinoamerica. Olvidate de licencias prohibitivas de miles de dolares por usuario de los ERPs tradicionales.",
    valueCta: "Solicitar una propuesta personalizada",
  },
```

- [ ] **Step 3: Add content to en.ts**

```ts
  implementation: {
    badge: "Transparency and business honesty",
    title: "We do not sell packages. We build the solution you need.",
    description:
      "Every company has different needs. That is why RUNLY offers custom implementations that fit your operation, your goals, and your budget.",
    steps: [
      { number: "01", title: "Tell us about your company", description: "We analyze your current processes, operational pain points, and the tools your team already uses day to day." },
      { number: "02", title: "We design your solution", description: "We select the exact modules and define the custom adaptations required, with no unnecessary modules." },
      { number: "03", title: "We implement RUNLY", description: "We configure your cloud instance, migrate base catalogs, and train your area leads hands-on." },
      { number: "04", title: "We evolve with you", description: "Ongoing support, direct access to developers, and fast rollout of new modules as your business grows." },
    ],
    valueTitle: "Enterprise software that is accessible, without paying for what you do not need.",
    valueDescription:
      "We want high-end enterprise technology to be within reach for more businesses across Mexico and Latin America. Forget the thousand-dollar-per-user licenses of traditional ERPs.",
    valueCta: "Request a custom proposal",
  },
```

- [ ] **Step 4: Run test**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write ImplementationSection.astro**

```astro
---
// src/components/sections/ImplementationSection.astro
import type { SiteDictionary } from "../../i18n/types";

interface Props {
  dict: SiteDictionary;
}

const { dict } = Astro.props;
const { implementation } = dict;
---

<section class="py-24 bg-slate-50 border-b border-slate-200" id="implementacion">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-3">{implementation.badge}</div>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{implementation.title}</h2>
      <p class="mt-4 text-base sm:text-lg text-slate-600">{implementation.description}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
      {implementation.steps.map((step) => (
        <div class="bg-white p-6 rounded-2xl border border-slate-200 relative">
          <span class="text-3xl font-black text-orange-500/20 absolute top-4 right-4">{step.number}</span>
          <div class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-bold mb-4">{step.number}</div>
          <h3 class="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
          <p class="text-xs text-slate-600 leading-relaxed">{step.description}</p>
        </div>
      ))}
    </div>
    <div class="rounded-3xl p-8 sm:p-10 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="max-w-2xl">
        <h3 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{implementation.valueTitle}</h3>
        <p class="text-sm text-slate-600 leading-relaxed">{implementation.valueDescription}</p>
      </div>
      <div class="shrink-0">
        <a class="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-base runly-gradient-btn shadow-md" href="#contacto">{implementation.valueCta} &rarr;</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/components/sections/ImplementationSection.astro
git commit -m "feat: add custom implementation section"
```

### Task 22: Why choose RUNLY section (8-card grid)

Source: `code.html` lines 1072-1145.

**Files:**
- Modify: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`
- Create: `src/components/sections/WhyChooseSection.astro`

- [ ] **Step 1: Add the `whyChoose` key to types.ts**

```ts
  whyChoose: {
    eyebrow: string;
    title: string;
    description: string;
    cards: { icon: string; color: string; title: string; description: string }[];
  };
```

- [ ] **Step 2: Add content to es.ts**

```ts
  whyChoose: {
    eyebrow: "Diferenciadores Clave",
    title: "Tecnologia empresarial que trabaja a tu favor.",
    description: "Disenado desde cero para erradicar la complejidad innecesaria y dar agilidad real a equipos en constante crecimiento.",
    cards: [
      { icon: "Boxes", color: "orange", title: "Modular y adaptable", description: "Paga e instala solo los modulos que tu operacion necesita hoy." },
      { icon: "HandCoins", color: "emerald", title: "Sin costos inflados", description: "Cero sobrecostos por funciones que tu equipo nunca va a abrir." },
      { icon: "Building2", color: "blue", title: "Multiempresa nativo", description: "Administra diferentes empresas o sucursales con aislamiento estricto." },
      { icon: "Headset", color: "purple", title: "Soporte directo por devs", description: "Atencion en espanol de Mexico directa de los creadores en Racoon Devs." },
      { icon: "Sparkles", color: "pink", title: "IA practica no decorativa", description: "MirAI automatiza lectura de comprobantes y consultas de stock reales." },
      { icon: "CloudUpload", color: "amber", title: "Innovacion continua", description: "Nuevas funciones y optimizaciones mensuales sin costes ocultos." },
      { icon: "Smartphone", color: "cyan", title: "100% Cloud y Responsive", description: "Accede desde tu computadora, tablet o smartphone con alta fluidez." },
      { icon: "ShieldCheck", color: "indigo", title: "Seguridad y Respaldo", description: "Backups automaticos diarios y cifrado de datos en reposo y transito." },
    ],
  },
```

- [ ] **Step 3: Add content to en.ts**

```ts
  whyChoose: {
    eyebrow: "Key Differentiators",
    title: "Enterprise technology that works in your favor.",
    description: "Built from the ground up to eliminate unnecessary complexity and give real agility to fast-growing teams.",
    cards: [
      { icon: "Boxes", color: "orange", title: "Modular and adaptable", description: "Pay for and install only the modules your operation needs today." },
      { icon: "HandCoins", color: "emerald", title: "No inflated costs", description: "Zero overhead for features your team will never open." },
      { icon: "Building2", color: "blue", title: "Native multi-company", description: "Manage different companies or branches with strict isolation." },
      { icon: "Headset", color: "purple", title: "Direct support from developers", description: "Spanish and English support straight from the creators at Racoon Devs." },
      { icon: "Sparkles", color: "pink", title: "Practical, not decorative AI", description: "MirAI automates receipt reading and real stock lookups." },
      { icon: "CloudUpload", color: "amber", title: "Continuous innovation", description: "New features and optimizations every month at no hidden cost." },
      { icon: "Smartphone", color: "cyan", title: "100% cloud and responsive", description: "Access from your computer, tablet, or smartphone with high fluency." },
      { icon: "ShieldCheck", color: "indigo", title: "Security and backups", description: "Automatic daily backups and data encryption at rest and in transit." },
    ],
  },
```

- [ ] **Step 4: Run test**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write WhyChooseSection.astro**

```astro
---
// src/components/sections/WhyChooseSection.astro
import * as Icons from "lucide-astro";
import SectionHeading from "../ui/SectionHeading.astro";
import type { SiteDictionary } from "../../i18n/types";

interface Props {
  dict: SiteDictionary;
}

const { dict } = Astro.props;
const { whyChoose } = dict;
const colorMap: Record<string, string> = {
  orange: "bg-orange-100 text-orange-600",
  emerald: "bg-emerald-100 text-emerald-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  pink: "bg-pink-100 text-pink-600",
  amber: "bg-amber-100 text-amber-600",
  cyan: "bg-cyan-100 text-cyan-600",
  indigo: "bg-indigo-100 text-indigo-600",
};
---

<section class="py-24 bg-white border-b border-slate-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeading eyebrow={whyChoose.eyebrow} title={whyChoose.title} description={whyChoose.description} />
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {whyChoose.cards.map((card) => {
        const Icon = (Icons as Record<string, any>)[card.icon] ?? Icons.Boxes;
        return (
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorMap[card.color]}`}>
              <Icon class="w-4 h-4" />
            </div>
            <h3 class="text-base font-bold text-slate-900 mb-1">{card.title}</h3>
            <p class="text-xs text-slate-600 leading-relaxed">{card.description}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>
```

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/components/sections/WhyChooseSection.astro
git commit -m "feat: add why choose runly section"
```

### Task 23: FAQ section (accessible accordion)

Source: `code.html` lines 1146-1233. The Stitch copy states "48 a 72 horas" and "2 a 4 semanas" as fixed implementation timelines — reword as estimates so this reads honestly as a general expectation, not a contractual promise.

**Files:**
- Modify: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`
- Create: `src/components/sections/FaqSection.astro`

- [ ] **Step 1: Add the `faq` key to types.ts**

```ts
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: { question: string; answer: string }[];
  };
```

- [ ] **Step 2: Add content to es.ts**

```ts
  faq: {
    eyebrow: "Dudas habituales",
    title: "Preguntas Frecuentes",
    description: "Todo lo que necesitas saber antes de implementar RUNLY en tu empresa.",
    items: [
      {
        question: "RUNLY funciona para empresas pequenas o solo para grandes organizaciones?",
        answer: "RUNLY esta disenado con una arquitectura modular precisamente para adaptarse a cualquier tamano. Una empresa de 3 personas puede comenzar unicamente con Chat, Calendario y Finanzas, mientras que una companyia consolidada puede operar inventarios complejos multialmacen y multiples razones sociales.",
      },
      {
        question: "Tengo que contratar todos los modulos obligatoriamente?",
        answer: "No. En RUNLY no creemos en los paquetes forzosos. Tu eliges exactamente que modulos habilitar en tu instancia. Si en el futuro necesitas un modulo adicional, lo activas con un clic sin necesidad de reinstalar ni migrar el sistema.",
      },
      {
        question: "Puedo solicitar modulos o funcionalidades personalizadas para mi empresa?",
        answer: "Si, es una de nuestras principales fortalezas comerciales. Nuestro equipo en Racoon Devs puede desarrollar modulos personalizados exclusivos basados en la arquitectura RM3 que se adaptan exactamente a los calculos, aprobaciones o regulaciones de tu negocio.",
      },
      {
        question: "Como funciona la gestion multiempresa?",
        answer: "Puedes dar de alta multiples entidades o marcas bajo un mismo acceso maestro. Cada empresa tiene bases de datos logicamente aisladas (inventario, empleados, cuentas bancarias), permitiendo que los administradores alternen entre una y otra con un solo clic.",
      },
      {
        question: "Mis datos estan protegidos y respaldados?",
        answer: "Si. Toda la comunicacion viaja cifrada con SSL/TLS. Realizamos copias de seguridad automaticas diarias y contamos con redundancia en la nube, buscando garantizar disponibilidad y proteccion contra perdidas imprevistas.",
      },
      {
        question: "Como se calcula el costo de RUNLY si no hay precios fijos publicados?",
        answer: "Cotizamos de forma justa basandonos en: los modulos exactos requeridos, el numero de usuarios activos concurrentes y si requieres desarrollo personalizado. Esto evita que pagues por caracteristicas infladas que no aportan valor a tu giro.",
      },
      {
        question: "Cuanto tiempo toma la implementacion y puesta en marcha?",
        answer: "Para instancias estandar con modulos Core, la puesta en marcha suele tomar entre 2 y 3 dias habiles. Para proyectos con desarrollos custom y migracion compleja de bases de datos, definimos un calendario por fases, habitualmente de 2 a 4 semanas segun el alcance.",
      },
    ],
  },
```

- [ ] **Step 3: Add content to en.ts**

```ts
  faq: {
    eyebrow: "Common questions",
    title: "Frequently Asked Questions",
    description: "Everything you need to know before implementing RUNLY at your company.",
    items: [
      {
        question: "Does RUNLY work for small businesses or only large organizations?",
        answer: "RUNLY is built with a modular architecture precisely so it adapts to any size. A 3-person company can start with just Chat, Calendar, and Finance, while an established company can run complex multi-warehouse inventory and multiple legal entities.",
      },
      {
        question: "Do I have to purchase every module?",
        answer: "No. RUNLY does not believe in forced bundles. You choose exactly which modules to enable on your instance. If you need an additional module later, you turn it on with one click, no reinstall or migration required.",
      },
      {
        question: "Can I request custom modules or features for my company?",
        answer: "Yes, it is one of our main strengths. Our team at Racoon Devs can build exclusive custom modules on the RM3 architecture that match your exact calculations, approvals, or industry regulations.",
      },
      {
        question: "How does multi-company management work?",
        answer: "You can register multiple entities or brands under one master account. Each company has logically isolated data (inventory, employees, bank accounts), letting admins switch between them with one click.",
      },
      {
        question: "Is my data protected and backed up?",
        answer: "Yes. All communication travels encrypted with SSL/TLS. We run automatic daily backups and rely on cloud redundancy, aiming to guarantee availability and protection against unexpected data loss.",
      },
      {
        question: "How is the cost of RUNLY calculated if there are no published fixed prices?",
        answer: "We quote fairly based on: the exact modules required, the number of concurrent active users, and whether you need custom development. This keeps you from paying for inflated features that add no value to your business.",
      },
      {
        question: "How long does implementation and go-live take?",
        answer: "For standard instances with Core modules, go-live usually takes about 2 to 3 business days. For projects with custom development and complex data migration, we set a phased timeline, typically 2 to 4 weeks depending on scope.",
      },
    ],
  },
```

- [ ] **Step 4: Run test**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write FaqSection.astro**

```astro
---
// src/components/sections/FaqSection.astro
import { ChevronDown } from "lucide-astro";
import type { SiteDictionary } from "../../i18n/types";

interface Props {
  dict: SiteDictionary;
}

const { dict } = Astro.props;
const { faq } = dict;
---

<section class="py-24 bg-slate-50 border-b border-slate-200">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-sm font-bold text-orange-600 uppercase tracking-widest mb-2">{faq.eyebrow}</h2>
      <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{faq.title}</p>
      <p class="mt-4 text-base text-slate-600">{faq.description}</p>
    </div>
    <div class="space-y-4" id="faqAccordion">
      {faq.items.map((item) => (
        <div class="faq-item rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all">
          <button class="faq-trigger w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500" aria-expanded="false" type="button">
            <span class="font-bold text-slate-900 text-base">{item.question}</span>
            <ChevronDown class="faq-icon w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0" />
          </button>
          <div class="faq-content hidden px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">{item.answer}</div>
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  const triggers = document.querySelectorAll<HTMLButtonElement>(".faq-trigger");
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const content = trigger.nextElementSibling as HTMLElement;
      const icon = trigger.querySelector(".faq-icon");
      const isHidden = content.classList.contains("hidden");
      document.querySelectorAll(".faq-content").forEach((c) => c.classList.add("hidden"));
      document.querySelectorAll(".faq-trigger").forEach((t) => t.setAttribute("aria-expanded", "false"));
      document.querySelectorAll(".faq-icon").forEach((i) => i.classList.remove("rotate-180"));
      if (isHidden) {
        content.classList.remove("hidden");
        trigger.setAttribute("aria-expanded", "true");
        icon?.classList.add("rotate-180");
      }
    });
  });
</script>
```

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/components/sections/FaqSection.astro
git commit -m "feat: add accessible FAQ accordion section"
```

### Task 24: Contact section (info column + form UI)

Source: `code.html` lines 1234-1359. The submit behavior here is wired to the real `/api/contact` endpoint built in Phase 5 (Tasks 25-29) — this task builds the markup and the fetch-based client script; Phase 5 must land before this form actually delivers email, but the two can be built in either order since the endpoint contract (`POST /api/contact` with the fields below, JSON response `{ ok: true }` or `{ ok: false, error }`) is fixed now.

**Files:**
- Modify: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`
- Create: `src/components/sections/ContactSection.astro`

- [ ] **Step 1: Add the `contact` key to types.ts**

```ts
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    whatsappTitle: string;
    whatsappDescription: string;
    whatsappCta: string;
    whatsappMessage: string;
    emailLabel: string;
    locationLabel: string;
    ndaLabel: string;
    formTitle: string;
    fields: {
      fullName: string;
      fullNamePlaceholder: string;
      company: string;
      companyPlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      teamSize: string;
      teamSizeOptions: string[];
      interest: string;
      interestOptions: string[];
      needs: string;
      needsPlaceholder: string;
      consent: string;
    };
    submit: string;
    submitting: string;
    successMessage: string;
    errorMessage: string;
    privacyNotice: string;
  };
```

- [ ] **Step 2: Add content to es.ts**

```ts
  contact: {
    eyebrow: "Comienza hoy",
    title: "Hagamos que tu empresa avance.",
    description: "Cuentanos que necesita tu negocio y descubre como podemos adaptar RUNLY a tu manera de trabajar. Sin compromisos forzosos.",
    whatsappTitle: "Prefieres hablar de inmediato?",
    whatsappDescription: "Atencion agil con uno de nuestros consultores.",
    whatsappCta: "Contactanos por WhatsApp",
    whatsappMessage: "Hola, me gustaria solicitar una demostracion de RUNLY ERP",
    emailLabel: "contacto@runly.mx",
    locationLabel: "Mexico. Cobertura y despliegue para toda Latinoamerica",
    ndaLabel: "Acuerdo de Confidencialidad (NDA) disponible para empresas",
    formTitle: "Solicitud de propuesta o demostracion",
    fields: {
      fullName: "Nombre completo *",
      fullNamePlaceholder: "Ej. Raul Gomez",
      company: "Nombre de la empresa *",
      companyPlaceholder: "Ej. Maquinaria y Canteras",
      email: "Correo empresarial *",
      emailPlaceholder: "raul@miempresa.com",
      phone: "Telefono o WhatsApp *",
      phonePlaceholder: "+52 55 1234 5678",
      teamSize: "Tamano aproximado del equipo",
      teamSizeOptions: ["1 a 5 personas", "6 a 20 personas", "21 a 50 personas", "Mas de 50 personas"],
      interest: "Principal interes *",
      interestOptions: [
        "Solicitar demostracion virtual",
        "Conocer modulos y alcances",
        "Implementacion empresarial",
        "Desarrollo de modulo personalizado",
        "Resolver dudas tecnicas",
      ],
      needs: "Que procesos necesitas gestionar con RUNLY? *",
      needsPlaceholder: "Ej. Inventario multialmacen, control de gastos entre dos empresas y chat de soporte integrado...",
      consent: "Acepto el Aviso de Privacidad y el tratamiento de mis datos para ser contactado por Racoon Devs.",
    },
    submit: "Enviar solicitud",
    submitting: "Procesando solicitud...",
    successMessage: "Gracias por tu interes! Un consultor de Racoon Devs se pondra en contacto contigo en breve.",
    errorMessage: "No pudimos enviar tu solicitud. Intenta de nuevo o escribenos por WhatsApp.",
    privacyNotice: "Al enviar este formulario aceptas nuestro Aviso de Privacidad. Tu informacion nunca sera compartida.",
  },
```

- [ ] **Step 3: Add content to en.ts**

```ts
  contact: {
    eyebrow: "Start today",
    title: "Let us move your business forward.",
    description: "Tell us what your business needs and see how we can adapt RUNLY to the way you work. No forced commitments.",
    whatsappTitle: "Would you rather talk right away?",
    whatsappDescription: "Fast attention from one of our consultants.",
    whatsappCta: "Contact us on WhatsApp",
    whatsappMessage: "Hi, I would like to request a demo of RUNLY ERP",
    emailLabel: "contacto@runly.mx",
    locationLabel: "Mexico. Coverage and deployment across Latin America",
    ndaLabel: "Non-disclosure agreement (NDA) available for companies",
    formTitle: "Request a proposal or demo",
    fields: {
      fullName: "Full name *",
      fullNamePlaceholder: "E.g. Raul Gomez",
      company: "Company name *",
      companyPlaceholder: "E.g. Maquinaria y Canteras",
      email: "Business email *",
      emailPlaceholder: "raul@mycompany.com",
      phone: "Phone or WhatsApp *",
      phonePlaceholder: "+52 55 1234 5678",
      teamSize: "Approximate team size",
      teamSizeOptions: ["1 to 5 people", "6 to 20 people", "21 to 50 people", "More than 50 people"],
      interest: "Main interest *",
      interestOptions: [
        "Request a live demo",
        "Learn about modules and scope",
        "Enterprise implementation",
        "Custom module development",
        "Resolve technical questions",
      ],
      needs: "What processes do you need RUNLY to manage? *",
      needsPlaceholder: "E.g. Multi-warehouse inventory, expense control across two companies, integrated support chat...",
      consent: "I accept the Privacy Notice and agree to be contacted by Racoon Devs.",
    },
    submit: "Send request",
    submitting: "Submitting request...",
    successMessage: "Thanks for your interest! A Racoon Devs consultant will reach out shortly.",
    errorMessage: "We could not send your request. Try again or message us on WhatsApp.",
    privacyNotice: "By submitting this form you accept our Privacy Notice. Your information is never shared.",
  },
```

- [ ] **Step 4: Run test**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write ContactSection.astro**

```astro
---
// src/components/sections/ContactSection.astro
import { Mail, MapPin, Shield, CheckCircle2, Send, Loader2 } from "lucide-astro";
import type { SiteDictionary } from "../../i18n/types";
import { CONTACT_WHATSAPP_NUMBER } from "../../consts";

interface Props {
  dict: SiteDictionary;
  locale: "es" | "en";
}

const { dict, locale } = Astro.props;
const { contact } = dict;
const waHref = `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(contact.whatsappMessage)}`;
---

<section class="py-24 bg-white relative" id="contacto">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div class="lg:col-span-5 space-y-8">
        <div>
          <span class="text-xs font-bold text-orange-600 uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100">{contact.eyebrow}</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4">{contact.title}</h2>
          <p class="mt-4 text-base text-slate-600 leading-relaxed">{contact.description}</p>
        </div>
        <div class="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-2xl">&#9742;</div>
            <div>
              <h3 class="text-sm font-bold text-slate-900">{contact.whatsappTitle}</h3>
              <p class="text-xs text-slate-600">{contact.whatsappDescription}</p>
            </div>
          </div>
          <a class="mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors" href={waHref} rel="noopener noreferrer" target="_blank">
            <span>{contact.whatsappCta}</span>
          </a>
        </div>
        <div class="space-y-3 text-xs text-slate-600">
          <p class="flex items-center gap-2.5"><Mail class="w-4 h-4 text-orange-500" /> <span>{contact.emailLabel}</span></p>
          <p class="flex items-center gap-2.5"><MapPin class="w-4 h-4 text-orange-500" /> <span>{contact.locationLabel}</span></p>
          <p class="flex items-center gap-2.5"><Shield class="w-4 h-4 text-orange-500" /> <span>{contact.ndaLabel}</span></p>
        </div>
      </div>
      <div class="lg:col-span-7">
        <div class="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
          <h3 class="text-xl font-bold text-slate-900 mb-6">{contact.formTitle}</h3>
          <form class="space-y-4" id="contactForm" data-locale={locale}>
            <input type="text" name="website" class="hidden" tabindex="-1" autocomplete="off" />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="fullName">{contact.fields.fullName}</label>
                <input class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white" id="fullName" name="fullName" placeholder={contact.fields.fullNamePlaceholder} required type="text" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="companyName">{contact.fields.company}</label>
                <input class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white" id="companyName" name="companyName" placeholder={contact.fields.companyPlaceholder} required type="text" />
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="email">{contact.fields.email}</label>
                <input class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white" id="email" name="email" placeholder={contact.fields.emailPlaceholder} required type="email" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="phone">{contact.fields.phone}</label>
                <input class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white" id="phone" name="phone" placeholder={contact.fields.phonePlaceholder} required type="tel" />
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="teamSize">{contact.fields.teamSize}</label>
                <select class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white" id="teamSize" name="teamSize">
                  {contact.fields.teamSizeOptions.map((opt) => <option value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="interest">{contact.fields.interest}</label>
                <select class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white" id="interest" name="interest" required>
                  {contact.fields.interestOptions.map((opt) => <option value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="needs">{contact.fields.needs}</label>
              <textarea class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white" id="needs" name="needs" placeholder={contact.fields.needsPlaceholder} required rows="3"></textarea>
            </div>
            <label class="flex items-start gap-2 text-xs text-slate-600">
              <input type="checkbox" name="consent" required class="mt-0.5" />
              <span>{contact.fields.consent}</span>
            </label>
            <button class="w-full py-3.5 rounded-xl text-white font-semibold text-sm runly-gradient-btn shadow-md flex items-center justify-center gap-2" id="submitBtn" type="submit" data-submitting={contact.submitting}>
              <span id="submitLabel">{contact.submit}</span>
              <Send class="w-3.5 h-3.5" />
            </button>
            <div class="hidden p-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-medium text-center" id="formSuccess">
              <CheckCircle2 class="w-4 h-4 inline mr-1.5 text-emerald-600" /> {contact.successMessage}
            </div>
            <div class="hidden p-4 rounded-xl bg-red-100 text-red-800 text-xs font-medium text-center" id="formError">{contact.errorMessage}</div>
            <p class="text-[11px] text-slate-500 text-center pt-2">{contact.privacyNotice}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
  const form = document.getElementById("contactForm") as HTMLFormElement | null;
  const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement | null;
  const submitLabel = document.getElementById("submitLabel");
  const success = document.getElementById("formSuccess");
  const errorBox = document.getElementById("formError");

  if (form && submitBtn && submitLabel && success && errorBox) {
    const originalLabel = submitLabel.textContent ?? "";
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      success.classList.add("hidden");
      errorBox.classList.add("hidden");
      submitBtn.disabled = true;
      submitLabel.textContent = submitBtn.dataset.submitting ?? originalLabel;

      const formData = new FormData(form);
      const payload = {
        fullName: formData.get("fullName"),
        companyName: formData.get("companyName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        teamSize: formData.get("teamSize"),
        interest: formData.get("interest"),
        needs: formData.get("needs"),
        consent: formData.get("consent") === "on",
        website: formData.get("website"), // honeypot, must stay empty
        locale: form.dataset.locale,
        renderedAtMs: Number(form.dataset.renderedAt ?? Date.now()),
      };

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (response.ok && result.ok) {
          form.reset();
          success.classList.remove("hidden");
        } else {
          errorBox.classList.remove("hidden");
        }
      } catch {
        errorBox.classList.remove("hidden");
      } finally {
        submitBtn.disabled = false;
        submitLabel.textContent = originalLabel;
      }
    });
  }
</script>
```

Note: `submitBtn.dataset.submitting` comes straight from the `data-submitting={contact.submitting}` attribute set in the markup above, so the loading label is already localized with no extra wiring step; the script falls back to the original label only if that attribute is somehow missing. `renderedAt` is added to the form dataset when the page mounts (Tasks 25-26) so the API route rate-limiter can reject bot submissions that fire faster than a human could fill the form.

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/components/sections/ContactSection.astro
git commit -m "feat: add contact section with client-side submit handling"
```

## Phase 4 — Page assembly

### Task 25: Spanish homepage (`/`)

**Files:**
- Create: `src/pages/index.astro`
- Modify: `src/pages/index.astro` (delete the placeholder created by Task 1 scaffold, replace entirely)

- [ ] **Step 1: Write src/pages/index.astro**

```astro
---
// src/pages/index.astro
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/layout/Header.astro";
import Footer from "../components/layout/Footer.astro";
import Hero from "../components/sections/Hero.astro";
import FlexibilitySection from "../components/sections/FlexibilitySection.astro";
import ModulesCatalogSection from "../components/sections/ModulesCatalogSection.astro";
import Rm3ArchitectureSection from "../components/sections/Rm3ArchitectureSection.astro";
import ModulesClassificationSection from "../components/sections/ModulesClassificationSection.astro";
import MiraiSection from "../components/sections/MiraiSection.astro";
import MultiCompanySection from "../components/sections/MultiCompanySection.astro";
import ImplementationSection from "../components/sections/ImplementationSection.astro";
import WhyChooseSection from "../components/sections/WhyChooseSection.astro";
import FaqSection from "../components/sections/FaqSection.astro";
import ContactSection from "../components/sections/ContactSection.astro";
import { getDictionary } from "../i18n";

const locale = "es" as const;
const dict = getDictionary(locale);
---

<BaseLayout title={dict.meta.title} description={dict.meta.description} locale={locale} path="/">
  <Header locale={locale} nav={dict.nav} />
  <main>
    <Hero dict={dict} />
    <FlexibilitySection dict={dict} />
    <ModulesCatalogSection dict={dict} locale={locale} />
    <Rm3ArchitectureSection dict={dict} />
    <ModulesClassificationSection dict={dict} />
    <MiraiSection dict={dict} />
    <MultiCompanySection dict={dict} />
    <ImplementationSection dict={dict} />
    <WhyChooseSection dict={dict} />
    <FaqSection dict={dict} />
    <ContactSection dict={dict} locale={locale} />
  </main>
  <Footer locale={locale} footer={dict.footer} />
</BaseLayout>

<script>
  const form = document.getElementById("contactForm") as HTMLFormElement | null;
  if (form) form.dataset.renderedAt = String(Date.now());
</script>
```

- [ ] **Step 2: Verify the dev server renders it**

Run: `pnpm astro dev --port 4321 &` then `curl -s http://localhost:4321/ | grep -o "Business in motion" | head -1` (stop the server after with `kill %1`).
Expected: prints `Business in motion` (confirms the page rendered past the hero, since that phrase only appears once the layout and hero mount correctly).

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble spanish homepage"
```

### Task 26: English homepage (`/en/`)

**Files:**
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: Write src/pages/en/index.astro**

Identical structure to Task 25, with `locale = "en"` and `path="/en/"`:

```astro
---
// src/pages/en/index.astro
import BaseLayout from "../../layouts/BaseLayout.astro";
import Header from "../../components/layout/Header.astro";
import Footer from "../../components/layout/Footer.astro";
import Hero from "../../components/sections/Hero.astro";
import FlexibilitySection from "../../components/sections/FlexibilitySection.astro";
import ModulesCatalogSection from "../../components/sections/ModulesCatalogSection.astro";
import Rm3ArchitectureSection from "../../components/sections/Rm3ArchitectureSection.astro";
import ModulesClassificationSection from "../../components/sections/ModulesClassificationSection.astro";
import MiraiSection from "../../components/sections/MiraiSection.astro";
import MultiCompanySection from "../../components/sections/MultiCompanySection.astro";
import ImplementationSection from "../../components/sections/ImplementationSection.astro";
import WhyChooseSection from "../../components/sections/WhyChooseSection.astro";
import FaqSection from "../../components/sections/FaqSection.astro";
import ContactSection from "../../components/sections/ContactSection.astro";
import { getDictionary } from "../../i18n";

const locale = "en" as const;
const dict = getDictionary(locale);
---

<BaseLayout title={dict.meta.title} description={dict.meta.description} locale={locale} path="/en/">
  <Header locale={locale} nav={dict.nav} />
  <main>
    <Hero dict={dict} />
    <FlexibilitySection dict={dict} />
    <ModulesCatalogSection dict={dict} locale={locale} />
    <Rm3ArchitectureSection dict={dict} />
    <ModulesClassificationSection dict={dict} />
    <MiraiSection dict={dict} />
    <MultiCompanySection dict={dict} />
    <ImplementationSection dict={dict} />
    <WhyChooseSection dict={dict} />
    <FaqSection dict={dict} />
    <ContactSection dict={dict} locale={locale} />
  </main>
  <Footer locale={locale} footer={dict.footer} />
</BaseLayout>

<script>
  const form = document.getElementById("contactForm") as HTMLFormElement | null;
  if (form) form.dataset.renderedAt = String(Date.now());
</script>
```

- [ ] **Step 2: Verify both locales build**

Run: `pnpm astro build`
Expected: exits 0, `dist/client/index.html` and `dist/client/en/index.html` both exist (check: `ls dist/client/index.html dist/client/en/index.html`).

- [ ] **Step 3: Commit**

```bash
git add src/pages/en/index.astro
git commit -m "feat: assemble english homepage"
```

## Phase 5 — Contact form backend

### Task 27: Contact form validation schema

**Files:**
- Create: `src/lib/contact-schema.ts`
- Test: `src/lib/__tests__/contact-schema.test.ts`

- [ ] **Step 1: Install Zod and Nodemailer**

Run: `pnpm add zod nodemailer && pnpm add -D @types/nodemailer`

- [ ] **Step 2: Write the failing test**

```ts
// src/lib/__tests__/contact-schema.test.ts
import { describe, expect, it } from "vitest";
import { contactSchema } from "../contact-schema";

const validPayload = {
  fullName: "Raul Gomez",
  companyName: "Maquinaria y Canteras",
  email: "raul@miempresa.com",
  phone: "+52 55 1234 5678",
  teamSize: "6 a 20 personas",
  interest: "Solicitar demostracion virtual",
  needs: "Inventario multialmacen y chat de soporte integrado",
  consent: true,
  website: "",
  locale: "es",
  renderedAtMs: Date.now() - 5000,
};

describe("contactSchema", () => {
  it("accepts a fully valid payload", () => {
    const result = contactSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects a missing email", () => {
    const result = contactSchema.safeParse({ ...validPayload, email: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email format", () => {
    const result = contactSchema.safeParse({ ...validPayload, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects when consent is false", () => {
    const result = contactSchema.safeParse({ ...validPayload, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects a non-empty honeypot field", () => {
    const result = contactSchema.safeParse({ ...validPayload, website: "http://spam.example" });
    expect(result.success).toBe(false);
  });

  it("rejects a needs field that is too short", () => {
    const result = contactSchema.safeParse({ ...validPayload, needs: "hi" });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL, cannot find module `../contact-schema`.

- [ ] **Step 4: Write src/lib/contact-schema.ts**

```ts
// src/lib/contact-schema.ts
import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(30),
  teamSize: z.string().trim().max(60).optional().default(""),
  interest: z.string().trim().min(2).max(160),
  needs: z.string().trim().min(10).max(2000),
  consent: z.literal(true),
  website: z.string().max(0), // honeypot: must be empty
  locale: z.enum(["es", "en"]),
  renderedAtMs: z.number().int().positive(),
});

export type ContactFormPayload = z.infer<typeof contactSchema>;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml src/lib/contact-schema.ts src/lib/__tests__/contact-schema.test.ts
git commit -m "feat: add validated contact form schema with honeypot"
```

### Task 28: In-memory IP rate limiter

**Files:**
- Create: `src/lib/rate-limit.ts`
- Test: `src/lib/__tests__/rate-limit.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/__tests__/rate-limit.test.ts
import { describe, expect, it } from "vitest";
import { createRateLimiter } from "../rate-limit";

describe("createRateLimiter", () => {
  it("allows requests under the limit", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 3 });
    expect(limiter.check("1.2.3.4").allowed).toBe(true);
    expect(limiter.check("1.2.3.4").allowed).toBe(true);
    expect(limiter.check("1.2.3.4").allowed).toBe(true);
  });

  it("blocks requests once the limit is exceeded", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 2 });
    limiter.check("5.6.7.8");
    limiter.check("5.6.7.8");
    const third = limiter.check("5.6.7.8");
    expect(third.allowed).toBe(false);
  });

  it("tracks each IP independently", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 1 });
    limiter.check("9.9.9.9");
    const otherIp = limiter.check("1.1.1.1");
    expect(otherIp.allowed).toBe(true);
  });

  it("resets after the window passes", () => {
    let now = 0;
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 1, now: () => now });
    expect(limiter.check("2.2.2.2").allowed).toBe(true);
    expect(limiter.check("2.2.2.2").allowed).toBe(false);
    now += 1001;
    expect(limiter.check("2.2.2.2").allowed).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL, cannot find module `../rate-limit`.

- [ ] **Step 3: Write src/lib/rate-limit.ts**

```ts
// src/lib/rate-limit.ts
interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  now?: () => number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const { windowMs, maxRequests, now = () => Date.now() } = options;
  const hits = new Map<string, number[]>();

  return {
    check(key: string): RateLimitResult {
      const currentTime = now();
      const windowStart = currentTime - windowMs;
      const existing = (hits.get(key) ?? []).filter((t) => t > windowStart);

      if (existing.length >= maxRequests) {
        hits.set(key, existing);
        return { allowed: false, remaining: 0 };
      }

      existing.push(currentTime);
      hits.set(key, existing);
      return { allowed: true, remaining: maxRequests - existing.length };
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/rate-limit.ts src/lib/__tests__/rate-limit.test.ts
git commit -m "feat: add in-memory per-IP rate limiter"
```

### Task 29: Nodemailer transport wrapper

**Files:**
- Create: `src/lib/mailer.ts`
- Test: `src/lib/__tests__/mailer.test.ts`

- [ ] **Step 1: Write the failing test (using a fake transporter, no real network I/O)**

```ts
// src/lib/__tests__/mailer.test.ts
import { describe, expect, it, vi } from "vitest";
import { buildContactEmail, sendContactEmail } from "../mailer";
import type { ContactFormPayload } from "../contact-schema";

const payload: ContactFormPayload = {
  fullName: "Raul Gomez",
  companyName: "Maquinaria y Canteras",
  email: "raul@miempresa.com",
  phone: "+52 55 1234 5678",
  teamSize: "6 a 20 personas",
  interest: "Solicitar demostracion virtual",
  needs: "Inventario multialmacen y chat de soporte integrado",
  consent: true,
  website: "",
  locale: "es",
  renderedAtMs: Date.now(),
};

describe("buildContactEmail", () => {
  it("includes every submitted field in the email body", () => {
    const email = buildContactEmail(payload);
    expect(email.subject).toContain("Maquinaria y Canteras");
    expect(email.text).toContain("raul@miempresa.com");
    expect(email.text).toContain("+52 55 1234 5678");
    expect(email.text).toContain("Inventario multialmacen");
  });
});

describe("sendContactEmail", () => {
  it("calls the transporter sendMail with the built email and resolves true on success", async () => {
    const sendMail = vi.fn().mockResolvedValue({ messageId: "abc" });
    const fakeTransporter = { sendMail } as unknown as Parameters<typeof sendContactEmail>[1];

    const result = await sendContactEmail(payload, fakeTransporter, {
      from: "no-reply@runly.mx",
      to: "sales@runly.mx",
    });

    expect(result.ok).toBe(true);
    expect(sendMail).toHaveBeenCalledTimes(1);
    const call = sendMail.mock.calls[0][0];
    expect(call.from).toBe("no-reply@runly.mx");
    expect(call.to).toBe("sales@runly.mx");
    expect(call.replyTo).toBe(payload.email);
  });

  it("returns ok false when the transporter throws", async () => {
    const sendMail = vi.fn().mockRejectedValue(new Error("SMTP down"));
    const fakeTransporter = { sendMail } as unknown as Parameters<typeof sendContactEmail>[1];

    const result = await sendContactEmail(payload, fakeTransporter, {
      from: "no-reply@runly.mx",
      to: "sales@runly.mx",
    });

    expect(result.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL, cannot find module `../mailer`.

- [ ] **Step 3: Write src/lib/mailer.ts**

```ts
// src/lib/mailer.ts
import nodemailer from "nodemailer";
import type { ContactFormPayload } from "./contact-schema";

export function buildContactEmail(payload: ContactFormPayload) {
  const subject = `Nueva solicitud de ${payload.companyName} (${payload.interest})`;
  const text = [
    `Nombre: ${payload.fullName}`,
    `Empresa: ${payload.companyName}`,
    `Correo: ${payload.email}`,
    `Telefono: ${payload.phone}`,
    `Tamano de equipo: ${payload.teamSize || "No especificado"}`,
    `Interes: ${payload.interest}`,
    `Idioma del formulario: ${payload.locale}`,
    "",
    "Necesidades:",
    payload.needs,
  ].join("\n");

  return { subject, text };
}

interface MailerConfig {
  from: string;
  to: string;
}

type Transporter = ReturnType<typeof nodemailer.createTransport>;

export function createTransporter(env: {
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_SECURE: string;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
}): Transporter {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT) || 587,
    secure: env.SMTP_SECURE === "true",
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
  });
}

export async function sendContactEmail(
  payload: ContactFormPayload,
  transporter: Pick<Transporter, "sendMail">,
  config: MailerConfig,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { subject, text } = buildContactEmail(payload);
  try {
    await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: payload.email,
      subject,
      text,
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "unknown_error" };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/mailer.ts src/lib/__tests__/mailer.test.ts
git commit -m "feat: add nodemailer contact email builder and sender"
```

### Task 30: Contact API route

The Astro route itself is a thin adapter (hard to unit test without a running server). The actual decision logic (validate, honeypot, timing check, rate limit, send) lives in a plain function so it can be unit tested directly; `pages/api/contact.ts` just wires it to `Astro.request`/`import.meta.env`.

**Files:**
- Create: `src/lib/handle-contact-request.ts`, `src/pages/api/contact.ts`
- Test: `src/lib/__tests__/handle-contact-request.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/__tests__/handle-contact-request.test.ts
import { describe, expect, it, vi } from "vitest";
import { handleContactRequest } from "../handle-contact-request";
import { createRateLimiter } from "../rate-limit";

const basePayload = {
  fullName: "Raul Gomez",
  companyName: "Maquinaria y Canteras",
  email: "raul@miempresa.com",
  phone: "+52 55 1234 5678",
  teamSize: "6 a 20 personas",
  interest: "Solicitar demostracion virtual",
  needs: "Inventario multialmacen y chat de soporte integrado",
  consent: true,
  website: "",
  locale: "es" as const,
};

function makeDeps(overrides: Partial<Parameters<typeof handleContactRequest>[0]["deps"]> = {}) {
  return {
    rateLimiter: createRateLimiter({ windowMs: 60_000, maxRequests: 5 }),
    sendEmail: vi.fn().mockResolvedValue({ ok: true }),
    minFillTimeMs: 1500,
    ...overrides,
  };
}

describe("handleContactRequest", () => {
  it("sends the email and returns ok for a valid, human-timed submission", async () => {
    const deps = makeDeps();
    const result = await handleContactRequest({
      body: { ...basePayload, renderedAtMs: Date.now() - 5000 },
      ip: "1.2.3.4",
      deps,
    });
    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);
    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("rejects a submission filled faster than minFillTimeMs (likely a bot)", async () => {
    const deps = makeDeps();
    const result = await handleContactRequest({
      body: { ...basePayload, renderedAtMs: Date.now() - 200 },
      ip: "1.2.3.5",
      deps,
    });
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("rejects a non-empty honeypot without calling sendEmail", async () => {
    const deps = makeDeps();
    const result = await handleContactRequest({
      body: { ...basePayload, website: "http://spam.example", renderedAtMs: Date.now() - 5000 },
      ip: "1.2.3.6",
      deps,
    });
    expect(result.status).toBe(400);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("returns 429 once the per-IP rate limit is exceeded", async () => {
    const deps = makeDeps({ rateLimiter: createRateLimiter({ windowMs: 60_000, maxRequests: 1 }) });
    const request = { body: { ...basePayload, renderedAtMs: Date.now() - 5000 }, ip: "1.2.3.7", deps };
    await handleContactRequest(request);
    const second = await handleContactRequest(request);
    expect(second.status).toBe(429);
  });

  it("returns 502 when the email fails to send, and never reports false success", async () => {
    const deps = makeDeps({ sendEmail: vi.fn().mockResolvedValue({ ok: false, error: "smtp_error" }) });
    const result = await handleContactRequest({
      body: { ...basePayload, renderedAtMs: Date.now() - 5000 },
      ip: "1.2.3.8",
      deps,
    });
    expect(result.status).toBe(502);
    expect(result.body.ok).toBe(false);
  });

  it("returns 400 for a schema-invalid payload", async () => {
    const deps = makeDeps();
    const result = await handleContactRequest({
      body: { ...basePayload, email: "not-an-email", renderedAtMs: Date.now() - 5000 },
      ip: "1.2.3.9",
      deps,
    });
    expect(result.status).toBe(400);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL, cannot find module `../handle-contact-request`.

- [ ] **Step 3: Write src/lib/handle-contact-request.ts**

```ts
// src/lib/handle-contact-request.ts
import { contactSchema } from "./contact-schema";
import type { createRateLimiter } from "./rate-limit";

interface HandleContactRequestArgs {
  body: unknown;
  ip: string;
  deps: {
    rateLimiter: ReturnType<typeof createRateLimiter>;
    sendEmail: (payload: ReturnType<typeof contactSchema.parse>) => Promise<{ ok: true } | { ok: false; error: string }>;
    minFillTimeMs: number;
  };
}

interface HandleContactRequestResult {
  status: number;
  body: { ok: true } | { ok: false; error: string };
}

export async function handleContactRequest({
  body,
  ip,
  deps,
}: HandleContactRequestArgs): Promise<HandleContactRequestResult> {
  const rateLimit = deps.rateLimiter.check(ip);
  if (!rateLimit.allowed) {
    return { status: 429, body: { ok: false, error: "rate_limited" } };
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: "invalid_payload" } };
  }

  const fillTimeMs = Date.now() - parsed.data.renderedAtMs;
  if (fillTimeMs < deps.minFillTimeMs) {
    return { status: 400, body: { ok: false, error: "submitted_too_fast" } };
  }

  const sendResult = await deps.sendEmail(parsed.data);
  if (!sendResult.ok) {
    return { status: 502, body: { ok: false, error: "email_delivery_failed" } };
  }

  return { status: 200, body: { ok: true } };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS (6 tests).

- [ ] **Step 5: Wire the Astro API route**

```ts
// src/pages/api/contact.ts
import type { APIRoute } from "astro";
import { createRateLimiter } from "../../lib/rate-limit";
import { createTransporter, sendContactEmail } from "../../lib/mailer";
import { handleContactRequest } from "../../lib/handle-contact-request";

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
    },
  });

  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: { "Content-Type": "application/json" },
  });
};
```

- [ ] **Step 6: Manual smoke test against a local test SMTP server**

Run: `pnpm add -D maildev` then in one terminal `pnpm exec maildev` (web UI at `http://localhost:1080`, SMTP at `localhost:1025`), and in `.env` (local, not committed) set:
```
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM="Runly <no-reply@runly.mx>"
CONTACT_TO_EMAIL=sales@runly.mx
```
Then `pnpm astro dev`, open `http://localhost:4321/#contacto`, submit the form, and confirm the message appears in the MailDev inbox at `http://localhost:1080`.
Expected: email appears with the correct subject, reply-to, and body fields, and the page shows the success message. This confirms end to end that a real SMTP send (not a mock) round-trips correctly before this is considered done, per the design spec section 12.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml src/lib/handle-contact-request.ts src/lib/__tests__/handle-contact-request.test.ts src/pages/api/contact.ts
git commit -m "feat: wire the contact API route with rate limiting and honeypot checks"
```

## Phase 6 — SEO finishing touches

### Task 31: robots.txt

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Write robots.txt**

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://runly.mx/sitemap-index.xml
```

- [ ] **Step 2: Verify the sitemap is generated**

Run: `pnpm astro build`
Expected: `dist/client/sitemap-index.xml` and `dist/client/sitemap-0.xml` exist and list both `https://runly.mx/` and `https://runly.mx/en/` (check: `grep -o "runly.mx[^<]*" dist/client/sitemap-0.xml`).

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt
git commit -m "chore: add robots.txt pointing to the sitemap"
```

## Phase 7 — Brand assets

### Task 32: Copy real brand assets into the project

**Files:**
- Create: `public/brand/runly-logo-light.png`, `public/brand/runly-logo-dark.png`, `public/brand/runly-isotipo-light.png`, `public/brand/runly-isotipo-dark.png`, `public/brand/runly-app-icon-light.png`, `public/brand/runly-app-icon-dark.png`, `public/favicon.svg`

- [ ] **Step 1: Copy the confirmed brand files from Downloads**

Run:
```bash
cp "/c/Users/raulb/Downloads/runly-logo-light.png" public/brand/runly-logo-light.png
cp "/c/Users/raulb/Downloads/runly-logo-dark.png" public/brand/runly-logo-dark.png
cp "/c/Users/raulb/Downloads/runly-logo-horizontal-light.png" public/brand/runly-logo-horizontal-light.png
cp "/c/Users/raulb/Downloads/runly-logo-horizontal-dark.png" public/brand/runly-logo-horizontal-dark.png
cp "/c/Users/raulb/Downloads/runly-isotipo-light.png" public/brand/runly-isotipo-light.png
cp "/c/Users/raulb/Downloads/runly-isotipo-dark.png" public/brand/runly-isotipo-dark.png
cp "/c/Users/raulb/Downloads/runly-app-icon-light.png" public/brand/runly-app-icon-light.png
cp "/c/Users/raulb/Downloads/runly-app-icon-dark.png" public/brand/runly-app-icon-dark.png
cp "/c/Users/raulb/Downloads/runly-isotipo-alter-blue.svg" public/brand/runly-isotipo-alter-blue.svg
```
Expected: all 9 files copied, `ls public/brand` shows them.

- [ ] **Step 2: Generate the favicon from the SVG isotype**

Run: `cp public/brand/runly-isotipo-alter-blue.svg public/favicon.svg`
Expected: `public/favicon.svg` exists (Header/BaseLayout already reference `/favicon.svg` from Task 10).

- [ ] **Step 3: Create a neutral placeholder for the hero product screenshot and the OG cover image**

There is no real Runly dashboard screenshot available in this session. Rather than fabricate one, create a clearly-labeled placeholder using the real isotype on a brand-colored background at the correct aspect ratio, so layout and CLS stay correct until a real screenshot is supplied:

Run (requires ImageMagick, `magick` on PATH):
```bash
magick -size 1600x960 xc:"#0B132B" \
  public/brand/runly-isotipo-light.png -gravity center -geometry 320x320 -composite \
  public/brand/product-dashboard-preview.png

magick -size 1200x630 xc:"#070D1E" \
  public/brand/runly-isotipo-light.png -gravity center -geometry 260x260 -composite \
  public/brand/og-cover.png
```
Expected: both files created at the exact dimensions referenced in Hero.astro (Task 14) and SiteHead.astro (Task 10). If ImageMagick is not available, use any image editor to produce the same two files at the same dimensions — the exact visual is a placeholder pending Task 40's follow-up (real screenshot).

- [ ] **Step 4: Commit**

```bash
git add public/brand public/favicon.svg
git commit -m "feat: add real runly brand assets and placeholder product imagery"
```

Note: `product-dashboard-preview.png` and `og-cover.png` are explicitly placeholders. Do not describe them as real product screenshots in any commit message, README, or report to the user — flag them as pending in the final summary (see design spec section 4 and the "Pending content" list at the top of this plan).

## Phase 8 — Docker and deployment

### Task 33: Dockerfile

**Files:**
- Create: `Dockerfile`, `.dockerignore`

- [ ] **Step 1: Write .dockerignore**

```
node_modules
dist
.astro
.git
.env
.env.*
!.env.example
```

- [ ] **Step 2: Write the multi-stage Dockerfile**

```dockerfile
# Dockerfile
FROM node:20-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm astro build

FROM node:20-slim AS runtime
WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=4321
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
```

- [ ] **Step 3: Verify the image builds**

Run: `docker build -t runly-web:local .`
Expected: exits 0.

- [ ] **Step 4: Verify the container serves the homepage**

Run:
```bash
docker run -d --name runly-web-smoke -p 4321:4321 \
  -e SMTP_HOST=localhost -e SMTP_PORT=1025 -e SMTP_SECURE=false \
  -e SMTP_FROM="Runly <no-reply@runly.mx>" -e CONTACT_TO_EMAIL=sales@runly.mx \
  runly-web:local
sleep 2
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/
docker rm -f runly-web-smoke
```
Expected: prints `200`.

- [ ] **Step 5: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "chore: add production dockerfile"
```

### Task 34: docker-compose service

**Files:**
- Create: `docker-compose.yml`

- [ ] **Step 1: Write docker-compose.yml**

```yaml
services:
  runly-web:
    build: .
    image: racoondevs/runly-web:latest
    restart: unless-stopped
    ports:
      - "4321:4321"
    env_file:
      - .env
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://localhost:4321/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
      interval: 30s
      timeout: 5s
      retries: 3
```

- [ ] **Step 2: Verify compose config is valid**

Run: `docker compose config`
Expected: exits 0, prints the resolved config with no errors.

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml
git commit -m "chore: add docker-compose service definition"
```

### Task 35: README with dev, build, and deploy instructions

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README.md**

```markdown
# Runly Web

Marketing site for [runly.mx](https://runly.mx) — RUNLY ERP, by Racoon Devs. Astro 5, Tailwind CSS, bilingual (ES/EN), SMTP-backed contact form. Separate from the `runly-erp` application repository.

## Development

Requirements: Node 20+, pnpm.

\`\`\`bash
pnpm install
cp .env.example .env   # fill in SMTP_* and CONTACT_TO_EMAIL, see below
pnpm dev
\`\`\`

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

See the "Pending content" section of `docs/superpowers/plans/2026-09-21-runly-web-landing-plan.md` — WhatsApp number, support/sales email addresses, and the hero/OG product imagery are all placeholders until confirmed.

## Docker deploy

\`\`\`bash
docker compose up -d --build
\`\`\`

This runs the site on port 4321 inside the container. It does **not** configure DNS, reverse proxy, or TLS — those are separate, manual steps:

1. Point `runly.mx` and `www.runly.mx` DNS to the VPS hosting this container.
2. Configure the reverse proxy (Nginx or Cloudflare, whichever this infra already uses) to forward `runly.mx` to `localhost:4321` (or the container's published port).
3. Issue/renew a TLS certificate for `runly.mx`.

None of these three steps are executed by this repository or its tooling — they are infrastructure changes outside the scope of the landing page build, and must be done deliberately against the real production environment.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add readme with dev, env, and deploy instructions"
```

## Phase 9 — Final validation

### Task 36: Full verification pass

**Files:** none created; this task only runs checks across the whole project.

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: all tests pass (dictionary parity, modules catalog, contact schema, rate limiter, mailer, contact request handler).

- [ ] **Step 2: Run the Astro typecheck**

Run: `pnpm astro check`
Expected: 0 errors, 0 warnings related to missing props or unknown imports.

- [ ] **Step 3: Run the production build**

Run: `pnpm astro build`
Expected: exits 0. Confirm both locales exist: `ls dist/client/index.html dist/client/en/index.html`.

- [ ] **Step 4: Confirm no secrets are committed**

Run: `git grep -nE "SMTP_(HOST|USER|PASSWORD)\s*=" -- . ':!.env.example' ':!docs' ':!README.md'`
Expected: no output (the only places these variable names appear as `KEY=value` are `.env.example`, `docs/`, and `README.md`, and there they have no real values, only the placeholder `.env.example` blanks).

- [ ] **Step 5: Confirm every module in the real catalog is present and none is invented**

Run: `pnpm test -- src/data/__tests__/modules.test.ts`
Expected: PASS — this re-confirms the 21-module count and MirAI-is-not-a-module assertions from Task 8 as a final gate.

- [ ] **Step 6: Manual browser check (both locales, both breakpoints)**

Run: `pnpm astro dev`, then open `http://localhost:4321/` and `http://localhost:4321/en/` in a browser at a mobile width (375px) and a desktop width (1440px). Confirm:
- No horizontal scroll at either width.
- Mobile menu opens and closes and every link scrolls to its section.
- Module filter buttons actually filter the grid.
- FAQ accordion opens one item at a time.
- Contact form shows the success or error state instead of hanging silently (test against the MailDev setup from Task 30, Step 6).

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "chore: final verification pass before handoff"
```

If any step above fails, fix the underlying issue and re-run that step before committing — do not commit with a known-failing check.
