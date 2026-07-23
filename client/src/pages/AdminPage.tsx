import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  X, Plus, Pencil, Trash2, Package, ShoppingBag,
  Settings2, Mail, LogOut, Upload, LayoutDashboard,
  TrendingUp, Users, ChevronDown, Check, Menu, Tag,
  Star, CreditCard, MapPin, Banknote, Truck, Eye,
  BarChart2, UserCheck, Shield, Receipt, CheckCircle2,
  XCircle, Clock, AlertCircle, ExternalLink, RefreshCw,
  FileText, WalletCards, Megaphone, Search, Send, CalendarDays,
} from "lucide-react";
import PhoneInput, { COUNTRIES, type Country } from "../components/PhoneInput";

type Tab = "dashboard" | "analytics" | "finance" | "invoices" | "quotes" | "products" | "orders" | "employees" | "customers" | "coupons" | "reviews" | "marketing" | "seo" | "settings";
const ADMIN_PHONE = "0552469643";

const STATUS_AR: Record<string, string> = {
  pending: "معلق", pending_payment: "بانتظار الدفع",
  confirmed: "مؤكد", shipped: "جاري الشحن",
  delivered: "تم التسليم", cancelled: "ملغي",
};
const STATUS_COLOR: Record<string, string> = {
  pending:         "bg-amber-50 text-amber-700 border-amber-200",
  pending_payment: "bg-orange-50 text-orange-700 border-orange-200",
  confirmed:       "bg-blue-50 text-blue-700 border-blue-200",
  shipped:         "bg-violet-50 text-violet-700 border-violet-200",
  delivered:       "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:       "bg-red-50 text-red-700 border-red-200",
};
const RECEIPT_COLOR: Record<string, string> = {
  none:     "bg-stone-50 text-stone-400 border-stone-200",
  pending:  "bg-yellow-50 text-yellow-700 border-yellow-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};
const RECEIPT_AR: Record<string, string> = {
  none: "—", pending: "إيصال بانتظار المراجعة",
  approved: "إيصال مقبول", rejected: "إيصال مرفوض",
};

const PERMISSIONS_LIST = [
  { key: "manage_orders",    label: "إدارة الطلبات",    icon: <ShoppingBag size={13} /> },
  { key: "manage_products",  label: "إدارة المنتجات",   icon: <Package size={13} /> },
  { key: "manage_customers", label: "إدارة العملاء",    icon: <Users size={13} /> },
  { key: "manage_coupons",   label: "إدارة الكوبونات",  icon: <Tag size={13} /> },
  { key: "manage_reviews",   label: "مراجعة التقييمات", icon: <Star size={13} /> },
  { key: "view_analytics",   label: "عرض التحليلات",    icon: <BarChart2 size={13} /> },
  { key: "manage_finance",   label: "إدارة المالية",    icon: <WalletCards size={13} /> },
  { key: "manage_invoices",  label: "إدارة الفواتير",   icon: <FileText size={13} /> },
  { key: "manage_quotes",    label: "عروض الأسعار",     icon: <Receipt size={13} /> },
  { key: "manage_marketing", label: "إدارة التسويق",    icon: <Megaphone size={13} /> },
  { key: "manage_seo",       label: "SEO / AEO",        icon: <Search size={13} /> },
  { key: "manage_settings",  label: "إدارة الإعدادات",  icon: <Settings2 size={13} /> },
];

function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLOR[status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
      {STATUS_AR[status] || status}
    </span>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? "bg-[#1F3929]" : "bg-stone-200"}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-1"}`} />
    </button>
  );
}

function StatCard({ label, value, icon, sub, color }: { label: string; value: string | number; icon: React.ReactNode; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 flex items-start gap-4 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color || "text-[#1F3929]"}`}
        style={{ background: color ? undefined : "rgba(31,57,41,0.08)" }}>
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
    catch { setError("بيانات غير صحيحة"); }
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
        <div className="text-center mb-8">
          <img src="/assets/brand/uji-logo-forest-green-transparent.png" alt="UJI" className="h-14 mx-auto mb-3 object-contain" />
          <p className="text-xs tracking-[0.3em] text-[#9BA17B] uppercase font-light">Admin Panel</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="bg-[#1F3929] px-6 py-5">
            <h1 className="text-[#F2EADB] font-light text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {setupMode ? "إعداد حساب المدير" : "مرحباً بعودتك"}
            </h1>
            <p className="text-[#9BA17B] text-xs mt-0.5">{setupMode ? "أنشئ كلمة مرور للمرة الأولى" : "سجّل دخولك للوحة الإدارة"}</p>
          </div>
          <div className="p-6">
            {!setupMode ? (
              <form onSubmit={doLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs tracking-widest text-[#9BA17B] uppercase mb-2">رقم الجوال</label>
                  <PhoneInput theme="light" value={phone} onChange={(num, c) => { setPhone(num); setCountry(c); }}
                    countryCode={country.code} onCountryChange={setCountry} style={{ height: 44, border: "1px solid #e7e5e4", borderRadius: 8 }} />
                </div>
                <div>
                  <label className="block text-xs tracking-widest text-[#9BA17B] uppercase mb-2">كلمة المرور</label>
                  <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"
                    className="w-full h-11 px-3 rounded-lg border border-stone-200 text-sm bg-stone-50 outline-none focus:border-[#9BA17B]" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={loading}
                  className="h-11 rounded-lg bg-[#1F3929] text-[#F2EADB] text-sm tracking-widest uppercase font-light hover:opacity-90 disabled:opacity-60">
                  {loading ? "جاري الدخول..." : "دخول"}
                </button>
                <button type="button" onClick={() => setSetupMode(true)} className="text-xs text-stone-400 hover:text-stone-600 underline text-center">
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
                    className="w-full h-11 px-3 rounded-lg border border-stone-200 text-sm bg-stone-50 outline-none focus:border-[#9BA17B]" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={loading}
                  className="h-11 rounded-lg bg-[#1F3929] text-[#F2EADB] text-sm tracking-widest uppercase font-light hover:opacity-90 disabled:opacity-60">
                  {loading ? "جاري الحفظ..." : "حفظ"}
                </button>
                <button type="button" onClick={() => setSetupMode(false)} className="text-xs text-stone-400 text-center">← رجوع</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ active, icon, label, onClick, badge }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void; badge?: number }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${active ? "bg-[#1F3929] text-[#F2EADB] shadow-sm" : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"}`}>
      <span className="shrink-0">{icon}</span>
      <span className="flex-1 text-right">{label}</span>
      {badge ? <span className="bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center shrink-0">{badge > 9 ? "9+" : badge}</span> : null}
    </button>
  );
}

/* ─── Main Shell ─── */
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

  const { data: visitorData } = useQuery({
    queryKey: ["admin-visitors"],
    queryFn: () => api.get("/admin/visitors"),
    refetchInterval: 30_000,
    enabled: !!(me || authed),
  });

  const { data: statsData } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats"),
    refetchInterval: 60_000,
    enabled: !!(me || authed),
  });

  const pendingReceipts = (statsData as any)?.pendingReceipts || 0;

  if (isLoading) return (
    <div className="min-h-screen bg-[#F2EADB] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#1F3929] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!me && !authed) return <LoginScreen onLogin={() => { setAuthed(true); qc.invalidateQueries({ queryKey: ["me"] }); }} />;
  const isAdmin = (me as any)?.phone === ADMIN_PHONE || (me as any)?.role === "admin" || (me as any)?.role === "employee";
  if (!isAdmin) return <LoginScreen onLogin={() => { setAuthed(true); qc.invalidateQueries({ queryKey: ["me"] }); }} />;

  const allNav = [
    { key: "dashboard"  as Tab, label: "لوحة التحكم",       icon: <LayoutDashboard size={16} /> },
    { key: "analytics"  as Tab, label: "تقرير المبيعات",     icon: <BarChart2 size={16} />, permission: "view_analytics" },
    { key: "finance"    as Tab, label: "نظرة مالية",         icon: <WalletCards size={16} />, permission: "manage_finance" },
    { key: "invoices"   as Tab, label: "الفواتير",            icon: <FileText size={16} />, permission: "manage_invoices" },
    { key: "quotes"     as Tab, label: "عروض الأسعار",        icon: <Receipt size={16} />, permission: "manage_quotes" },
    { key: "products"   as Tab, label: "المنتجات",           icon: <Package size={16} />, permission: "manage_products" },
    { key: "orders"     as Tab, label: "الطلبات",            icon: <ShoppingBag size={16} />, badge: pendingReceipts, permission: "manage_orders" },
    { key: "employees"  as Tab, label: "الموظفون",           icon: <UserCheck size={16} />, permission: "manage_employees" },
    { key: "customers"  as Tab, label: "قاعدة العملاء",       icon: <Users size={16} />, permission: "manage_customers" },
    { key: "coupons"    as Tab, label: "كوبونات الخصم",       icon: <Tag size={16} />, permission: "manage_coupons" },
    { key: "reviews"    as Tab, label: "تقييمات العملاء",     icon: <Star size={16} />, permission: "manage_reviews" },
    { key: "marketing"  as Tab, label: "التسويق والرسائل",    icon: <Megaphone size={16} />, permission: "manage_marketing" },
    { key: "seo"       as Tab, label: "SEO / AEO",            icon: <Search size={16} />, permission: "manage_seo" },
    { key: "settings"   as Tab, label: "الإعدادات",            icon: <Settings2 size={16} />, permission: "manage_settings" },
  ];
  const isFullAdmin = (me as any)?.phone === ADMIN_PHONE || (me as any)?.role === "admin";
  const NAV = allNav.filter(n => isFullAdmin || !n.permission || (me as any)?.permissions?.includes(n.permission));

  const logout = () => { api.post("/auth/logout", {}); window.location.href = "/"; };
  const visitors = (visitorData as any)?.count ?? 0;

  return (
    <div className="min-h-screen bg-stone-50 flex" dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif" }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-l border-stone-100 min-h-screen sticky top-0 h-screen shrink-0">
        <div className="px-5 py-5 border-b border-stone-100">
          <img src="/assets/brand/uji-logo-forest-green-transparent.png" alt="UJI" className="h-9 object-contain" />
          <p className="text-[10px] tracking-[0.22em] text-[#9BA17B] uppercase mt-1.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(n => (
            <NavItem key={n.key} active={tab === n.key} icon={n.icon} label={n.label} badge={n.badge} onClick={() => setTab(n.key)} />
          ))}
        </nav>
        <div className="p-3 border-t border-stone-100">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            <LogOut size={16} /><span>تسجيل الخروج</span>
          </button>
          <a href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:bg-stone-100 hover:text-stone-700 mt-1">
            <span>← العودة للمتجر</span>
          </a>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-64 bg-white flex flex-col">
            <div className="px-5 py-5 border-b border-stone-100 flex items-center justify-between">
              <img src="/assets/brand/uji-logo-forest-green-transparent.png" alt="UJI" className="h-8 object-contain" />
              <button onClick={() => setSidebarOpen(false)} className="text-stone-400"><X size={20} /></button>
            </div>
            <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
              {NAV.map(n => (
                <NavItem key={n.key} active={tab === n.key} icon={n.icon} label={n.label} badge={n.badge}
                  onClick={() => { setTab(n.key); setSidebarOpen(false); }} />
              ))}
            </nav>
            <div className="p-3 border-t border-stone-100">
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:bg-red-50 hover:text-red-500">
                <LogOut size={16} /><span>تسجيل الخروج</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-stone-100 px-5 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-stone-100">
            <Menu size={20} className="text-stone-500" />
          </button>
          <div className="hidden lg:block">
            <h2 className="text-sm font-semibold text-stone-700">{NAV.find(n => n.key === tab)?.label}</h2>
          </div>
          <div className="flex items-center gap-3 lg:mr-auto">
            {/* Live visitors */}
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              {visitors} زائر الآن
            </div>
            {pendingReceipts > 0 && (
              <button onClick={() => setTab("orders")}
                className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 hover:bg-amber-100 transition-colors">
                <Receipt size={12} />
                {pendingReceipts} إيصال بانتظار المراجعة
              </button>
            )}
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
              <Shield size={12} />
              مدير
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {tab === "dashboard"  && <AdminDashboard onNavigate={setTab} stats={statsData} visitors={visitors} />}
          {tab === "analytics"  && <AdminAnalytics stats={statsData} />}
          {tab === "finance"    && <AdminFinance stats={statsData} />}
          {tab === "invoices"   && <AdminInvoices />}
          {tab === "quotes"     && <AdminQuotes />}
          {tab === "products"   && <AdminProducts />}
          {tab === "orders"     && <AdminOrders />}
          {tab === "employees"  && <AdminEmployees />}
          {tab === "customers"  && <AdminCustomers />}
          {tab === "coupons"    && <AdminCoupons />}
          {tab === "reviews"    && <AdminReviews />}
          {tab === "marketing"  && <AdminMarketing />}
          {tab === "seo"        && <AdminSEO />}
          {tab === "settings"   && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}

