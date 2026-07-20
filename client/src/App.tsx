import { useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import { AuthModalProvider } from "./context/AuthModalContext";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminPage from "./pages/AdminPage";
import { Link } from "wouter";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

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
    <AuthModalProvider>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F2EADB" }}>
        {!isAdmin && <Navbar />}
        <main style={{ flex: 1 }}>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/products" component={ProductsPage} />
            <Route path="/products/:id" component={ProductDetailPage} />
            <Route path="/cart" component={CartPage} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/admin/:tab" component={AdminPage} />
            <Route>
              <div style={{
                minHeight: "80vh", display: "flex", alignItems: "center",
                justifyContent: "center", flexDirection: "column", gap: "2rem",
                background: "#F2EADB",
              }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "8rem", fontWeight: 300, color: "#C8BBA4", lineHeight: 1 }}>404</p>
                <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.9rem", color: "#9BA17B" }}>الصفحة غير موجودة</p>
                <Link href="/" className="btn-primary">العودة للرئيسية</Link>
              </div>
            </Route>
          </Switch>
        </main>
        {!isAdmin && <Footer />}

        {/* Auth modal — rendered at root so it works on every page */}
        {!isAdmin && <AuthModal />}
      </div>
    </AuthModalProvider>
  );
}
