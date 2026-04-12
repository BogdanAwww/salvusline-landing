import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_DOMAIN = process.env.SITE_DOMAIN ?? "salvusline.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${SITE_DOMAIN}`;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                       lastModified: now, changeFrequency: "weekly",  priority: 1   },
    { url: `${base}/our-dogs`,         lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/puppies`,          lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/hall-of-fame`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  return staticRoutes;
}
