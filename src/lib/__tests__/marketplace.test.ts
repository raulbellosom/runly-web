import { describe, expect, it } from "vitest";
import { capabilityFacets, fetchDirectory, fetchModule, filterModules, hubBaseUrl, normalizeModule, MARKETPLACE_TEXT } from "../marketplace";

const community = (patch: Record<string, unknown> = {}) => ({
  key: "custom.notas", name: "Notas", description: "Notas compartidas", version: "1.2.0", trust: "community", trustLevel: "community",
  publisher: { handle: "acme-labs", displayName: "Acme Labs", verified: false, state: "active" }, availability: "available", listed: true, indexable: true,
  capabilities: ["records.read"], dependencies: ["runly.core"], compatibility: { runly: { min: "0.1.0", max: null }, contracts: {} }, icon: "NotebookPen", color: "#22AA88",
  changelog: "Primera versión", publishedAt: "2026-10-06T00:00:00.000Z", sha256: "a".repeat(64), ...patch,
});
const official = (patch: Record<string, unknown> = {}) => ({ ...community(), key: "custom.facturas", name: "Facturas", trust: "official", trustLevel: "official", publisher: null, ...patch });

describe("normalizeModule", () => {
  it("keeps structured trust and never promotes Community Verified to Official", () => {
    expect(normalizeModule(official())?.trustLevel).toBe("official");
    expect(normalizeModule(community({ trustLevel: "community-verified", publisher: { handle: "acme-labs", displayName: "Acme", verified: true } }))?.trustLevel).toBe("community-verified");
    // Inconsistent producer data is dropped, never "fixed" upward.
    expect(normalizeModule(community({ trustLevel: "official" }))).toBeNull();
    expect(normalizeModule(official({ publisher: { handle: "runly-team", displayName: "Runly", verified: true } }))).toBeNull();
    expect(normalizeModule(community({ trustLevel: "community-verified" }))).toBeNull();
    expect(normalizeModule(community({ trustLevel: "verified" }))).toBeNull();
    // A publisher named like Runly stays Community.
    expect(normalizeModule(community({ publisher: { handle: "acme-labs", displayName: "Runly Official", verified: false } }))?.trustLevel).toBe("community");
  });

  it("rejects unknown namespaces and malformed data; sanitizes presentation fields", () => {
    for (const patch of [{ key: "runly.core" }, { key: "custom.../x" }, { version: "latest" }, { name: "" }, { trust: "managed" }]) expect(normalizeModule(community(patch))).toBeNull();
    const m = normalizeModule(community({ icon: "javascript:alert(1)", color: "red;background:url(x)", sha256: "zz" }))!;
    expect([m.icon, m.color, m.sha256]).toEqual(["Boxes", "#2563EB", null]);
  });

  it("treats markup as data: it is returned verbatim as text to be rendered with textContent/escaping", () => {
    const payload = '<img src=x onerror="alert(1)"><script>alert(2)</script>';
    const m = normalizeModule(community({ name: payload, description: payload, changelog: payload }))!;
    expect([m.name, m.description, m.changelog]).toEqual([payload, payload, payload]);
  });

  it("only listed, available releases are indexable", () => {
    expect(normalizeModule(community())?.indexable).toBe(true);
    expect(normalizeModule(community({ listed: false }))?.indexable).toBe(false);
    expect(normalizeModule(community({ availability: "withdrawn" }))?.indexable).toBe(false);
    expect(normalizeModule(community({ trustLevel: "revoked", availability: "revoked" }))?.indexable).toBe(false);
  });
});

const page = (modules: unknown[], total: number) => ({ ok: true, status: 200, json: async () => ({ schemaVersion: 1, total, modules, catalogs: { official: { sequence: 4 }, community: { sequence: 9 } } }) });

