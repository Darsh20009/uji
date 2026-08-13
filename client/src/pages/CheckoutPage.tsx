import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { CheckCircle, ShoppingBag, Tag, X, Star, MapPin, Navigation, Truck, ChevronDown } from "lucide-react";
import PhoneInput, { COUNTRIES, type Country } from "../components/PhoneInput";
import { useLang } from "../context/LanguageContext";
import { t } from "../lib/translations";

const font = "'Mirza', serif";
const mono = "'Cascadia Code', monospace";
const serif = "'Mirza', serif";

const inp: React.CSSProperties = {
  width: "100%", height: 52,
  background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.4)",
  padding: "0 1rem",
  fontFamily: font, fontSize: "0.9rem", color: "#1C201B",
  outline: "none", borderRadius: 0, boxSizing: "border-box",
  transition: "border-color 0.2s",
};
const labelStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: "0.58rem",
  letterSpacing: "0.22em", textTransform: "uppercase", color: "#9BA17B",
  marginBottom: 8, display: "block",
};
const sectionTitle: React.CSSProperties = {
  fontFamily: serif, fontSize: "1.05rem",
  fontWeight: 300, color: "#1C201B", letterSpacing: "0.06em",
  borderBottom: "1px solid rgba(200,187,164,0.3)", paddingBottom: "0.75rem",
  marginBottom: "1.25rem",
};

const DEFAULT_DELIVERY_PROVIDERS = [
  { id: "aramex", name: "أرامكس",       nameEn: "Aramex",      price: 35, days: "2-3 أيام عمل", daysEn: "2-3 business days", enabled: true, logo: "/assets/brand/logo-aramex.svg" },
  { id: "smsa",   name: "SMSA Express", nameEn: "SMSA Express", price: 30, days: "3-5 أيام عمل", daysEn: "3-5 business days", enabled: true, logo: "/assets/brand/logo-smsa.svg"   },
  { id: "jt",     name: "J&T Express",  nameEn: "J&T Express",  price: 25, days: "3-5 أيام عمل", daysEn: "3-5 business days", enabled: true, logo: "/assets/brand/logo-jt.svg"     },
];

