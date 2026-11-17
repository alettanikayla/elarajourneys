import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000";

/** Localized metadata with hreflang alternates. `path` is the part after `/[lang]`, e.g. "/packages". */
export function pageMeta(lang: Locale, path: string, title: string, description: string, image?: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { en: `/en${path}`, id: `/id${path}`, "x-default": `/en${path}` },
    },
    openGraph: {
      title,
      description,
      locale: lang === "id" ? "id_ID" : "en_US",
      type: "website",
      siteName: "Elara Journeys",
      images: image ? [{ url: image }] : undefined,
    },
  };
}
