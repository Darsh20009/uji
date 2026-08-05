import { useState, useEffect, useRef } from "react";
import { Route, Switch, useLocation } from "wouter";
import SplashScreen from "./components/SplashScreen";
import PageLoader from "./components/PageLoader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import MobileBottomNav from "./components/MobileBottomNav";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthModalProvider } from "./context/AuthModalContext";
import { SiteContentProvider } from "./context/SiteContentContext";
import { EditModeProvider } from "./context/EditModeContext";
import { LanguageProvider, useLang } from "./context/LanguageContext";
import { t } from "./lib/translations";

function NotFoundText() {
  const { lang } = useLang();
  return (
    <>
      <p style={{ fontFamily: "'Mirza', serif", fontSize: "0.9rem", color: "#9BA17B" }}>{t("404.message", lang)}</p>
      <Link href="/" style={{ background: "#1F3929", color: "#F2EADB", padding: "0.875rem 2.5rem", textDecoration: "none", fontFamily: "'Mirza', serif", fontSize: "0.9rem" }}>{t("404.back", lang)}</Link>
    </>
  );
}
import { AdminToggle } from "./components/cms/AdminToggle";
import { CmsSidebar } from "./components/cms/CmsSidebar";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import PolicyPage from "./pages/PolicyPage";
import WholesalePage from "./pages/WholesalePage";
import RitualPage from "./pages/RitualPage";
import MagazinePage from "./pages/MagazinePage";
import OurStoryPage from "./pages/OurStoryPage";
import { Link } from "wouter";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  const prevLocation = useRef(location);

  useEffect(() => {
    if (location === prevLocation.current) return;
    prevLocation.current = location;
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [location]);

  useEffect(() => {
    const seen = sessionStorage.getItem("uji-splash");
    if (seen) { setShowSplash(false); return; }
    const t = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("uji-splash", "1");
    }, 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/seo/site").then(r => r.ok ? r.json() : null).then((seo) => {
      if (cancelled || !seo) return;
      if (seo.title) document.title = seo.title;
      const description = document.querySelector('meta[name="description"]');
      if (description && seo.description) description.setAttribute("content", seo.description);
      const keywords = document.querySelector('meta[name="keywords"]');
      if (keywords && Array.isArray(seo.keywords)) keywords.setAttribute("content", seo.keywords.join(", "));
      const existing = document.getElementById("uji-dynamic-faq-schema");
      existing?.remove();
      if (Array.isArray(seo.faqs) && seo.faqs.length) {
        const script = document.createElement("script");
        script.id = "uji-dynamic-faq-schema";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: seo.faqs.map((faq: any) => ({
            "@type": "Question", name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        });
        document.head.appendChild(script);
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (showSplash) return <SplashScreen onDone={() => { setShowSplash(false); sessionStorage.setItem("uji-splash","1"); }} />;

  return (
    <ErrorBoundary>
      <LanguageProvider>
      <SiteContentProvider>
        <EditModeProvider>
          <AuthModalProvider>
            <PageLoader visible={loading} />
            <div style={{
              minHeight: "100vh", display: "flex", flexDirection: "column",
              background: "#F2EADB",
              paddingBottom: isAdmin ? 0 : "env(safe-area-inset-bottom, 0px)",
            }}>
              {!isAdmin && <Navbar />}
              <main style={{ flex: 1 }}>
                <Switch>
                  <Route path="/" component={HomePage} />
                  <Route path="/products" component={ProductsPage} />
                  <Route path="/products/:id" component={ProductDetailPage} />
                  <Route path="/cart" component={CartPage} />
                  <Route path="/checkout" component={CheckoutPage} />
                  <Route path="/policy" component={PolicyPage} />
                  <Route path="/wholesale" component={WholesalePage} />
                  <Route path="/ritual" component={RitualPage} />
                  <Route path="/magazine" component={MagazinePage} />
                  <Route path="/about" component={OurStoryPage} />
                  <Route path="/story" component={OurStoryPage} />
                  <Route path="/shipping">
                    {() => { window.location.href = "/policy"; return null; }}
                  </Route>
                  <Route path="/returns">
                    {() => { window.location.href = "/policy"; return null; }}
                  </Route>
                  <Route path="/profile" component={ProfilePage} />
                  <Route path="/admin" component={AdminPage} />
                  <Route path="/admin/:tab" component={AdminPage} />
                  <Route>
                    <div style={{
                      minHeight: "80vh", display: "flex", alignItems: "center",
                      justifyContent: "center", flexDirection: "column", gap: "2rem",
                      background: "#F2EADB",
                    }}>
                      <p style={{ fontFamily: "'Cascadia Code', monospace", fontSize: "8rem", fontWeight: 300, color: "#C8BBA4", lineHeight: 1 }}>404</p>
                      <NotFoundText />
                    </div>
                  </Route>
                </Switch>
              </main>

              {!isAdmin && <Footer />}
              {!isAdmin && <MobileBottomNav />}
              {!isAdmin && <AuthModal />}
              {/* CMS editor — only renders for logged-in admins */}
              {!isAdmin && <AdminToggle />}
              {!isAdmin && <CmsSidebar />}
            </div>
          </AuthModalProvider>
        </EditModeProvider>
      </SiteContentProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
