// /documentacion/desarrolladores/<slug>.md — raw Markdown of each developer
// page, for AI assistants (linked from /llms.txt).
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { developerDocMarkdown } from "../../../lib/developer-docs";

export const prerender = true;

export async function getStaticPaths() {
  const entries = await getCollection("developers");
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(developerDocMarkdown(props.entry), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
