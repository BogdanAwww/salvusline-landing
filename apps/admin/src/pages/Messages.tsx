import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import useIsMobile from "../hooks/useIsMobile";

type Message = {
  id: string;
  contact: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  async function load() {
    const { data: breeder } = await supabase.from("breeders").select("id").single();
    if (!breeder) return;
    const { data } = await supabase
      .from("contact_messages")
      .select("id, contact, message, is_read, created_at")
      .eq("breeder_id", (breeder as { id: string }).id)
      .order("created_at", { ascending: false });
    setMessages((data as Message[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string) {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  const unread = messages.filter((m) => !m.is_read).length;

  if (loading) return <p style={{ color: "#666" }}>Loading...</p>;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: isMobile ? "1.25rem" : "1.5rem", fontWeight: 700 }}>Messages</h1>
        <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>
          {messages.length} total · {unread} unread
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              background: "#1a1a1a",
              border: `1px solid ${msg.is_read ? "#2a2a2a" : "rgba(236,107,21,0.35)"}`,
              borderRadius: 10,
              padding: isMobile ? "1rem" : "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-start", justifyContent: "space-between", gap: isMobile ? "0.25rem" : "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                {!msg.is_read && (
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EC6B15", flexShrink: 0, display: "inline-block" }} />
                )}
                <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{msg.contact}</span>
              </div>
              <span style={{ color: "#555", fontSize: "0.78rem", flexShrink: 0 }}>{formatDate(msg.created_at)}</span>
            </div>

            <p style={{ color: "#aaa", fontSize: "0.9rem", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
              {msg.message}
            </p>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {!msg.is_read && (
                <button
                  onClick={() => markRead(msg.id)}
                  style={{ padding: "0.35rem 0.8rem", background: "rgba(236,107,21,0.1)", color: "#EC6B15", border: "1px solid rgba(236,107,21,0.3)", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}
                >
                  Mark as read
                </button>
              )}
              <button
                onClick={() => handleDelete(msg.id)}
                style={{ padding: "0.35rem 0.8rem", background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {!messages.length && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#444", background: "#1a1a1a", borderRadius: 10, border: "1px dashed #2a2a2a" }}>
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
