import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { uploadMedia } from "../lib/uploadMedia";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savings, setSavings] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Only image files are allowed"); return; }
    if (file.size > 20 * 1024 * 1024) { setError("File too large (max 20 MB)"); return; }

    setUploading(true);
    setError(null);
    setSavings(null);

    const originalSize = file.size;

    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1400,
      useWebWorker: true,
      fileType: "image/webp",
    }).catch(() => file); // fall back to original if compression fails

    const optimizedSize = compressed.size;
    const savedPct = Math.round((1 - optimizedSize / originalSize) * 100);

    try {
      const publicUrl = await uploadMedia(compressed, folder);
      onChange(publicUrl);
      if (savedPct > 0) setSavings(`${savedPct}%`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    uploadFile(files[0]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  const borderColor = dragOver ? "#EC6B15" : value ? "#3a3a3a" : "#2a2a2a";

  return (
    <div>
      <label style={{ display: "block", color: "#aaa", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{label}</label>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${borderColor}`,
          borderRadius: 10,
          padding: value ? "0.5rem" : "2rem",
          cursor: uploading ? "not-allowed" : "pointer",
          transition: "border-color 0.2s",
          background: dragOver ? "rgba(236,107,21,0.05)" : "#111",
          display: "flex",
          flexDirection: value ? "row" : "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ color: "#aaa", fontSize: "0.8rem", margin: 0, wordBreak: "break-all" }}>
                {uploading ? "Uploading..." : value.split("/").pop()}
              </p>
              {savings && <p style={{ color: "#4ade80", fontSize: "0.75rem", margin: "0.25rem 0 0" }}>Optimized — saved {savings}</p>}
              {!uploading && <p style={{ color: "#EC6B15", fontSize: "0.75rem", margin: "0.25rem 0 0" }}>Click to replace</p>}
            </div>
          </>
        ) : (
          <>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p style={{ color: "#555", fontSize: "0.85rem", margin: 0, textAlign: "center" }}>
              {uploading ? "Uploading and optimizing..." : "Drop image here or click to upload"}
            </p>
            <p style={{ color: "#444", fontSize: "0.75rem", margin: 0 }}>PNG, JPG, WebP · Max 20 MB · Auto-converted to WebP</p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
      {error && <p style={{ color: "#f87171", fontSize: "0.8rem", marginTop: "0.4rem" }}>{error}</p>}
    </div>
  );
}
