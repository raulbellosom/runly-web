// src/lib/docs-catalog.ts
//
// Joins the three sources the /documentacion pages draw from into one list
// of modules, each with its views in sidebar order:
//   - help content (src/content/help, synced from runly): titles/summaries
//   - marketing catalog (src/data/modules.ts): name, icon, color, category
//   - module navigation (src/data/help-navigation.json, synced from runly's
//     manifests): each view's in-app icon and its position in the sidebar
// A view's `viewKey` frontmatter is its navigation `path`, which is the join.
import { groupHelpEntriesByModule } from "./help-content";
import type { ModuleCategory, RunlyModuleEntry } from "../data/modules";

export interface NavigationItem {
  path: string;
  icon: string;
}

export interface DocView {
  slug: string;
  viewKey: string;
  title: string;
  summary: string;
  icon: string;
  body: string;
}

export interface DocModule {
  moduleKey: string;
  name: string;
  summary: string;
  icon: string;
  color: string;
  category: ModuleCategory | null;
  version: string | null;
  views: DocView[];
}

interface HelpEntryLike {
  id: string;
  data: { title: string; summary: string; viewKey?: string };
  body?: string;
}

// Documented views with no sidebar entry of their own — sub-topics of a
// screen (the Module Builder's editor tabs) or screens outside the module's
// sidebar (the home page). Listed in reading order; each is placed right
// after the nav item its path starts with, or first when none matches.
const UNLISTED_VIEWS: Record<string, NavigationItem[]> = {
  "runly.core": [
    { path: "/app/home", icon: "House" },
    { path: "/module-builder/datos-y-campos", icon: "Database" },
    { path: "/module-builder/relaciones", icon: "Link2" },
    { path: "/module-builder/diseno", icon: "LayoutPanelLeft" },
    { path: "/module-builder/condiciones", icon: "GitBranch" },
    { path: "/module-builder/archivos", icon: "Paperclip" },
    { path: "/module-builder/vistas", icon: "LayoutGrid" },
    { path: "/module-builder/enlaces", icon: "Share2" },
    { path: "/module-builder/publicar", icon: "Rocket" },
  ],
};

export const DEFAULT_VIEW_ICON = "FileText";

// Icons for the developer docs pages (src/content/developers/<id>.md).
const DEVELOPER_PAGE_ICONS: Record<string, string> = {
  index: "BookOpen",
  "flujo-zip": "FileArchive",
  "pantallas-react": "Component",
  "api-modulos": "Webhook",
  relaciones: "Link2",
  "enlaces-publicos": "Share2",
  campos: "TextCursorInput",
  librerias: "Package",
  ia: "Bot",
  "solucion-problemas": "LifeBuoy",
};

export function developerPageIcon(id: string): string {
  return DEVELOPER_PAGE_ICONS[id] ?? "FileCode";
}

function placeView(moduleKey: string, viewKey: string, nav: NavigationItem[]): { icon: string; order: number } {
  const navIndex = nav.findIndex((item) => item.path === viewKey);
  if (navIndex >= 0) return { icon: nav[navIndex].icon, order: navIndex };

  const unlisted = UNLISTED_VIEWS[moduleKey] ?? [];
  const unlistedIndex = unlisted.findIndex((item) => item.path === viewKey);
  const icon = unlisted[unlistedIndex]?.icon ?? DEFAULT_VIEW_ICON;
  const parentIndex = nav.findIndex((item) => item.path !== "/" && viewKey.startsWith(`${item.path}/`));
  const base = parentIndex >= 0 ? parentIndex : unlistedIndex >= 0 ? -1 : nav.length;
  return { icon, order: base + (unlistedIndex + 1) / 100 };
}

export function buildDocsCatalog(
  entries: HelpEntryLike[],
  marketingModules: RunlyModuleEntry[],
  navigation: Record<string, NavigationItem[]>,
): DocModule[] {
  const grouped = groupHelpEntriesByModule(entries);

  return [...grouped.values()]
    .map((mod) => {
      const marketing = marketingModules.find((m) => m.id === mod.moduleKey);
      const nav = navigation[mod.moduleKey] ?? [];
      const views = mod.views
        .map((view) => ({ view, ...placeView(mod.moduleKey, view.viewKey, nav) }))
        .sort((a, b) => a.order - b.order || a.view.title.localeCompare(b.view.title))
        .map(({ view, icon }) => ({
          slug: view.slug,
          viewKey: view.viewKey,
          title: view.title,
          summary: view.summary,
          icon,
          body: view.content,
        }));

      return {
        moduleKey: mod.moduleKey,
        name: marketing?.name.es ?? mod.overview?.title ?? mod.moduleKey,
        summary: mod.overview?.summary ?? marketing?.description.es ?? "",
        icon: marketing?.icon ?? "BookOpen",
        color: marketing?.color ?? "#ff5e14",
        category: marketing?.category ?? null,
        version: marketing?.version ?? null,
        views,
        order: marketing?.order ?? 999,
      };
    })
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...mod }) => mod);
}

// Lowercase, accent-free text for client-side search: the help content is
// written without accents ("modulos") but people type them ("módulos").
export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// Compact searchable text for a markdown body: its distinct words (4+
// letters), so the search finds terms inside articles without shipping every
// article's full text on every docs page.
export function searchKeywords(markdown: string): string {
  const words = normalizeSearchText(markdown.replace(/[`*_#>|[\]()-]/g, " ")).match(/[a-z0-9]{4,}/g) ?? [];
  return [...new Set(words)].join(" ");
}
