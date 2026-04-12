"use client";

import { useState, useEffect, useCallback } from "react";
import type { DogWithImages } from "@salvus/db";

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
      {/* Image */}
      <img
        src={images[current]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw", maxHeight: "90vh",
          objectFit: "contain", borderRadius: 8,
          userSelect: "none",
        }}
      />

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "fixed", top: 20, right: 24,
          background: "rgba(255,255,255,0.1)", border: "none",
          color: "#fff", fontSize: "1.5rem", width: 44, height: 44,
          borderRadius: "50%", cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}
      >
        ×
      </button>

      {/* Arrows — only when multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            style={{
              position: "fixed", left: 16, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
              fontSize: "1.5rem", width: 48, height: 48, borderRadius: "50%",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            style={{
              position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
              fontSize: "1.5rem", width: 48, height: 48, borderRadius: "50%",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ›
          </button>
          {/* Counter */}
          <div style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.5)", fontSize: "0.85rem",
          }}>
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

export function DogSection({ dog, index }: { dog: DogWithImages; index: number }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allImages = [
    ...(dog.cover_image_url ? [dog.cover_image_url] : []),
    ...(dog.dog_images?.map((img) => img.url) ?? []),
  ];

  const birthYear = dog.birth_date ? new Date(dog.birth_date).getFullYear() : null;
  const meta = [dog.breed, birthYear ? String(birthYear) : null].filter(Boolean);
  const isReversed = index % 2 === 1;
  const genderLabel = dog.gender === "male" ? "♂ Male" : dog.gender === "female" ? "♀ Female" : null;
  const genderClass = dog.gender === "male" ? "dog-section-meta-item--male" : dog.gender === "female" ? "dog-section-meta-item--female" : "";

  return (
    <>
      <div className="dog-section">
        <div className={`dog-section-inner${isReversed ? " dog-section-inner--reverse" : ""}`}>

          {/* Main photo */}
          {dog.cover_image_url && (
            <div className="dog-section-image" onClick={() => setLightboxIndex(0)}>
              <img src={dog.cover_image_url} alt={dog.name} loading="lazy" />
              <div className="dog-section-image-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="dog-section-info">
            <h2 className="dog-section-name">{dog.name}</h2>
            {dog.full_name && <p className="dog-section-fullname">{dog.full_name}</p>}

            {(meta.length > 0 || genderLabel) && (
              <div className="dog-section-meta">
                {genderLabel && (
                  <span className={`dog-section-meta-item ${genderClass}`}>{genderLabel}</span>
                )}
                {meta.map((item, i) => (
                  <span key={i} className="dog-section-meta-item">{item}</span>
                ))}
              </div>
            )}

            {dog.description && <p className="dog-section-desc">{dog.description}</p>}

            {/* Gallery thumbnails */}
            {dog.dog_images && dog.dog_images.length > 0 && (
              <div className="dog-section-gallery">
                {dog.dog_images.map((img, i) => (
                  <div
                    key={img.id}
                    className="dog-section-thumb"
                    onClick={() => setLightboxIndex(i + 1)} // +1 because cover is index 0
                  >
                    <img src={img.url} alt={dog.name} loading="lazy" />
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
