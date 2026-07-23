import { useEffect, useRef, useState } from "react";

const FRAMES = Array.from({ length: 13 }, (_, i) =>
  `/assets/ninja/n${String(i + 1).padStart(2, "0")}.png`
);
const FPS = 14; // frames per second — fast like video

export default function PageLoader({ visible }: { visible: boolean }) {
  const [frame, setFrame] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Fade in/out */
  useEffect(() => {
    if (visible) {
      setOpacity(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setOpacity(1)));
    } else {
      setOpacity(0);
    }
  }, [visible]);

  /* Frame animation */
  useEffect(() => {
    if (visible) {
      intervalRef.current = setInterval(() => {
        setFrame(f => (f + 1) % FRAMES.length);
      }, 1000 / FPS);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible]);

  if (!visible && opacity === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        background: "rgba(16,26,20,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        opacity,
        transition: "opacity 0.25s ease",
        pointerEvents: visible ? "all" : "none",
      }}
    >
      {/* ── Spinning ring + ninja frame ── */}
      <div style={{ position: "relative", width: 220, height: 220 }}>

        {/* Outer spinning ring */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "2px solid transparent",
          borderTopColor: "#9BA17B",
          borderRightColor: "rgba(155,161,123,0.3)",
          borderBottomColor: "rgba(155,161,123,0.1)",
          borderLeftColor: "rgba(155,161,123,0.3)",
          animation: "uji-spin 1s linear infinite",
        }} />

        {/* Inner counter-spinning ring (matcha green accent) */}
        <div style={{
          position: "absolute",
          inset: 12,
          borderRadius: "50%",
          border: "1px solid transparent",
          borderTopColor: "rgba(155,161,123,0.2)",
          borderBottomColor: "#4C5734",
          animation: "uji-spin-rev 1.6s linear infinite",
        }} />

        {/* White circle frame — mix-blend: multiply erases white bg */}
        <div style={{
          position: "absolute",
          inset: 20,
          borderRadius: "50%",
          background: "#fff",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {FRAMES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              style={{
                position: "absolute",
                width: "90%",
                height: "90%",
                objectFit: "contain",
                mixBlendMode: "multiply",
                opacity: i === frame ? 1 : 0,
                transition: "none",
              }}
            />
          ))}
        </div>

        {/* Center dot */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: 6, height: 6,
          borderRadius: "50%",
          background: "#9BA17B",
          transform: "translate(-50%,-50%)",
          boxShadow: "0 0 12px 3px rgba(155,161,123,0.6)",
        }} />
      </div>

      {/* ── Brand label ── */}
      <div style={{ textAlign: "center" }}>
        <p style={{
          fontFamily: "'DM Mono',monospace",
          fontSize: "0.52rem",
          letterSpacing: "0.55em",
          color: "rgba(155,161,123,0.9)",
          textTransform: "uppercase",
          marginBottom: "0.4rem",
        }}>UJI MATCHA</p>
        <div style={{
          width: 120, height: 1,
          background: "linear-gradient(to right, transparent, rgba(155,161,123,0.6), transparent)",
          margin: "0 auto",
          animation: "uji-pulse 1.4s ease-in-out infinite",
        }} />
      </div>

      <style>{`
        @keyframes uji-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes uji-spin-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes uji-pulse {
          0%,100% { opacity: 0.3; transform: scaleX(0.6); }
          50%      { opacity: 1;   transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
