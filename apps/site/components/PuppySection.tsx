"use client";

import { useState, useEffect, useCallback } from "react";
import type { PuppyWithImages } from "@salvus/db";

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const STATUS_LABEL: Record<string, string> = { available: "Available", reserved: "Reserved", sold: "Sold" };
const STATUS_CLASS: Record<string, string> = {
  available: "puppy-section-status--available",
  reserved: "puppy-section-status--reserved",
  sold: "puppy-section-status--sold",
};

export function PuppySection({ puppy, index }: { puppy: PuppyWithImages; index: number }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allImages = [
    ...(puppy.photo_url ? [puppy.photo_url] : []),
    ...(puppy.puppy_images?.map((img) => img.url) ?? []),
  ];

  const genderLabel = puppy.gender === "male" ? "♂ Male" : puppy.gender === "female" ? "♀ Female" : null;
  const genderClass = puppy.gender === "male" ? "puppy-section-gender--male" : "puppy-section-gender--female";
  const isReversed = index % 2 === 1;

  return (
    <>
      <div className="puppy-section">
        <div className={`puppy-section-inner${isReversed ? " puppy-section-inner--reverse" : ""}`}>

          {/* Main photo */}
          {puppy.photo_url && (
            <div className="puppy-section-image" onClick={() => setLightboxIndex(0)}>
              <img src={puppy.photo_url} alt={genderLabel ?? "Puppy"} loading="lazy" />
              <div className="puppy-section-image-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="puppy-section-info">
            <div className="puppy-section-badges">
              {genderLabel && (
                <span className={`puppy-section-gender ${genderClass}`}>{genderLabel}</span>
              )}
              <span className={`puppy-section-status ${STATUS_CLASS[puppy.status]}`}>
                {STATUS_LABEL[puppy.status]}
              </span>
            </div>

            <div className="puppy-section-details">
              {puppy.birth_date && (
                <div className="puppy-section-row">
                  <span className="puppy-section-row-label">Born</span>
                  <span className="puppy-section-row-value">{formatDate(puppy.birth_date)}</span>
                </div>
              )}
              {puppy.sire && (
                <div className="puppy-section-row">
                  <span className="puppy-section-row-label">Sire</span>
                  <span className="puppy-section-row-value">{puppy.sire}</span>
                </div>
              )}
              {puppy.dam && (
                <div className="puppy-section-row">
                  <span className="puppy-section-row-label">Dam</span>
                  <span className="puppy-section-row-value">{puppy.dam}</span>
                </div>
              )}
            </div>

            {/* Gallery thumbnails */}
            {puppy.puppy_images && puppy.puppy_images.length > 0 && (
              <div className="puppy-section-gallery">
                {puppy.puppy_images.map((img, i) => (
                  <div
                    key={img.id}
                    className="puppy-section-thumb"
                    onClick={() => setLightboxIndex(i + 1)}
                  >
                    <img src={img.url} alt="" loading="lazy" />
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
