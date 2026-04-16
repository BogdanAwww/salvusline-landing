import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ImageUploader from "../components/ImageUploader";
import useIsMobile from "../hooks/useIsMobile";

const INPUT_STYLE: React.CSSProperties = { width: "100%", padding: "0.75rem", background: "#111", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: "0.9rem" };
const LABEL_STYLE: React.CSSProperties = { display: "block", color: "#aaa", fontSize: "0.8rem", marginBottom: "0.4rem" };

type GalleryImage = { id: string; url: string; sort_order: number };

export default function HofFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const isMobile = useIsMobile();

  const [dogName, setDogName] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    supabase.from("hall_of_fame").select("*, hof_images(*)").eq("id", id).single().then(({ data }) => {
      if (!data) return;
      const d = data as Record<string, unknown>;
      setDogName(String(d.dog_name ?? ""));
      setTitle(String(d.title ?? ""));
      setYear(d.year != null ? String(d.year) : "");
      setDescription(String(d.description ?? ""));
      setImageUrl(String(d.image_url ?? ""));
      setSortOrder(String(d.sort_order ?? "0"));
      setGallery((d.hof_images as GalleryImage[]) ?? []);
      setLoading(false);
    });
  }, [id]);

  async function loadGallery() {
    if (!id) return;
    const { data } = await supabase.from("hof_images").select("*").eq("hof_id", id).order("sort_order");
    setGallery((data as GalleryImage[]) ?? []);
  }

  async function handleAddGalleryImage(url: string) {
    if (!id || !url) return;
    await supabase.from("hof_images").insert({ hof_id: id, url, sort_order: gallery.length });
    loadGallery();
  }

  async function handleDeleteGalleryImage(imageId: string) {
    if (!confirm("Remove this photo?")) return;
    await supabase.from("hof_images").delete().eq("id", imageId);
    loadGallery();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { data: breeder } = await supabase.from("breeders").select("id").single();
    if (!breeder) { setError("Could not find your breeder profile."); setSaving(false); return; }

    const payload = {
      breeder_id: (breeder as { id: string }).id,
      dog_name: dogName,
      title: title || null,
      year: year ? parseInt(year, 10) : null,
      description: description || null,
      image_url: imageUrl || null,
      sort_order: parseInt(sortOrder, 10) || 0,
    };

    if (id) {
      const { error: err } = await supabase.from("hall_of_fame").update(payload).eq("id", id);
      if (err) { setError(err.message); setSaving(false); return; }
      navigate("/hall-of-fame");
    } else {
      const { data: newEntry, error: err } = await supabase.from("hall_of_fame").insert(payload).select("id").single();
      if (err) { setError(err.message); setSaving(false); return; }
      navigate(`/hall-of-fame/${(newEntry as { id: string }).id}`);
    }
  }

  if (loading) return <p style={{ color: "#666" }}>Loading...</p>;

  const gridCols3 = isMobile ? "1fr" : "1fr 1fr 1fr";

  return (
    <div>
      <h1 style={{ fontSize: isMobile ? "1.25rem" : "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        {isEdit ? `Edit: ${dogName}` : "Add Hall of Fame Entry"}
      </h1>
      <form onSubmit={handleSave} style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <label style={LABEL_STYLE}>Dog Name *</label>
          <input value={dogName} onChange={(e) => setDogName(e.target.value)} required style={INPUT_STYLE} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: gridCols3, gap: "1rem" }}>
          <div style={isMobile ? undefined : { gridColumn: "span 2" }}>
            <label style={LABEL_STYLE}>Title / Achievement</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Champion 2x BOB" style={INPUT_STYLE} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Year</label>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" min={1900} max={2100} style={INPUT_STYLE} />
          </div>
        </div>

        <ImageUploader label="Cover Photo" value={imageUrl} onChange={setImageUrl} folder="hall-of-fame" />

        <div>
          <label style={LABEL_STYLE}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={{ ...INPUT_STYLE, resize: "vertical" }} />
        </div>

        <div>
          <label style={LABEL_STYLE}>Sort Order</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} min={0} style={{ ...INPUT_STYLE, width: isMobile ? "100%" : 120 }} />
        </div>

        {isEdit && (
          <div style={{ paddingTop: "0.5rem", borderTop: "1px solid #2a2a2a" }}>
            <label style={{ ...LABEL_STYLE, fontSize: "0.9rem", marginBottom: "1rem" }}>Gallery Photos</label>

            {gallery.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "80px" : "100px"}, 1fr))`, gap: "0.5rem", marginBottom: "1rem" }}>
                {gallery.map((img) => (
                  <div key={img.id} style={{ position: "relative", aspectRatio: "1" }}>
                    <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, display: "block" }} />
                    <button
                      onClick={() => handleDeleteGalleryImage(img.id)}
                      style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.7)", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                    >x</button>
                  </div>
                ))}
              </div>
            )}

            <ImageUploader label="Add Photo" value="" onChange={handleAddGalleryImage} folder="hall-of-fame" />
          </div>
        )}

        {error && <p style={{ color: "#f87171", fontSize: "0.85rem" }}>{error}</p>}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={saving} style={{ padding: "0.75rem 1.5rem", background: "#EC6B15", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Entry"}
          </button>
          <button type="button" onClick={() => navigate("/hall-of-fame")} style={{ padding: "0.75rem 1.5rem", background: "#2a2a2a", color: "#aaa", border: "none", borderRadius: 8, fontWeight: 500, fontSize: "0.9rem", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
