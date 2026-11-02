import React, { useEffect, useState } from "react";
import { Plus, Minus, Flame, Search, X, Leaf, Coffee, Soup, Sandwich, Drumstick, Candy, IceCreamCone } from "lucide-react";
import DishArt from "../components/DishArt";
import Tilt3D from "../components/Tilt3D";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";

const currency = (n) => `₹${n.toFixed(0)}`;

const CATEGORIES = [
  { id: "All", label: "All Items", icon: Leaf },
  { id: "Breakfast & Tiffin", label: "Breakfast & Tiffin", icon: Sandwich },
  { id: "Rice", label: "Rice", icon: Soup },
  { id: "Kuzhambu & Curries", label: "Kuzhambu & Curries", icon: Soup },
  { id: "Non-Veg Specials", label: "Non-Veg Specials", icon: Drumstick },
  { id: "Snacks", label: "Snacks", icon: Candy },
  { id: "Sweets", label: "Sweets", icon: IceCreamCone },
  { id: "Beverages", label: "Beverages", icon: Coffee },
];

export default function Menu() {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { items: cart, add, remove } = useCart();

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = {};
    if (activeCat !== "All") params.category = activeCat;
    if (search.trim()) params.search = search.trim();

    // Small debounce so we don't fire a request on every keystroke.
    const handle = setTimeout(() => {
      api
        .getMenu(params)
        .then(setItems)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(handle);
  }, [activeCat, search]);

  return (
    <main className="container" style={{ padding: "44px 24px 80px" }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>The full spread</div>
      <h1 className="disp" style={{ fontSize: 34, fontWeight: 600, color: "var(--forest-dark)" }}>
        Tamil Nadu Menu
      </h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 4, fontSize: 15 }}>
        50 authentic dishes, cooked fresh — from tiffin to Chettinad specials.
      </p>

      <div
        className="focus-ring"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 24,
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 999,
          padding: "10px 16px",
          maxWidth: 420,
        }}
      >
        <Search size={16} color="var(--ink-faint)" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dishes, e.g. dosa, sambar, biryani…"
          style={{ border: "none", outline: "none", fontSize: 14.5, flex: 1, background: "transparent" }}
        />
        {search && (
          <button onClick={() => setSearch("")} className="focus-ring" style={{ background: "none", border: "none", display: "flex" }}>
            <X size={15} color="var(--ink-faint)" />
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 22, marginBottom: 30, flexWrap: "wrap" }}>
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const active = activeCat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className="focus-ring"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 999,
                border: active ? "1px solid var(--forest)" : "1px solid var(--border)",
                background: active ? "var(--forest)" : "var(--card)",
                color: active ? "var(--paper)" : "var(--ink-soft)",
                fontWeight: 700,
                fontSize: 13.5,
              }}
            >
              <Icon size={15} /> {c.label}
            </button>
          );
        })}
      </div>

      {loading && <div style={{ color: "var(--ink-faint)" }}>Loading menu…</div>}

      {error && (
        <div style={{ background: "var(--panel)", border: "1px solid var(--border)", color: "var(--tomato)", borderRadius: 14, padding: 16, fontSize: 14 }}>
          Couldn't load the menu ({error}). Make sure the backend API is running on the URL set in
          <code> VITE_API_URL</code> and that <code>npm run seed</code> has been run.
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div style={{ color: "var(--ink-faint)" }}>No dishes match "{search}".</div>
      )}

      {!loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {items.map((item, idx) => {
            const qty = cart[item._id]?.qty || 0;
            return (
              <Tilt3D key={item._id}>
              <div className="dish-card" style={{ background: "var(--card)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ position: "relative" }}>
                  <DishArt seed={idx} image={item.image} />
                  <div
                    title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      width: 18,
                      height: 18,
                      borderRadius: 3,
                      border: `2px solid ${item.isVeg ? "var(--moss)" : "var(--chili)"}`,
                      background: "var(--card)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.isVeg ? "var(--moss)" : "var(--chili)" }} />
                  </div>
                  {item.tamilName && (
                    <div
                      className="mono"
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "rgba(28,28,28,0.72)",
                        color: "var(--turmeric)",
                        borderRadius: 6,
                        padding: "3px 7px",
                        fontSize: 12,
                      }}
                    >
                      {item.tamilName}
                    </div>
                  )}
                </div>
                <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {item.tags?.[0] && (
                    <span style={{ fontSize: 11, fontWeight: 800, color: "var(--turmeric)", letterSpacing: "0.04em" }}>
                      {item.tags[0].toUpperCase()}
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: "var(--ink-faint)", display: "flex", alignItems: "center", gap: 3 }}>
                    <Flame size={11} /> {item.calories} kcal
                  </span>
                  {item.spiceLevel && item.spiceLevel !== "Mild" && (
                    <span style={{ fontSize: 11, color: "var(--chili)", fontWeight: 700 }}>
                      {"🌶".repeat(item.spiceLevel === "Spicy" ? 2 : 1)} {item.spiceLevel}
                    </span>
                  )}
                </div>
                <div className="disp" style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginTop: 6 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 4, flex: 1 }}>{item.description}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                  <span className="mono" style={{ fontWeight: 700, color: "var(--ink)", fontSize: 16 }}>{currency(item.price)}</span>
                  {qty === 0 ? (
                    <button
                      onClick={() => add(item)}
                      className="focus-ring"
                      style={{ background: "var(--forest)", color: "#ffffff", border: "none", borderRadius: 999, padding: "9px 16px", fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Plus size={14} /> Add
                    </button>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg)", borderRadius: 999, padding: "4px 6px" }}>
                      <button onClick={() => remove(item._id)} className="focus-ring" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Minus size={13} color="var(--forest)" />
                      </button>
                      <span style={{ fontWeight: 800, minWidth: 14, textAlign: "center" }}>{qty}</span>
                      <button onClick={() => add(item)} className="focus-ring" style={{ background: "var(--forest)", border: "none", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Plus size={13} color="var(--paper)" />
                      </button>
                    </div>
                  )}
                </div>
                </div>
              </div>
              </Tilt3D>
            );
          })}
        </div>
      )}
    </main>
  );
}
