import { useState } from "react";
import { supabase } from "../lib/supabase";

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  background: "#111",
  border: "1px solid #333",
  borderRadius: 8,
  color: "#fff",
  fontSize: "1rem",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    // On success, App.tsx session listener will re-render automatically
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f0f" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "2rem", background: "#1a1a1a", borderRadius: 12, border: "1px solid #2a2a2a" }}>
        <h1 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Admin Panel</h1>
        <p style={{ color: "#666", marginBottom: "2rem", fontSize: "0.9rem" }}>Sign in to manage your breeder site</p>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", color: "#aaa", fontSize: "0.85rem", marginBottom: "0.4rem" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={INPUT_STYLE} />
          </div>
          <div>
            <label style={{ display: "block", color: "#aaa", fontSize: "0.85rem", marginBottom: "0.4rem" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={INPUT_STYLE} />
          </div>
          {error && <p style={{ color: "#f87171", fontSize: "0.85rem", background: "rgba(239,68,68,0.1)", padding: "0.75rem", borderRadius: 8 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ padding: "0.875rem", background: "#EC6B15", color: "#fff", border: "none", borderRadius: 8, fontSize: "1rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
