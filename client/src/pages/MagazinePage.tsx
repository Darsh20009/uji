import { useState } from "react";

const articles = [
  {
    id: 1,
    tag: "أصول",
    title: "من أوجي إلى العالم — قصة المدينة التي اخترعت الماتشا",
    excerpt: "في القرن الثاني عشر، حمل الراهب البوذي ايساي بذور الشاي الأخضر من الصين إلى اليابان. لكن أوجي هي التي حوّلته إلى فن.",
    read: "٥ دقائق",
    img: "/assets/magazine/matcha-1.jpg",
    featured: true,
  },
  {
    id: 2,
    tag: "صحة",
    title: "L-Theanine: السر وراء هدوء الماتشا",
    excerpt: "الكافيين وحده يعطيك طاقة مع توتر — لكن الماتشا تحتوي على L-Theanine الذي يوازن التأثير ويمنحك تركيزاً صافياً.",
    read: "٣ دقائق",
    img: "/assets/magazine/matcha-2.jpg",
    featured: false,
  },
  {
    id: 3,
    tag: "ريتشوال",
    title: "الفرق بين الدرجة الاحتفالية ودرجة الطهي",
    excerpt: "ليست كل الماتشا واحدة. الدرجة الاحتفالية مصنوعة من أصغر الأوراق وأكثرها ظلاً — والفرق يُرى ويُشرب.",
    read: "٤ دقائق",
    img: "/assets/magazine/matcha-3.jpg",
    featured: false,
  },
  {
    id: 4,
    tag: "وصفة",
    title: "Matcha Latte المثالي — خطوة بخطوة",
    excerpt: "ليس مجرد خفق الماتشا في الحليب. النسب، درجة الحرارة، ونوع الحليب — كل تفصيلة تصنع الفرق.",
    read: "٣ دقائق",
    img: "/assets/magazine/matcha-4.jpg",
    featured: false,
  },
  {
    id: 5,
    tag: "ثقافة",
    title: "حفل الشاي الياباني — Chado طريق الشاي",
    excerpt: "Chado ليس مجرد شرب شاي. إنه فلسفة مبنية على أربع قيم: الانسجام، الاحترام، النقاء، والهدوء.",
    read: "٦ دقائق",
    img: "/assets/magazine/matcha-1.jpg",
    featured: false,
  },
  {
    id: 6,
    tag: "وصفة",
    title: "Matcha Tiramisu — الحلوى الإيطالية بلمسة يابانية",
    excerpt: "استبدل القهوة بالماتشا في وصفة التيراميسو الكلاسيكية وستحصل على حلوى مميزة لا تُنسى.",
    read: "٤ دقائق",
    img: "/assets/magazine/matcha-2.jpg",
    featured: false,
  },
];

const tagColors: Record<string, { bg: string; text: string }> = {
  "أصول":    { bg: "#1F3929", text: "#F2EADB" },
  "صحة":     { bg: "#4C5734", text: "#F2EADB" },
  "ريتشوال": { bg: "#9BA17B", text: "#1C201B" },
  "وصفة":    { bg: "#C89B5A", text: "#fff" },
  "ثقافة":   { bg: "#1F3929", text: "#F2EADB" },
};