describe("fetchDirectory", () => {
  it("reads every page, drops invalid/unlisted/revoked entries and reports snapshot sequences", async () => {
    const calls: string[] = [];
    const first = [official(), community(), community({ key: "custom.oculto", listed: false })];
    const second = [community({ key: "custom.revocado", trustLevel: "revoked", availability: "revoked" }), { key: "custom.roto" }];
    const result = await fetchDirectory({ hubUrl: "https://devs.runly.mx", fetchImpl: async (url) => { calls.push(url); return url.includes("offset=0") ? page(first, 5) : page(second, 5); } });
    expect(result.status).toBe("ok");
    expect(result.modules.map((m) => m.key)).toEqual(["custom.facturas", "custom.notas"]);
    expect(calls).toEqual(["https://devs.runly.mx/api/v1/marketplace/directory?limit=100&offset=0", "https://devs.runly.mx/api/v1/marketplace/directory?limit=100&offset=3"]);
    if (result.status === "ok") expect(result.snapshots).toEqual({ official: 4, community: 9 });
  });

  it("never invents data when the Hub fails, times out or answers an unexpected schema", async () => {
    expect((await fetchDirectory({ fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({}) }) }))).toMatchObject({ status: "unavailable", reason: "http_503", modules: [] });
    expect((await fetchDirectory({ fetchImpl: async () => { throw new TypeError("Failed to fetch"); } }))).toMatchObject({ status: "unavailable", reason: "network" });
    expect((await fetchDirectory({ fetchImpl: async () => ({ ok: true, status: 200, json: async () => [official()] }) }))).toMatchObject({ status: "unavailable", reason: "schema" });
    const slow = (_url: string, init?: { signal?: AbortSignal }) => new Promise<never>((_, reject) => init?.signal?.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" }))));
    expect((await fetchDirectory({ fetchImpl: slow, timeoutMs: 10 }))).toMatchObject({ status: "unavailable", reason: "timeout" });
  });
});

describe("fetchModule and helpers", () => {
  it("resolves unlisted modules by key, reports revoked history, rejects invalid keys without a request", async () => {
    let requested = 0;
    const fetchImpl = async (url: string) => { requested++; return url.endsWith("custom.notas") ? { ok: true, status: 200, json: async () => ({ current: community({ listed: false }) }) } : url.endsWith("custom.revocado") ? { ok: true, status: 200, json: async () => ({ current: null, versions: [community({ key: "custom.revocado", trustLevel: "revoked", availability: "revoked" })] }) } : { ok: false, status: 404, json: async () => ({}) }; };
    const unlisted = await fetchModule("custom.notas", { fetchImpl });
    expect(unlisted.status === "ok" && [unlisted.module.listed, unlisted.module.indexable]).toEqual([false, false]);
    const revoked = await fetchModule("custom.revocado", { fetchImpl });
    expect(revoked.status === "ok" && revoked.module.availability).toBe("revoked");
    expect((await fetchModule("custom.nada", { fetchImpl })).status).toBe("not_found");
    const before = requested;
    expect((await fetchModule("../../etc/passwd", { fetchImpl })).status).toBe("not_found");
    expect(requested).toBe(before);
  });

  it("only HTTPS hubs (or loopback for development) are used", () => {
    expect(hubBaseUrl("https://devs.runly.mx/whatever")).toBe("https://devs.runly.mx");
    expect(hubBaseUrl("http://localhost:4050")).toBe("http://localhost:4050");
    for (const bad of ["http://evil.example", "javascript:alert(1)", "https://user:pass@devs.runly.mx", "", undefined]) expect(hubBaseUrl(bad)).toBe("https://devs.runly.mx");
  });

  it("filters by structured trust, capability and text", () => {
    const modules = [normalizeModule(official())!, normalizeModule(community())!, normalizeModule(community({ key: "custom.verificado", trustLevel: "community-verified", publisher: { handle: "beta-labs", displayName: "Beta", verified: true }, capabilities: ["files.write"] }))!];
    expect(filterModules(modules, { trust: "official" }).map((m) => m.key)).toEqual(["custom.facturas"]);
    expect(filterModules(modules, { trust: "community-verified" }).map((m) => m.key)).toEqual(["custom.verificado"]);
    expect(filterModules(modules, { trust: "community" }).map((m) => m.key)).toEqual(["custom.notas", "custom.verificado"]);
    expect(filterModules(modules, { capability: "files.write" }).map((m) => m.key)).toEqual(["custom.verificado"]);
    expect(filterModules(modules, { query: "runly" }).map((m) => m.key)).toEqual(["custom.facturas"]);
    expect(capabilityFacets(modules)).toEqual(["files.write", "records.read"]);
    expect(MARKETPLACE_TEXT.es.trust["community-verified"]).not.toMatch(/oficial/i);
    expect(MARKETPLACE_TEXT.en.trust["community-verified"]).not.toMatch(/official/i);
  });
});
