// src/lib/marketplace-build.ts
//
// Build-time access to the Developer Hub directory, fetched once per build and
// shared by /modulos, /en/modulos and every static module detail page.
//   PUBLIC_RUNLY_HUB_URL       Hub origin (default https://devs.runly.mx)
//   RUNLY_CATALOG_BUILD_FETCH  "0" skips the fetch (offline builds): the pages
//                              render the unavailable state and the browser
//                              still loads fresh data.
//   RUNLY_CATALOG_REQUIRED     "1" fails the build when the Hub is unavailable
//                              (for release pipelines that want SEO guaranteed).
import { fetchDirectory, type DirectoryResult } from "./marketplace";

let pending: Promise<DirectoryResult> | null = null;

export function loadDirectoryForBuild(): Promise<DirectoryResult> {
  pending ??= (async () => {
    if (import.meta.env.RUNLY_CATALOG_BUILD_FETCH === "0") return { status: "unavailable", fetchedAt: new Date().toISOString(), reason: "build_fetch_disabled", modules: [] } as DirectoryResult;
    const result = await fetchDirectory({ hubUrl: import.meta.env.PUBLIC_RUNLY_HUB_URL, timeoutMs: 15000 });
    if (result.status !== "ok") {
      if (import.meta.env.RUNLY_CATALOG_REQUIRED === "1") throw new Error(`RUNLY_CATALOG_UNAVAILABLE: ${result.reason}`);
      console.warn(`[marketplace] Developer Hub directory unavailable at build (${result.reason}); /modulos renders the unavailable state and refreshes in the browser.`);
    }
    return result;
  })();
  return pending;
}
