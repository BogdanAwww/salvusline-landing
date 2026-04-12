import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/dogs", label: "Dogs" },
  { to: "/hall-of-fame", label: "Hall of Fame" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, background: "#111", borderRight: "1px solid #222", padding: "1.5rem 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "0 1.25rem 1.5rem", borderBottom: "1px solid #222", marginBottom: "1rem" }}>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#EC6B15" }}>SALVUSLINE</span>
          <span style={{ display: "block", fontSize: "0.75rem", color: "#666", marginTop: 2 }}>Admin Panel</span>
        </div>
        <nav style={{ flex: 1 }}>
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              style={({ isActive }) => ({
                display: "block",
                padding: "0.65rem 1.25rem",
                color: isActive ? "#fff" : "#aaa",
                textDecoration: "none",
                fontSize: "0.9rem",
                background: isActive ? "rgba(236,107,21,0.1)" : "transparent",
                borderLeft: isActive ? "2px solid #EC6B15" : "2px solid transparent",
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #222" }}>
          <p style={{ fontSize: "0.8rem", color: "#555", marginBottom: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</p>
          <button onClick={handleSignOut} style={{ fontSize: "0.8rem", color: "#666", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Sign out
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
