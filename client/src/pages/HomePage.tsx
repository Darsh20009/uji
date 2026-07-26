import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import MatchaFinder from "../components/MatchaFinder";
import { ArrowLeft } from "lucide-react";

/* ─── Section label component ─── */
function SectionLabel({ num, en }: { num: string; en: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
      <span style={{
        fontFamily: "'Cascadia Code', monospace", fontSize: "0.6rem",
        letterSpacing: "0.28em", textTransform: "uppercase", color: "#9BA17B",
      }}>{en}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(155,161,123,0.25)", maxWidth: 80 }} />
    </div>
  );
}

/* ─── Feature tile ─── */
function FeatureTile({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div style={{
      padding: "2.5rem 2rem",
      border: "1px solid rgba(155,161,123,0.15)",
      background: "rgba(31,57,41,0.4)",
      display: "flex", flexDirection: "column", gap: "1.25rem",
    }}>
      <div style={{ color: "#9BA17B" }}>{icon}</div>
      <h3 style={{
        fontFamily: "'Mirza', serif",
        fontSize: "1.4rem", fontWeight: 300, color: "#F2EADB", lineHeight: 1.3,
      }}>{title}</h3>
      <p style={{
        fontFamily: "'Mirza', serif",
        fontSize: "0.82rem", lineHeight: 1.8, color: "rgba(155,161,123,0.85)",
      }}>{body}</p>
    </div>
  );
}

/* ─── Newsletter section ─── */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/newsletter", { email });
      setStatus("done");
      setEmail("");
    } catch (e: any) {
      setStatus("error");
      setMsg(e.message || "حدث خطأ");
    }
  };

  return (
    <section className="section" style={{
      background: "#F2EADB",
      borderTop: "1px solid rgba(200,187,164,0.3)",
      textAlign: "center",
    }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <p className="label-eyebrow" style={{ marginBottom: "1.5rem" }}>نشرة بريدية</p>
        <h2 style={{
          fontFamily: "'Mirza', serif",
          fontSize: "clamp(2rem, 3.5vw, 3rem)",
          fontWeight: 300, color: "#1C201B",
          marginBottom: "1rem", lineHeight: 1.2,
        }}>
          صندوق بريد أهدأ.
        </h2>
        <p style={{
          fontFamily: "'Mirza', serif",
          fontSize: "0.85rem", color: "#9BA17B", lineHeight: 1.8,
          marginBottom: "3rem",
        }}>
          ريتشوال الماتشا، ملاحظات من المجلة، وإصدارات حصرية. بدون ضجيج.
        </p>

        {status === "done" ? (
          <p style={{ fontFamily: "'Mirza', serif", fontSize: "1.3rem", fontWeight: 300, color: "#1F3929" }}>
            أهلاً بك في عائلة UJI
          </p>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", gap: "0", maxWidth: 480, margin: "0 auto" }}>
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                flex: 1, height: 52, border: "1px solid rgba(200,187,164,0.5)",
                borderLeft: "none", background: "#F7F2E8",
                fontFamily: "'Mirza', serif",
                fontSize: "0.85rem", color: "#1C201B",
                padding: "0 1.25rem", outline: "none",
                borderRadius: 0,
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary"
              style={{ borderRadius: 0, height: 52, flexShrink: 0, minWidth: 100 }}>
              {status === "loading" ? "..." : "اشترك"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p style={{ color: "#c0392b", fontFamily: "'Mirza', serif", fontSize: "0.82rem", marginTop: "0.75rem" }}>{msg}</p>
        )}
      </div>
    </section>
  );
}

/* ─── Trust bar icons ─── */
const TRUST_ICONS: Record<string, React.ReactNode> = {
  delivery: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="7" width="16" height="12" rx="1.5"/><path d="M17 10h4l4 4v5h-8V10z"/><circle cx="6.5" cy="21" r="2"/><circle cx="21.5" cy="21" r="2"/>
    </svg>
  ),
  secure: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2L4 6v7c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V6L14 2z"/><path d="M9 14l3.5 3.5L19 11"/>
    </svg>
  ),
  return: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14A10 10 0 1 0 6 7.5"/><path d="M4 4v4h4"/>
    </svg>
  ),
};

