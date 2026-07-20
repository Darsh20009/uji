import { useCart } from "../hooks/useCart";
export default function CartPage() {
  const { items, remove, update, clear } = useCart();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  if (!items.length) return (
    <div style={{ textAlign: "center", padding: "6rem 1rem" }}>
      <p style={{ fontSize: "4rem" }}>🛒</p>
      <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>السلة فارغة</h2>
      <a href="/products" className="btn-primary">تسوق الآن</a>
    </div>
  );
  return (
    <div className="container" style={{ padding: "2rem 1rem" }}>
      <h1 style={{ fontWeight: 700, fontSize: "1.75rem", marginBottom: "2rem" }}>سلة التسوق</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.map((item) => (
            <div key={item._id} className="card" style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
              <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{item.name}</h3>
                <p style={{ color: "var(--accent)", fontWeight: 700 }}>{item.price.toFixed(2)} ر.س</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button onClick={() => update(item._id, item.qty - 1)} style={{ width: 32, height: 32, border: "1px solid var(--border)", background: "none", cursor: "pointer", borderRadius: 6, fontWeight: 700 }}>-</button>
                <span style={{ minWidth: 30, textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => update(item._id, item.qty + 1)} style={{ width: 32, height: 32, border: "1px solid var(--border)", background: "none", cursor: "pointer", borderRadius: 6, fontWeight: 700 }}>+</button>
                <button onClick={() => remove(item._id)} style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: "1.2rem" }}>×</button>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>ملخص الطلب</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}><span>المجموع الجزئي</span><span>{total.toFixed(2)} ر.س</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}><span>الشحن</span><span>{total >= 200 ? "مجاني" : "30.00 ر.س"}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem" }}><span>الإجمالي</span><span>{(total + (total >= 200 ? 0 : 30)).toFixed(2)} ر.س</span></div>
          <a href="/checkout" className="btn-primary" style={{ width: "100%", textAlign: "center" }}>إتمام الطلب</a>
        </div>
      </div>
    </div>
  );
}