import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useLang } from "../context/LanguageContext";
import { t } from "../lib/translations";

const DEFAULT_SOCIAL = {
  instagram: "https://instagram.com/uji__sa",
  tiktok:    "https://tiktok.com/@uji__sa",
  snapchat:  "https://snapchat.com/add/uji__sa",
  twitter:   "https://x.com/uji__sa",
  linktree:  "https://linktr.ee/uji_sa",
};

export default function Footer() {
  const { lang } = useLang();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get("/settings"),
    staleTime: 5 * 60 * 1000,
  });
  const social = { ...DEFAULT_SOCIAL, ...(settings as any)?.social };

  const sections = [
    {
      titleKey: "footer.section.shop" as const,
      en: "SHOP",
      links: [
        { labelKey: "footer.link.pouch"       as const, href: "/products" },
        { labelKey: "footer.link.allproducts" as const, href: "/products" },
        { labelKey: "footer.link.offers"      as const, href: "/products" },
      ],
    },
    {
      titleKey: "footer.section.company" as const,
      en: "COMPANY",
      links: [
        { labelKey: "footer.link.about"     as const, href: "/about"     },
        { labelKey: "footer.link.ritual"    as const, href: "/ritual"    },
        { labelKey: "footer.link.magazine"  as const, href: "/magazine"  },
        { labelKey: "footer.link.wholesale" as const, href: "/wholesale" },
      ],
    },
    {
      titleKey: "footer.section.help" as const,
      en: "HELP",
      links: [
        { labelKey: "footer.link.contact"   as const, href: "/wholesale" },
        { labelKey: "footer.link.shipping"  as const, href: "/policy"    },
        { labelKey: "footer.link.returns"   as const, href: "/policy"    },
        { labelKey: "footer.link.privacy"   as const, href: "/policy"    },
      ],
    },
  ];

  const bottomLinks = [
    { labelKey: "footer.link.privacy"   as const, href: "/policy"    },
    { labelKey: "footer.link.returns"   as const, href: "/policy"    },
    { labelKey: "footer.link.wholesale" as const, href: "/wholesale" },
  ];

  return (
    <footer
      style={{ background: "#16281D", color: "#F2EADB", position: "relative", overflow: "hidden", paddingBottom: 80 }}
      className="lg:pb-0"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Big watermark wordmark */}
      <div style={{
        position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)",
        fontFamily: "'Mirza', serif", fontSize: "clamp(8rem,18vw,16rem)",
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
              style={{ height: 56, objectFit: "contain", objectPosition: lang === "ar" ? "right" : "left" }}
            />
            <p style={{
              fontFamily: "'Mirza', serif",
              fontSize: "0.8rem", lineHeight: 1.8,
              color: "rgba(155,161,123,0.85)",
            }}>
              {t("footer.tagline", lang).split("\n").map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </p>
            <div style={{ display: "flex", gap: "1.1rem", alignItems: "center", flexWrap: "wrap" }}>
              {/* Instagram */}
              <a href={social.instagram} target="_blank" rel="noopener" style={{ color: "#9BA17B", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href={social.tiktok} target="_blank" rel="noopener" style={{ color: "#9BA17B", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </a>
              {/* Snapchat */}
              <a href={social.snapchat} target="_blank" rel="noopener" style={{ color: "#9BA17B", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.56 2 6 4.56 6 8v.5c-.8.2-1.5.8-1.5 1.5 0 .6.4 1.1 1 1.4-.3.9-.9 1.6-1.7 2.1-.3.2-.3.6 0 .8.8.5 2.2.7 3.2.8.3.6 1 1 1.8 1h.2c.3.4.8.7 1.5 1 .7.3 1.3.5 1.5.5s.8-.2 1.5-.5c.7-.3 1.2-.6 1.5-1h.2c.8 0 1.5-.4 1.8-1 1-.1 2.4-.3 3.2-.8.3-.2.3-.6 0-.8-.8-.5-1.4-1.2-1.7-2.1.6-.3 1-.8 1-1.4 0-.7-.7-1.3-1.5-1.5V8C18 4.56 15.44 2 12 2z"/>
                </svg>
              </a>
              {/* X (Twitter) */}
              <a href={social.twitter} target="_blank" rel="noopener" style={{ color: "#9BA17B", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
              </a>
              {/* Linktree */}
              {social.linktree && (
                <a href={social.linktree} target="_blank" rel="noopener" style={{ color: "#9BA17B", display: "flex" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.51 5.11l4.74-4.74 2.12 2.12-4.74 4.74h6.74v3h-6.74l4.74 4.74-2.12 2.12-4.74-4.74V24h-3V12.35l-4.74 4.74-2.12-2.12 4.74-4.74H.37v-3h6.74L2.37 2.49 4.49.37l4.74 4.74V0h3v5.11z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Link sections */}
          {sections.map(({ titleKey, en, links }) => (
            <div key={titleKey}>
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{
                  fontFamily: "'Cascadia Code', monospace",
                  fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase",
                  color: "#9BA17B", marginBottom: "0.25rem",
                }}>{en}</p>
                <p style={{
                  fontFamily: "'Mirza', serif",
                  fontSize: "0.85rem", color: "rgba(242,234,219,0.6)",
                }}>{t(titleKey, lang)}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {links.map(({ labelKey, href }) => (
                  <Link key={labelKey} href={href} style={{
                    fontFamily: "'Mirza', serif",
                    fontSize: "0.82rem", color: "rgba(155,161,123,0.8)",
                    transition: "color 0.2s", textDecoration: "none",
                  }}>{t(labelKey, lang)}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "2rem 0 2.5rem", flexWrap: "wrap", gap: "1rem",
        }}>
          <p style={{
            fontFamily: "'Cascadia Code', monospace", fontSize: "0.65rem",
            letterSpacing: "0.1em", color: "rgba(155,161,123,0.5)",
          }}>
            © 2026 UJI MATCHA. {t("footer.copyright", lang)}
          </p>
          <div style={{ display: "flex", gap: "2rem" }}>
            {bottomLinks.map(({ labelKey, href }) => (
              <Link key={labelKey} href={href} style={{
                fontFamily: "'Mirza', serif",
                fontSize: "0.65rem", color: "rgba(155,161,123,0.4)",
                transition: "color 0.2s", textDecoration: "none",
              }}>{t(labelKey, lang)}</Link>
            ))}
          </div>
        </div>

        {/* Government logos row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "2.5rem", paddingBottom: "2rem",
          borderTop: "1px solid rgba(155,161,123,0.15)",
          paddingTop: "1.5rem",
          flexWrap: "wrap",
        }}>
          <p style={{
            fontFamily: "'Mirza', serif", fontSize: "0.65rem",
            color: "rgba(155,161,123,0.45)", letterSpacing: "0.05em",
            flexShrink: 0,
          }}>
            {t("footer.licensed", lang)}
          </p>
          <img
            src="/assets/brand/logo-moc-real.png"
            alt="وزارة التجارة"
            style={{ height: 48, objectFit: "contain", opacity: 0.75 }}
          />
          <img
            src="/assets/brand/logo-sbc-real.png"
            alt="المركز السعودي للأعمال"
            style={{ height: 48, objectFit: "contain", opacity: 0.75 }}
          />
        </div>
      </div>

      {/* Made by Qirox Studio */}
      <div className="footer-credit" style={{
        background: "rgba(0,0,0,0.35)",
        borderTop: "1px solid rgba(155,161,123,0.1)",
        padding: "0.85rem 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "0.6rem",
      }}>
        <img
          src="/assets/brand/qirox-icon.png"
          alt="Qirox Studio"
          style={{
            height: 24, width: 24, objectFit: "contain", opacity: 0.95,
            mixBlendMode: "screen", borderRadius: "50%",
          }}
        />
        <p style={{
          fontFamily: "'Mirza', serif", fontSize: "0.62rem",
          color: "rgba(242,234,219,0.72)", letterSpacing: "0.05em",
          margin: 0,
        }}>
          {t("footer.madeby", lang)}{" "}
          <a
            href="https://qiroxstudio.online"
            target="_blank"
            rel="noopener"
            style={{
              color: "#F2EADB",
              textDecoration: "none",
              fontWeight: 600,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#9BA17B")}
            onMouseLeave={e => (e.currentTarget.style.color = "#F2EADB")}
          >
            Qirox Studio
          </a>
          <span style={{ color: "rgba(242,234,219,0.48)", marginRight: "0.2rem" }}>·</span>
          <span style={{ color: "rgba(242,234,219,0.58)", fontSize: "0.56rem" }}>QIROX GROUP</span>
        </p>
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
        .footer-credit a { text-underline-offset: 3px; }
        .footer-credit a:hover { text-decoration: underline !important; }
      `}</style>
    </footer>
  );
}
