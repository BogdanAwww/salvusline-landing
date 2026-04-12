import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { getBreederData } from "@/lib/breeder";
import { buildMetadata } from "@/lib/seo";
import { HofSection } from "@/components/HofSection";
import type { HofEntryWithImages } from "@salvus/db";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBreederData();
  return buildMetadata(data?.breeder?.site_config ?? null, {
    pageTitle: "Hall of Fame",
    pageDescription: "A tribute to the exceptional Bull Terriers and Miniature Bull Terriers that have carried our kennel name to the highest levels of competition.",
    path: "/hall-of-fame",
  });
}

const FALLBACK_ENTRIES: HofEntryWithImages[] = [
  { id: "1", breeder_id: "", dog_name: "Salvusline Absolute Legend", title: "Bull Terrier Champion", year: 2023, image_url: "/assets/dog-carousel-1.webp", description: null, sort_order: 0, hof_images: [] },
  { id: "2", breeder_id: "", dog_name: "Salvusline Northern Star", title: "Miniature Bull Terrier Champion", year: 2022, image_url: "/assets/dog-carousel-2.webp", description: null, sort_order: 1, hof_images: [] },
  { id: "3", breeder_id: "", dog_name: "Salvus Brothers Iron Duke", title: "Vice World Winner", year: 2021, image_url: "/assets/dog-carousel-3.webp", description: null, sort_order: 2, hof_images: [] },
  { id: "4", breeder_id: "", dog_name: "Venturesome Queen of Hearts", title: "International Champion", year: 2020, image_url: "/assets/dog-carousel-4.webp", description: null, sort_order: 3, hof_images: [] },
];

export default async function HallOfFamePage() {
  const data = await getBreederData();
  const siteConfig = data?.breeder?.site_config ?? null;
  const entries = (data?.hallOfFame ?? []) as HofEntryWithImages[];
  const displayEntries = entries.length ? entries : FALLBACK_ENTRIES;

  return (
    <>
      <Header siteConfig={siteConfig} />

      <main className="page-main">
        <div className="page-hero">
          <p className="page-hero-label">SALVUSLINE &amp; SALVUS BROTHERS</p>
          <h1 className="page-hero-title">HALL OF FAME</h1>
          <p className="page-hero-desc">A tribute to the exceptional Bull Terriers and Miniature Bull Terriers that have carried our kennel name to the highest levels of competition around the world.</p>
        </div>

        <div className="hof-section">
          <a href="/" className="page-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </a>

          <div className="hof-list">
            {displayEntries.map((entry, i) => (
              <HofSection key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
