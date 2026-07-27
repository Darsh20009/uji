import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import MatchaFinder from "../components/MatchaFinder";
import { ArrowLeft } from "lucide-react";
import { EditableText } from "../components/editor/EditableText";
import { EditableImage } from "../components/editor/EditableImage";
import { EditableSection } from "../components/editor/EditableSection";
import { useSiteContent } from "../context/SiteContentContext";

/* ─── Section label ─── */
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
function FeatureTile({ icon, titleKey, bodyKey, defaultTitle, defaultBody }: {
  icon: React.ReactNode; titleKey: string; bodyKey: string;
  defaultTitle: string; defaultBody: string;
}) {
  return (
    <div style={{
      padding: "2.5rem 2rem",
      border: "1px solid rgba(155,161,123,0.15)",
      background: "rgba(31,57,41,0.4)",
      display: "flex", flexDirection: "column", gap: "1.25rem",
    }}>
      <div style={{ color: "#9BA17B" }}>{icon}</div>
      <EditableText
        contentKey={titleKey} defaultValue={defaultTitle} as="h3"
        label="عنوان الميزة"
        style={{ fontFamily: "'Mirza', serif", fontSize: "1.4rem", fontWeight: 300, color: "#F2EADB", lineHeight: 1.3 }}
      />
      <EditableText
        contentKey={bodyKey} defaultValue={defaultBody} multiline as="p"
        label="وصف الميزة"
        style={{ fontFamily: "'Mirza', serif", fontSize: "0.82rem", lineHeight: 1.8, color: "rgba(155,161,123,0.85)" }}
      />
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
    <section className="section" style={{ background: "#F2EADB", borderTop: "1px solid rgba(200,187,164,0.3)", textAlign: "center" }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <EditableText
          contentKey="home.newsletter.heading" defaultValue="نشرة بريدية" as="h2"
          label="عنوان النشرة"
          style={{
            fontFamily: "'Mirza', serif",
            fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
            fontWeight: 400, color: "#1C201B", marginBottom: "1rem", lineHeight: 1.15,
          }}
        />
        <EditableText
          contentKey="home.newsletter.body"
          defaultValue="كل ما تحتاج معرفته عن عالم الماتشا — ريتشوالات، مقالات من المجلة، وإصدارات حصرية. بدون ضجيج."
          multiline as="p" label="وصف النشرة"
          style={{
            fontFamily: "'Mirza', serif", fontSize: "0.9rem",
            color: "#9BA17B", lineHeight: 1.85,
            marginBottom: "3rem", maxWidth: 460, margin: "0 auto 3rem",
          }}
        />
        {status === "done" ? (
          <p style={{ fontFamily: "'Mirza', serif", fontSize: "1.3rem", fontWeight: 300, color: "#1F3929" }}>
            أهلاً بك في عائلة UJI
          </p>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", gap: "0", maxWidth: 480, margin: "0 auto" }}>
            <input
              type="email" placeholder="بريدك الإلكتروني"
              value={email} onChange={e => setEmail(e.target.value)} required
              style={{
                flex: 1, height: 52, border: "1px solid rgba(200,187,164,0.5)",
                borderLeft: "none", background: "#F7F2E8",
                fontFamily: "'Mirza', serif", fontSize: "0.85rem", color: "#1C201B",
                padding: "0 1.25rem", outline: "none", borderRadius: 0,
              }}
            />
            <button type="submit" disabled={status === "loading"} className="btn-primary"
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
const TRUST_ICONS = [
  <svg key="delivery" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="7" width="16" height="12" rx="1.5"/><path d="M17 10h4l4 4v5h-8V10z"/><circle cx="6.5" cy="21" r="2"/><circle cx="21.5" cy="21" r="2"/>
  </svg>,
  <svg key="secure" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2L4 6v7c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V6L14 2z"/><path d="M9 14l3.5 3.5L19 11"/>
  </svg>,
  <svg key="return" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14A10 10 0 1 0 6 7.5"/><path d="M4 4v4h4"/>
  </svg>,
];

const DEFAULT_BADGES = [
  { icon: "🚚", title: "يوصلك خلال", value: "١–٣ أيام", enabled: true },
  { icon: "🔒", title: "الدفع",       value: "آمن ومشفّر", enabled: true },
  { icon: "↩️",  title: "الاسترجاع",  value: "يوم واحد",  enabled: true },
];

function TrustBar({ badges }: { badges?: typeof DEFAULT_BADGES }) {
  const list = (badges && badges.length ? badges : DEFAULT_BADGES).filter(b => b.enabled !== false);
  if (!list.length) return null;
  return (
    <section style={{ background: "#1F3929" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch" }}>
          {list.map((b, i) => (
            <div key={i} style={{
              flex: "1 1 0", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "0.6rem",
              padding: "1.6rem 1rem",
              borderLeft: i < list.length - 1 ? "1px solid rgba(242,234,219,0.12)" : "none",
              textAlign: "center",
            }}>
              <span style={{ color: "#9BA17B", lineHeight: 0, flexShrink: 0 }}>
                {TRUST_ICONS[i] ?? TRUST_ICONS[0]}
              </span>
              <p style={{ fontFamily: "'Mirza', serif", fontSize: "1rem", fontWeight: 600, color: "#F2EADB", margin: 0, lineHeight: 1.2 }}>
                {b.value}
              </p>
              <p style={{ fontFamily: "'Mirza', serif", fontSize: "0.75rem", color: "rgba(155,161,123,0.85)", margin: 0 }}>
                {b.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { getContent } = useSiteContent();

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

  const heroImage = getContent("home.hero.image", "/assets/hero/uji-banner-matcha-powder.jpg");

  return (
    <div style={{ background: "#F2EADB" }}>

      {/* ══ 01 — HERO ══ */}
      <section
        ref={heroRef}
        style={{ position: "relative", minHeight: "65vh", display: "flex", alignItems: "center", overflow: "hidden" }}
      >
        {/* Background — editable image */}
        <EditableImage
          contentKey="home.hero.image"
          defaultSrc="/assets/hero/uji-banner-matcha-powder.jpg"
          alt="Hero"
          style={{ position: "absolute", inset: 0 }}
          imgStyle={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(270deg, rgba(16,30,22,0.82) 0%, rgba(16,30,22,0.5) 50%, rgba(16,30,22,0.15) 100%)" }} className="hero-overlay-desktop" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(16,30,22,0.92) 0%, rgba(16,30,22,0.65) 50%, rgba(16,30,22,0.25) 100%)" }} className="hero-overlay-mobile" />

        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 80, paddingBottom: 40 }}>
          <div style={{ maxWidth: 560 }}>
            <EditableText
              contentKey="home.hero.eyebrow" defaultValue="CEREMONIAL JAPANESE MATCHA"
              label="النص العلوي للهيرو"
              style={{
                fontFamily: "'Cascadia Code', monospace", fontSize: "0.6rem",
                letterSpacing: "0.3em", textTransform: "uppercase",
                color: "rgba(155,161,123,0.9)", marginBottom: "2rem", display: "block",
                animation: "heroFadeUp 0.9s ease 0.1s both",
              }}
            />
            <EditableText
              contentKey="home.hero.title"
              defaultValue={"تجربة الماتشا\nاليابانية الحقيقية"}
              multiline as="h1" label="عنوان الهيرو الرئيسي"
              style={{
                fontFamily: "'Mirza', serif", fontSize: "clamp(3rem, 6vw, 5.5rem)",
                fontWeight: 300, lineHeight: 1.1, color: "#F2EADB",
                marginBottom: "1.75rem", animation: "heroFadeUp 1s ease 0.25s both",
              }}
            />
            <EditableText
              contentKey="home.hero.description"
              defaultValue={"ماتشا احتفالية من مستوى الدرجة الأولى، مزروعة في شيزوكا\nومصممة لريتشوالك اليومي."}
              multiline as="p" label="وصف الهيرو"
              style={{
                fontFamily: "'Mirza', serif", fontSize: "0.95rem", lineHeight: 1.9,
                fontWeight: 300, color: "rgba(242,234,219,0.82)",
                marginBottom: "2.5rem", maxWidth: 420,
                animation: "heroFadeUp 1s ease 0.4s both",
              }}
            />
            <div className="hero-buttons" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", animation: "heroFadeUp 1s ease 0.55s both" }}>
              <Link href="/about" className="btn-primary">
                <EditableText contentKey="home.hero.btn1" defaultValue="اكتشف UJI" label="زر الهيرو الأول" />
              </Link>
              <Link href="/products" className="btn-ghost">
                <EditableText contentKey="home.hero.btn2" defaultValue="تسوق الماتشا" label="زر الهيرو الثاني" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "1.75rem", left: "50%", transform: "translateX(-50%)",
          zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem",
          animation: "heroFadeUp 1s ease 1s both",
        }}>
          <span style={{ fontFamily: "'Cascadia Code', monospace", fontSize: "0.5rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(242,234,219,0.55)" }}>SCROLL</span>
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none" style={{ animation: "scrollBounce 1.8s ease-in-out infinite" }}>
            <rect x="1" y="1" width="14" height="20" rx="7" stroke="rgba(242,234,219,0.4)" strokeWidth="1.2"/>
            <rect x="7" y="5" width="2" height="5" rx="1" fill="rgba(242,234,219,0.7)" style={{ animation: "scrollDot 1.8s ease-in-out infinite" }}/>
          </svg>
        </div>

        <style>{`
          @keyframes heroFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
          @keyframes scrollBounce { 0%,100%{transform:translateY(0);opacity:0.7} 50%{transform:translateY(5px);opacity:1} }
          @keyframes scrollDot { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(3px);opacity:0.5} }
        `}</style>
      </section>

      {/* ══ TRUST BAR ══ */}
      <TrustBar badges={trustBadges} />

      {/* ══ PRODUCTS ══ */}
      <section id="products" style={{ background: "#F7F2E8", padding: "2rem 0 5rem", borderTop: "3px solid #1F3929" }}>
        <div className="container">
          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem",
            paddingBottom: "1.5rem", borderBottom: "1px solid rgba(200,187,164,0.4)",
          }}>
            <div>
              <EditableText
                contentKey="home.products.eyebrow" defaultValue="THE COLLECTION" label="عنوان صغير للمنتجات"
                style={{ fontFamily: "'Cascadia Code', monospace", fontSize: "0.55rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#9BA17B", marginBottom: "0.6rem", display: "block" }}
              />
              <EditableText
                contentKey="home.products.title" defaultValue="منتجاتنا" as="h2" label="عنوان قسم المنتجات"
                style={{ fontFamily: "'Mirza', serif", fontSize: "clamp(2.2rem, 3.5vw, 3rem)", fontWeight: 400, color: "#1C201B", lineHeight: 1.1, margin: 0 }}
              />
            </div>
            <Link href="/products" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontFamily: "'Mirza', serif", fontSize: "0.85rem",
              color: "#1F3929", border: "1px solid rgba(31,57,41,0.45)", padding: "0.65rem 1.4rem",
            }}>
              عرض جميع المنتجات <ArrowLeft size={14} strokeWidth={1.5} />
            </Link>
          </div>

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
                  <div style={{ aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
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

          <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(200,187,164,0.3)" }}>
            <Link href="/products" className="btn-primary" style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center", height: 52, padding: "0 2.5rem", fontSize: "0.9rem" }}>
              تسوق جميع منتجات UJI <ArrowLeft size={15} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 02 — THE TIN ══ */}
      <EditableSection contentKey="home.section.tin" label="قسم الماتشا" defaultVisible={true}>
        <section className="section" style={{ background: "#F2EADB" }}>
          <div className="container">
            <SectionLabel num="02" en="THE MATCHA" />
            <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
              {/* Image */}
              <div style={{ position: "relative", height: 480, borderRadius: 4, overflow: "hidden" }}>
                <EditableImage
                  contentKey="home.tin.image"
                  defaultSrc="/assets/packaging/uji-tin-hero.png"
                  alt="ماتشا UJI"
                  style={{ position: "absolute", inset: 0 }}
                  imgStyle={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #F2EADB 0%, transparent 18%, transparent 82%, #F2EADB 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #F2EADB 0%, transparent 15%, transparent 82%, #F2EADB 100%)", pointerEvents: "none" }} />
              </div>
              {/* Text */}
              <div>
                <EditableText
                  contentKey="home.tin.title"
                  defaultValue={"ماتشا احتفالية\nبجودة استثنائية."}
                  multiline as="h2" label="عنوان قسم الماتشا"
                  style={{ fontFamily: "'Mirza', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 300, color: "#1C201B", marginBottom: "0.75rem", lineHeight: 1.2 }}
                />
                <EditableText
                  contentKey="home.tin.body"
                  defaultValue="مسحوق ماتشا ياباني أصلي من الدرجة الاحتفالية، مطحون بالحجر من أوراق الشاي المظللة للحصول على أعمق نكهة وأغنى لون أخضر."
                  multiline as="p" label="وصف قسم الماتشا"
                  style={{ fontFamily: "'Mirza', serif", fontSize: "0.85rem", color: "#9BA17B", lineHeight: 1.8, marginBottom: "3rem" }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {[
                    { en: "Ceremonial Grade", ar: "درجة احتفالية" },
                    { en: "Stone Ground",     ar: "طحن بالحجر" },
                    { en: "Shade Grown",      ar: "نمو في الظل" },
                    { en: "Single Origin",    ar: "مصدر واحد" },
                    { en: "30g Pure Matcha",  ar: "30 جرام ماتشا نقية" },
                  ].map(({ en, ar }) => (
                    <div key={en} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0", borderBottom: "1px solid rgba(200,187,164,0.3)" }}>
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
      </EditableSection>

      {/* ══ 03 — WHY UJI ══ */}
      <EditableSection contentKey="home.section.whyuji" label="قسم لماذا UJI" defaultVisible={true}>
        <section className="section" style={{ background: "#16281D" }}>
          <div className="container">
            <SectionLabel num="03" en="WHY UJI MATCHA" />
            <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "end", marginBottom: "5rem" }}>
              <EditableText
                contentKey="home.whyuji.title"
                defaultValue={"ماتشا مختارة بعناية\nلكل طريقة تحضير."}
                multiline as="h2" label="عنوان قسم لماذا UJI"
                style={{ fontFamily: "'Mirza', serif", fontSize: "clamp(2.2rem, 4vw, 3.5rem)", fontWeight: 300, color: "#F2EADB", lineHeight: 1.15 }}
              />
              <EditableText
                contentKey="home.whyuji.body"
                defaultValue="سواء كنت تعدّها لنفسك أو تشاركها في تجمع، كل صنف من ماتشا UJI مختار بدقة من مزارع اليابان، ومنها مزارع شيزوكا الشهيرة، ليناسب كل ذوق وكل أسلوب تحضير."
                multiline as="p" label="وصف قسم لماذا UJI"
                style={{ fontFamily: "'Mirza', serif", fontSize: "0.88rem", color: "rgba(155,161,123,0.85)", lineHeight: 1.9 }}
              />
            </div>
            <div className="grid-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "rgba(155,161,123,0.12)" }}>
              <FeatureTile
                icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M14 3C8 3 4 8 4 14s4 11 10 11 10-5 10-11"/><path d="M14 3v6M20 5l-4 5"/></svg>}
                titleKey="home.whyuji.tile.0.title" defaultTitle="من مزارع شيزوكا اليابانية"
                bodyKey="home.whyuji.tile.0.body" defaultBody="نختار من أبرز مزارع شيزوكا في اليابان، حيث يُزرع أجود الشاي منذ قرون."
              />
              <FeatureTile
                icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="14" cy="14" r="5"/><path d="M14 2v4M14 22v4M2 14h4M22 14h4M6 6l3 3M19 19l3 3M6 22l3-3M19 9l3-3"/></svg>}
                titleKey="home.whyuji.tile.1.title" defaultTitle="لكل أسلوب تحضير"
                bodyKey="home.whyuji.tile.1.body" defaultBody="من الماتشا اللاتيه إلى الريتشوال الياباني الكلاسيكي، عندنا الصنف المناسب لك."
              />
              <FeatureTile
                icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M5 14h18M12 7l7 7-7 7"/></svg>}
                titleKey="home.whyuji.tile.2.title" defaultTitle="للأفراد والتجمعات"
                bodyKey="home.whyuji.tile.2.body" defaultBody="سواء كنت تبدأ يومك بهدوء أو تشارك لحظة مميزة مع أشخاص تحبهم، الماتشا لكل المناسبات."
              />
              <FeatureTile
                icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M7 20l5-14 5 14"/><path d="M9 15h10"/></svg>}
                titleKey="home.whyuji.tile.3.title" defaultTitle="نقية 100% بلا إضافات"
                bodyKey="home.whyuji.tile.3.body" defaultBody="بدون سكر أو نكهات اصطناعية أو مواد حافظة. ماتشا خالصة من قلب اليابان إلى كوبك."
              />
            </div>
          </div>
        </section>
      </EditableSection>

      {/* ══ 04 — MATCHA FINDER ══ */}
      <EditableSection contentKey="home.section.finder" label="اختبار الماتشا" defaultVisible={true}>
        <MatchaFinder />
      </EditableSection>

      {/* ══ 05 — THE RITUAL ══ */}
      <EditableSection contentKey="home.section.ritual" label="قسم الريتشوال" defaultVisible={true}>
        <section className="section" style={{ background: "#F7F2E8", borderTop: "1px solid rgba(200,187,164,0.3)" }}>
          <div className="container">
            <SectionLabel num="05" en="THE RITUAL" />
            <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
              <EditableText
                contentKey="home.ritual.quote" defaultValue="تباطأ. تذوّق الماتشا." as="p"
                label="اقتباس الريتشوال"
                style={{ fontFamily: "'Mirza', serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", fontWeight: 300, color: "#4C5734", lineHeight: 1.3, marginBottom: "2rem" }}
              />
              <EditableText
                contentKey="home.ritual.body"
                defaultValue="الماتشا ليست مجرد مشروب. إنها لحظة تتوقف فيها عن كل شيء وتحضر في اللحظة الراهنة. من تحضير المسحوق إلى أول رشفة دافئة."
                multiline as="p" label="وصف الريتشوال"
                style={{ fontFamily: "'Mirza', serif", fontSize: "0.85rem", lineHeight: 1.9, color: "#9BA17B", marginBottom: "3rem" }}
              />
              <Link href="/ritual" className="btn-outline">دليل الريتشوال</Link>
            </div>
          </div>
        </section>
      </EditableSection>

      {/* ══ TRUST BAR — below ══ */}
      {(badgesPosition === "below" || badgesPosition === "both") && <TrustBar badges={trustBadges} />}

      {/* ══ NEWSLETTER ══ */}
      <Newsletter />
    </div>
  );
}
