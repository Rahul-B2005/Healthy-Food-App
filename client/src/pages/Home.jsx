import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, ArrowRight, Star, Clock, ChevronRight, Flame } from "lucide-react";
import DishArt from "../components/DishArt";
import ThaliOrbit from "../components/ThaliOrbit";
import Tilt3D from "../components/Tilt3D";
import { api } from "../api/client";

const currency = (n) => `₹${n.toFixed(0)}`;

const QUICK_CATEGORIES = [
  { label: "Breakfast & Tiffin", tag: "Breakfast & Tiffin" },
  { label: "Rice", tag: "Rice" },
  { label: "Kuzhambu & Curries", tag: "Kuzhambu & Curries" },
  { label: "Non-Veg Specials", tag: "Non-Veg Specials" },
  { label: "Sweets", tag: "Sweets" },
];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=2000&auto=format&fit=crop";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getMenu()
      .then((items) => setFeatured(items.slice(0, 6)))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main>

      {/* Modern animated 3D hero banner */}
      <section className="hf-hero-3d">
        <div className="hf-hero-bg-shape hf-shape-a" />
        <div className="hf-hero-bg-shape hf-shape-b" />
        <div className="hf-hero-content">
          <div className="hf-hero-copy">
            <span className="hf-hero-eyebrow">FRESH • HEALTHY • DELIVERED</span>
            <h1>Good food.<br /><em>Better days.</em></h1>
            <p>Wholesome meals, vibrant ingredients and fresh flavors delivered straight to your door.</p>
            <div className="hf-hero-actions">
              <a href="/menu" className="hf-hero-primary">Explore Menu <span>↗</span></a>
              <span className="hf-hero-note">Fresh ingredients · Every day</span>
            </div>
          </div>

          <div className="hf-hero-scene" aria-hidden="true">
            <div className="hf-orbit hf-orbit-1" />
            <div className="hf-orbit hf-orbit-2" />
            <div className="hf-orbit hf-orbit-3" />

            <div className="hf-plate">
              <div className="hf-plate-inner">
                <div className="hf-food-leaf leaf-1" />
                <div className="hf-food-leaf leaf-2" />
                <div className="hf-food-leaf leaf-3" />
                <div className="hf-food-tomato tomato-1" />
                <div className="hf-food-tomato tomato-2" />
                <div className="hf-food-avocado avocado-1" />
                <div className="hf-food-grain grain-1" />
                <div className="hf-food-grain grain-2" />
                <div className="hf-food-sauce" />
              </div>
            </div>

            <div className="hf-floating-card hf-card-1">
              <span className="hf-card-icon">🥗</span>
              <span><b>Fresh Bowl</b><small>Chef selected</small></span>
            </div>
            <div className="hf-floating-card hf-card-2">
              <span className="hf-card-icon">⚡</span>
              <span><b>Fast Delivery</b><small>At your doorstep</small></span>
            </div>
            <div className="hf-floating-dot hf-dot-1">✦</div>
            <div className="hf-floating-dot hf-dot-2">✿</div>
          </div>
        </div>
      </section>


      {/* ---- Photography-led hero ---- */}
      <section
        style={{
          position: "relative",
          minHeight: 560,
          display: "flex",
          alignItems: "center",
          backgroundImage: `linear-gradient(100deg, var(--night) 32%, rgba(76,29,149,0.62) 62%, rgba(76,29,149,0.28)), url(${HERO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container" style={{ padding: "70px 24px 60px", width: "100%" }}>
          <div style={{ maxWidth: 560 }}>
            <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 18 }}>
              <MapPin size={13} color="var(--turmeric)" /> Tamil Nadu, table to doorstep
            </div>
            <h1 className="disp" style={{ fontSize: "clamp(34px, 4.6vw, 54px)", lineHeight: 1.08, color: "var(--leaf-deep)", fontWeight: 600, margin: 0 }}>
              Chettinad on a plate,
              <br />
              <em className="disp-i" style={{ color: "var(--leaf)", fontWeight: 500 }}>tracked to your door</em>
            </h1>
            <p style={{ marginTop: 18, fontSize: 16, color: "var(--ink-soft)", maxWidth: 460, lineHeight: 1.6 }}>
              Slow-cooked kuzhambu, tiffin fired fresh, and biryani worth waiting for — from
              Tamil Nadu's finest home kitchens, plated properly and followed every step of the way.
            </p>

            <div
              style={{
                maxWidth: 480,
                marginTop: 30,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "5px 5px 5px 18px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 20px 44px rgba(0,0,0,0.45)",
              }}
            >
              <Search size={17} color="var(--ink-faint)" />
              <input
                placeholder="Search for dosa, sambar, biryani…"
                style={{ flex: 1, border: "none", outline: "none", fontSize: 15, padding: "12px 0", color: "var(--ink)", background: "transparent" }}
                readOnly
              />
              <Link
                to="/menu"
                className="focus-ring"
                style={{ background: "var(--leaf)", color: "#ffffff", border: "none", borderRadius: 6, padding: "12px 22px", fontSize: 13.5, fontWeight: 700, letterSpacing: "0.02em", whiteSpace: "nowrap" }}
              >
                Browse menu
              </Link>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
              {QUICK_CATEGORIES.map((c) => (
                <Link
                  key={c.tag}
                  to="/menu"
                  className="focus-ring"
                  style={{
                    border: "1px solid var(--border-dark)",
                    color: "var(--ink)",
                    borderRadius: 999,
                    padding: "7px 15px",
                    fontSize: 13,
                    fontWeight: 600,
                    background: "rgba(76,29,149,0.10)",
                  }}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", right: "6%", top: "50%", transform: "translateY(-50%)", display: window.innerWidth > 900 ? "block" : "none" }}>
          <ThaliOrbit size={220} />
        </div>
      </section>

      {/* ---- Stat strip, styled as a printed ticket ---- */}
      <section className="container" style={{ padding: "0 24px", marginTop: -34, position: "relative", zIndex: 2 }}>
        <div className="ticket" style={{ display: "flex", padding: "22px 30px 18px", boxShadow: "0 18px 36px rgba(0,0,0,0.35)" }}>
          <Stat value="4.9" label="Average rating" icon={<Star size={16} color="var(--turmeric)" fill="var(--turmeric)" />} />
          <Divider />
          <Stat value="27 min" label="Avg. delivery time" icon={<Clock size={16} color="var(--chili)" />} />
          <Divider />
          <Stat value="2,300+" label="Orders this month" icon={<ArrowRight size={16} color="var(--moss)" />} />
        </div>
      </section>

      {/* ---- Featured dishes grid, restaurant-card style ---- */}
      <section className="container" style={{ padding: "56px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>From the kitchen</div>
            <h2 className="disp" style={{ fontSize: 26, color: "var(--leaf-deep)", fontWeight: 600, margin: 0 }}>
              Popular right now
            </h2>
          </div>
          <Link to="/menu" className="focus-ring" style={{ color: "var(--leaf)", fontWeight: 700, fontSize: 14, display: "flex", gap: 4, alignItems: "center" }}>
            See full menu <ChevronRight size={15} />
          </Link>
        </div>

        {error && (
          <div style={{ background: "var(--panel)", border: "1px solid var(--border)", color: "var(--chili)", borderRadius: 10, padding: 16, fontSize: 14 }}>
            Couldn't load the menu ({error}). Make sure the backend API is running and seeded.
          </div>
        )}

        {!error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {featured.map((item, idx) => (
              <Tilt3D key={item._id}>
              <div
                className="dish-card"
                style={{
                  background: "var(--card)",
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                <div style={{ position: "relative" }}>
                  <DishArt seed={idx} image={item.image} />
                  <div
                    className="mono"
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "rgba(46,16,101,0.88)",
                      color: "var(--turmeric)",
                      borderRadius: 6,
                      padding: "3px 7px",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Star size={11} fill="var(--turmeric)" /> 4.{3 + (idx % 6)}
                  </div>
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {item.tags?.[0] && (
                      <span style={{ fontSize: 10.5, fontWeight: 800, color: "var(--turmeric)", letterSpacing: "0.04em" }}>
                        {item.tags[0].toUpperCase()}
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: "var(--ink-faint)", display: "flex", alignItems: "center", gap: 3 }}>
                      <Flame size={11} /> {item.calories} kcal
                    </span>
                  </div>
                  <div className="disp" style={{ fontSize: 15.5, fontWeight: 600, color: "var(--leaf-deep)", marginTop: 5 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 3, minHeight: 32 }}>{item.description}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                    <span className="mono" style={{ fontWeight: 700, color: "var(--leaf)", fontSize: 15 }}>{currency(item.price)}</span>
                    <span style={{ fontSize: 12, color: "var(--ink-faint)", fontWeight: 600 }}>25–30 min</span>
                  </div>
                </div>
              </div>
              </Tilt3D>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Divider() {
  return <div style={{ width: 1, background: "var(--border)", margin: "0 26px" }} />;
}

function Stat({ value, label, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {icon}
      <div style={{ textAlign: "left" }}>
        <div className="mono" style={{ fontSize: 15, color: "var(--leaf-deep)" }}>{value}</div>
        <div style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{label}</div>
      </div>
    </div>
  );
}
