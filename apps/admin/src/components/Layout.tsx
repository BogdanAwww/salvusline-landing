import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import useIsMobile from "../hooks/useIsMobile";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/dogs", label: "Dogs" },
  { to: "/puppies", label: "Puppies" },
  { to: "/hall-of-fame", label: "Hall of Fame" },
  { to: "/blog", label: "Blog" },
  { to: "/content", label: "Content" },
  { to: "/messages", label: "Messages" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [unread, setUnread] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Close drawer on navigation
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  useEffect(() => {
    async function loadUnread() {
      const { data: breeder } = await supabase.from("breeders").select("id").single();
      if (!breeder) return;
      const { count } = await supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("breeder_id", (breeder as { id: string }).id)
        .eq("is_read", false);
      setUnread(count ?? 0);
    }
    loadUnread();
  }, [location.pathname]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  const sidebarContent = (
    <>
      <div style={{ padding: "0 1.25rem 1.5rem", borderBottom: "1px solid #222", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#EC6B15" }}>SALVUSLINE</span>
          <span style={{ display: "block", fontSize: "0.75rem", color: "#666", marginTop: 2 }}>Admin Panel</span>
        </div>
        {isMobile && (
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ background: "none", border: "none", color: "#666", fontSize: "1.5rem", cursor: "pointer", padding: "0.25rem", lineHeight: 1 }}
          >
            &times;
          </button>
        )}
      </div>
      <nav style={{ flex: 1 }}>
        {NAV.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.65rem 1.25rem",
              color: isActive ? "#fff" : "#aaa",
              textDecoration: "none",
              fontSize: "0.9rem",
              background: isActive ? "rgba(236,107,21,0.1)" : "transparent",
              borderLeft: isActive ? "2px solid #EC6B15" : "2px solid transparent",
            })}
          >
            {label}
            {to === "/messages" && unread > 0 && (
              <span style={{
                background: "#EC6B15",
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: 700,
                lineHeight: 1,
                padding: "0.2rem 0.45rem",
                borderRadius: 20,
                minWidth: 18,
                textAlign: "center",
              }}>
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #222" }}>
        <p style={{ fontSize: "0.8rem", color: "#555", marginBottom: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</p>
        <button onClick={handleSignOut} style={{ fontSize: "0.8rem", color: "#666", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          Sign out
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", background: "#111", borderBottom: "1px solid #222", flexShrink: 0 }}>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#EC6B15" }}>SALVUSLINE</span>
          <button
            onClick={() => setDrawerOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", display: "flex", flexDirection: "column", gap: 4 }}
            aria-label="Open menu"
          >
            <span style={{ display: "block", width: 22, height: 2, background: "#aaa", borderRadius: 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#aaa", borderRadius: 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#aaa", borderRadius: 1 }} />
          </button>
        </header>

        {/* Drawer overlay */}
        {drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100 }}
          />
        )}

        {/* Drawer */}
        <aside
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: 260,
            background: "#111",
            borderLeft: "1px solid #222",
            zIndex: 101,
            display: "flex",
            flexDirection: "column",
            paddingTop: "1.5rem",
            transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.25s ease",
          }}
        >
          {sidebarContent}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: "1.25rem 1rem", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    );
  }

  // Desktop layout
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, background: "#111", borderRight: "1px solid #222", padding: "1.5rem 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {sidebarContent}
      </aside>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
