// src/i18n/index.ts
import { es } from "./es";
import { en } from "./en";
import type { SiteDictionary } from "./types";

export const dictionaries = { es, en } as const;
export type Locale = keyof typeof dictionaries;

export function getDictionary(locale: string): SiteDictionary {
  const key = (locale in dictionaries ? locale : "es") as Locale;
  return dictionaries[key];
}

export * from "./types";
