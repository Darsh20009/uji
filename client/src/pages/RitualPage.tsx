export default function RitualPage() {
  const steps = [
    {
      num: "٠١", en: "SIFT",
      ar: "النخل",
      desc: "انخل ملعقة صغيرة من الماتشا (١–٢ غرام) في وعاء التشاوان لتفكيك أي تكتلات وضمان ناعومة مثالية.",
      detail: "النخل خطوة يتجاهلها كثيرون — لكنه الفارق بين كوب أملس وكوب به حبيبات.",
    },
    {
      num: "٠٢", en: "WATER",
      ar: "الماء",
      desc: "سخّن الماء إلى ٧٠–٨٠ درجة مئوية. الماء المغلي يحرق أوراق الماتشا ويُكسب الكوب مرارة غير مرغوبة.",
      detail: "اترك الماء المغلي يبرد لدقيقتين، أو استخدم ميزان حرارة للدقة.",
    },
    {
      num: "٠٣", en: "WHISK",
      ar: "الخفق",
      desc: "أضف ٦٠–٧٠ مل من الماء ثم اخفق بحركة W سريعة لمدة ٣٠ ثانية حتى يتشكل رغوة ناعمة على السطح.",
      detail: "استخدم المشة البامبو (Chasen) من الوسط للخارج — لا تدائري.",
    },
    {
      num: "٠٤", en: "POUR",
      ar: "الصبّ",
      desc: "لـ Matcha Latte: أضف الحليب المبخّر ببطء فوق الماتشا المركّزة. للماتشا الكلاسيكية: تُشرب مباشرة.",
      detail: "الحليب النباتي (الشوفان أو اللوز) يُعطي نكهة مميزة مع الماتشا.",
    },
    {
      num: "٠٥", en: "SAVOUR",
      ar: "التذوق",
      desc: "قبل أول رشفة — شمّ العطر، لاحظ اللون الزمردي، اشعر بالدفء في يديك. هذا هو الريتشوال.",
      detail: "الماتشا الاحتفالية لها ثلاث طبقات من النكهة: عشبية، ثم حلوة، ثم أومامي.",
    },
  ];

  const tips = [
    { icon: "🌡️", title: "درجة الحرارة", body: "٧٠–٨٠° للماتشا النقية، ٨٠–٨٥° للاتيه" },
    { icon: "⚖️", title: "الكمية", body: "١–٢ غرام لكل ٦٠–٧٠ مل ماء" },
    { icon: "🎋", title: "المشة", body: "احفظها في حامل بعد الاستخدام لتدوم أكثر" },
    { icon: "📦", title: "الحفظ", body: "أغلق العبوة وضعها في الثلاجة بعيداً عن الضوء" },
  ];

  return (
    <div style={{ background: "#F2EADB", minHeight: "100vh", direction: "rtl" }}>

      {/* ── Hero ── */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "#16281D", minHeight: "60vh",
        display: "flex", alignItems: "flex-end",
      }}>
        <img
          src="/assets/hero/uji-hero-tin-powder-explosion.png"
          alt=""
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center", opacity: 0.45,
          }}
        />
        <div style={{
          position: "relative", zIndex: 1,
          padding: "clamp(3rem,8vw,6rem) clamp(1.5rem,6vw,6rem)",
          maxWidth: 800,
        }}>
          <p style={{
            fontFamily: "'DM Mono',monospace", fontSize: "0.58rem",
            letterSpacing: "0.4em", color: "#9BA17B", marginBottom: "1.25rem",
          }}>THE MATCHA RITUAL — دليل الريتشوال</p>
          <h1 style={{
            fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
            fontSize: "clamp(2.8rem,6vw,5rem)",
            fontWeight: 700, color: "#F2EADB", lineHeight: 1.15, margin: "0 0 1.25rem",
          }}>
            فن إعداد<br />الماتشا الأصيل
          </h1>
          <p style={{
            fontFamily: "'IBM Plex Sans Arabic',sans-serif",
            fontSize: "1rem", color: "rgba(242,234,219,0.7)",
            lineHeight: 1.9, maxWidth: 480,
          }}>
            خمس خطوات تحوّل الماتشا من مسحوق إلى تجربة حسية — تعلّمها مرة واحدة وستصنعها مدى الحياة.
          </p>
        </div>
      </div>

      {/* ── Steps ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "5rem 1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(200,187,164,0.2)" }}>
          {steps.map((s, i) => (
            <div
              key={s.num}
              style={{
                display: "grid", gridTemplateColumns: "120px 1fr",
                background: i % 2 === 0 ? "#FDFAF5" : "#F7F2E8",
                gap: 0,
              }}
            >
              {/* Number column */}
              <div style={{
                background: i === 0 ? "#1F3929" : i === 4 ? "#16281D" : "#F0EBE1",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "2.5rem 1rem", gap: "0.5rem",
                borderLeft: "1px solid rgba(200,187,164,0.3)",
              }}>
                <span style={{
                  fontFamily: "'DM Mono',monospace", fontSize: "0.6rem",
                  letterSpacing: "0.3em",
                  color: i === 0 || i === 4 ? "#9BA17B" : "#C8BBA4",
                }}>{s.num}</span>
                <span style={{
                  fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
                  fontSize: "1.8rem", fontWeight: 700,
                  color: i === 0 || i === 4 ? "#F2EADB" : "#1F3929",
                  lineHeight: 1,
                }}>{s.ar}</span>
                <span style={{
                  fontFamily: "'DM Mono',monospace", fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  color: i === 0 || i === 4 ? "rgba(242,234,219,0.4)" : "#C8BBA4",
                }}>{s.en}</span>
              </div>
              {/* Content column */}
              <div style={{ padding: "2.5rem 2.5rem 2.5rem 2rem" }}>
                <p style={{
                  fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                  fontSize: "0.95rem", color: "#1C201B",
                  lineHeight: 1.85, marginBottom: "0.75rem",
                }}>{s.desc}</p>
                <p style={{
                  fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                  fontSize: "0.8rem", color: "#9BA17B",
                  lineHeight: 1.8, borderRight: "2px solid #9BA17B",
                  paddingRight: "0.75rem", margin: 0,
                }}>{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tips grid ── */}
      <div style={{ background: "#16281D", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: "'DM Mono',monospace", fontSize: "0.6rem",
            letterSpacing: "0.35em", color: "#9BA17B",
            marginBottom: "0.75rem", textAlign: "center",
          }}>PRO TIPS</p>
          <h2 style={{
            fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
            fontSize: "clamp(1.8rem,3.5vw,2.5rem)",
            fontWeight: 700, color: "#F2EADB",
            textAlign: "center", marginBottom: "3rem",
          }}>نصائح الخبراء</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "1px", background: "rgba(255,255,255,0.06)",
          }}>
            {tips.map(t => (
              <div key={t.title} style={{
                background: "#1F3929", padding: "2rem 1.5rem", textAlign: "center",
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{t.icon}</div>
                <p style={{
                  fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
                  fontSize: "1.1rem", color: "#F2EADB", marginBottom: "0.5rem",
                }}>{t.title}</p>
                <p style={{
                  fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                  fontSize: "0.82rem", color: "#9BA17B", lineHeight: 1.75, margin: 0,
                }}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ textAlign: "center", padding: "5rem 1.5rem" }}>
        <p style={{
          fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
          fontSize: "clamp(1.5rem,3vw,2rem)",
          color: "#1C201B", marginBottom: "0.75rem",
        }}>جاهز لتجربة الريتشوال؟</p>
        <p style={{
          fontFamily: "'IBM Plex Sans Arabic',sans-serif",
          fontSize: "0.9rem", color: "#9BA17B", marginBottom: "2rem",
        }}>احصل على ماتشا UJI الاحتفالية وابدأ اليوم.</p>
        <a
          href="/products"
          style={{
            display: "inline-block", background: "#1F3929", color: "#F2EADB",
            padding: "1rem 3rem", textDecoration: "none",
            fontFamily: "'IBM Plex Sans Arabic',sans-serif",
            fontSize: "0.95rem", letterSpacing: "0.05em",
          }}
        >تسوّق الماتشا ←</a>
      </div>
    </div>
  );
}
