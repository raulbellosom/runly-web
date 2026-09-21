// src/data/__tests__/modules.test.ts
import { describe, expect, it } from "vitest";
import { modules, moduleCategories } from "../modules";

describe("modules catalog", () => {
  it("has exactly 21 real Runly modules", () => {
    expect(modules).toHaveLength(21);
  });

  it("every module has an ES and EN name and description", () => {
    for (const mod of modules) {
      expect(mod.name.es.length).toBeGreaterThan(0);
      expect(mod.name.en.length).toBeGreaterThan(0);
      expect(mod.description.es.length).toBeGreaterThan(0);
      expect(mod.description.en.length).toBeGreaterThan(0);
    }
  });

  it("does not list a MirAI entry as its own module", () => {
    expect(modules.find((m) => m.id === "runly.mirai")).toBeUndefined();
  });

  it("every module category exists in moduleCategories", () => {
    const categoryIds = new Set(moduleCategories.map((c) => c.id));
    for (const mod of modules) {
      expect(categoryIds.has(mod.category)).toBe(true);
    }
  });
});

// Icon-name validity for modules/roadmap is covered by
// src/lib/__tests__/icons.test.ts, alongside every other section that
// resolves icon names dynamically at runtime.
