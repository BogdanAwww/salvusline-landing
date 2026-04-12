import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type BuildStatus = "idle" | "triggering" | "triggered" | "error";

export default function Dashboard() {
  const [dogCount, setDogCount] = useState<number>(0);
  const [hofCount, setHofCount] = useState<number>(0);
  const [breederSlug, setBreederSlug] = useState("salvusline");
  const [buildStatus, setBuildStatus] = useState<BuildStatus>("idle");
  const [buildMessage, setBuildMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: breeder } = await supabase.from("breeders").select("id, slug").single();
      if (!breeder) return;
      setBreederSlug((breeder as { slug: string }).slug);

      const [{ count: dogs }, { count: hof }] = await Promise.all([
        supabase.from("dogs").select("*", { count: "exact", head: true }).eq("breeder_id", (breeder as { id: string }).id),
        supabase.from("hall_of_fame").select("*", { count: "exact", head: true }).eq("breeder_id", (breeder as { id: string }).id),
      ]);
      setDogCount(dogs ?? 0);
      setHofCount(hof ?? 0);
    }
    load();
  }, []);

  async function handlePublish() {
    setBuildStatus("triggering");
    setBuildMessage(null);

    const owner = import.meta.env.VITE_GH_OWNER;
    const repo = import.meta.env.VITE_GH_REPO;
    const pat = import.meta.env.VITE_GH_PAT;

    if (!owner || !repo || !pat) {
      setBuildStatus("error");
      setBuildMessage("GitHub env vars not configured (VITE_GH_OWNER, VITE_GH_REPO, VITE_GH_PAT)");
      return;
    }

    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/actions/workflows/deploy-sites.yml/dispatches`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${pat}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ref: "main", inputs: { breeder: breederSlug } }),
        }
      );

      if (!res.ok) {
        setBuildStatus("error");
        setBuildMessage("Failed to trigger build — check your GitHub token.");
        return;
      }

      setBuildStatus("triggered");
      setBuildMessage("Build triggered — your site will be live in ~90 seconds.");
    } catch {
      setBuildStatus("error");
      setBuildMessage("Network error — could not trigger build.");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Dashboard</h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Manage your breeder website</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <button
            onClick={handlePublish}
            disabled={buildStatus === "triggering"}
            style={{ padding: "0.75rem 1.5rem", background: buildStatus === "triggered" ? "#16a34a" : "#EC6B15", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.9rem", cursor: buildStatus === "triggering" ? "not-allowed" : "pointer", opacity: buildStatus === "triggering" ? 0.7 : 1 }}
          >
            {{ idle: "Publish Site", triggering: "Triggering…", triggered: "Build Triggered", error: "Retry Publish" }[buildStatus]}
          </button>
          {buildMessage && (
            <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: buildStatus === "error" ? "#f87171" : "#4ade80" }}>{buildMessage}</p>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[{ label: "Dogs", value: dogCount }, { label: "Hall of Fame", value: hofCount }].map(({ label, value }) => (
          <div key={label} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "1.25rem" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#EC6B15" }}>{value}</div>
            <div style={{ color: "#666", fontSize: "0.85rem", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
