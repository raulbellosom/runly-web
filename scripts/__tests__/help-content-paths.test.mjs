import { describe, expect, it } from "vitest";
import { parseHelpRelativePath } from "../lib/help-content-paths.mjs";

describe("parseHelpRelativePath", () => {
  it("parses a module overview path", () => {
    expect(parseHelpRelativePath("runly.core/overview.md")).toEqual({
      moduleKey: "runly.core",
      kind: "overview",
    });
  });

  it("parses a view path", () => {
    expect(parseHelpRelativePath("runly.core/views/modulos.md")).toEqual({
      moduleKey: "runly.core",
      kind: "view",
      slug: "modulos",
    });
  });

  it("normalizes Windows-style backslashes", () => {
    expect(parseHelpRelativePath("runly.core\\views\\modulos.md")).toEqual({
      moduleKey: "runly.core",
      kind: "view",
      slug: "modulos",
    });
  });

  it("returns null for a path that doesn't match either shape", () => {
    expect(parseHelpRelativePath("runly.core/README.md")).toBeNull();
    expect(parseHelpRelativePath("not-markdown.txt")).toBeNull();
    expect(parseHelpRelativePath("runly.core/views/nested/too-deep.md")).toBeNull();
  });
});
