import React from "react";
import { Sprout, ChefHat, Bike, CheckCircle2 } from "lucide-react";

export const STAGES = [
  { key: "Placed", label: "Order placed", sub: "We've got your order", icon: Sprout },
  { key: "Preparing", label: "Preparing", sub: "Our kitchen is cooking fresh", icon: ChefHat },
  { key: "Out for Delivery", label: "Out for delivery", sub: "Rider is on the way", icon: Bike },
  { key: "Delivered", label: "Delivered", sub: "Enjoy your meal", icon: CheckCircle2 },
];

// Maps backend statuses (which also include "Confirmed" and "Cancelled")
// onto the four visible vine stages.
export function stageIndexForStatus(status) {
  const map = {
    Placed: 0,
    Confirmed: 0,
    Preparing: 1,
    "Out for Delivery": 2,
    Delivered: 3,
    Cancelled: 0,
  };
  return map[status] ?? 0;
}

export default function VineStepper({ stageIndex }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
      {STAGES.map((s, i) => {
        const Icon = s.icon;
        const done = i <= stageIndex;
        const current = i === stageIndex;
        return (
          <React.Fragment key={s.key}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 90, textAlign: "center" }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: done ? "var(--forest)" : "var(--bg)",
                  border: done ? "none" : "2px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all .4s ease",
                  boxShadow: current ? "0 0 0 6px rgba(198,161,91,0.18)" : "none",
                }}
              >
                <Icon size={20} color={done ? "var(--paper)" : "var(--ink-faint)"} />
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: done ? "var(--forest-dark)" : "var(--ink-faint)", marginTop: 10 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 2 }}>{current ? s.sub : ""}</div>
            </div>
            {i < STAGES.length - 1 && (
              <div style={{ flex: 1, height: 2, marginTop: 23, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "var(--border)" }} />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--leaf)",
                    width: i < stageIndex ? "100%" : "0%",
                    transition: "width 1s ease",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
