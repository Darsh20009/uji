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
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminPage from "./pages/AdminPage";
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

  /* Page transition loader */
  useEffect(() => {
    if (location === prevLocation.current) return;
    prevLocation.current = location;
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

  if (showSplash) return <SplashScreen onDone={() => { setShowSplash(false); sessionStorage.setItem("uji-splash","1"); }} />;

  return (
    <ErrorBoundary>
      <AuthModalProvider>
        <PageLoader visible={loading} />
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          background: "#F2EADB",
          // Bottom padding for mobile nav
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
              <Route path="/admin" component={AdminPage} />
              <Route path="/admin/:tab" component={AdminPage} />
              {/* Catch-all 404 */}
              <Route>
                <div style={{
                  minHeight: "80vh", display: "flex", alignItems: "center",
                  justifyContent: "center", flexDirection: "column", gap: "2rem",
                  background: "#F2EADB",
                }}>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "8rem", fontWeight: 300, color: "#C8BBA4", lineHeight: 1 }}>404</p>
                  <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.9rem", color: "#9BA17B" }}>الصفحة غير موجودة</p>
                  <Link href="/" style={{
                    background: "#1F3929", color: "#F2EADB",
                    padding: "0.875rem 2.5rem", textDecoration: "none",
                    fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.9rem",
                  }}>العودة للرئيسية</Link>
                </div>
              </Route>
            </Switch>
          </main>

          {!isAdmin && <Footer />}
          {!isAdmin && <MobileBottomNav />}
          {!isAdmin && <AuthModal />}
        </div>
      </AuthModalProvider>
    </ErrorBoundary>
  );
}
