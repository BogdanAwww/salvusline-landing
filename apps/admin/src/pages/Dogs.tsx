import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SortableList from "../components/SortableList";
import useIsMobile from "../hooks/useIsMobile";

type Dog = { id: string; name: string; breed: string | null; status: string; cover_image_url: string | null };

const STATUS_COLOR: Record<string, string> = { active: "#4ade80", retired: "#facc15", sold: "#f87171" };

export default function Dogs() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  async function load() {
    const { data: breeder } = await supabase.from("breeders").select("id").single();
    if (!breeder) return;
    const { data } = await supabase
      .from("dogs")
      .select("id, name, breed, status, sort_order, cover_image_url")
      .eq("breeder_id", (breeder as { id: string }).id)
      .order("sort_order");
    setDogs((data as Dog[]) ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await supabase.from("dogs").delete().eq("id", id);
    load();
  }

  async function handleReorder(reordered: Dog[]) {
    setDogs(reordered);
    const updates = reordered.map((dog, i) => supabase.from("dogs").update({ sort_order: i }).eq("id", dog.id));
    await Promise.all(updates);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "0.75rem" }}>
        <div>
          <h1 style={{ fontSize: isMobile ? "1.25rem" : "1.5rem", fontWeight: 700 }}>Dogs</h1>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>{dogs.length} dogs registered</p>
        </div>
        <Link to="/dogs/new" style={{ padding: "0.65rem 1.25rem", background: "#EC6B15", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap", flexShrink: 0 }}>
          + Add Dog
        </Link>
      </div>

      {dogs.length > 0 ? (
        <SortableList
          items={dogs}
          onReorder={handleReorder}
          renderItem={(dog) =>
            isMobile ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  {dog.cover_image_url && (
                    <img src={dog.cover_image_url} alt={dog.name} style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dog.name}</div>
                    <div style={{ color: "#666", fontSize: "0.75rem", marginTop: 1 }}>{dog.breed}</div>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: STATUS_COLOR[dog.status] ?? "#aaa", background: `${STATUS_COLOR[dog.status]}22`, padding: "0.2rem 0.5rem", borderRadius: 20, flexShrink: 0 }}>
                    {dog.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
                  <button onClick={() => navigate(`/dogs/${dog.id}`)} style={{ flex: 1, padding: "0.4rem", background: "#2a2a2a", color: "#ccc", border: "none", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(dog.id, dog.name)} style={{ padding: "0.4rem 0.65rem", background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {dog.cover_image_url && (
                  <img src={dog.cover_image_url} alt={dog.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{dog.name}</div>
                  <div style={{ color: "#666", fontSize: "0.8rem", marginTop: 2 }}>{dog.breed}</div>
                </div>
                <span style={{ fontSize: "0.75rem", color: STATUS_COLOR[dog.status] ?? "#aaa", background: `${STATUS_COLOR[dog.status]}22`, padding: "0.25rem 0.6rem", borderRadius: 20 }}>
                  {dog.status}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => navigate(`/dogs/${dog.id}`)} style={{ padding: "0.4rem 0.8rem", background: "#2a2a2a", color: "#ccc", border: "none", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(dog.id, dog.name)} style={{ padding: "0.4rem 0.8rem", background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            )
          }
        />
      ) : (
        <div style={{ textAlign: "center", padding: "3rem", color: "#444", background: "#1a1a1a", borderRadius: 10, border: "1px dashed #2a2a2a" }}>
          No dogs yet. <Link to="/dogs/new" style={{ color: "#EC6B15" }}>Add your first dog</Link>
        </div>
      )}
    </div>
  );
}