/* Maps badge index → icon key */
const BADGE_ICON_KEYS = ["delivery", "secure", "return"];

/* ─── Trust bar ─── */
const DEFAULT_BADGES = [
  { icon: "🚚", title: "يوصلك خلال", value: "١–٣ أيام", enabled: true },
  { icon: "🔒", title: "الدفع",       value: "آمن ومشفّر", enabled: true },
  { icon: "↩️",  title: "الاسترجاع",  value: "يوم واحد",  enabled: true },
];
function TrustBar({ badges }: { badges?: typeof DEFAULT_BADGES }) {
  const list = (badges && badges.length ? badges : DEFAULT_BADGES).filter(b => b.enabled !== false);
  if (!list.length) return null;
  return (
    <section style={{
      background: "#1F3929",
      borderTop: "none",
      borderBottom: "none",
    }}>
      <div className="container">
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
        }}>
          {list.map((b, i) => (
            <div key={i} style={{
              flex: "1 1 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              padding: "1.6rem 1rem",
              borderLeft: i < list.length - 1 ? "1px solid rgba(242,234,219,0.12)" : "none",
              textAlign: "center",
            }}>
              {/* SVG icon */}
              <span style={{ color: "#9BA17B", lineHeight: 0, flexShrink: 0 }}>
                {TRUST_ICONS[BADGE_ICON_KEYS[i]] ?? TRUST_ICONS["delivery"]}
              </span>
              {/* Value */}
              <p style={{
                fontFamily: "'Mirza', serif",
                fontSize: "1rem", fontWeight: 600,
                color: "#F2EADB",
                margin: 0, lineHeight: 1.2,
              }}>{b.value}</p>
              {/* Label */}
              <p style={{
                fontFamily: "'Mirza', serif",
                fontSize: "0.75rem",
                color: "rgba(155,161,123,0.85)",
                margin: 0, lineHeight: 1.2,
              }}>{b.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);

  const { data: products } = useQuery({
    queryKey: ["products-featured"],
    queryFn: () => api.get("/products?featured=1"),
  });
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get("/settings"),
    staleTime: 5 * 60 * 1000,
  });
  const trustBadges = (settings as any)?.trustBadges ?? DEFAULT_BADGES;
  const badgesPosition: "above" | "below" | "both" = (settings as any)?.trustBadgesPosition ?? "above";

  return (
    <div style={{ background: "#F2EADB" }}>

      {/* ══════════════════════════════════════════════
          01 — HERO (100vh)
      ══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: "relative", minHeight: "65vh",
          display: "flex", alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Full-bleed background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(/assets/hero/uji-banner-matcha-powder.jpg)`,
          backgroundSize: "cover", backgroundPosition: "center center",
        }} />
        {/* Gradient overlay — desktop: side fade; mobile: bottom-up dark for legibility */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(270deg, rgba(16,30,22,0.82) 0%, rgba(16,30,22,0.5) 50%, rgba(16,30,22,0.15) 100%)",
        }} className="hero-overlay-desktop" />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(16,30,22,0.92) 0%, rgba(16,30,22,0.65) 50%, rgba(16,30,22,0.25) 100%)",
        }} className="hero-overlay-mobile" />

        {/* Content */}
        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 80, paddingBottom: 40 }}>
          <div style={{ maxWidth: 560 }}>
            <p style={{
              fontFamily: "'Cascadia Code', monospace",
              fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase",
              color: "rgba(155,161,123,0.9)", marginBottom: "2rem",
              animation: "heroFadeUp 0.9s ease 0.1s both",
            }}>
              CEREMONIAL JAPANESE MATCHA
            </p>

            <h1 style={{
              fontFamily: "'Mirza', serif",
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 300, lineHeight: 1.1,
              color: "#F2EADB",
              marginBottom: "1.75rem",
              animation: "heroFadeUp 1s ease 0.25s both",
            }}>
              تجربة الماتشا<br />
              اليابانية الحقيقية
            </h1>

            <p style={{
              fontFamily: "'Mirza', serif",
              fontSize: "0.95rem", lineHeight: 1.9, fontWeight: 300,
              color: "rgba(242,234,219,0.82)",
              marginBottom: "2.5rem", maxWidth: 420,
              animation: "heroFadeUp 1s ease 0.4s both",
            }}>
              ماتشا احتفالية من مستوى الدرجة الأولى، مزروعة في شيزوكا<br />ومصممة لريتشوالك اليومي.
            </p>

            <div className="hero-buttons" style={{
              display: "flex", gap: "1rem", flexWrap: "wrap",
              animation: "heroFadeUp 1s ease 0.55s both",
            }}>
              <Link href="/about" className="btn-primary">اكتشف UJI</Link>
              <Link href="/products" className="btn-ghost">تسوق الماتشا</Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "1.75rem", left: "50%", transform: "translateX(-50%)",
          zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem",
          animation: "heroFadeUp 1s ease 1s both",
        }}>
          <span style={{
            fontFamily: "'Cascadia Code', monospace", fontSize: "0.5rem",
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "rgba(242,234,219,0.55)",
          }}>SCROLL</span>
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none" style={{ animation: "scrollBounce 1.8s ease-in-out infinite" }}>
            <rect x="1" y="1" width="14" height="20" rx="7" stroke="rgba(242,234,219,0.4)" strokeWidth="1.2"/>
            <rect x="7" y="5" width="2" height="5" rx="1" fill="rgba(242,234,219,0.7)" style={{ animation: "scrollDot 1.8s ease-in-out infinite" }}/>
          </svg>
        </div>

        <style>{`
          @keyframes heroFadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes scrollBounce {
            0%, 100% { transform: translateY(0); opacity: 0.7; }
            50%       { transform: translateY(5px); opacity: 1; }
          }
          @keyframes scrollDot {
            0%, 100% { transform: translateY(0); opacity: 1; }
            50%       { transform: translateY(3px); opacity: 0.5; }
          }
        `}</style>
      </section>

      {/* ══ TRUST BAR — always visible after hero ══ */}
      <TrustBar badges={trustBadges} />

      {/* ══════════════════════════════════════════════
          PRODUCTS — first thing after hero, always visible
      ══════════════════════════════════════════════ */}
      <section id="products" style={{ background: "#F7F2E8", padding: "2rem 0 5rem", borderTop: "3px solid #1F3929" }}>
        <div className="container">

          {/* Section header */}
          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid rgba(200,187,164,0.4)",
          }}>
            <div>
              <p style={{
                fontFamily: "'Cascadia Code', monospace", fontSize: "0.55rem",
                letterSpacing: "0.32em", textTransform: "uppercase", color: "#9BA17B",
                marginBottom: "0.6rem",
              }}>THE COLLECTION</p>
              <h2 style={{
                fontFamily: "'Mirza', serif",
                fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
                fontWeight: 400, color: "#1C201B", lineHeight: 1.1, margin: 0,
              }}>منتجاتنا</h2>
            </div>
            <Link href="/products" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontFamily: "'Mirza', serif", fontSize: "0.85rem",
              color: "#1F3929", border: "1px solid rgba(31,57,41,0.45)",
              padding: "0.65rem 1.4rem", transition: "all 0.2s",
              background: "transparent",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#1F3929"; (e.currentTarget as HTMLAnchorElement).style.color = "#F2EADB"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#1F3929"; }}
            >
              عرض جميع المنتجات <ArrowLeft size={14} strokeWidth={1.5} />
            </Link>
          </div>

          {/* Products grid */}
          {products?.length > 0 ? (
            <div className="grid-products">
              {products.slice(0, 6).map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {[
                { name: "ماتشا احتفالية", sub: "Ceremonial Matcha", price: "89", img: "/assets/packaging/uji-tin-front-transparent.png" },
                { name: "مخفقة الخيزران", sub: "Bamboo Whisk",      price: "45", img: "/assets/products/uji-product-bamboo-whisk-transparent.png" },
                { name: "طقم البداية",   sub: "Starter Set",        price: "149", img: "/assets/packaging/uji-tin-open-transparent.png" },
              ].map(({ name, sub, price, img }) => (
                <div key={name} style={{ background: "#F2EADB", border: "1px solid rgba(200,187,164,0.35)" }}>
                  <div style={{ aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#F2EADB" }}>
                    <img src={img} alt={name} style={{ width: "75%", height: "75%", objectFit: "contain" }} />
                  </div>
                  <div style={{ padding: "1.25rem 1.5rem 1.75rem", background: "#F7F2E8" }}>
                    <p style={{ fontFamily: "'Cascadia Code', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: "#9BA17B", textTransform: "uppercase", marginBottom: "0.4rem" }}>{sub}</p>
                    <h3 style={{ fontFamily: "'Mirza', serif", fontSize: "1rem", fontWeight: 500, color: "#1C201B", marginBottom: "1rem" }}>{name}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid rgba(200,187,164,0.25)" }}>
                      <span style={{ fontFamily: "'Mirza', serif", fontSize: "1.1rem", color: "#1F3929" }}>{price} <span style={{ fontSize: "0.7rem", fontFamily: "'Cascadia Code', monospace" }}>ر.س</span></span>
                      <Link href="/products" className="btn-primary" style={{ height: 36, padding: "0 1.25rem", fontSize: "0.8rem" }}>تسوق</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(200,187,164,0.3)" }}>
            <Link href="/products" className="btn-primary" style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center", height: 52, padding: "0 2.5rem", fontSize: "0.9rem" }}>
              تسوق جميع منتجات UJI <ArrowLeft size={15} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          02 — THE TIN (360° product)
      ══════════════════════════════════════════════ */}
      <section className="section" style={{ background: "#F2EADB" }}>
        <div className="container">
          <SectionLabel num="02" en="THE MATCHA" />

          <div className="grid-2col" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "5rem", alignItems: "center",
          }}>
            {/* Left: blended image */}
            <div style={{ position: "relative", height: 480, borderRadius: 4, overflow: "hidden" }}>
              <img
                src="/assets/packaging/uji-tin-hero.png"
                alt="ماتشا UJI"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
              {/* Fade edges into section background */}
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(to right, #F2EADB 0%, transparent 18%, transparent 82%, #F2EADB 100%)`,
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(to bottom, #F2EADB 0%, transparent 15%, transparent 82%, #F2EADB 100%)`,
                pointerEvents: "none",
              }} />
            </div>

            {/* Right: annotations */}
            <div>
              <h2 style={{
                fontFamily: "'Mirza', serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                fontWeight: 300, color: "#1C201B",
                marginBottom: "0.75rem", lineHeight: 1.2,
              }}>
                ماتشا احتفالية<br />بجودة استثنائية.
              </h2>
              <p style={{
                fontFamily: "'Mirza', serif",
                fontSize: "0.85rem", color: "#9BA17B",
                lineHeight: 1.8, marginBottom: "3rem",
              }}>
                مسحوق ماتشا ياباني أصلي من الدرجة الاحتفالية، مطحون بالحجر من أوراق الشاي المظللة للحصول على أعمق نكهة وأغنى لون أخضر.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  { en: "Ceremonial Grade", ar: "درجة احتفالية" },
                  { en: "Stone Ground",     ar: "طحن بالحجر" },
                  { en: "Shade Grown",      ar: "نمو في الظل" },
                  { en: "Single Origin",    ar: "مصدر واحد" },
                  { en: "30g Pure Matcha",  ar: "30 جرام ماتشا نقية" },
                ].map(({ en, ar }) => (
                  <div key={en} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1rem 0",
                    borderBottom: "1px solid rgba(200,187,164,0.3)",
                  }}>
                    <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.88rem", color: "#1C201B" }}>{ar}</span>
                    <span style={{ fontFamily: "'Cascadia Code', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9BA17B" }}>{en}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "2.5rem" }}>
                <Link href="/products" className="btn-outline">تسوق الآن</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          03 — WHY UJI (dark section)
      ══════════════════════════════════════════════ */}
      <section className="section" style={{ background: "#16281D" }}>
        <div className="container">
          <SectionLabel num="03" en="WHY UJI MATCHA" />

          <div className="grid-2col" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "4rem", alignItems: "end", marginBottom: "5rem",
          }}>
            <h2 style={{
              fontFamily: "'Mirza', serif",
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              fontWeight: 300, color: "#F2EADB", lineHeight: 1.15,
            }}>
              ماتشا مختارة بعناية<br />
              لكل طريقة تحضير.
            </h2>
            <p style={{
              fontFamily: "'Mirza', serif",
              fontSize: "0.88rem", color: "rgba(155,161,123,0.85)", lineHeight: 1.9,
            }}>
              سواء كنت تعدّها لنفسك أو تشاركها في تجمع، كل صنف من ماتشا UJI مختار بدقة من مزارع اليابان، ومنها مزارع شيزوكا الشهيرة، ليناسب كل ذوق وكل أسلوب تحضير.
            </p>
          </div>

          <div className="grid-4col" style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px", background: "rgba(155,161,123,0.12)",
          }}>
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M14 3C8 3 4 8 4 14s4 11 10 11 10-5 10-11"/><path d="M14 3v6M20 5l-4 5"/>
                  </svg>
                ),
                title: "من مزارع شيزوكا اليابانية",
                body: "نختار من أبرز مزارع شيزوكا في اليابان، حيث يُزرع أجود الشاي منذ قرون.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="14" cy="14" r="5"/><path d="M14 2v4M14 22v4M2 14h4M22 14h4M6 6l3 3M19 19l3 3M6 22l3-3M19 9l3-3"/>
                  </svg>
                ),
                title: "لكل أسلوب تحضير",
                body: "من الماتشا اللاتيه إلى الريتشوال الياباني الكلاسيكي، عندنا الصنف المناسب لك.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M5 14h18M12 7l7 7-7 7"/>
                  </svg>
                ),
                title: "للأفراد والتجمعات",
                body: "سواء كنت تبدأ يومك بهدوء أو تشارك لحظة مميزة مع أشخاص تحبهم، الماتشا لكل المناسبات.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M7 20l5-14 5 14"/><path d="M9 15h10"/>
                  </svg>
                ),
                title: "نقية 100% بلا إضافات",
                body: "بدون سكر أو نكهات اصطناعية أو مواد حافظة. ماتشا خالصة من قلب اليابان إلى كوبك.",
              },
            ].map(({ icon, title, body }) => (
              <FeatureTile key={title} icon={icon} title={title} body={body} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          04 — MATCHA FINDER
      ══════════════════════════════════════════════ */}
      <MatchaFinder />


      {/* ══════════════════════════════════════════════
          05 — THE RITUAL
      ══════════════════════════════════════════════ */}
      <section className="section" style={{ background: "#F7F2E8", borderTop: "1px solid rgba(200,187,164,0.3)" }}>
        <div className="container">
          <SectionLabel num="05" en="THE RITUAL" />

          <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
            <p style={{
              fontFamily: "'Mirza', serif",
              fontSize: "clamp(2rem, 3vw, 2.8rem)",
              fontWeight: 300,
              color: "#4C5734", lineHeight: 1.3, marginBottom: "2rem",
            }}>
              تباطأ. تذوّق الماتشا.
            </p>
            <p style={{
              fontFamily: "'Mirza', serif",
              fontSize: "0.85rem", lineHeight: 1.9, color: "#9BA17B",
              marginBottom: "3rem",
            }}>
              الماتشا ليست مجرد مشروب. إنها لحظة تتوقف فيها عن كل شيء وتحضر في اللحظة الراهنة. من تحضير المسحوق إلى أول رشفة دافئة.
            </p>
            <Link href="/ritual" className="btn-outline">دليل الريتشوال</Link>
          </div>
        </div>
      </section>

      {/* ══ TRUST BAR — below position ══ */}
      {(badgesPosition === "below" || badgesPosition === "both") && <TrustBar badges={trustBadges} />}

      {/* 07 — NEWSLETTER */}
      <Newsletter />

    </div>
  );
}
