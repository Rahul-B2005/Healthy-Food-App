import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Field, AuthCard } from "./authShared";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(name, email, password, phone);
      navigate("/menu");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Create your account" subtitle="A quick sign-up before we start cooking.">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Full name" value={name} onChange={setName} placeholder="Jordan Rivers" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Phone" value={phone} onChange={setPhone} placeholder="(555) 123-4567" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" />
        {error && <div style={{ color: "var(--tomato)", fontSize: 13.5 }}>{error}</div>}
        <button
          disabled={busy || !name || !email || password.length < 6}
          className="focus-ring auth-primary-btn"
          style={{ background: busy ? "var(--button-disabled)" : "#6d28d9", color: "#ffffff", border: "none", borderRadius: 999, padding: 14, fontWeight: 800, fontSize: 15 }}
        >
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p style={{ marginTop: 18, fontSize: 13.5, color: "var(--ink-soft)", textAlign: "center" }}>
        Already have an account? <Link to="/login" style={{ color: "var(--forest)", fontWeight: 700 }}>Log in</Link>
      </p>
    </AuthCard>
  );
}
