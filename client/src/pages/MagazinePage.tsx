import { useState } from "react";

const articles = [
  {
    id: 1,
    tag: "أصول",
    title: "من أوجي إلى العالم — قصة المدينة التي اخترعت الماتشا",
    excerpt: "في القرن الثاني عشر، حمل الراهب البوذي ايساي بذور الشاي الأخضر من الصين إلى اليابان. لكن أوجي هي التي حوّلته إلى فن.",
    read: "٥ دقائق",
    img: "/assets/magazine/mag-storefront.png",
    featured: true,
  },
  {
    id: 2,
    tag: "صحة",
    title: "L-Theanine: السر وراء هدوء الماتشا",
    excerpt: "الكافيين وحده يعطيك طاقة مع توتر — لكن الماتشا تحتوي على L-Theanine الذي يوازن التأثير ويمنحك تركيزاً صافياً.",
    read: "٣ دقائق",
    img: "/assets/magazine/mag-iced-matcha.png",
  },
  {
    id: 3,
    tag: "ريتشوال",
    title: "الفرق بين الدرجة الاحتفالية ودرجة الطهي",
    excerpt: "ليست كل الماتشا واحدة. الدرجة الاحتفالية مصنوعة من أصغر الأوراق وأكثرها ظلاً — والفرق يُرى ويُشرب.",
    read: "٤ دقائق",
    img: "/assets/magazine/mag-man-bench.png",
  },
  {
    id: 4,
    tag: "وصفة",
    title: "Matcha Latte المثالي — خطوة بخطوة",
    excerpt: "ليس مجرد خفق الماتشا في الحليب. النسب، درجة الحرارة، ونوع الحليب — كل تفصيلة تصنع الفرق.",
    read: "٣ دقائق",
    img: "/assets/magazine/mag-product-lineup.png",
  },
  {
    id: 5,
    tag: "ثقافة",
    title: "حفل الشاي الياباني — Chado طريق الشاي",
    excerpt: "Chado ليس مجرد شرب شاي. إنه فلسفة مبنية على أربع قيم: الانسجام، الاحترام، النقاء، والهدوء.",
    read: "٦ دقائق",
    img: "/assets/magazine/mag-night-store.png",
  },
  {
    id: 6,
    tag: "برند",
    title: "قصة علامة UJI — كيف وُلد التصميم من الهوية",
    excerpt: "كل منحنى في الشعار له معنى. الاتصال السلس، الـ serif الأنيق، وورقة الشاي — ثلاثة عناصر تحكي قصة مدينة.",
    read: "٤ دقائق",
    img: "/assets/magazine/mag-man-bag.png",
  },
];

const tagColors: Record<string, { bg: string; text: string }> = {
  "أصول":    { bg: "#1F3929", text: "#F2EADB" },
  "صحة":     { bg: "#4C5734", text: "#F2EADB" },
  "ريتشوال": { bg: "#9BA17B", text: "#1C201B" },
  "وصفة":    { bg: "#C89B5A", text: "#fff" },
  "ثقافة":   { bg: "#1F3929", text: "#F2EADB" },
  "برند":    { bg: "#1C201B", text: "#F2EADB" },
};

