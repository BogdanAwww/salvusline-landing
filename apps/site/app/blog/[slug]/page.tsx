import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { getBreederData } from "@/lib/breeder";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const data = await getBreederData();
  if (!data) return [];
  return data.blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBreederData();
  const post = data?.blogPosts.find((p) => p.slug === slug);
  return buildMetadata(data?.breeder?.site_config ?? null, {
    pageTitle: post?.title ?? "Blog Post",
    pageDescription: post?.excerpt ?? undefined,
    path: `/blog/${slug}`,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getBreederData();
  const siteConfig = data?.breeder?.site_config ?? null;
  const post = data?.blogPosts.find((p) => p.slug === slug);

  if (!post) return notFound();

  return (
    <>
      <Header siteConfig={siteConfig} />

      <main className="page-main">
        {post.cover_image_url ? (
          <div className="blog-hero" style={{ backgroundImage: `url(${post.cover_image_url})` }}>
            <div className="blog-hero-overlay" />
            <div className="blog-hero-content">
              <a href="/blog" className="page-back page-back--light">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Blog
              </a>
              <time className="blog-article-date blog-article-date--hero">{formatDate(post.created_at)}</time>
              <h1 className="blog-article-title">{post.title}</h1>
              {post.excerpt && (
                <p className="blog-article-excerpt blog-article-excerpt--hero">{post.excerpt}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="blog-article-header-plain">
            <a href="/blog" className="page-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Blog
            </a>
            <time className="blog-article-date">{formatDate(post.created_at)}</time>
            <h1 className="blog-article-title">{post.title}</h1>
            {post.excerpt && (
              <p className="blog-article-excerpt">{post.excerpt}</p>
            )}
          </div>
        )}

        <article className="blog-article">
          {post.content && (
            <div
              className="blog-article-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </article>
      </main>
    </>
  );
}
