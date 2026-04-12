import type { Metadata } from "next";
import { getBreederData } from "@/lib/breeder";
import { buildMetadata } from "@/lib/seo";
import { BreederJsonLd } from "@/components/BreederJsonLd";
import "./globals.css";

const SITE_DOMAIN = process.env.SITE_DOMAIN ?? "salvusline.com";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBreederData();
  return buildMetadata(data?.breeder?.site_config ?? null);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getBreederData();
  const siteConfig = data?.breeder?.site_config ?? null;

  return (
    <html lang="en-GB">
      <head>
        <BreederJsonLd siteConfig={siteConfig} domain={SITE_DOMAIN} />
      </head>
      <body>{children}</body>
    </html>
  );
}
