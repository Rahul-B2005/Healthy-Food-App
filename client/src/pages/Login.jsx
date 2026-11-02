import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Field, AuthCard } from "./authShared";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/menu";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to place and track your order.">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        {error && <div style={{ color: "var(--tomato)", fontSize: 13.5 }}>{error}</div>}
        <button
          disabled={busy || !email || !password}
          className="focus-ring auth-primary-btn"
          style={{ background: busy ? "var(--button-disabled)" : "#6d28d9", color: "#ffffff", border: "none", borderRadius: 999, padding: 14, fontWeight: 800, fontSize: 15 }}
        >
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p style={{ marginTop: 18, fontSize: 13.5, color: "var(--ink-soft)", textAlign: "center" }}>
        New here? <Link to="/register" style={{ color: "var(--forest)", fontWeight: 700 }}>Create an account</Link>
      </p>
    </AuthCard>
  );
}
