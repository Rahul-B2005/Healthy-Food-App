import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import MyOrders from "./pages/MyOrders";
import Admin from "./pages/Admin";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/orders/:orderId" element={<OrderTracking />} />
        <Route path="/admin" element={<Admin />} />

        {/* Backward compatibility for links created during the portfolio version. */}
        <Route path="/food" element={<Navigate to="/" replace />} />
        <Route path="/food/menu" element={<Navigate to="/menu" replace />} />
        <Route path="/food/login" element={<Navigate to="/login" replace />} />
        <Route path="/food/register" element={<Navigate to="/register" replace />} />
        <Route path="/food/checkout" element={<Navigate to="/checkout" replace />} />
        <Route path="/food/orders" element={<Navigate to="/orders" replace />} />
        <Route path="/food/admin" element={<Navigate to="/admin" replace />} />
      </Routes>

      <FoodFooter />

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}

function FoodFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: 20, background: "var(--night)" }}>
      <div
        className="container"
        style={{
          padding: "30px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ color: "var(--leaf-deep)", fontWeight: 600, fontSize: 15 }}>
          Healthy Food
        </div>
        <div className="eyebrow" style={{ color: "var(--ink-faint)" }}>
          © {new Date().getFullYear()} · Fresh, tracked, delivered
        </div>
      </div>
    </footer>
  );
}
