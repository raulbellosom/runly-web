// src/lib/__tests__/icons.test.ts
import { describe, expect, it } from "vitest";
import * as Icons from "@lucide/astro";
import { es } from "../../i18n/es";
import { modules, roadmap } from "../../data/modules";

// Guards every place an icon name is stored as a plain string and resolved
// dynamically at runtime (via resolveIcon), instead of through a locally
// closed alias map — a typo here would silently fall back to a generic icon
// with no build error. flexibility.cards and mirai.capabilities are
// intentionally excluded: those go through their section's own closed
// iconMap (e.g. "PuzzlePiece" -> Puzzle), which is a deliberate alias, not
// a direct @lucide/astro export name.
//
// Table-driven: add a new { label, names } entry here whenever a new
// section starts resolving icons dynamically, instead of copy-pasting
// another near-identical `it()` block.
const iconMap = Icons as unknown as Record<string, unknown>;

const cases: { label: string; names: string[] }[] = [
  {
    label: "module catalog and roadmap",
    names: [...modules.map((m) => m.icon), ...roadmap.map((r) => r.icon)],
  },
  {
    label: "rm3 nodes and pillars",
    names: [
      ...es.rm3.leftNodes.map((n) => n.icon),
      ...es.rm3.rightNodes.map((n) => n.icon),
      ...es.rm3.pillars.map((p) => p.icon),
    ],
  },
  {
    label: "whyChoose cards",
    names: es.whyChoose.cards.map((c) => c.icon),
  },
];

describe("dynamically-resolved icon names", () => {
  it.each(cases)("every $label icon resolves to a real @lucide/astro export", ({ names }) => {
    for (const name of names) {
      expect(iconMap[name], `unknown icon "${name}"`).toBeDefined();
    }
  });
});
