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
    `مرحباً فريق اوجي ،أرغب في طلب عينة ماتشا مناسبة لمشروعي .

اسم المشروع:
قطاع النشاط:
الدولة والمدينة:
الاستخدام المتوقع:
الدرجة التي أرغب بتجربتها إن وجدت:`
  );

  const waUrl = `https://wa.me/${adminWhatsapp}?text=${message}`;

  useEffect(() => {
    // Auto-redirect after 2.5 seconds
    const t = setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 2500);
    return () => clearTimeout(t);
  }, [waUrl]);

  return (
    <div style={{ background: "#F2EADB", minHeight: "100vh", paddingTop: 100, direction: "rtl" }}>
      <div className="container" style={{ maxWidth: 780 }}>
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "4rem 0 3rem" }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: "0.58rem",
            letterSpacing: "0.35em", textTransform: "uppercase", color: "#9BA17B", marginBottom: "1.5rem",
          }}>B2B — مبيعات الجملة</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: 300, color: "#1C201B", lineHeight: 1.2, marginBottom: "1.25rem",
          }}>
            أضف ماتشا UJI<br />
            <em>إلى مشروعك</em>
          </h1>
          <p style={{
            fontFamily: "'IBM Plex Sans Arabic', sans-serif",
            fontSize: "0.92rem", lineHeight: 1.9, color: "#9BA17B",
            maxWidth: 520, margin: "0 auto 3rem",
          }}>
            نوفر حلول ماتشا احتفالية للمطاعم والكافيهات والعلامات التجارية في المنطقة — تواصل معنا لطلب عينة مناسبة لمشروعك.
          </p>

          {/* WhatsApp Button */}
          <a
            href={waUrl}
            target="_blank" rel="noopener"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              background: "#25D366", color: "#fff",
              padding: "1rem 2.5rem",
              textDecoration: "none",
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              fontSize: "1rem", fontWeight: 500,
              boxShadow: "0 8px 32px rgba(37,211,102,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(37,211,102,0.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(37,211,102,0.3)"; }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            تواصل عبر واتساب الآن
          </a>

          <p style={{
            fontFamily: "'IBM Plex Sans Arabic', sans-serif",
            fontSize: "0.8rem", color: "#C8BBA4", marginTop: "1rem",
          }}>
            سيتم توجيهك تلقائياً خلال ثوانٍ
          </p>
        </div>

        {/* Features */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem",
          padding: "3rem 0", borderTop: "1px solid rgba(200,187,164,0.3)",
          borderBottom: "1px solid rgba(200,187,164,0.3)",
        }}>
          {[
            { icon: "🍃", title: "درجة احتفالية", body: "ماتشا من أجود المستويات ومناسبة للمشروبات الراقية" },
            { icon: "📦", title: "توريد بالجملة", body: "كميات متنوعة تناسب احتياجات مشروعك" },
            { icon: "✦", title: "دعم كامل", body: "وصفات وتدريب وعينات مجانية قبل الشراء" },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 300, color: "#1C201B", marginBottom: "0.75rem" }}>{title}</h3>
              <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: "#9BA17B", lineHeight: 1.8 }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Form hint */}
        <div style={{ background: "#16281D", padding: "3rem", textAlign: "center", marginTop: "3rem" }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 300, color: "#F2EADB", marginBottom: "1rem" }}>
            أرسل لنا معلومات مشروعك
          </p>
          <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: "#9BA17B", lineHeight: 1.9 }}>
            اسم المشروع · قطاع النشاط · الدولة والمدينة<br />
            الاستخدام المتوقع · الدرجة المطلوبة
          </p>
        </div>
      </div>
    </div>
  );
}
