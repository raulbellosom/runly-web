// Derives { moduleKey, kind, slug } from a help-content file path relative to
// the help root (e.g. "runly.core/overview.md" or
// "runly.core/views/modulos.md") — the exact two shapes
// loadHelpBlueprints() in the runly monorepo produces. Pure/no I/O so the
// sync script's naming logic is unit-testable without touching the
// filesystem; the actual recursive copy (I/O) is verified by running the
// script once and inspecting the result (see the spec's verification plan).
export function parseHelpRelativePath(relPath) {
  const parts = relPath.replace(/\\/g, "/").split("/").filter(Boolean);

  if (parts.length === 2 && parts[1] === "overview.md") {
    return { moduleKey: parts[0], kind: "overview" };
  }
  if (parts.length === 3 && parts[1] === "views" && parts[2].endsWith(".md")) {
    return { moduleKey: parts[0], kind: "view", slug: parts[2].slice(0, -".md".length) };
  }
  return null;
}
