// src/pages/api/modules/index.json.ts
//
// Static JSON endpoint (generated at build time, output: "static" — no
// server, no per-request compute) listing every module with synced help
// content. Same shape as GET /help/modules inside a live Runly instance
// (apps/api/src/services/help-service.js's listModulesWithHelp) so a
// consumer (AI model, or an instance falling back to this public source)
// can treat both the same way. See
// docs/superpowers/specs/2026-09-27-public-help-docs-runly-web-design.md.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { groupHelpEntriesByModule } from "../../../lib/help-content";

export const prerender = true;

export const GET: APIRoute = async () => {
  const entries = await getCollection("help");
  const grouped = groupHelpEntriesByModule(entries);

  const data = [...grouped.values()]
    .filter((mod) => mod.overview)
    .map((mod) => ({
      moduleKey: mod.moduleKey,
      title: mod.overview!.title,
      summary: mod.overview!.summary,
    }));

  return new Response(JSON.stringify({ data }), {
    headers: { "Content-Type": "application/json" },
  });
};
