import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { getBreederData } from "@/lib/breeder";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBreederData();
  return buildMetadata(data?.breeder?.site_config ?? null, {
    pageTitle: "Hall of Fame",
    pageDescription: "A tribute to the exceptional Bull Terriers and Miniature Bull Terriers that have carried our kennel name to the highest levels of competition.",
    path: "/hall-of-fame",
  });
}

const FALLBACK_ENTRIES = [
  { id: "1", dog_name: "Salvusline Absolute Legend", title: "Bull Terrier", image_url: "/assets/dog-carousel-1.webp" },
  { id: "2", dog_name: "Salvusline Northern Star", title: "Miniature Bull Terrier", image_url: "/assets/dog-carousel-2.webp" },
  { id: "3", dog_name: "Salvus Brothers Iron Duke", title: "Bull Terrier", image_url: "/assets/dog-carousel-3.webp" },
  { id: "4", dog_name: "Venturesome Queen of Hearts", title: "Bull Terrier", image_url: "/assets/dog-carousel-4.webp" },
  { id: "5", dog_name: "Salvusline Pure Prestige", title: "Miniature Bull Terrier", image_url: "/assets/dog-carousel-5.webp" },
  { id: "6", dog_name: "Salvus Brothers King's Road", title: "Bull Terrier", image_url: "/assets/dog-carousel-6.webp" },
];

export default async function HallOfFamePage() {
  const data = await getBreederData();
  const siteConfig = data?.breeder?.site_config ?? null;
  const entries = data?.hallOfFame;
  const displayEntries = entries?.length ? entries : FALLBACK_ENTRIES;

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

          <div className="hof-grid">
            {displayEntries.map((entry) => (
              <div key={entry.id} className="hof-card">
                <div className="hof-card-image">
                  <img src={entry.image_url ?? ""} alt={entry.dog_name} loading="lazy" />
                </div>
                <div className="hof-card-body">
                  {entry.title && <div className="hof-card-breed">{entry.title}</div>}
                  <div className="hof-card-name">{entry.dog_name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
