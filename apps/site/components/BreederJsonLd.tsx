import type { SiteConfig } from "@salvus/db";

interface Props {
  siteConfig: SiteConfig | null;
  domain: string;
}

export function BreederJsonLd({ siteConfig, domain }: Props) {
  if (!siteConfig) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.title,
    description: siteConfig.seo_description,
    url: `https://${domain}`,
    logo: siteConfig.logo_url,
    sameAs: [
      siteConfig.instagram_url,
      siteConfig.tiktok_url,
      siteConfig.facebook_url,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
