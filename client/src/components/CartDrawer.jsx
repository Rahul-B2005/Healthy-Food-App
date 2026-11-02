import React from "react";
import { useNavigate } from "react-router-dom";
import { X, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const currency = (n) => `₹${n.toFixed(0)}`;

export default function CartDrawer({ onClose }) {
  const { cartItems, subtotal, deliveryFee, total, add, remove } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const goCheckout = () => {
    onClose();
    navigate(user ? "/checkout" : "/login?next=/checkout");
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(46,16,101,0.35)" }} />
      <div
        style={{
          position: "relative",
          width: 380,
          maxWidth: "90vw",
          background: "var(--bg)",
          height: "100%",
          boxShadow: "-16px 0 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          animation: "fadeUp .25s ease",
        }}
      >
        <div style={{ padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
          <div className="disp" style={{ fontSize: 20, fontWeight: 700, color: "var(--forest-dark)" }}>Your cart</div>
          <button onClick={onClose} className="focus-ring" style={{ background: "none", border: "none" }}>
            <X size={20} color="var(--ink-soft)" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
          {cartItems.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 60, color: "var(--ink-faint)" }}>
              <ShoppingBag size={30} style={{ marginBottom: 10, opacity: 0.5 }} />
              <div>Your cart is empty. Add something fresh.</div>
            </div>
          )}
          {cartItems.map(({ item, qty }) => (
            <div key={item._id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--forest-dark)" }}>{item.name}</div>
                <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>{currency(item.price)} each</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <button onClick={() => remove(item._id)} className="focus-ring" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Minus size={12} color="var(--forest)" />
                  </button>
                  <span style={{ fontWeight: 800, fontSize: 13.5 }}>{qty}</span>
                  <button onClick={() => add(item)} className="focus-ring" style={{ background: "var(--forest)", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Plus size={12} color="var(--paper)" />
                  </button>
                </div>
              </div>
              <div style={{ fontWeight: 800, color: "var(--forest)" }}>{currency(item.price * qty)}</div>
            </div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <div className="ticket" style={{ margin: "0 22px 22px", borderTop: "none", padding: "16px 16px 4px" }}>
            <Row label="Subtotal" value={currency(subtotal)} />
            <Row label="Delivery" value={currency(deliveryFee)} />
            <hr className="ticket-divider" />
            <Row label="Total" value={currency(total)} bold />
            <button
              onClick={goCheckout}
              className="focus-ring"
              style={{ width: "100%", marginTop: 14, background: "var(--forest)", color: "#ffffff", border: "none", borderRadius: 999, padding: 14, fontWeight: 800, fontSize: 15 }}
            >
              Checkout · {currency(total)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: bold ? 16 : 14, fontWeight: bold ? 800 : 500, color: bold ? "var(--forest-dark)" : "var(--ink-soft)" }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
