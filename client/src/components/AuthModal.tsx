import { useState, useEffect, useCallback } from "react";
import { X, Eye, EyeOff, User, LogOut, ArrowRight, Mail, Briefcase } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAuthModal } from "../context/AuthModalContext";
import { api } from "../lib/api";
import PhoneInput, { COUNTRIES, type Country } from "./PhoneInput";

/* ─────────────────────── shared micro-styles ─────────────────────── */
const F: React.CSSProperties  = { display: "flex", flexDirection: "column", gap: 6 };
const LBL: React.CSSProperties = {
  fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase",
  color: "#9BA17B", fontFamily: "'Inter', sans-serif",
};
const INP: React.CSSProperties = {
  height: 48, background: "#F7F2E8",
  border: "1px solid rgba(200,187,164,0.55)",
  padding: "0 1rem",
  fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif",
  fontSize: "0.88rem", color: "#1C201B", outline: "none",
  boxSizing: "border-box", width: "100%", transition: "border-color 0.2s",
};
const ERR: React.CSSProperties = {
  background: "#FDF2F2", borderRight: "3px solid #C87070",
  border: "1px solid #F5BABA", padding: "10px 14px",
  fontSize: "0.82rem", color: "#8B3A3A",
  fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif",
  lineHeight: 1.6, direction: "rtl", textAlign: "right",
};
const OK: React.CSSProperties = {
  background: "#F2F7F3", borderRight: "3px solid #1F3929",
  border: "1px solid #A8C8B0", padding: "10px 14px",
  fontSize: "0.82rem", color: "#1F3929",
  fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif",
  lineHeight: 1.6, direction: "rtl", textAlign: "right",
};
const BTN = (disabled: boolean): React.CSSProperties => ({
  height: 50, background: disabled ? "#C8BBA4" : "#16281D",
  color: "#F2EADB", border: "none", width: "100%",
  cursor: disabled ? "not-allowed" : "pointer",
  fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif",
  fontSize: "0.88rem", letterSpacing: "0.08em",
  transition: "background 0.2s",
});
const LINK: React.CSSProperties = {
  background: "none", border: "none", padding: 0,
  color: "#1F3929", cursor: "pointer",
  fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif",
  fontSize: "0.78rem", fontWeight: 600, textDecoration: "underline",
};
const MUTED: React.CSSProperties = {
  fontSize: "0.78rem", color: "#9BA17B",
  fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif",
  textAlign: "center", margin: 0,
};

/* ─────────────────────── password field ─────────────────────── */
function PwdField({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={F}>
      <label style={LBL}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "••••••••"}
          required={required} minLength={6}
          style={{ ...INP, paddingLeft: 44, direction: "ltr", textAlign: "left" }}
        />
        <button type="button" onClick={() => setShow(v => !v)} tabIndex={-1}
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                   background: "none", border: "none", cursor: "pointer", color: "#9BA17B",
                   display: "flex", alignItems: "center" }}>
          {show ? <EyeOff size={16} strokeWidth={1.5}/> : <Eye size={16} strokeWidth={1.5}/>}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────── types ─────────────────────── */
