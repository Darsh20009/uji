import { ReactNode, useState } from "react";
import { useEditMode } from "../../context/EditModeContext";
import { useSiteContent } from "../../context/SiteContentContext";

interface Props {
  contentKey: string;          // e.g. "home.section.tin"
  label?: string;              // Human-readable section name
  defaultVisible?: boolean;
  children: ReactNode;
}

export function EditableSection({ contentKey, label = "قسم", defaultVisible = true, children }: Props) {
  const { editMode } = useEditMode();
  const { getContent, updateContent } = useSiteContent();
  const [hovered, setHovered] = useState(false);

  const rawVal = getContent(contentKey, defaultVisible ? "true" : "false");
  const visible = rawVal !== "false";

  // In non-edit mode: if hidden, render nothing
  if (!editMode && !visible) return null;

  // In edit mode: show hidden sections as collapsed placeholder
  if (editMode && !visible) {
    return (
      <div style={{
        border: "2px dashed rgba(59,130,246,0.4)", borderRadius: 4,
        padding: "1.25rem 1.5rem", margin: "0.5rem 0",
        background: "rgba(59,130,246,0.04)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#3b82f6", opacity: 0.7 }}>
          {label} — مخفي
        </span>
        <button
          onClick={() => updateContent(contentKey, "true")}
          style={{
            padding: "0.35rem 1rem", background: "#1F3929", color: "#F2EADB",
            border: "none", borderRadius: 4, cursor: "pointer",
            fontFamily: "'Mirza', serif", fontSize: "0.8rem",
          }}
        >إظهار</button>
      </div>
    );
  }

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => editMode && setHovered(true)}
      onMouseLeave={() => editMode && setHovered(false)}
    >
      {children}

      {/* Section control bar */}
      {editMode && hovered && (
        <div style={{
          position: "absolute", top: 8, left: 8, zIndex: 99998,
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: "rgba(31,57,41,0.92)", padding: "0.3rem 0.75rem",
          borderRadius: 4, boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#9BA17B", letterSpacing: "0.08em" }}>{label}</span>
          <button
            onClick={() => updateContent(contentKey, "false")}
            style={{
              background: "none", border: "1px solid rgba(242,234,219,0.3)",
              color: "#F2EADB", padding: "0.15rem 0.6rem", borderRadius: 3,
              cursor: "pointer", fontSize: "0.7rem", fontFamily: "'Mirza', serif",
            }}
          >إخفاء</button>
        </div>
      )}
    </div>
  );
}
