import React from "react";

export function AuthCard({ title, subtitle, children }) {
  return (
    <main className="container auth-page" style={{ padding: "60px 24px", display: "flex", justifyContent: "center" }}>
      <div className="auth-card" style={{ background: "var(--card)", borderRadius: 14, padding: 32, width: 400, maxWidth: "100%", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Healthy Food</div>
        <h1 className="disp" style={{ fontSize: 26, fontWeight: 600, color: "var(--forest-dark)", margin: 0 }}>
          {title}
        </h1>
        <p style={{ color: "var(--ink-faint)", fontSize: 14, marginTop: 6, marginBottom: 22 }}>{subtitle}</p>
        {children}
      </div>
    </main>
  );
}

export function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-soft)" }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring"
        style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "11px 14px", fontSize: 14.5, background: "var(--panel)" }}
      />
    </label>
  );
}
