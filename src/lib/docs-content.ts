// src/lib/docs-content.ts
//
// Astro-side entry point for the /documentacion pages: reads the content
// collections and hands back the joined catalog (see docs-catalog.ts, which
// holds the pure, unit-tested logic) plus the guides resolved against it.
import { getCollection } from "astro:content";
import { buildDocsCatalog, type DocModule, type DocView } from "./docs-catalog";
import { modules as marketingModules } from "../data/modules";
import { docGuides, type DocGuide } from "../data/doc-guides";
import navigation from "../data/help-navigation.json";

export interface ResolvedGuideStep {
  module: DocModule;
  view: DocView;
}

export interface ResolvedGuide extends DocGuide {
  resolvedSteps: ResolvedGuideStep[];
}

export async function getDocsCatalog(): Promise<DocModule[]> {
  return buildDocsCatalog(await getCollection("help"), marketingModules, navigation);
}

export function resolveGuides(catalog: DocModule[]): ResolvedGuide[] {
  return docGuides.map((guide) => ({
    ...guide,
    resolvedSteps: guide.steps.flatMap((step) => {
      const module = catalog.find((m) => m.moduleKey === step.moduleKey);
      const view = module?.views.find((v) => v.slug === step.view);
      return module && view ? [{ module, view }] : [];
    }),
  }));
}

export const moduleDocHref = (moduleKey: string) => `/documentacion/modulos/${moduleKey}`;
export const viewDocHref = (moduleKey: string, slug: string) => `${moduleDocHref(moduleKey)}#${slug}`;
export const guideHref = (slug: string) => `/documentacion/guias/${slug}`;
export const developerDocHref = (id: string) =>
  id === "index" ? "/documentacion/desarrolladores" : `/documentacion/desarrolladores/${id}`;
