import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Plus, Pencil, Trash2, X, ShieldCheck } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const currency = (n) => `₹${Number(n || 0).toFixed(0)}`;

const CATEGORIES = [
  "Breakfast & Tiffin",
  "Rice",
  "Kuzhambu & Curries",
  "Non-Veg Specials",
  "Snacks",
  "Sweets",
  "Beverages",
];

const ORDER_STATUSES = ["Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const emptyForm = {
  name: "",
  tamilName: "",
  description: "",
  price: "",
  category: CATEGORIES[0],
  image: "",
  calories: "",
  tags: "",
  isVeg: true,
  spiceLevel: "Mild",
  isAvailable: true,
};

export default function Admin() {
  const { user, token, loading: authLoading } = useAuth();
  const [tab, setTab] = useState("menu");

  if (authLoading) return null;
  if (!user) return <Navigate to="/login?next=/admin" replace />;
  if (user.role !== "admin") {
    return (
      <main className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 className="disp" style={{ fontSize: 24, color: "var(--forest-dark)" }}>Admins only</h2>
        <p style={{ color: "var(--ink-faint)", marginTop: 8 }}>
          This page is restricted to store admins. Ask an existing admin to promote your account if you manage this store.
        </p>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: "40px 24px 90px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ShieldCheck size={24} color="var(--forest)" />
        <h1 className="disp" style={{ fontSize: 30, fontWeight: 700, color: "var(--forest-dark)" }}>Admin dashboard</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", marginTop: 4, fontSize: 15 }}>Manage the Tamil Nadu menu and incoming orders.</p>

      <div style={{ display: "flex", gap: 8, marginTop: 24, marginBottom: 26 }}>
        {[
          ["menu", "Menu Items"],
          ["orders", "Orders"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="focus-ring"
            style={{
              padding: "9px 18px",
              borderRadius: 999,
              border: tab === id ? "1px solid var(--forest)" : "1px solid var(--border)",
              background: tab === id ? "var(--forest)" : "var(--card)",
              color: tab === id ? "var(--paper)" : "var(--ink-soft)",
              fontWeight: 700,
              fontSize: 13.5,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "menu" ? <MenuAdmin token={token} /> : <OrdersAdmin token={token} />}
    </main>
  );
}

function MenuAdmin({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .getMenu({})
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(emptyForm);
    setSaveError("");
    setEditing({});
  };

  const openEdit = (item) => {
    setForm({
      name: item.name || "",
      tamilName: item.tamilName || "",
      description: item.description || "",
      price: item.price ?? "",
      category: item.category || CATEGORIES[0],
      image: item.image || "",
      calories: item.calories ?? "",
      tags: (item.tags || []).join(", "),
      isVeg: item.isVeg ?? true,
      spiceLevel: item.spiceLevel || "Mild",
      isAvailable: item.isAvailable ?? true,
    });
    setSaveError("");
    setEditing(item);
  };

  const closeModal = () => setEditing(null);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      const payload = {
        name: form.name,
        tamilName: form.tamilName,
        description: form.description,
        price: Number(form.price) || 0,
        category: form.category,
        image: form.image,
        calories: Number(form.calories) || 0,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        isVeg: form.isVeg,
        spiceLevel: form.spiceLevel,
        isAvailable: form.isAvailable,
      };
      if (editing && editing._id) {
        await api.updateMenuItem(editing._id, payload, token);
      } else {
        await api.createMenuItem(payload, token);
      }
      closeModal();
      load();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.name}" from the menu?`)) return;
    try {
      await api.deleteMenuItem(item._id, token);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button
          onClick={openNew}
          className="focus-ring"
          style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--forest)", color: "#ffffff", border: "none", borderRadius: 999, padding: "10px 18px", fontWeight: 700, fontSize: 13.5 }}
        >
          <Plus size={15} /> Add dish
        </button>
      </div>

      {loading && <p style={{ color: "var(--ink-faint)" }}>Loading…</p>}
      {error && <p style={{ color: "var(--tomato)" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: "var(--bg)", textAlign: "left" }}>
                {["Dish", "Category", "Price", "Veg", "Available", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", color: "var(--ink-faint)", fontWeight: 700, fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ fontWeight: 700, color: "var(--ink)" }}>{item.name}</div>
                    {item.tamilName && <div style={{ color: "var(--ink-faint)", fontSize: 12 }}>{item.tamilName}</div>}
                  </td>
                  <td style={{ padding: "10px 14px", color: "var(--ink-soft)" }}>{item.category}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 700 }}>{currency(item.price)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ width: 10, height: 10, display: "inline-block", borderRadius: "50%", background: item.isVeg ? "var(--moss)" : "var(--chili)" }} />
                  </td>
                  <td style={{ padding: "10px 14px", color: item.isAvailable ? "var(--forest)" : "var(--tomato)", fontWeight: 700 }}>
                    {item.isAvailable ? "Yes" : "No"}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(item)} className="focus-ring" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 6, display: "flex" }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => remove(item)} className="focus-ring" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 6, display: "flex" }}>
                        <Trash2 size={14} color="var(--tomato)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }}>
          <form onSubmit={save} style={{ background: "var(--card)", borderRadius: 20, padding: 26, width: 520, maxWidth: "100%", maxHeight: "88vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 className="disp" style={{ fontSize: 20, fontWeight: 700, color: "var(--forest-dark)" }}>
                {editing._id ? "Edit dish" : "Add new dish"}
              </h2>
              <button type="button" onClick={closeModal} className="focus-ring" style={{ background: "none", border: "none" }}>
                <X size={18} />
              </button>
            </div>

            {form.image && (
              <img
                src={form.image}
                alt=""
                onError={(e) => (e.currentTarget.style.display = "none")}
                onLoad={(e) => (e.currentTarget.style.display = "block")}
                style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 12, marginBottom: 14, background: "var(--panel)" }}
              />
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <TextInput label="Dish name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <TextInput label="Tamil name (optional)" value={form.tamilName} onChange={(v) => setForm({ ...form, tamilName: v })} />
              <TextInput label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
              <TextInput label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="https://…" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <TextInput label="Price (₹)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" required />
                <TextInput label="Calories" value={form.calories} onChange={(v) => setForm({ ...form, calories: v })} type="number" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-soft)" }}>Category</span>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="focus-ring" style={selectStyle}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-soft)" }}>Spice level</span>
                  <select value={form.spiceLevel} onChange={(e) => setForm({ ...form, spiceLevel: e.target.value })} className="focus-ring" style={selectStyle}>
                    {["Mild", "Medium", "Spicy"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
              </div>

              <TextInput label="Tags (comma separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="Popular, Festive" />

              <div style={{ display: "flex", gap: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600 }}>
                  <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} /> Vegetarian
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600 }}>
                  <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} /> Available
                </label>
              </div>

              {saveError && <div style={{ color: "var(--tomato)", fontSize: 13.5 }}>{saveError}</div>}

              <button
                disabled={saving}
                className="focus-ring"
                style={{ background: saving ? "var(--steel)" : "var(--forest)", color: "#ffffff", border: "none", borderRadius: 999, padding: 13, fontWeight: 800, fontSize: 14.5, marginTop: 6 }}
              >
                {saving ? "Saving…" : editing._id ? "Save changes" : "Add dish"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function OrdersAdmin({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .getAllOrders(statusFilter ? { status: statusFilter } : {}, token)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  const changeStatus = async (order, status) => {
    setBusyId(order._id);
    try {
      await api.updateOrderStatus(order._id, { status }, token);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <FilterChip active={statusFilter === ""} onClick={() => setStatusFilter("")}>All</FilterChip>
        {ORDER_STATUSES.map((s) => (
          <FilterChip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>{s}</FilterChip>
        ))}
      </div>

      {loading && <p style={{ color: "var(--ink-faint)" }}>Loading…</p>}
      {error && <p style={{ color: "var(--tomato)" }}>{error}</p>}
      {!loading && !error && orders.length === 0 && <p style={{ color: "var(--ink-faint)" }}>No orders here yet.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {orders.map((order) => (
          <div key={order._id} style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{order.user?.name || "Customer"} · {order.user?.phone || order.deliveryAddress?.phone}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>
                  {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 2 }}>
                  {order.deliveryAddress?.street}, {order.deliveryAddress?.city} — Cash on Delivery
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontWeight: 800 }}>{currency(order.totalPrice)}</div>
                <select
                  value={order.status}
                  disabled={busyId === order._id}
                  onChange={(e) => changeStatus(order, e.target.value)}
                  className="focus-ring"
                  style={{ ...selectStyle, marginTop: 6, fontSize: 12.5, padding: "6px 10px" }}
                >
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const selectStyle = { border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 14, background: "var(--bg)" };

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="focus-ring"
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        border: active ? "1px solid var(--forest)" : "1px solid var(--border)",
        background: active ? "var(--forest)" : "var(--card)",
        color: active ? "var(--paper)" : "var(--ink-soft)",
        fontWeight: 700,
        fontSize: 12.5,
      }}
    >
      {children}
    </button>
  );
}

function TextInput({ label, value, onChange, placeholder, type = "text", required, textarea }) {
  const Comp = textarea ? "textarea" : "input";
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-soft)" }}>{label}</span>
      <Comp
        type={textarea ? undefined : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={textarea ? 3 : undefined}
        className="focus-ring"
        style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "11px 14px", fontSize: 14.5, background: "var(--bg)", fontFamily: "inherit", resize: textarea ? "vertical" : undefined }}
      />
    </label>
  );
}
