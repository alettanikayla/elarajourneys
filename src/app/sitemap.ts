import type { MetadataRoute } from "next";
import { destinations } from "@/content/destinations";
import { packages } from "@/content/packages";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/packages",
    "/destinations",
    "/custom-trip",
    "/photography",
    "/faq",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    ...packages.map((p) => `/packages/${p.slug}`),
    ...destinations.map((d) => `/destinations/${d.slug}`),
  ];
  return paths.map((path) => ({
    url: `${siteUrl}/en${path}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])) },
  }));
}
