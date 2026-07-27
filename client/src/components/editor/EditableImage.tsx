import { useRef, useState, CSSProperties } from "react";
import { useEditMode } from "../../context/EditModeContext";
import { useSiteContent } from "../../context/SiteContentContext";

interface Props {
  contentKey: string;
  defaultSrc: string;
  alt?: string;
  style?: CSSProperties;
  className?: string;
  imgStyle?: CSSProperties;
}

export function EditableImage({ contentKey, defaultSrc, alt = "", style, className, imgStyle }: Props) {
  const { editMode } = useEditMode();
  const { getContent, updateContent } = useSiteContent();
  const [hovered, setHovered] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const src = getContent(contentKey, defaultSrc);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/site-content/image", {
        method: "POST", credentials: "include", body: fd,
      });
      if (res.ok) {
        const { url } = await res.json();
        updateContent(contentKey, url);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  if (!editMode) {
    return (
      <div style={style} className={className}>
        <img src={src} alt={alt} style={imgStyle} />
      </div>
    );
  }

  return (
    <div
      style={{ ...style, position: "relative", cursor: "pointer" }}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => inputRef.current?.click()}
    >
      <img src={src} alt={alt} style={{ ...imgStyle, transition: "opacity 0.2s", opacity: hovered ? 0.65 : 1 }} />

      {/* Overlay */}
      {hovered && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "0.5rem", pointerEvents: "none",
        }}>
          <div style={{
            background: "rgba(31,57,41,0.92)", color: "#F2EADB",
            padding: "0.6rem 1.25rem", borderRadius: 4,
            fontFamily: "'Mirza', serif", fontSize: "0.85rem",
            display: "flex", alignItems: "center", gap: "0.4rem",
          }}>
            {uploading ? "جاري الرفع..." : "🖼 تغيير الصورة"}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
