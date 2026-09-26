// src/content.config.ts
//
// The "help" collection is populated from a local checkout of the runly
// monorepo via scripts/sync-help-content.mjs (manual step, run whenever
// help content changes there) — see
// docs/superpowers/specs/2026-09-27-public-help-docs-runly-web-design.md
// in that repo. Each entry's id is its path under src/content/help/ minus
// the extension, e.g. "runly.core/overview" or "runly.core/views/modulos".
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const help = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/help",
    // The default id generator slugifies the entry path, which silently
    // strips the dots out of module keys ("runly.core" -> "runlycore") —
    // wrong on every level (URL, JSON `moduleKey` field, cross-referencing
    // src/data/modules.ts by id). Preserve the path as-is, just drop the
    // .md extension: "runly.core/overview.md" -> "runly.core/overview".
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    // Present only on views/*.md entries — the module-relative navigation
    // path this article documents (same convention as runly's own
    // navigation.path / help-service.js's toModuleApiPath()).
    viewKey: z.string().optional(),
  }),
});

export const collections = { help };
