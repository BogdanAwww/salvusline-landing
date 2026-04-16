import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ImageUploader from "../components/ImageUploader";
import useIsMobile from "../hooks/useIsMobile";

const INPUT_STYLE: React.CSSProperties = { width: "100%", padding: "0.75rem", background: "#111", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: "0.9rem" };
const LABEL_STYLE: React.CSSProperties = { display: "block", color: "#aaa", fontSize: "0.8rem", marginBottom: "0.4rem" };

type GalleryImage = { id: string; url: string; sort_order: number };

export default function PuppyFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const isMobile = useIsMobile();

  const [photoUrl, setPhotoUrl] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [birthDate, setBirthDate] = useState("");
  const [sire, setSire] = useState("");
  const [dam, setDam] = useState("");
  const [status, setStatus] = useState<"available" | "reserved" | "sold">("available");
  const [sortOrder, setSortOrder] = useState("0");
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    supabase.from("puppies").select("*, puppy_images(*)").eq("id", id).single().then(({ data }) => {
      if (!data) return;
      const d = data as Record<string, unknown>;
      setPhotoUrl(String(d.photo_url ?? ""));
      setGender((d.gender as "male" | "female" | "") ?? "");
      setBirthDate(String(d.birth_date ?? ""));
      setSire(String(d.sire ?? ""));
      setDam(String(d.dam ?? ""));
      setStatus((d.status as "available" | "reserved" | "sold") ?? "available");
      setSortOrder(String(d.sort_order ?? "0"));
      setGallery((d.puppy_images as GalleryImage[]) ?? []);
      setLoading(false);
    });
  }, [id]);

  async function loadGallery() {
    if (!id) return;
    const { data } = await supabase.from("puppy_images").select("*").eq("puppy_id", id).order("sort_order");
    setGallery((data as GalleryImage[]) ?? []);
  }

  async function handleAddGalleryImage(url: string) {
    if (!id || !url) return;
    await supabase.from("puppy_images").insert({ puppy_id: id, url, sort_order: gallery.length });
    loadGallery();
  }

  async function handleDeleteGalleryImage(imageId: string) {
    if (!confirm("Remove this photo?")) return;
    await supabase.from("puppy_images").delete().eq("id", imageId);
    loadGallery();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!gender) { setError("Gender is required."); return; }
    if (!photoUrl) { setError("Photo is required."); return; }
    setSaving(true);
    setError(null);

    const { data: breeder } = await supabase.from("breeders").select("id").single();
    if (!breeder) { setError("Could not find your breeder profile."); setSaving(false); return; }

    const payload = {
      breeder_id: (breeder as { id: string }).id,
      photo_url: photoUrl,
      gender,
      birth_date: birthDate || null,
      sire: sire || null,
      dam: dam || null,
      status,
      sort_order: parseInt(sortOrder, 10) || 0,
    };

    if (id) {
      const { error: err } = await supabase.from("puppies").update(payload).eq("id", id);
      if (err) { setError(err.message); setSaving(false); return; }
      navigate("/puppies");
    } else {
      const { data: newPuppy, error: err } = await supabase.from("puppies").insert(payload).select("id").single();
      if (err) { setError(err.message); setSaving(false); return; }
      navigate(`/puppies/${(newPuppy as { id: string }).id}`);
    }
  }

  if (loading) return <p style={{ color: "#666" }}>Loading...</p>;

  const gridCols2 = isMobile ? "1fr" : "1fr 1fr";

  return (
    <div>
      <h1 style={{ fontSize: isMobile ? "1.25rem" : "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        {isEdit ? "Edit Puppy" : "Add Puppy"}
      </h1>
      <form onSubmit={handleSave} style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        <ImageUploader label="Cover Photo *" value={photoUrl} onChange={setPhotoUrl} folder="puppies" />

        <div style={{ display: "grid", gridTemplateColumns: gridCols2, gap: "1rem" }}>
          <div>
            <label style={LABEL_STYLE}>Gender *</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as "male" | "female" | "")} required style={INPUT_STYLE}>
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label style={LABEL_STYLE}>Birth Date</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={INPUT_STYLE} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: gridCols2, gap: "1rem" }}>
          <div>
            <label style={LABEL_STYLE}>Sire (Father)</label>
            <input value={sire} onChange={(e) => setSire(e.target.value)} placeholder="e.g. CH Salvusline's King" style={INPUT_STYLE} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Dam (Mother)</label>
            <input value={dam} onChange={(e) => setDam(e.target.value)} placeholder="e.g. Salvusline's Queen" style={INPUT_STYLE} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: gridCols2, gap: "1rem" }}>
          <div>
            <label style={LABEL_STYLE}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "available" | "reserved" | "sold")} style={INPUT_STYLE}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div>
            <label style={LABEL_STYLE}>Sort Order</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} min={0} style={{ ...INPUT_STYLE, width: "100%" }} />
          </div>
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

            <ImageUploader label="Add Photo" value="" onChange={handleAddGalleryImage} folder="puppies" />
          </div>
        )}

        {error && <p style={{ color: "#f87171", fontSize: "0.85rem" }}>{error}</p>}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={saving} style={{ padding: "0.75rem 1.5rem", background: "#EC6B15", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Puppy"}
          </button>
          <button type="button" onClick={() => navigate("/puppies")} style={{ padding: "0.75rem 1.5rem", background: "#2a2a2a", color: "#aaa", border: "none", borderRadius: 8, fontWeight: 500, fontSize: "0.9rem", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
