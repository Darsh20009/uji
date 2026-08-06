import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLang } from "../context/LanguageContext";
import { t } from "../lib/translations";

export default function LoginPage() {
  const [tab, setTab] = useState<"login"|"register">("login");
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const { login } = useAuth();
  const { lang } = useLang();

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
          {(["login","register"] as const).map((tab2) => (
            <button key={tab2} onClick={() => setTab(tab2)} style={{ flex: 1, padding: "0.75rem", fontWeight: 600, border: "none", background: "none", cursor: "pointer", borderBottom: `3px solid ${tab===tab2 ? "var(--accent)" : "transparent"}`, color: tab===tab2 ? "var(--accent)" : "var(--muted)", fontSize: "0.95rem", fontFamily: "inherit" }}>
              {tab2 === "login" ? t("login.tab.login", lang) : t("login.tab.register", lang)}
            </button>
          ))}
        </div>
        <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tab === "register" && (
            <input placeholder={t("login.field.name", lang)} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          )}
          <input placeholder={t("login.field.phone", lang)} required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input type="password" placeholder={t("login.field.password", lang)} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit" className="btn-primary" style={{ padding: "0.9rem" }}>
            {tab === "login" ? t("login.btn.login", lang) : t("login.btn.register", lang)}
          </button>
        </form>
      </div>
    </div>
  );
}
