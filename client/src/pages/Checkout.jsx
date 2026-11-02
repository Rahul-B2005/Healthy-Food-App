import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { Field } from "./authShared";

const currency = (n) => `₹${n.toFixed(0)}`;

export default function Checkout() {
  const { cartItems, subtotal, deliveryFee, total, clear } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const paymentMethod = "Cash on Delivery"; // this store only accepts COD
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (cartItems.length === 0) {
    return (
      <main className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 className="disp" style={{ fontSize: 24, color: "var(--forest-dark)" }}>Your cart is empty</h2>
        <p style={{ color: "var(--ink-faint)", marginTop: 8 }}>Add something from the menu before checking out.</p>
      </main>
    );
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload = {
        items: cartItems.map(({ item, qty }) => ({
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: qty,
        })),
        deliveryAddress: { street, city, state, zip, phone },
        paymentMethod,
      };
      const order = await api.createOrder(payload, token);
      clear();
      navigate(`/orders/${order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container" style={{ padding: "44px 24px 90px", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32 }}>
      <div>
        <h1 className="disp" style={{ fontSize: 30, fontWeight: 700, color: "var(--forest-dark)" }}>Delivery details</h1>
        <form onSubmit={placeOrder} style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14, background: "var(--card)", borderRadius: 20, padding: 24, border: "1px solid var(--border)" }}>
          <Field label="Street address" value={street} onChange={setStreet} placeholder="123 Willow Street, Apt 4B" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="City" value={city} onChange={setCity} placeholder="Springfield" />
            <Field label="State" value={state} onChange={setState} placeholder="CA" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="ZIP code" value={zip} onChange={setZip} placeholder="94103" />
            <Field label="Phone" value={phone} onChange={setPhone} placeholder="(555) 123-4567" />
          </div>

          <div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-soft)" }}>Payment method</span>
            <div
              style={{
                marginTop: 6,
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid var(--forest)",
                background: "var(--forest)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 13.5,
              }}
            >
              Cash on Delivery — pay when your order arrives
            </div>
          </div>

          {error && <div style={{ color: "var(--tomato)", fontSize: 13.5 }}>{error}</div>}

          <button
            disabled={busy || !street || !city || !zip}
            className="focus-ring"
            style={{ background: busy ? "var(--steel)" : "var(--forest)", color: "#ffffff", border: "none", borderRadius: 999, padding: 15, fontWeight: 800, fontSize: 15 }}
          >
            {busy ? "Placing order…" : `Place order · ${currency(total)}`}
          </button>
        </form>
      </div>

      <div>
        <div className="ticket" style={{ padding: "26px 22px 20px", position: "sticky", top: 100 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Order summary</div>
          {cartItems.map(({ item, qty }) => (
            <div key={item._id} className="ticket-row">
              <span>{qty} × {item.name}</span>
              <span style={{ fontWeight: 700, color: "var(--leaf-deep)" }}>{currency(item.price * qty)}</span>
            </div>
          ))}
          <hr className="ticket-divider" />
          <Row label="Subtotal" value={currency(subtotal)} />
          <Row label="Delivery" value={currency(deliveryFee)} />
          <hr className="ticket-divider" />
          <Row label="Total" value={currency(total)} bold />
        </div>
      </div>
    </main>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: bold ? 16 : 14, fontWeight: bold ? 800 : 500, color: bold ? "var(--forest-dark)" : "var(--ink-soft)" }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
