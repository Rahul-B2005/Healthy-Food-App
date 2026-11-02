import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { MapPin, Bike, Phone, Sprout } from "lucide-react";
import VineStepper, { stageIndexForStatus } from "../components/VineStepper";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const currency = (n) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function OrderTracking() {
  const { orderId } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  // Load the order once
  useEffect(() => {
    if (!token) return;
    api
      .getOrder(orderId, token)
      .then(setOrder)
      .catch((err) => setError(err.message));
  }, [orderId, token]);

  // Subscribe to live status updates for this order
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socket.on("connect", () => {
      setConnected(true);
      socket.emit("joinOrderRoom", orderId);
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("orderStatusUpdated", (payload) => {
      if (payload.orderId === orderId) {
        setOrder((prev) => (prev ? { ...prev, status: payload.status, statusHistory: payload.statusHistory } : prev));
      }
    });
    return () => socket.disconnect();
  }, [orderId]);

  if (error) {
    return (
      <main className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 className="disp" style={{ fontSize: 24, color: "var(--forest-dark)" }}>Couldn't load this order</h2>
        <p style={{ color: "var(--ink-faint)", marginTop: 8 }}>{error}</p>
        <Link to="/menu" style={{ color: "var(--forest)", fontWeight: 700 }}>Back to menu</Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="container" style={{ padding: "90px 24px", textAlign: "center" }}>
        <Sprout size={34} color="var(--forest)" style={{ marginBottom: 14 }} />
        <p style={{ color: "var(--ink-faint)" }}>Loading order…</p>
      </main>
    );
  }

  const stageIndex = stageIndexForStatus(order.status);
  const delivered = order.status === "Delivered";
  const cancelled = order.status === "Cancelled";

  return (
    <main className="container" style={{ padding: "48px 24px 90px", maxWidth: 720 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--ink-faint)", letterSpacing: "0.04em" }}>
            ORDER #{order._id.slice(-6).toUpperCase()}
          </div>
          <h1 className="disp" style={{ fontSize: 30, fontWeight: 700, color: "var(--forest-dark)", marginTop: 2 }}>
            {cancelled ? "Order cancelled" : delivered ? "Delivered — enjoy!" : "On its way to you"}
          </h1>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: connected ? "var(--leaf)" : "var(--ink-faint)", fontWeight: 700 }}>
            {connected ? "● live" : "○ connecting…"}
          </div>
        </div>
      </div>

      {!cancelled && (
        <div style={{ background: "var(--card)", borderRadius: 24, padding: "34px 28px", marginTop: 28, border: "1px solid var(--border)" }}>
          <VineStepper stageIndex={stageIndex} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
        <div style={{ background: "var(--card)", borderRadius: 18, padding: 18, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-faint)", marginBottom: 8, letterSpacing: "0.03em" }}>DELIVERING TO</div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <MapPin size={16} color="var(--forest)" style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, color: "var(--forest-dark)", fontSize: 14 }}>{order.user?.name}</div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                {order.deliveryAddress?.street}, {order.deliveryAddress?.city} {order.deliveryAddress?.zip}
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: "var(--card)", borderRadius: 18, padding: 18, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-faint)", marginBottom: 8, letterSpacing: "0.03em" }}>YOUR RIDER</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--leaf)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bike size={16} color="var(--paper)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "var(--forest-dark)", fontSize: 14 }}>
                {order.deliveryPerson?.name || "Assigned once picked up"}
              </div>
              {order.deliveryPerson?.phone && (
                <div style={{ fontSize: 12.5, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Phone size={11} /> {order.deliveryPerson.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="ticket" style={{ marginTop: 20, padding: "22px 18px 16px" }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Order summary</div>
        {order.items.map((it, i) => (
          <div key={i} className="ticket-row">
            <span>{it.quantity} × {it.name}</span>
            <span style={{ fontWeight: 700, color: "var(--leaf-deep)" }}>{currency(it.price * it.quantity)}</span>
          </div>
        ))}
        <hr className="ticket-divider" />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, color: "var(--forest-dark)" }}>
          <span>Total</span>
          <span className="mono">{currency(order.totalPrice)}</span>
        </div>
      </div>
    </main>
  );
}