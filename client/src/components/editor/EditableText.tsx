import { useState, useRef, useEffect, ElementType, CSSProperties } from "react";
import { useEditMode } from "../../context/EditModeContext";
import { useSiteContent } from "../../context/SiteContentContext";

interface Props {
  contentKey: string;
  defaultValue: string;
  as?: ElementType;
  multiline?: boolean;
  style?: CSSProperties;
  className?: string;
  label?: string;
}

function EditModal({
  label, value, multiline, onSave, onClose,
}: { label: string; value: string; multiline?: boolean; onSave: (v: string) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => ref.current?.focus(), 50); }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999999,
        background: "rgba(0,0,0,0.55)", display: "flex",
        alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 8, padding: "1.5rem",
          width: "min(92vw, 520px)", boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
          direction: "rtl",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#9BA17B", letterSpacing: "0.08em" }}>
            ✏ {label}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#9BA17B", lineHeight: 1, padding: 0 }}>✕</button>
        </div>

        {multiline ? (
          <textarea
            ref={ref as any}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={5}
            onKeyDown={e => { if (e.key === "Escape") onClose(); }}
            style={{
              width: "100%", border: "1.5px solid #C8BBA4", borderRadius: 4,
              padding: "0.75rem", fontFamily: "'Mirza', serif", fontSize: "1rem",
              resize: "vertical", outline: "none", boxSizing: "border-box",
              direction: "rtl", lineHeight: 1.75,
            }}
          />
        ) : (
          <input
            ref={ref as any}
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") { onSave(draft); onClose(); }
              if (e.key === "Escape") onClose();
            }}
            style={{
              width: "100%", border: "1.5px solid #C8BBA4", borderRadius: 4,
              padding: "0.75rem", fontFamily: "'Mirza', serif", fontSize: "1rem",
              outline: "none", boxSizing: "border-box", direction: "rtl",
            }}
          />
        )}

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button
            onClick={() => { onSave(draft); onClose(); }}
            style={{
              padding: "0.55rem 1.75rem", background: "#1F3929", color: "#F2EADB",
              border: "none", borderRadius: 4, cursor: "pointer",
              fontFamily: "'Mirza', serif", fontSize: "0.9rem",
            }}
          >حفظ</button>
          <button
            onClick={onClose}
            style={{
              padding: "0.55rem 1rem", background: "none", color: "#9BA17B",
              border: "1px solid #C8BBA4", borderRadius: 4, cursor: "pointer",
              fontFamily: "'Mirza', serif", fontSize: "0.9rem",
            }}
          >إلغاء</button>
        </div>
      </div>
    </div>
  );
}

export function EditableText({
  contentKey, defaultValue, as: Tag = "span",
  multiline = false, style, className, label,
}: Props) {
  const { editMode } = useEditMode();
  const { getContent, updateContent } = useSiteContent();
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const value = getContent(contentKey, defaultValue);

  const editStyle: CSSProperties = editMode ? {
    outline: hovered ? "2px dashed #3b82f6" : "2px dashed transparent",
    outlineOffset: 3,
    cursor: "text",
    borderRadius: 2,
    transition: "outline-color 0.15s",
  } : {};

  const El = Tag as any;

  return (
    <>
      <El
        className={className}
        style={{ ...style, ...editStyle }}
        onMouseEnter={() => editMode && setHovered(true)}
        onMouseLeave={() => editMode && setHovered(false)}
        onClick={(e: React.MouseEvent) => { if (!editMode) return; e.stopPropagation(); setOpen(true); }}
        dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, "<br/>") }}
      />
      {open && (
        <EditModal
          label={label ?? contentKey}
          value={value}
          multiline={multiline}
          onSave={v => updateContent(contentKey, v)}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
