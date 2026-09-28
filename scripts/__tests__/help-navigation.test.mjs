import { describe, expect, it } from "vitest";
import { extractModuleNavigation } from "../lib/help-navigation.mjs";

const source = `
export const coreManifest = {
  key: "runly.core",
  icon: "Layers",
  navigation: [
    {
      label: "Modulos",
      path: "/modules",
      icon: "Puzzle",
    },
    { label: "Configuracion", path: "/settings", icon: "Settings" },
  ],
  permissions: [{ key: "runly.help.read", name: "Read Module Help" }],
};

const notes = {
  key: 'runly.notes',
  dependencies: [{ key: 'runly.core' }],
  navigation: [
    { label: 'Todas', path: '/notes', icon: 'NotebookPen' },
    { label: 'Ajustes', path: '/settings', icon: 'Cog' },
  ],
};
`;

describe("extractModuleNavigation", () => {
  it("groups navigation items by module, in sidebar order", () => {
    expect(extractModuleNavigation(source)).toEqual({
      "runly.core": [
        { path: "/modules", icon: "Puzzle" },
        { path: "/settings", icon: "Settings" },
      ],
      "runly.notes": [
        { path: "/notes", icon: "NotebookPen" },
        { path: "/settings", icon: "Cog" },
      ],
    });
  });

  it("ignores inline keys (dependencies, permissions) as module boundaries", () => {
    expect(Object.keys(extractModuleNavigation(source))).toEqual(["runly.core", "runly.notes"]);
  });
});
