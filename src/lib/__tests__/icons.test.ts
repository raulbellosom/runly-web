// src/lib/__tests__/icons.test.ts
import { describe, expect, it } from "vitest";
import * as Icons from "@lucide/astro";
import { es } from "../../i18n/es";

// Guards the sections that resolve an icon name dynamically at runtime
// (via resolveIcon) instead of through a locally-typed alias map — a typo
// here would silently fall back to a generic icon with no build error.
// flexibility.cards is intentionally excluded: its icon names go through
// FlexibilitySection's own closed iconMap (e.g. "PuzzlePiece" -> Puzzle),
// which is a deliberate alias, not a direct @lucide/astro export name.
describe("dictionary icon names used by resolveIcon", () => {
  const iconMap = Icons as unknown as Record<string, unknown>;

  it("every rm3 node and pillar icon resolves to a real @lucide/astro export", () => {
    const names = [
      ...es.rm3.leftNodes.map((n) => n.icon),
      ...es.rm3.rightNodes.map((n) => n.icon),
      ...es.rm3.pillars.map((p) => p.icon),
    ];
    for (const name of names) {
      expect(iconMap[name], `unknown icon "${name}" in rm3 dictionary content`).toBeDefined();
    }
  });
});
