import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ImageUploader from "../components/ImageUploader";

const INPUT_STYLE: React.CSSProperties = { width: "100%", padding: "0.75rem", background: "#111", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: "0.9rem" };
const LABEL_STYLE: React.CSSProperties = { display: "block", color: "#aaa", fontSize: "0.8rem", marginBottom: "0.4rem" };

export default function DogFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [birthDate, setBirthDate] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [status, setStatus] = useState<"active" | "retired" | "sold">("active");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    supabase.from("dogs").select("*").eq("id", id).single().then(({ data }) => {
      if (!data) return;
      const d = data as Record<string, string>;
      setName(d.name ?? "");
      setFullName(d.full_name ?? "");
      setBreed(d.breed ?? "");
      setGender((d.gender as "male" | "female" | "") ?? "");
      setBirthDate(d.birth_date ?? "");
      setDescription(d.description ?? "");
      setCoverImageUrl(d.cover_image_url ?? "");
      setStatus((d.status as "active" | "retired" | "sold") ?? "active");
      setLoading(false);
    });
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { data: breeder } = await supabase.from("breeders").select("id").single();
    if (!breeder) { setError("Could not find your breeder profile."); setSaving(false); return; }

    const payload = {
      breeder_id: (breeder as { id: string }).id,
      name,
      full_name: fullName || null,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      breed: breed || null,
      gender: gender || null,
      birth_date: birthDate || null,
      description: description || null,
      cover_image_url: coverImageUrl || null,
      status,
    };

    const { error: err } = id
      ? await supabase.from("dogs").update(payload).eq("id", id)
      : await supabase.from("dogs").insert(payload);

    if (err) { setError(err.message); setSaving(false); return; }
    navigate("/dogs");
  }

  if (loading) return <p style={{ color: "#666" }}>Loading…</p>;

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        {isEdit ? `Edit Dog — ${name}` : "Add Dog"}
      </h1>
      <form onSubmit={handleSave} style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={LABEL_STYLE}>Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required style={INPUT_STYLE} placeholder="e.g. Rex" />
          </div>
          <div>
            <label style={LABEL_STYLE}>Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={INPUT_STYLE} placeholder="e.g. CH Salvusline's Golden King" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={LABEL_STYLE}>Breed</label>
            <input value={breed} onChange={(e) => setBreed(e.target.value)} style={INPUT_STYLE} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as "male" | "female" | "")} style={INPUT_STYLE}>
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

        <ImageUploader label="Cover Photo" value={coverImageUrl} onChange={setCoverImageUrl} folder="dogs" />

        <div>
          <label style={LABEL_STYLE}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={{ ...INPUT_STYLE, resize: "vertical" }} />
        </div>

        <div>
          <label style={LABEL_STYLE}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as "active" | "retired" | "sold")} style={INPUT_STYLE}>
            <option value="active">Active</option>
            <option value="retired">Retired</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: "0.85rem" }}>{error}</p>}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={saving} style={{ padding: "0.75rem 1.5rem", background: "#EC6B15", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Dog"}
          </button>
          <button type="button" onClick={() => navigate("/dogs")} style={{ padding: "0.75rem 1.5rem", background: "#2a2a2a", color: "#aaa", border: "none", borderRadius: 8, fontWeight: 500, fontSize: "0.9rem", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
