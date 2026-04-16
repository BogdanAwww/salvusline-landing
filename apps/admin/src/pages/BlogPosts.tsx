import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SortableList from "../components/SortableList";
import useIsMobile from "../hooks/useIsMobile";

type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
};

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  async function load() {
    const { data: breeder } = await supabase.from("breeders").select("id").single();
    if (!breeder) return;
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image_url, published, created_at")
      .eq("breeder_id", (breeder as { id: string }).id)
      .order("sort_order");
    setPosts((data as BlogPostRow[]) ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    load();
  }

  async function handleReorder(reordered: BlogPostRow[]) {
    setPosts(reordered);
    const updates = reordered.map((p, i) => supabase.from("blog_posts").update({ sort_order: i }).eq("id", p.id));
    await Promise.all(updates);
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "0.75rem" }}>
        <div>
          <h1 style={{ fontSize: isMobile ? "1.25rem" : "1.5rem", fontWeight: 700 }}>Blog</h1>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>{posts.length} posts</p>
        </div>
        <Link to="/blog/new" style={{ padding: "0.65rem 1.25rem", background: "#EC6B15", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap", flexShrink: 0 }}>
          + New Post
        </Link>
      </div>

      {posts.length > 0 ? (
        <SortableList
          items={posts}
          onReorder={handleReorder}
          renderItem={(post) =>
            isMobile ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  {post.cover_image_url && (
                    <img src={post.cover_image_url} alt={post.title} style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</div>
                    <div style={{ color: "#666", fontSize: "0.7rem", marginTop: 1 }}>{formatDate(post.created_at)}</div>
                  </div>
                  <span style={{
                    fontSize: "0.7rem",
                    color: post.published ? "#4ade80" : "#facc15",
                    background: post.published ? "#4ade8022" : "#facc1522",
                    padding: "0.2rem 0.5rem",
                    borderRadius: 20,
                    flexShrink: 0,
                  }}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
                  <button onClick={() => navigate(`/blog/${post.id}`)} style={{ flex: 1, padding: "0.4rem", background: "#2a2a2a", color: "#ccc", border: "none", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(post.id, post.title)} style={{ padding: "0.4rem 0.65rem", background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {post.cover_image_url && (
                  <img src={post.cover_image_url} alt={post.title} style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{post.title}</div>
                  <div style={{ color: "#666", fontSize: "0.8rem", marginTop: 2 }}>
                    {formatDate(post.created_at)}
                    {post.excerpt && <> &middot; {post.excerpt.slice(0, 60)}{post.excerpt.length > 60 ? "..." : ""}</>}
                  </div>
                </div>
                <span style={{
                  fontSize: "0.75rem",
                  color: post.published ? "#4ade80" : "#facc15",
                  background: post.published ? "#4ade8022" : "#facc1522",
                  padding: "0.25rem 0.6rem",
                  borderRadius: 20,
                }}>
                  {post.published ? "Published" : "Draft"}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => navigate(`/blog/${post.id}`)} style={{ padding: "0.4rem 0.8rem", background: "#2a2a2a", color: "#ccc", border: "none", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(post.id, post.title)} style={{ padding: "0.4rem 0.8rem", background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            )
          }
        />
      ) : (
        <div style={{ textAlign: "center", padding: "3rem", color: "#444", background: "#1a1a1a", borderRadius: 10, border: "1px dashed #2a2a2a" }}>
          No blog posts yet. <Link to="/blog/new" style={{ color: "#EC6B15" }}>Write your first post</Link>
        </div>
      )}
    </div>
  );
}
