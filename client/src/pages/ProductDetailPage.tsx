import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useCart } from "../hooks/useCart";
import { ArrowRight, ShoppingBag, Check } from "lucide-react";

export default function ProductDetailPage() {
  const [, params] = useRoute("/products/:id");
  const { data: p, isLoading } = useQuery({
    queryKey: ["product", params?.id],
    queryFn: () => api.get(`/products/${params?.id}`),
  });
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  if (isLoading) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F2EADB" }}>
      <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", color: "#9BA17B" }}>جار التحميل...</p>
    </div>
  );
  if (!p) return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", background: "#F2EADB" }}>
      <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", color: "#9BA17B" }}>المنتج غير موجود</p>
      <Link href="/products" className="btn-outline">← العودة</Link>
    </div>
  );

  const imgs = p.images?.length ? p.images : [];
  const discount = p.comparePrice > p.price ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100) : 0;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) add({ _id: p._id, name: p.name, price: p.price, image: imgs[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div style={{ background: "#F2EADB", minHeight: "100vh", paddingTop: 100, paddingBottom: 80 }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "3rem" }}>
          <Link href="/products" style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#9BA17B", textTransform: "uppercase" }}>
            المتجر
          </Link>
          <ArrowRight size={10} color="#C8BBA4" />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#C8BBA4", textTransform: "uppercase" }}>
            {p.nameEn || p.name}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
          {/* ── Images ── */}
          <div>
            {/* Main image */}
            <div style={{
              aspectRatio: "1", background: "#F7F2E8",
              border: "1px solid rgba(200,187,164,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", marginBottom: "0.75rem",
            }}>
              {imgs[imgIdx] ? (
                <img
                  src={imgs[imgIdx]} alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: "2rem" }}
                  onError={e => { (e.target as any).style.display = "none"; }}
                />
              ) : (
                <div style={{ width: "60%", height: "60%", background: "rgba(200,187,164,0.2)" }} />
              )}
            </div>
            {/* Thumbnails */}
            {imgs.length > 1 && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {imgs.map((im: string, i: number) => (
                  <button
                    key={i} onClick={() => setImgIdx(i)}
                    style={{
                      width: 72, height: 72, padding: 4,
                      border: `1px solid ${i === imgIdx ? "#1F3929" : "rgba(200,187,164,0.3)"}`,
                      background: "#F7F2E8", cursor: "pointer", transition: "border-color 0.2s",
                    }}>
                    <img src={im} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div style={{ paddingTop: "1rem" }}>
            {p.category && (
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.58rem", letterSpacing: "0.28em", color: "#9BA17B", textTransform: "uppercase", marginBottom: "1rem" }}>
                {p.category === "matcha" ? "MATCHA" : p.category === "tools" ? "TOOLS" : p.category}
              </p>
            )}

            <h1 style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "clamp(2rem,3.5vw,3rem)",
              fontWeight: 300, color: "#1C201B", lineHeight: 1.15,
              marginBottom: "0.75rem",
            }}>{p.name}</h1>

            {p.nameEn && (
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#C8BBA4", marginBottom: "1.5rem" }}>{p.nameEn}</p>
            )}

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "2rem" }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", color: "#1F3929", fontWeight: 400 }}>
                {p.price?.toFixed(2)} <span style={{ fontSize: "0.9rem", fontFamily: "'IBM Plex Sans Arabic',sans-serif" }}>ر.س</span>
              </span>
              {discount > 0 && (
                <>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", color: "#C8BBA4", textDecoration: "line-through" }}>
                    {p.comparePrice?.toFixed(2)} ر.س
                  </span>
                  <span style={{ background: "#1F3929", color: "#9BA17B", fontSize: "0.65rem", padding: "2px 8px", letterSpacing: "0.1em", fontFamily: "'Inter',sans-serif" }}>
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {p.description && (
              <p style={{
                fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                fontSize: "0.88rem", lineHeight: 1.9, color: "#9BA17B",
                marginBottom: "2.5rem",
              }}>{p.description}</p>
            )}

            {/* Separator */}
            <div style={{ width: 40, height: 1, background: "rgba(200,187,164,0.4)", marginBottom: "2.5rem" }} />

            {/* Qty + Add */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
              <div style={{ display: "flex", border: "1px solid rgba(200,187,164,0.4)", background: "#F7F2E8" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 44, height: 52, background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#1C201B" }}>−</button>
                <span style={{ width: 44, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "#1C201B" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 44, height: 52, background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#1C201B" }}>+</button>
              </div>
              <button
                onClick={handleAdd}
                disabled={p.stock === 0}
                className={added ? "" : "btn-primary"}
                style={{
                  flex: 1, height: 52,
                  background: added ? "#1F3929" : undefined,
                  color: added ? "#9BA17B" : undefined,
                  border: added ? "none" : undefined,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                  cursor: p.stock === 0 ? "not-allowed" : "pointer",
                  opacity: p.stock === 0 ? 0.5 : 1,
                  transition: "all 0.3s",
                }}>
                {p.stock === 0 ? "نفدت الكمية" : added ? <><Check size={16} strokeWidth={2}/> أضيف للسلة</> : <><ShoppingBag size={16} strokeWidth={1.5}/> أضف للسلة</>}
              </button>
            </div>

            {p.stock > 0 && p.stock <= 5 && (
              <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.78rem", color: "#c0392b", marginBottom: "1.5rem" }}>
                باقي {p.stock} فقط في المخزون
              </p>
            )}

            {/* Features */}
            <div style={{ borderTop: "1px solid rgba(200,187,164,0.3)", paddingTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                "شحن مجاني للطلبات فوق ٢٠٠ ر.س",
                "توصيل خلال ٣–٥ أيام عمل",
                "الدفع عند الاستلام متاح",
              ].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#9BA17B", flexShrink: 0 }} />
                  <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: "#9BA17B", margin: 0 }}>{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
}
