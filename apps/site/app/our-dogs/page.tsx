import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { getBreederData } from "@/lib/breeder";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBreederData();
  return buildMetadata(data?.breeder?.site_config ?? null, {
    pageTitle: "Our Dogs",
    pageDescription: "Bull Terriers and Miniature Bull Terriers bred with dedication to health, correct type, and sound temperament.",
    path: "/our-dogs",
  });
}

const FALLBACK_DOGS = Array.from({ length: 13 }, (_, i) => ({
  id: String(i),
  src: `/assets/dog-carousel-${i + 1}.webp`,
  name: "Bull Terrier",
}));

export default async function OurDogsPage() {
  const data = await getBreederData();
  const siteConfig = data?.breeder?.site_config ?? null;
  const dogs = data?.dogs;
  const displayDogs = dogs?.length
    ? dogs.map((d) => ({ id: d.id, src: d.cover_image_url ?? "", name: d.name }))
    : FALLBACK_DOGS;

  return (
    <>
      <Header siteConfig={siteConfig} />

      <main className="page-main">
        <div className="page-hero">
          <p className="page-hero-label">SALVUSLINE KENNEL</p>
          <h1 className="page-hero-title">OUR DOGS</h1>
          <p className="page-hero-desc">Bull Terriers and Miniature Bull Terriers bred with dedication to health, correct type, and sound temperament.</p>
        </div>

        <div className="breed-info-section">
          <div className="breed-info-container">
            <div className="breed-info-heading">
              <p className="breed-info-eyebrow">About the Breed</p>
              <h2 className="breed-info-title">The Bull Terrier</h2>
            </div>
            <div className="breed-info-body">
              <p className="breed-info-lead">There is no dog quite like the Bull Terrier. Instantly recognisable by its distinctive egg-shaped head, powerful build, and triangular eyes full of mischief — it is a breed unlike any other.</p>
              <p>Developed in 19th-century England from crosses between the Bulldog and the now-extinct White English Terrier, the Bull Terrier was bred to be courageous, agile, and full of fire. Over generations, breeders refined that raw energy into a dog of extraordinary character — loyal to the bone, endlessly entertaining, and surprisingly gentle with those it loves.</p>
              <p>Bull Terriers bond deeply with their families. They thrive on companionship and close human contact, and they give it back tenfold. Playful well into old age, they bring an energy and personality to the home that is impossible to ignore. Their stubbornness is legendary — but so is their devotion.</p>
              <p>The Miniature Bull Terrier carries every bit of that same spirit in a smaller, more compact form. Same head, same heart, same relentless personality.</p>
              <p>At Salvusline, we breed both the Standard and the Miniature with the same intention: dogs that are sound in body, stable in mind, and correct in type. Dogs you can be proud of in the ring — and even prouder of at home.</p>
            </div>
          </div>
        </div>

        <div className="dogs-page-section">
          <a href="/" className="page-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </a>

          <div className="dogs-page-grid">
            {displayDogs.map((dog) => (
              <div key={dog.id} className="dog-page-card">
                <img src={dog.src} alt={dog.name} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
