import { Link } from "wouter";

export default function Footer() {
  return (
    <footer style={{ background: "#16281D", color: "#F2EADB", position: "relative", overflow: "hidden", paddingBottom: 80 }} className="lg:pb-0">
      {/* Big watermark wordmark */}
      <div style={{
        position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)",
        fontFamily: "'Aref Ruqaa', 'Cormorant Garamond', serif", fontSize: "clamp(8rem,18vw,16rem)",
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
        }} className="footer-grid">
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
              ماتشا يابانية احتفالية<br />من قلب زراعة الشاي الياباني
            </p>
            <div style={{ display: "flex", gap: "1.1rem", alignItems: "center" }}>
              {/* Instagram */}
              <a href="https://instagram.com/ujimatcha" target="_blank" rel="noopener" style={{ color: "#9BA17B", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://tiktok.com/@ujimatcha" target="_blank" rel="noopener" style={{ color: "#9BA17B", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </a>
              {/* Snapchat */}
              <a href="https://snapchat.com/add/ujimatcha" target="_blank" rel="noopener" style={{ color: "#9BA17B", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.56 2 6 4.56 6 8v.5c-.8.2-1.5.8-1.5 1.5 0 .6.4 1.1 1 1.4-.3.9-.9 1.6-1.7 2.1-.3.2-.3.6 0 .8.8.5 2.2.7 3.2.8.3.6 1 1 1.8 1h.2c.3.4.8.7 1.5 1 .7.3 1.3.5 1.5.5s.8-.2 1.5-.5c.7-.3 1.2-.6 1.5-1h.2c.8 0 1.5-.4 1.8-1 1-.1 2.4-.3 3.2-.8.3-.2.3-.6 0-.8-.8-.5-1.4-1.2-1.7-2.1.6-.3 1-.8 1-1.4 0-.7-.7-1.3-1.5-1.5V8C18 4.56 15.44 2 12 2z"/>
                </svg>
              </a>
              {/* X (Twitter) */}
              <a href="https://x.com/ujimatcha" target="_blank" rel="noopener" style={{ color: "#9BA17B", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {[
            { title: "المتجر", en: "SHOP", links: [
              { label: "ماتشا الكيس", href: "/products" },
              { label: "جميع المنتجات", href: "/products" },
              { label: "العروض", href: "/products" },
            ]},
            { title: "الشركة", en: "COMPANY", links: [
              { label: "قصتنا", href: "/about" },
              { label: "دليل الريتشوال", href: "/ritual" },
              { label: "المجلة", href: "/magazine" },
              { label: "مبيعات الجملة", href: "/wholesale" },
            ]},
            { title: "المساعدة", en: "HELP", links: [
              { label: "تواصل معنا", href: "/wholesale" },
              { label: "الشحن والتوصيل", href: "/policy" },
              { label: "سياسة الإرجاع", href: "/policy" },
              { label: "سياسة الخصوصية", href: "/policy" },
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
                    transition: "color 0.2s", textDecoration: "none",
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
            © 2026 UJI MATCHA — ريتشوالك اليومي
          </p>
          <div style={{ display: "flex", gap: "2rem" }}>
            {[
              { label: "سياسة الخصوصية", href: "/policy" },
              { label: "سياسة الاسترجاع", href: "/policy" },
              { label: "مبيعات الجملة", href: "/wholesale" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                fontSize: "0.65rem", color: "rgba(155,161,123,0.4)",
                transition: "color 0.2s", textDecoration: "none",
              }}>{label}</Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
            padding: 3rem 0 2rem !important;
          }
          footer.lg\\:pb-0 { padding-bottom: 80px !important; }
        }
        @media (min-width: 1024px) {
          footer.lg\\:pb-0 { padding-bottom: 0 !important; }
        }
      `}</style>
    </footer>
  );
}
