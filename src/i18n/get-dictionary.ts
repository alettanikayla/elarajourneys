import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  id: () => import("./dictionaries/id").then((m) => m.default),
};

export function getDictionary(lang: Locale): Promise<Dictionary> {
  return dictionaries[lang]();
}

export type { Dictionary };
