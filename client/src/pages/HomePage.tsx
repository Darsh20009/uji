import { useState } from "react";
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
        fontFamily: "'Inter', sans-serif", fontSize: "0.6rem",
        letterSpacing: "0.28em", textTransform: "uppercase", color: "#9BA17B",
      }}>{num} — {en}</span>
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
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.4rem", fontWeight: 300, color: "#F2EADB", lineHeight: 1.3,
      }}>{title}</h3>
      <p style={{
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
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
        <p className="label-eyebrow" style={{ marginBottom: "1.5rem" }}>JOURNAL — نشرة بريدية</p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2rem, 3.5vw, 3rem)",
          fontWeight: 300, color: "#1C201B",
          marginBottom: "1rem", lineHeight: 1.2,
        }}>
          صندوق بريد أهدأ.
        </h2>
        <p style={{
          fontFamily: "'IBM Plex Sans Arabic', sans-serif",
          fontSize: "0.85rem", color: "#9BA17B", lineHeight: 1.8,
          marginBottom: "3rem",
        }}>
          ريتشوال الماتشا، ملاحظات من المجلة، وإصدارات حصرية — لا ضجيج.
        </p>

        {status === "done" ? (
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 300, color: "#1F3929" }}>
            ✦ أهلاً بك في عائلة UJI
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
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
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
          <p style={{ color: "#c0392b", fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", marginTop: "0.75rem" }}>{msg}</p>
        )}
      </div>
    </section>
  );
}

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
      background: "#F7F2E8",
      borderTop: "1px solid rgba(200,187,164,0.3)",
      borderBottom: "1px solid rgba(200,187,164,0.3)",
      padding: "0",
    }}>
      <div className="container" style={{ padding: "0 1.5rem" }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          gap: "0",
          flexWrap: "wrap",
        }}>
          {list.map((b, i) => (
            <div key={i} style={{
              flex: "1 1 140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.7rem",
              padding: "1.1rem 1.5rem",
              borderLeft: i < list.length - 1 ? "1px solid rgba(200,187,164,0.35)" : "none",
            }}>
              <span style={{ fontSize: "1.35rem", lineHeight: 1, flexShrink: 0 }}>{b.icon}</span>
              <div style={{ textAlign: "right" }}>
                <p style={{
                  fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                  fontSize: "0.75rem", color: "#9BA17B",
                  margin: 0, lineHeight: 1.2,
                }}>{b.title}</p>
                <p style={{
                  fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                  fontSize: "0.85rem", fontWeight: 600, color: "#1C201B",
                  margin: 0, lineHeight: 1.3, marginTop: 2,
                }}>{b.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
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
        style={{
          position: "relative", minHeight: "100vh",
          display: "flex", alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Full-bleed background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(/assets/hero/uji-hero-tin-powder-explosion.png)`,
          backgroundSize: "cover", backgroundPosition: "40% center",
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(270deg, rgba(22,40,29,0.78) 0%, rgba(22,40,29,0.45) 45%, rgba(22,40,29,0.1) 75%, transparent 100%)",
        }} />

        {/* Content */}
        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 120, paddingBottom: 80 }}>
          <div style={{ maxWidth: 560 }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase",
              color: "rgba(155,161,123,0.9)", marginBottom: "2rem",
              animation: "heroFadeUp 0.9s ease 0.1s both",
            }}>
              CEREMONIAL JAPANESE MATCHA
            </p>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 300, lineHeight: 1.1,
              color: "#F2EADB",
              marginBottom: "1.75rem",
              animation: "heroFadeUp 1s ease 0.25s both",
            }}>
              تجربة الماتشا<br />
              <em>اليابانية الحقيقية</em>
            </h1>

            <p style={{
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              fontSize: "0.95rem", lineHeight: 1.9, fontWeight: 300,
              color: "rgba(242,234,219,0.82)",
              marginBottom: "2.5rem", maxWidth: 420,
              animation: "heroFadeUp 1s ease 0.4s both",
            }}>
              ماتشا احتفالية من مستوى الدرجة الأولى، مصنوعة في أوجي<br />ومصممة لريتشوالك اليومي.
            </p>

            <div style={{
              display: "flex", gap: "1rem", flexWrap: "wrap",
              animation: "heroFadeUp 1s ease 0.55s both",
            }}>
              <Link href="/about" className="btn-primary">اكتشف UJI</Link>
              <Link href="/products" className="btn-ghost">تسوق الماتشا</Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: "2.5rem", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
          animation: "heroFadeUp 1s ease 0.9s both",
        }}>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#F2EADB" }}>01 — SCROLL</p>
          <div style={{ width: 1, height: 48, background: "rgba(242,234,219,0.5)", animation: "fadeScroll 1.8s ease-in-out infinite" }} />
        </div>

        <style>{`
          @keyframes heroFadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeScroll {
            0%,100%{opacity:0.2;transform:scaleY(0.5);transform-origin:top}
            50%{opacity:1;transform:scaleY(1);transform-origin:top}
          }
        `}</style>
      </section>

      {/* ══ TRUST BAR — above position ══ */}
      {(badgesPosition === "above" || badgesPosition === "both") && <TrustBar badges={trustBadges} />}

      {/* ══════════════════════════════════════════════
          TAGLINE BREAK
      ══════════════════════════════════════════════ */}
      <section style={{
        background: "#F7F2E8",
        padding: "6rem 0",
        textAlign: "center",
        borderTop: "1px solid rgba(200,187,164,0.3)",
        borderBottom: "1px solid rgba(200,187,164,0.3)",
      }}>
        <div className="container">
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            fontWeight: 300, fontStyle: "italic",
            color: "#1C201B", lineHeight: 1.4,
            marginBottom: "1.5rem",
          }}>
            "ماتشا مختارة بعناية —<br />من اليابان إلى كوبك."
          </p>
          <p style={{
            fontFamily: "'IBM Plex Sans Arabic', sans-serif",
            fontSize: "0.85rem", color: "#9BA17B",
            letterSpacing: "0.04em", lineHeight: 1.8,
          }}>
            من مزارع شيزوكا وأوجي إلى يديك — لكل تحضير صنف، ولكل لحظة نكهة.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          02 — THE TIN (360° product)
      ══════════════════════════════════════════════ */}
      <section className="section" style={{ background: "#F2EADB" }}>
        <div className="container">
          <SectionLabel num="02" en="THE TIN" />

          <div className="grid-2col" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "5rem", alignItems: "center",
          }}>
            {/* Left: product images */}
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "2rem", height: 480 }}>
                <img
                  src="/assets/packaging/uji-tin-side-transparent.png"
                  alt=""
                  style={{ height: "55%", objectFit: "contain", opacity: 0.5, transform: "perspective(600px) rotateY(30deg)" }}
                />
                <img
                  src="/assets/packaging/uji-tin-front-transparent.png"
                  alt="علبة UJI الأمامية"
                  style={{ height: "85%", objectFit: "contain", filter: "drop-shadow(0 24px 48px rgba(22,40,29,0.12))" }}
                />
                <img
                  src="/assets/packaging/uji-tin-back-transparent.png"
                  alt=""
                  style={{ height: "55%", objectFit: "contain", opacity: 0.5, transform: "perspective(600px) rotateY(-30deg)" }}
                />
              </div>
            </div>

            {/* Right: annotations */}
            <div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                fontWeight: 300, color: "#1C201B",
                marginBottom: "0.75rem", lineHeight: 1.2,
              }}>
                علبة مصممة<br />بعناية فائقة.
              </h2>
              <p style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                fontSize: "0.85rem", color: "#9BA17B",
                lineHeight: 1.8, marginBottom: "3rem",
              }}>
                30 جراماً من ماتشا احتفالية نقية — محمية في علبة معدنية محكمة الإغلاق تحافظ على النكهة والأخضر الحي.
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
                    <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: "0.88rem", color: "#1C201B" }}>{ar}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9BA17B" }}>{en}</span>
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
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              fontWeight: 300, color: "#F2EADB", lineHeight: 1.15,
            }}>
              ماتشا مختارة بعناية<br />
              <em>لكل طريقة تحضير.</em>
            </h2>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              fontSize: "0.88rem", color: "rgba(155,161,123,0.85)", lineHeight: 1.9,
            }}>
              سواء كنت تعدّها لنفسك أو تشاركها في تجمع — كل صنف من ماتشا UJI مختار بدقة من مزارع اليابان، ومنها مزارع شيزوكا الشهيرة، ليناسب كل ذوق وكل أسلوب تحضير.
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
                title: "من مزارع شيزوكا وأوجي",
                body: "نختار من أبرز مزارع اليابان — شيزوكا وأوجي — حيث يُزرع أجود الشاي منذ قرون.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="14" cy="14" r="5"/><path d="M14 2v4M14 22v4M2 14h4M22 14h4M6 6l3 3M19 19l3 3M6 22l3-3M19 9l3-3"/>
                  </svg>
                ),
                title: "لكل أسلوب تحضير",
                body: "من الماتشا اللاتيه إلى الريتشوال الياباني الكلاسيكي — عندنا الصنف المناسب لك.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M5 14h18M12 7l7 7-7 7"/>
                  </svg>
                ),
                title: "للأفراد والتجمعات",
                body: "سواء كنت تبدأ يومك بهدوء أو تشارك لحظة مميزة مع أشخاص تحبهم — الماتشا لكل المناسبات.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M7 20l5-14 5 14"/><path d="M9 15h10"/>
                  </svg>
                ),
                title: "نقية 100% بلا إضافات",
                body: "بدون سكر، نكهات اصطناعية أو مواد حافظة — ماتشا خالصة من قلب اليابان إلى كوبك.",
              },
            ].map(({ icon, title, body }) => (
              <FeatureTile key={title} icon={icon} title={title} body={body} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          04 — THE COLLECTION
      ══════════════════════════════════════════════ */}
      <section className="section" style={{ background: "#F2EADB" }}>
        <div className="container">
          <SectionLabel num="04" en="THE COLLECTION" />

          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            marginBottom: "4rem", flexWrap: "wrap", gap: "1.5rem",
          }}>
            <div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                fontWeight: 300, color: "#1C201B", lineHeight: 1.2,
                marginBottom: "0.75rem",
              }}>المجموعة</h2>
              <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: "0.85rem", color: "#9BA17B" }}>
                كل ما تحتاجه لبدء ريتشوال الماتشا الخاص بك.
              </p>
            </div>
            <Link href="/products" style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#1F3929",
            }}>
              عرض الكل <ArrowLeft size={14} strokeWidth={1.5} />
            </Link>
          </div>

          {products?.length > 0 ? (
            <div className="grid-products">
              {products.slice(0, 4).map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {[
                { name: "ماتشا احتفالية", sub: "Ceremonial Matcha Tin", price: "89", img: "/assets/packaging/uji-tin-front-transparent.png" },
                { name: "مخفقة الخيزران", sub: "Bamboo Whisk", price: "45", img: "/assets/products/uji-product-bamboo-whisk-transparent.png" },
                { name: "طقم البداية", sub: "Starter Set", price: "149", img: "/assets/packaging/uji-tin-open-transparent.png" },
              ].map(({ name, sub, price, img }) => (
                <div key={name} style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.25)" }}>
                  <div style={{ aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#F2EADB" }}>
                    <img src={img} alt={name} style={{ width: "70%", height: "70%", objectFit: "contain" }} />
                  </div>
                  <div style={{ padding: "1.25rem 1.5rem 1.75rem" }}>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#9BA17B", textTransform: "uppercase", marginBottom: "0.5rem" }}>MATCHA</p>
                    <h3 style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.95rem", fontWeight: 400, color: "#1C201B", marginBottom: "0.25rem" }}>{name}</h3>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.65rem", color: "#C8BBA4", letterSpacing: "0.08em", marginBottom: "1rem" }}>{sub}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid rgba(200,187,164,0.25)" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "#1F3929" }}>{price} <span style={{ fontSize: "0.7rem", fontFamily: "'Inter',sans-serif" }}>ر.س</span></span>
                      <Link href="/products" className="btn-outline" style={{ height: 36, padding: "0 1rem", fontSize: "0.6rem" }}>أضف</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          05 — THE RITUAL
      ══════════════════════════════════════════════ */}
      <section className="section" style={{ background: "#F7F2E8", borderTop: "1px solid rgba(200,187,164,0.3)" }}>
        <div className="container">
          <SectionLabel num="05" en="THE RITUAL" />

          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <div>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 3vw, 2.8rem)",
                fontWeight: 300, fontStyle: "italic",
                color: "#4C5734", lineHeight: 1.3, marginBottom: "2rem",
              }}>
                "تباطأ.<br />تذوّق الماتشا."
              </p>
              <p style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                fontSize: "0.85rem", lineHeight: 1.9, color: "#9BA17B",
                marginBottom: "3rem",
              }}>
                الماتشا ليست مجرد مشروب — إنها لحظة تتوقف فيها عن كل شيء وتحضر في اللحظة الراهنة. من تحضير المسحوق إلى أول رشفة دافئة.
              </p>
              <Link href="/ritual" className="btn-outline">دليل الريتشوال</Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", height: 520 }}>
              <img src="/assets/lifestyle/uji-lifestyle-hijabi-bag.png" alt="أسلوب حياة UJI" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <img src="/assets/lifestyle/uji-lifestyle-car-window-01.png" alt="كوب UJI" style={{ width: "100%", height: "60%", objectFit: "cover" }} />
                <div style={{ flex: 1, background: "#16281D", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300, fontStyle: "italic", color: "#9BA17B", textAlign: "center", lineHeight: 1.4 }}>
                    صُنعت<br />لريتشوالك.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRUST BAR — below position ══ */}
      {(badgesPosition === "below" || badgesPosition === "both") && <TrustBar badges={trustBadges} />}

      {/* ══════════════════════════════════════════════
          06 — MATCHA FINDER
      ══════════════════════════════════════════════ */}
      <MatchaFinder />

      {/* 07 — NEWSLETTER */}
      <Newsletter />

    </div>
  );
}
