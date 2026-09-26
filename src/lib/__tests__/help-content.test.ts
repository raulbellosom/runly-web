// src/lib/__tests__/help-content.test.ts
import { describe, expect, it } from "vitest";
import { groupHelpEntriesByModule, getModuleHelp } from "../help-content";

const ENTRIES = [
  {
    id: "runly.core/overview",
    data: { title: "Runly Core", summary: "Nucleo del sistema." },
    body: "Contenido completo del overview.",
  },
  {
    id: "runly.core/views/modulos",
    data: { title: "Modulos", summary: "Instala y gestiona modulos.", viewKey: "/modules" },
    body: "Contenido de la vista Modulos.",
  },
  {
    id: "runly.core/views/settings",
    data: { title: "Configuracion", summary: "Ajustes generales.", viewKey: "/settings" },
    body: "Contenido de configuracion.",
  },
  {
    id: "runly.chat/overview",
    data: { title: "Chat", summary: "Mensajeria interna." },
    body: "Contenido del chat.",
  },
];

describe("groupHelpEntriesByModule", () => {
  it("groups overview + views under their moduleKey", () => {
    const grouped = groupHelpEntriesByModule(ENTRIES);
    expect([...grouped.keys()].sort()).toEqual(["runly.chat", "runly.core"]);

    const core = grouped.get("runly.core")!;
    expect(core.overview?.title).toBe("Runly Core");
    expect(core.views).toHaveLength(2);
    expect(core.views.map((v) => v.slug).sort()).toEqual(["modulos", "settings"]);
  });

  it("a module with only an overview has an empty views array", () => {
    const grouped = groupHelpEntriesByModule(ENTRIES);
    expect(grouped.get("runly.chat")?.views).toEqual([]);
  });
});

describe("getModuleHelp", () => {
  it("returns the grouped help for one module", () => {
    const result = getModuleHelp(ENTRIES, "runly.core");
    expect(result?.moduleKey).toBe("runly.core");
    expect(result?.views).toHaveLength(2);
  });

  it("returns null for an unknown module", () => {
    expect(getModuleHelp(ENTRIES, "runly.unknown")).toBeNull();
  });
});
