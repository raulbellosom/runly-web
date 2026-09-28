import { describe, expect, it } from "vitest";
import { developerDocMarkdown, llmsFullTxt, llmsTxt } from "../developer-docs";

const entries = [
  { id: "relaciones", body: "Ver [API](/documentacion/desarrolladores/api-modulos).", data: { title: "Relaciones", summary: "Relaciones.", order: 4 } },
  { id: "index", body: "Inicio.", data: { title: "Desarrollo de módulos", summary: "Guía.", order: 0 } },
];

describe("developer docs for AI assistants", () => {
  it("renders a page as Markdown with absolute links", () => {
    expect(developerDocMarkdown(entries[0])).toBe(
      "# Relaciones\n\n> Relaciones.\n\nVer [API](https://runly.mx/documentacion/desarrolladores/api-modulos).\n",
    );
  });

  it("lists pages in order in llms.txt, with module help", () => {
    const text = llmsTxt(entries, [{ moduleKey: "runly.core", title: "Runly Core", summary: "Núcleo." }]);
    expect(text.indexOf("desarrolladores/index.md")).toBeLessThan(text.indexOf("desarrolladores/relaciones.md"));
    expect(text).toContain("- [Runly Core](https://runly.mx/documentacion/modulos/runly.core): Núcleo.");
  });

  it("concatenates every page in llms-full.txt", () => {
    expect(llmsFullTxt(entries)).toMatch(/^# Desarrollo de módulos[\s\S]*---[\s\S]*# Relaciones/);
  });
});
