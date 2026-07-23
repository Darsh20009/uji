import { useEffect, useRef, useState } from "react";

const FRAMES = Array.from({ length: 13 }, (_, i) =>
  `/assets/ninja/n${String(i + 1).padStart(2, "0")}.png`
);
const FPS = 14;

export default function PageLoader({ visible }: { visible: boolean }) {
  const [frame, setFrame] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (visible) {
      setOpacity(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setOpacity(1)));
    } else {
      setOpacity(0);
    }
  }, [visible]);

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
        /* Dark green overlay — multiply blend erases white bg from ninja frames */
        background: "rgba(14, 24, 18, 0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        opacity,
        transition: "opacity 0.25s ease",
        pointerEvents: visible ? "all" : "none",
      }}
    >
      {/* ── Ninja sprite — no circle, centered, multiply blends away white bg ── */}
      <div style={{
        position: "relative",
        width: "clamp(260px, 38vh, 400px)",
        height: "clamp(260px, 38vh, 400px)",
      }}>
        {FRAMES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              /* multiply: white pixels × dark bg = dark bg (invisible), dark ninja stays dark */
              mixBlendMode: "multiply",
              opacity: i === frame ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* ── Spinning arc accent — decorative, not clipping the image ── */}
      <div style={{
        position: "absolute",
        width: "clamp(300px, 44vh, 460px)",
        height: "clamp(300px, 44vh, 460px)",
        borderRadius: "50%",
        border: "1px solid transparent",
        borderTopColor: "rgba(155,161,123,0.55)",
        borderRightColor: "rgba(155,161,123,0.18)",
        animation: "uji-spin 1.4s linear infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        width: "clamp(320px, 48vh, 500px)",
        height: "clamp(320px, 48vh, 500px)",
        borderRadius: "50%",
        border: "1px solid transparent",
        borderBottomColor: "rgba(76,87,52,0.7)",
        animation: "uji-spin-rev 2s linear infinite",
        pointerEvents: "none",
      }} />

      {/* ── Brand label ── */}
      <div style={{ textAlign: "center", position: "relative" }}>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.52rem",
          letterSpacing: "0.6em",
          color: "rgba(155,161,123,0.85)",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}>UJI MATCHA</p>
        <div style={{
          width: 80,
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(155,161,123,0.5), transparent)",
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
          0%,100% { opacity: 0.3; transform: scaleX(0.5); }
          50%      { opacity: 1;   transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
