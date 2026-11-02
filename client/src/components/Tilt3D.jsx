import React, { useRef } from "react";

// Wraps children in a lightweight, dependency-free 3D tilt effect that
// follows the cursor. No-ops entirely when the user prefers reduced motion.
export default function Tilt3D({ children, maxTilt = 8, className = "", style = {} }) {
  const ref = useRef(null);
  const reduced =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const onMouseMove = (e) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * maxTilt * 2;
    const ry = (px - 0.5) * maxTilt * 2;
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{ transition: "transform .18s ease", transformStyle: "preserve-3d", willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}
