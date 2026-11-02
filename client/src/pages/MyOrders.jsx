import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Sprout, ChevronRight } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
  const { token, user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    api
      .getMyOrders(token)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (authLoading) return null;

  if (!user) {
    return <Navigate to="/login?next=/orders" replace />;
  }

  return (
    <main
      className="container"
      style={{
        padding: "48px 24px 90px",
        maxWidth: 720,
      }}
    >
      <h1
        className="disp"
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: "var(--forest-dark)",
        }}
      >
        Your orders
      </h1>

      {/* Loading */}
      {loading && (
        <p
          style={{
            color: "var(--ink-faint)",
            marginTop: 20,
          }}
        >
          Loading…
        </p>
      )}

      {/* Error */}
      {error && (
        <p
          style={{
            color: "var(--tomato)",
            marginTop: 20,
          }}
        >
          {error}
        </p>
      )}

      {/* No Orders */}
      {!loading && !error && orders.length === 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: 60,
            color: "var(--ink-faint)",
          }}
        >
          <Sprout
            size={30}
            style={{
              marginBottom: 10,
              opacity: 0.5,
            }}
          />

          <div>
            No orders yet — place one from the menu to see it tracked here.
          </div>

          <Link
            to="/menu"
            style={{
              color: "var(--forest)",
              fontWeight: 700,
              display: "inline-block",
              marginTop: 10,
            }}
          >
            Go to menu
          </Link>
        </div>
      )}

      {/* Orders List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 24,
        }}
      >
        {orders.map((o) => (
          <Link
            key={o._id}
            to={`/orders/${o._id}`}
            className="focus-ring"
            style={{
              background: "var(--card)",
              borderRadius: 16,
              padding: 18,
              border: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              {/* Order Number */}
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--forest-dark)",
                  fontSize: 14.5,
                }}
              >
                Order #{o._id.slice(-6).toUpperCase()}
              </div>

              {/* Order Details */}
              <div
                style={{
                  fontSize: 13,
                  color: "var(--ink-faint)",
                  marginTop: 3,
                }}
              >
                {o.items.length} item
                {o.items.length > 1 ? "s" : ""} ·{" "}
                
                {/* Indian Rupees */}
                ₹{Number(o.totalPrice || 0).toFixed(2)}
              </div>
            </div>

            {/* Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <StatusPill status={o.status} />

              <ChevronRight
                size={16}
                color="var(--ink-faint)"
              />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

/* =========================
   STATUS PILL
========================= */

function StatusPill({ status }) {
  const colors = {
    Placed: [
      "rgba(198,161,91,0.14)",
      "var(--forest)",
    ],

    Confirmed: [
      "rgba(198,161,91,0.14)",
      "var(--forest)",
    ],

    Preparing: [
      "rgba(224,181,100,0.16)",
      "var(--turmeric)",
    ],

    "Out for Delivery": [
      "rgba(224,181,100,0.16)",
      "var(--turmeric)",
    ],

    Delivered: [
      "rgba(143,160,107,0.18)",
      "var(--moss)",
    ],

    Cancelled: [
      "rgba(166,52,70,0.16)",
      "var(--tomato)",
    ],
  };

  const [bg, fg] =
    colors[status] || [
      "var(--panel)",
      "var(--ink-soft)",
    ];

  return (
    <span
      style={{
        background: bg,
        color: fg,
        fontSize: 12,
        fontWeight: 700,
        padding: "5px 10px",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}