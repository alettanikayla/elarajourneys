import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/en/booking", "/id/booking", "/en/my-trip", "/id/my-trip"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
