import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/login",
        "/crm",
        "/crm/",
        "/dashboard",
        "/partners",
        "/partners/",
        "/api/crm",
        "/api/partners",
      ],
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE.replace("https://", ""),
  };
}
