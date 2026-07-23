import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useAuthModal } from "../context/AuthModalContext";
import { ShoppingBag, Search, AlignJustify, X, User } from "lucide-react";

export default function Navbar() {
  const { items } = useCart();
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  // Detect if we're on the homepage (transparent header)
  const isHome = location === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;
  const textColor = transparent ? "rgba(242,234,219,0.95)" : "#1C201B";
  const logoSrc = transparent
    ? "/assets/brand/uji-logo-white-transparent.png"
    : "/assets/brand/uji-logo-charcoal-transparent.png";

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          background: transparent ? "transparent" : "rgba(242, 234, 219, 0.92)",
          backdropFilter: transparent ? "none" : "blur(12px)",
          borderBottom: transparent ? "none" : "1px solid rgba(200,187,164,0.35)",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
          padding: "0 2rem",
        }}
      >
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          height: scrolled ? 64 : 80,
          transition: "height 0.3s ease",
          direction: "rtl",
        }}>
          {/* Right side: menu toggle + nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none", border: "none", padding: 0,
                display: "flex", alignItems: "center", gap: "0.5rem",
                color: textColor, cursor: "pointer",
                transition: "color 0.3s",
              }}
              aria-label="القائمة"
            >
              <AlignJustify size={18} strokeWidth={1.5} />
            </button>

            {/* Desktop nav links */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }} className="desktop-nav">
              {[
                { href: "/products", label: "المنتجات" },
                { href: "/about", label: "قصتنا" },
                { href: "/ritual", label: "الريتشوال" },
                { href: "/magazine", label: "المجلة" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  color: textColor, fontSize: "0.75rem",
                  fontFamily: "'Cairo', sans-serif",
                  letterSpacing: "0.04em", fontWeight: 400,
                  opacity: 0.85, transition: "opacity 0.2s",
                }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center: Logo */}
          <Link href="/" style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: scrolled ? "1.5rem" : "1.85rem",
              fontWeight: 400, letterSpacing: "0.22em",
              color: transparent ? "#F2EADB" : "#1C201B",
              lineHeight: 1,
              transition: "font-size 0.3s ease, color 0.3s ease",
            }}>UJI</span>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.45rem", letterSpacing: "0.35em",
              color: transparent ? "rgba(242,234,219,0.55)" : "rgba(28,32,27,0.45)",
              textTransform: "uppercase",
              transition: "color 0.3s ease",
            }}>MATCHA</span>
          </Link>

          {/* Left side: icons + lang */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", justifyContent: "flex-end" }}>
            <button style={{ background: "none", border: "none", padding: 4, color: textColor, transition: "color 0.3s", display: "flex", alignItems: "center" }} aria-label="بحث">
              <Search size={17} strokeWidth={1.5} />
            </button>

            <Link href="/cart" style={{ position: "relative", color: textColor, display: "flex", alignItems: "center", padding: 4, transition: "color 0.3s" }}>
              <ShoppingBag size={17} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -2, right: -2,
                  background: "#78933C", color: "#F2EADB",
                  borderRadius: "50%", width: 16, height: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontFamily: "'Inter',sans-serif", fontWeight: 500,
                }}>{cartCount}</span>
              )}
            </Link>

            {/* Language toggle (decorative for now) */}
            <span style={{
              color: textColor, fontSize: "0.65rem",
              fontFamily: "'Inter',sans-serif",
              letterSpacing: "0.12em", opacity: 0.5,
            }}>
              AR/EN
            </span>

            {/* Account button — opens auth modal */}
            <button
              onClick={() => openAuth(user ? "login" : "login")}
              aria-label="حسابي"
              style={{
                background: "none", border: "none", padding: 4,
                cursor: "pointer", color: textColor,
                display: "flex", alignItems: "center", gap: 6,
                transition: "color 0.3s",
              }}
            >
              <User size={17} strokeWidth={1.5} />
              {user && (
                <span style={{
                  fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                  fontSize: "0.68rem", opacity: 0.8,
                  maxWidth: 80, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {(user as any).name?.split(" ")[0]}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile / fullscreen menu overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1100,
          background: "#16281D",
          display: "flex", flexDirection: "column",
          padding: "2rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }}>
            <img src="/assets/brand/uji-logo-white-transparent.png" alt="UJI" style={{ height: 48, objectFit: "contain" }} />
            <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: "#F2EADB", cursor: "pointer" }}>
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {[
              { href: "/", label: "الرئيسية", en: "Home" },
              { href: "/products", label: "المنتجات", en: "Shop" },
              { href: "/about", label: "قصتنا", en: "Our Story" },
              { href: "/ritual", label: "الريتشوال", en: "Ritual" },
              { href: "/magazine", label: "المجلة", en: "Journal" },
              { href: "/cart", label: "السلة", en: "Cart" },
            ].map(({ href, label, en }) => (
              <Link
                key={href} href={href}
                onClick={() => setMenuOpen(false)}
                style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}
              >
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2.5rem", fontWeight: 300,
                  color: "#F2EADB", lineHeight: 1,
                }}>{label}</span>
                <span style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "0.7rem", letterSpacing: "0.18em",
                  color: "#9BA17B", textTransform: "uppercase",
                }}>{en}</span>
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: "auto", paddingTop: "3rem", borderTop: "1px solid rgba(155,161,123,0.2)" }}>
            <p style={{ color: "#9BA17B", fontSize: "0.7rem", fontFamily: "'Inter',sans-serif", letterSpacing: "0.15em" }}>CEREMONIAL JAPANESE MATCHA</p>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
      `}</style>
    </>
  );
}