export default function MagazinePage() {
  const featured = articles.find(a => a.featured)!;
  const rest = articles.filter(a => !a.featured);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ background: "#F2EADB", minHeight: "100vh", direction: "rtl" }}>

      {/* ── Hero Header ── */}
      <div style={{
        position: "relative",
        height: "clamp(280px,40vw,420px)",
        overflow: "hidden",
        background: "#16281D",
      }}>
        <img
          src="/assets/magazine/matcha-4.jpg"
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
        />
        {/* Japanese-style vertical lines decoration */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(22,40,29,0.2) 0%, rgba(22,40,29,0.7) 100%)" }} />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "80px 1.5rem 2rem",
        }}>
          <p style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: "0.58rem", letterSpacing: "0.45em",
            color: "#9BA17B", marginBottom: "1.25rem",
            textTransform: "uppercase",
          }}>THE UJI JOURNAL — المجلة</p>
          <h1 style={{
            fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
            fontSize: "clamp(3rem,7vw,5.5rem)",
            fontWeight: 700, color: "#F2EADB",
            lineHeight: 1.1, margin: "0 0 1.25rem",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}>عالم الماتشا</h1>
          <p style={{
            fontFamily: "'IBM Plex Sans Arabic',sans-serif",
            fontSize: "0.95rem", color: "rgba(242,234,219,0.8)",
            maxWidth: 420, lineHeight: 1.8,
          }}>
            قصص، وصفات، وعلوم من قلب ثقافة الماتشا اليابانية
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.25rem 6rem" }}>

        {/* ── Featured ── */}
        <div style={{
          position: "relative",
          minHeight: 420,
          overflow: "hidden",
          marginBottom: "1.5rem",
          background: "#16281D",
        }}>
          {/* Background image */}
          <img
            src={featured.img}
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.35,
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(22,40,29,0.95) 40%, rgba(22,40,29,0.6) 100%)",
          }} />
          {/* Text content */}
          <div style={{
            position: "relative", zIndex: 1,
            maxWidth: 600,
            padding: "4rem 3rem",
          }}>
            <p style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: "0.52rem", letterSpacing: "0.4em",
              color: "#9BA17B", marginBottom: "1rem",
            }}>✦ المقال المميز</p>
            <span style={{
              display: "inline-block",
              background: "rgba(155,161,123,0.15)",
              color: "#9BA17B",
              fontFamily: "'DM Mono',monospace",
              fontSize: "0.52rem", letterSpacing: "0.3em",
              padding: "4px 12px", marginBottom: "1.25rem",
              border: "1px solid rgba(155,161,123,0.3)",
            }}>{featured.tag}</span>
            <h2 style={{
              fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
              fontSize: "clamp(1.6rem,3vw,2.4rem)",
              fontWeight: 700, color: "#F2EADB",
              lineHeight: 1.35, marginBottom: "1.25rem",
            }}>{featured.title}</h2>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic',sans-serif",
              fontSize: "0.88rem", color: "rgba(242,234,219,0.7)",
              lineHeight: 1.9, marginBottom: "2rem", maxWidth: 480,
            }}>{featured.excerpt}</p>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: "0.58rem",
              letterSpacing: "0.2em", color: "#9BA17B",
            }}>قراءة {featured.read}</span>
          </div>
        </div>

        {/* ── Divider label ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", margin: "2.5rem 0 1.5rem" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(200,187,164,0.4)" }} />
          <p style={{
            fontFamily: "'DM Mono',monospace", fontSize: "0.55rem",
            letterSpacing: "0.4em", color: "#9BA17B",
          }}>المزيد من المقالات</p>
          <div style={{ flex: 1, height: 1, background: "rgba(200,187,164,0.4)" }} />
        </div>

        {/* ── Article Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.25rem",
        }}>
          {rest.map(a => {
            const tc = tagColors[a.tag] || { bg: "#9BA17B", text: "#fff" };
            const isHov = hovered === a.id;
            return (
              <div
                key={a.id}
                onMouseEnter={() => setHovered(a.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "#fff",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  boxShadow: isHov ? "0 12px 36px rgba(31,57,41,0.13)" : "0 2px 8px rgba(0,0,0,0.04)",
                  transform: isHov ? "translateY(-4px)" : "translateY(0)",
                  border: "1px solid rgba(200,187,164,0.25)",
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img
                    src={a.img}
                    alt={a.title}
                    style={{
                      width: "100%", height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                      transform: isHov ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                  {/* Tag overlay */}
                  <span style={{
                    position: "absolute", top: "1rem", right: "1rem",
                    background: tc.bg, color: tc.text,
                    fontFamily: "'DM Mono',monospace",
                    fontSize: "0.5rem", letterSpacing: "0.25em",
                    padding: "4px 10px",
                  }}>{a.tag}</span>
                </div>
                {/* Content */}
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{
                    fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
                    fontSize: "1.2rem", fontWeight: 700,
                    color: "#1C201B", lineHeight: 1.4,
                    marginBottom: "0.75rem",
                  }}>{a.title}</h3>
                  <p style={{
                    fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                    fontSize: "0.82rem", color: "#9BA17B",
                    lineHeight: 1.85, marginBottom: "1.25rem",
                  }}>{a.excerpt}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: "0.55rem", letterSpacing: "0.2em",
                      color: "#C8BBA4",
                    }}>قراءة {a.read}</span>
                    <span style={{
                      fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                      fontSize: "0.75rem",
                      color: isHov ? "#1F3929" : "#C8BBA4",
                      transition: "color 0.3s",
                    }}>اقرأ المزيد ←</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Newsletter strip ── */}
        <div style={{
          marginTop: "4rem",
          background: "#1F3929",
          padding: "3rem 2.5rem",
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
            fontSize: "clamp(1.4rem,3vw,2rem)",
            color: "#F2EADB", fontWeight: 700, lineHeight: 1.3,
          }}>مقالات جديدة كل أسبوع</h3>
          <p style={{
            fontFamily: "'IBM Plex Sans Arabic',sans-serif",
            fontSize: "0.85rem", color: "rgba(242,234,219,0.6)",
            maxWidth: 380,
          }}>اشترك في نشرة UJI وكن أول من يقرأ عالم الماتشا الياباني</p>
          <form
            onSubmit={e => { e.preventDefault(); alert("شكراً! تم تسجيلك في النشرة البريدية."); }}
            style={{ display: "flex", gap: "0.5rem", width: "100%", maxWidth: 400, marginTop: "0.5rem" }}
          >
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              required
              style={{
                flex: 1, height: 46, padding: "0 1rem",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(155,161,123,0.35)",
                color: "#F2EADB", outline: "none",
                fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                fontSize: "0.85rem",
              }}
            />
            <button
              type="submit"
              style={{
                height: 46, padding: "0 1.5rem",
                background: "#9BA17B", color: "#1C201B",
                border: "none", cursor: "pointer",
                fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                fontSize: "0.85rem", fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >اشترك</button>
          </form>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .magazine-featured {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
