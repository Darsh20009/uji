import { useCart } from "../hooks/useCart";
import { Link } from "wouter";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";

const font = "'Cairo', sans-serif";
const mono = "'DM Mono', monospace";

export default function CartPage() {
  const { items, remove, update, clear } = useCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 200 ? 0 : 30;
  const total = subtotal + shipping;

  if (!items.length) return (
    <div style={{
      minHeight: "80vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "1.25rem",
      background: "#F2EADB", padding: "2rem",
    }}>
      <ShoppingBag size={48} color="#C8BBA4" strokeWidth={1} />
      <h2 style={{ fontFamily: font, fontSize: "1.3rem", fontWeight: 600, color: "#1C201B" }}>
        السلة فارغة
      </h2>
      <p style={{ fontFamily: font, fontSize: "0.85rem", color: "#9BA17B" }}>
        لم تضف أي منتجات بعد
      </p>
      <Link href="/products" className="btn-primary">تسوق الآن</Link>
    </div>
  );

  return (
    <div style={{ background: "#F2EADB", minHeight: "100vh", paddingTop: 90, paddingBottom: 100 }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <h1 style={{ fontFamily: font, fontWeight: 700, fontSize: "1.5rem", color: "#1C201B" }}>
            سلة التسوق
            <span style={{ fontFamily: mono, fontSize: "0.65rem", color: "#9BA17B", marginRight: "0.75rem", letterSpacing: "0.15em" }}>
              {items.reduce((s,i)=>s+i.qty,0)} قطعة
            </span>
          </h1>
          <button
            onClick={clear}
            style={{ background: "none", border: "none", fontFamily: font, fontSize: "0.75rem", color: "#C8BBA4", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
          >
            <Trash2 size={13} /> مسح الكل
          </button>
        </div>

        <div className="cart-layout">
          {/* Items list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {items.map((item) => (
              <div key={item._id} style={{
                display: "flex", gap: "1rem", padding: "1rem",
                background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.35)",
                alignItems: "center",
              }}>
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 72, height: 72, objectFit: "cover", flexShrink: 0 }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: font, fontWeight: 600, fontSize: "0.9rem", color: "#1C201B", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name}
                  </h3>
                  <p style={{ fontFamily: font, fontSize: "0.85rem", fontWeight: 700, color: "#1F3929" }}>
                    {item.price.toFixed(2)} ر.س
                  </p>
                </div>

                {/* Qty controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                  <button
                    onClick={() => update(item._id, item.qty - 1)}
                    style={{ width: 34, height: 34, border: "1px solid rgba(200,187,164,0.5)", background: "#F2EADB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 0 }}
                  >
                    <Minus size={13} />
                  </button>
                  <span style={{ fontFamily: mono, fontSize: "0.85rem", minWidth: 26, textAlign: "center", color: "#1C201B" }}>
                    {item.qty}
                  </span>
                  <button
                    onClick={() => update(item._id, item.qty + 1)}
                    style={{ width: 34, height: 34, border: "1px solid rgba(200,187,164,0.5)", background: "#F2EADB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 0 }}
                  >
                    <Plus size={13} />
                  </button>
                  <button
                    onClick={() => remove(item._id)}
                    style={{ width: 34, height: 34, border: "none", background: "none", cursor: "pointer", color: "#C8BBA4", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 4 }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary card */}
          <div className="cart-summary" style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.35)", padding: "1.5rem" }}>
            <p style={{ fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.2em", color: "#9BA17B", marginBottom: "1.25rem" }}>
              ORDER SUMMARY — ملخص الطلب
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: font, fontSize: "0.85rem", color: "#9BA17B" }}>المجموع الجزئي</span>
                <span style={{ fontFamily: font, fontSize: "0.85rem", color: "#1C201B" }}>{subtotal.toFixed(2)} ر.س</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: font, fontSize: "0.85rem", color: "#9BA17B" }}>الشحن</span>
                <span style={{ fontFamily: font, fontSize: "0.85rem", color: shipping === 0 ? "#059669" : "#1C201B" }}>
                  {shipping === 0 ? "🎉 مجاني" : `${shipping.toFixed(2)} ر.س`}
                </span>
              </div>
            </div>

            {subtotal < 200 && (
              <div style={{ background: "rgba(31,57,41,0.06)", border: "1px solid rgba(31,57,41,0.12)", padding: "10px 12px", marginBottom: "1.25rem" }}>
                <p style={{ fontFamily: font, fontSize: "0.75rem", color: "#1F3929", margin: 0 }}>
                  أضف <strong>{(200 - subtotal).toFixed(2)} ر.س</strong> للحصول على شحن مجاني
                </p>
                <div style={{ marginTop: 8, height: 3, background: "rgba(200,187,164,0.3)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${Math.min((subtotal/200)*100, 100)}%`, background: "#1F3929", borderRadius: 2, transition: "width 0.3s" }} />
                </div>
              </div>
            )}

            <div style={{ borderTop: "1px solid rgba(200,187,164,0.4)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <span style={{ fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif", fontSize: "1.1rem", color: "#1C201B" }}>الإجمالي</span>
              <span style={{ fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 500, color: "#1C201B" }}>{total.toFixed(2)} ر.س</span>
            </div>

            <Link href="/checkout" className="btn-primary" style={{ width: "100%", textAlign: "center", display: "block", height: 52, lineHeight: "52px" }}>
              إتمام الطلب ✦
            </Link>

            <Link href="/products" style={{ display: "block", textAlign: "center", fontFamily: font, fontSize: "0.78rem", color: "#9BA17B", marginTop: "1rem", textDecoration: "none" }}>
              ← متابعة التسوق
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 768px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
          .cart-summary {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}
