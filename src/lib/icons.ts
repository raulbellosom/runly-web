// src/lib/icons.ts
import * as Icons from "@lucide/astro";

// Shared dynamic icon-name-to-component resolver, used wherever an icon name
// is stored as a string (module catalog data, dictionary content) rather than
// statically imported. Falls back to a generic icon so a typo never breaks
// the build; pair with a test that walks every icon-name field to catch typos.
export function resolveIcon(name: string) {
  return (Icons as unknown as Record<string, typeof Icons.Boxes>)[name] ?? Icons.Boxes;
}
