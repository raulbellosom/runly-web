// Pulls each official module's sidebar navigation ({ path, icon }) out of the
// runly monorepo's manifest sources (apps/api/src/manifests/official/*.js)
// without importing them — they pull in server-only dependencies. The docs
// pages use it to show every help view with the same icon and in the same
// order as that module's sidebar inside Runly (a view's `viewKey` frontmatter
// is its navigation `path`).
//
// Paths repeat across modules ("/", "/settings"), so the result is keyed by
// module: { "runly.pos": [{ path, icon }, ...], ... }. Pure/no I/O so it's
// unit-testable with an inline source string.
const MODULE_KEY_LINE = /^\s*key:\s*["'](runly\.[a-z0-9_-]+)["'],?\s*$/gm;
const NAV_ITEM = /path:\s*["']([^"']+)["'],\s*icon:\s*["']([^"']+)["']/g;

export function extractModuleNavigation(source) {
  const starts = [...source.matchAll(MODULE_KEY_LINE)].map((m) => ({ moduleKey: m[1], index: m.index }));
  const result = {};

  starts.forEach(({ moduleKey, index }, i) => {
    const block = source.slice(index, starts[i + 1]?.index ?? source.length);
    const items = [];
    for (const [, itemPath, icon] of block.matchAll(NAV_ITEM)) {
      if (!items.some((item) => item.path === itemPath)) items.push({ path: itemPath, icon });
    }
    if (items.length > 0) result[moduleKey] = items;
  });

  return result;
}
