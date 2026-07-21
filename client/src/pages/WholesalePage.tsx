import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export default function WholesalePage() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get("/settings"),
  });

  const adminWhatsapp = (settings as any)?.whatsapp || "966552469643";

  const message = encodeURIComponent(
    `مرحباً فريق UJI، أرغب في تقديم ماتشا UJI في مشروعي.

اسم المشروع:
قطاع النشاط:
الدولة والمدينة:
الاستخدام المتوقع:
الدرجة التي أرغب بتجربتها:`
  );

  const waUrl = `https://wa.me/${adminWhatsapp}?text=${message}`;

  useEffect(() => {
    const t = setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 2500);
    return () => clearTimeout(t);
  }, [waUrl]);

  return (
    <div style={{ background: "#F2EADB", minHeight: "100vh", direction: "rtl" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "#16281D",
        padding: "120px 24px 80px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "#9BA17B",
          marginBottom: "1.75rem",
        }}>للمقاهي والمشاريع</p>

        <h1 style={{
          fontFamily: "'Aref Ruqaa', serif",
          fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
          fontWeight: 700,
          color: "#F2EADB",
          lineHeight: 1.25,
          marginBottom: "1.5rem",
          letterSpacing: "0.02em",
        }}>
          نقدم الماتشا<br />
          <span style={{ color: "#9BA17B" }}>كما يستحق عميلك</span>
        </h1>

        <p style={{
          fontFamily: "'IBM Plex Sans Arabic', sans-serif",
          fontSize: "0.95rem",
          lineHeight: 2,
          color: "rgba(242,234,219,0.7)",
          maxWidth: 480,
          margin: "0 auto 2.5rem",
        }}>
          من الوصفات الجاهزة إلى تدريب فريقك — نبني معك تجربة ماتشا تجعل عميلك يعود.
        </p>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "#F2EADB",
            color: "#16281D",
            padding: "1rem 2.5rem",
            textDecoration: "none",
            fontFamily: "'IBM Plex Sans Arabic', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 600,
            letterSpacing: "0.03em",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F2EADB"; }}
        >
          تواصل معنا ←
        </a>

        <p style={{
          fontFamily: "'IBM Plex Sans Arabic', sans-serif",
          fontSize: "0.75rem",
          color: "rgba(155,161,123,0.6)",
          marginTop: "1rem",
        }}>
          سيتم توجيهك تلقائياً خلال ثوانٍ
        </p>
      </div>

      {/* ── Three pillars ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "4rem 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1px",
          background: "rgba(200,187,164,0.25)",
          border: "1px solid rgba(200,187,164,0.25)",
        }}>
          {[
            {
              num: "٠١",
              title: "ماتشا احتفالية",
              body: "ماتشا يابانية من أعلى الدرجات، مناسبة للمشروبات الراقية والقوائم المميزة.",
            },
            {
              num: "٠٢",
              title: "وصفات وتدريب",
              body: "نقدم وصفات جاهزة وتدريباً لفريقك حتى تُقدَّم كل كوب بالطريقة الصحيحة.",
            },
            {
              num: "٠٣",
              title: "دعم متواصل",
              body: "لا تختفي بعد أول طلب — نبقى معك في كل مرحلة من مراحل نمو مشروعك.",
            },
          ].map(({ num, title, body }) => (
            <div
              key={num}
              style={{
                background: "#FDFAF5",
                padding: "2.5rem 2rem",
                textAlign: "right",
              }}
            >
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.35em",
                color: "#9BA17B",
                marginBottom: "1.25rem",
              }}>{num}</div>
              <h3 style={{
                fontFamily: "'Aref Ruqaa', serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#16281D",
                marginBottom: "0.75rem",
                lineHeight: 1.3,
              }}>{title}</h3>
              <p style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                fontSize: "0.85rem",
                color: "#9BA17B",
                lineHeight: 1.9,
              }}>{body}</p>
            </div>
          ))}
        </div>

        {/* ── CTA Strip ── */}
        <div style={{
          marginTop: "3rem",
          background: "#1F3929",
          padding: "3rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              fontFamily: "'Aref Ruqaa', serif",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#F2EADB",
              marginBottom: "0.5rem",
              lineHeight: 1.3,
            }}>أرسل لنا معلومات مشروعك</p>
            <p style={{
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              fontSize: "0.82rem",
              color: "#9BA17B",
              lineHeight: 1.9,
            }}>
              اسم المشروع · قطاع النشاط · الاستخدام المتوقع
            </p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "#25D366",
              color: "#fff",
              padding: "0.9rem 2rem",
              textDecoration: "none",
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            واتساب
          </a>
        </div>
      </div>

    </div>
  );
}
