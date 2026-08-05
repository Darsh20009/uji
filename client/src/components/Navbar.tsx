import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useAuthModal } from "../context/AuthModalContext";
import { useLang } from "../context/LanguageContext";
import { t } from "../lib/translations";
import { ShoppingBag, Search, AlignJustify, X, User } from "lucide-react";

export default function Navbar() {
  const { items } = useCart();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const { lang, setLang, isRTL } = useLang();
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

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

  const navLinks = [
    { href: "/products", label: t("nav.products", lang) },
    { href: "/about",    label: t("nav.about", lang)    },
    { href: "/ritual",   label: t("nav.ritual", lang)   },
    { href: "/magazine", label: t("nav.magazine", lang) },
  ];

  const menuItems = [
    { href: "/",         arLabel: "الرئيسية", enLabel: "Home"      },
    { href: "/products", arLabel: "المنتجات", enLabel: "Shop"      },
    { href: "/about",    arLabel: "قصتنا",    enLabel: "Our Story" },
    { href: "/ritual",   arLabel: "الريتشوال",enLabel: "Ritual"    },
    { href: "/magazine", arLabel: "المجلة",   enLabel: "Journal"   },
    { href: "/cart",     arLabel: "السلة",    enLabel: "Cart"      },
    ...(user
      ? [{ href: "/profile", arLabel: "حسابي", enLabel: "Account" }]
      : [{ href: null as any, arLabel: "تسجيل الدخول", enLabel: "Login" }]
    ),
  ];

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
          direction: isRTL ? "rtl" : "ltr",
        }}>
          {/* Right (RTL) / Left (LTR): menu + links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: "0.5rem", color: textColor, cursor: "pointer", transition: "color 0.3s" }}
              aria-label={t("nav.menu", lang)}
            >
              <AlignJustify size={18} strokeWidth={1.5} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }} className="desktop-nav">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  color: textColor, fontSize: "0.75rem", fontFamily: "'Mirza', serif",
                  letterSpacing: "0.04em", fontWeight: 400, opacity: 0.85, transition: "opacity 0.2s",
                }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center: Logo */}
          <Link href="/" style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{
              fontFamily: "'Cascadia Code', monospace",
              fontSize: scrolled ? "1.5rem" : "1.85rem",
              fontWeight: 400, letterSpacing: "0.22em",
              color: transparent ? "#F2EADB" : "#1C201B",
              lineHeight: 1, transition: "font-size 0.3s ease, color 0.3s ease",
            }}>UJI</span>
            <span style={{
              fontFamily: "'Cascadia Code', monospace", fontSize: "0.45rem",
              letterSpacing: "0.35em", color: transparent ? "rgba(242,234,219,0.55)" : "rgba(28,32,27,0.45)",
              textTransform: "uppercase", transition: "color 0.3s ease",
            }}>MATCHA</span>
          </Link>

          {/* Left (RTL) / Right (LTR): icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", justifyContent: "flex-end" }}>
            <button
              style={{ background: "none", border: "none", padding: 4, color: textColor, transition: "color 0.3s", display: "flex", alignItems: "center" }}
              aria-label={t("nav.search", lang)}
            >
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
                  fontSize: 9, fontFamily: "'Cascadia Code', monospace", fontWeight: 500,
                }}>{cartCount}</span>
              )}
            </Link>

            {user ? (
              <Link href="/profile" style={{ color: textColor, display: "flex", alignItems: "center", padding: 4, transition: "color 0.3s", position: "relative" }}>
                <User size={17} strokeWidth={1.5} />
                <span style={{
                  position: "absolute", bottom: 2, right: 2,
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#78933C", border: "1.5px solid",
                  borderColor: transparent ? "#1C281A" : "#F2EADB",
                }} />
              </Link>
            ) : (
              <button
                onClick={() => openAuth("login")}
                style={{ background: "none", border: "none", padding: 4, color: textColor, cursor: "pointer", display: "flex", alignItems: "center", transition: "color 0.3s" }}
                aria-label={t("nav.login", lang)}
              >
                <User size={17} strokeWidth={1.5} />
              </button>
            )}

            {/* ── Language toggle ── */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
              style={{
                background: "none", border: `1px solid ${transparent ? "rgba(242,234,219,0.3)" : "rgba(28,32,27,0.2)"}`,
                borderRadius: 3, padding: "0.2rem 0.45rem",
                color: textColor, fontSize: "0.6rem",
                fontFamily: "'Cascadia Code', monospace", letterSpacing: "0.1em",
                cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: "0.25rem",
              }}
            >
              <span style={{ opacity: lang === "ar" ? 1 : 0.4 }}>AR</span>
              <span style={{ opacity: 0.35 }}>/</span>
              <span style={{ opacity: lang === "en" ? 1 : 0.4 }}>EN</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile / fullscreen menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1100,
          background: "#16281D",
          display: "flex", flexDirection: "column",
          padding: "2rem",
          direction: isRTL ? "rtl" : "ltr",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }}>
            <img src="/assets/brand/uji-logo-white-transparent.png" alt="UJI" style={{ height: 48, objectFit: "contain" }} />
            <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: "#F2EADB", cursor: "pointer" }}>
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {menuItems.map(({ href, arLabel, enLabel }) => {
              const primaryLabel = lang === "ar" ? arLabel : enLabel;
              const secondaryLabel = lang === "ar" ? enLabel : arLabel;
              return href ? (
                <Link
                  key={href} href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}
                >
                  <span style={{ fontFamily: "'Cascadia Code', monospace", fontSize: "2.5rem", fontWeight: 300, color: "#F2EADB", lineHeight: 1 }}>{primaryLabel}</span>
                  <span style={{ fontFamily: "'Cascadia Code', monospace", fontSize: "0.7rem", letterSpacing: "0.18em", color: "#9BA17B", textTransform: "uppercase" }}>{secondaryLabel}</span>
                </Link>
              ) : (
                <button
                  key={arLabel}
                  onClick={() => { setMenuOpen(false); openAuth("login"); }}
                  style={{ background: "none", border: "none", display: "flex", alignItems: "baseline", gap: "1rem", cursor: "pointer", padding: 0 }}
                >
                  <span style={{ fontFamily: "'Cascadia Code', monospace", fontSize: "2.5rem", fontWeight: 300, color: "#F2EADB", lineHeight: 1 }}>{primaryLabel}</span>
                  <span style={{ fontFamily: "'Cascadia Code', monospace", fontSize: "0.7rem", letterSpacing: "0.18em", color: "#9BA17B", textTransform: "uppercase" }}>{secondaryLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Language switcher inside menu */}
          <div style={{ marginTop: "3rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            {(["ar", "en"] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? "rgba(155,161,123,0.2)" : "none",
                  border: `1px solid ${lang === l ? "#9BA17B" : "rgba(155,161,123,0.3)"}`,
                  borderRadius: 3, padding: "0.4rem 1rem",
                  color: lang === l ? "#9BA17B" : "rgba(155,161,123,0.5)",
                  fontFamily: "'Cascadia Code', monospace", fontSize: "0.7rem",
                  letterSpacing: "0.15em", cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {l === "ar" ? "عربي" : "English"}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "auto", paddingTop: "3rem", borderTop: "1px solid rgba(155,161,123,0.2)" }}>
            <p style={{ color: "#9BA17B", fontSize: "0.7rem", fontFamily: "'Cascadia Code', monospace", letterSpacing: "0.15em" }}>CEREMONIAL JAPANESE MATCHA</p>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
      `}</style>
    </>
  );
}
