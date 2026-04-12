import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type PuppyRow = {
  id: string;
  photo_url: string | null;
  gender: "male" | "female" | null;
  birth_date: string | null;
  sire: string | null;
  dam: string | null;
  status: "available" | "reserved" | "sold";
};

const STATUS_COLOR: Record<string, string> = {
  available: "#4ade80",
  reserved: "#fbbf24",
  sold: "#666",
};

export default function Puppies() {
  const [puppies, setPuppies] = useState<PuppyRow[]>([]);
  const navigate = useNavigate();

  async function load() {
    const { data: breeder } = await supabase.from("breeders").select("id").single();
    if (!breeder) return;
    const { data } = await supabase
      .from("puppies")
      .select("id, photo_url, gender, birth_date, sire, dam, status")
      .eq("breeder_id", (breeder as { id: string }).id)
      .order("sort_order");
    setPuppies((data as PuppyRow[]) ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this puppy? This cannot be undone.")) return;
    await supabase.from("puppies").delete().eq("id", id);
    load();
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Puppies</h1>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>{puppies.length} puppies</p>
        </div>
        <Link to="/puppies/new" style={{ padding: "0.65rem 1.25rem", background: "#EC6B15", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>
          + Add Puppy
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {puppies.map((puppy) => (
          <div key={puppy.id} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            {puppy.photo_url ? (
              <img src={puppy.photo_url} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: 8, background: "#111", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#333", fontSize: "1.25rem" }}>🐶</span>
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "0.95rem", textTransform: "capitalize" }}>
                {puppy.gender ?? "Unknown"} puppy
              </div>
              <div style={{ color: "#666", fontSize: "0.8rem", marginTop: 2 }}>
                {[
                  puppy.birth_date ? formatDate(puppy.birth_date) : null,
                  puppy.sire ? `Sire: ${puppy.sire}` : null,
                  puppy.dam ? `Dam: ${puppy.dam}` : null,
                ].filter(Boolean).join(" · ")}
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: STATUS_COLOR[puppy.status] ?? "#666" }}>
              {puppy.status}
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => navigate(`/puppies/${puppy.id}`)} style={{ padding: "0.4rem 0.8rem", background: "#2a2a2a", color: "#ccc", border: "none", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Edit</button>
              <button onClick={() => handleDelete(puppy.id)} style={{ padding: "0.4rem 0.8rem", background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
        {!puppies.length && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#444", background: "#1a1a1a", borderRadius: 10, border: "1px dashed #2a2a2a" }}>
            No puppies yet. <Link to="/puppies/new" style={{ color: "#EC6B15" }}>Add your first puppy</Link>
          </div>
        )}
      </div>
    </div>
  );
}
