export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Bilingual text field used across content data. */
export type L10n = { en: string; id: string };

export function t(value: L10n, lang: Locale): string {
  return value[lang];
}
