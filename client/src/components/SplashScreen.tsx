import { useEffect, useState } from "react";

interface Props { onDone: () => void; }

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 2800);
    const t3 = setTimeout(onDone, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#16281D",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.6s ease" : "none",
        pointerEvents: "none",
      }}
    >
      {/* Background texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(/assets/hero/uji-hero-tin-powder-explosion.png)`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.08,
      }} />

      {/* Logo */}
      <div
        style={{
          position: "relative", zIndex: 1,
          opacity: phase === "enter" ? 0 : 1,
          transform: phase === "enter" ? "translateY(12px)" : "translateY(0)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem",
        }}
      >
        <img
          src="/assets/brand/uji-logo-white-transparent.png"
          alt="UJI MATCHA"
          style={{ height: 72, width: "auto", objectFit: "contain" }}
        />

        {/* Thin horizontal line */}
        <div style={{
          width: phase === "hold" || phase === "exit" ? 80 : 0,
          height: 1, background: "rgba(155, 161, 123, 0.6)",
          transition: "width 1.2s ease 0.3s",
        }} />

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.625rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(155, 161, 123, 0.85)",
          opacity: phase === "hold" || phase === "exit" ? 1 : 0,
          transition: "opacity 0.8s ease 0.6s",
        }}>
          CEREMONIAL JAPANESE MATCHA
        </p>
      </div>
    </div>
  );
}
