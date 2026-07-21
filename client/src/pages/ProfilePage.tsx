import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { Link } from "wouter";
import { Star, ShoppingBag, Gift, User, Award, ChevronDown, ChevronUp } from "lucide-react";

/* ─── Tier config ─────────────────────────────────────── */
const TIERS: Record<string, { label: string; color: string; bg: string; next: number }> = {
  bronze:   { label: "برونزي",   color: "#CD7F32", bg: "#FDF6EC", next: 300 },
  silver:   { label: "فضي",      color: "#9BA17B", bg: "#F4F5F0", next: 1000 },
  gold:     { label: "ذهبي",     color: "#D4AF37", bg: "#FDFAEE", next: 2000 },
  platinum: { label: "بلاتيني",  color: "#6B7280", bg: "#F3F4F6", next: 0 },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "في الانتظار",  color: "#D97706" },
  confirmed: { label: "مؤكد",         color: "#2563EB" },
  shipped:   { label: "تم الشحن",     color: "#7C3AED" },
  delivered: { label: "تم التوصيل",   color: "#059669" },
  cancelled: { label: "ملغي",         color: "#DC2626" },
};

/* ─── Page ────────────────────────────────────────────── */
export default function ProfilePage() {
  const { user } = useAuth();
  const [openOrder, setOpenOrder] = useState<string | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/me/orders") as Promise<any[]>,
    enabled: !!user,
  });

  if (!user) return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", background: "#F2EADB" }}>
      <User size={40} color="#C8BBA4" strokeWidth={1} />
      <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", color: "#9BA17B" }}>يرجى تسجيل الدخول أولاً</p>
      <Link href="/" className="btn-primary">العودة للرئيسية</Link>
    </div>
  );

  const u = user as any;
  const tier = TIERS[u.loyaltyTier || "bronze"];
  const points = u.loyaltyPoints || 0;
  const progress = tier.next > 0 ? Math.min(100, (points / tier.next) * 100) : 100;

  return (
    <div style={{ background: "#F2EADB", minHeight: "100vh", paddingTop: 100, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Header */}
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#9BA17B", marginBottom: "2rem" }}>
          ACCOUNT — حسابي
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem", alignItems: "start" }}>

          {/* ── Sidebar card ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Profile card */}
            <div style={{ background: "#FDFAF5", border: "1px solid rgba(200,187,164,0.3)", padding: "1.75rem", textAlign: "center" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: tier.bg, border: `2px solid ${tier.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1rem",
              }}>
                <User size={28} strokeWidth={1} color={tier.color} />
              </div>
              <p style={{ fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 400, color: "#1C201B", margin: "0 0 4px" }}>
                {u.name}
              </p>
              <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.78rem", color: "#9BA17B", margin: "0 0 8px", direction: "ltr" }}>
                {u.phone}
              </p>
              {u.role === "employee" && (
                <span style={{
                  display: "inline-block", background: "#1F3929", color: "#F2EADB",
                  fontSize: "0.65rem", letterSpacing: "0.15em", padding: "3px 10px", fontFamily: "'Inter',sans-serif",
                }}>
                  {u.jobTitle || "موظف"} · EMPLOYEE
                </span>
              )}
            </div>

            {/* Loyalty card */}
            <div style={{ background: tier.bg, border: `1px solid ${tier.color}30`, padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
                <Award size={18} color={tier.color} strokeWidth={1.5} />
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: tier.color }}>
                  LOYALTY — {tier.label.toUpperCase()}
                </span>
              </div>
              <p style={{ fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 300, color: "#1C201B", margin: "0 0 4px", lineHeight: 1 }}>
                {points.toLocaleString("ar-SA")}
              </p>
              <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.78rem", color: "#9BA17B", margin: "0 0 1rem" }}>نقطة مكافأة</p>
              {tier.next > 0 && (
                <>
                  <div style={{ background: "rgba(0,0,0,0.08)", height: 4, borderRadius: 2, marginBottom: 8 }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: tier.color, borderRadius: 2, transition: "width 0.5s" }} />
                  </div>
                  <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.72rem", color: "#9BA17B", margin: 0 }}>
                    {(tier.next - points).toLocaleString("ar-SA")} نقطة للمستوى التالي
                  </p>
                </>
              )}
              {tier.next === 0 && (
                <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.72rem", color: tier.color, margin: 0, fontWeight: 600 }}>
                  ✦ أعلى مستوى — بلاتيني
                </p>
              )}
            </div>

            {/* How points work */}
            <div style={{ background: "#FDFAF5", border: "1px solid rgba(200,187,164,0.3)", padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem" }}>
                <Gift size={15} color="#9BA17B" strokeWidth={1.5} />
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#9BA17B" }}>كيف تكسب النقاط؟</span>
              </div>
              {[
                { desc: "1 نقطة لكل 10 ر.س تنفقها", icon: "🛒" },
                { desc: "300 نقطة → مستوى فضي", icon: "🥈" },
                { desc: "1000 نقطة → مستوى ذهبي", icon: "🥇" },
                { desc: "2000 نقطة → مستوى بلاتيني", icon: "💎" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: i < 3 ? "1px solid rgba(200,187,164,0.2)" : "none" }}>
                  <span style={{ fontSize: "0.85rem" }}>{item.icon}</span>
                  <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.75rem", color: "#6B7280" }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Orders ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.25rem" }}>
              <ShoppingBag size={18} color="#9BA17B" strokeWidth={1.5} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#9BA17B" }}>
                MY ORDERS — طلباتي
              </span>
            </div>

            {isLoading && (
              <div style={{ textAlign: "center", padding: "3rem", color: "#9BA17B", fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.88rem" }}>
                جار التحميل...
              </div>
            )}

            {!isLoading && orders.length === 0 && (
              <div style={{ background: "#FDFAF5", border: "1px solid rgba(200,187,164,0.3)", padding: "3rem", textAlign: "center" }}>
                <ShoppingBag size={36} color="#C8BBA4" strokeWidth={1} style={{ marginBottom: "1rem" }} />
                <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", color: "#9BA17B", margin: 0 }}>لا توجد طلبات بعد</p>
                <Link href="/products" style={{ display: "inline-block", marginTop: "1rem", color: "#1F3929", fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.85rem", fontWeight: 600, textDecoration: "underline" }}>
                  تسوق الآن
                </Link>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {orders.map((order: any) => {
                const st = STATUS_LABELS[order.status] || { label: order.status, color: "#9BA17B" };
                const isOpen = openOrder === order._id;
                return (
                  <div key={order._id} style={{ background: "#FDFAF5", border: "1px solid rgba(200,187,164,0.3)" }}>
                    <div
                      onClick={() => setOpenOrder(isOpen ? null : order._id)}
                      style={{ padding: "1rem 1.25rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <div>
                        <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.88rem", color: "#1C201B", margin: "0 0 4px", fontWeight: 600 }}>
                          {order.orderNumber}
                        </p>
                        <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.75rem", color: "#9BA17B", margin: 0 }}>
                          {new Date(order.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.88rem", fontWeight: 600, color: "#1C201B" }}>
                          {order.total?.toFixed(2)} ر.س
                        </span>
                        <span style={{
                          fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.72rem",
                          color: st.color, background: `${st.color}15`,
                          padding: "3px 10px", borderRadius: 20,
                        }}>
                          {st.label}
                        </span>
                        {isOpen ? <ChevronUp size={16} color="#9BA17B" /> : <ChevronDown size={16} color="#9BA17B" />}
                      </div>
                    </div>

                    {isOpen && (
                      <div style={{ borderTop: "1px solid rgba(200,187,164,0.3)", padding: "1rem 1.25rem" }}>
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < order.items.length - 1 ? "1px solid rgba(200,187,164,0.2)" : "none" }}>
                            <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: "#1C201B" }}>
                              {item.name} × {item.qty}
                            </span>
                            <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: "#9BA17B" }}>
                              {(item.price * item.qty).toFixed(2)} ر.س
                            </span>
                          </div>
                        ))}
                        <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: 4 }}>
                          {order.discount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.78rem", color: "#059669" }}>خصم كوبون</span>
                              <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.78rem", color: "#059669" }}>-{order.discount?.toFixed(2)} ر.س</span>
                            </div>
                          )}
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.78rem", color: "#9BA17B" }}>الشحن</span>
                            <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.78rem", color: "#9BA17B" }}>
                              {order.shipping === 0 ? "مجاني" : `${order.shipping?.toFixed(2)} ر.س`}
                            </span>
                          </div>
                          {order.pointsEarned > 0 && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F2F7F3", padding: "6px 10px", marginTop: 4 }}>
                              <Star size={13} color="#1F3929" strokeWidth={1.5} />
                              <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.75rem", color: "#1F3929" }}>
                                ربحت {order.pointsEarned} نقطة ولاء
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
