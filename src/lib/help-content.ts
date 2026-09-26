// src/lib/help-content.ts
//
// Groups the flat "help" content collection (one entry per markdown file,
// id like "runly.core/overview" or "runly.core/views/modulos") into a
// per-module { overview, views[] } shape — the same shape
// GET /help/modules/:moduleKey returns inside a live Runly instance
// (apps/api/src/services/help-service.js's getModuleHelp), so the
// documentation pages and JSON endpoints built from this can mirror it.
export interface HelpArticle {
  title: string;
  summary: string;
  content: string;
}

export interface ModuleHelpView extends HelpArticle {
  viewKey: string;
  slug: string;
}

export interface ModuleHelp {
  moduleKey: string;
  overview: HelpArticle | null;
  views: ModuleHelpView[];
}

interface HelpEntryLike {
  id: string;
  data: { title: string; summary: string; viewKey?: string };
  body?: string;
}

function toArticle(entry: HelpEntryLike): HelpArticle {
  return {
    title: entry.data.title,
    summary: entry.data.summary,
    content: entry.body ?? "",
  };
}

export function groupHelpEntriesByModule(entries: HelpEntryLike[]): Map<string, ModuleHelp> {
  const byModule = new Map<string, ModuleHelp>();

  function moduleOf(moduleKey: string): ModuleHelp {
    let mod = byModule.get(moduleKey);
    if (!mod) {
      mod = { moduleKey, overview: null, views: [] };
      byModule.set(moduleKey, mod);
    }
    return mod;
  }

  for (const entry of entries) {
    const [moduleKey, kind, slugFile] = entry.id.split("/");
    if (!moduleKey || !kind) continue;
    const mod = moduleOf(moduleKey);
    if (kind === "overview") {
      mod.overview = toArticle(entry);
    } else if (kind === "views" && slugFile) {
      mod.views.push({
        ...toArticle(entry),
        viewKey: entry.data.viewKey ?? "",
        slug: slugFile,
      });
    }
  }

  return byModule;
}

export function getModuleHelp(entries: HelpEntryLike[], moduleKey: string): ModuleHelp | null {
  return groupHelpEntriesByModule(entries).get(moduleKey) ?? null;
}
