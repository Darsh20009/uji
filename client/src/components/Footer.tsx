import { Link } from "wouter";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "#16281D", color: "#F2EADB", position: "relative", overflow: "hidden" }}>
      {/* Big watermark wordmark */}
      <div style={{
        position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)",
        fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(8rem,18vw,16rem)",
        fontWeight: 300, letterSpacing: "0.15em", color: "rgba(31,57,41,0.8)",
        whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none",
        lineHeight: 1,
      }}>
        UJI
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Top section */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "3rem", padding: "6rem 0 4rem",
          borderBottom: "1px solid rgba(155,161,123,0.2)",
        }}>
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <img
              src="/assets/brand/uji-logo-forest-green-transparent.png"
              alt="UJI MATCHA"
              style={{ height: 56, objectFit: "contain", objectPosition: "right" }}
            />
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              fontSize: "0.8rem", lineHeight: 1.8,
              color: "rgba(155,161,123,0.85)",
            }}>
              ماتشا يابانية احتفالية<br />من مزارع أوجي، كيوتو
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <a href="https://instagram.com" target="_blank" rel="noopener" style={{ color: "#9BA17B", transition: "color 0.2s" }}>
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener" style={{
                color: "#9BA17B", fontSize: "0.75rem",
                fontFamily: "'Inter',sans-serif", letterSpacing: "0.1em",
                display: "flex", alignItems: "center",
              }}>TikTok</a>
            </div>
          </div>

          {/* Links */}
          {[
            { title: "المتجر", en: "SHOP", links: [
              { label: "ماتشا احتفالية", href: "/products" },
              { label: "الأدوات", href: "/products" },
              { label: "طقم البداية", href: "/products" },
              { label: "العروض", href: "/products" },
            ]},
            { title: "الشركة", en: "COMPANY", links: [
              { label: "قصتنا", href: "/about" },
              { label: "دليل الريتشوال", href: "/ritual" },
              { label: "المجلة", href: "/journal" },
              { label: "نادي UJI", href: "/club" },
            ]},
            { title: "المساعدة", en: "HELP", links: [
              { label: "اتصل بنا", href: "/contact" },
              { label: "الشحن والتوصيل", href: "/shipping" },
              { label: "الإرجاع", href: "/returns" },
              { label: "الأسئلة الشائعة", href: "/faq" },
            ]},
          ].map(({ title, en, links }) => (
            <div key={title}>
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase",
                  color: "#9BA17B", marginBottom: "0.25rem",
                }}>{en}</p>
                <p style={{
                  fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                  fontSize: "0.85rem", color: "rgba(242,234,219,0.6)",
                }}>{title}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {links.map(l => (
                  <Link key={l.label} href={l.href} style={{
                    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                    fontSize: "0.82rem", color: "rgba(155,161,123,0.8)",
                    transition: "color 0.2s",
                  }}>{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "2rem 0 3rem", flexWrap: "wrap", gap: "1rem",
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: "0.65rem",
            letterSpacing: "0.1em", color: "rgba(155,161,123,0.5)",
          }}>
            © 2026 UJI MATCHA — تراك في ريتشوالك القادم
          </p>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["سياسة الخصوصية", "الشروط والأحكام"].map(t => (
              <a key={t} href="#" style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                fontSize: "0.65rem", color: "rgba(155,161,123,0.4)",
                transition: "color 0.2s",
              }}>{t}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer [style*="grid-template-columns: 1fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
            padding: 3rem 0 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
