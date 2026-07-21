import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { CheckCircle, ShoppingBag, Tag, X, Star, CreditCard, MapPin, Navigation } from "lucide-react";
import PhoneInput, { COUNTRIES, type Country } from "../components/PhoneInput";

const inp: React.CSSProperties = {
  width: "100%", height: 48,
  background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.4)",
  padding: "0 1rem",
  fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: "0.88rem", color: "#1C201B",
  outline: "none", borderRadius: 0, boxSizing: "border-box",
  transition: "border-color 0.2s",
};
const label: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif", fontSize: "0.6rem",
  letterSpacing: "0.2em", textTransform: "uppercase", color: "#9BA17B",
  marginBottom: 6, display: "block",
};
const sectionTitle: React.CSSProperties = {
  fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif", fontSize: "1.1rem",
  fontWeight: 300, color: "#1C201B", letterSpacing: "0.06em",
  borderBottom: "1px solid rgba(200,187,164,0.3)", paddingBottom: "0.75rem",
  marginBottom: "1.25rem",
};

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: (user as any)?.name || "",
    phone: (user as any)?.phone || "",
    email: "",
    city: "", district: "", street: "", addressNotes: "",
    paymentMethod: "cod", notes: "",
  });
  const [phoneCountry, setPhoneCountry] = useState(COUNTRIES[0]);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  // Coupon state
  const [geoPos, setGeoPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  const getLocation = () => {
    if (!navigator.geolocation) { setGeoError("المتصفح لا يدعم تحديد الموقع"); return; }
    setGeoLoading(true); setGeoError("");
    navigator.geolocation.getCurrentPosition(
      pos => { setGeoPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoLoading(false); },
      () => { setGeoError("تعذّر تحديد الموقع — تأكد من السماح بالوصول"); setGeoLoading(false); },
      { timeout: 10000 }
    );
  };

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponData, setCouponData] = useState<{ code: string; discount: number; type: string; value: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Fetch shipping settings from server
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get("/settings"),
    staleTime: 5 * 60 * 1000,
  });
  const shippingFeeValue = Number((settings as any)?.shippingFee ?? 30);
  const shippingThreshold = Number((settings as any)?.shippingFreeThreshold ?? 200);
  const geideaEnabled = (settings as any)?._geideaEnabled === true;
  const adminWhatsapp = (settings as any)?.whatsapp || "966552469643";
  const codEnabled    = (settings as any)?._codEnabled  !== false;
  const bankEnabled   = (settings as any)?._bankEnabled !== false;
  const stcEnabled    = (settings as any)?._stcEnabled  !== false;
  const bankIban      = (settings as any)?.bankIban  || "";
  const bankName      = (settings as any)?.bankName  || "مصرف الراجحي";
  const stcPayNumber  = (settings as any)?.stcPayNumber || "0552469643";

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= shippingThreshold ? 0 : shippingFeeValue;
  const couponDiscount = couponData?.discount || 0;
  const total = Math.max(0, subtotal - couponDiscount + shipping);
  const pointsToEarn = Math.floor(total / 10);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true); setCouponError(""); setCouponData(null);
    try {
      const result = await api.post("/coupons/apply", { code: couponInput.trim(), orderTotal: subtotal }) as any;
      setCouponData(result);
    } catch (e: any) {
      setCouponError(e.message || "كوبون غير صحيح");
    }
    setCouponLoading(false);
  };

  const removeCoupon = () => { setCouponData(null); setCouponInput(""); setCouponError(""); };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const result = await api.post("/orders", {
        customer: { name: form.name, phone: form.phone, email: form.email || undefined },
        address: {
          city: form.city, district: form.district, street: form.street, notes: form.addressNotes,
          ...(geoPos ? { lat: geoPos.lat, lng: geoPos.lng, mapLink: `https://maps.google.com/?q=${geoPos.lat},${geoPos.lng}` } : {}),
        },
        items: items.map(i => ({ product: i._id, name: i.name, price: i.price, qty: i.qty })),
        paymentMethod: form.paymentMethod,
        couponCode: couponData?.code,
        notes: form.notes,
      }) as any;
      // Geidea redirect
      if (result.geideaRedirectUrl) {
        clear();
        window.location.href = result.geideaRedirectUrl;
        return;
      }
      setOrder(result.order || result); clear();
    } catch (e: any) { setError(e.message || "حدث خطأ، حاول مرة أخرى"); }
    setLoading(false);
  };

  if (!items.length && !order) return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", background: "#F2EADB" }}>
      <ShoppingBag size={40} color="#C8BBA4" strokeWidth={1} />
      <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", color: "#9BA17B" }}>السلة فارغة</p>
      <Link href="/products" className="btn-primary">تسوق الآن</Link>
    </div>
  );

  if (order) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F2EADB", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <CheckCircle size={56} color="#1F3929" strokeWidth={1} style={{ marginBottom: "1.5rem" }} />
        <h2 style={{ fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 300, color: "#1C201B", marginBottom: "0.75rem" }}>
          تم تأكيد طلبك
        </h2>
        <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", color: "#9BA17B", marginBottom: "0.5rem" }}>
          رقم الطلب: <strong style={{ color: "#1F3929" }}>{order.orderNumber}</strong>
        </p>
        {order.pointsEarned > 0 && user && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", background: "#F2F7F3", padding: "10px 16px", margin: "0.75rem 0", border: "1px solid #A8C8B0" }}>
            <Star size={16} color="#1F3929" strokeWidth={1.5} />
            <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.85rem", color: "#1F3929" }}>
              ربحت {order.pointsEarned} نقطة ولاء على هذا الطلب!
            </span>
          </div>
        )}
        {form.email && (
          <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", color: "#9BA17B", fontSize: "0.85rem", marginBottom: "2rem" }}>
            تم إرسال تأكيد إلى {form.email}
          </p>
        )}
        {!form.email && <div style={{ marginBottom: "2rem" }} />}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={`https://wa.me/966552469643?text=رقم طلبي: ${order.orderNumber}`}
            target="_blank" rel="noopener"
            style={{ background: "#25D366", color: "#fff", padding: "0.75rem 1.5rem", fontSize: "0.85rem", fontFamily: "inherit", textDecoration: "none", borderRadius: 4 }}>
            تواصل عبر واتساب
          </a>
          <Link href="/" className="btn-outline">العودة للرئيسية</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#F2EADB", paddingTop: 100, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#9BA17B", marginBottom: "2rem" }}>
          CHECKOUT — إتمام الطلب
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "4rem", alignItems: "start" }}>
          {/* ── Form ── */}
          <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {/* Personal info */}
            <section>
              <p style={sectionTitle}>01 — معلوماتك</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={label}>الاسم الكامل *</label>
                  <input style={inp} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="محمد العمري" required />
                </div>
                <div>
                  <label style={label}>رقم الجوال *</label>
                  <PhoneInput
                    theme="light"
                    value={form.phone}
                    onChange={(num, c) => { setForm({...form, phone: num}); setPhoneCountry(c); }}
                    countryCode={phoneCountry.code}
                    onCountryChange={setPhoneCountry}
                    required
                    style={{ height: 48 }}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={label}>البريد الإلكتروني <span style={{ color: "#C8BBA4" }}>(اختياري — لاستلام تأكيد)</span></label>
                  <input style={inp} value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="example@email.com" type="email" />
                </div>
              </div>
            </section>

            {/* Address */}
            <section>
              <p style={sectionTitle}>02 — عنوان التوصيل</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={label}>المدينة *</label>
                  <input style={inp} value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="الرياض" required />
                </div>
                <div>
                  <label style={label}>الحي *</label>
                  <input style={inp} value={form.district} onChange={e => setForm({...form, district: e.target.value})} placeholder="حي النخيل" required />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={label}>اسم الشارع</label>
                  <input style={inp} value={form.street} onChange={e => setForm({...form, street: e.target.value})} placeholder="شارع الأمير محمد" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={label}>ملاحظات العنوان</label>
                  <input style={inp} value={form.addressNotes} onChange={e => setForm({...form, addressNotes: e.target.value})} placeholder="الدور، رقم الشقة..." />
                </div>

                {/* Map location picker */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={label}>الموقع على الخريطة <span style={{ color: "#C8BBA4" }}>(اختياري — يساعد في التوصيل)</span></label>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={getLocation}
                      disabled={geoLoading}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.5rem",
                        height: 44, padding: "0 1.25rem",
                        background: geoPos ? "#1F3929" : "#F7F2E8",
                        color: geoPos ? "#F2EADB" : "#1C201B",
                        border: "1px solid rgba(200,187,164,0.5)",
                        fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                        fontSize: "0.82rem", cursor: geoLoading ? "wait" : "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <Navigation size={14} />
                      {geoLoading ? "جاري التحديد..." : geoPos ? "✓ تم تحديد موقعك" : "تحديد موقعي تلقائياً"}
                    </button>
                    {geoPos && (
                      <a
                        href={`https://maps.google.com/?q=${geoPos.lat},${geoPos.lng}`}
                        target="_blank" rel="noopener"
                        style={{ fontSize: "0.75rem", color: "#9BA17B", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <MapPin size={12} /> عرض على الخريطة
                      </a>
                    )}
                    {geoPos && (
                      <button type="button" onClick={() => setGeoPos(null)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#C8BBA4", fontSize: "0.75rem" }}>
                        إلغاء
                      </button>
                    )}
                  </div>
                  {geoError && <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.75rem", color: "#C87070", marginTop: 6 }}>{geoError}</p>}
                  {geoPos && (
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${geoPos.lng-0.008},${geoPos.lat-0.008},${geoPos.lng+0.008},${geoPos.lat+0.008}&layer=mapnik&marker=${geoPos.lat},${geoPos.lng}`}
                      style={{ width: "100%", height: 200, border: "1px solid rgba(200,187,164,0.4)", marginTop: "0.75rem", display: "block" }}
                      title="موقعك"
                    />
                  )}
                </div>
              </div>
            </section>

            {/* Coupon */}
            <section>
              <p style={sectionTitle}>03 — كود الخصم <span style={{ fontSize: "0.75rem", color: "#9BA17B" }}>(اختياري)</span></p>
              {!couponData ? (
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <Tag size={15} color="#9BA17B" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <input
                      style={{ ...inp, paddingRight: 40, letterSpacing: "0.12em", textTransform: "uppercase" }}
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="أدخل كود الخصم"
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); applyCoupon(); } }}
                    />
                  </div>
                  <button
                    type="button" onClick={applyCoupon} disabled={couponLoading || !couponInput.trim()}
                    style={{
                      height: 48, padding: "0 1.25rem",
                      background: couponInput.trim() ? "#1F3929" : "#C8BBA4",
                      color: "#F2EADB", border: "none", cursor: couponInput.trim() ? "pointer" : "not-allowed",
                      fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem",
                      whiteSpace: "nowrap", transition: "background 0.2s",
                    }}
                  >
                    {couponLoading ? "..." : "تطبيق"}
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F2F7F3", border: "1px solid #A8C8B0", padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Tag size={16} color="#1F3929" strokeWidth={1.5} />
                    <div>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.72rem", letterSpacing: "0.15em", color: "#1F3929", margin: 0, fontWeight: 600 }}>{couponData.code}</p>
                      <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.75rem", color: "#059669", margin: 0 }}>
                        خصم {couponData.type === "percent" ? `${couponData.value}%` : `${couponData.value} ر.س`} — وفّرت {couponData.discount.toFixed(2)} ر.س
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={removeCoupon} style={{ background: "none", border: "none", cursor: "pointer", color: "#9BA17B" }}>
                    <X size={16} />
                  </button>
                </div>
              )}
              {couponError && <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.78rem", color: "#C87070", margin: "8px 0 0" }}>{couponError}</p>}
            </section>

            {/* Payment */}
            <section>
              <p style={sectionTitle}>04 — طريقة الدفع</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  ...(codEnabled  ? [{ val: "cod",    label: "الدفع عند الاستلام", sub: "نقداً أو بطاقة عند وصول الطلب" }] : []),
                  ...(geideaEnabled ? [{ val: "geidea", label: "بطاقة ائتمانية", sub: "Visa / Mastercard — عبر Geidea" }] : []),
                  ...(stcEnabled  ? [{ val: "stcpay", label: "STC Pay", sub: `حوّل على ${stcPayNumber}` }] : []),
                  ...(bankEnabled ? [{ val: "bank",   label: "تحويل بنكي", sub: bankIban ? `${bankName} — ${bankIban}` : "سيتم إرسال تفاصيل الحساب عبر واتساب" }] : []),
                ].map(opt => (
                  <label key={opt.val} style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    border: `1px solid ${form.paymentMethod === opt.val ? "#1F3929" : "rgba(200,187,164,0.3)"}`,
                    background: form.paymentMethod === opt.val ? "rgba(31,57,41,0.06)" : "#F7F2E8",
                    padding: "1rem 1.25rem", cursor: "pointer", transition: "border-color 0.2s",
                  }}>
                    <input type="radio" value={opt.val} checked={form.paymentMethod === opt.val} onChange={() => setForm({...form, paymentMethod: opt.val})} style={{ width: "auto", accentColor: "#1F3929" }} />
                    <div>
                      <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.88rem", color: "#1C201B", margin: 0 }}>{opt.label}</p>
                      <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.75rem", color: "#9BA17B", margin: 0 }}>{opt.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Notes */}
            <section>
              <label style={label}>ملاحظات إضافية <span style={{ color: "#C8BBA4" }}>(اختياري)</span></label>
              <textarea
                style={{ ...inp, height: 80, resize: "none", paddingTop: "0.75rem" } as any}
                value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                placeholder="أي طلبات خاصة..."
              />
            </section>

            {error && <p style={{ color: "#c0392b", fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.85rem", margin: 0 }}>{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary" style={{ height: 54, fontSize: "0.9rem", letterSpacing: "0.08em" }}>
              {loading ? "جار المعالجة..." : "تأكيد الطلب ✦"}
            </button>
          </form>

          {/* ── Order summary ── */}
          <div style={{ position: "sticky", top: 100 }}>
            <div style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.3)", padding: "1.75rem" }}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#9BA17B", marginBottom: "1.25rem" }}>
                ORDER SUMMARY — ملخص الطلب
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {items.map(item => (
                  <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.85rem", color: "#1C201B", margin: "0 0 2px" }}>{item.name}</p>
                      <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.75rem", color: "#9BA17B", margin: 0 }}>× {item.qty}</p>
                    </div>
                    <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.85rem", color: "#1C201B", flexShrink: 0, paddingRight: "1rem" }}>
                      {(item.price * item.qty).toFixed(2)} ر.س
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(200,187,164,0.4)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: "#9BA17B" }}>المجموع الجزئي</span>
                  <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: "#1C201B" }}>{subtotal.toFixed(2)} ر.س</span>
                </div>
                {couponDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: "#059669" }}>خصم ({couponData?.code})</span>
                    <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: "#059669" }}>-{couponDiscount.toFixed(2)} ر.س</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: "#9BA17B" }}>الشحن</span>
                  <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: shipping === 0 ? "#059669" : "#1C201B" }}>
                    {shipping === 0 ? "مجاني 🎉" : `${shipping.toFixed(2)} ر.س`}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(200,187,164,0.4)", paddingTop: "0.75rem", marginTop: "0.25rem" }}>
                  <span style={{ fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif", fontSize: "1.1rem", color: "#1C201B", fontWeight: 400 }}>الإجمالي</span>
                  <span style={{ fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif", fontSize: "1.2rem", color: "#1C201B", fontWeight: 500 }}>{total.toFixed(2)} ر.س</span>
                </div>
              </div>

              {user && pointsToEarn > 0 && (
                <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: 8, background: "rgba(31,57,41,0.06)", padding: "10px 12px", border: "1px solid rgba(31,57,41,0.15)" }}>
                  <Star size={14} color="#1F3929" strokeWidth={1.5} />
                  <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.75rem", color: "#1F3929" }}>
                    ستكسب {pointsToEarn} نقطة ولاء
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
