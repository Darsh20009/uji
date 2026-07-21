import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, RotateCcw } from "lucide-react";

/* ─── Quiz data ──────────────────────────────────────────────────── */
const QUESTIONS = [
  {
    q: "كيف تحبّ تحضير الماتشا؟",
    opts: [
      { label: "صافية بالماء الساخن",        scores: { ceremonial: 2, everyday: 0, culinary: 0 } },
      { label: "مع الحليب — لاتيه أو باردة",  scores: { ceremonial: 0, everyday: 1, culinary: 2 } },
      { label: "مرة هذا ومرة ذاك",            scores: { ceremonial: 0, everyday: 2, culinary: 1 } },
    ],
  },
  {
    q: "ما الأهم لك في ماتشاك؟",
    opts: [
      { label: "عمق النكهة والأريج الأصيل",   scores: { ceremonial: 2, everyday: 1, culinary: 0 } },
      { label: "طعم ناعم يومياً بسهولة",      scores: { ceremonial: 0, everyday: 2, culinary: 1 } },
      { label: "يمزج بشكل مثالي مع باقي المكونات", scores: { ceremonial: 0, everyday: 0, culinary: 2 } },
    ],
  },
  {
    q: "متى تشرب الماتشا في الغالب؟",
    opts: [
      { label: "لحظات هادئة وخاصة",           scores: { ceremonial: 2, everyday: 0, culinary: 0 } },
      { label: "كوب يومي في الصباح",           scores: { ceremonial: 1, everyday: 2, culinary: 0 } },
      { label: "في المشروبات والحلويات",       scores: { ceremonial: 0, everyday: 0, culinary: 2 } },
    ],
  },
];

/* ─── Results ────────────────────────────────────────────────────── */
const RESULTS = {
  ceremonial: {
    label: "✦ فاخر جداً",
    sub: "احتفالية — درجة أولى",
    color: "#7a5c1e",
    bg: "rgba(212,175,55,0.12)",
    border: "rgba(212,175,55,0.4)",
    desc: "تناسبك الماتشا الاحتفالية عالية الجودة — تُحضَّر صافية بالماء الدافئ وتُشرب كريتشوال يومي هادئ. لونها أخضر مشرق وطعمها عميق وناعم.",
    drinks: ["ماتشا صافية ريتشوال 🍵", "أوزو صادوي — ماتشا بالماء الساخن 🫖", "ماتشا بالعسل الياباني 🍯"],
    link: "/products?type=ceremonial",
  },
  everyday: {
    label: "☕ يومي",
    sub: "متوازن — للاستخدام اليومي",
    color: "#3a5c3a",
    bg: "rgba(155,161,123,0.12)",
    border: "rgba(155,161,123,0.4)",
    desc: "الخيار المثالي لمن يريد ماتشا جيدة بسعر معقول للاستخدام اليومي — تنجح مع الحليب والماء على حدٍّ سواء.",
    drinks: ["ماتشا لاتيه بالحليب النباتي 🥛", "أيس ماتشا لاتيه 🧊", "ماتشا بالعسل والليمون 🍋"],
    link: "/products?type=everyday",
  },
  culinary: {
    label: "🧃 تجاري",
    sub: "للمشروبات والوصفات",
    color: "#5a4a3a",
    bg: "rgba(180,160,130,0.12)",
    border: "rgba(180,160,130,0.4)",
    desc: "مصممة للخلط مع مكونات قوية كالحليب المركز والفواكه والحلويات — تعطي لوناً جميلاً ونكهة واضحة حتى عند الخلط.",
    drinks: ["ماتشا فرابتشينو 🥤", "سموذي الماتشا بالموز 🍌", "كيك الماتشا الياباني 🍰", "آيس كريم ماتشا 🍦"],
    link: "/products?type=culinary",
  },
};

type TypeKey = keyof typeof RESULTS;

