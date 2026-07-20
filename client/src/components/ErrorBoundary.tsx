import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
    // If chunk load failure, refresh once
    if (error.message?.includes("dynamically imported") || error.message?.includes("Failed to fetch")) {
      sessionStorage.setItem("uji-chunk-reload", "1");
      window.location.reload();
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#F2EADB", padding: "2rem", textAlign: "center",
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
      }}>
        <img src="/assets/brand/uji-logo-forest-green-transparent.png" alt="UJI" style={{ height: 60, marginBottom: "2rem", objectFit: "contain" }} />
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "#1C201B", marginBottom: "1rem" }}>
          حدث خطأ غير متوقع
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#9BA17B", marginBottom: "2rem", lineHeight: 1.8 }}>
          نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.
        </p>
        <button
          onClick={() => window.location.href = "/"}
          style={{
            background: "#1F3929", color: "#F2EADB", border: "none",
            padding: "0.875rem 2.5rem", cursor: "pointer",
            fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: "0.9rem",
            letterSpacing: "0.05em",
          }}
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }
}
