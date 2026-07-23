import { useEffect, useRef, useState } from "react";

const FRAMES = Array.from({ length: 12 }, (_, i) =>
  `/assets/ninja/f${String(i + 1).padStart(2, "0")}.png`
);
const FPS = 16;

export default function PageLoader({ visible }: { visible: boolean }) {
  const [frame, setFrame] = useState(0);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      intervalRef.current = setInterval(() => {
        setFrame(f => (f + 1) % FRAMES.length);
      }, 1000 / FPS);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible]);

  if (!mounted) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(3px)",
      WebkitBackdropFilter: "blur(3px)",
      background: "rgba(0,0,0,0.15)",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.18s ease",
      pointerEvents: visible ? "all" : "none",
    }}>
      {/* Small ninja — screen blend makes black bg transparent */}
      <div style={{ position: "relative", width: 140, height: 140 }}>
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
              mixBlendMode: "screen",
              opacity: i === frame ? 1 : 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
