import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut, Sun, Moon, Menu as MenuIcon, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Header({ onCartClick }) {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="hf-header">
      <div className="container hf-header-inner">
        <Link to="/" className="focus-ring hf-logo" onClick={closeMenu}>
          <span className="hf-logo-mark"><TiffinMark /></span>
          <span className="disp hf-logo-text">Healthy<span className="disp-i">Food</span></span>
        </Link>

        <button
          type="button"
          className="focus-ring hf-mobile-menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={21} /> : <MenuIcon size={21} />}
        </button>

        <nav className={`hf-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <NavLink to="/menu" onClick={closeMenu}>Menu</NavLink>
          <NavLink to="/orders" onClick={closeMenu}>Track Order</NavLink>
          {user?.role === "admin" && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}

          {user ? (
            <button
              type="button"
              onClick={() => { logout(); closeMenu(); navigate("/"); }}
              className="focus-ring hf-user-btn"
              title="Log out"
            >
              <User size={15} /> {user.name.split(" ")[0]} <LogOut size={13} />
            </button>
          ) : (
            <NavLink to="/login" onClick={closeMenu}>Log in</NavLink>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="focus-ring hf-icon-btn"
            title={theme === "light" ? "Switch to Dark theme" : "Switch to Light theme"}
            aria-label={theme === "light" ? "Switch to Dark theme" : "Switch to Light theme"}
          >
            {theme === "light" ? <Moon size={16} color="var(--leaf)" /> : <Sun size={16} color="var(--turmeric)" />}
          </button>

          <button type="button" onClick={onCartClick} className="focus-ring hf-icon-btn" aria-label="Open cart">
            <ShoppingBag size={17} color="var(--leaf)" />
            {count > 0 && <span className="hf-cart-count">{count}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}

function TiffinMark() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4c-4.4 0-7.6 3-7.6 6.9 0 3.2 2.4 5.9 5.5 5.9 0 0-1.5-2.1-.2-4 1.3-2-.7-3.7.9-6C11.3 5.9 12 4 12 4Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 4c0 0 .7 1.9-.9 4.8-1.6 2.3.4 4-.9 6-1.3 1.9.2 4 .2 4" stroke="var(--chili)" strokeWidth="1" opacity=".7"/>
      <path d="M15.5 8.5q1-1.6-.4-3.6" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity=".7"/>
    </svg>
  );
}

function NavLink({ to, children, onClick }) {
  return (
    <Link to={to} className="focus-ring hf-nav-link" onClick={onClick}>{children}</Link>
  );
}
