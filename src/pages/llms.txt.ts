// /llms.txt — index for AI assistants (https://llmstxt.org): developer docs
// (Markdown) and the module help pages.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { groupHelpEntriesByModule } from "../lib/help-content";
import { llmsTxt } from "../lib/developer-docs";

export const prerender = true;

export const GET: APIRoute = async () => {
  const developers = await getCollection("developers");
  const grouped = groupHelpEntriesByModule(await getCollection("help"));
  const modules = [...grouped.values()]
    .filter((mod) => mod.overview)
    .map((mod) => ({ moduleKey: mod.moduleKey, title: mod.overview!.title, summary: mod.overview!.summary }));
  return new Response(llmsTxt(developers, modules), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
