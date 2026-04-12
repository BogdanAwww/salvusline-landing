import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const TEXTAREA_STYLE: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  background: "#111",
  border: "1px solid #333",
  borderRadius: 8,
  color: "#fff",
  fontSize: "0.9rem",
  resize: "vertical",
  lineHeight: 1.6,
};

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  color: "#aaa",
  fontSize: "0.8rem",
  marginBottom: "0.4rem",
};

const HINT_STYLE: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#555",
  marginTop: "0.35rem",
};

export default function ContentPage() {
  const [aboutText, setAboutText] = useState("");
  const [aboutBreedText, setAboutBreedText] = useState("");
  const [breederId, setBreederId] = useState<string | null>(null);
  const [siteTitle, setSiteTitle] = useState("SALVUSLINE");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: breeder } = await supabase.from("breeders").select("id, name, site_config(*)").single();
      if (!breeder) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const b = breeder as any;
      const cfg = Array.isArray(b.site_config) ? b.site_config[0] : b.site_config;
      setBreederId(b.id);
      setSiteTitle(cfg?.title ?? b.name ?? "SALVUSLINE");
      setAboutText(cfg?.about_text ?? "");
      setAboutBreedText(cfg?.about_breed_text ?? "");
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!breederId) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    // upsert so it works even if site_config row doesn't exist yet
    const { error: err } = await supabase
      .from("site_config")
      .upsert({
        breeder_id: breederId,
        title: siteTitle,
        about_text: aboutText || null,
        about_breed_text: aboutBreedText || null,
      }, { onConflict: "breeder_id", ignoreDuplicates: false });

    if (err) { setError(err.message); setSaving(false); return; }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <p style={{ color: "#666" }}>Loading…</p>;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Content</h1>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>Edit the text sections shown on your public site</p>
      </div>

      <form onSubmit={handleSave} style={{ maxWidth: 700, display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* About Us */}
        <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 0.25rem" }}>About Us</h2>
            <p style={{ color: "#555", fontSize: "0.8rem", margin: 0 }}>Shown on the homepage — your kennel story</p>
          </div>
          <div>
            <label style={LABEL_STYLE}>Text</label>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={10}
              style={TEXTAREA_STYLE}
              placeholder="We are breeders of Bull Terriers…"
            />
            <p style={HINT_STYLE}>Separate paragraphs with a blank line</p>
          </div>
        </div>

        {/* About the Breed */}
        <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 0.25rem" }}>About the Breed</h2>
            <p style={{ color: "#555", fontSize: "0.8rem", margin: 0 }}>Shown on the Our Dogs page — breed description</p>
          </div>
          <div>
            <label style={LABEL_STYLE}>Text</label>
            <textarea
              value={aboutBreedText}
              onChange={(e) => setAboutBreedText(e.target.value)}
              rows={10}
              style={TEXTAREA_STYLE}
              placeholder="There is no dog quite like the Bull Terrier…"
            />
            <p style={HINT_STYLE}>Separate paragraphs with a blank line</p>
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: "0.85rem" }}>{error}</p>}

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            type="submit"
            disabled={saving}
            style={{ padding: "0.75rem 1.5rem", background: "#EC6B15", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {saved && <span style={{ color: "#4ade80", fontSize: "0.85rem" }}>Saved!</span>}
        </div>
      </form>
    </div>
  );
}