export default function MagazinePage() {
  const featured = articles.find(a => a.featured)!;
  const rest = articles.filter(a => !a.featured);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="magazine-page" style={{ background: "#F2EADB", minHeight: "100vh", direction: "rtl" }}>

      {/* ══ HERO — cinematic street walk ══ */}
      <div className="mag-hero" style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}>
        <img
          src="/assets/magazine/mag-street-walk.png"
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(22,40,29,0.92) 0%, rgba(22,40,29,0.45) 50%, rgba(22,40,29,0.15) 100%)",
        }} />
        <div style={{
          position: "absolute", bottom: "3.5rem", right: 0, left: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          padding: "0 1.5rem",
        }}>
          <p style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: "0.58rem", letterSpacing: "0.5em",
            color: "#9BA17B", marginBottom: "1.25rem",
            textTransform: "uppercase",
          }}>THE UJI JOURNAL — العدد الأول</p>
          <h1 style={{
            fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
            fontSize: "clamp(3.5rem,9vw,7rem)",
            fontWeight: 700, color: "#F2EADB",
            lineHeight: 1.05, margin: "0 0 1.25rem",
            letterSpacing: "-0.01em",
          }}>عالم الماتشا</h1>
          <p style={{
            fontFamily: "'IBM Plex Sans Arabic',sans-serif",
            fontSize: "0.95rem", color: "rgba(242,234,219,0.75)",
            maxWidth: 400, lineHeight: 1.8,
          }}>قصص، ثقافة، وعلوم من قلب اليابان</p>
          {/* Scroll indicator */}
          <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.5rem", letterSpacing: "0.4em", color: "rgba(242,234,219,0.45)" }}>SCROLL</p>
            <div style={{ width: 1, height: 40, background: "rgba(242,234,219,0.35)", animation: "fadeScroll 1.8s ease-in-out infinite" }} />
          </div>
        </div>
      </div>

      {/* ══ BRAND IDENTITY FULL-WIDTH ══ */}
      <div className="mag-brand-banner" style={{ position: "relative", width: "100%", overflow: "hidden", display: "flex" }}>
        <img
          src="/assets/magazine/mag-brand-identity.png"
          alt="UJI Brand Identity"
          style={{ width: "100%", height: "clamp(320px,50vw,640px)", objectFit: "cover", objectPosition: "center", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(270deg, rgba(22,40,29,0) 50%, rgba(22,40,29,0.75) 100%)",
          display: "flex", alignItems: "center",
        }}>
          <div style={{ padding: "3rem 4rem", maxWidth: 420 }}>
            <p style={{
              fontFamily: "'DM Mono',monospace", fontSize: "0.52rem",
              letterSpacing: "0.45em", color: "#9BA17B", marginBottom: "1rem",
              textTransform: "uppercase",
            }}>✦ CRAFTED IN JAPAN — SINCE 2026</p>
            <h2 style={{
              fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
              fontSize: "clamp(1.8rem,3.5vw,3rem)",
              color: "#F2EADB", fontWeight: 700, lineHeight: 1.2, marginBottom: "1rem",
            }}>ماتشا نُشِئت من الحرفية والتقليد</h2>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic',sans-serif",
              fontSize: "0.88rem", color: "rgba(242,234,219,0.7)", lineHeight: 1.9,
            }}>كل علبة تحمل ثمانمائة سنة من فن زراعة الشاي في أوجي، اليابان.</p>
          </div>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="mag-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>

        {/* ── "ما معنى UJI?" EDITORIAL INSERT ── */}
        <div className="mag-meaning" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, margin: "0 0 0" }}>
          <div className="mag-copy-panel" style={{
            background: "#16281D", padding: "4rem 3.5rem",
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            <p style={{
              fontFamily: "'DM Mono',monospace", fontSize: "0.52rem",
              letterSpacing: "0.4em", color: "#9BA17B", marginBottom: "1.5rem",
            }}>✦ عن الاسم</p>
            <h2 style={{
              fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
              fontSize: "clamp(2rem,4vw,3.5rem)",
              color: "#F2EADB", fontWeight: 700, lineHeight: 1.15, marginBottom: "1.25rem",
            }}>ما معنى<br />UJI؟</h2>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic',sans-serif",
              fontSize: "0.88rem", color: "rgba(242,234,219,0.7)",
              lineHeight: 1.9, marginBottom: "2rem",
            }}>
              أوجي مدينة تاريخية جنوب كيوتو، تُعرف عالمياً بأنها موطن أجود أنواع الماتشا والشاي الأخضر منذ أكثر من ٨٠٠ عام.
            </p>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic',sans-serif",
              fontSize: "0.82rem", color: "rgba(155,161,123,0.85)",
              lineHeight: 1.85,
            }}>
              تشتهر بمناخها المثالي وتربتها الغنية وأساليب زراعة الشاي التقليدية التي تُنتج ماتشا ذات جودة استثنائية.
            </p>
          </div>
          <div className="mag-image-panel" style={{ overflow: "hidden", minHeight: 420 }}>
            <img
              src="/assets/magazine/mag-uji-meaning.png"
              alt="ما معنى UJI؟"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>

        {/* ── FEATURED ARTICLE ── */}
        <div className="mag-featured" style={{ margin: "0 0 0" }}>
          <div style={{
            position: "relative", minHeight: 520, overflow: "hidden",
            display: "grid", gridTemplateColumns: "1fr 1fr",
          }}>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src={featured.img}
                alt={featured.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(22,40,29,0.25)",
              }} />
            </div>
            <div style={{
              background: "#1C201B", padding: "4rem 3.5rem",
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <p style={{
                fontFamily: "'DM Mono',monospace", fontSize: "0.52rem",
                letterSpacing: "0.4em", color: "#9BA17B", marginBottom: "1rem",
              }}>✦ المقال المميز</p>
              <span style={{
                display: "inline-block", alignSelf: "flex-start",
                background: "#1F3929", color: "#9BA17B",
                fontFamily: "'DM Mono',monospace", fontSize: "0.5rem",
                letterSpacing: "0.3em", padding: "5px 14px", marginBottom: "1.5rem",
                border: "1px solid rgba(155,161,123,0.3)",
              }}>{featured.tag}</span>
              <h2 style={{
                fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
                fontSize: "clamp(1.6rem,2.8vw,2.5rem)",
                fontWeight: 700, color: "#F2EADB",
                lineHeight: 1.3, marginBottom: "1.5rem",
              }}>{featured.title}</h2>
              <p style={{
                fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                fontSize: "0.88rem", color: "rgba(242,234,219,0.65)",
                lineHeight: 1.9, marginBottom: "2rem",
              }}>{featured.excerpt}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ width: 32, height: 1, background: "#9BA17B" }} />
                <span style={{
                  fontFamily: "'DM Mono',monospace", fontSize: "0.55rem",
                  letterSpacing: "0.2em", color: "#9BA17B",
                }}>قراءة {featured.read}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3-IMAGE ROW: bench / newspaper / night ── */}
        <div className="mag-photo-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
          {[
            { img: "/assets/magazine/mag-man-bench.png", pos: "center top" },
            { img: "/assets/magazine/mag-newspaper.png", pos: "center" },
            { img: "/assets/magazine/mag-night-store.png", pos: "center" },
          ].map((item, i) => (
            <div key={i} style={{ overflow: "hidden", height: 360 }}>
              <img
                src={item.img}
                alt=""
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  objectPosition: item.pos, display: "block",
                  transition: "transform 0.7s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          ))}
        </div>

        {/* ── LOGO DESIGN EDITORIAL ── */}
        <div className="mag-logo-section" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <div className="mag-image-panel" style={{ overflow: "hidden", minHeight: 480 }}>
            <img
              src="/assets/magazine/mag-logo-design.png"
              alt="UJI Logo Design"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <div className="mag-copy-panel" style={{
            background: "#F7F2E8", padding: "4rem 3.5rem",
            display: "flex", flexDirection: "column", justifyContent: "center",
            borderRight: "1px solid rgba(200,187,164,0.4)",
          }}>
            <p style={{
              fontFamily: "'DM Mono',monospace", fontSize: "0.52rem",
              letterSpacing: "0.4em", color: "#9BA17B", marginBottom: "1.5rem",
            }}>✦ الهوية البصرية</p>
            <h2 style={{
              fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
              fontSize: "clamp(1.8rem,3vw,2.8rem)",
              color: "#1C201B", fontWeight: 700,
              lineHeight: 1.25, marginBottom: "1.25rem",
            }}>تصميم وُلد<br />من المعنى</h2>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic',sans-serif",
              fontSize: "0.88rem", color: "#9BA17B",
              lineHeight: 1.9, marginBottom: "1rem",
            }}>
              الاتصال السلس يعكس انسياب الشاي. الـ Serif الأنيق يحاكي عمارة اليابان الكلاسيكية. وورقة الشاي تُكمل القصة.
            </p>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic',sans-serif",
              fontSize: "0.82rem", color: "#C8BBA4",
              lineHeight: 1.85,
            }}>
              كل تفصيلة في الشعار صُممت لتعكس فلسفة UJI — البساطة التي تحمل عمقاً.
            </p>
          </div>
        </div>

        {/* ── NEW UJI EDITORIAL IMAGES ── */}
        <div className="mag-tin-feature" style={{
          display: "grid", gridTemplateColumns: "1.12fr 0.88fr", gap: 0,
          background: "#E9DECB", minHeight: 390,
        }}>
          <div style={{ overflow: "hidden", minHeight: 390 }}>
            <img
              src="/assets/magazine/uji-tin-editorial.png"
              alt="علبة ماتشا UJI — جودة احتفالية"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <div className="mag-tin-copy" style={{
            padding: "3.25rem 3rem", display: "flex",
            flexDirection: "column", justifyContent: "center",
          }}>
            <p style={{
              fontFamily: "'DM Mono',monospace", fontSize: "0.52rem",
              letterSpacing: "0.4em", color: "#7E8962", marginBottom: "1.25rem",
            }}>✦ THE TIN — 01</p>
            <h2 style={{
              fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
              fontSize: "clamp(1.8rem,3.2vw,2.8rem)", color: "#1C201B",
              lineHeight: 1.25, marginBottom: "1rem",
            }}>علبة صُممت<br />بعناية فائقة</h2>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic',sans-serif",
              fontSize: "0.86rem", color: "#6D7559", lineHeight: 1.95,
            }}>من الملمس إلى آخر تفصيلة في الغطاء، صُممت علبة UJI لتحتفظ بنضارة الماتشا وتحضر طقساً جميلاً في كل مرة.</p>
            <span style={{
              marginTop: "1.5rem", fontFamily: "'DM Mono',monospace",
              fontSize: "0.5rem", letterSpacing: "0.25em", color: "#1F3929",
            }}>CEREMONIAL GRADE · STONE GROUND</span>
          </div>
        </div>

        <div className="mag-fields-feature" style={{ position: "relative", overflow: "hidden", minHeight: 420 }}>
          <img
            src="/assets/magazine/uji-fields-editorial.png"
            alt="حقول شاي UJI في اليابان"
            style={{ width: "100%", height: "clamp(360px,42vw,520px)", objectFit: "cover", objectPosition: "center", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, rgba(22,40,29,0.78), rgba(22,40,29,0.08) 72%)",
            display: "flex", alignItems: "center",
          }}>
            <div className="mag-fields-copy" style={{ padding: "3rem 4rem", maxWidth: 420 }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.52rem", letterSpacing: "0.42em", color: "#C8D09F", marginBottom: "1rem" }}>✦ FROM THE SOURCE</p>
              <h2 style={{ fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif", fontSize: "clamp(1.9rem,3.5vw,3rem)", color: "#F2EADB", lineHeight: 1.2, marginBottom: "1rem" }}>من قلب الحقول<br />إلى طقسك اليومي</h2>
              <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.86rem", color: "rgba(242,234,219,0.78)", lineHeight: 1.9 }}>أوجي ليست اسماً على العلبة فقط؛ إنها أرض ومناخ وحرفة تتوارثها الأجيال.</p>
            </div>
          </div>
        </div>

        {/* ── PRODUCT SHOWCASE ── */}
        <div className="mag-showcase" style={{
          position: "relative", overflow: "hidden",
          minHeight: 500,
        }}>
          <img
            src="/assets/magazine/mag-product-lineup.png"
            alt="UJI Product Lineup"
            style={{ width: "100%", height: "clamp(380px,45vw,580px)", objectFit: "cover", objectPosition: "center", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to left, rgba(22,40,29,0) 30%, rgba(22,40,29,0.82) 100%)",
            display: "flex", alignItems: "center",
          }}>
            <div style={{ padding: "3rem 4rem", maxWidth: 440 }}>
              <p style={{
                fontFamily: "'DM Mono',monospace", fontSize: "0.52rem",
                letterSpacing: "0.45em", color: "#9BA17B", marginBottom: "1rem",
              }}>✦ المنتج</p>
              <h2 style={{
                fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
                fontSize: "clamp(1.8rem,3.5vw,3rem)",
                color: "#F2EADB", fontWeight: 700, lineHeight: 1.2, marginBottom: "1rem",
              }}>Matcha Latte المثالي</h2>
              <p style={{
                fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                fontSize: "0.88rem", color: "rgba(242,234,219,0.7)", lineHeight: 1.9,
              }}>النسب، درجة الحرارة، ونوع الحليب — كل تفصيلة تصنع الفرق بين كوب عادي وتجربة لا تُنسى.</p>
            </div>
          </div>
        </div>

        {/* ── ICED MATCHA + ARTICLE GRID ── */}
        <div className="mag-articles" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 0 }}>
          <div style={{ overflow: "hidden" }}>
            <img
              src="/assets/magazine/mag-iced-matcha.png"
              alt="UJI Iced Matcha"
              style={{ width: "100%", height: "100%", minHeight: 500, objectFit: "cover", display: "block" }}
            />
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "#F7F2E8",
          }}>
            {rest.slice(0, 4).map(a => {
              const tc = tagColors[a.tag] || { bg: "#9BA17B", text: "#fff" };
              const isHov = hovered === a.id;
              return (
                <div
                  key={a.id}
                  onMouseEnter={() => setHovered(a.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    padding: "2.5rem 2rem",
                    borderBottom: "1px solid rgba(200,187,164,0.35)",
                    borderLeft: "1px solid rgba(200,187,164,0.35)",
                    cursor: "pointer",
                    transition: "background 0.3s",
                    background: isHov ? "#fff" : "transparent",
                  }}
                >
                  <span style={{
                    display: "inline-block",
                    background: tc.bg, color: tc.text,
                    fontFamily: "'DM Mono',monospace",
                    fontSize: "0.48rem", letterSpacing: "0.25em",
                    padding: "3px 10px", marginBottom: "1rem",
                  }}>{a.tag}</span>
                  <h3 style={{
                    fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
                    fontSize: "1.1rem", fontWeight: 700,
                    color: "#1C201B", lineHeight: 1.4,
                    marginBottom: "0.75rem",
                  }}>{a.title}</h3>
                  <p style={{
                    fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                    fontSize: "0.78rem", color: "#9BA17B",
                    lineHeight: 1.85, marginBottom: "1rem",
                  }}>{a.excerpt}</p>
                  <span style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: "0.52rem", letterSpacing: "0.2em",
                    color: isHov ? "#1F3929" : "#C8BBA4",
                    transition: "color 0.3s",
                  }}>قراءة {a.read}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── LIFESTYLE WIDE ── */}
        <div className="mag-lifestyle" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <div style={{ overflow: "hidden", height: 420 }}>
            <img
              src="/assets/magazine/mag-man-bag.png"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block",
                transition: "transform 0.7s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          <div style={{ overflow: "hidden", height: 420 }}>
            <img
              src="/assets/magazine/mag-storefront-wide.png"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block",
                transition: "transform 0.7s ease", filter: "brightness(0.85)" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>

        {/* ── NEWSLETTER ── */}
        <div className="mag-newsletter" style={{
          background: "#1F3929",
          padding: "5rem 2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "1rem",
        }}>
          <p style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: "0.55rem", letterSpacing: "0.4em",
            color: "#9BA17B",
          }}>✦ النشرة البريدية</p>
          <h3 style={{
            fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
            fontSize: "clamp(1.6rem,3.5vw,2.5rem)",
            color: "#F2EADB", fontWeight: 700, lineHeight: 1.2,
          }}>مقالات جديدة كل أسبوع</h3>
          <p style={{
            fontFamily: "'IBM Plex Sans Arabic',sans-serif",
            fontSize: "0.88rem", color: "rgba(242,234,219,0.55)",
            maxWidth: 380, lineHeight: 1.85,
          }}>اشترك في نشرة UJI وكن أول من يقرأ عالم الماتشا الياباني</p>
          <form
            onSubmit={e => { e.preventDefault(); alert("شكراً! تم تسجيلك في النشرة البريدية."); }}
            style={{ display: "flex", gap: "0.5rem", width: "100%", maxWidth: 420, marginTop: "0.75rem" }}
          >
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              required
              style={{
                flex: 1, height: 50, padding: "0 1.25rem",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(155,161,123,0.3)",
                color: "#F2EADB", outline: "none",
                fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                fontSize: "0.85rem",
              }}
            />
            <button
              type="submit"
              style={{
                height: 50, padding: "0 1.75rem",
                background: "#9BA17B", color: "#1C201B",
                border: "none", cursor: "pointer",
                fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                fontSize: "0.85rem", fontWeight: 600,
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#b5bc96")}
              onMouseLeave={e => (e.currentTarget.style.background = "#9BA17B")}
            >اشترك</button>
          </form>
        </div>

      </div>

      <style>{`
        @keyframes fadeScroll {
          0%,100%{opacity:0.2;transform:scaleY(0.5);transform-origin:top}
          50%{opacity:1;transform:scaleY(1);transform-origin:top}
        }
        @media (max-width: 768px) {
          .magazine-page { overflow: hidden; }
          .mag-hero { height: min(78svh, 620px) !important; min-height: 500px !important; }
          .mag-hero h1 { font-size: clamp(3rem, 15vw, 4.8rem) !important; }
          .mag-brand-banner { display: block !important; }
          .mag-brand-banner > img { height: 360px !important; object-position: center !important; }
          .mag-brand-banner > div { min-height: 250px; position: relative !important; padding: 2.5rem 1.35rem !important; background: #16281D; }
          .mag-brand-banner > div > div { padding: 0 !important; max-width: none !important; }
          .mag-content { padding: 0 !important; }
          .mag-meaning, .mag-featured, .mag-logo-section, .mag-tin-feature, .mag-lifestyle { display: flex !important; flex-direction: column !important; }
          .mag-copy-panel, .mag-feature-copy, .mag-tin-copy { padding: 2.75rem 1.35rem !important; min-height: 0 !important; }
          .mag-image-panel { min-height: 300px !important; height: 300px !important; }
          .mag-featured > div:first-child { height: 300px; min-height: 0; }
          .mag-featured > div:last-child { padding: 2.75rem 1.35rem !important; }
          .mag-photo-row { display: grid !important; grid-template-columns: 1fr 1fr !important; }
          .mag-photo-row > div { height: 190px !important; }
          .mag-photo-row > div:last-child { grid-column: 1 / -1; height: 230px !important; }
          .mag-tin-feature { min-height: 0 !important; }
          .mag-tin-feature > div:first-child { min-height: 0 !important; height: auto !important; }
          .mag-tin-feature > div:first-child img { height: auto !important; aspect-ratio: 1.72; object-fit: cover !important; }
          .mag-fields-feature { min-height: 390px !important; }
          .mag-fields-feature > img { height: 390px !important; object-position: center !important; }
          .mag-fields-feature > div { background: linear-gradient(180deg, rgba(22,40,29,0.05) 15%, rgba(22,40,29,0.88) 100%) !important; align-items: flex-end !important; }
          .mag-fields-copy { padding: 2rem 1.35rem !important; max-width: none !important; width: 100%; }
          .mag-logo-section .mag-image-panel { order: 0; }
          .mag-logo-section .mag-copy-panel { order: 1; }
          .mag-showcase { min-height: 0 !important; }
          .mag-showcase > img { height: 300px !important; object-position: center !important; }
          .mag-showcase > div { align-items: flex-end !important; background: linear-gradient(180deg, rgba(22,40,29,0.05) 15%, rgba(22,40,29,0.9) 100%) !important; }
          .mag-showcase > div > div { padding: 2rem 1.35rem !important; max-width: none !important; }
          .mag-articles { display: flex !important; flex-direction: column !important; }
          .mag-articles > div:first-child img { min-height: 0 !important; height: 290px !important; }
          .mag-articles > div:last-child { display: grid !important; grid-template-columns: 1fr !important; }
          .mag-articles > div:last-child > div { padding: 2rem 1.35rem !important; }
          .mag-lifestyle > div { height: 260px !important; }
          .mag-newsletter { padding: 3.25rem 1.25rem !important; }
          .mag-newsletter form { flex-direction: column !important; max-width: none !important; }
          .mag-newsletter form input, .mag-newsletter form button { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
