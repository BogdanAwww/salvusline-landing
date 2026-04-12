"use client";

import { useState, useEffect, useCallback } from "react";
import type { HofEntryWithImages } from "@salvus/db";

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <img
        src={images[current]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8, userSelect: "none" }}
      />
      <button
        onClick={onClose}
        style={{
          position: "fixed", top: 20, right: 24,
          background: "rgba(255,255,255,0.1)", border: "none",
          color: "#fff", fontSize: "1.5rem", width: 44, height: 44,
          borderRadius: "50%", cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}
      >×</button>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            style={{ position: "fixed", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: "1.5rem", width: 48, height: 48, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >‹</button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            style={{ position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: "1.5rem", width: 48, height: 48, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >›</button>
          <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

export function HofSection({ entry, index }: { entry: HofEntryWithImages; index: number }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isReversed = index % 2 === 1;

  const allImages = [
    ...(entry.image_url ? [entry.image_url] : []),
    ...(entry.hof_images?.map((img) => img.url) ?? []),
  ];

  return (
    <>
      <div className="hof-section-item">
        <div className={`hof-section-inner${isReversed ? " hof-section-inner--reverse" : ""}`}>

          {/* Photo */}
          {entry.image_url && (
            <div className="hof-section-image" onClick={() => setLightboxIndex(0)}>
              <img src={entry.image_url} alt={entry.dog_name} loading="lazy" />
              <div className="hof-section-image-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="hof-section-info">
            <div className="hof-section-trophy">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                <path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4M8 21h8M12 17v4M6 9a6 6 0 0012 0V3H6v6z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="hof-section-name">{entry.dog_name}</h2>

            <div className="hof-section-meta">
              {entry.title && <span className="hof-section-meta-item">{entry.title}</span>}
              {entry.year && <span className="hof-section-meta-item hof-section-meta-year">{entry.year}</span>}
            </div>

            {entry.description && <p className="hof-section-desc">{entry.description}</p>}

            {/* Gallery thumbnails */}
            {entry.hof_images && entry.hof_images.length > 0 && (
              <div className="dog-section-gallery">
                {entry.hof_images.map((img, i) => (
                  <div
                    key={img.id}
                    className="dog-section-thumb"
                    onClick={() => setLightboxIndex(i + 1)}
                  >
                    <img src={img.url} alt={entry.dog_name} loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && allImages.length > 0 && (
        <Lightbox
          images={allImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
