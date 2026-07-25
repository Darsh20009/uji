export default function OurStoryPage() {
  const values = [
    {
      ar: "الأصالة",
      en: "AUTHENTICITY",
      desc: "كل كيس ماتشا UJI مصدره مزارع أوجي اليابانية مباشرة. لا وسطاء ولا تنازلات.",
    },
    {
      ar: "الريتشوال",
      en: "RITUAL",
      desc: "الماتشا ليست مشروباً فحسب. إنها لحظة تقطعها من يومك لنفسك. نصنع المنتجات التي تجعل هذه اللحظة أجمل.",
    },
    {
      ar: "الجودة",
      en: "QUALITY",
      desc: "الدرجة الاحتفالية فقط. لا نقدّم ماتشا الطهي في أكياس فاخرة. الفرق حقيقي ويُحسّ.",
    },
    {
      ar: "المجتمع",
      en: "COMMUNITY",
      desc: "نبني مجتمعاً من عشّاق الماتشا في المنطقة العربية. مجتمع يتعلم ويتشارك ويرتقي معاً.",
    },
  ];

  const timeline = [
    { year: "٢٠٢٣", event: "بدأت الفكرة. مؤسسو UJI يبحثون عن ماتشا يابانية أصيلة في السوق السعودي ولا يجدونها." },
    { year: "٢٠٢٤", event: "أول شحنة مباشرة من مزارع أوجي. التجربة تتجاوز كل التوقعات." },
    { year: "٢٠٢٤", event: "إطلاق UJI MATCHA. أول متجر سعودي متخصص في الماتشا الاحتفالية اليابانية." },
    { year: "٢٠٢٥", event: "انضمام آلاف العملاء. بدء خدمة B2B للكافيهات والمطاعم." },
    { year: "٢٠٢٦", event: "التوسع في المنطقة العربية. استمرار الرحلة نحو تجربة ماتشا لا مثيل لها." },
  ];

  return (
    <div style={{ background: "#F2EADB", minHeight: "100vh", direction: "rtl" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "#16281D",
        padding: "120px 1.5rem 5rem",
        position: "relative", overflow: "hidden",
      }}>
        <img
          src="/assets/brand/uji-brand-cup-matcha-repeat.png"
          alt=""
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center", opacity: 0.1,
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: "'DM Mono',monospace", fontSize: "0.58rem",
            letterSpacing: "0.4em", color: "#9BA17B", marginBottom: "1.5rem",
          }}>قصتنا</p>
          <h1 style={{
            fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
            fontSize: "clamp(2.8rem,6vw,4.5rem)",
            fontWeight: 700, color: "#F2EADB",
            lineHeight: 1.2, marginBottom: "1.5rem",
          }}>
            من أوجي اليابانية<br />إلى كوبك
          </h1>
          <p style={{
            fontFamily: "'IBM Plex Sans Arabic',sans-serif",
            fontSize: "1rem", color: "rgba(242,234,219,0.7)",
            lineHeight: 1.95, maxWidth: 520, margin: "0 auto",
          }}>
            بدأ الأمر بسؤال بسيط: لماذا لا تتوفر ماتشا يابانية حقيقية في المنطقة العربية؟ كل ما في الأسواق كان إما ماتشا طهي في أكياس فاخرة، أو مساحيق مجهولة المصدر. قررنا أن نغيّر ذلك.
          </p>
        </div>
      </div>

      {/* ── WHY — المشكلة والحل ── */}
      <div style={{ background: "#F7F2E8", padding: "5rem 1.5rem", borderBottom: "1px solid rgba(200,187,164,0.3)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{
            fontFamily: "'DM Mono',monospace", fontSize: "0.58rem",
            letterSpacing: "0.4em", color: "#9BA17B",
            marginBottom: "1rem", textAlign: "center",
          }}>لماذا وُجدنا</p>
          <h2 style={{
            fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
            fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700,
            color: "#1C201B", textAlign: "center",
            lineHeight: 1.25, marginBottom: "1rem",
          }}>
            لماذا لا تتوفر ماتشا<br />حقيقية في السوق السعودي؟
          </h2>
          <p style={{
            fontFamily: "'IBM Plex Sans Arabic',sans-serif",
            fontSize: "0.9rem", color: "#9BA17B",
            lineHeight: 1.9, textAlign: "center",
            maxWidth: 580, margin: "0 auto 3.5rem",
          }}>
            هذا السؤال هو سبب وجودنا. جلسنا نفكر فيه طويلاً — ووجدنا ثلاثة أسباب حقيقية.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1px",
            background: "rgba(200,187,164,0.3)",
          }}>
            {[
              {
                num: "١",
                title: "الماتشا الموجودة ليست ماتشا",
                body: "معظم ما يُباع في الأسواق السعودية هو مسحوق طهي مجهول المصدر أو ماتشا من درجات دنيا تُعبّأ في أكياس فاخرة. الطعم مرّ، اللون باهت، والفائدة محدودة — لأنها ليست ماتشا احتفالية أصلاً.",
              },
              {
                num: "٢",
                title: "سلسلة التوريد طويلة ومشوِّهة",
                body: "بين المزرعة اليابانية والمستهلك السعودي عادةً ثلاثة وسطاء أو أكثر. كل وسيط يقلل التكلفة بتخفيض الجودة. بحلول وصولها إليك، لا تشبه ما خرج من المزرعة.",
              },
              {
                num: "٣",
                title: "لا توعية بالفرق الحقيقي",
                body: "لم يكن هناك من يشرح الفرق بين Ceremonial Grade وCulinary Grade، أو لماذا مزارع أوجي تحديداً تنتج أجود الماتشا. بدون توعية، الزبون يشتري على الشكل لا على الجوهر.",
              },
            ].map(item => (
              <div key={item.num} style={{
                background: "#FDFAF5", padding: "2.5rem 2rem",
              }}>
                <div style={{
                  fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
                  fontSize: "2.5rem", fontWeight: 300,
                  color: "rgba(155,161,123,0.4)",
                  lineHeight: 1, marginBottom: "1rem",
                }}>{item.num}</div>
                <h3 style={{
                  fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
                  fontSize: "1.25rem", fontWeight: 700,
                  color: "#1F3929", marginBottom: "0.75rem",
                  lineHeight: 1.35,
                }}>{item.title}</h3>
                <p style={{
                  fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                  fontSize: "0.83rem", color: "#6B7280",
                  lineHeight: 1.9, margin: 0,
                }}>{item.body}</p>
              </div>
            ))}
          </div>

          {/* Resolution statement */}
          <div style={{
            marginTop: "3rem",
            padding: "2.5rem",
            background: "#16281D",
            display: "flex", alignItems: "flex-start", gap: "2rem",
            flexWrap: "wrap",
          }}>
            <div style={{ flex: "0 0 auto" }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#9BA17B" strokeWidth="1.2">
                <path d="M18 4C10 4 4 10 4 18s6 14 14 14 14-6 14-14"/>
                <path d="M18 4v8M26 7l-6 7"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={{
                fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
                fontSize: "1.35rem", fontWeight: 400,
                color: "#F2EADB", lineHeight: 1.55,
                marginBottom: "0.75rem",
              }}>
                قررنا أن نحلّ المشكلة من جذرها — شراء مباشر من مزارع أوجي، توصيل مباشر إليك، وشفافية كاملة عن كل ما في العلبة.
              </p>
              <p style={{
                fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                fontSize: "0.83rem", color: "rgba(155,161,123,0.85)",
                lineHeight: 1.85,
              }}>
                لهذا كل منتج UJI مرفق بشهادة المصدر. لهذا نذكر اسم المزرعة. لهذا نشرح الفرق بين كل صنف. لأن الشفافية ليست خياراً — هي أساس الثقة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Origin story ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "5rem 1.5rem" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 2px 1fr",
          gap: "3rem", alignItems: "start",
        }}>
          <div>
            <p style={{
              fontFamily: "'DM Mono',monospace", fontSize: "0.58rem",
              letterSpacing: "0.35em", color: "#9BA17B", marginBottom: "1rem",
            }}>UJI, JAPAN</p>
            <h2 style={{
              fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
              fontSize: "1.8rem", fontWeight: 700, color: "#1C201B",
              marginBottom: "1.25rem", lineHeight: 1.3,
            }}>مدينة أوجي</h2>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic',sans-serif",
              fontSize: "0.88rem", color: "#6B7280", lineHeight: 1.95,
            }}>
              تقع أوجي جنوب كيوتو — عاصمة الماتشا في العالم منذ أكثر من ٨٠٠ عام. مناخها الرطب وتربتها الغنية والضباب الصباحي الذي يكسو مزارعها يخلقون ظروفاً لا تتكرر في أي مكان آخر على وجه الأرض.
            </p>
          </div>
          <div style={{ background: "rgba(200,187,164,0.3)", alignSelf: "stretch" }} />
          <div>
            <p style={{
              fontFamily: "'DM Mono',monospace", fontSize: "0.58rem",
              letterSpacing: "0.35em", color: "#9BA17B", marginBottom: "1rem",
            }}>UJI MATCHA, SA</p>
            <h2 style={{
              fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
              fontSize: "1.8rem", fontWeight: 700, color: "#1C201B",
              marginBottom: "1.25rem", lineHeight: 1.3,
            }}>علامتنا</h2>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic',sans-serif",
              fontSize: "0.88rem", color: "#6B7280", lineHeight: 1.95,
            }}>
              UJI MATCHA ليست مجرد علامة تجارية — إنها جسر بين ثقافتين. نحمل اسم المدينة لأن الأمانة تقتضي ذلك: ما تحصل عليه هو فعلاً ماتشا أوجي، بنفس الجودة التي يشربها اليابانيون.
            </p>
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div style={{ background: "#1F3929", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{
            fontFamily: "'DM Mono',monospace", fontSize: "0.58rem",
            letterSpacing: "0.4em", color: "#9BA17B",
            marginBottom: "0.75rem", textAlign: "center",
          }}>TIMELINE</p>
          <h2 style={{
            fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
            fontSize: "2rem", fontWeight: 700, color: "#F2EADB",
            textAlign: "center", marginBottom: "3rem",
          }}>رحلتنا</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {timeline.map((t, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "auto 1fr",
                gap: "1.5rem", alignItems: "start",
                paddingBottom: i < timeline.length - 1 ? "2rem" : 0,
                borderBottom: i < timeline.length - 1 ? "1px solid rgba(155,161,123,0.15)" : "none",
                paddingTop: i > 0 ? "2rem" : 0,
              }}>
                <div style={{
                  fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
                  fontSize: "1.5rem", fontWeight: 400, color: "#9BA17B",
                  letterSpacing: "0.05em", lineHeight: 1,
                  minWidth: 70, textAlign: "center",
                }}>{t.year}</div>
                <p style={{
                  fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                  fontSize: "0.88rem", color: "rgba(242,234,219,0.8)",
                  lineHeight: 1.8, margin: 0, paddingTop: "0.2rem",
                }}>{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Values ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "5rem 1.5rem" }}>
        <p style={{
          fontFamily: "'DM Mono',monospace", fontSize: "0.58rem",
          letterSpacing: "0.4em", color: "#9BA17B",
          marginBottom: "0.75rem", textAlign: "center",
        }}>VALUES</p>
        <h2 style={{
          fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
          fontSize: "2rem", fontWeight: 700, color: "#1C201B",
          textAlign: "center", marginBottom: "3rem",
        }}>ما نؤمن به</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "1px", background: "rgba(200,187,164,0.25)",
        }}>
          {values.map(v => (
            <div key={v.ar} style={{
              background: "#FDFAF5", padding: "2.5rem 2rem",
            }}>
              <p style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: "0.55rem", letterSpacing: "0.3em",
                color: "#9BA17B", marginBottom: "0.6rem",
              }}>{v.en}</p>
              <h3 style={{
                fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
                fontSize: "1.5rem", fontWeight: 700,
                color: "#1F3929", marginBottom: "0.75rem",
              }}>{v.ar}</h3>
              <p style={{
                fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                fontSize: "0.83rem", color: "#9BA17B",
                lineHeight: 1.85, margin: 0,
              }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{
        background: "#16281D", padding: "4rem 1.5rem", textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
          fontSize: "1.8rem", fontWeight: 700,
          color: "#F2EADB", marginBottom: "0.75rem",
        }}>كن جزءاً من القصة</h2>
        <p style={{
          fontFamily: "'IBM Plex Sans Arabic',sans-serif",
          fontSize: "0.9rem", color: "#9BA17B",
          marginBottom: "2rem",
        }}>اشترك في نشرتنا وكن أول من يعرف كل جديد.</p>
        <a href="/products" style={{
          display: "inline-block", background: "#F2EADB", color: "#16281D",
          padding: "1rem 3rem", textDecoration: "none",
          fontFamily: "'IBM Plex Sans Arabic',sans-serif",
          fontSize: "0.95rem", fontWeight: 600,
        }}>تسوّق الآن ←</a>
      </div>
    </div>
  );
}
