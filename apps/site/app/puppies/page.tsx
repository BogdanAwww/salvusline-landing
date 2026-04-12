import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { getBreederData } from "@/lib/breeder";
import { buildMetadata } from "@/lib/seo";
import { PuppySection } from "@/components/PuppySection";
import { PuppiesContactForm } from "@/components/PuppiesContactForm";
import type { PuppyWithImages } from "@salvus/db";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBreederData();
  return buildMetadata(data?.breeder?.site_config ?? null, {
    pageTitle: "Available Puppies",
    pageDescription: "Bull Terrier and Miniature Bull Terrier puppies currently available from Salvusline Kennel.",
    path: "/puppies",
  });
}

export default async function PuppiesPage() {
  const data = await getBreederData();
  const siteConfig = data?.breeder?.site_config ?? null;
  const puppies = (data?.puppies ?? []) as PuppyWithImages[];

  return (
    <>
      <Header siteConfig={siteConfig} />

      <main className="page-main">
        {puppies.length > 0 ? (
          <>
            <div className="page-hero">
              <p className="page-hero-label">SALVUSLINE KENNEL</p>
              <h1 className="page-hero-title">AVAILABLE PUPPIES</h1>
              <p className="page-hero-desc">Puppies bred with dedication to health, correct type, and sound temperament.</p>
            </div>

            <div className="puppies-page-section">
              <a href="/" className="page-back">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Home
              </a>

              <div className="puppies-list">
                {puppies.map((puppy, i) => (
                  <PuppySection key={puppy.id} puppy={puppy} index={i} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="puppies-empty">
            <div className="puppies-empty-overlay" />
            <div className="puppies-empty-content">
              <a href="/" className="page-back puppies-empty-back">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Home
              </a>
              <p className="puppies-empty-label">SALVUSLINE KENNEL</p>
              <h1 className="puppies-empty-title">
                NO PUPPIES
                <br />
                AVAILABLE
                <br />
                RIGHT NOW
              </h1>
              <p className="puppies-empty-desc">
                We don&apos;t have any available puppies at the moment, but a new litter may be planned.
                Leave your contact details and we&apos;ll reach out when puppies become available.
              </p>
              <PuppiesContactForm breederId={data?.breeder?.id} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