/* ─── Component ──────────────────────────────────────────────────── */
export default function MatchaFinder() {
  const [step, setStep]     = useState<"intro" | number | "result">("intro");
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult]  = useState<TypeKey | null>(null);

  function pick(qIdx: number, optIdx: number) {
    const next = [...answers, optIdx];
    setAnswers(next);
    if (next.length < QUESTIONS.length) {
      setStep(qIdx + 1);
    } else {
      // tally
      const scores: Record<TypeKey, number> = { ceremonial: 0, everyday: 0, culinary: 0 };
      next.forEach((aIdx, qI) => {
        const s = QUESTIONS[qI].opts[aIdx].scores;
        (Object.keys(s) as TypeKey[]).forEach(k => { scores[k] += s[k]; });
      });
      const winner = (Object.keys(scores) as TypeKey[]).reduce((a, b) => scores[a] >= scores[b] ? a : b);
      setResult(winner);
      setStep("result");
    }
  }

  function reset() {
    setStep("intro"); setAnswers([]); setResult(null);
  }

  const res = result ? RESULTS[result] : null;
  const qIdx = typeof step === "number" ? step : 0;
  const question = typeof step === "number" ? QUESTIONS[qIdx] : null;
  const progress = typeof step === "number" ? ((qIdx) / QUESTIONS.length) * 100 : step === "result" ? 100 : 0;

  return (
    <section style={{
      background: "#16281D",
      padding: "5rem 0",
      borderTop: "1px solid rgba(155,161,123,0.12)",
    }}>
      <div className="container" style={{ maxWidth: 640, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* ── Intro ── */}
        {step === "intro" && (
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase",
              color: "#9BA17B", marginBottom: "1.5rem",
            }}>
              MATCHA FINDER
            </p>
            <h2 style={{
              fontFamily: "'Aref Ruqaa', 'Cormorant Garamond', serif",
              fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
              fontWeight: 300, color: "#F2EADB", lineHeight: 1.2,
              marginBottom: "1rem",
            }}>
              مو متأكد أي ماتشا<br />
              <em>تناسبك؟</em>
            </h2>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              fontSize: "0.88rem", color: "rgba(155,161,123,0.85)",
              lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 380, margin: "0 auto 2.5rem",
            }}>
              جاوب على ٣ أسئلة بسيطة ونساعدك تختار الصنف المناسب لك — سواء للريتشوال اليومي أو اللاتيه أو الحلويات.
            </p>
            <button
              onClick={() => setStep(0)}
              style={{
                display: "inline-block",
                background: "#F2EADB", color: "#16281D",
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                fontSize: "0.95rem", fontWeight: 600,
                padding: "0.9rem 2.5rem",
                border: "none", cursor: "pointer",
                letterSpacing: "0.02em",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#DDD5C3")}
              onMouseLeave={e => (e.currentTarget.style.background = "#F2EADB")}
            >
              اكتشف ماتشاتك
            </button>
          </div>
        )}

        {/* ── Question ── */}
        {typeof step === "number" && question && (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.78rem", color: "#9BA17B" }}>
                  السؤال {qIdx + 1} من {QUESTIONS.length}
                </span>
                <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.78rem", color: "#9BA17B" }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div style={{ height: 2, background: "rgba(155,161,123,0.2)", borderRadius: 2 }}>
                <div style={{
                  height: "100%", width: `${progress}%`,
                  background: "#9BA17B", borderRadius: 2,
                  transition: "width 0.4s ease",
                }} />
              </div>
            </div>

            <h3 style={{
              fontFamily: "'Aref Ruqaa', 'Cormorant Garamond', serif",
              fontSize: "clamp(1.4rem,3vw,2rem)",
              fontWeight: 300, color: "#F2EADB", lineHeight: 1.3,
              marginBottom: "2rem", textAlign: "center",
            }}>
              {question.q}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {question.opts.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => pick(qIdx, i)}
                  style={{
                    width: "100%",
                    padding: "1.1rem 1.5rem",
                    background: "rgba(242,234,219,0.06)",
                    border: "1px solid rgba(155,161,123,0.25)",
                    color: "#F2EADB",
                    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                    fontSize: "0.92rem", textAlign: "right",
                    cursor: "pointer",
                    transition: "background 0.18s, border-color 0.18s",
                    direction: "rtl",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(155,161,123,0.18)";
                    e.currentTarget.style.borderColor = "rgba(155,161,123,0.6)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(242,234,219,0.06)";
                    e.currentTarget.style.borderColor = "rgba(155,161,123,0.25)";
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {qIdx > 0 && (
              <button
                onClick={() => { setStep(qIdx - 1); setAnswers(a => a.slice(0, -1)); }}
                style={{
                  marginTop: "1.5rem",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#9BA17B", fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                  fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem",
                }}>
                ← السؤال السابق
              </button>
            )}
          </div>
        )}

        {/* ── Result ── */}
        {step === "result" && res && (
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase",
              color: "#9BA17B", marginBottom: "1.5rem",
            }}>
              اختيارك المثالي
            </p>

            <div style={{
              background: res.bg,
              border: `1px solid ${res.border}`,
              padding: "2.5rem 2rem",
              marginBottom: "2rem",
            }}>
              <div style={{
                fontFamily: "'Aref Ruqaa', 'Cormorant Garamond', serif",
                fontSize: "clamp(2rem,4vw,3rem)",
                fontWeight: 300, color: res.color,
                marginBottom: "0.4rem",
              }}>
                {res.label}
              </div>
              <div style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                fontSize: "0.75rem", color: "#9BA17B",
                letterSpacing: "0.06em", marginBottom: "1.5rem",
              }}>
                {res.sub}
              </div>
              <p style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                fontSize: "0.88rem", color: "rgba(242,234,219,0.85)",
                lineHeight: 1.9, maxWidth: 420, margin: "0 auto 1.5rem",
              }}>
                {res.desc}
              </p>

              {/* Popular drinks */}
              <div style={{
                borderTop: `1px solid ${res.border}`,
                paddingTop: "1.25rem",
              }}>
                <p style={{
                  fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                  fontSize: "0.72rem", color: "#9BA17B",
                  marginBottom: "0.75rem", letterSpacing: "0.04em",
                }}>
                  مشروبات تنجح معها
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                  {res.drinks.map((d, i) => (
                    <span key={i} style={{
                      background: "rgba(242,234,219,0.08)",
                      border: `1px solid ${res.border}`,
                      color: "#F2EADB",
                      fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                      fontSize: "0.78rem",
                      padding: "0.3rem 0.8rem",
                    }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={res.link} style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "#F2EADB", color: "#16281D",
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                fontSize: "0.9rem", fontWeight: 600,
                padding: "0.85rem 2rem", textDecoration: "none",
              }}>
                تسوق هذا الصنف <ArrowLeft size={15} />
              </Link>
              <button
                onClick={reset}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "none",
                  border: "1px solid rgba(155,161,123,0.4)",
                  color: "#9BA17B",
                  fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                  fontSize: "0.88rem",
                  padding: "0.85rem 1.5rem",
                  cursor: "pointer",
                }}>
                <RotateCcw size={14} />
                أعد الاختبار
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
