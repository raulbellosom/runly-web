// /llms-full.txt — every developer doc page in one plain-text file.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { llmsFullTxt } from "../lib/developer-docs";

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(llmsFullTxt(await getCollection("developers")), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
