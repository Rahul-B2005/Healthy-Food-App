import React, { useState } from "react";

// Spice-inspired palettes reworked for a dim, restaurant-plated look:
// brass gold, oxblood, deep olive — instead of bright market colors.
const PALETTES = [
  ["#E0B564", "#DB2777", "#3E3324"],
  ["#DB2777", "#2A2019", "#E0B564"],
  ["#E0B564", "#8FA06B", "#DB2777"],
];

// Renders a real photo when `image` is set; falls back to generated dish art
// if there's no image yet, or the URL fails to load (e.g. a broken link).
export default function DishArt({ seed = 0, image = "" }) {
  const [broken, setBroken] = useState(false);

  if (image && !broken) {
    return (
      <img
        src={image}
        alt=""
        onError={() => setBroken(true)}
        style={{ width: "100%", height: 130, objectFit: "cover", display: "block", background: "var(--panel)" }}
      />
    );
  }

  const p = PALETTES[seed % PALETTES.length];
  return (
    <svg viewBox="0 0 200 120" style={{ width: "100%", height: 130, display: "block", background: "var(--panel)" }}>
      <ellipse cx="100" cy="90" rx="86" ry="18" fill={p[0]} opacity="0.18" />
      <ellipse cx="100" cy="70" rx="78" ry="30" fill="#2A2019" />
      {/* curry / gravy base */}
      <ellipse cx="100" cy="66" rx="72" ry="24" fill={p[0]} opacity="0.85" />
      {/* garnish: paneer / veg pieces */}
      <circle cx="70" cy="58" r="10" fill={p[1]} />
      <circle cx="110" cy="50" r="8" fill={p[2]} />
      <circle cx="130" cy="66" r="7" fill="#1C1C1C" />
      <circle cx="90" cy="70" r="7" fill="#F0E6D2" />
      {/* fresh coriander fleck */}
      <circle cx="105" cy="62" r="3" fill="#5B6B45" />
      <circle cx="80" cy="72" r="2.5" fill="#5B6B45" />
      {/* rising steam wisps */}
      <path d="M78 40 Q84 28 78 18" stroke="#F0E6D2" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
      <path d="M100 36 Q106 22 100 10" stroke="#F0E6D2" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.35" />
      <path d="M122 40 Q128 28 122 18" stroke="#F0E6D2" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}