/* ─── Dashboard ─── */
function AdminDashboard({ onNavigate, stats, visitors }: { onNavigate: (t: Tab) => void; stats: any; visitors: number }) {
  const { data: products = [] } = useQuery({ queryKey: ["admin-products"], queryFn: () => api.get("/admin/products") });
  const { data: orders = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: () => api.get("/admin/orders") });

  const pending = (orders as any[]).filter((o: any) => o.status === "pending").length;
  const pendingReceipts = (orders as any[]).filter((o: any) => (o as any).receiptStatus === "pending").length;
  const recentOrders = [...(orders as any[])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  const revenue = stats?.totalRevenue || 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-l from-[#1F3929] to-[#16281D] rounded-2xl p-6 text-white">
        <p className="text-[#9BA17B] text-xs tracking-widest uppercase mb-1">UJI MATCHA — ADMIN</p>
        <h1 className="text-2xl font-light" style={{ fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif" }}>مرحباً بك في لوحة التحكم</h1>
        <p className="text-[#9BA17B] text-sm mt-1">إدارة متجرك من مكان واحد.</p>
      </div>

      {/* Alerts */}
      {pendingReceipts > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Receipt size={18} className="text-amber-600" />
            <p className="text-sm text-amber-800 font-medium">{pendingReceipts} إيصال دفع بانتظار مراجعتك</p>
          </div>
          <button onClick={() => onNavigate("orders")} className="text-xs text-amber-700 font-semibold hover:text-amber-900">مراجعة الآن ←</button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إجمالي الطلبات" value={(orders as any[]).length} icon={<ShoppingBag size={18} />} />
        <StatCard label="طلبات معلقة" value={pending} icon={<Clock size={18} />} sub="تحتاج مراجعة" />
        <StatCard label="الإيرادات الكلية" value={revenue.toFixed(0) + " ر.س"} icon={<TrendingUp size={18} />} />
        <StatCard label="زوار الآن" value={visitors} icon={<Eye size={18} />} sub="آخر 5 دقائق" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-700">آخر الطلبات</h3>
            <button onClick={() => onNavigate("orders")} className="text-xs text-[#9BA17B] hover:text-[#1F3929]">عرض الكل →</button>
          </div>
          <div className="divide-y divide-stone-50">
            {recentOrders.length === 0 && <p className="text-center text-stone-400 py-8 text-sm">لا توجد طلبات بعد</p>}
            {recentOrders.map((o: any) => (
              <div key={o._id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-stone-700 truncate">{o.orderNumber}</p>
                  <p className="text-xs text-stone-400 truncate">{o.customer?.name}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {o.receiptStatus === "pending" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      <Receipt size={9} /> إيصال
                    </span>
                  )}
                  <span className="text-sm font-semibold text-[#1F3929]">{o.total?.toFixed(0)} ر.س</span>
                  <Badge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">إجراءات سريعة</h3>
          {[
            { tab: "products" as Tab,  icon: <Package size={18} />,     label: "إدارة المنتجات",   sub: `${(products as any[]).length} منتج` },
            { tab: "analytics" as Tab, icon: <BarChart2 size={18} />,   label: "عرض التحليلات",    sub: `${stats?.thisMonthRev?.toFixed(0) || 0} ر.س هذا الشهر` },
            { tab: "employees" as Tab, icon: <UserCheck size={18} />,   label: "إدارة الموظفين",   sub: `${stats?.totalEmployees || 0} موظف` },
            { tab: "coupons" as Tab,   icon: <Tag size={18} />,         label: "كوبونات الخصم",    sub: "إضافة وإدارة الكوبونات" },
          ].map(({ tab: t, icon, label, sub }) => (
            <button key={t} onClick={() => onNavigate(t)}
              className="w-full bg-white rounded-xl border border-stone-100 px-4 py-3 text-right hover:border-[#9BA17B] transition-colors flex items-center gap-4">
              <span className="text-[#1F3929]">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-stone-700">{label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Analytics ─── */
function AdminAnalytics({ stats }: { stats: any }) {
  const { data: orders = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: () => api.get("/admin/orders") });

  const dailyRevenue: Record<string, number> = stats?.dailyRevenue || {};
  const byStatus: Record<string, number> = stats?.byStatus || {};
  const thisMonth = stats?.thisMonthRev || 0;
  const lastMonth = stats?.lastMonthRev || 0;
  const growth = lastMonth > 0 ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1) : "—";

  // Last 7 days from dailyRevenue
  const last7: { date: string; rev: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
    last7.push({ date: d, rev: dailyRevenue[d] || 0 });
  }
  const maxRev = Math.max(...last7.map(d => d.rev), 1);

  // Top payment methods
  const pmCounts: Record<string, number> = {};
  (orders as any[]).forEach((o: any) => { pmCounts[o.paymentMethod] = (pmCounts[o.paymentMethod] || 0) + 1; });

  const PM_AR: Record<string, string> = { cod: "الدفع عند الاستلام", bank: "تحويل بنكي", stcpay: "STC Pay", geidea: "بطاقة ائتمانية" };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-800">التحليلات</h2>
        <p className="text-xs text-stone-400 mt-0.5">نظرة شاملة على أداء المتجر</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إيرادات هذا الشهر" value={thisMonth.toFixed(0) + " ر.س"} icon={<TrendingUp size={18} />}
          sub={lastMonth > 0 ? `${growth}% مقارنة بالشهر الماضي` : undefined} />
        <StatCard label="إيرادات الشهر الماضي" value={lastMonth.toFixed(0) + " ر.س"} icon={<BarChart2 size={18} />} />
        <StatCard label="إجمالي الطلبات" value={stats?.totalOrders || 0} icon={<ShoppingBag size={18} />} />
        <StatCard label="إجمالي العملاء" value={stats?.totalCustomers || 0} icon={<Users size={18} />} />
      </div>

      {/* 7-day revenue chart */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-stone-700 mb-5">الإيرادات — آخر 7 أيام</h3>
        <div className="flex items-end gap-2 h-40">
          {last7.map(d => {
            const pct = maxRev > 0 ? (d.rev / maxRev) * 100 : 0;
            const shortDate = d.date.slice(5); // MM-DD
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-[10px] text-stone-400 font-mono">{d.rev > 0 ? d.rev.toFixed(0) : ""}</p>
                <div className="w-full flex items-end justify-center" style={{ height: 100 }}>
                  <div
                    className="w-full rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${Math.max(pct, d.rev > 0 ? 4 : 2)}%`,
                      background: d.rev > 0 ? "#1F3929" : "#e7e5e4",
                    }}
                  />
                </div>
                <p className="text-[10px] text-stone-400">{shortDate}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">الطلبات حسب الحالة</h3>
          <div className="space-y-3">
            {Object.entries(byStatus).sort((a, b) => b[1] - a[1]).map(([status, count]) => {
              const total = Object.values(byStatus).reduce((s, v) => s + v, 0) || 1;
              const pct = ((count / total) * 100).toFixed(0);
              return (
                <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600">{STATUS_AR[status] || status}</span>
                    <span className="font-semibold text-stone-700">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1F3929] rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(byStatus).length === 0 && <p className="text-sm text-stone-400 text-center py-4">لا توجد طلبات بعد</p>}
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">طرق الدفع الأكثر استخداماً</h3>
          <div className="space-y-3">
            {Object.entries(pmCounts).sort((a, b) => b[1] - a[1]).map(([pm, count]) => {
              const total = Object.values(pmCounts).reduce((s, v) => s + v, 0) || 1;
              const pct = ((count / total) * 100).toFixed(0);
              return (
                <div key={pm} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600">{PM_AR[pm] || pm}</span>
                    <span className="font-semibold text-stone-700">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#9BA17B] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(pmCounts).length === 0 && <p className="text-sm text-stone-400 text-center py-4">لا توجد بيانات</p>}
          </div>
        </div>
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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-stone-800">المنتجات</h2>
          <p className="text-xs text-stone-400 mt-0.5">{(products as any[]).length} منتج في المتجر</p>
        </div>
        <button onClick={() => { setEditing(null); setModal("add"); }}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#1F3929] text-[#F2EADB] text-sm hover:bg-[#16281D] transition-colors">
          <Plus size={15} /> منتج جديد
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {(products as any[]).map((p: any) => (
          <div key={p._id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-square bg-stone-50">
              <img src={p.images?.[0] || "https://via.placeholder.com/240"} className="w-full h-full object-cover" alt={p.name}
                onError={e => { (e.target as any).src = "https://via.placeholder.com/240"; }} />
              {!p.isActive && <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">مخفي</span>}
              {p.featured && <span className="absolute top-2 left-2 bg-[#1F3929] text-[#9BA17B] text-[10px] px-2 py-0.5 rounded-full">مميز</span>}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-stone-800 truncate">{p.name}</p>
              <p className="text-sm font-bold text-[#1F3929] mt-1">{p.price?.toFixed(2)} ر.س</p>
              <p className="text-xs text-stone-400 mt-0.5">المخزون: {p.stock}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setEditing(p); setModal("edit"); }}
                  className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-stone-200 text-xs text-stone-600 hover:bg-stone-50 transition-colors">
                  <Pencil size={11} /> تعديل
                </button>
                <button onClick={() => { if (confirm("حذف المنتج؟")) del.mutate(p._id); }}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {(products as any[]).length === 0 && (
          <div className="col-span-full py-16 text-center text-stone-400">
            <Package size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">لا توجد منتجات بعد</p>
          </div>
        )}
      </div>
      {modal && (
        <ProductModal mode={modal} product={editing} onClose={() => setModal(null)}
          onSaved={() => { setModal(null); qc.invalidateQueries({ queryKey: ["admin-products"] }); }} />
      )}
    </div>
  );
}

/* ─── Product Modal ─── */
function ProductModal({ mode, product, onClose, onSaved }: { mode: "add" | "edit"; product: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: product?.name || "", nameEn: product?.nameEn || "",
    description: product?.description || "", price: product?.price || "",
    comparePrice: product?.comparePrice || "", stock: product?.stock ?? 0,
    category: product?.category || "matcha", matchaType: product?.matchaType || "",
    isActive: product?.isActive ?? true, featured: product?.featured ?? false,
    sortOrder: product?.sortOrder ?? 0, existingImages: product?.images || [] as string[],
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

  const inp = "w-full h-10 px-3 rounded-lg border border-stone-200 text-sm bg-stone-50 outline-none focus:border-[#9BA17B] transition-colors";
  const lbl = "block text-xs text-stone-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-sm font-semibold text-stone-800">{mode === "add" ? "إضافة منتج جديد" : "تعديل المنتج"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400"><X size={17} /></button>
        </div>
        <form onSubmit={save} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>الاسم بالعربي *</label><input className={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label className={lbl}>الاسم بالإنجليزي</label><input className={inp} value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} /></div>
          </div>
          <div><label className={lbl}>الوصف</label><textarea className={inp + " !h-20 resize-none py-2"} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className={lbl}>السعر (ر.س) *</label><input type="number" className={inp} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required min={0} step="0.01" /></div>
            <div><label className={lbl}>السعر الأصلي</label><input type="number" className={inp} value={form.comparePrice} onChange={e => setForm({ ...form, comparePrice: e.target.value })} min={0} step="0.01" /></div>
            <div><label className={lbl}>المخزون</label><input type="number" className={inp} value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} min={0} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>الفئة</label>
              <select className={inp} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="matcha">ماتشا</option><option value="tools">أدوات</option>
                <option value="sets">طقم</option><option value="accessories">إكسسوار</option>
              </select>
            </div>
            <div><label className={lbl}>الترتيب</label><input type="number" className={inp} value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} min={0} /></div>
          </div>
          <div>
            <label className={lbl}>نوع الماتشا</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ v: "", label: "— بدون —" }, { v: "ceremonial", label: "✦ احتفالي" }, { v: "everyday", label: "☕ يومي" }, { v: "culinary", label: "🧃 تجاري" }].map(opt => (
                <button key={opt.v} type="button" onClick={() => setForm({ ...form, matchaType: opt.v })}
                  className={`p-2.5 rounded-xl border text-right text-xs transition-colors ${form.matchaType === opt.v ? "border-[#1F3929] bg-[#F0EBE1] font-semibold" : "border-stone-200 hover:border-stone-300"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-6">
            {[{ k: "isActive", label: "نشط" }, { k: "featured", label: "مميز" }].map(({ k, label }) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600">
                <Toggle value={(form as any)[k]} onChange={v => setForm({ ...form, [k]: v })} />
                {label}
              </label>
            ))}
          </div>
          <div>
            <label className={lbl}>الصور</label>
            {form.existingImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.existingImages.map((url: string) => (
                  <div key={url} className="relative w-16 h-16">
                    <img src={url} className="w-full h-full object-cover rounded-lg border border-stone-100" alt="" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, existingImages: f.existingImages.filter((i: string) => i !== url) }))}
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
            <button type="button" onClick={onClose} className="flex-1 h-10 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50">إلغاء</button>
            <button type="submit" disabled={loading} className="flex-1 h-10 rounded-xl bg-[#1F3929] text-[#F2EADB] text-sm hover:bg-[#16281D] disabled:opacity-60">
              {loading ? "جاري الحفظ..." : mode === "add" ? "إضافة" : "حفظ"}
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
  const [filter, setFilter] = useState<"all" | "pending_receipt">("all");

  const upd = useMutation({
    mutationFn: ({ id, status }: any) => api.put(`/admin/orders/${id}`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); qc.invalidateQueries({ queryKey: ["admin-stats"] }); },
  });
  const updReceipt = useMutation({
    mutationFn: ({ id, receiptStatus }: any) => api.put(`/admin/orders/${id}/receipt-status`, { receiptStatus }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); qc.invalidateQueries({ queryKey: ["admin-stats"] }); setSelected(null); },
  });
  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/orders/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); setSelected(null); },
  });

  const displayed = filter === "pending_receipt"
    ? (orders as any[]).filter((o: any) => o.receiptStatus === "pending")
    : (orders as any[]);

  const pendingCount = (orders as any[]).filter((o: any) => o.receiptStatus === "pending").length;
  const revenue = (orders as any[]).filter((o: any) => o.status !== "cancelled").reduce((s: number, o: any) => s + (o.total || 0), 0);
  const pending = (orders as any[]).filter((o: any) => o.status === "pending").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="إجمالي الطلبات" value={(orders as any[]).length} icon={<ShoppingBag size={18} />} />
        <StatCard label="معلقة" value={pending} icon={<Clock size={18} />} />
        <StatCard label="الإيرادات" value={revenue.toFixed(0) + " ر.س"} icon={<TrendingUp size={18} />} />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-stone-700">الطلبات ({(orders as any[]).length})</h3>
          <div className="flex gap-2">
            {[
              { key: "all", label: "الكل" },
              { key: "pending_receipt", label: `إيصالات بانتظار المراجعة ${pendingCount > 0 ? `(${pendingCount})` : ""}` },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f.key ? "bg-[#1F3929] text-[#F2EADB]" : "bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-stone-50">
          {displayed.map((o: any) => (
            <div key={o._id} onClick={() => setSelected(o)}
              className={`px-5 py-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 transition-colors ${selected?._id === o._id ? "bg-stone-50" : ""}`}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800">{o.orderNumber}</p>
                <p className="text-xs text-stone-400 truncate mt-0.5">{o.customer?.name} — {o.customer?.phone}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                {o.receiptStatus === "pending" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <Receipt size={9} /> إيصال معلق
                  </span>
                )}
                <span className="text-sm font-bold text-[#1F3929]">{o.total?.toFixed(0)} ر.س</span>
                <select value={o.status} onClick={e => e.stopPropagation()} onChange={e => upd.mutate({ id: o._id, status: e.target.value })}
                  className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 bg-white outline-none cursor-pointer">
                  {Object.entries(STATUS_AR).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
          ))}
          {displayed.length === 0 && (
            <div className="py-16 text-center text-stone-400">
              <ShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">{filter === "pending_receipt" ? "لا توجد إيصالات بانتظار المراجعة" : "لا توجد طلبات بعد"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
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
                <p className="text-xs text-stone-400 mb-2 uppercase tracking-wider">العنوان</p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {selected.address?.city} — {selected.address?.district}<br />
                  {selected.address?.street}
                  {selected.address?.notes && <><br /><span className="text-stone-400">{selected.address.notes}</span></>}
                </p>
                {selected.address?.mapLink && (
                  <a href={selected.address.mapLink} target="_blank" rel="noopener"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#9BA17B] hover:text-[#1F3929]">
                    <MapPin size={12} /> عرض على الخريطة <ExternalLink size={11} />
                  </a>
                )}
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-stone-400 mb-2 uppercase tracking-wider">المنتجات</p>
                <div className="divide-y divide-stone-50 rounded-xl border border-stone-100 overflow-hidden">
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

              {/* Payment + Receipt */}
              <div>
                <p className="text-xs text-stone-400 mb-2 uppercase tracking-wider">الدفع</p>
                <div className="bg-stone-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">طريقة الدفع</span>
                    <span className="font-medium text-stone-700">
                      {{ cod: "الدفع عند الاستلام", bank: "تحويل بنكي", stcpay: "STC Pay", geidea: "بطاقة ائتمانية" }[selected.paymentMethod] || selected.paymentMethod}
                    </span>
                  </div>
                  {selected.receiptUrl && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-stone-500">الإيصال المرفق</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${RECEIPT_COLOR[selected.receiptStatus]}`}>
                          {RECEIPT_AR[selected.receiptStatus]}
                        </span>
                      </div>
                      <a href={selected.receiptUrl} target="_blank" rel="noopener"
                        className="block overflow-hidden rounded-lg border border-stone-200 hover:opacity-90 transition-opacity">
                        <img src={selected.receiptUrl} alt="إيصال الدفع" className="w-full max-h-48 object-contain bg-stone-100" />
                      </a>
                      {selected.receiptStatus === "pending" && (
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => updReceipt.mutate({ id: selected._id, receiptStatus: "approved" })}
                            disabled={updReceipt.isPending}
                            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                            <CheckCircle2 size={14} /> قبول الإيصال وتأكيد الطلب
                          </button>
                          <button onClick={() => updReceipt.mutate({ id: selected._id, receiptStatus: "rejected" })}
                            disabled={updReceipt.isPending}
                            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm hover:bg-red-100 disabled:opacity-60 transition-colors">
                            <XCircle size={14} /> رفض الإيصال
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => { if (confirm("حذف الطلب نهائياً؟")) del.mutate(selected._id); }}
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

/* ─── Employees ─── */
function AdminEmployees() {
  const qc = useQueryClient();
  const { data: employees = [] } = useQuery({
    queryKey: ["admin-employees"],
    queryFn: () => api.get("/admin/customers?role=employee"),
  });
  const [selected, setSelected] = useState<any>(null);
  const [editPerms, setEditPerms] = useState<string[]>([]);

  const upd = useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/admin/customers/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-employees"] }); setSelected(null); },
  });
  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/customers/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-employees"] }); setSelected(null); },
  });

  const openEmployee = (emp: any) => {
    setSelected(emp);
    setEditPerms(emp.permissions || []);
  };

  const togglePerm = (key: string) => {
    setEditPerms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-800">الموظفون</h2>
          <p className="text-xs text-stone-400 mt-0.5">{(employees as any[]).length} موظف — الصلاحيات تُحدد ما يمكنهم الوصول إليه</p>
        </div>
      </div>

      {/* Permissions legend */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield size={16} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">نظام الصلاحيات</p>
            <p className="text-xs text-blue-600">الموظفون يمكنهم الوصول فقط للأقسام التي تُمنح لهم صلاحيتها. المدير يملك صلاحيات كاملة دائماً.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-stone-50">
          {(employees as any[]).length === 0 && (
            <div className="py-16 text-center text-stone-400">
              <UserCheck size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">لا يوجد موظفون بعد</p>
              <p className="text-xs mt-1">يمكن ترقية عميل لموظف من قسم العملاء</p>
            </div>
          )}
          {(employees as any[]).map((emp: any) => (
            <div key={emp._id} onClick={() => openEmployee(emp)}
              className="px-5 py-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-stone-800">{emp.name}</p>
                  {emp.isActive === false && (
                    <span className="text-[10px] bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full">معطّل</span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">{emp.phone}{emp.jobTitle ? ` · ${emp.jobTitle}` : ""}</p>
                {/* Permissions chips */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {(emp.permissions || []).length === 0 ? (
                    <span className="text-[10px] text-stone-300 border border-stone-100 px-2 py-0.5 rounded-full">بدون صلاحيات</span>
                  ) : (emp.permissions as string[]).map((p: string) => {
                    const pInfo = PERMISSIONS_LIST.find(x => x.key === p);
                    return pInfo ? (
                      <span key={p} className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                        {pInfo.icon} {pInfo.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              <Pencil size={14} className="text-stone-300 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-800">{selected.name}</h3>
                <p className="text-xs text-stone-400">{selected.phone}{selected.jobTitle ? ` · ${selected.jobTitle}` : ""}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-stone-400"><X size={17} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-stone-500 mb-3 font-medium">الصلاحيات الممنوحة</p>
                <div className="grid grid-cols-2 gap-2">
                  {PERMISSIONS_LIST.map(perm => {
                    const has = editPerms.includes(perm.key);
                    return (
                      <button key={perm.key} type="button" onClick={() => togglePerm(perm.key)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-right text-xs transition-colors ${has ? "border-[#1F3929] bg-[#F0EBE1] text-[#1F3929] font-semibold" : "border-stone-200 text-stone-500 hover:border-stone-300"}`}>
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${has ? "bg-[#1F3929] text-white" : "bg-stone-100"}`}>
                          {has ? <Check size={10} /> : null}
                        </div>
                        <span className="flex-1">{perm.label}</span>
                        <span className="shrink-0 opacity-50">{perm.icon}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1.5">حالة الحساب</label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Toggle value={selected.isActive !== false} onChange={v => setSelected({ ...selected, isActive: v })} />
                  <span className="text-sm text-stone-600">{selected.isActive !== false ? "حساب نشط" : "حساب معطّل"}</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => upd.mutate({ id: selected._id, permissions: editPerms, isActive: selected.isActive !== false })}
                  disabled={upd.isPending}
                  className="flex-1 h-10 rounded-xl bg-[#1F3929] text-[#F2EADB] text-sm hover:bg-[#16281D] disabled:opacity-60">
                  {upd.isPending ? "جاري..." : "حفظ الصلاحيات"}
                </button>
                <button onClick={() => { if (confirm(`حذف ${selected.name}؟`)) del.mutate(selected._id); }}
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

/* ─── Customers ─── */
function AdminCustomers() {
  const qc = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "employee">("customer");
  const [selected, setSelected] = useState<any>(null);

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
          <h2 className="text-lg font-semibold text-stone-800">العملاء</h2>
          <p className="text-xs text-stone-400 mt-0.5">{(customers as any[]).length} في القائمة الحالية</p>
        </div>
        <div className="flex gap-2">
          {(["all", "customer", "employee"] as const).map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${roleFilter === r ? "bg-[#1F3929] text-[#F2EADB]" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"}`}>
              {r === "all" ? "الكل" : r === "customer" ? "العملاء" : "الموظفون"}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-stone-50">
          {(customers as any[]).length === 0 && (
            <div className="py-16 text-center text-stone-400"><Users size={32} className="mx-auto mb-3 opacity-30" /><p className="text-sm">لا يوجد مستخدمون</p></div>
          )}
          {(customers as any[]).map((c: any) => (
            <div key={c._id} onClick={() => setSelected(c)}
              className="px-5 py-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-stone-800 truncate">{c.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLOR[c.role] || ""}`}>
                    {ROLE_AR[c.role] || c.role}
                  </span>
                </div>
                <p className="text-xs text-stone-400 truncate mt-0.5" dir="ltr">{c.phone}{c.email ? ` · ${c.email}` : ""}</p>
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
              <h3 className="text-sm font-bold text-stone-800">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-stone-400"><X size={17} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["الجوال", selected.phone], ["البريد", selected.email || "—"],
                  ["نقاط الولاء", selected.loyaltyPoints || 0], ["إجمالي المشتريات", `${selected.totalSpent?.toFixed(0) || 0} ر.س`],
                ].map(([k, v]) => (
                  <div key={k as string} className="bg-stone-50 rounded-lg p-3">
                    <p className="text-xs text-stone-400">{k}</p>
                    <p className="text-sm font-semibold text-stone-700 mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1.5">الدور</label>
                <select defaultValue={selected.role} id={`role-${selected._id}`}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 text-sm bg-stone-50 outline-none">
                  <option value="customer">عميل</option>
                  <option value="employee">موظف</option>
                  <option value="admin">مدير</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => {
                  const sel = document.getElementById(`role-${selected._id}`) as HTMLSelectElement;
                  upd.mutate({ id: selected._id, role: sel?.value || selected.role });
                }} disabled={upd.isPending}
                  className="flex-1 h-10 rounded-xl bg-[#1F3929] text-[#F2EADB] text-sm hover:bg-[#16281D] disabled:opacity-60">
                  {upd.isPending ? "جاري..." : "حفظ"}
                </button>
                <button onClick={() => { if (confirm(`حذف ${selected.name}؟`)) del.mutate(selected._id); }}
                  className="h-10 px-4 rounded-xl bg-red-50 text-red-500 text-sm hover:bg-red-100">حذف</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Coupons ─── */
function AdminCoupons() {
  const qc = useQueryClient();
  const { data: coupons = [] } = useQuery({ queryKey: ["admin-coupons"], queryFn: () => api.get("/admin/coupons") });
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ code: "", type: "percent", value: "", minOrder: "", maxUses: "", expiresAt: "", isActive: true });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const del = useMutation({ mutationFn: (id: string) => api.delete(`/admin/coupons/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }) });
  const openAdd = () => { setEditing(null); setForm({ code: "", type: "percent", value: "", minOrder: "", maxUses: "", expiresAt: "", isActive: true }); setErr(""); setModal(true); };
  const openEdit = (c: any) => { setEditing(c); setForm({ code: c.code, type: c.type, value: String(c.value), minOrder: String(c.minOrder || ""), maxUses: String(c.maxUses || ""), expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().split("T")[0] : "", isActive: c.isActive }); setErr(""); setModal(true); };
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErr("");
    try {
      const body = { ...form, value: Number(form.value), minOrder: Number(form.minOrder) || 0, maxUses: Number(form.maxUses) || 0, expiresAt: form.expiresAt || undefined };
      if (editing) await api.put(`/admin/coupons/${editing._id}`, body);
      else await api.post("/admin/coupons", body);
      qc.invalidateQueries({ queryKey: ["admin-coupons"] }); setModal(false);
    } catch (e: any) { setErr(e.message); }
    setLoading(false);
  };
  const inp = "w-full h-10 px-3 rounded-lg border border-stone-200 text-sm bg-stone-50 outline-none focus:border-[#9BA17B]";
  const lbl = "block text-xs text-stone-500 mb-1.5";
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-semibold text-stone-800">كوبونات الخصم</h2><p className="text-xs text-stone-400 mt-0.5">{(coupons as any[]).length} كوبون</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#1F3929] text-[#F2EADB] text-sm hover:bg-[#16281D]"><Plus size={15} /> كوبون جديد</button>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-stone-50">
          {(coupons as any[]).length === 0 && <div className="py-16 text-center text-stone-400"><Tag size={32} className="mx-auto mb-3 opacity-30" /><p className="text-sm">لا توجد كوبونات بعد</p></div>}
          {(coupons as any[]).map((c: any) => (
            <div key={c._id} className="px-5 py-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#1F3929] tracking-wider">{c.code}</span>
                  {!c.isActive && <span className="text-[10px] bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full">معطّل</span>}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  خصم {c.type === "percent" ? `${c.value}%` : `${c.value} ر.س`}
                  {c.minOrder ? ` · حد أدنى ${c.minOrder} ر.س` : ""}
                  {c.maxUses ? ` · ${c.usedCount || 0}/${c.maxUses} استخدام` : ""}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(c)} className="flex items-center gap-1 h-8 px-3 rounded-lg border border-stone-200 text-xs text-stone-600 hover:bg-stone-50"><Pencil size={11} /> تعديل</button>
                <button onClick={() => { if (confirm("حذف الكوبون؟")) del.mutate(c._id); }} className="w-8 h-8 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 flex items-center justify-center"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <h3 className="text-sm font-semibold text-stone-800">{editing ? "تعديل الكوبون" : "كوبون جديد"}</h3>
              <button onClick={() => setModal(false)} className="text-stone-400"><X size={17} /></button>
            </div>
            <form onSubmit={save} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>رمز الكوبون *</label><input className={inp + " uppercase font-mono tracking-wider"} value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required /></div>
                <div><label className={lbl}>نوع الخصم</label>
                  <select className={inp} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="percent">نسبة مئوية (%)</option><option value="fixed">مبلغ ثابت (ر.س)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className={lbl}>قيمة الخصم *</label><input type="number" className={inp} value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required min={0} /></div>
                <div><label className={lbl}>حد أدنى</label><input type="number" className={inp} value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} min={0} placeholder="0" /></div>
                <div><label className={lbl}>حد أقصى استخدام</label><input type="number" className={inp} value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} min={0} placeholder="∞" /></div>
              </div>
              <div><label className={lbl}>تاريخ الانتهاء</label><input type="date" className={inp} value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} /></div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-600">
                <Toggle value={form.isActive} onChange={v => setForm({ ...form, isActive: v })} /> الكوبون نشط
              </label>
              {err && <p className="text-red-500 text-sm">{err}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 h-10 rounded-xl border border-stone-200 text-sm text-stone-600">إلغاء</button>
                <button type="submit" disabled={loading} className="flex-1 h-10 rounded-xl bg-[#1F3929] text-[#F2EADB] text-sm disabled:opacity-60">{loading ? "جاري..." : editing ? "حفظ" : "إضافة"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Reviews ─── */
function AdminReviews() {
  const qc = useQueryClient();
  const { data: reviews = [] } = useQuery({ queryKey: ["admin-reviews"], queryFn: () => api.get("/admin/reviews") });
  const approve = useMutation({ mutationFn: ({ id, v }: any) => api.put(`/admin/reviews/${id}`, { isApproved: v }), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reviews"] }) });
  const del = useMutation({ mutationFn: (id: string) => api.delete(`/admin/reviews/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reviews"] }) });
  const pending = (reviews as any[]).filter((r: any) => !r.isApproved).length;
  return (
    <div className="space-y-5">
      <div><h2 className="text-lg font-semibold text-stone-800">التقييمات</h2><p className="text-xs text-stone-400 mt-0.5">{(reviews as any[]).length} تقييم · {pending} بانتظار الموافقة</p></div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-stone-50">
          {(reviews as any[]).length === 0 && <div className="py-16 text-center text-stone-400"><Star size={32} className="mx-auto mb-3 opacity-30" /><p className="text-sm">لا توجد تقييمات بعد</p></div>}
          {(reviews as any[]).map((r: any) => (
            <div key={r._id} className="px-5 py-4 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-stone-700">{r.customerName || "مجهول"}</span>
                  <span className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} fill={i < r.rating ? "#C89B5A" : "none"} color={i < r.rating ? "#C89B5A" : "#C8BBA4"} />)}</span>
                  {!r.isApproved && <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full">بانتظار الموافقة</span>}
                </div>
                <p className="text-xs text-stone-500 mb-0.5">{(r.productId as any)?.name || "منتج محذوف"}</p>
                {r.comment && <p className="text-sm text-stone-600 leading-relaxed">{r.comment}</p>}
                <p className="text-xs text-stone-300 mt-1">{new Date(r.createdAt).toLocaleDateString("ar-SA")}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => approve.mutate({ id: r._id, v: !r.isApproved })}
                  className={`h-8 px-3 rounded-lg text-xs transition-colors ${r.isApproved ? "border border-stone-200 text-stone-500 hover:bg-stone-50" : "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"}`}>
                  {r.isApproved ? "إخفاء" : "موافقة"}
                </button>
                <button onClick={() => { if (confirm("حذف التقييم؟")) del.mutate(r._id); }} className="w-8 h-8 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 flex items-center justify-center"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Settings ─── */
function AdminSettings() {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: () => api.get("/admin/settings") });
  const { data: newsletter } = useQuery({ queryKey: ["admin-newsletter"], queryFn: () => api.get("/admin/newsletter") });
  const { data: emailStatus, isLoading: emailStatusLoading } = useQuery({
    queryKey: ["admin-email-status"],
    queryFn: () => api.get("/admin/email-status"),
    retry: false,
  });
  const [form, setForm] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testSending, setTestSending] = useState(false);

  const DEFAULT_BADGES = [
    { icon: "🚚", title: "يوصلك خلال", value: "١–٣ أيام",   enabled: true },
    { icon: "🔒", title: "الدفع",       value: "آمن ومشفّر", enabled: true },
    { icon: "↩️",  title: "الاسترجاع",  value: "يوم واحد",   enabled: true },
  ];
  const defaults = {
    storeName: "UJI MATCHA", storePhone: "0552469643", storeEmail: "info@qirox.online",
    whatsapp: "", shippingFee: 30, shippingFreeThreshold: 200,
    maintenanceMode: false, trustBadges: DEFAULT_BADGES, trustBadgesPosition: "above" as const,
    _codEnabled: true, _bankEnabled: true, _stcEnabled: true,
    bankIban: "", bankName: "مصرف الراجحي", stcPayNumber: "0552469643",
  };
  const current = form || (settings ? { ...defaults, ...settings } : defaults);

  const save = useMutation({
    mutationFn: (data: any) => api.put("/admin/settings", data),
    onSuccess: () => { setSaved(true); qc.invalidateQueries({ queryKey: ["admin-settings"] }); setTimeout(() => setSaved(false), 2500); },
  });

  const sendTest = async () => {
    if (!testEmail) return; setTestSending(true);
    try { await api.post("/admin/send-test-email", { to: testEmail }); alert("✅ تم إرسال البريد التجريبي"); }
    catch (e: any) { alert("خطأ: " + e.message); }
    setTestSending(false);
  };

  const inp = "w-full h-10 px-3 rounded-lg border border-stone-200 text-sm bg-stone-50 outline-none focus:border-[#9BA17B] transition-colors";
  const lbl = "block text-xs text-stone-500 mb-1.5";

  if (isLoading) return <div className="text-center py-12 text-stone-400 text-sm">جاري التحميل...</div>;

  return (
    <div className="max-w-2xl space-y-5">
      <div><h2 className="text-lg font-semibold text-stone-800">إعدادات المتجر</h2></div>

      {/* Store info */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center"><Settings2 size={15} className="text-stone-500" /></div>
          <p className="text-sm font-semibold text-stone-700">معلومات المتجر</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {[{ label: "اسم المتجر", k: "storeName" }, { label: "رقم التواصل", k: "storePhone" }, { label: "البريد الإلكتروني", k: "storeEmail" }, { label: "واتساب (مع رمز الدولة)", k: "whatsapp" }].map(({ label, k }) => (
            <div key={k}><label className={lbl}>{label}</label><input className={inp} value={current[k] ?? ""} onChange={e => setForm({ ...current, [k]: e.target.value })} /></div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center"><Truck size={15} className="text-stone-500" /></div>
          <p className="text-sm font-semibold text-stone-700">إعدادات الشحن</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <div><label className={lbl}>رسوم الشحن (ر.س)</label><input type="number" className={inp} value={current.shippingFee} onChange={e => setForm({ ...current, shippingFee: Number(e.target.value) })} min={0} /></div>
          <div><label className={lbl}>حد الشحن المجاني (ر.س)</label><input type="number" className={inp} value={current.shippingFreeThreshold} onChange={e => setForm({ ...current, shippingFreeThreshold: Number(e.target.value) })} min={0} /></div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center"><CreditCard size={15} className="text-stone-500" /></div>
          <div><p className="text-sm font-semibold text-stone-700">طرق الدفع</p><p className="text-xs text-stone-400 mt-0.5">فعّل أو عطّل طرق الدفع</p></div>
        </div>
        <div className="p-5 space-y-4">
          {/* COD */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-stone-100">
            <div className="flex items-center gap-3"><Banknote size={18} className="text-emerald-600" /><div><p className="text-sm font-medium text-stone-700">الدفع عند الاستلام</p><p className="text-xs text-stone-400">Cash on Delivery</p></div></div>
            <Toggle value={current._codEnabled} onChange={v => setForm({ ...current, _codEnabled: v })} />
          </div>
          {/* Bank */}
          <div className="border border-stone-100 rounded-xl">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3"><div className="text-lg">🏦</div><div><p className="text-sm font-medium text-stone-700">التحويل البنكي</p><p className="text-xs text-stone-400">مع رفع إيصال الدفع</p></div></div>
              <Toggle value={current._bankEnabled} onChange={v => setForm({ ...current, _bankEnabled: v })} />
            </div>
            {current._bankEnabled && (
              <div className="px-3 pb-3 grid grid-cols-2 gap-2 border-t border-stone-50 pt-3">
                <div><label className={lbl}>اسم البنك</label><input className={inp} value={current.bankName ?? ""} onChange={e => setForm({ ...current, bankName: e.target.value })} placeholder="مصرف الراجحي" /></div>
                <div><label className={lbl}>رقم الآيبان</label><input className={inp} value={current.bankIban ?? ""} onChange={e => setForm({ ...current, bankIban: e.target.value })} placeholder="SA..." style={{ direction: "ltr" }} /></div>
              </div>
            )}
          </div>
          {/* STC */}
          <div className="border border-stone-100 rounded-xl">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3"><div className="text-lg">📱</div><div><p className="text-sm font-medium text-stone-700">STC Pay</p><p className="text-xs text-stone-400">مع رفع إيصال الدفع</p></div></div>
              <Toggle value={current._stcEnabled} onChange={v => setForm({ ...current, _stcEnabled: v })} />
            </div>
            {current._stcEnabled && (
              <div className="px-3 pb-3 border-t border-stone-50 pt-3">
                <label className={lbl}>رقم STC Pay</label>
                <input className={inp} value={current.stcPayNumber ?? ""} onChange={e => setForm({ ...current, stcPayNumber: e.target.value })} placeholder="05xxxxxxxx" style={{ direction: "ltr" }} />
              </div>
            )}
          </div>
          {/* Geidea */}
          <div className="border border-stone-100 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-lg">💳</div>
              <div>
                <p className="text-sm font-medium text-stone-700">Geidea — بوابة الدفع</p>
                <p className="text-xs text-stone-400">{(settings as any)?._geideaEnabled ? "✅ مفعّلة" : "⚠️ غير مفعّلة — أضف GEIDEA_MERCHANT_KEY في Secrets"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Providers */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center"><Truck size={15} className="text-stone-500" /></div>
          <div><p className="text-sm font-semibold text-stone-700">شركات التوصيل</p><p className="text-xs text-stone-400 mt-0.5">فعّل الشركات وحدد أسعارها — تظهر للعميل عند الطلب</p></div>
        </div>
        <div className="p-5 space-y-3">
          {(() => {
            const DEFAULT_PROVIDERS = [
              { id: "smsa",   name: "SMSA Express", nameEn: "SMSA Express", price: 30, days: "3-5 أيام عمل", enabled: true, logo: "/assets/brand/logo-smsa.svg" },
              { id: "aramex", name: "أرامكس",       nameEn: "Aramex",       price: 35, days: "2-3 أيام عمل", enabled: true, logo: "/assets/brand/logo-aramex.svg" },
              { id: "jt",     name: "J&T Express",  nameEn: "J&T Express",  price: 25, days: "3-5 أيام عمل", enabled: false, logo: "/assets/brand/logo-jt.svg" },
            ];
            const providers: any[] = current.deliveryProviders ?? DEFAULT_PROVIDERS;
            const update = (idx: number, field: string, val: any) => {
              const next = providers.map((p, i) => i === idx ? { ...p, [field]: val } : p);
              setForm({ ...current, deliveryProviders: next });
            };
            return providers.map((p: any, i: number) => (
              <div key={p.id} className="border border-stone-100 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-3">
                  <div className="w-20 h-10 bg-stone-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-stone-100">
                    <img src={p.logo} alt={p.nameEn} className="max-h-8 max-w-full object-contain"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-700">{p.name}</p>
                    <p className="text-xs text-stone-400">{p.days}</p>
                  </div>
                  <Toggle value={p.enabled} onChange={v => update(i, "enabled", v)} />
                </div>
                {p.enabled && (
                  <div className="px-3 pb-3 border-t border-stone-50 pt-3 grid grid-cols-2 gap-2">
                    <div><label className={lbl}>سعر الشحن (ر.س)</label><input type="number" className={inp} min={0} value={p.price} onChange={e => update(i, "price", Number(e.target.value))} /></div>
                    <div><label className={lbl}>مدة التوصيل</label><input className={inp} value={p.days} onChange={e => update(i, "days", e.target.value)} /></div>
                  </div>
                )}
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-base">✦</div>
          <div><p className="text-sm font-semibold text-stone-700">شريط الثقة</p><p className="text-xs text-stone-400 mt-0.5">بطاقات التوصيل والدفع والاسترجاع</p></div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className={lbl}>موضع الشريط</label>
            <select className={inp} value={current.trustBadgesPosition ?? "above"} onChange={e => setForm({ ...current, trustBadgesPosition: e.target.value })}>
              <option value="above">فوق المنتجات</option>
              <option value="below">تحت المنتجات</option>
              <option value="both">فوق وتحت</option>
            </select>
          </div>
          <div className="space-y-3">
            {(current.trustBadges ?? DEFAULT_BADGES).map((b: any, i: number) => {
              const badges: any[] = current.trustBadges ?? DEFAULT_BADGES;
              const upd = (field: string, val: any) => setForm({ ...current, trustBadges: badges.map((x, j) => j === i ? { ...x, [field]: val } : x) });
              return (
                <div key={i} className="border border-stone-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-700">بطاقة {i + 1}</span>
                    <Toggle value={b.enabled} onChange={v => upd("enabled", v)} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><label className={lbl}>الأيقونة</label><input className={inp + " text-center text-xl"} value={b.icon} onChange={e => upd("icon", e.target.value)} maxLength={4} /></div>
                    <div><label className={lbl}>العنوان</label><input className={inp} value={b.title} onChange={e => upd("title", e.target.value)} /></div>
                    <div><label className={lbl}>القيمة</label><input className={inp} value={b.value} onChange={e => upd("value", e.target.value)} /></div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => { const badges: any[] = current.trustBadges ?? DEFAULT_BADGES; setForm({ ...current, trustBadges: [...badges, { icon: "⭐", title: "عنوان", value: "قيمة", enabled: true }] }); }}
            className="w-full h-10 rounded-xl border border-dashed border-stone-200 text-stone-400 text-sm hover:border-[#9BA17B] hover:text-[#9BA17B] transition-colors">
            + إضافة بطاقة
          </button>
        </div>
      </div>

      {/* Saudi Licenses / Trust Logos */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-base">🇸🇦</div>
          <div><p className="text-sm font-semibold text-stone-700">التراخيص والجهات المعتمدة</p><p className="text-xs text-stone-400 mt-0.5">شعارات الجهات الحكومية السعودية المعتمدة</p></div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-stone-100 rounded-xl p-4 flex flex-col items-center gap-3">
              <div className="h-16 flex items-center justify-center">
                <img src="/assets/brand/logo-moc-ar.png" alt="وزارة التجارة" className="max-h-14 object-contain" />
              </div>
              <p className="text-xs text-stone-500 text-center">وزارة التجارة</p>
              <p className="text-[10px] text-stone-300 text-center">Ministry of Commerce</p>
            </div>
            <div className="border border-stone-100 rounded-xl p-4 flex flex-col items-center gap-3">
              <div className="h-16 flex items-center justify-center">
                <img src="/assets/brand/logo-sbc-ar.png" alt="المركز السعودي للأعمال" className="max-h-14 object-contain" />
              </div>
              <p className="text-xs text-stone-500 text-center">المركز السعودي للأعمال</p>
              <p className="text-[10px] text-stone-300 text-center">Saudi Business Center</p>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-4">هذه الشعارات تُظهر احترافية المتجر وتعزز ثقة العملاء. تظهر في الفوتر.</p>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center"><Mail size={15} className="text-stone-500" /></div>
          <p className="text-sm font-semibold text-stone-700">النشرة البريدية</p>
        </div>
        <div className="p-5 space-y-4">
          <div className={`rounded-xl border p-3 ${emailStatus?.ok ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}>
            <div className="flex items-start gap-2">
              <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${emailStatus?.ok ? "bg-emerald-500" : "bg-amber-500"}`} />
              <div className="min-w-0">
                <p className={`text-xs font-semibold ${emailStatus?.ok ? "text-emerald-800" : "text-amber-800"}`}>
                  {emailStatusLoading ? "جاري فحص SMTP..." : emailStatus?.ok ? "البريد مضبوط ويستطيع الاتصال بخادم SMTP" : "البريد غير جاهز للإرسال"}
                </p>
                {!emailStatus?.ok && <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">{emailStatus?.message || "أضف SMTP_PASS في إعدادات Render ثم أعد النشر."}</p>}
                {emailStatus?.ok && <p className="text-[11px] text-emerald-700 mt-1">الأصول المضمّنة في الرسالة: {emailStatus.inlineAssets}/2 — الشعار والبانر</p>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-[#1F3929]">{newsletter?.count || 0}</div>
            <p className="text-sm text-stone-500">مشترك في النشرة البريدية</p>
          </div>
          <div className="flex gap-3">
            <input className={inp + " flex-1"} value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="أرسل بريد تجريبي إلى..." type="email" />
            <button onClick={sendTest} disabled={testSending || !testEmail}
              className="h-10 px-4 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-60 whitespace-nowrap">
              {testSending ? "إرسال..." : "إرسال تجريبي"}
            </button>
          </div>
        </div>
      </div>

      {/* Seed */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center">🍵</div>
          <div><p className="text-sm font-semibold text-stone-700">تهيئة المنتجات</p><p className="text-xs text-stone-400 mt-0.5">حذف جميع المنتجات وإضافة كيس الماتشا</p></div>
        </div>
        <div className="p-5">
          <button onClick={async () => {
            if (!confirm("سيتم حذف جميع المنتجات الحالية. هل تريد المتابعة؟")) return;
            try { await api.post("/admin/seed-matcha-bag", {}); alert("✅ تم تهيئة المنتجات بنجاح"); }
            catch (e: any) { alert("خطأ: " + e.message); }
          }} className="h-10 px-5 rounded-xl bg-amber-600 text-white text-sm hover:bg-amber-700 transition-colors">
            🍃 تهيئة كيس الماتشا
          </button>
        </div>
      </div>

      {/* Maintenance */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center"><AlertCircle size={15} className="text-stone-500" /></div>
          <p className="text-sm font-semibold text-stone-700">وضع الصيانة</p>
        </div>
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-700">تعطيل المتجر مؤقتاً</p>
            <p className="text-xs text-stone-400 mt-0.5">الزوار يرون صفحة "تحت الصيانة"</p>
          </div>
          <Toggle value={!!current.maintenanceMode} onChange={v => setForm({ ...current, maintenanceMode: v })} />
        </div>
      </div>

      {/* Save */}
      <button onClick={() => save.mutate(current)} disabled={save.isPending}
        className="w-full h-11 rounded-xl bg-[#1F3929] text-[#F2EADB] text-sm flex items-center justify-center gap-2 hover:bg-[#16281D] transition-colors disabled:opacity-60">
        {save.isPending ? "جاري الحفظ..." : saved ? <><Check size={16} /> تم الحفظ بنجاح</> : "حفظ الإعدادات"}
      </button>
    </div>
  );
}

/* ─── Finance / invoices / quotes / marketing / SEO ─── */
function AdminFinance({ stats }: { stats: any }) {
  const qc = useQueryClient();
  const { data: expenses = [] } = useQuery({ queryKey: ["admin-expenses"], queryFn: () => api.get("/admin/expenses") });
  const [form, setForm] = useState({ title: "", category: "تشغيل", amount: "", notes: "" });
  const [showForm, setShowForm] = useState(false);
  const add = useMutation({
    mutationFn: () => api.post("/admin/expenses", { ...form, amount: Number(form.amount) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-expenses"] }); setForm({ title: "", category: "تشغيل", amount: "", notes: "" }); setShowForm(false); },
  });
  const del = useMutation({ mutationFn: (id: string) => api.delete(`/admin/expenses/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-expenses"] }) });
  const totalExpenses = (expenses as any[]).reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const revenue = Number(stats?.totalRevenue || 0);
  return <div className="space-y-5">
    <div><h2 className="text-lg font-semibold text-stone-800">النظرة المالية</h2><p className="text-xs text-stone-400 mt-0.5">الإيرادات والمصروفات وصافي التشغيل</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="الإيرادات" value={`${revenue.toFixed(0)} ر.س`} icon={<TrendingUp size={18} />} />
      <StatCard label="المصروفات" value={`${totalExpenses.toFixed(0)} ر.س`} icon={<WalletCards size={18} />} />
      <StatCard label="صافي التشغيل" value={`${(revenue - totalExpenses).toFixed(0)} ر.س`} icon={<Banknote size={18} />} />
      <StatCard label="طلبات هذا الشهر" value={stats?.thisMonthRev ? `${Number(stats.thisMonthRev).toFixed(0)} ر.س` : "0 ر.س"} icon={<CalendarDays size={18} />} />
    </div>
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-50 flex items-center justify-between"><div><h3 className="text-sm font-semibold text-stone-700">المصروفات</h3><p className="text-xs text-stone-400 mt-1">{(expenses as any[]).length} سجل</p></div><button onClick={() => setShowForm(v => !v)} className="h-9 px-3 rounded-xl bg-[#1F3929] text-[#F2EADB] text-xs flex items-center gap-1"><Plus size={14} /> مصروف جديد</button></div>
      {showForm && <div className="p-5 bg-stone-50 border-b border-stone-100 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <input placeholder="اسم المصروف" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="التصنيف" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input type="number" placeholder="المبلغ ر.س" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        <button disabled={!form.title || !form.amount || add.isPending} onClick={() => add.mutate()} className="h-10 rounded-xl bg-[#1F3929] text-white text-sm disabled:opacity-50">حفظ المصروف</button>
      </div>}
      <div className="divide-y divide-stone-50">{(expenses as any[]).map(e => <div key={e._id} className="px-5 py-3 flex items-center justify-between"><div><p className="text-sm text-stone-700">{e.title}</p><p className="text-xs text-stone-400">{e.category} · {new Date(e.date || e.createdAt).toLocaleDateString("ar-SA")}</p></div><div className="flex items-center gap-3"><b className="text-sm text-red-600">-{Number(e.amount).toFixed(2)} ر.س</b><button onClick={() => del.mutate(e._id)} className="text-red-300 hover:text-red-600"><Trash2 size={14} /></button></div></div>)}{!(expenses as any[]).length && <p className="py-12 text-center text-sm text-stone-400">لا توجد مصروفات مسجلة</p>}</div>
    </div>
  </div>;
}

/* ── print helper: opens a new window with Arabic-formatted document ── */
function printDocument(title: string, number: string, customer: any, items: any[], total: number, notes?: string, validUntil?: string) {
  const rows = (items || []).map((i: any) => `
    <tr>
      <td>${i.name}</td>
      <td style="text-align:center">${i.qty}</td>
      <td style="text-align:left">${(i.price || 0).toFixed(2)}</td>
      <td style="text-align:left;font-weight:600">${((i.price || 0) * (i.qty || 1)).toFixed(2)} ر.س</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html><html lang="ar" dir="rtl">
<head><meta charset="UTF-8"/><title>${title} — ${number}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Tahoma, Arial, sans-serif; font-size: 13px; color: #1C201B; background: #fff; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1F3929; padding-bottom: 20px; margin-bottom: 24px; }
  .brand { font-size: 22px; font-weight: 700; color: #1F3929; letter-spacing: 0.1em; }
  .brand-sub { font-size: 10px; color: #9BA17B; letter-spacing: 0.2em; margin-top: 4px; }
  .doc-meta { text-align: left; }
  .doc-num { font-size: 18px; font-weight: 700; color: #1F3929; }
  .doc-date { font-size: 11px; color: #9BA17B; margin-top: 4px; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 11px; letter-spacing: 0.15em; color: #9BA17B; margin-bottom: 8px; text-transform: uppercase; }
  .customer-box { background: #F7F4EF; border-right: 3px solid #9BA17B; padding: 14px 16px; border-radius: 2px; line-height: 1.9; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th { background: #1F3929; color: #F2EADB; padding: 10px 12px; text-align: right; font-size: 11px; letter-spacing: 0.1em; }
  th:last-child, th:nth-child(2), th:nth-child(3) { text-align: left; }
  td { padding: 10px 12px; border-bottom: 1px solid #F0EBE1; }
  .total-row { font-size: 16px; font-weight: 700; color: #1F3929; }
  .notes-box { background: #F7F4EF; padding: 12px 16px; border-radius: 2px; margin-top: 16px; line-height: 1.8; font-size: 12px; color: #555; }
  .footer { margin-top: 40px; border-top: 1px solid #F0EBE1; padding-top: 16px; text-align: center; font-size: 11px; color: #9BA17B; }
  @media print { body { padding: 20px; } }
</style></head>
<body>
  <div class="header">
    <div><div class="brand">UJI MATCHA</div><div class="brand-sub">ماتشا يابانية احتفالية</div></div>
    <div class="doc-meta">
      <div class="doc-num">${title}: ${number}</div>
      <div class="doc-date">التاريخ: ${new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</div>
      ${validUntil ? `<div class="doc-date">صالح حتى: ${new Date(validUntil).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</div>` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">العميل</div>
    <div class="customer-box">
      <strong>${customer?.name || "—"}</strong><br/>
      ${customer?.phone ? `📱 ${customer.phone}<br/>` : ""}
      ${customer?.email ? `✉ ${customer.email}` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">البنود</div>
    <table>
      <thead><tr><th>المنتج</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
      <tbody>
        ${rows}
        <tr class="total-row"><td colspan="3" style="text-align:right;padding-top:16px">الإجمالي</td><td style="text-align:left;padding-top:16px">${total.toFixed(2)} ر.س</td></tr>
      </tbody>
    </table>
  </div>

  ${notes ? `<div class="section"><div class="section-title">ملاحظات</div><div class="notes-box">${notes}</div></div>` : ""}

  <div class="footer">ujimatcha.store · info@qirox.online · © 2026 UJI MATCHA</div>
</body></html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}

function AdminInvoices() {
  const qc = useQueryClient();
  const { data: invoices = [] } = useQuery({ queryKey: ["admin-invoices"], queryFn: () => api.get("/admin/invoices") });
  const send = useMutation({
    mutationFn: (id: string) => api.post(`/admin/invoices/${id}/send`, {}),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ["admin-invoices"] });
      alert(`✓ تم إرسال الفاتورة إلى بريد العميل`);
    },
    onError: (e: any) => alert(`خطأ: ${e.message}`),
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-stone-800">الفواتير</h2>
        <p className="text-xs text-stone-400 mt-0.5">الفواتير التي أنشئت من الطلبات المعتمدة</p>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-stone-50">
          {(invoices as any[]).map(inv => (
            <div key={inv._id} className="px-5 py-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-sm font-bold text-[#1F3929]">{inv.invoiceNumber}</p>
                <p className="text-xs text-stone-400 mt-1">
                  {inv.customer?.name || "عميل"} {inv.customer?.email ? `· ${inv.customer.email}` : ""} · {new Date(inv.createdAt).toLocaleDateString("ar-SA")}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] rounded-full px-2 py-1 border ${inv.status === "paid" ? "text-emerald-700 bg-emerald-50 border-emerald-100" : "text-stone-500 bg-stone-50 border-stone-200"}`}>
                  {inv.status === "paid" ? "مدفوعة" : "صادرة"}
                </span>
                <p className="text-sm font-semibold text-stone-700">{Number(inv.total || 0).toFixed(2)} ر.س</p>
                <button
                  onClick={() => printDocument("فاتورة", inv.invoiceNumber, inv.customer, inv.items, inv.total)}
                  title="طباعة"
                  className="h-8 w-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50"
                >
                  <FileText size={14} />
                </button>
                <button
                  disabled={!inv.customer?.email || send.isPending}
                  onClick={() => send.mutate(inv._id)}
                  title={inv.customer?.email ? "إرسال بالبريد" : "لا يوجد بريد إلكتروني"}
                  className="h-8 w-8 rounded-lg border border-[#1F3929] flex items-center justify-center text-[#1F3929] hover:bg-[#1F3929] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          ))}
          {!(invoices as any[]).length && (
            <p className="py-12 text-center text-sm text-stone-400">ستظهر الفواتير بعد اعتماد الطلبات</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminQuotes() {
  const qc = useQueryClient();
  const { data: quotes = [] } = useQuery({ queryKey: ["admin-quotes"], queryFn: () => api.get("/admin/quotes") });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", item: "منتج ماتشا", qty: "1", price: "", notes: "", validUntil: "" });

  const create = useMutation({
    mutationFn: () => api.post("/admin/quotes", {
      customer: { name: form.name, phone: form.phone, email: form.email },
      items: [{ name: form.item, qty: Number(form.qty), price: Number(form.price) }],
      notes: form.notes, validUntil: form.validUntil || undefined,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-quotes"] }); setOpen(false); setForm({ name: "", phone: "", email: "", item: "منتج ماتشا", qty: "1", price: "", notes: "", validUntil: "" }); },
  });

  const sendQ = useMutation({
    mutationFn: (id: string) => api.post(`/admin/quotes/${id}/send`, {}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-quotes"] }); alert("✓ تم إرسال عرض السعر إلى بريد العميل"); },
    onError: (e: any) => alert(`خطأ: ${e.message}`),
  });

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/quotes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-quotes"] }),
  });

  const statusLabel: Record<string, string> = { draft: "مسودة", sent: "مرسل", accepted: "مقبول", expired: "منتهي" };
  const statusColor: Record<string, string> = {
    draft: "text-stone-500 bg-stone-50 border-stone-200",
    sent: "text-blue-600 bg-blue-50 border-blue-100",
    accepted: "text-emerald-700 bg-emerald-50 border-emerald-100",
    expired: "text-red-500 bg-red-50 border-red-100",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-800">عروض الأسعار</h2>
          <p className="text-xs text-stone-400 mt-0.5">أنشئ عرضاً للعميل وأرسله مباشرة لبريده</p>
        </div>
        <button onClick={() => setOpen(v => !v)} className="h-10 px-4 rounded-xl bg-[#1F3929] text-white text-sm flex items-center gap-2">
          <Plus size={15} /> عرض جديد
        </button>
      </div>

      {open && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 space-y-3">
          <h3 className="text-sm font-semibold text-stone-700">بيانات العرض</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <input placeholder="اسم العميل *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="جوال العميل" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input placeholder="البريد الإلكتروني *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input placeholder="اسم المنتج *" value={form.item} onChange={e => setForm({ ...form, item: e.target.value })} />
            <input type="number" placeholder="الكمية" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
            <input type="number" placeholder="السعر (ر.س) *" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input type="date" title="صالح حتى" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} className="col-span-1" />
            <textarea placeholder="ملاحظات (اختياري)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="col-span-2 lg:col-span-2 !h-20 resize-none" />
          </div>
          <div className="flex gap-2">
            <button disabled={!form.name || !form.price || create.isPending} onClick={() => create.mutate()} className="h-10 px-5 rounded-xl bg-[#1F3929] text-white text-sm disabled:opacity-50">
              {create.isPending ? "جاري الحفظ..." : "حفظ العرض"}
            </button>
            <button onClick={() => setOpen(false)} className="h-10 px-4 rounded-xl border border-stone-200 text-stone-500 text-sm">إلغاء</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-stone-50">
          {(quotes as any[]).map(q => (
            <div key={q._id} className="px-5 py-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-sm font-bold text-[#1F3929]">{q.quoteNumber}</p>
                <p className="text-xs text-stone-400 mt-1">
                  {q.customer?.name} {q.customer?.email ? `· ${q.customer.email}` : ""} · {q.items?.[0]?.name}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] rounded-full px-2 py-1 border ${statusColor[q.status] || "text-stone-500 bg-stone-50 border-stone-200"}`}>
                  {statusLabel[q.status] || q.status}
                </span>
                <p className="text-sm font-semibold text-stone-700">{Number(q.total || 0).toFixed(2)} ر.س</p>
                <button
                  onClick={() => printDocument("عرض سعر", q.quoteNumber, q.customer, q.items, q.total, q.notes, q.validUntil)}
                  title="طباعة"
                  className="h-8 w-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50"
                >
                  <FileText size={14} />
                </button>
                <button
                  disabled={!q.customer?.email || q.status === "accepted" || sendQ.isPending}
                  onClick={() => sendQ.mutate(q._id)}
                  title={q.customer?.email ? "إرسال بالبريد" : "لا يوجد بريد إلكتروني"}
                  className="h-8 w-8 rounded-lg border border-[#1F3929] flex items-center justify-center text-[#1F3929] hover:bg-[#1F3929] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={14} />
                </button>
                <button
                  onClick={() => { if (confirm("حذف العرض؟")) del.mutate(q._id); }}
                  className="h-8 w-8 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {!(quotes as any[]).length && (
            <p className="py-12 text-center text-sm text-stone-400">لا توجد عروض أسعار بعد</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminMarketing() {
  const qc = useQueryClient();
  const { data: campaigns = [] } = useQuery({ queryKey: ["admin-campaigns"], queryFn: () => api.get("/admin/campaigns") });
  const { data: newsletter } = useQuery({ queryKey: ["admin-newsletter"], queryFn: () => api.get("/admin/newsletter") });
  const [form, setForm] = useState({ name: "", subject: "", message: "", channel: "email" });
  const create = useMutation({ mutationFn: () => api.post("/admin/campaigns", form), onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-campaigns"] }); setForm({ name: "", subject: "", message: "", channel: "email" }); } });
  const send = useMutation({ mutationFn: (id: string) => api.post(`/admin/campaigns/${id}/send`, {}), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-campaigns"] }) });
  return <div className="space-y-5"><div><h2 className="text-lg font-semibold text-stone-800">التسويق والرسائل الجماعية</h2><p className="text-xs text-stone-400 mt-0.5">أنشئ حملات بريدية للمشتركين وتابع أثرها</p></div><div className="grid grid-cols-2 lg:grid-cols-3 gap-4"><StatCard label="مشتركو النشرة" value={newsletter?.count || 0} icon={<Mail size={18} />} /><StatCard label="الحملات" value={(campaigns as any[]).length} icon={<Megaphone size={18} />} /><StatCard label="القنوات" value="Email · WhatsApp" icon={<Send size={18} />} /></div><div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 space-y-3"><h3 className="text-sm font-semibold text-stone-700">حملة جديدة</h3><div className="grid grid-cols-2 gap-3"><input placeholder="اسم الحملة" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><input placeholder="عنوان الرسالة" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></div><textarea className="!h-28" placeholder="اكتب الرسالة للعملاء..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /><button disabled={!form.name || !form.message || create.isPending} onClick={() => create.mutate()} className="h-10 px-4 rounded-xl bg-[#1F3929] text-white text-sm disabled:opacity-50">حفظ الحملة</button></div><div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden"><div className="divide-y divide-stone-50">{(campaigns as any[]).map(c => <div key={c._id} className="px-5 py-4 flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-stone-700">{c.name}</p><p className="text-xs text-stone-400">{c.recipients || 0} مستلم · {c.status === "sent" ? "تم الإرسال" : "مسودة"}</p></div><button disabled={c.status === "sent" || send.isPending} onClick={() => send.mutate(c._id)} className="h-8 px-3 rounded-lg border border-[#1F3929] text-xs text-[#1F3929] flex items-center gap-1 disabled:opacity-40"><Send size={12} /> إرسال</button></div>)}{!(campaigns as any[]).length && <p className="py-10 text-center text-sm text-stone-400">لا توجد حملات بعد</p>}</div></div></div>;
}

function AdminSEO() {
  const qc = useQueryClient();
  const { data: defaults } = useQuery({ queryKey: ["seo-site"], queryFn: () => api.get("/seo/site") });
  const { data: saved } = useQuery({ queryKey: ["admin-seo"], queryFn: () => api.get("/admin/seo") });
  const [form, setForm] = useState<any>(null);
  const current = form || saved || {};
  const save = useMutation({ mutationFn: () => api.put("/admin/seo", current), onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-seo"] }); alert("تم حفظ إعدادات SEO / AEO"); } });
  return <div className="space-y-5 max-w-4xl"><div><h2 className="text-lg font-semibold text-stone-800">SEO / AEO</h2><p className="text-xs text-stone-400 mt-0.5">الكلمات والبيانات التي تساعد Google ونتائج الذكاء الاصطناعي على فهم UJI</p></div><div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 space-y-4"><div><label className="text-xs text-stone-500 mb-1.5 block">العنوان الرئيسي</label><input value={current.title || "UJI MATCHA — ماتشا يابانية أصلية من أوجي إلى السعودية"} onChange={e => setForm({ ...current, title: e.target.value })} /></div><div><label className="text-xs text-stone-500 mb-1.5 block">الوصف</label><textarea className="!h-24" value={current.description || "ماتشا يابانية أصلية من أوجي، توصيل سريع إلى الرياض وجميع مدن السعودية. ماتشا لاتيه بارد وساخن ومشروبات صيفية وشتوية."} onChange={e => setForm({ ...current, description: e.target.value })} /></div><div><label className="text-xs text-stone-500 mb-1.5 block">كلمات البحث العربية والإنجليزية (كلمة في كل سطر)</label><textarea className="!h-40" value={(current.keywords || defaults?.keywords || []).join("\n")} onChange={e => setForm({ ...current, keywords: e.target.value.split("\n").map((x: string) => x.trim()).filter(Boolean) })} /></div><div><label className="text-xs text-stone-500 mb-1.5 block">أسئلة AEO إضافية — JSON اختياري</label><textarea className="!h-32 font-mono text-xs" value={JSON.stringify(current.faqs || defaults?.faqs || [], null, 2)} onChange={e => { try { setForm({ ...current, faqs: JSON.parse(e.target.value) }); } catch {} }} /></div><button onClick={() => save.mutate()} disabled={save.isPending} className="h-11 w-full rounded-xl bg-[#1F3929] text-white text-sm disabled:opacity-50">{save.isPending ? "جاري الحفظ..." : "حفظ SEO / AEO"}</button></div><div className="bg-[#1F3929] text-[#F2EADB] rounded-2xl p-5"><p className="text-sm font-semibold mb-2">مفعل تلقائياً</p><p className="text-xs leading-7 text-[#C8BBA4]">Sitemap XML · robots.txt · llms.txt · Product schema · FAQ schema · كلمات ماتشا بالعربية والإنجليزية · مدن السعودية · صيف وشتاء · روابط Canonical وOpen Graph.</p></div></div>;
}
