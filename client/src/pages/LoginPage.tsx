import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
export default function LoginPage() {
  const [tab, setTab] = useState<"login"|"register">("login");
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const { login } = useAuth();
  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await login.mutateAsync(form); window.location.href = "/"; }
    catch (e: any) { alert(e.message); }
  };
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="card" style={{ width: "100%", maxWidth: 400, padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src="/uploads/1784370406655-0pagzhax6gn.png" alt="uji" style={{ maxHeight: 60, margin: "0 auto 1rem", objectFit: "contain" }} />
          <h2 style={{ fontWeight: 700, fontSize: "1.5rem" }}>uji</h2>
        </div>
        <div style={{ display: "flex", borderBottom: "2px solid var(--border)", marginBottom: "1.5rem" }}>
          {(["login","register"] as const).map((t) => <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "0.75rem", fontWeight: 600, border: "none", background: "none", cursor: "pointer", borderBottom: `3px solid ${tab===t ? "var(--accent)" : "transparent"}`, color: tab===t ? "var(--accent)" : "var(--muted)", fontSize: "0.95rem", fontFamily: "inherit" }}>{t==="login" ? "تسجيل الدخول" : "حساب جديد"}</button>)}
        </div>
        <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tab === "register" && <input placeholder="الاسم الكامل" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
          <input placeholder="رقم الجوال" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input type="password" placeholder="كلمة المرور" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit" className="btn-primary" style={{ padding: "0.9rem" }}>{tab === "login" ? "دخول" : "إنشاء حساب"}</button>
        </form>
      </div>
    </div>
  );
}