const SAUDI_CITIES_AR = [
  "الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر",
  "الظهران","أبها","تبوك","بريدة","الطائف","حائل","نجران","جازان",
  "الجبيل","ينبع","الأحساء","الخرج","القطيف","عرعر","سكاكا",
];
const SAUDI_CITIES_EN = [
  "Riyadh","Jeddah","Mecca","Medina","Dammam","Khobar",
  "Dhahran","Abha","Tabuk","Buraidah","Taif","Hail","Najran","Jizan",
  "Jubail","Yanbu","Al-Ahsa","Al-Kharj","Qatif","Arar","Sakaka",
];
const PROVIDER_NAMES_EN: Record<string, string> = {
  aramex: "Aramex",
  smsa: "SMSA Express",
  jt: "J&T Express",
};

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { user } = useAuth();
  const { lang, isRTL } = useLang();

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
  const [cityOpen, setCityOpen] = useState(false);

  const [geoPos, setGeoPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponData, setCouponData] = useState<{ code: string; discount: number; type: string; value: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get("/settings"),
    staleTime: 5 * 60 * 1000,
  });

  const rawProviders: any[] = (settings as any)?.deliveryProviders ?? DEFAULT_DELIVERY_PROVIDERS;
  const enabledProviders = rawProviders.filter((p: any) => p.enabled !== false);
  const activeProviders = enabledProviders.length > 0 ? enabledProviders : DEFAULT_DELIVERY_PROVIDERS;

  const [deliveryProviderId, setDeliveryProviderId] = useState<string>("");
  const deliveryProvider = activeProviders.find((p: any) => p.id === deliveryProviderId) ?? activeProviders[0];

  const shippingThreshold = Number((settings as any)?.shippingFreeThreshold ?? 200);
  const geideaEnabled = (settings as any)?._geideaEnabled === true;
  const codEnabled    = (settings as any)?._codEnabled  !== false;
  const bankEnabled   = (settings as any)?._bankEnabled !== false;
  const stcEnabled    = (settings as any)?._stcEnabled  !== false;
  const bankIban      = (settings as any)?.bankIban  || "";
  const bankName      = (settings as any)?.bankName  || (lang === "ar" ? "مصرف الراجحي" : "Al Rajhi Bank");
  const stcPayNumber  = (settings as any)?.stcPayNumber || "";

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const isFreeShipping = subtotal >= shippingThreshold;
  const shipping = isFreeShipping ? 0 : deliveryProvider.price;
  const couponDiscount = couponData?.discount || 0;
  const total = Math.max(0, subtotal - couponDiscount + shipping);
  const pointsToEarn = Math.floor(total / 10);

  const cities = lang === "en" ? SAUDI_CITIES_EN : SAUDI_CITIES_AR;
  const providerNameFor = (provider: any) =>
    lang === "en" ? provider.nameEn || PROVIDER_NAMES_EN[provider.id] || provider.name : provider.name;

  const getLocation = () => {
    if (!navigator.geolocation) { setGeoError(t("checkout.geo.error.unsupported", lang)); return; }
    setGeoLoading(true); setGeoError("");
    navigator.geolocation.getCurrentPosition(
      pos => { setGeoPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoLoading(false); },
      () => { setGeoError(t("checkout.geo.error.denied", lang)); setGeoLoading(false); },
      { timeout: 10000 }
    );
  };

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true); setCouponError(""); setCouponData(null);
    try {
      const result = await api.post("/coupons/apply", { code: couponInput.trim(), orderTotal: subtotal }) as any;
      setCouponData(result);
    } catch (e: any) { setCouponError(e.message || t("checkout.coupon.invalid", lang)); }
    setCouponLoading(false);
  };

  const removeCoupon = () => { setCouponData(null); setCouponInput(""); setCouponError(""); };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    if (!form.city) { setError(t("checkout.error.city", lang)); setLoading(false); return; }
    if (!form.district.trim()) { setError(t("checkout.error.district", lang)); setLoading(false); return; }
    if (!form.name.trim()) { setError(t("checkout.error.name", lang)); setLoading(false); return; }
    if (!form.phone.trim()) { setError(t("checkout.error.phone", lang)); setLoading(false); return; }
    try {
      const result = await api.post("/orders", {
        customer: { name: form.name, phone: form.phone, email: form.email || undefined },
        address: {
          city: form.city, district: form.district, street: form.street, notes: form.addressNotes,
          ...(geoPos ? { lat: geoPos.lat, lng: geoPos.lng, mapLink: `https://maps.google.com/?q=${geoPos.lat},${geoPos.lng}` } : {}),
        },
        items: items.map(i => ({ product: i._id, name: lang === "en" && i.nameEn ? i.nameEn : i.name, price: i.price, qty: i.qty })),
        paymentMethod: form.paymentMethod,
        couponCode: couponData?.code,
           notes: `${t("checkout.delivery.note.key", lang)}: ${providerNameFor(deliveryProvider)}${form.notes ? `\n${form.notes}` : ""}`,
      }) as any;
      if (result.geideaRedirectUrl) { window.location.href = result.geideaRedirectUrl; return; }
      setOrder(result.order || result); clear();
    } catch (e: any) { setError(e.message || t("checkout.error.generic", lang)); }
    setLoading(false);
  };

  if (!items.length && !order) return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", background: "#F2EADB", padding: "2rem" }}>
      <ShoppingBag size={40} color="#C8BBA4" strokeWidth={1} />
      <p style={{ fontFamily: font, color: "#9BA17B" }}>{t("checkout.empty", lang)}</p>
      <Link href="/products" className="btn-primary">{t("common.shopnow", lang)}</Link>
    </div>
  );

  if (order) return <OrderSuccess order={order} user={user} font={font} serif={serif} mono={mono} lang={lang} />;

  const paymentOptions = [
    ...(codEnabled   ? [{ val: "cod",    label: t("checkout.pay.cod", lang),   sub: t("checkout.pay.cod.sub", lang),  icon: "💵" }] : []),
    ...(geideaEnabled ? [{ val: "geidea", label: t("checkout.pay.card", lang),  sub: t("checkout.pay.card.sub", lang), icon: "💳" }] : []),
    ...(stcEnabled   ? [{ val: "stcpay", label: t("checkout.pay.stcpay", lang), sub: stcPayNumber ? `${stcPayNumber}` : "STC Pay", icon: "📱" }] : []),
    ...(bankEnabled  ? [{ val: "bank",   label: t("checkout.pay.bank", lang),   sub: bankIban ? `${bankName} — ${bankIban}` : t("checkout.pay.bank.details", lang), icon: "🏦" }] : []),
  ];

  return (
    <div style={{ background: "#F2EADB", paddingTop: 90, paddingBottom: 100 }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <Link href="/cart" style={{ fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.2em", color: "#9BA17B", textDecoration: "none" }}>{t("checkout.breadcrumb.cart", lang)}</Link>
          <span style={{ color: "#C8BBA4", fontSize: "0.65rem" }}>›</span>
          <span style={{ fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.2em", color: "#1F3929" }}>{t("checkout.breadcrumb.checkout", lang)}</span>
        </div>

        <div className="checkout-layout">

          {/* ────── Order summary ────── */}
          <div className="checkout-summary" style={{ position: "sticky", top: 90 }}>
            <div style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.35)", padding: "1.5rem" }}>
              <p style={{ fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.2em", color: "#9BA17B", marginBottom: "1.25rem" }}>
                {t("cart.ordersummary", lang).toUpperCase()}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
                {items.map(item => (
                  <div key={item._id} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                       <img src={item.image} alt={lang === "en" && item.nameEn ? item.nameEn : item.name} style={{ width: 52, height: 52, objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: -6, left: -6, background: "#1F3929", color: "#F2EADB", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontFamily: mono }}>{item.qty}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                       <p style={{ fontFamily: font, fontSize: "0.83rem", color: "#1C201B", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lang === "en" && item.nameEn ? item.nameEn : item.name}</p>
                    </div>
                    <span style={{ fontFamily: font, fontSize: "0.83rem", color: "#1C201B", flexShrink: 0 }}>{(item.price * item.qty).toFixed(2)} {t("common.currency", lang)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(200,187,164,0.4)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: font, fontSize: "0.82rem", color: "#9BA17B" }}>{t("cart.subtotal", lang)}</span>
                  <span style={{ fontFamily: font, fontSize: "0.82rem", color: "#1C201B" }}>{subtotal.toFixed(2)} {t("common.currency", lang)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: font, fontSize: "0.82rem", color: "#059669" }}>{t("checkout.coupon.discount", lang)} ({couponData?.code})</span>
                    <span style={{ fontFamily: font, fontSize: "0.82rem", color: "#059669" }}>−{couponDiscount.toFixed(2)} {t("common.currency", lang)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: font, fontSize: "0.82rem", color: "#9BA17B" }}>
                    {t("cart.shipping", lang)} ({lang === "en" && deliveryProvider.nameEn ? deliveryProvider.nameEn : deliveryProvider.name})
                  </span>
                  <span style={{ fontFamily: font, fontSize: "0.82rem", color: isFreeShipping ? "#059669" : "#1C201B" }}>
                    {isFreeShipping ? `${t("common.free", lang)} 🎉` : `${shipping.toFixed(2)} ${t("common.currency", lang)}`}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(200,187,164,0.4)", paddingTop: "0.75rem", marginTop: "0.25rem" }}>
                  <span style={{ fontFamily: serif, fontSize: "1.1rem", color: "#1C201B" }}>{t("cart.total", lang)}</span>
                  <span style={{ fontFamily: serif, fontSize: "1.25rem", color: "#1C201B" }}>{total.toFixed(2)} {t("common.currency", lang)}</span>
                </div>
              </div>

              {user && pointsToEarn > 0 && (
                <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: 8, background: "rgba(31,57,41,0.06)", padding: "10px 12px", border: "1px solid rgba(31,57,41,0.15)" }}>
                  <Star size={14} color="#1F3929" strokeWidth={1.5} />
                  <span style={{ fontFamily: font, fontSize: "0.75rem", color: "#1F3929" }}>
                    {t("checkout.points.earn", lang)} {pointsToEarn} {t("checkout.points.label", lang)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ────── Form ────── */}
          <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* ── 01 Your Info ── */}
            <section style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.3)", padding: "1.5rem" }}>
              <p style={sectionTitle}>{t("checkout.s1.title", lang)}</p>
              <div className="form-grid-2">
                <div>
                  <label style={labelStyle}>{t("checkout.field.name", lang)}</label>
                  <input style={inp} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t("checkout.field.name.placeholder", lang)} required />
                </div>
                <div>
                  <label style={labelStyle}>{t("checkout.field.phone", lang)}</label>
                  <PhoneInput
                    theme="light"
                    value={form.phone}
                    onChange={(num, c) => { setForm({...form, phone: num}); setPhoneCountry(c); }}
                    countryCode={phoneCountry.code}
                    onCountryChange={setPhoneCountry}
                    required
                    style={{ height: 52 }}
                  />
                </div>
                <div className="span-2">
                  <label style={labelStyle}>{t("checkout.field.email", lang)} <span style={{ color: "#C8BBA4", textTransform: "none", letterSpacing: 0, fontFamily: font, fontSize: "0.72rem" }}>{t("common.optional", lang)}</span></label>
                  <input style={inp} value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="example@email.com" type="email" />
                </div>
              </div>
            </section>

            {/* ── 02 Delivery Address ── */}
            <section style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.3)", padding: "1.5rem" }}>
              <p style={sectionTitle}>{t("checkout.s2.title", lang)}</p>
              <div className="form-grid-2">
                {/* City dropdown */}
                <div style={{ position: "relative" }}>
                  <label style={labelStyle}>{t("checkout.field.city", lang)}</label>
                  <button
                    type="button"
                    onClick={() => setCityOpen(v => !v)}
                    style={{ ...inp, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", border: `1px solid ${cityOpen ? "rgba(31,57,41,0.5)" : "rgba(200,187,164,0.4)"}` }}
                  >
                    <span style={{ color: form.city ? "#1C201B" : "#9BA17B" }}>{form.city || t("checkout.field.city.placeholder", lang)}</span>
                    <ChevronDown size={15} color="#9BA17B" style={{ flexShrink: 0, transform: cityOpen ? "rotate(180deg)" : undefined, transition: "transform 0.2s" }} />
                  </button>
                  {cityOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#FDFAF5", border: "1px solid #DDD5C3", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 100, maxHeight: 220, overflowY: "auto" }}>
                      {cities.map((c, idx) => (
                        <button key={c} type="button" onClick={() => { setForm({...form, city: c}); setCityOpen(false); }}
                          style={{ width: "100%", padding: "11px 14px", background: form.city === c ? "#EDE8DF" : "transparent", border: "none", cursor: "pointer", fontFamily: font, fontSize: "0.87rem", color: "#1C201B", textAlign: isRTL ? "right" : "left", direction: isRTL ? "rtl" : "ltr" }}
                        >{c}</button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>{t("checkout.field.district", lang)}</label>
                  <input style={inp} value={form.district} onChange={e => setForm({...form, district: e.target.value})} placeholder={t("checkout.field.district.placeholder", lang)} required />
                </div>
                <div className="span-2">
                  <label style={labelStyle}>{t("checkout.field.street", lang)}</label>
                  <input style={inp} value={form.street} onChange={e => setForm({...form, street: e.target.value})} placeholder={t("checkout.field.street.placeholder", lang)} />
                </div>
                <div className="span-2">
                  <label style={labelStyle}>{t("checkout.field.addressnotes", lang)}</label>
                  <input style={inp} value={form.addressNotes} onChange={e => setForm({...form, addressNotes: e.target.value})} placeholder={t("checkout.field.addressnotes.placeholder", lang)} />
                </div>

                {/* GPS location */}
                <div className="span-2">
                  <label style={labelStyle}>{t("checkout.geo.label", lang)} <span style={{ color: "#C8BBA4", textTransform: "none", letterSpacing: 0, fontFamily: font, fontSize: "0.72rem" }}>{t("common.optional", lang)}</span></label>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button type="button" onClick={getLocation} disabled={geoLoading}
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: 48, padding: "0 1.25rem", background: geoPos ? "#1F3929" : "#F7F2E8", color: geoPos ? "#F2EADB" : "#1C201B", border: "1px solid rgba(200,187,164,0.5)", fontFamily: font, fontSize: "0.85rem", cursor: geoLoading ? "wait" : "pointer", transition: "all 0.2s" }}>
                      <Navigation size={14} />
                      {geoLoading ? t("checkout.geo.detecting", lang) : geoPos ? t("checkout.geo.done", lang) : t("checkout.geo.detect", lang)}
                    </button>
                    {geoPos && (
                      <>
                        <a href={`https://maps.google.com/?q=${geoPos.lat},${geoPos.lng}`} target="_blank" rel="noopener"
                          style={{ fontSize: "0.78rem", color: "#9BA17B", display: "flex", alignItems: "center", gap: 4, fontFamily: font }}>
                          <MapPin size={13} /> {t("checkout.geo.view", lang)}
                        </a>
                        <button type="button" onClick={() => setGeoPos(null)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#C8BBA4", fontSize: "0.78rem", fontFamily: font }}>
                          {t("checkout.geo.cancel", lang)}
                        </button>
                      </>
                    )}
                  </div>
                  {geoError && <p style={{ fontFamily: font, fontSize: "0.78rem", color: "#C87070", marginTop: 6 }}>{geoError}</p>}
                  {geoPos && (
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${geoPos.lng-0.008},${geoPos.lat-0.008},${geoPos.lng+0.008},${geoPos.lat+0.008}&layer=mapnik&marker=${geoPos.lat},${geoPos.lng}`}
                      style={{ width: "100%", height: 180, border: "1px solid rgba(200,187,164,0.4)", marginTop: "0.75rem", display: "block" }}
                      title="Map"
                    />
                  )}
                </div>
              </div>
            </section>

            {/* ── 03 Delivery Provider ── */}
            <section style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.3)", padding: "1.5rem" }}>
              <p style={sectionTitle}>
                <Truck size={16} style={{ display: "inline", marginInlineEnd: 8, verticalAlign: "middle" }} />
                {t("checkout.s3.title", lang)}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {activeProviders.map((p: any) => {
                  const isSelected = deliveryProvider.id === p.id;
                   const providerName = providerNameFor(p);
                  const providerDays = lang === "en" && p.daysEn ? p.daysEn : p.days;
                  return (
                    <label key={p.id} onClick={() => setDeliveryProviderId(p.id)}
                      style={{ display: "flex", alignItems: "center", gap: "1rem", border: `1px solid ${isSelected ? "#1F3929" : "rgba(200,187,164,0.3)"}`, background: isSelected ? "rgba(31,57,41,0.05)" : "#F7F2E8", padding: "0.9rem 1.1rem", cursor: "pointer", transition: "all 0.2s" }}>
                      <input type="radio" name="delivery" value={p.id} checked={isSelected} onChange={() => setDeliveryProviderId(p.id)} style={{ width: "auto", accentColor: "#1F3929", flexShrink: 0 }} />
                      <div style={{ width: 64, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {p.logo?.startsWith("/") ? (
                          <img src={p.logo} alt={p.nameEn} style={{ maxHeight: 28, maxWidth: 64, objectFit: "contain" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <span style={{ fontSize: "1.4rem" }}>{p.logo ?? "🚚"}</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: font, fontSize: "0.88rem", fontWeight: 600, color: "#1C201B", margin: 0 }}>{providerName}</p>
                        <p style={{ fontFamily: font, fontSize: "0.75rem", color: "#9BA17B", margin: 0 }}>{providerDays}</p>
                      </div>
                      <div style={{ textAlign: "left", flexShrink: 0 }}>
                        {isFreeShipping ? (
                          <span style={{ fontFamily: font, fontSize: "0.82rem", color: "#059669", fontWeight: 600 }}>{t("common.free", lang)}</span>
                        ) : (
                          <span style={{ fontFamily: font, fontSize: "0.9rem", fontWeight: 700, color: "#1F3929" }}>{p.price} {t("common.currency", lang)}</span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
              {isFreeShipping && (
                <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: 8, background: "rgba(5,150,105,0.06)", padding: "10px 12px", border: "1px solid rgba(5,150,105,0.2)" }}>
                  <span style={{ fontFamily: font, fontSize: "0.78rem", color: "#059669" }}>{t("checkout.freeship.eligible", lang)}</span>
                </div>
              )}
            </section>

            {/* ── 04 Discount Code ── */}
            <section style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.3)", padding: "1.5rem" }}>
              <p style={sectionTitle}>{t("checkout.s4.title", lang)} <span style={{ fontFamily: font, fontSize: "0.75rem", color: "#9BA17B", fontWeight: 300 }}>{t("common.optional", lang)}</span></p>
              {!couponData ? (
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <Tag size={15} color="#9BA17B" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <input
                      style={{ ...inp, paddingRight: 42, letterSpacing: "0.12em", textTransform: "uppercase" }}
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder={t("checkout.coupon.placeholder", lang)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); applyCoupon(); } }}
                    />
                  </div>
                  <button type="button" onClick={applyCoupon} disabled={couponLoading || !couponInput.trim()}
                    style={{ height: 52, padding: "0 1.25rem", background: couponInput.trim() ? "#1F3929" : "#C8BBA4", color: "#F2EADB", border: "none", cursor: couponInput.trim() ? "pointer" : "not-allowed", fontFamily: font, fontSize: "0.85rem", whiteSpace: "nowrap", transition: "background 0.2s", flexShrink: 0 }}>
                    {couponLoading ? "..." : t("checkout.coupon.apply", lang)}
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F2F7F3", border: "1px solid #A8C8B0", padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Tag size={16} color="#1F3929" strokeWidth={1.5} />
                    <div>
                      <p style={{ fontFamily: mono, fontSize: "0.72rem", letterSpacing: "0.15em", color: "#1F3929", margin: 0, fontWeight: 600 }}>{couponData.code}</p>
                      <p style={{ fontFamily: font, fontSize: "0.78rem", color: "#059669", margin: 0 }}>
                        {t("checkout.coupon.discount", lang)} {couponData.type === "percent" ? `${couponData.value}%` : `${couponData.value} ${t("common.currency", lang)}`} — {t("checkout.coupon.saved", lang)} {couponData.discount.toFixed(2)} {t("common.currency", lang)}
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={removeCoupon} style={{ background: "none", border: "none", cursor: "pointer", color: "#9BA17B" }}>
                    <X size={16} />
                  </button>
                </div>
              )}
              {couponError && <p style={{ fontFamily: font, fontSize: "0.78rem", color: "#C87070", margin: "8px 0 0" }}>{couponError}</p>}
            </section>

            {/* ── 05 Payment Method ── */}
            <section style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.3)", padding: "1.5rem" }}>
              <p style={sectionTitle}>{t("checkout.s5.title", lang)}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {paymentOptions.map(opt => (
                  <label key={opt.val} style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    border: `1px solid ${form.paymentMethod === opt.val ? "#1F3929" : "rgba(200,187,164,0.3)"}`,
                    background: form.paymentMethod === opt.val ? "rgba(31,57,41,0.06)" : "#F7F2E8",
                    padding: "0.9rem 1.1rem", cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <input type="radio" value={opt.val} checked={form.paymentMethod === opt.val} onChange={() => setForm({...form, paymentMethod: opt.val})} style={{ width: "auto", accentColor: "#1F3929", flexShrink: 0 }} />
                    <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{opt.icon}</span>
                    <div>
                      <p style={{ fontFamily: font, fontSize: "0.88rem", fontWeight: 600, color: "#1C201B", margin: 0 }}>{opt.label}</p>
                      <p style={{ fontFamily: font, fontSize: "0.76rem", color: "#9BA17B", margin: 0 }}>{opt.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* ── Additional Notes ── */}
            <section style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.3)", padding: "1.5rem" }}>
              <label style={labelStyle}>{t("checkout.notes.title", lang)} <span style={{ color: "#C8BBA4", textTransform: "none", letterSpacing: 0, fontFamily: font, fontSize: "0.72rem" }}>{t("common.optional", lang)}</span></label>
              <textarea
                style={{ ...inp, height: 90, resize: "none", paddingTop: "0.875rem" } as any}
                value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                placeholder={t("checkout.field.notes.placeholder", lang)}
              />
            </section>

            {error && (
              <div style={{ background: "rgba(200,70,70,0.08)", border: "1px solid rgba(200,70,70,0.2)", padding: "12px 16px" }}>
                <p style={{ fontFamily: font, fontSize: "0.85rem", color: "#c0392b", margin: 0 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ height: 58, fontSize: "0.95rem", letterSpacing: "0.06em", width: "100%" }}>
              {loading ? t("checkout.processing", lang) : `${t("checkout.submit", lang)} — ${total.toFixed(2)} ${t("common.currency", lang)} ✦`}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 3rem;
          align-items: start;
        }
        .checkout-summary {
          order: 2;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .span-2 { grid-column: 1 / -1; }

        @media (max-width: 768px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .checkout-summary {
            order: -1 !important;
            position: static !important;
          }
          .form-grid-2 {
            grid-template-columns: 1fr !important;
          }
          .span-2 { grid-column: 1 !important; }
        }
      `}</style>
    </div>
  );
}

function OrderSuccess({ order, user, font, serif, mono, lang }: { order: any; user: any; font: string; serif: string; mono: string; lang: "ar" | "en" }) {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(order.receiptUrl ? { receiptUrl: order.receiptUrl, status: order.receiptStatus } : null);
  const [error, setError] = useState("");
  const isBankPayment = order.paymentMethod === "bank" || order.paymentMethod === "stcpay";

  const uploadReceipt = async () => {
    if (!receipt || !order._id) return;
    setUploading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("receipt", receipt);
      const res = await fetch(`/api/orders/${order._id}/receipt`, { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("order.success.receipt.error", lang));
      setReceiptData(data);
    } catch (e: any) { setError(e.message || t("order.success.receipt.error", lang)); }
    setUploading(false);
  };

  const statusText = receiptData?.status === "approved"
    ? t("order.success.receipt.approved", lang)
    : receiptData
      ? t("order.success.receipt.pending", lang)
      : t("order.success.receipt.awaiting", lang);

  return (
    <div style={{ minHeight: "75vh", background: "#F2EADB", padding: "7rem 1.25rem 5rem" }} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div style={{ maxWidth: 680, margin: "0 auto", background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.35)", padding: "2.5rem", textAlign: "center" }}>
        <CheckCircle size={42} color="#1F3929" strokeWidth={1.2} style={{ margin: "0 auto 1rem" }} />
        <p style={{ fontFamily: mono, fontSize: "0.62rem", letterSpacing: "0.2em", color: "#9BA17B" }}>UJI MATCHA · ORDER RECEIVED</p>
        <h1 style={{ fontFamily: serif, fontSize: "2rem", fontWeight: 300, color: "#1C201B", margin: "0.75rem 0" }}>{t("order.success.title", lang)}</h1>
        <p style={{ fontFamily: font, fontSize: "0.9rem", color: "#6F7860", lineHeight: 1.9 }}>{t("order.success.subtitle", lang)} <b style={{ color: "#1F3929" }}>{t("order.success.processing", lang)}</b> {t("order.success.body", lang)}</p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, background: "rgba(31,57,41,0.06)", padding: "1rem 1.25rem", margin: "1.5rem 0", textAlign: lang === "ar" ? "right" : "left" }}>
          <span style={{ fontFamily: font, color: "#9BA17B", fontSize: "0.8rem" }}>{t("order.success.number", lang)}</span>
          <b style={{ fontFamily: mono, color: "#1F3929", direction: "ltr" }}>{order.orderNumber}</b>
          <b style={{ fontFamily: font, color: "#1F3929" }}>{Number(order.total || 0).toFixed(2)} {t("common.currency", lang)}</b>
        </div>
        {isBankPayment && (
          <div style={{ borderTop: "1px solid rgba(200,187,164,0.35)", paddingTop: "1.5rem", textAlign: lang === "ar" ? "right" : "left" }}>
            <h2 style={{ fontFamily: font, fontSize: "1rem", color: "#1C201B", marginBottom: "0.5rem" }}>{t("order.success.receipt.title", lang)}</h2>
            <p style={{ fontFamily: font, fontSize: "0.8rem", color: "#9BA17B", marginBottom: "1rem" }}>{t("order.success.receipt.body", lang)}</p>
            {receiptData ? (
              <div style={{ background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.22)", padding: "1rem", textAlign: "center" }}>
                <p style={{ fontFamily: font, color: "#047857", fontSize: "0.9rem", marginBottom: "0.75rem" }}>✓ {statusText}</p>
                {receiptData.whatsappUrl && <a href={receiptData.whatsappUrl} target="_blank" rel="noopener" className="btn-primary" style={{ height: 42, fontFamily: font, fontSize: "0.8rem" }}>{t("order.success.receipt.whatsapp", lang)}</a>}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <input type="file" accept="image/*,.pdf" onChange={e => setReceipt(e.target.files?.[0] || null)} style={{ flex: 1, height: 48, padding: "0.7rem", fontFamily: font, fontSize: "0.8rem" }} />
                <button type="button" onClick={uploadReceipt} disabled={!receipt || uploading} className="btn-primary" style={{ height: 48, fontFamily: font, fontSize: "0.8rem", opacity: !receipt || uploading ? 0.55 : 1 }}>
                  {uploading ? t("order.success.receipt.uploading", lang) : t("order.success.receipt.upload", lang)}
                </button>
              </div>
            )}
            {error && <p style={{ fontFamily: font, color: "#c0392b", fontSize: "0.8rem", marginTop: 10 }}>{error}</p>}
          </div>
        )}
        <Link href="/products" className="btn-outline" style={{ marginTop: "1.75rem", height: 44, fontFamily: font, fontSize: "0.8rem" }}>{t("order.success.backtostore", lang)}</Link>
      </div>
    </div>
  );
}
