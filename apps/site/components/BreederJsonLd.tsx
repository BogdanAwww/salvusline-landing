import type { SiteConfig } from "@salvus/db";

interface Props {
  siteConfig: SiteConfig | null;
  domain: string;
}

export function BreederJsonLd({ siteConfig, domain }: Props) {
  if (!siteConfig) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    name: siteConfig.title,
    description: siteConfig.seo_description,
    url: `https://${domain}`,
    ...(siteConfig.logo_url ? {
      logo: { "@type": "ImageObject", url: siteConfig.logo_url },
      image: siteConfig.og_image_url ?? siteConfig.logo_url,
    } : {}),
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
