import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SortableList from "../components/SortableList";
import useIsMobile from "../hooks/useIsMobile";

type HofEntry = { id: string; dog_name: string; title: string | null; year: number | null; image_url: string | null };

export default function HallOfFame() {
  const [entries, setEntries] = useState<HofEntry[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  async function load() {
    const { data: breeder } = await supabase.from("breeders").select("id").single();
    if (!breeder) return;
    const { data } = await supabase
      .from("hall_of_fame")
      .select("id, dog_name, title, year, image_url")
      .eq("breeder_id", (breeder as { id: string }).id)
      .order("sort_order");
    setEntries((data as HofEntry[]) ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await supabase.from("hall_of_fame").delete().eq("id", id);
    load();
  }

  async function handleReorder(reordered: HofEntry[]) {
    setEntries(reordered);
    const updates = reordered.map((e, i) => supabase.from("hall_of_fame").update({ sort_order: i }).eq("id", e.id));
    await Promise.all(updates);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "0.75rem" }}>
        <div>
          <h1 style={{ fontSize: isMobile ? "1.25rem" : "1.5rem", fontWeight: 700 }}>Hall of Fame</h1>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>{entries.length} entries</p>
        </div>
        <Link to="/hall-of-fame/new" style={{ padding: "0.65rem 1.25rem", background: "#EC6B15", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap", flexShrink: 0 }}>
          + Add Entry
        </Link>
      </div>

      {entries.length > 0 ? (
        <SortableList
          items={entries}
          onReorder={handleReorder}
          renderItem={(entry) =>
            isMobile ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  {entry.image_url && (
                    <img src={entry.image_url} alt={entry.dog_name} style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.dog_name}</div>
                    <div style={{ color: "#666", fontSize: "0.7rem", marginTop: 1 }}>{[entry.title, entry.year].filter(Boolean).join(" · ")}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
                  <button onClick={() => navigate(`/hall-of-fame/${entry.id}`)} style={{ flex: 1, padding: "0.4rem", background: "#2a2a2a", color: "#ccc", border: "none", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(entry.id, entry.dog_name)} style={{ padding: "0.4rem 0.65rem", background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {entry.image_url && (
                  <img src={entry.image_url} alt={entry.dog_name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{entry.dog_name}</div>
                  <div style={{ color: "#666", fontSize: "0.8rem", marginTop: 2 }}>{[entry.title, entry.year].filter(Boolean).join(" · ")}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => navigate(`/hall-of-fame/${entry.id}`)} style={{ padding: "0.4rem 0.8rem", background: "#2a2a2a", color: "#ccc", border: "none", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(entry.id, entry.dog_name)} style={{ padding: "0.4rem 0.8rem", background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            )
          }
        />
      ) : (
        <div style={{ textAlign: "center", padding: "3rem", color: "#444", background: "#1a1a1a", borderRadius: 10, border: "1px dashed #2a2a2a" }}>
          No entries yet. <Link to="/hall-of-fame/new" style={{ color: "#EC6B15" }}>Add your first champion</Link>
        </div>
      )}
    </div>
  );
}
