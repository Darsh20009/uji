export default function MagazinePage() {
  const articles = [
    {
      tag: "أصول",
      title: "من أوجي إلى العالم — قصة المدينة التي اخترعت الماتشا",
      excerpt: "في القرن الثاني عشر، حمل الراهب البوذي ايساي بذور الشاي الأخضر من الصين إلى اليابان. لكن أوجي هي التي حوّلته إلى فن.",
      read: "٥ دقائق",
      img: "/assets/brand/uji-brand-identity-bowl-transparent.png",
      featured: true,
    },
    {
      tag: "صحة",
      title: "L-Theanine: السر وراء هدوء الماتشا",
      excerpt: "الكافيين وحده يعطيك طاقة مع توتر — لكن الماتشا تحتوي على L-Theanine الذي يوازن التأثير ويمنحك تركيزاً صافياً.",
      read: "٣ دقائق",
      img: null,
      featured: false,
    },
    {
      tag: "ريتشوال",
      title: "الفرق بين الدرجة الاحتفالية ودرجة الطهي",
      excerpt: "ليست كل الماتشا واحدة. الدرجة الاحتفالية مصنوعة من أصغر الأوراق وأكثرها ظلاً — والفرق يُرى ويُشرب.",
      read: "٤ دقائق",
      img: null,
      featured: false,
    },
    {
      tag: "وصفة",
      title: "Matcha Latte المثالي — خطوة بخطوة",
      excerpt: "ليس مجرد خفق الماتشا في الحليب. النسب، درجة الحرارة، ونوع الحليب — كل تفصيلة تصنع الفرق.",
      read: "٣ دقائق",
      img: null,
      featured: false,
    },
    {
      tag: "ثقافة",
      title: "حفل الشاي الياباني — Chado طريق الشاي",
      excerpt: "Chado ليس مجرد شرب شاي. إنه فلسفة مبنية على أربع قيم: الانسجام، الاحترام، النقاء، والهدوء.",
      read: "٦ دقائق",
      img: null,
      featured: false,
    },
    {
      tag: "وصفة",
      title: "Matcha Tiramisu — الحلوى الإيطالية بلمسة يابانية",
      excerpt: "استبدل القهوة بالماتشا في وصفة التيراميسو الكلاسيكية وستحصل على حلوى مميزة لا تُنسى.",
      read: "٤ دقائق",
      img: null,
      featured: false,
    },
  ];

  const tagColors: Record<string, string> = {
    "أصول":   "#1F3929",
    "صحة":    "#4C5734",
    "ريتشوال":"#9BA17B",
    "وصفة":   "#C89B5A",
    "ثقافة":  "#1F3929",
  };

  const featured = articles.find(a => a.featured)!;
  const rest = articles.filter(a => !a.featured);

  return (
    <div style={{ background: "#F2EADB", minHeight: "100vh", direction: "rtl" }}>

      {/* ── Header ── */}
      <div style={{
        borderBottom: "1px solid rgba(200,187,164,0.35)",
        padding: "120px 1.5rem 3rem",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'DM Mono',monospace", fontSize: "0.58rem",
          letterSpacing: "0.4em", color: "#9BA17B", marginBottom: "1rem",
        }}>THE UJI JOURNAL — المجلة</p>
        <h1 style={{
          fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
          fontSize: "clamp(2.5rem,5vw,4rem)",
          fontWeight: 700, color: "#1C201B", lineHeight: 1.2, margin: "0 0 1rem",
        }}>عالم الماتشا</h1>
        <p style={{
          fontFamily: "'IBM Plex Sans Arabic',sans-serif",
          fontSize: "0.9rem", color: "#9BA17B", maxWidth: 420, margin: "0 auto",
        }}>
          قصص، وصفات، وعلوم من قلب ثقافة الماتشا اليابانية.
        </p>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* ── Featured article ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: "#16281D",
          marginBottom: "1px",
          minHeight: 340,
        }}>
          <div style={{
            background: "#1F3929",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", minHeight: 300,
          }}>
            <img
              src="/assets/brand/uji-brand-identity-bowl-transparent.png"
              alt=""
              style={{ width: "80%", maxWidth: 260, opacity: 0.8, objectFit: "contain" }}
            />
          </div>
          <div style={{ padding: "3rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{
              display: "inline-block",
              background: tagColors[featured.tag] || "#1F3929",
              color: "#F2EADB",
              fontFamily: "'DM Mono',monospace",
              fontSize: "0.55rem", letterSpacing: "0.3em",
              padding: "3px 10px", marginBottom: "1.25rem",
              width: "fit-content",
            }}>{featured.tag}</span>
            <h2 style={{
              fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
              fontSize: "clamp(1.4rem,2.5vw,2rem)",
              fontWeight: 700, color: "#F2EADB",
              lineHeight: 1.3, marginBottom: "1rem",
            }}>{featured.title}</h2>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic',sans-serif",
              fontSize: "0.85rem", color: "rgba(242,234,219,0.65)",
              lineHeight: 1.85, marginBottom: "1.5rem",
            }}>{featured.excerpt}</p>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: "0.6rem",
              letterSpacing: "0.2em", color: "#9BA17B",
            }}>قراءة {featured.read}</span>
          </div>
        </div>

        {/* ── Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: "1px",
          background: "rgba(200,187,164,0.2)",
        }}>
          {rest.map(a => (
            <div key={a.title} style={{
              background: "#FDFAF5",
              padding: "2rem",
              display: "flex", flexDirection: "column", gap: "0.75rem",
            }}>
              <span style={{
                display: "inline-block",
                fontFamily: "'DM Mono',monospace",
                fontSize: "0.55rem", letterSpacing: "0.3em",
                color: tagColors[a.tag] || "#9BA17B",
                borderBottom: `1px solid ${tagColors[a.tag] || "#9BA17B"}`,
                paddingBottom: 2, width: "fit-content",
              }}>{a.tag}</span>
              <h3 style={{
                fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
                fontSize: "1.2rem", fontWeight: 700,
                color: "#1C201B", lineHeight: 1.35,
              }}>{a.title}</h3>
              <p style={{
                fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                fontSize: "0.82rem", color: "#9BA17B",
                lineHeight: 1.8, flex: 1, margin: 0,
              }}>{a.excerpt}</p>
              <p style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: "0.58rem", letterSpacing: "0.2em",
                color: "#C8BBA4", margin: 0,
              }}>قراءة {a.read}</p>
            </div>
          ))}
        </div>

        {/* coming soon notice */}
        <div style={{
          marginTop: "3rem", textAlign: "center",
          padding: "2rem", background: "rgba(31,57,41,0.05)",
          border: "1px solid rgba(200,187,164,0.3)",
        }}>
          <p style={{
            fontFamily: "'IBM Plex Sans Arabic',sans-serif",
            fontSize: "0.85rem", color: "#9BA17B",
          }}>
            ✦ مقالات جديدة تصل كل أسبوع — اشترك في النشرة البريدية لتصلك أولاً
          </p>
        </div>
      </div>
    </div>
  );
}
