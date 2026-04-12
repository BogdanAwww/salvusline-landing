import type { Metadata } from "next";
import type { SiteConfig } from "@salvus/db";

const SITE_DOMAIN = process.env.SITE_DOMAIN ?? "salvusline.com";

export function buildMetadata(
  siteConfig: SiteConfig | null,
  options: {
    pageTitle?: string;
    pageDescription?: string;
    path?: string;
  } = {}
): Metadata {
  const siteName = siteConfig?.title ?? "SALVUSLINE";
  const title = options.pageTitle ? `${options.pageTitle} — ${siteName}` : siteName;
  const description =
    options.pageDescription ??
    siteConfig?.seo_description ??
    "Bull Terrier and Miniature Bull Terrier breeders";
  const url = `https://${SITE_DOMAIN}${options.path ?? ""}`;
  const ogImage = siteConfig?.og_image_url;

  return {
    title,
    description,
    keywords: siteConfig?.seo_keywords ?? undefined,
    metadataBase: new URL(`https://${SITE_DOMAIN}`),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }] } : {}),
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: { index: true, follow: true },
    icons: {
      icon: [
        { url: "/assets/logo.svg", type: "image/svg+xml" },
        { url: "/favicon.ico" },
      ],
      apple: "/assets/logo.svg",
    },
  };
}
