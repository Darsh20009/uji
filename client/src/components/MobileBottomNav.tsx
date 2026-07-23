import { Link, useLocation } from "wouter";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useAuthModal } from "../context/AuthModalContext";

export default function MobileBottomNav() {
  const [location] = useLocation();
  const { items } = useCart();
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  const isActive = (path: string) => location === path || (path !== "/" && location.startsWith(path));

  const activeColor = "#1F3929";
  const inactiveColor = "#4A7C59";

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 900,
      background: "rgba(253,250,245,0.96)",
      backdropFilter: "blur(16px)",
      borderTop: "1px solid rgba(200,187,164,0.35)",
      display: "flex", alignItems: "stretch",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }} className="lg:hidden">
      {[
        {
          href: "/", label: "الرئيسية", icon: (active: boolean) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? activeColor : inactiveColor} strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          )
        },
        {
          href: "/products", label: "تسوق", icon: (active: boolean) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? activeColor : inactiveColor} strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.56L23 6H6"/>
            </svg>
          )
        },
        {
          href: "/cart", label: "السلة", badge: cartCount, icon: (active: boolean) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? activeColor : inactiveColor} strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          )
        },
        {
          href: "/wholesale", label: "الجملة", icon: (active: boolean) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? activeColor : inactiveColor} strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
          )
        },
        {
          href: user ? "/profile" : null, label: user ? "حسابي" : "دخول", icon: (active: boolean) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? activeColor : inactiveColor} strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          )
        },
      ].map(({ href, label, icon, badge }) => {
        const active = href ? isActive(href) : false;
        const color = active ? activeColor : inactiveColor;

        const content = (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, padding: "8px 6px 6px", position: "relative", cursor: "pointer",
            minWidth: 50,
          }}>
            <div style={{ position: "relative" }}>
              {icon(active)}
              {(badge ?? 0) > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -6,
                  background: "#78933C", color: "#F2EADB",
                  borderRadius: "50%", width: 16, height: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontFamily: "'Inter', sans-serif", fontWeight: 600,
                }}>{badge}</span>
              )}
            </div>
            <span style={{
              fontSize: "0.6rem", fontFamily: "'Cairo', sans-serif",
              color, letterSpacing: "0.02em", lineHeight: 1,
            }}>{label}</span>
            {active && (
              <div style={{
                position: "absolute", bottom: 0, left: "50%",
                transform: "translateX(-50%)",
                width: 20, height: 2, background: activeColor, borderRadius: 1,
              }} />
            )}
          </div>
        );

        if (!href || (!user && label === "دخول")) {
          return (
            <div key={label} style={{ flex: 1, display: "flex", justifyContent: "center" }}
              onClick={() => !user && openAuth("login")}>
              {content}
            </div>
          );
        }

        return (
          <Link key={label} href={href} style={{ flex: 1, display: "flex", justifyContent: "center", textDecoration: "none" }}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
