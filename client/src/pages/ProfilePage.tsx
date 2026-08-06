import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useAuthModal } from "../context/AuthModalContext";
import { Link } from "wouter";
import {
  User, ShoppingBag, Gift, Award, ChevronDown, ChevronUp,
  MapPin, Plus, Pencil, Trash2, Building2, Star, LogOut, CheckCircle,
} from "lucide-react";
import { useLang } from "../context/LanguageContext";
import { t } from "../lib/translations";

/* ─── Constants ──────────────────────────────────────────────────── */
const TIERS: Record<string, { labelKey: "profile.tier.bronze"|"profile.tier.silver"|"profile.tier.gold"|"profile.tier.platinum"; color: string; bg: string; next: number }> = {
  bronze:   { labelKey: "profile.tier.bronze",   color: "#CD7F32", bg: "#FDF6EC", next: 300  },
  silver:   { labelKey: "profile.tier.silver",   color: "#9BA17B", bg: "#F4F5F0", next: 1000 },
  gold:     { labelKey: "profile.tier.gold",     color: "#D4AF37", bg: "#FDFAEE", next: 2000 },
  platinum: { labelKey: "profile.tier.platinum", color: "#6B7280", bg: "#F3F4F6", next: 0    },
};
const STATUS_KEYS: Record<string, { key: "profile.status.pending"|"profile.status.confirmed"|"profile.status.shipped"|"profile.status.delivered"|"profile.status.cancelled"; color: string }> = {
  pending:   { key: "profile.status.pending",   color: "#D97706" },
  confirmed: { key: "profile.status.confirmed", color: "#2563EB" },
  shipped:   { key: "profile.status.shipped",   color: "#7C3AED" },
  delivered: { key: "profile.status.delivered", color: "#059669" },
  cancelled: { key: "profile.status.cancelled", color: "#DC2626" },
};

