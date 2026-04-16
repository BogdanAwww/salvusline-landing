import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ImageUploader from "../components/ImageUploader";
import RichTextEditor from "../components/RichTextEditor";
import useIsMobile from "../hooks/useIsMobile";

const INPUT_STYLE: React.CSSProperties = { width: "100%", padding: "0.75rem", background: "#111", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: "0.9rem" };
const LABEL_STYLE: React.CSSProperties = { display: "block", color: "#aaa", fontSize: "0.8rem", marginBottom: "0.4rem" };

export default function BlogFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const isMobile = useIsMobile();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("blog_posts").select("*").eq("id", id).single().then(({ data }) => {
      if (!data) return;
      const d = data as Record<string, unknown>;
      setTitle(String(d.title ?? ""));
      setSlug(String(d.slug ?? ""));
      setExcerpt(String(d.excerpt ?? ""));
      setContent(String(d.content ?? ""));
      setCoverImageUrl(String(d.cover_image_url ?? ""));
      setPublished(Boolean(d.published));
      setSlugManual(true);
      setLoading(false);
    });
  }, [id]);

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManual) {
      setSlug(generateSlug(val));
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required."); return; }
    if (!slug.trim()) { setError("Slug is required."); return; }
    setSaving(true);
    setError(null);

    const { data: breeder } = await supabase.from("breeders").select("id").single();
    if (!breeder) { setError("Could not find your breeder profile."); setSaving(false); return; }
    const breederId = (breeder as { id: string }).id;

    // Check for slug duplicates (exclude current post when editing)
    const slugQuery = supabase
      .from("blog_posts")
      .select("id")
      .eq("breeder_id", breederId)
      .eq("slug", slug.trim());
    if (id) slugQuery.neq("id", id);
    const { data: existing } = await slugQuery;
    if (existing && existing.length > 0) {
      setError(`A blog post with the slug "${slug.trim()}" already exists. Please choose a different slug.`);
      setSaving(false);
      return;
    }

    const payload = {
      breeder_id: breederId,
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt || null,
      content: content || null,
      cover_image_url: coverImageUrl || null,
      published,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error: err } = await supabase.from("blog_posts").update(payload).eq("id", id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from("blog_posts").insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }
    navigate("/blog");
  }

  if (loading) return <p style={{ color: "#666" }}>Loading...</p>;

  return (
    <div>
      <h1 style={{ fontSize: isMobile ? "1.25rem" : "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        {isEdit ? `Edit Post — ${title}` : "New Blog Post"}
      </h1>
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: "1rem" }}>
          <div>
            <label style={LABEL_STYLE}>Title *</label>
            <input value={title} onChange={(e) => handleTitleChange(e.target.value)} required style={INPUT_STYLE} placeholder="My Blog Post" />
          </div>
          <div>
            <label style={LABEL_STYLE}>Slug *</label>
            <input
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              required
              style={INPUT_STYLE}
              placeholder="my-blog-post"
            />
          </div>
        </div>

        <div>
          <label style={LABEL_STYLE}>Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            style={{ ...INPUT_STYLE, resize: "vertical" }}
            placeholder="A short summary shown on the blog listing..."
          />
        </div>

        <ImageUploader label="Cover Image" value={coverImageUrl} onChange={setCoverImageUrl} folder="blog" />

        <div>
          <label style={LABEL_STYLE}>Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "#aaa", fontSize: "0.9rem" }}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "#EC6B15" }}
            />
            Published
          </label>
          <span style={{ fontSize: "0.75rem", color: "#555" }}>
            {published ? "Visible on the public site" : "Saved as draft — not visible on the public site"}
          </span>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: "0.85rem" }}>{error}</p>}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={saving} style={{ padding: "0.75rem 1.5rem", background: "#EC6B15", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Post"}
          </button>
          <button type="button" onClick={() => navigate("/blog")} style={{ padding: "0.75rem 1.5rem", background: "#2a2a2a", color: "#aaa", border: "none", borderRadius: 8, fontWeight: 500, fontSize: "0.9rem", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
