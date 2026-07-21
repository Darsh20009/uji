import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", search],
    queryFn: () => api.get(`/products${search ? "?q=" + search : ""}`),
  });

  return (
    <div style={{ background: "#F2EADB", minHeight: "100vh", paddingTop: 100 }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(200,187,164,0.35)",
        padding: "4rem 0 3rem",
      }}>
        <div className="container">
          <p style={{
            fontFamily: "'Inter',sans-serif", fontSize: "0.6rem",
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "#9BA17B", marginBottom: "1rem",
          }}>THE COLLECTION</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <h1 style={{
              fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif",
              fontSize: "clamp(2.5rem,5vw,4rem)",
              fontWeight: 300, color: "#1C201B", lineHeight: 1,
            }}>المجموعة</h1>

            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              border: "1px solid rgba(200,187,164,0.5)",
              padding: "0 1rem", background: "#F7F2E8",
            }}>
              <Search size={14} strokeWidth={1.5} style={{ color: "#9BA17B", flexShrink: 0 }} />
              <input
                placeholder="ابحث عن منتج..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  border: "none", background: "transparent",
                  padding: "0.75rem 0", width: 220,
                  fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                  fontSize: "0.85rem",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container section-sm">
        {isLoading && (
          <div style={{ textAlign: "center", padding: "5rem", color: "#9BA17B", fontFamily: "'Inter',sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em" }}>
            LOADING...
          </div>
        )}
        {!isLoading && products?.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem", color: "#9BA17B" }}>
            <p style={{ fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 300 }}>لا توجد منتجات</p>
          </div>
        )}
        {products?.length > 0 && (
          <div className="grid-products">
            {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