type View = "login" | "register" | "forgot" | "otp";

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function AuthModal() {
  const { isOpen, initialTab, closeAuth } = useAuthModal();
  const { user, login, register, logout }  = useAuth();

  const [view,       setView]       = useState<View>("login");
  const [name,       setName]       = useState("");
  const [phone,      setPhone]      = useState("");
  const [email,      setEmail]      = useState("");
  const [country,    setCountry]    = useState(COUNTRIES[0]);
  const [pass,       setPass]       = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [otp,        setOtp]        = useState("");
  const [newPass,    setNewPass]    = useState("");
  const [newConf,    setNewConf]    = useState("");
  const [isEmployee, setIsEmployee] = useState(false);
  const [jobTitle,   setJobTitle]   = useState("");
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [busy,       setBusy]       = useState(false);

  /* ── open → sync view ── */
  useEffect(() => {
    if (isOpen) {
      setView(initialTab === "register" ? "register" : "login");
      setError(""); setSuccess("");
    }
  }, [isOpen, initialTab]);

  /* ── ESC ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") closeAuth(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [closeAuth]);

  /* ── lock scroll ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const clear = useCallback(() => {
    setName(""); setPhone(""); setEmail(""); setPass(""); setConfirm("");
    setOtp(""); setNewPass(""); setNewConf(""); setIsEmployee(false); setJobTitle("");
    setError(""); setSuccess("");
    setCountry(COUNTRIES[0]);
  }, []);

  const go = (v: View) => { setView(v); setError(""); setSuccess(""); };

  /* ── login ── */
  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (!phone.trim()) { setError("يرجى إدخال رقم الجوال"); return; }
    if (!pass)         { setError("يرجى إدخال كلمة المرور"); return; }
    setBusy(true);
    try {
      await login.mutateAsync({ phone: phone.trim(), password: pass });
      setSuccess("تم تسجيل الدخول بنجاح ✦");
      setTimeout(() => { closeAuth(); clear(); }, 900);
    } catch (err: any) {
      setError(err.message || "بيانات غير صحيحة — تحقق من الجوال وكلمة المرور");
    }
    setBusy(false);
  };

  /* ── register ── */
  const doRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (!name.trim())    { setError("يرجى إدخال الاسم الكامل"); return; }
    if (!phone.trim())   { setError("يرجى إدخال رقم الجوال"); return; }
    if (pass.length < 6) { setError("كلمة المرور يجب أن تكون ٦ أحرف على الأقل"); return; }
    if (pass !== confirm) { setError("كلمتا المرور غير متطابقتين"); return; }
    setBusy(true);
    try {
      await register.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        password: pass,
        email: email.trim() || undefined,
        role: isEmployee ? "employee" : "customer",
        jobTitle: isEmployee ? jobTitle.trim() : undefined,
      } as any);
      setSuccess(isEmployee
        ? "تم إنشاء حساب الموظف بنجاح — بانتظار موافقة المدير ✦"
        : "تم إنشاء حسابك بنجاح — أهلاً بك في UJI MATCHA ✦"
      );
      setTimeout(() => { closeAuth(); clear(); }, 1200);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب");
    }
    setBusy(false);
  };

  /* ── forgot — request OTP ── */
  const doForgot = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (!phone.trim()) { setError("يرجى إدخال رقم الجوال المسجل"); return; }
    setBusy(true);
    try {
      const res = await api.post("/auth/forgot-password", { phone: phone.trim() });
      setSuccess((res as any).message || "تم إرسال رمز التحقق إلى بريدك");
      setTimeout(() => go("otp"), 1500);
    } catch (err: any) {
      setError(err.message || "حدث خطأ — تأكد من رقم الجوال");
    }
    setBusy(false);
  };

  /* ── reset — verify OTP + new password ── */
  const doReset = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (!otp.trim() || otp.length < 6) { setError("أدخل رمز التحقق المكوّن من ٦ أرقام"); return; }
    if (newPass.length < 6)  { setError("كلمة المرور يجب أن تكون ٦ أحرف على الأقل"); return; }
    if (newPass !== newConf)  { setError("كلمتا المرور غير متطابقتين"); return; }
    setBusy(true);
    try {
      const res = await api.post("/auth/reset-password", {
        phone: phone.trim(), otp: otp.trim(), newPassword: newPass,
      });
      setSuccess((res as any).message || "تم تغيير كلمة المرور بنجاح ✦");
      setTimeout(() => { clear(); go("login"); }, 1500);
    } catch (err: any) {
      setError(err.message || "رمز التحقق غير صحيح أو منتهي الصلاحية");
    }
    setBusy(false);
  };

  /* ── logout ── */
  const doLogout = async () => { await logout.mutateAsync(); closeAuth(); };

  if (!isOpen) return null;

  /* ════ RENDER ════ */
  return (
    <>
      {/* backdrop */}
      <div
        onClick={closeAuth}
        style={{
          position: "fixed", inset: 0, zIndex: 2000,
          background: "rgba(16,28,20,0.6)",
          backdropFilter: "blur(8px)",
          animation: "uji-fade 0.22s ease",
        }}
      />

      {/* popup */}
      <div
        role="dialog" aria-modal="true"
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(500px, calc(100vw - 32px))",
          maxHeight: "min(700px, calc(100vh - 40px))",
          zIndex: 2001,
          background: "#FDFAF5",
          boxShadow: "0 32px 80px rgba(0,0,0,0.28)",
          display: "flex", flexDirection: "column",
          animation: "uji-popup 0.28s cubic-bezier(0.34,1.56,0.64,1)",
          overflowY: "auto",
          direction: "rtl",
        }}
      >

        {/* ── Logo header ── */}
        <div style={{
          background: "#16281D",
          padding: "28px 24px 20px",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 10, flexShrink: 0, position: "relative",
        }}>
          <button
            onClick={closeAuth}
            style={{
              position: "absolute", top: 14, left: 14,
              background: "rgba(255,255,255,0.1)", border: "none",
              borderRadius: "50%", width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#9BA17B",
            }}
            aria-label="إغلاق"
          >
            <X size={14} strokeWidth={2.5} />
          </button>

          <img
            src="/assets/brand/uji-logo-white-transparent.png"
            alt="UJI MATCHA"
            style={{ height: 48, objectFit: "contain", display: "block" }}
            onError={e => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              const next = e.currentTarget.nextElementSibling as HTMLElement;
              if (next) next.style.display = "block";
            }}
          />
          <span style={{ display: "none", fontFamily: "'Aref Ruqaa', 'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, letterSpacing: "0.3em", color: "#F2EADB" }}>UJI</span>
          <div style={{ width: 28, height: 1, background: "#9BA17B" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.5rem", letterSpacing: "0.42em", color: "#9BA17B" }}>CEREMONIAL GRADE MATCHA</span>
        </div>

        {/* ══════════ LOGGED-IN STATE ══════════ */}
        {user ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "2.5rem 2rem" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#EDE8DF", border: "2px solid #C8BBA4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={28} strokeWidth={1} color="#9BA17B" />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Aref Ruqaa', 'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 400, color: "#1C201B", margin: "0 0 4px" }}>{(user as any).name || "مرحباً"}</p>
              <p style={{ fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif", fontSize: "0.82rem", color: "#9BA17B", margin: 0, direction: "ltr" }}>{(user as any).phone}</p>
              {(user as any).role === "employee" && (
                <span style={{ display: "inline-block", marginTop: 6, background: "rgba(31,57,41,0.1)", color: "#1F3929", fontSize: "0.72rem", padding: "3px 10px", fontFamily: "'IBM Plex Sans Arabic',sans-serif" }}>موظف</span>
              )}
            </div>
            {/* Loyalty points */}
            {(user as any).loyaltyPoints > 0 && (
              <div style={{ background: "#F2F7F3", border: "1px solid #A8C8B0", padding: "10px 20px", textAlign: "center" }}>
                <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: "#1F3929", margin: 0 }}>
                  نقاط الولاء: <strong>{(user as any).loyaltyPoints}</strong> ✦ مستوى {(user as any).loyaltyTier === "bronze" ? "برونزي" : (user as any).loyaltyTier === "silver" ? "فضي" : (user as any).loyaltyTier === "gold" ? "ذهبي" : "بلاتيني"}
                </p>
              </div>
            )}
            <div style={{ width: "100%", background: "#EDE8DF", height: 1 }} />
            <button onClick={doLogout} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px solid #C8BBA4", padding: "11px 28px", cursor: "pointer", fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif", fontSize: "0.88rem", color: "#1C201B", transition: "all 0.2s" }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.background="#1F3929"; b.style.color="#F2EADB"; b.style.borderColor="#1F3929"; }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.background="none"; b.style.color="#1C201B"; b.style.borderColor="#C8BBA4"; }}>
              <LogOut size={14} strokeWidth={1.5} />تسجيل الخروج
            </button>
          </div>
        ) : (

        /* ══════════ AUTH FORMS ══════════ */
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* ── Tabs ── */}
          {(view === "login" || view === "register") && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(200,187,164,0.4)", flexShrink: 0 }}>
              {(["login", "register"] as const).map(t => (
                <button key={t} type="button" onClick={() => go(t)}
                  style={{ padding: "0.85rem", background: "none", border: "none", borderBottom: `2px solid ${view === t ? "#16281D" : "transparent"}`, fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif", fontSize: "0.82rem", color: view === t ? "#16281D" : "#9BA17B", cursor: "pointer", transition: "all 0.2s", fontWeight: view === t ? 600 : 400 }}>
                  {t === "login" ? "تسجيل الدخول" : "حساب جديد"}
                </button>
              ))}
            </div>
          )}

          {/* ── back header for forgot / otp ── */}
          {(view === "forgot" || view === "otp") && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid rgba(200,187,164,0.3)", flexShrink: 0 }}>
              <button type="button" onClick={() => go("login")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9BA17B", display: "flex", alignItems: "center", padding: 0 }}>
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
              <span style={{ fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif", fontSize: "0.82rem", color: "#1C201B", fontWeight: 600 }}>
                {view === "forgot" ? "نسيت كلمة المرور" : "إدخال رمز التحقق"}
              </span>
            </div>
          )}

          {/* ─── form body ─── */}
          <div style={{ padding: "1.75rem 1.75rem 1.25rem", flex: 1 }}>
            {error   && <div style={{ ...ERR, marginBottom: 18 }}>{error}</div>}
            {success && <div style={{ ...OK,  marginBottom: 18 }}>{success}</div>}

            {/* ════ LOGIN ════ */}
            {view === "login" && (
              <form onSubmit={doLogin} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div style={F}>
                  <label style={LBL}>رقم الجوال</label>
                  <PhoneInput theme="light" value={phone} onChange={(n,c) => { setPhone(n); setCountry(c); }} countryCode={country.code} onCountryChange={setCountry} required style={{ height: 48 }} />
                </div>
                <PwdField label="كلمة المرور" value={pass} onChange={setPass} required />
                <div style={{ textAlign: "left" }}>
                  <button type="button" onClick={() => go("forgot")} style={{ ...LINK, fontSize: "0.75rem", color: "#9BA17B", textDecoration: "none", borderBottom: "1px dashed #C8BBA4" }}>نسيت كلمة المرور؟</button>
                </div>
                <button type="submit" disabled={busy} style={BTN(busy)}>{busy ? "جار الدخول..." : "دخول ✦"}</button>
                <p style={MUTED}>ليس لديك حساب؟{" "}<button type="button" onClick={() => go("register")} style={LINK}>أنشئ حساباً</button></p>
              </form>
            )}

            {/* ════ REGISTER ════ */}
            {view === "register" && (
              <form onSubmit={doRegister} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div style={F}>
                  <label style={LBL}>الاسم الكامل</label>
                  <input style={INP} value={name} onChange={e => setName(e.target.value)} placeholder="محمد العمري" required autoComplete="name" />
                </div>
                <div style={F}>
                  <label style={LBL}>رقم الجوال</label>
                  <PhoneInput theme="light" value={phone} onChange={(n,c) => { setPhone(n); setCountry(c); }} countryCode={country.code} onCountryChange={setCountry} required style={{ height: 48 }} />
                </div>
                <div style={F}>
                  <label style={LBL}>البريد الإلكتروني <span style={{ color: "#C8BBA4" }}>(اختياري)</span></label>
                  <input style={INP} value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" type="email" />
                </div>
                <PwdField label="كلمة المرور" value={pass} onChange={setPass} placeholder="٦ أحرف على الأقل" required />
                <PwdField label="تأكيد كلمة المرور" value={confirm} onChange={setConfirm} placeholder="أعد كتابة كلمة المرور" required />

                {/* Employee toggle */}
                <div style={{ border: "1px solid rgba(200,187,164,0.4)", padding: "12px 16px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                    <div
                      onClick={() => setIsEmployee(v => !v)}
                      style={{ width: 40, height: 22, borderRadius: 11, background: isEmployee ? "#1F3929" : "#C8BBA4", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                      <div style={{ position: "absolute", top: 2, width: 18, height: 18, background: "#fff", borderRadius: "50%", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "transform 0.2s", transform: isEmployee ? "translateX(2px)" : "translateX(20px)" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Briefcase size={14} strokeWidth={1.5} color="#9BA17B" />
                      <span style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.82rem", color: "#1C201B" }}>
                        التسجيل كموظف
                      </span>
                    </div>
                  </label>
                  {isEmployee && (
                    <div style={{ marginTop: 12 }}>
                      <label style={LBL}>المسمى الوظيفي</label>
                      <input style={{ ...INP, marginTop: 6 }} value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="مثال: مسؤول خدمة عملاء" />
                    </div>
                  )}
                </div>

                <button type="submit" disabled={busy} style={BTN(busy)}>{busy ? "جار الإنشاء..." : isEmployee ? "إنشاء حساب موظف ✦" : "إنشاء الحساب ✦"}</button>
                <p style={MUTED}>لديك حساب؟{" "}<button type="button" onClick={() => go("login")} style={LINK}>سجّل دخولك</button></p>
              </form>
            )}

            {/* ════ FORGOT ════ */}
            {view === "forgot" && (
              <form onSubmit={doForgot} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <p style={{ fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif", fontSize: "0.84rem", color: "#6B7280", lineHeight: 1.8, margin: "0 0 4px", direction: "rtl" }}>
                  أدخل رقم جوالك المسجل وسنرسل رمز التحقق إلى بريدك الإلكتروني.
                </p>
                <div style={F}>
                  <label style={LBL}>رقم الجوال المسجل</label>
                  <PhoneInput theme="light" value={phone} onChange={(n,c) => { setPhone(n); setCountry(c); }} countryCode={country.code} onCountryChange={setCountry} required style={{ height: 48 }} />
                </div>
                <button type="submit" disabled={busy} style={BTN(busy)}>{busy ? "جار الإرسال..." : "إرسال رمز التحقق ✦"}</button>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#F0EBE1", padding: "12px 14px", direction: "rtl" }}>
                  <Mail size={15} strokeWidth={1.5} color="#9BA17B" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif", fontSize: "0.78rem", color: "#9BA17B", lineHeight: 1.7 }}>
                    تأكد من وجود بريد إلكتروني مرتبط بحسابك
                  </span>
                </div>
              </form>
            )}

            {/* ════ OTP ════ */}
            {view === "otp" && (
              <form onSubmit={doReset} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <p style={{ fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif", fontSize: "0.84rem", color: "#6B7280", lineHeight: 1.8, margin: 0, direction: "rtl" }}>
                  أدخل رمز التحقق المرسل لبريدك ثم اختر كلمة مرور جديدة.
                </p>
                <div style={F}>
                  <label style={LBL}>رمز التحقق (٦ أرقام)</label>
                  <input style={{ ...INP, direction: "ltr", textAlign: "center", fontSize: "1.4rem", letterSpacing: "0.35em", fontFamily: "monospace" }}
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000" required maxLength={6} inputMode="numeric" />
                </div>
                <PwdField label="كلمة المرور الجديدة" value={newPass} onChange={setNewPass} placeholder="٦ أحرف على الأقل" required />
                <PwdField label="تأكيد كلمة المرور" value={newConf} onChange={setNewConf} placeholder="أعد كتابة كلمة المرور" required />
                <button type="submit" disabled={busy} style={BTN(busy)}>{busy ? "جار التحقق..." : "تأكيد وتغيير كلمة المرور ✦"}</button>
                <p style={MUTED}>لم يصلك الرمز؟{" "}<button type="button" onClick={() => go("forgot")} style={LINK}>إعادة الإرسال</button></p>
              </form>
            )}
          </div>

          {/* footer note */}
          {(view === "login" || view === "register") && (
            <div style={{ padding: "0.9rem 1.75rem", borderTop: "1px solid rgba(200,187,164,0.3)", flexShrink: 0 }}>
              <p style={{ fontSize: "0.68rem", color: "#C8BBA4", margin: 0, textAlign: "center", fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif", lineHeight: 1.7 }}>
                بتسجيل حسابك توافق على{" "}
                <a href="/policy" style={{ color: "#9BA17B" }}>سياسة الخصوصية وشروط الاستخدام</a>
              </p>
            </div>
          )}
        </div>
        )}
      </div>

      <style>{`
        @keyframes uji-fade   { from { opacity:0 } to { opacity:1 } }
        @keyframes uji-popup  {
          from { opacity:0; transform:translate(-50%,-50%) scale(0.9) }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1)   }
        }
      `}</style>
    </>
  );
}
