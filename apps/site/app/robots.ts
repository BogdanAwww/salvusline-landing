import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_DOMAIN = process.env.SITE_DOMAIN ?? "salvusline.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${SITE_DOMAIN}/sitemap.xml`,
  };
}
