import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { getBreederData } from "@/lib/breeder";
import { buildMetadata } from "@/lib/seo";
import type { BlogPost } from "@salvus/db";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBreederData();
  return buildMetadata(data?.breeder?.site_config ?? null, {
    pageTitle: "Blog",
    pageDescription: "News, stories, and updates from our kennel.",
    path: "/blog",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const data = await getBreederData();
  const siteConfig = data?.breeder?.site_config ?? null;
  const posts = (data?.blogPosts ?? []) as BlogPost[];

  return (
    <>
      <Header siteConfig={siteConfig} />

      <main className="page-main">
        <div className="page-hero">
          <p className="page-hero-label">SALVUSLINE &amp; SALVUS BROTHERS</p>
          <h1 className="page-hero-title">BLOG</h1>
          <p className="page-hero-desc">News, stories, and updates from our kennel.</p>
        </div>

        <div className="blog-section">
          <a href="/" className="page-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </a>

          {posts.length > 0 ? (
            <div className="blog-grid">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
                  {post.cover_image_url && (
                    <div className="blog-card-image">
                      <img src={post.cover_image_url} alt={post.title} />
                    </div>
                  )}
                  <div className="blog-card-body">
                    <time className="blog-card-date">{formatDate(post.created_at)}</time>
                    <h2 className="blog-card-title">{post.title}</h2>
                    {post.excerpt && (
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                    )}
                    <span className="blog-card-read">Read more</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="blog-empty">
              <p>No posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