/* ─── Input helper ───────────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder = "", type = "text", disabled = false, lang }: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; type?: string; disabled?: boolean; lang: "ar" | "en";
}) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#9BA17B", marginBottom: "0.4rem", textTransform: "uppercase" }}>
        {label}
      </label>
      <input
        type={type} value={value} disabled={disabled}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        dir={lang === "ar" ? "rtl" : "ltr"}
        style={{
          width: "100%", boxSizing: "border-box",
          border: "1px solid rgba(200,187,164,0.45)", borderRadius: 3,
          padding: "0.65rem 0.9rem", fontFamily: "'Mirza', serif", fontSize: "0.9rem",
          color: "#1C201B", background: disabled ? "#F7F2E8" : "#fff", outline: "none",
        }}
      />
    </div>
  );
}

/* ─── Address form ───────────────────────────────────────────────── */
function AddressForm({ initial, onSave, onCancel, lang }: {
  initial?: any; onSave: (data: any) => void; onCancel: () => void; lang: "ar" | "en";
}) {
  const [form, setForm] = useState({
    label: initial?.label ?? (lang === "ar" ? "المنزل" : "Home"),
    city: initial?.city ?? "",
    district: initial?.district ?? "",
    street: initial?.street ?? "",
    building: initial?.building ?? "",
    zipCode: initial?.zipCode ?? "",
    isDefault: initial?.isDefault ?? false,
  });
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.4)", borderRadius: 4, padding: "1.5rem", marginBottom: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <Field lang={lang} label={t("profile.addr.label", lang)} value={form.label} onChange={set("label")} placeholder={t("profile.addr.label.placeholder", lang)} />
        <Field lang={lang} label={t("profile.addr.city", lang)} value={form.city} onChange={set("city")} placeholder={t("profile.addr.city.placeholder", lang)} />
        <Field lang={lang} label={t("profile.addr.district", lang)} value={form.district} onChange={set("district")} placeholder={t("profile.addr.district.placeholder", lang)} />
        <Field lang={lang} label={t("profile.addr.street", lang)} value={form.street} onChange={set("street")} placeholder={t("profile.addr.street.placeholder", lang)} />
        <Field lang={lang} label={t("profile.addr.building", lang)} value={form.building} onChange={set("building")} placeholder={t("profile.addr.building.placeholder", lang)} />
        <Field lang={lang} label={t("profile.addr.zip", lang)} value={form.zipCode} onChange={set("zipCode")} placeholder="12345" />
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", marginBottom: "1rem" }}>
        <input
          type="checkbox" checked={form.isDefault}
          onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))}
          style={{ accentColor: "#1F3929" }}
        />
        <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.85rem", color: "#1C201B" }}>{t("profile.addr.setdefault", lang)}</span>
      </label>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button onClick={() => onSave(form)} className="btn-primary" style={{ height: 40, padding: "0 1.5rem", fontSize: "0.85rem" }}>{t("profile.addr.save", lang)}</button>
        <button onClick={onCancel} style={{ height: 40, padding: "0 1rem", background: "none", border: "1px solid rgba(200,187,164,0.5)", borderRadius: 3, cursor: "pointer", fontFamily: "'Mirza', serif", fontSize: "0.85rem", color: "#9BA17B" }}>{t("common.cancel", lang)}</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { openAuth } = useAuthModal();
  const { lang } = useLang();
  const qc = useQueryClient();
  const [tab, setTab] = useState("orders");
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [addingAddr, setAddingAddr] = useState(false);
  const [editingAddr, setEditingAddr] = useState<string | null>(null);

  const TABS = [
    { id: "orders",   labelKey: "profile.tab.orders",    icon: ShoppingBag },
    { id: "info",     labelKey: "profile.tab.info",      icon: User        },
    { id: "business", labelKey: "profile.tab.business",  icon: Building2   },
    { id: "addresses",labelKey: "profile.tab.addresses", icon: MapPin      },
  ] as const;

  /* ── Queries ── */
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["my-orders"], queryFn: () => api.get("/me/orders") as Promise<any[]>, enabled: !!user,
  });
  const { data: addresses = [], refetch: refetchAddr } = useQuery<any[]>({
    queryKey: ["my-addresses"], queryFn: () => api.get("/me/addresses") as Promise<any[]>, enabled: !!user,
  });

  const u = user as any;
  const [info, setInfo] = useState({ name: u?.name ?? "", email: u?.email ?? "" });
  const [biz, setBiz] = useState({
    accountType: u?.accountType ?? "individual",
    businessName: u?.businessName ?? "",
    vatNumber: u?.vatNumber ?? "",
    commercialRegister: u?.commercialRegister ?? "",
  });

  const saveProfile = useMutation({
    mutationFn: (data: any) => api.put("/me/profile", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["me"] }); setSaved(true); setTimeout(() => setSaved(false), 2500); },
  });
  const addAddr = useMutation({
    mutationFn: (data: any) => api.post("/me/addresses", data),
    onSuccess: () => { refetchAddr(); setAddingAddr(false); },
  });
  const updateAddr = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/me/addresses/${id}`, data),
    onSuccess: () => { refetchAddr(); setEditingAddr(null); },
  });
  const deleteAddr = useMutation({
    mutationFn: (id: string) => api.delete(`/me/addresses/${id}`),
    onSuccess: () => refetchAddr(),
  });

  /* ── Not logged in ── */
  if (!user) return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", background: "#F2EADB" }}>
      <User size={48} color="#C8BBA4" strokeWidth={1} />
      <p style={{ fontFamily: "'Mirza', serif", fontSize: "1.2rem", color: "#9BA17B" }}>{t("profile.login.prompt", lang)}</p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={() => openAuth("login")} className="btn-primary" style={{ height: 48, padding: "0 2rem" }}>{t("profile.login.btn", lang)}</button>
        <button onClick={() => openAuth("register")} className="btn-outline" style={{ height: 48, padding: "0 2rem" }}>{t("profile.register.btn", lang)}</button>
      </div>
    </div>
  );

  const tierInfo = TIERS[u.loyaltyTier || "bronze"];
  const tierLabel = t(tierInfo.labelKey, lang);
  const points = u.loyaltyPoints || 0;
  const progress = tierInfo.next > 0 ? Math.min(100, (points / tierInfo.next) * 100) : 100;

  const loyaltyRules = [
    { d: t("profile.loyalty.rule1", lang), i: "🛒" },
    { d: t("profile.loyalty.rule2", lang), i: "🥈" },
    { d: t("profile.loyalty.rule3", lang), i: "🥇" },
    { d: t("profile.loyalty.rule4", lang), i: "💎" },
  ];

  return (
    <div style={{ background: "#F2EADB", minHeight: "100vh", paddingTop: 100, paddingBottom: 100 }}>
      <div className="container" style={{ maxWidth: 1100 }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: "'Cascadia Code', monospace", fontSize: "0.55rem", letterSpacing: "0.3em", color: "#9BA17B", marginBottom: "0.5rem" }}>{t("profile.account", lang).toUpperCase()}</p>
            <h1 style={{ fontFamily: "'Mirza', serif", fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 300, color: "#1C201B", margin: 0, lineHeight: 1 }}>
              {t("profile.hello", lang)} {u.name?.split(" ")[0]}
            </h1>
          </div>
          <button
            onClick={() => logout.mutate()}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "1px solid rgba(200,187,164,0.5)", borderRadius: 3, padding: "0.55rem 1.1rem", cursor: "pointer", fontFamily: "'Mirza', serif", fontSize: "0.82rem", color: "#9BA17B" }}
          >
            <LogOut size={14} strokeWidth={1.5} /> {t("profile.logout", lang)}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "2rem", alignItems: "start" }}>

          {/* ── LEFT SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Profile card */}
            <div style={{ background: "#FDFAF5", border: "1px solid rgba(200,187,164,0.3)", padding: "1.75rem", textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: tierInfo.bg, border: `2px solid ${tierInfo.color}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <User size={28} strokeWidth={1} color={tierInfo.color} />
              </div>
              <p style={{ fontFamily: "'Mirza', serif", fontSize: "1.2rem", fontWeight: 500, color: "#1C201B", margin: "0 0 4px" }}>{u.name}</p>
              <p style={{ fontFamily: "'Mirza', serif", fontSize: "0.78rem", color: "#9BA17B", margin: "0 0 4px", direction: "ltr" }}>{u.phone}</p>
              {u.email && <p style={{ fontFamily: "'Mirza', serif", fontSize: "0.78rem", color: "#9BA17B", margin: "0 0 8px" }}>{u.email}</p>}
              {(u.role === "employee" || u.role === "admin") && (
                <span style={{ display: "inline-block", background: "#1F3929", color: "#F2EADB", fontSize: "0.6rem", letterSpacing: "0.15em", padding: "3px 10px", fontFamily: "'Cascadia Code', monospace" }}>
                  {u.jobTitle || (u.role === "admin" ? t("profile.role.admin", lang) : t("profile.role.employee", lang))}
                </span>
              )}
              {biz.accountType === "business" && u.businessName && (
                <p style={{ fontFamily: "'Mirza', serif", fontSize: "0.75rem", color: "#9BA17B", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <Building2 size={12} strokeWidth={1.5} /> {biz.businessName}
                </p>
              )}
            </div>

            {/* Loyalty */}
            <div style={{ background: tierInfo.bg, border: `1px solid ${tierInfo.color}30`, padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
                <Award size={16} color={tierInfo.color} strokeWidth={1.5} />
                <span style={{ fontFamily: "'Cascadia Code', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: tierInfo.color }}>
                  LOYALTY — {tierLabel.toUpperCase()}
                </span>
              </div>
              <p style={{ fontFamily: "'Mirza', serif", fontSize: "2rem", fontWeight: 300, color: "#1C201B", margin: "0 0 2px", lineHeight: 1 }}>
                {points.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}
              </p>
              <p style={{ fontFamily: "'Mirza', serif", fontSize: "0.75rem", color: "#9BA17B", margin: "0 0 0.75rem" }}>{t("profile.loyalty.label", lang)}</p>
              {tierInfo.next > 0 && (
                <>
                  <div style={{ background: "rgba(0,0,0,0.08)", height: 4, borderRadius: 2, marginBottom: 6 }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: tierInfo.color, borderRadius: 2, transition: "width 0.5s" }} />
                  </div>
                  <p style={{ fontFamily: "'Mirza', serif", fontSize: "0.7rem", color: "#9BA17B", margin: 0 }}>
                    {(tierInfo.next - points).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")} {t("profile.loyalty.next", lang)}
                  </p>
                </>
              )}
              {tierInfo.next === 0 && (
                <p style={{ fontFamily: "'Mirza', serif", fontSize: "0.7rem", color: tierInfo.color, margin: 0, fontWeight: 600 }}>{t("profile.loyalty.max", lang)}</p>
              )}
            </div>

            {/* Points guide */}
            <div style={{ background: "#FDFAF5", border: "1px solid rgba(200,187,164,0.3)", padding: "1.1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.6rem" }}>
                <Gift size={13} color="#9BA17B" strokeWidth={1.5} />
                <span style={{ fontFamily: "'Cascadia Code', monospace", fontSize: "0.55rem", letterSpacing: "0.18em", color: "#9BA17B" }}>{t("profile.loyalty.earn", lang)}</span>
              </div>
              {loyaltyRules.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", borderBottom: i < 3 ? "1px solid rgba(200,187,164,0.2)" : "none" }}>
                  <span style={{ fontSize: "0.8rem" }}>{r.i}</span>
                  <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.73rem", color: "#6B7280" }}>{r.d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(200,187,164,0.35)", marginBottom: "1.75rem", gap: 0 }}>
              {TABS.map(({ id, labelKey, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.7rem 1.25rem", background: "none", border: "none",
                    borderBottom: tab === id ? "2px solid #1F3929" : "2px solid transparent",
                    cursor: "pointer", fontFamily: "'Mirza', serif", fontSize: "0.88rem",
                    color: tab === id ? "#1F3929" : "#9BA17B",
                    transition: "color 0.15s, border-color 0.15s",
                    marginBottom: -1,
                  }}
                >
                  <Icon size={15} strokeWidth={1.5} /> {t(labelKey, lang)}
                </button>
              ))}
            </div>

            {/* ═══ TAB: ORDERS ═══ */}
            {tab === "orders" && (
              <div>
                {ordersLoading && <p style={{ fontFamily: "'Mirza', serif", color: "#9BA17B", textAlign: "center", padding: "3rem" }}>{t("common.loading", lang)}</p>}
                {!ordersLoading && orders.length === 0 && (
                  <div style={{ background: "#FDFAF5", border: "1px solid rgba(200,187,164,0.3)", padding: "3rem", textAlign: "center" }}>
                    <ShoppingBag size={36} color="#C8BBA4" strokeWidth={1} style={{ marginBottom: "1rem" }} />
                    <p style={{ fontFamily: "'Mirza', serif", color: "#9BA17B" }}>{t("profile.orders.empty", lang)}</p>
                    <Link href="/products" style={{ display: "inline-block", marginTop: "1rem", color: "#1F3929", fontFamily: "'Mirza', serif", fontSize: "0.85rem", fontWeight: 600, textDecoration: "underline" }}>{t("profile.orders.shop", lang)}</Link>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {orders.map((order: any) => {
                    const stInfo = STATUS_KEYS[order.status];
                    const stLabel = stInfo ? t(stInfo.key, lang) : order.status;
                    const stColor = stInfo?.color ?? "#9BA17B";
                    const isOpen = openOrder === order._id;
                    return (
                      <div key={order._id} style={{ background: "#FDFAF5", border: "1px solid rgba(200,187,164,0.3)" }}>
                        <div onClick={() => setOpenOrder(isOpen ? null : order._id)}
                          style={{ padding: "1rem 1.25rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <p style={{ fontFamily: "'Mirza', serif", fontSize: "0.9rem", color: "#1C201B", margin: "0 0 3px", fontWeight: 600 }}>{order.orderNumber}</p>
                            <p style={{ fontFamily: "'Mirza', serif", fontSize: "0.73rem", color: "#9BA17B", margin: 0 }}>
                              {new Date(order.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                            </p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.9rem", fontWeight: 600, color: "#1C201B" }}>{order.total?.toFixed(2)} {t("common.currency", lang)}</span>
                            <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.7rem", color: stColor, background: `${stColor}18`, padding: "3px 10px", borderRadius: 20 }}>{stLabel}</span>
                            {isOpen ? <ChevronUp size={16} color="#9BA17B" /> : <ChevronDown size={16} color="#9BA17B" />}
                          </div>
                        </div>
                        {isOpen && (
                          <div style={{ borderTop: "1px solid rgba(200,187,164,0.3)", padding: "1rem 1.25rem" }}>
                            {order.items?.map((item: any, i: number) => (
                              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < order.items.length - 1 ? "1px solid rgba(200,187,164,0.2)" : "none" }}>
                                <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.82rem", color: "#1C201B" }}>{item.name} × {item.qty}</span>
                                <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.82rem", color: "#9BA17B" }}>{(item.price * item.qty).toFixed(2)} {t("common.currency", lang)}</span>
                              </div>
                            ))}
                            <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: 3 }}>
                              {order.discount > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                  <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.77rem", color: "#059669" }}>{t("profile.order.discount", lang)}</span>
                                  <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.77rem", color: "#059669" }}>-{order.discount?.toFixed(2)} {t("common.currency", lang)}</span>
                                </div>
                              )}
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.77rem", color: "#9BA17B" }}>{t("profile.order.shipping", lang)}</span>
                                <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.77rem", color: "#9BA17B" }}>
                                  {order.shipping === 0 ? t("profile.order.shipping.free", lang) : `${order.shipping?.toFixed(2)} ${t("common.currency", lang)}`}
                                </span>
                              </div>
                              {order.pointsEarned > 0 && (
                                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F2F7F3", padding: "5px 10px", marginTop: 3 }}>
                                  <Star size={12} color="#1F3929" strokeWidth={1.5} />
                                  <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.73rem", color: "#1F3929" }}>{t("profile.order.points", lang)} {order.pointsEarned} {t("profile.order.points2", lang)}</span>
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
            )}

            {/* ═══ TAB: PERSONAL INFO ═══ */}
            {tab === "info" && (
              <div style={{ maxWidth: 560 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                  <Field lang={lang} label={t("profile.info.name", lang)} value={info.name} onChange={v => setInfo(f => ({ ...f, name: v }))} placeholder={t("profile.info.name.placeholder", lang)} />
                  <Field lang={lang} label={t("profile.info.phone", lang)} value={u.phone} disabled placeholder="" />
                  <Field lang={lang} label={t("profile.info.email", lang)} value={info.email} onChange={v => setInfo(f => ({ ...f, email: v }))} placeholder="example@email.com" type="email" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <button
                    onClick={() => saveProfile.mutate({ ...info })}
                    disabled={saveProfile.isPending}
                    className="btn-primary"
                    style={{ height: 44, padding: "0 2rem", fontSize: "0.88rem" }}
                  >
                    {saveProfile.isPending ? t("common.saving", lang) : t("profile.info.save", lang)}
                  </button>
                  {saved && (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "'Mirza', serif", fontSize: "0.85rem", color: "#059669" }}>
                      <CheckCircle size={16} strokeWidth={1.5} /> {t("common.saved", lang)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ═══ TAB: BUSINESS INFO ═══ */}
            {tab === "business" && (
              <div style={{ maxWidth: 560 }}>
                <p style={{ fontFamily: "'Mirza', serif", fontSize: "0.88rem", color: "#9BA17B", marginBottom: "1.5rem", lineHeight: 1.7 }}>
                  {t("profile.biz.desc", lang)}
                </p>

                <div style={{ display: "flex", marginBottom: "1.5rem", border: "1px solid rgba(200,187,164,0.4)", borderRadius: 3, overflow: "hidden" }}>
                  {["individual", "business"].map(tp => (
                    <button key={tp}
                      onClick={() => setBiz(f => ({ ...f, accountType: tp }))}
                      style={{
                        flex: 1, padding: "0.65rem", border: "none", cursor: "pointer",
                        background: biz.accountType === tp ? "#1F3929" : "#FDFAF5",
                        color: biz.accountType === tp ? "#F2EADB" : "#9BA17B",
                        fontFamily: "'Mirza', serif", fontSize: "0.88rem",
                        transition: "all 0.15s",
                      }}
                    >
                      {tp === "individual" ? t("profile.biz.individual", lang) : t("profile.biz.company", lang)}
                    </button>
                  ))}
                </div>

                {biz.accountType === "business" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                    <Field lang={lang} label={t("profile.biz.name", lang)} value={biz.businessName} onChange={v => setBiz(f => ({ ...f, businessName: v }))} placeholder={t("profile.biz.name.placeholder", lang)} />
                    <Field lang={lang} label={t("profile.biz.vat", lang)} value={biz.vatNumber} onChange={v => setBiz(f => ({ ...f, vatNumber: v }))} placeholder="300000000000003" />
                    <Field lang={lang} label={t("profile.biz.cr", lang)} value={biz.commercialRegister} onChange={v => setBiz(f => ({ ...f, commercialRegister: v }))} placeholder="1010000000" />
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <button
                    onClick={() => saveProfile.mutate({ ...biz })}
                    disabled={saveProfile.isPending}
                    className="btn-primary"
                    style={{ height: 44, padding: "0 2rem", fontSize: "0.88rem" }}
                  >
                    {saveProfile.isPending ? t("common.saving", lang) : t("profile.biz.save", lang)}
                  </button>
                  {saved && (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "'Mirza', serif", fontSize: "0.85rem", color: "#059669" }}>
                      <CheckCircle size={16} strokeWidth={1.5} /> {t("common.saved", lang)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ═══ TAB: ADDRESSES ═══ */}
            {tab === "addresses" && (
              <div>
                {!addingAddr && (
                  <button
                    onClick={() => setAddingAddr(true)}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", background: "none", border: "1px dashed rgba(200,187,164,0.6)", borderRadius: 4, padding: "0.7rem 1.25rem", cursor: "pointer", width: "100%", justifyContent: "center", fontFamily: "'Mirza', serif", fontSize: "0.88rem", color: "#9BA17B" }}
                  >
                    <Plus size={16} strokeWidth={1.5} /> {t("profile.addr.add", lang)}
                  </button>
                )}
                {addingAddr && (
                  <AddressForm lang={lang} onSave={data => addAddr.mutate(data)} onCancel={() => setAddingAddr(false)} />
                )}

                {addresses.length === 0 && !addingAddr && (
                  <div style={{ background: "#FDFAF5", border: "1px solid rgba(200,187,164,0.3)", padding: "3rem", textAlign: "center" }}>
                    <MapPin size={36} color="#C8BBA4" strokeWidth={1} style={{ marginBottom: "1rem" }} />
                    <p style={{ fontFamily: "'Mirza', serif", color: "#9BA17B" }}>{t("profile.addr.empty", lang)}</p>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {(addresses as any[]).map((addr: any) => (
                    editingAddr === addr._id ? (
                      <AddressForm
                        key={addr._id}
                        lang={lang}
                        initial={addr}
                        onSave={data => updateAddr.mutate({ id: addr._id, data })}
                        onCancel={() => setEditingAddr(null)}
                      />
                    ) : (
                      <div key={addr._id} style={{ background: "#FDFAF5", border: addr.isDefault ? "1.5px solid #1F3929" : "1px solid rgba(200,187,164,0.35)", borderRadius: 4, padding: "1rem 1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                            <MapPin size={14} color="#9BA17B" strokeWidth={1.5} />
                            <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.9rem", fontWeight: 600, color: "#1C201B" }}>{addr.label}</span>
                            {addr.isDefault && (
                              <span style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.1em", background: "#1F3929", color: "#F2EADB", padding: "2px 7px", borderRadius: 10 }}>{t("profile.addr.default", lang)}</span>
                            )}
                          </div>
                          <p style={{ fontFamily: "'Mirza', serif", fontSize: "0.83rem", color: "#9BA17B", margin: 0, lineHeight: 1.7 }}>
                            {[addr.city, addr.district, addr.street, addr.building].filter(Boolean).join(" — ")}
                            {addr.zipCode && <span style={{ marginInlineStart: "0.5rem", fontFamily: "monospace", fontSize: "0.75rem" }}>({addr.zipCode})</span>}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                          <button onClick={() => setEditingAddr(addr._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9BA17B", padding: 4 }}><Pencil size={15} strokeWidth={1.5} /></button>
                          <button onClick={() => deleteAddr.mutate(addr._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#C8BBA4", padding: 4 }}><Trash2 size={15} strokeWidth={1.5} /></button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          [style*="grid-template-columns: 260px 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
