import React from "react";

// Six dish-colored spheres orbit a plate in true 3D (rotateY + translateZ),
// not a spritesheet or faked parallax. Pauses automatically for anyone who
// prefers reduced motion (see .thali-orbit-ring in index.css).
const DOTS = [
  "linear-gradient(135deg,#E0B564,#DB2777)",
  "linear-gradient(135deg,#8FA06B,#3E3324)",
  "linear-gradient(135deg,#DB2777,#2A2019)",
  "linear-gradient(135deg,#C6A15B,#8FA06B)",
  "linear-gradient(135deg,#6B5A3C,#E0B564)",
  "linear-gradient(135deg,#DB2777,#C6A15B)",
];

export default function ThaliOrbit({ size = 240 }) {
  return (
    <div className="thali-orbit-scene" style={{ width: size, height: size }} aria-hidden="true">
      <div className="thali-orbit-plate" />
      <div className="thali-orbit-ring">
        {DOTS.map((bg, i) => (
          <span
            key={i}
            className="thali-orbit-dot"
            style={{
              background: bg,
              transform: `rotateY(${(360 / DOTS.length) * i}deg) translateZ(${size * 0.42}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
