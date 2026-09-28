// src/lib/__tests__/docs-catalog.test.ts
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as Icons from "@lucide/astro";
import { buildDocsCatalog, developerPageIcon, normalizeSearchText, searchKeywords } from "../docs-catalog";
import { modules } from "../../data/modules";
import { docGuides } from "../../data/doc-guides";
import navigation from "../../data/help-navigation.json";

const view = (moduleKey: string, slug: string, viewKey: string) => ({
  id: `${moduleKey}/views/${slug}`,
  data: { title: slug, summary: `${slug} summary`, viewKey },
  body: `Body of ${slug}`,
});

describe("buildDocsCatalog", () => {
  const nav = {
    "runly.core": [
      { path: "/modules", icon: "Puzzle" },
      { path: "/module-builder", icon: "Hammer" },
      { path: "/settings", icon: "Settings" },
    ],
  };
  const entries = [
    { id: "runly.core/overview", data: { title: "Runly Core", summary: "Nucleo." }, body: "" },
    view("runly.core", "configuracion", "/settings"),
    view("runly.core", "constructor-publicar", "/module-builder/publicar"),
    view("runly.core", "constructor-de-modulos", "/module-builder"),
    view("runly.core", "constructor-datos-y-campos", "/module-builder/datos-y-campos"),
    view("runly.core", "inicio", "/app/home"),
    view("runly.core", "modulos", "/modules"),
    view("runly.core", "desconocida", "/otra"),
  ];

  const [core] = buildDocsCatalog(entries, modules, nav);

  it("takes name, icon and color from the marketing catalog", () => {
    expect(core).toMatchObject({ moduleKey: "runly.core", name: "Runly Core", icon: "Layers", color: "#0A7BFF" });
  });

  it("orders views like the module sidebar, with sub-topics after their parent screen", () => {
    expect(core.views.map((v) => v.slug)).toEqual([
      "inicio",
      "modulos",
      "constructor-de-modulos",
      "constructor-datos-y-campos",
      "constructor-publicar",
      "configuracion",
      "desconocida",
    ]);
  });

  it("gives each view its sidebar icon, a curated one, or a generic fallback", () => {
    const icons = Object.fromEntries(core.views.map((v) => [v.slug, v.icon]));
    expect(icons).toMatchObject({
      modulos: "Puzzle",
      "constructor-publicar": "Rocket",
      inicio: "House",
      desconocida: "FileText",
    });
  });
});

describe("search helpers", () => {
  it("normalizes accents and case", () => {
    expect(normalizeSearchText("Módulos ÚTILES")).toBe("modulos utiles");
  });

  it("extracts distinct 4+ letter words from markdown", () => {
    expect(searchKeywords("**Caja**: cobra la caja y el `ticket`.")).toBe("caja cobra ticket");
  });
});

describe("synced help content", () => {
  const helpDir = path.join(process.cwd(), "src/content/help");
  const iconMap = Icons as unknown as Record<string, unknown>;

  it("every guide step points at an existing help view", () => {
    for (const guide of docGuides) {
      for (const step of guide.steps) {
        const file = path.join(helpDir, step.moduleKey, "views", `${step.view}.md`);
        expect(fs.existsSync(file), `${guide.slug}: missing ${step.moduleKey}/views/${step.view}.md`).toBe(true);
      }
    }
  });

  it("every navigation and guide icon resolves to a real @lucide/astro export", () => {
    const names = [
      ...Object.values(navigation as Record<string, { icon: string }[]>).flatMap((items) => items.map((i) => i.icon)),
      ...docGuides.map((g) => g.icon),
      "House", "Database", "Link2", "LayoutPanelLeft", "GitBranch", "Paperclip", "LayoutGrid", "Rocket", "FileText",
      ...fs.readdirSync(path.join(process.cwd(), "src/content/developers")).map((f) => developerPageIcon(f.replace(/\.md$/, ""))),
    ];
    for (const name of names) expect(iconMap[name], `unknown icon "${name}"`).toBeDefined();
  });
});
