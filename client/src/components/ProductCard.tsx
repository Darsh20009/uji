import { useState } from "react";
import { Link } from "wouter";
import { useCart } from "../hooks/useCart";
import { ShoppingBag } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  const { add } = useCart();
  const [hovered, setHovered] = useState(false);

  // Prefer transparent version if available (by naming convention)
  const rawImg = product.images?.[0] || "";
  const img = rawImg || "/assets/packaging/uji-tin-front-transparent.png";

  return (
    <div
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#F7F2E8",
        border: "1px solid rgba(200,187,164,0.25)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Image */}
      <Link href={`/products/${product._id}`}>
        <div style={{
          aspectRatio: "3/4", overflow: "hidden",
          background: "#F2EADB",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img
            src={img}
            alt={product.name}
            style={{
              width: "75%", height: "75%", objectFit: "contain",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          />
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: "1.25rem 1.25rem 1.5rem" }}>
        {/* Category tag */}
        {product.category && (
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase",
            color: "#9BA17B", marginBottom: "0.5rem",
          }}>
            MATCHA
          </p>
        )}

        <Link href={`/products/${product._id}`}>
          <h3 style={{
            fontFamily: "'IBM Plex Sans Arabic', sans-serif",
            fontSize: "0.92rem", fontWeight: 400,
            color: "#1C201B", lineHeight: 1.4,
            marginBottom: "1rem",
          }}>
            {product.name}
          </h3>
        </Link>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid rgba(200,187,164,0.25)", paddingTop: "1rem",
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.1rem", fontWeight: 400,
            color: "#1F3929",
          }}>
            {product.price?.toFixed(0)} <span style={{ fontSize: "0.7rem", fontFamily: "'Inter',sans-serif", letterSpacing: "0.05em" }}>ر.س</span>
          </span>

          <button
            onClick={() => add({ _id: product._id, name: product.name, price: product.price, image: img })}
            style={{
              background: "none", border: "1px solid rgba(31,57,41,0.35)",
              padding: "0.4rem 0.875rem",
              display: "flex", alignItems: "center", gap: "0.4rem",
              fontFamily: "'Inter',sans-serif", fontSize: "0.6rem",
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "#1F3929",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "#1F3929";
              (e.currentTarget as HTMLButtonElement).style.color = "#F2EADB";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "none";
              (e.currentTarget as HTMLButtonElement).style.color = "#1F3929";
            }}
          >
            <ShoppingBag size={12} strokeWidth={1.5} />
            أضف
          </button>
        </div>
      </div>

      {/* Stock badge */}
      {product.stock === 0 && (
        <div style={{
          position: "absolute", top: "1rem", left: "1rem",
          background: "rgba(28,32,27,0.75)", color: "#F2EADB",
          fontFamily: "'Inter',sans-serif", fontSize: "0.6rem",
          letterSpacing: "0.15em", textTransform: "uppercase",
          padding: "0.25rem 0.6rem",
        }}>
          نفذ
        </div>
      )}
    </div>
  );
}
