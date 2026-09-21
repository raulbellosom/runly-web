// src/i18n/__tests__/dictionary.test.ts
import { describe, expect, it } from "vitest";
import { es } from "../es";
import { en } from "../en";

function collectKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj).flatMap(([key, value]) =>
    collectKeys(value, prefix ? `${prefix}.${key}` : key),
  );
}

describe("i18n dictionaries", () => {
  it("es and en expose exactly the same keys", () => {
    const esKeys = collectKeys(es).sort();
    const enKeys = collectKeys(en).sort();
    expect(enKeys).toEqual(esKeys);
  });
});
