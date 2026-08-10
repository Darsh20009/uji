import { EditableText } from "../components/editor/EditableText";
import { useLang } from "../context/LanguageContext";

export default function OurStoryPage() {
  const { isRTL, lang } = useLang();

  const values = [
    {
      ar: "الأصالة",
      en: "AUTHENTICITY",
      descAr: "كل كيس ماتشا UJI مصدره مزارع شيزوكا اليابانية مباشرة. لا وسطاء ولا تنازلات.",
      descEn: "Every UJI matcha tin comes directly from Japanese Shizuoka farms. No middlemen, no compromises.",
    },
    {
      ar: "الريتشوال",
      en: "RITUAL",
      descAr: "الماتشا ليست مشروباً فحسب. إنها لحظة تقطعها من يومك لنفسك. نصنع المنتجات التي تجعل هذه اللحظة أجمل.",
      descEn: "Matcha is more than a drink. It is a moment you set aside for yourself. We make products that make that moment better.",
    },
    {
      ar: "الجودة",
      en: "QUALITY",
      descAr: "الدرجة الاحتفالية فقط. لا نقدّم ماتشا الطهي في أكياس فاخرة. الفرق حقيقي ويُحسّ.",
      descEn: "Ceremonial grade only. We do not put culinary matcha in beautiful packaging. The difference is real and you can taste it.",
    },
    {
      ar: "المجتمع",
      en: "COMMUNITY",
      descAr: "نبني مجتمعاً من عشّاق الماتشا في المنطقة العربية. مجتمع يتعلم ويتشارك ويرتقي معاً.",
      descEn: "We are building a community of matcha lovers across the region — learning, sharing, and growing together.",
    },
  ];

  const timeline = [
    { year: "2023", ar: "بدأت الفكرة. مؤسسو UJI يبحثون عن ماتشا يابانية أصيلة في السوق السعودي ولا يجدونها.", en: "The idea began. The UJI founders searched for authentic Japanese matcha in Saudi Arabia and could not find it." },
    { year: "2024", ar: "أول شحنة مباشرة من مزارع شيزوكا اليابانية. التجربة تتجاوز كل التوقعات.", en: "Our first direct shipment arrived from Shizuoka farms in Japan. The experience exceeded every expectation." },
    { year: "2024", ar: "إطلاق UJI MATCHA. أول متجر سعودي متخصص في الماتشا الاحتفالية اليابانية.", en: "UJI MATCHA launched as Saudi Arabia's first store dedicated to Japanese ceremonial matcha." },
    { year: "2025", ar: "انضمام آلاف العملاء. بدء خدمة B2B للكافيهات والمطاعم.", en: "Thousands of customers joined us, and our B2B service for cafés and restaurants began." },
    { year: "2026", ar: "التوسع في المنطقة العربية. استمرار الرحلة نحو تجربة ماتشا لا مثيل لها.", en: "We expanded across the region and continued the journey toward an unmatched matcha experience." },
  ];

  return (
    <div style={{ background: "#F2EADB", minHeight: "100vh", direction: isRTL ? "rtl" : "ltr" }}>

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
          <EditableText
            contentKey="story.hero.eyebrow"
            defaultValue="قصتنا"
            as="p"
            style={{
              fontFamily: "'Cascadia Code', monospace", fontSize: "0.58rem",
              letterSpacing: "0.4em", color: "#9BA17B", marginBottom: "1.5rem",
            }}
          />
          <EditableText
            contentKey="story.hero.title"
            defaultValue={"من شيزوكا اليابانية\nإلى كوبك"}
            as="h1"
            style={{
              fontFamily: "'Mirza', serif",
              fontSize: "clamp(2.8rem,6vw,4.5rem)",
              fontWeight: 700, color: "#F2EADB",
              lineHeight: 1.2, marginBottom: "1.5rem",
            }}
          />
          <EditableText
            contentKey="story.hero.description"
            defaultValue="بدأ الأمر بسؤال بسيط: لماذا لا تتوفر ماتشا يابانية حقيقية في المنطقة العربية؟ كل ما في الأسواق كان إما ماتشا طهي في أكياس فاخرة، أو مساحيق مجهولة المصدر. قررنا أن نغيّر ذلك."
            as="p"
            style={{
              fontFamily: "'Mirza', serif",
              fontSize: "1rem", color: "rgba(242,234,219,0.7)",
              lineHeight: 1.95, maxWidth: 520, margin: "0 auto",
            }}
          />
        </div>
      </div>

      {/* ── WHY — المشكلة والحل ── */}
      <div style={{ background: "#F7F2E8", padding: "5rem 1.5rem", borderBottom: "1px solid rgba(200,187,164,0.3)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{
            fontFamily: "'Cascadia Code', monospace", fontSize: "0.58rem",
            letterSpacing: "0.4em", color: "#9BA17B",
            marginBottom: "1rem", textAlign: "center",
          }}>{lang === "ar" ? "لماذا وُجدنا" : "WHY WE EXIST"}</p>
          <EditableText
            contentKey="story.why.title"
            defaultValue={"لماذا لا تتوفر ماتشا\nحقيقية في السوق السعودي؟"}
            as="h2"
            style={{
              fontFamily: "'Mirza', serif",
              fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700,
              color: "#1C201B", textAlign: "center",
              lineHeight: 1.25, marginBottom: "1rem",
            }}
          />
          <EditableText
            contentKey="story.why.body"
            defaultValue="هذا السؤال هو سبب وجودنا. جلسنا نفكر فيه طويلاً ووجدنا ثلاثة أسباب حقيقية."
            as="p"
            style={{
              fontFamily: "'Mirza', serif",
              fontSize: "0.9rem", color: "#9BA17B",
              lineHeight: 1.9, textAlign: "center",
              maxWidth: 580, margin: "0 auto 3.5rem",
            }}
          />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1px",
            background: "rgba(200,187,164,0.3)",
          }}>
            {[
              {
                num: lang === "ar" ? "١" : "1",
                title: lang === "ar" ? "الماتشا الموجودة ليست ماتشا" : "Much of what is sold is not true matcha",
                body: lang === "ar" ? "معظم ما يُباع في الأسواق السعودية هو مسحوق طهي مجهول المصدر أو ماتشا من درجات دنيا تُعبّأ في أكياس فاخرة. الطعم مرّ، اللون باهت، والفائدة محدودة لأنها ليست ماتشا احتفالية أصلاً." : "Much of what is sold in Saudi markets is an untraceable culinary powder or low-grade matcha in beautiful packaging. The taste is bitter, the color is dull, and it was never ceremonial matcha to begin with.",
              },
              {
                num: lang === "ar" ? "٢" : "2",
                title: lang === "ar" ? "سلسلة التوريد طويلة ومشوِّهة" : "A long, compromised supply chain",
                body: lang === "ar" ? "بين المزرعة اليابانية والمستهلك السعودي عادةً ثلاثة وسطاء أو أكثر. كل وسيط يقلل التكلفة بتخفيض الجودة. بحلول وصولها إليك، لا تشبه ما خرج من المزرعة." : "There are often three or more middlemen between a Japanese farm and a Saudi customer. Each cuts costs by cutting quality. By the time it arrives, it no longer resembles what left the farm.",
              },
              {
                num: lang === "ar" ? "٣" : "3",
                title: lang === "ar" ? "لا توعية بالفرق الحقيقي" : "The real difference was not explained",
                body: lang === "ar" ? "لم يكن هناك من يشرح الفرق بين Ceremonial Grade وCulinary Grade، أو لماذا مزارع شيزوكا تحديداً تنتج أجود الماتشا. بدون توعية، الزبون يشتري على الشكل لا على الجوهر." : "No one explained the difference between ceremonial and culinary grade, or why Shizuoka produces some of the finest matcha. Without context, customers buy for appearance instead of substance.",
              },
            ].map(item => (
              <div key={item.num} style={{
                background: "#FDFAF5", padding: "2.5rem 2rem",
              }}>
                <div style={{
                  fontFamily: "'Mirza', serif",
                  fontSize: "2.5rem", fontWeight: 300,
                  color: "rgba(155,161,123,0.4)",
                  lineHeight: 1, marginBottom: "1rem",
                }}>{item.num}</div>
                <h3 style={{
                  fontFamily: "'Mirza', serif",
                  fontSize: "1.25rem", fontWeight: 700,
                  color: "#1F3929", marginBottom: "0.75rem",
                  lineHeight: 1.35,
                }}>{item.title}</h3>
                <p style={{
                  fontFamily: "'Mirza', serif",
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
              <EditableText
                contentKey="story.why.solution"
                defaultValue="قررنا أن نحلّ المشكلة من جذرها، شراء مباشر من مزارع شيزوكا، توصيل مباشر إليك، وشفافية كاملة عن كل ما في العلبة."
                as="p"
                style={{
                  fontFamily: "'Mirza', serif",
                  fontSize: "1.35rem", fontWeight: 400,
                  color: "#F2EADB", lineHeight: 1.55,
                  marginBottom: "0.75rem",
                }}
              />
              <EditableText
                contentKey="story.why.detail"
                defaultValue="لهذا كل منتج UJI مرفق بشهادة المصدر. لهذا نذكر اسم المزرعة. لهذا نشرح الفرق بين كل صنف. الشفافية أساس الثقة."
                as="p"
                style={{
                  fontFamily: "'Mirza', serif",
                  fontSize: "0.83rem", color: "rgba(155,161,123,0.85)",
                  lineHeight: 1.85,
                }}
              />
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
              fontFamily: "'Cascadia Code', monospace", fontSize: "0.58rem",
              letterSpacing: "0.35em", color: "#9BA17B", marginBottom: "1rem",
            }}>SHIZUOKA, JAPAN</p>
            <EditableText
              contentKey="story.shizuoka.title"
              defaultValue="مزارع شيزوكا"
              as="h2"
              style={{
                fontFamily: "'Mirza', serif",
                fontSize: "1.8rem", fontWeight: 700, color: "#1C201B",
                marginBottom: "1.25rem", lineHeight: 1.3,
              }}
            />
            <EditableText
              contentKey="story.shizuoka.body"
              defaultValue="تقع شيزوكا على سفوح جبل فوجي، من أبرز مناطق زراعة الشاي في اليابان. مناخها المعتدل وتربتها البركانية الغنية والضباب الصباحي الذي يكسو مزارعها يخلقون ماتشا ذات نكهة عميقة وجودة استثنائية."
              as="p"
              style={{
                fontFamily: "'Mirza', serif",
                fontSize: "0.88rem", color: "#6B7280", lineHeight: 1.95,
              }}
            />
          </div>
          <div style={{ background: "rgba(200,187,164,0.3)", alignSelf: "stretch" }} />
          <div>
            <p style={{
              fontFamily: "'Cascadia Code', monospace", fontSize: "0.58rem",
              letterSpacing: "0.35em", color: "#9BA17B", marginBottom: "1rem",
            }}>UJI MATCHA, SA</p>
            <EditableText
              contentKey="story.brand.title"
              defaultValue="علامتنا"
              as="h2"
              style={{
                fontFamily: "'Mirza', serif",
                fontSize: "1.8rem", fontWeight: 700, color: "#1C201B",
                marginBottom: "1.25rem", lineHeight: 1.3,
              }}
            />
            <EditableText
              contentKey="story.brand.body"
              defaultValue="UJI MATCHA ليست مجرد علامة تجارية، إنها جسر بين ثقافتين. نحمل روح الماتشا اليابانية في كل علبة: ماتشا مزروعة في شيزوكا، بنفس الجودة الاحتفالية التي يشربها اليابانيون."
              as="p"
              style={{
                fontFamily: "'Mirza', serif",
                fontSize: "0.88rem", color: "#6B7280", lineHeight: 1.95,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div style={{ background: "#1F3929", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{
            fontFamily: "'Cascadia Code', monospace", fontSize: "0.58rem",
            letterSpacing: "0.4em", color: "#9BA17B",
            marginBottom: "0.75rem", textAlign: "center",
          }}>TIMELINE</p>
          <h2 style={{
            fontFamily: "'Mirza', serif",
            fontSize: "2rem", fontWeight: 700, color: "#F2EADB",
            textAlign: "center", marginBottom: "3rem",
        }}>{lang === "ar" ? "رحلتنا" : "Our journey"}</h2>
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
                  fontFamily: "'Mirza', serif",
                  fontSize: "1.5rem", fontWeight: 400, color: "#9BA17B",
                  letterSpacing: "0.05em", lineHeight: 1,
                  minWidth: 70, textAlign: "center",
                }}>{t.year}</div>
                <p style={{
                  fontFamily: "'Mirza', serif",
                  fontSize: "0.88rem", color: "rgba(242,234,219,0.8)",
                  lineHeight: 1.8, margin: 0, paddingTop: "0.2rem",
                }}>{lang === "ar" ? t.ar : t.en}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Values ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "5rem 1.5rem" }}>
        <p style={{
          fontFamily: "'Cascadia Code', monospace", fontSize: "0.58rem",
          letterSpacing: "0.4em", color: "#9BA17B",
          marginBottom: "0.75rem", textAlign: "center",
        }}>VALUES</p>
        <h2 style={{
          fontFamily: "'Mirza', serif",
          fontSize: "2rem", fontWeight: 700, color: "#1C201B",
          textAlign: "center", marginBottom: "3rem",
        }}>{lang === "ar" ? "ما نؤمن به" : "What we believe"}</h2>
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
                fontFamily: "'Cascadia Code', monospace",
                fontSize: "0.55rem", letterSpacing: "0.3em",
                color: "#9BA17B", marginBottom: "0.6rem",
              }}>{v.en}</p>
              <h3 style={{
                fontFamily: "'Mirza', serif",
                fontSize: "1.5rem", fontWeight: 700,
                color: "#1F3929", marginBottom: "0.75rem",
              }}>{lang === "ar" ? v.ar : v.en}</h3>
              <p style={{
                fontFamily: "'Mirza', serif",
                fontSize: "0.83rem", color: "#9BA17B",
                lineHeight: 1.85, margin: 0,
              }}>{lang === "ar" ? v.descAr : v.descEn}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{
        background: "#16281D", padding: "4rem 1.5rem", textAlign: "center",
      }}>
        <EditableText
          contentKey="story.cta.title"
          defaultValue="كن جزءاً من القصة"
          as="h2"
          style={{
            fontFamily: "'Mirza', serif",
            fontSize: "1.8rem", fontWeight: 700,
            color: "#F2EADB", marginBottom: "0.75rem",
          }}
        />
        <EditableText
          contentKey="story.cta.body"
          defaultValue="اشترك في نشرتنا وكن أول من يعرف كل جديد."
          as="p"
          style={{
            fontFamily: "'Mirza', serif",
            fontSize: "0.9rem", color: "#9BA17B",
            marginBottom: "2rem",
          }}
        />
        <a href="/products" style={{
          display: "inline-block", background: "#F2EADB", color: "#16281D",
          padding: "1rem 3rem", textDecoration: "none",
          fontFamily: "'Mirza', serif",
          fontSize: "0.95rem", fontWeight: 600,
        }}>
          <EditableText
            contentKey="story.cta.btn"
            defaultValue="تسوّق الآن ←"
          />
        </a>
      </div>
    </div>
  );
}
