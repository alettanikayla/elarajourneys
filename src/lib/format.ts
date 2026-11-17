import type { Locale } from "@/i18n/config";

export function formatIDR(amount: number, lang: Locale): string {
  return new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Formats an ISO date (yyyy-mm-dd) without timezone shifts. */
export function formatDate(iso: string, lang: Locale, opts: Intl.DateTimeFormatOptions = {}): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
    ...opts,
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

export const tzAbbr = { "Asia/Jakarta": "WIB", "Asia/Makassar": "WITA" } as const;
export type TripTimezone = keyof typeof tzAbbr;
export const tzOffsetHours: Record<TripTimezone, number> = { "Asia/Jakarta": 7, "Asia/Makassar": 8 };
