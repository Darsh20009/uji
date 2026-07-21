import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  X, Plus, Pencil, Trash2, Package, ShoppingBag,
  Settings2, Mail, LogOut, Upload, LayoutDashboard,
  TrendingUp, Users, ChevronDown, Check, Menu,
} from "lucide-react";
import PhoneInput, { COUNTRIES, type Country } from "../components/PhoneInput";

type Tab = "dashboard" | "products" | "orders" | "customers" | "settings";
const ADMIN_PHONE = "0552469643";

/* ─── Status maps ─── */
const STATUS_AR: Record<string, string> = {
  pending: "معلق", confirmed: "مؤكد",
  shipped: "جاري الشحن", delivered: "تم التسليم", cancelled: "ملغي",
};
const STATUS_COLOR: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped:   "bg-violet-50 text-violet-700 border-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

/* ─── Shared mini components ─── */
function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLOR[status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
      {STATUS_AR[status] || status}
    </span>
  );
}

function StatCard({ label, value, icon, sub }: { label: string; value: string | number; icon: React.ReactNode; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 flex items-start gap-4 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-[#1F3929]/8 flex items-center justify-center text-[#1F3929] shrink-0"
        style={{ background: "rgba(31,57,41,0.08)" }}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-stone-400 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-stone-800">{value}</p>
        {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Login Screen ─── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [phone, setPhone] = useState(ADMIN_PHONE);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [pass, setPass] = useState("");
  const [setupMode, setSetupMode] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await api.post("/auth/login", { phone, password: pass }); onLogin(); }
    catch (e: any) { setError(e.message?.includes("401") ? "بيانات غير صحيحة" : e.message || "خطأ في تسجيل الدخول"); }
    setLoading(false);
  };

  const doSetup = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await api.post("/auth/admin-setup", { password: newPass }); setSetupMode(false); setPass(newPass); }
    catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F2EADB] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/assets/brand/uji-logo-forest-green-transparent.png" alt="UJI" className="h-14 mx-auto mb-3 object-contain" />
          <p className="text-xs tracking-[0.3em] text-[#9BA17B] uppercase font-light">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="bg-[#1F3929] px-6 py-5">
            <h1 className="text-[#F2EADB] font-light text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {setupMode ? "إعداد حساب المدير" : "مرحباً بعودتك"}
            </h1>
            <p className="text-[#9BA17B] text-xs mt-0.5">
              {setupMode ? "أنشئ كلمة مرور للمرة الأولى" : "سجّل دخولك للوحة الإدارة"}
            </p>
          </div>

          <div className="p-6">
            {!setupMode ? (
              <form onSubmit={doLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs tracking-widest text-[#9BA17B] uppercase mb-2">رقم الجوال</label>
                  <PhoneInput
                    theme="light"
                    value={phone}
                    onChange={(num, c) => { setPhone(num); setCountry(c); }}
                    countryCode={country.code}
                    onCountryChange={setCountry}
                    style={{ height: 44, border: "1px solid #e7e5e4", borderRadius: 8 }}
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest text-[#9BA17B] uppercase mb-2">كلمة المرور</label>
                  <input
                    type="password"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-3 rounded-lg border border-stone-200 text-sm bg-stone-50 outline-none focus:border-[#9BA17B]"
                    style={{ fontFamily: "inherit" }}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={loading}
                  className="h-11 rounded-lg bg-[#1F3929] text-[#F2EADB] text-sm tracking-widest uppercase font-light transition-opacity hover:opacity-90 disabled:opacity-60">
                  {loading ? "جاري الدخول..." : "دخول"}
                </button>
                <button type="button" onClick={() => setSetupMode(true)}
                  className="text-xs text-stone-400 hover:text-stone-600 underline text-center">
                  إعداد حساب المدير لأول مرة
                </button>
              </form>
            ) : (
              <form onSubmit={doSetup} className="flex flex-col gap-4">
                <p className="text-sm text-[#9BA17B]">سيتم ربط الحساب بالرقم: {ADMIN_PHONE}</p>
                <div>
                  <label className="block text-xs tracking-widest text-[#9BA17B] uppercase mb-2">كلمة المرور الجديدة</label>
                  <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                    placeholder="٦ أحرف على الأقل" minLength={6} required
                    className="w-full h-11 px-3 rounded-lg border border-stone-200 text-sm bg-stone-50 outline-none focus:border-[#9BA17B]"
                    style={{ fontFamily: "inherit" }} />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={loading}
                  className="h-11 rounded-lg bg-[#1F3929] text-[#F2EADB] text-sm tracking-widest uppercase font-light hover:opacity-90 disabled:opacity-60">
                  {loading ? "جاري الحفظ..." : "حفظ وتسجيل الدخول"}
                </button>
                <button type="button" onClick={() => setSetupMode(false)} className="text-xs text-stone-400 hover:text-stone-600 text-center">
                  ← رجوع
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar nav item ─── */
function NavItem({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
        active
          ? "bg-[#1F3929] text-[#F2EADB] shadow-sm"
          : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
      }`}>
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/* ─── Main Admin Shell ─── */
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [authed, setAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const qc = useQueryClient();
  const { data: me, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").catch(() => null),
    retry: false,
  });

  if (isLoading) return (
    <div className="min-h-screen bg-[#F2EADB] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#1F3929] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!me && !authed) return <LoginScreen onLogin={() => { setAuthed(true); qc.invalidateQueries({ queryKey: ["me"] }); }} />;
  const isAdmin = (me as any)?.phone === ADMIN_PHONE || authed;
  if (!isAdmin) return <LoginScreen onLogin={() => { setAuthed(true); qc.invalidateQueries({ queryKey: ["me"] }); }} />;

  const NAV = [
    { key: "dashboard" as Tab, label: "لوحة التحكم", icon: <LayoutDashboard size={16} /> },
    { key: "products"  as Tab, label: "المنتجات",    icon: <Package size={16} /> },
    { key: "orders"    as Tab, label: "الطلبات",     icon: <ShoppingBag size={16} /> },
    { key: "customers" as Tab, label: "العملاء والموظفون", icon: <Users size={16} /> },
    { key: "settings"  as Tab, label: "الإعدادات",   icon: <Settings2 size={16} /> },
  ];

  const logout = () => { api.post("/auth/logout", {}); window.location.href = "/"; };

  return (
    <div className="min-h-screen bg-stone-50 flex" dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>

      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-l border-stone-100 min-h-screen sticky top-0 h-screen shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-stone-100">
          <img src="/assets/brand/uji-logo-forest-green-transparent.png" alt="UJI" className="h-9 object-contain" />
          <p className="text-[10px] tracking-[0.22em] text-[#9BA17B] uppercase mt-1.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(n => (
            <NavItem key={n.key} active={tab === n.key} icon={n.icon} label={n.label} onClick={() => setTab(n.key)} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-stone-100">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
          <a href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors mt-1">
            <span>← العودة للمتجر</span>
          </a>
        </div>
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-64 bg-white flex flex-col">
            <div className="px-5 py-5 border-b border-stone-100 flex items-center justify-between">
              <img src="/assets/brand/uji-logo-forest-green-transparent.png" alt="UJI" className="h-8 object-contain" />
              <button onClick={() => setSidebarOpen(false)} className="text-stone-400"><X size={20} /></button>
            </div>
            <nav className="flex-1 p-3 flex flex-col gap-1">
              {NAV.map(n => (
                <NavItem key={n.key} active={tab === n.key} icon={n.icon} label={n.label}
                  onClick={() => { setTab(n.key); setSidebarOpen(false); }} />
              ))}
            </nav>
            <div className="p-3 border-t border-stone-100">
              <button onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:bg-red-50 hover:text-red-500">
                <LogOut size={16} /><span>تسجيل الخروج</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-100 px-5 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-stone-100">
            <Menu size={20} className="text-stone-500" />
          </button>
          <div className="hidden lg:block">
            <h2 className="text-sm font-semibold text-stone-700">
              {NAV.find(n => n.key === tab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3 lg:mr-auto">
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              مدير
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {tab === "dashboard" && <AdminDashboard onNavigate={setTab} />}
          {tab === "products"  && <AdminProducts />}
          {tab === "orders"    && <AdminOrders />}
          {tab === "customers" && <AdminCustomers />}
          {tab === "settings"  && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}

/* ─── Dashboard ─── */
function AdminDashboard({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const { data: products = [] } = useQuery({ queryKey: ["admin-products"], queryFn: () => api.get("/admin/products") });
  const { data: orders = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: () => api.get("/admin/orders") });

  const revenue = orders.filter((o: any) => o.status !== "cancelled").reduce((s: number, o: any) => s + (o.total || 0), 0);
  const pending = orders.filter((o: any) => o.status === "pending").length;
  const recentOrders = [...orders].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-l from-[#1F3929] to-[#16281D] rounded-2xl p-6 text-white">
        <p className="text-[#9BA17B] text-xs tracking-widest uppercase mb-1">UJI MATCHA — ADMIN</p>
        <h1 className="text-2xl font-light" style={{ fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif" }}>مرحباً بك في لوحة التحكم</h1>
        <p className="text-[#9BA17B] text-sm mt-1">إدارة متجرك من مكان واحد.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إجمالي الطلبات" value={orders.length} icon={<ShoppingBag size={18} />} />
        <StatCard label="طلبات معلقة" value={pending} icon={<TrendingUp size={18} />} sub="تحتاج مراجعة" />
        <StatCard label="الإيرادات" value={revenue.toFixed(0) + " ر.س"} icon={<TrendingUp size={18} />} />
        <StatCard label="المنتجات" value={products.length} icon={<Package size={18} />} />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-700">آخر الطلبات</h3>
          <button onClick={() => onNavigate("orders")} className="text-xs text-[#9BA17B] hover:text-[#1F3929]">عرض الكل →</button>
        </div>
        <div className="divide-y divide-stone-50">
          {recentOrders.length === 0 && (
            <p className="text-center text-stone-400 py-8 text-sm">لا توجد طلبات بعد</p>
          )}
          {recentOrders.map((o: any) => (
            <div key={o._id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-700 truncate">{o.orderNumber}</p>
                <p className="text-xs text-stone-400 truncate">{o.customer?.name} — {o.customer?.phone}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold text-[#1F3929]">{o.total?.toFixed(0)} ر.س</span>
                <Badge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onNavigate("products")}
          className="bg-white rounded-2xl border border-stone-100 p-5 text-right hover:border-[#9BA17B] transition-colors">
          <Package size={20} className="text-[#1F3929] mb-3" />
          <p className="text-sm font-semibold text-stone-700">إدارة المنتجات</p>
          <p className="text-xs text-stone-400 mt-1">{products.length} منتج</p>
        </button>
        <button onClick={() => onNavigate("orders")}
          className="bg-white rounded-2xl border border-stone-100 p-5 text-right hover:border-[#9BA17B] transition-colors">
          <ShoppingBag size={20} className="text-[#1F3929] mb-3" />
          <p className="text-sm font-semibold text-stone-700">الطلبات</p>
          <p className="text-xs text-stone-400 mt-1">{pending} معلق من أصل {orders.length}</p>
        </button>
      </div>
    </div>
  );
}

/* ─── Products ─── */
function AdminProducts() {
  const qc = useQueryClient();
  const { data: products = [] } = useQuery({ queryKey: ["admin-products"], queryFn: () => api.get("/admin/products") });
  const [modal, setModal] = useState<null | "add" | "edit">(null);
  const [editing, setEditing] = useState<any>(null);
  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-stone-800">المنتجات</h2>
          <p className="text-xs text-stone-400 mt-0.5">{products.length} منتج في المتجر</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModal("add"); }}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#1F3929] text-[#F2EADB] text-sm hover:bg-[#16281D] transition-colors">
          <Plus size={15} /> منتج جديد
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p: any) => (
          <div key={p._id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-square bg-stone-50">
              <img
                src={p.images?.[0] || "https://via.placeholder.com/240"}
                className="w-full h-full object-cover"
                alt={p.name}
                onError={e => { (e.target as any).src = "https://via.placeholder.com/240"; }}
              />
              {!p.isActive && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">مخفي</span>
              )}
              {p.featured && (
                <span className="absolute top-2 left-2 bg-[#1F3929] text-[#9BA17B] text-[10px] px-2 py-0.5 rounded-full">مميز</span>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-stone-800 truncate">{p.name}</p>
              <p className="text-sm font-bold text-[#1F3929] mt-1">{p.price?.toFixed(2)} ر.س</p>
              <p className="text-xs text-stone-400 mt-0.5">المخزون: {p.stock}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => { setEditing(p); setModal("edit"); }}
                  className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-stone-200 text-xs text-stone-600 hover:bg-stone-50 transition-colors">
                  <Pencil size={11} /> تعديل
                </button>
                <button
                  onClick={() => { if (confirm("حذف المنتج؟")) del.mutate(p._id); }}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full py-16 text-center text-stone-400">
            <Package size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">لا توجد منتجات بعد</p>
          </div>
        )}
      </div>

      {modal && (
        <ProductModal
          mode={modal}
          product={editing}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); qc.invalidateQueries({ queryKey: ["admin-products"] }); }}
        />
      )}
    </div>
  );
}

/* ─── Product Modal ─── */
function ProductModal({ mode, product, onClose, onSaved }: { mode: "add" | "edit"; product: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    nameEn: product?.nameEn || "",
    description: product?.description || "",
    price: product?.price || "",
    comparePrice: product?.comparePrice || "",
    stock: product?.stock ?? 0,
    category: product?.category || "matcha",
    matchaType: product?.matchaType || "",
    isActive: product?.isActive ?? true,
    featured: product?.featured ?? false,
    sortOrder: product?.sortOrder ?? 0,
    existingImages: product?.images || [] as string[],
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify({ ...form, price: Number(form.price), comparePrice: Number(form.comparePrice) || 0, stock: Number(form.stock) }));
      files.forEach(f => fd.append("images", f));
      const url = mode === "add" ? "/api/admin/products" : `/api/admin/products/${product._id}`;
      await fetch(url, { method: mode === "add" ? "POST" : "PUT", body: fd, credentials: "include" });
      onSaved();
    } catch (e: any) { setError(e.message || "خطأ في الحفظ"); }
    setLoading(false);
  };

  const inputCls = "w-full h-10 px-3 rounded-lg border border-stone-200 text-sm bg-stone-50 outline-none focus:border-[#9BA17B] transition-colors";
  const labelCls = "block text-xs text-stone-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-sm font-semibold text-stone-800">{mode === "add" ? "إضافة منتج جديد" : "تعديل المنتج"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400"><X size={17} /></button>
        </div>

        <form onSubmit={save} className="p-5 space-y-4">
          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>الاسم بالعربي *</label>
              <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ fontFamily: "inherit" }} />
            </div>
            <div>
              <label className={labelCls}>الاسم بالإنجليزي</label>
              <input className={inputCls} value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} style={{ fontFamily: "inherit" }} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>الوصف</label>
            <textarea className={inputCls + " !h-20 resize-none py-2"} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ fontFamily: "inherit" }} />
          </div>

          {/* Price + stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>السعر (ر.س) *</label>
              <input type="number" className={inputCls} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required min={0} step="0.01" style={{ fontFamily: "inherit" }} />
            </div>
            <div>
              <label className={labelCls}>السعر الأصلي</label>
              <input type="number" className={inputCls} value={form.comparePrice} onChange={e => setForm({ ...form, comparePrice: e.target.value })} min={0} step="0.01" style={{ fontFamily: "inherit" }} />
            </div>
            <div>
              <label className={labelCls}>المخزون</label>
              <input type="number" className={inputCls} value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} min={0} style={{ fontFamily: "inherit" }} />
            </div>
          </div>

          {/* Category + toggles */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>الفئة</label>
              <select className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ fontFamily: "inherit" }}>
                <option value="matcha">ماتشا</option>
                <option value="tools">أدوات</option>
                <option value="sets">طقم</option>
                <option value="accessories">إكسسوار</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>الترتيب</label>
              <input type="number" className={inputCls} value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} min={0} style={{ fontFamily: "inherit" }} />
            </div>
          </div>

          {/* Matcha type */}
          <div>
            <label className={labelCls}>نوع الماتشا — يظهر كشارة على بطاقة المنتج</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: "",           label: "— بدون —",               sub: "" },
                { v: "ceremonial", label: "✦ فاخر جداً",           sub: "احتفالي — للريتشوال الأصيل" },
                { v: "everyday",   label: "☕ استخدام يومي",        sub: "متوازن — للاستخدام اليومي" },
                { v: "culinary",   label: "🧃 تجاري",               sub: "للمشروبات والوصفات" },
              ].map(opt => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setForm({ ...form, matchaType: opt.v })}
                  className={`p-3 rounded-xl border text-right transition-colors ${form.matchaType === opt.v ? "border-[#1F3929] bg-[#F0EBE1]" : "border-stone-200 hover:border-stone-300"}`}>
                  <p className="text-xs font-semibold text-stone-700">{opt.label}</p>
                  {opt.sub && <p className="text-[10px] text-stone-400 mt-0.5">{opt.sub}</p>}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            {[
              { k: "isActive", label: "نشط" },
              { k: "featured", label: "مميز" },
            ].map(({ k, label }) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600">
                <div
                  onClick={() => setForm({ ...form, [k]: !(form as any)[k] })}
                  className={`w-9 h-5 rounded-full transition-colors ${(form as any)[k] ? "bg-[#1F3929]" : "bg-stone-200"} relative`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${(form as any)[k] ? "translate-x-0.5" : "translate-x-4"}`} />
                </div>
                {label}
              </label>
            ))}
          </div>

          {/* Images */}
          <div>
            <label className={labelCls}>الصور</label>
            {form.existingImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.existingImages.map((url: string) => (
                  <div key={url} className="relative w-16 h-16">
                    <img src={url} className="w-full h-full object-cover rounded-lg border border-stone-100" alt="" onError={e => { (e.target as any).style.display = "none"; }} />
                    <button type="button"
                      onClick={() => setForm(f => ({ ...f, existingImages: f.existingImages.filter((i: string) => i !== url) }))}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full h-10 rounded-lg border border-dashed border-stone-200 text-xs text-stone-400 hover:border-[#9BA17B] hover:text-[#9BA17B] transition-colors flex items-center justify-center gap-2">
              <Upload size={13} />
              {files.length ? `${files.length} صورة محددة` : "اضغط لرفع صور"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => setFiles(Array.from(e.target.files || []))} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50">إلغاء</button>
            <button type="submit" disabled={loading}
              className="flex-1 h-10 rounded-xl bg-[#1F3929] text-[#F2EADB] text-sm hover:bg-[#16281D] disabled:opacity-60">
              {loading ? "جاري الحفظ..." : mode === "add" ? "إضافة المنتج" : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Orders ─── */
function AdminOrders() {
  const { data: orders = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: () => api.get("/admin/orders") });
  const qc = useQueryClient();
  const [selected, setSelected] = useState<any>(null);

  const upd = useMutation({
    mutationFn: ({ id, status }: any) => api.put(`/admin/orders/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
  });
  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/orders/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); setSelected(null); },
  });

  const revenue = orders.filter((o: any) => o.status !== "cancelled").reduce((s: number, o: any) => s + (o.total || 0), 0);
  const pending = orders.filter((o: any) => o.status === "pending").length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="إجمالي الطلبات" value={orders.length} icon={<ShoppingBag size={18} />} />
        <StatCard label="معلقة" value={pending} icon={<TrendingUp size={18} />} />
        <StatCard label="الإيرادات" value={revenue.toFixed(0) + " ر.س"} icon={<TrendingUp size={18} />} />
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50">
          <h3 className="text-sm font-semibold text-stone-700">الطلبات ({orders.length})</h3>
        </div>
        <div className="divide-y divide-stone-50">
          {orders.map((o: any) => (
            <div key={o._id}
              onClick={() => setSelected(o)}
              className={`px-5 py-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 transition-colors ${selected?._id === o._id ? "bg-stone-50" : ""}`}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800">{o.orderNumber}</p>
                <p className="text-xs text-stone-400 truncate mt-0.5">{o.customer?.name} — {o.customer?.phone}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold text-[#1F3929]">{o.total?.toFixed(0)} ر.س</span>
                <select
                  value={o.status}
                  onClick={e => e.stopPropagation()}
                  onChange={e => upd.mutate({ id: o._id, status: e.target.value })}
                  className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 bg-white outline-none cursor-pointer"
                  style={{ fontFamily: "inherit" }}>
                  {Object.entries(STATUS_AR).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="py-16 text-center text-stone-400">
              <ShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">لا توجد طلبات بعد</p>
            </div>
          )}
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="text-sm font-bold text-stone-800">{selected.orderNumber}</h3>
                <p className="text-xs text-stone-400 mt-0.5">{new Date(selected.createdAt).toLocaleDateString("ar-SA")}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400"><X size={17} /></button>
            </div>
            <div className="p-5 space-y-5">
              {/* Customer */}
              <div>
                <p className="text-xs text-stone-400 mb-2 uppercase tracking-wider">العميل</p>
                <p className="text-sm font-medium text-stone-700">{selected.customer?.name}</p>
                <p className="text-sm text-[#9BA17B]">{selected.customer?.phone}</p>
                {selected.customer?.email && <p className="text-xs text-stone-400">{selected.customer.email}</p>}
              </div>

              {/* Address */}
              <div>
                <p className="text-xs text-stone-400 mb-2 uppercase tracking-wider">عنوان التوصيل</p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {selected.address?.city} — {selected.address?.district}<br />
                  {selected.address?.street}
                  {selected.address?.notes && <><br /><span className="text-stone-400">{selected.address.notes}</span></>}
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-stone-400 mb-2 uppercase tracking-wider">المنتجات</p>
                <div className="space-y-0 divide-y divide-stone-50 rounded-xl border border-stone-100 overflow-hidden">
                  {selected.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center px-4 py-3">
                      <span className="text-sm text-stone-700">{item.name} × {item.qty}</span>
                      <span className="text-sm font-semibold text-[#1F3929]">{(item.price * item.qty).toFixed(0)} ر.س</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-3 bg-stone-50">
                    <span className="text-sm font-bold text-stone-800">الإجمالي</span>
                    <span className="text-sm font-bold text-[#1F3929]">{selected.total?.toFixed(0)} ر.س</span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400 mb-1 uppercase tracking-wider">طريقة الدفع</p>
                  <p className="text-sm text-stone-700">{selected.paymentMethod === "cod" ? "الدفع عند الاستلام" : selected.paymentMethod}</p>
                </div>
                <button
                  onClick={() => { if (confirm("حذف الطلب نهائياً؟")) del.mutate(selected._id); }}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-colors">
                  <Trash2 size={13} /> حذف الطلب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Customers & Employees ─── */
function AdminCustomers() {
  const qc = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "employee">("all");
  const [selected, setSelected] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const { data: customers = [] } = useQuery({
    queryKey: ["admin-customers", roleFilter],
    queryFn: () => api.get(`/admin/customers${roleFilter !== "all" ? `?role=${roleFilter}` : ""}`),
  });

  const upd = useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/admin/customers/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-customers"] }); setSelected(null); },
  });
  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/customers/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-customers"] }); setSelected(null); },
  });

  const counts = {
    all: (customers as any[]).length,
    customer: (customers as any[]).filter((c: any) => c.role === "customer").length,
    employee: (customers as any[]).filter((c: any) => c.role === "employee").length,
  };

  const ROLE_AR: Record<string, string> = { customer: "عميل", employee: "موظف", admin: "مدير" };
  const ROLE_COLOR: Record<string, string> = {
    customer: "bg-blue-50 text-blue-700 border-blue-200",
    employee: "bg-emerald-50 text-emerald-700 border-emerald-200",
    admin: "bg-violet-50 text-violet-700 border-violet-200",
  };
  const TIER_AR: Record<string, string> = { bronze: "برونزي", silver: "فضي", gold: "ذهبي", platinum: "بلاتيني" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-stone-800">العملاء والموظفون</h2>
          <p className="text-xs text-stone-400 mt-0.5">{counts.customer} عميل · {counts.employee} موظف</p>
        </div>
        <div className="flex gap-2">
          {(["all", "customer", "employee"] as const).map(r => (
            <button key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${roleFilter === r ? "bg-[#1F3929] text-[#F2EADB]" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"}`}>
              {r === "all" ? "الكل" : r === "customer" ? "العملاء" : "الموظفون"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-stone-50">
          {(customers as any[]).length === 0 && (
            <div className="py-16 text-center text-stone-400">
              <Users size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">لا يوجد مستخدمون</p>
            </div>
          )}
          {(customers as any[]).map((c: any) => (
            <div key={c._id}
              onClick={() => setSelected(c)}
              className="px-5 py-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-stone-800 truncate">{c.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLOR[c.role] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {ROLE_AR[c.role] || c.role}
                  </span>
                </div>
                <p className="text-xs text-stone-400 truncate mt-0.5" dir="ltr">{c.phone}{c.email ? ` · ${c.email}` : ""}</p>
                {c.jobTitle && <p className="text-xs text-stone-400">{c.jobTitle}</p>}
              </div>
              <div className="shrink-0 text-left">
                <p className="text-xs text-[#9BA17B]">{c.loyaltyPoints || 0} نقطة</p>
                <p className="text-xs text-stone-400">{TIER_AR[c.loyaltyTier] || ""}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="text-sm font-bold text-stone-800">{selected.name}</h3>
                <p className="text-xs text-stone-400 mt-0.5">{selected.phone}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400"><X size={17} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["البريد", selected.email || "—"],
                  ["نقاط الولاء", selected.loyaltyPoints || 0],
                  ["المستوى", TIER_AR[selected.loyaltyTier] || "—"],
                  ["إجمالي المشتريات", `${selected.totalSpent?.toFixed(0) || 0} ر.س`],
                ].map(([k, v]) => (
                  <div key={k as string} className="bg-stone-50 rounded-lg p-3">
                    <p className="text-xs text-stone-400">{k}</p>
                    <p className="text-sm font-semibold text-stone-700 mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1.5">الدور الوظيفي</label>
                <select
                  defaultValue={selected.role}
                  id={`role-${selected._id}`}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 text-sm bg-stone-50 outline-none"
                  style={{ fontFamily: "inherit" }}>
                  <option value="customer">عميل</option>
                  <option value="employee">موظف</option>
                  <option value="admin">مدير</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    const sel = document.getElementById(`role-${selected._id}`) as HTMLSelectElement;
                    upd.mutate({ id: selected._id, role: sel?.value || selected.role });
                  }}
                  disabled={upd.isPending}
                  className="flex-1 h-10 rounded-xl bg-[#1F3929] text-[#F2EADB] text-sm hover:bg-[#16281D] disabled:opacity-60">
                  {upd.isPending ? "جاري..." : "حفظ التعديلات"}
                </button>
                <button
                  onClick={() => { if (confirm(`حذف ${selected.name}؟`)) del.mutate(selected._id); }}
                  className="h-10 px-4 rounded-xl bg-red-50 text-red-500 text-sm hover:bg-red-100">
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Settings ─── */
function AdminSettings() {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: () => api.get("/admin/settings") });
  const { data: newsletter } = useQuery({ queryKey: ["admin-newsletter"], queryFn: () => api.get("/admin/newsletter") });
  const [form, setForm] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const DEFAULT_BADGES = [
    { icon: "🚚", title: "يوصلك خلال", value: "١–٣ أيام",   enabled: true },
    { icon: "🔒", title: "الدفع",       value: "آمن ومشفّر", enabled: true },
    { icon: "↩️",  title: "الاسترجاع",  value: "يوم واحد",   enabled: true },
  ];

  const defaults = {
    storeName: "UJI MATCHA",
    storePhone: "0552469643",
    storeEmail: "info@qirox.online",
    whatsapp: "966552469643",
    shippingFee: 30,
    shippingFreeThreshold: 200,
    maintenanceMode: false,
    trustBadges: DEFAULT_BADGES,
    trustBadgesPosition: "above" as "above" | "below" | "both",
  };

  const current = form || (settings ? { ...defaults, ...settings } : defaults);

  const save = useMutation({
    mutationFn: (data: any) => api.put("/admin/settings", data),
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const inputCls = "w-full h-10 px-3 rounded-lg border border-stone-200 text-sm bg-stone-50 outline-none focus:border-[#9BA17B] transition-colors";
  const labelCls = "block text-xs text-stone-500 mb-1.5";

  if (isLoading) return <div className="text-center py-12 text-stone-400 text-sm">جاري التحميل...</div>;

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-stone-800">إعدادات المتجر</h2>
        <p className="text-xs text-stone-400 mt-0.5">تحكم في معلومات وإعدادات المتجر</p>
      </div>

      {/* Store info */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center"><Settings2 size={15} className="text-stone-500" /></div>
          <p className="text-sm font-semibold text-stone-700">معلومات المتجر</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {[
            { label: "اسم المتجر", k: "storeName" },
            { label: "رقم التواصل", k: "storePhone" },
            { label: "البريد الإلكتروني", k: "storeEmail" },
            { label: "واتساب (مع رمز الدولة)", k: "whatsapp" },
          ].map(({ label, k }) => (
            <div key={k}>
              <label className={labelCls}>{label}</label>
              <input className={inputCls} value={current[k] ?? ""} onChange={e => setForm({ ...current, [k]: e.target.value })} style={{ fontFamily: "inherit" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center"><ShoppingBag size={15} className="text-stone-500" /></div>
          <p className="text-sm font-semibold text-stone-700">إعدادات الشحن</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>رسوم الشحن (ر.س)</label>
            <input type="number" className={inputCls} value={current.shippingFee} onChange={e => setForm({ ...current, shippingFee: Number(e.target.value) })} min={0} style={{ fontFamily: "inherit" }} />
          </div>
          <div>
            <label className={labelCls}>حد الشحن المجاني (ر.س)</label>
            <input type="number" className={inputCls} value={current.shippingFreeThreshold} onChange={e => setForm({ ...current, shippingFreeThreshold: Number(e.target.value) })} min={0} style={{ fontFamily: "inherit" }} />
          </div>
        </div>
        <p className="px-5 pb-4 text-xs text-stone-400">الطلبات التي تتجاوز {current.shippingFreeThreshold} ر.س تحصل على شحن مجاني</p>
      </div>

      {/* Trust Badges */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-base">✦</div>
          <div>
            <p className="text-sm font-semibold text-stone-700">شريط الثقة</p>
            <p className="text-xs text-stone-400 mt-0.5">الأيقونات التي تظهر للعملاء (التوصيل · الدفع · الاسترجاع)</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {/* Position */}
          <div>
            <label className={labelCls}>موضع الشريط في الصفحة الرئيسية</label>
            <select
              className={inputCls}
              value={current.trustBadgesPosition ?? "above"}
              onChange={e => setForm({ ...current, trustBadgesPosition: e.target.value })}
              style={{ fontFamily: "inherit" }}>
              <option value="above">فوق المنتجات</option>
              <option value="below">تحت المنتجات</option>
              <option value="both">فوق وتحت المنتجات</option>
            </select>
          </div>
          {/* Badges */}
          <div className="space-y-3">
            {(current.trustBadges ?? DEFAULT_BADGES).map((b: any, i: number) => {
              const badges: any[] = current.trustBadges ?? DEFAULT_BADGES;
              const upd = (field: string, val: any) => {
                const next = badges.map((x, j) => j === i ? { ...x, [field]: val } : x);
                setForm({ ...current, trustBadges: next });
              };
              return (
                <div key={i} className="border border-stone-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-700">بطاقة {i + 1}</span>
                    <button
                      onClick={() => upd("enabled", !b.enabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${b.enabled ? "bg-[#1F3929]" : "bg-stone-200"}`}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${b.enabled ? "translate-x-4" : "translate-x-1"}`} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className={labelCls}>الأيقونة (إيموجي)</label>
                      <input className={inputCls + " text-center text-xl"} value={b.icon} onChange={e => upd("icon", e.target.value)} maxLength={4} />
                    </div>
                    <div>
                      <label className={labelCls}>العنوان</label>
                      <input className={inputCls} value={b.title} onChange={e => upd("title", e.target.value)} style={{ fontFamily: "inherit" }} />
                    </div>
                    <div>
                      <label className={labelCls}>القيمة</label>
                      <input className={inputCls} value={b.value} onChange={e => upd("value", e.target.value)} style={{ fontFamily: "inherit" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Add badge */}
          <button
            onClick={() => {
              const badges: any[] = current.trustBadges ?? DEFAULT_BADGES;
              setForm({ ...current, trustBadges: [...badges, { icon: "⭐", title: "عنوان", value: "قيمة", enabled: true }] });
            }}
            className="w-full h-10 rounded-xl border border-dashed border-stone-200 text-stone-400 text-sm hover:border-[#9BA17B] hover:text-[#9BA17B] transition-colors">
            + إضافة بطاقة
          </button>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center"><Mail size={15} className="text-stone-500" /></div>
          <p className="text-sm font-semibold text-stone-700">النشرة البريدية</p>
        </div>
        <div className="p-5 flex items-center gap-4">
          <div className="text-3xl font-bold text-[#1F3929]">{newsletter?.count || 0}</div>
          <div>
            <p className="text-sm text-stone-600">مشترك</p>
            <p className="text-xs text-stone-400">في النشرة البريدية</p>
          </div>
        </div>
      </div>

      {/* Geidea */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center">💳</div>
          <div>
            <p className="text-sm font-semibold text-stone-700">بوابة الدفع — Geidea</p>
            <p className="text-xs text-stone-400 mt-0.5">
              {(settings as any)?._geideaEnabled ? "✅ مفعّلة" : "⚠️ غير مفعّلة — أضف GEIDEA_MERCHANT_KEY و GEIDEA_API_PASSWORD في متغيرات البيئة"}
            </p>
          </div>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {[
            { label: "Merchant Key", k: "geideaMerchantKey", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx" },
            { label: "API Base URL (اختياري)", k: "geideaApiBase", placeholder: "https://api.geidea.net" },
          ].map(({ label, k, placeholder }) => (
            <div key={k}>
              <label className={labelCls}>{label}</label>
              <input className={inputCls} value={(current as any)[k] ?? ""} onChange={e => setForm({ ...current, [k]: e.target.value })} placeholder={placeholder} style={{ fontFamily: "monospace" }} />
            </div>
          ))}
        </div>
        <p className="px-5 pb-4 text-xs text-stone-400">
          API Password يُضاف كـ Secret في Replit باسم <code>GEIDEA_API_PASSWORD</code> — لا تُدخله هنا.
        </p>
      </div>

      {/* Seed Product */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center">🍵</div>
          <div>
            <p className="text-sm font-semibold text-stone-700">تهيئة المنتجات</p>
            <p className="text-xs text-stone-400 mt-0.5">حذف جميع المنتجات وإضافة كيس الماتشا</p>
          </div>
        </div>
        <div className="p-5">
          <button
            onClick={async () => {
              if (!confirm("سيتم حذف جميع المنتجات الحالية وإضافة كيس الماتشا فقط. هل تريد المتابعة؟")) return;
              try {
                await api.post("/admin/seed-matcha-bag", {});
                alert("✅ تم إضافة كيس الماتشا بنجاح");
              } catch (e: any) { alert("خطأ: " + e.message); }
            }}
            className="h-10 px-5 rounded-xl bg-amber-600 text-white text-sm hover:bg-amber-700 transition-colors">
            🍃 تهيئة كيس الماتشا
          </button>
        </div>
      </div>

      {/* Maintenance */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center"><Settings2 size={15} className="text-stone-500" /></div>
          <p className="text-sm font-semibold text-stone-700">وضع الصيانة</p>
        </div>
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-700">تعطيل المتجر مؤقتاً</p>
            <p className="text-xs text-stone-400 mt-0.5">عند التفعيل، يرى الزوار صفحة "تحت الصيانة"</p>
          </div>
          <div
            onClick={() => setForm({ ...current, maintenanceMode: !current.maintenanceMode })}
            className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${current.maintenanceMode ? "bg-[#1F3929]" : "bg-stone-200"}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${current.maintenanceMode ? "translate-x-1" : "translate-x-7"}`} />
          </div>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={() => save.mutate(current)}
        disabled={save.isPending}
        className="w-full h-11 rounded-xl bg-[#1F3929] text-[#F2EADB] text-sm flex items-center justify-center gap-2 hover:bg-[#16281D] transition-colors disabled:opacity-60">
        {save.isPending ? "جاري الحفظ..." : saved ? <><Check size={16} /> تم الحفظ بنجاح</> : "حفظ الإعدادات"}
      </button>
    </div>
  );
}
