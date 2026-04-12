import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { getBreederData } from "@/lib/breeder";
import { buildMetadata } from "@/lib/seo";
import { DogSection } from "@/components/DogSection";
import type { DogWithImages } from "@salvus/db";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBreederData();
  return buildMetadata(data?.breeder?.site_config ?? null, {
    pageTitle: "Our Dogs",
    pageDescription: "Bull Terriers and Miniature Bull Terriers bred with dedication to health, correct type, and sound temperament.",
    path: "/our-dogs",
  });
}

const FALLBACK_DOGS: DogWithImages[] = Array.from({ length: 13 }, (_, i) => ({
  id: String(i),
  breeder_id: "",
  slug: `dog-${i}`,
  name: "Bull Terrier",
  full_name: null,
  breed: "Bull Terrier",
  gender: null,
  birth_date: null,
  description: null,
  cover_image_url: `/assets/dog-carousel-${i + 1}.webp`,
  status: "active" as const,
  sort_order: i,
  created_at: "",
  dog_images: [],
}));

export default async function OurDogsPage() {
  const data = await getBreederData();
  const siteConfig = data?.breeder?.site_config ?? null;
  const dogs = (data?.dogs ?? []) as DogWithImages[];
  const displayDogs = dogs.length ? dogs : FALLBACK_DOGS;

  return (
    <>
      <Header siteConfig={siteConfig} />

      <main className="page-main">
        <div className="page-hero">
          <p className="page-hero-label">SALVUSLINE KENNEL</p>
          <h1 className="page-hero-title">OUR DOGS</h1>
          <p className="page-hero-desc">Bull Terriers and Miniature Bull Terriers bred with dedication to health, correct type, and sound temperament.</p>
        </div>

        <div className="dogs-page-section">
          <a href="/" className="page-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </a>

          <div className="dogs-list">
            {displayDogs.map((dog, i) => (
              <DogSection key={dog.id} dog={dog} index={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
