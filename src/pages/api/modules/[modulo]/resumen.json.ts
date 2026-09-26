// src/pages/api/modules/[modulo]/resumen.json.ts
//
// Static per-module JSON endpoint (build-time generated). Same overview +
// views shape as GET /help/modules/:moduleKey inside a live Runly instance
// (help-service.js's getModuleHelp), except each view here also includes
// its full `content` (raw markdown) — this is the public source, so
// there's no reason to hold it back the way the in-instance endpoint does.
// See docs/superpowers/specs/2026-09-27-public-help-docs-runly-web-design.md.
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { groupHelpEntriesByModule } from "../../../../lib/help-content";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection("help");
  const grouped = groupHelpEntriesByModule(entries);
  return [...grouped.keys()].map((moduleKey) => ({ params: { modulo: moduleKey } }));
};

export const GET: APIRoute = async ({ params }) => {
  const entries = await getCollection("help");
  const grouped = groupHelpEntriesByModule(entries);
  const mod = grouped.get(params.modulo ?? "");

  if (!mod) {
    return new Response(JSON.stringify({ error: "Modulo no encontrado." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = {
    moduleKey: mod.moduleKey,
    overview: mod.overview,
    views: mod.views.map((v) => ({
      viewKey: v.viewKey,
      title: v.title,
      summary: v.summary,
      content: v.content,
    })),
  };

  return new Response(JSON.stringify({ data }), {
    headers: { "Content-Type": "application/json" },
  });
};
