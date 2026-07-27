import { useRef, useEffect, useState, useCallback } from "react";
import { useEditMode } from "../../context/EditModeContext";
import { useSiteContent } from "../../context/SiteContentContext";
import { CONTENT_REGISTRY, ContentField } from "./ContentRegistry";

/* ─── Image upload helper ──────────────────────────────────────── */
function ImageField({ field, value, onChange }: { field: ContentField; value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

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
        onChange(url);
      }
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {value && (
        <img
          src={value}
          alt={field.label}
          style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 3, border: "1px solid rgba(200,187,164,0.25)" }}
        />
      )}
      <button
        onClick={() => ref.current?.click()}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
          padding: "0.5rem 1rem", background: "rgba(155,161,123,0.15)",
          border: "1px solid rgba(155,161,123,0.3)", borderRadius: 3,
          color: "#9BA17B", cursor: "pointer", fontFamily: "'Mirza', serif", fontSize: "0.8rem",
          width: "100%",
        }}
      >
        {uploading ? "⟳ جاري الرفع..." : "⬆ تغيير الصورة"}
      </button>
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

/* ─── Single field row ─────────────────────────────────────────── */
function FieldRow({ field, isActive, onClick }: { field: ContentField; isActive: boolean; onClick: () => void }) {
  const { getContent, updateContent } = useSiteContent();
  const value = getContent(field.key, field.default);
  const rowRef = useRef<HTMLDivElement>(null);

  // Scroll into view when activated from page click
  useEffect(() => {
    if (isActive && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive]);

  const base: React.CSSProperties = {
    padding: "0.75rem",
    borderRadius: 4,
    marginBottom: "0.5rem",
    border: isActive ? "1.5px solid #9BA17B" : "1px solid rgba(200,187,164,0.18)",
    background: isActive ? "rgba(155,161,123,0.1)" : "rgba(255,255,255,0.03)",
    transition: "all 0.15s",
    cursor: field.type === "section" ? "default" : "default",
  };

  return (
    <div ref={rowRef} style={base} onClick={onClick}>
      <label style={{ display: "block", fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.08em", color: "#9BA17B", marginBottom: "0.45rem", textTransform: "uppercase" }}>
        {field.label}
      </label>

      {field.type === "section" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.8rem", color: "rgba(242,234,219,0.6)" }}>
            {value === "false" ? "مخفي" : "ظاهر"}
          </span>
          <button
            onClick={e => { e.stopPropagation(); updateContent(field.key, value === "false" ? "true" : "false"); }}
            style={{
              width: 40, height: 22, borderRadius: 11,
              background: value === "false" ? "rgba(155,161,123,0.2)" : "#9BA17B",
              border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
            }}
          >
            <span style={{
              position: "absolute", top: 3, width: 16, height: 16, borderRadius: "50%",
              background: "#fff", transition: "left 0.2s",
              left: value === "false" ? 3 : 21,
            }} />
          </button>
        </div>
      )}

      {field.type === "text" && (
        <input
          type="text"
          value={value}
          onChange={e => updateContent(field.key, e.target.value)}
          dir="auto"
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(200,187,164,0.2)",
            borderRadius: 3, padding: "0.45rem 0.65rem",
            fontFamily: "'Mirza', serif", fontSize: "0.88rem", color: "#F2EADB",
            outline: "none",
          }}
        />
      )}

      {field.type === "textarea" && (
        <textarea
          value={value}
          onChange={e => updateContent(field.key, e.target.value)}
          rows={3}
          dir="auto"
          style={{
            width: "100%", boxSizing: "border-box", resize: "vertical",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(200,187,164,0.2)",
            borderRadius: 3, padding: "0.45rem 0.65rem",
            fontFamily: "'Mirza', serif", fontSize: "0.88rem", color: "#F2EADB",
            lineHeight: 1.7, outline: "none",
          }}
        />
      )}

      {field.type === "image" && (
        <ImageField field={field} value={value} onChange={v => updateContent(field.key, v)} />
      )}
    </div>
  );
}

/* ─── Group block ──────────────────────────────────────────────── */
function GroupBlock({ group, query, activeKey, onFieldClick }: {
  group: (typeof CONTENT_REGISTRY)[0];
  query: string;
  activeKey: string | null;
  onFieldClick: (key: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const filtered = query
    ? group.fields.filter(f => f.label.includes(query) || f.key.includes(query))
    : group.fields;
  if (!filtered.length) return null;
  return (
    <div style={{ marginBottom: "0.25rem" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.6rem 0.75rem", borderRadius: 4,
          color: "#F2EADB", fontFamily: "'Mirza', serif", fontSize: "0.9rem", fontWeight: 500,
          textAlign: "right",
        }}
      >
        <span style={{ color: "#9BA17B", fontSize: "0.6rem", fontFamily: "monospace", lineHeight: 1 }}>
          {open ? "▾" : "▸"}
        </span>
        <span style={{ flex: 1 }}>{group.label}</span>
        <span style={{ fontSize: "0.6rem", color: "rgba(155,161,123,0.5)", fontFamily: "monospace" }}>
          {filtered.length}
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 0.5rem 0.5rem" }}>
          {filtered.map(f => (
            <FieldRow
              key={f.key}
              field={f}
              isActive={activeKey === f.key}
              onClick={() => onFieldClick(f.key)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Shortcuts help ───────────────────────────────────────────── */
const SHORTCUTS = [
  { key: "Ctrl + E",   label: "تفعيل/إيقاف التعديل" },
  { key: "Ctrl + S",   label: "حفظ يدوي" },
  { key: "Esc",        label: "إغلاق الشريط" },
];

/* ══════════════════════════════════════════════════════════════════
   CMS SIDEBAR
══════════════════════════════════════════════════════════════════ */
export function CmsSidebar() {
  const { editMode, setEditMode, activeKey, setActiveKey } = useEditMode();
  const { saveStatus, forceSave } = useSiteContent();
  const [query, setQuery] = useState("");

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "e") { e.preventDefault(); setEditMode(!editMode); }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); forceSave(); }
      if (e.key === "Escape" && editMode) setEditMode(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editMode, setEditMode, forceSave]);

  if (!editMode) return null;

  const statusColor = { idle: "transparent", saving: "#C89B5A", saved: "#78933C", error: "#c0392b" }[saveStatus];
  const statusLabel = { idle: "", saving: "حفظ...", saved: "✓ محفوظ", error: "⚠ خطأ" }[saveStatus];

  return (
    <div
      style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 99999,
        width: 340, background: "#0E1E14",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
        display: "flex", flexDirection: "column",
        fontFamily: "'Mirza', serif",
        animation: "slideInRight 0.25s ease",
      }}
    >
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        .cms-input:focus { border-color: #9BA17B !important; }
        .cms-scroll::-webkit-scrollbar { width: 4px }
        .cms-scroll::-webkit-scrollbar-track { background: transparent }
        .cms-scroll::-webkit-scrollbar-thumb { background: rgba(155,161,123,0.3); border-radius: 2px }
      `}</style>

      {/* ─ Header ─ */}
      <div style={{ padding: "1rem 1rem 0.75rem", borderBottom: "1px solid rgba(200,187,164,0.1)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#9BA17B", letterSpacing: "0.15em" }}>UJI</span>
            <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.88rem", color: "#F2EADB", fontWeight: 500 }}>محرر المحتوى</span>
          </div>
          <button
            onClick={() => setEditMode(false)}
            title="إغلاق (Esc)"
            style={{ background: "none", border: "none", color: "rgba(242,234,219,0.4)", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1, padding: "0.15rem" }}
          >✕</button>
        </div>

        {/* Save status */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            onClick={forceSave}
            title="Ctrl+S"
            style={{
              flex: 1, padding: "0.55rem", background: "#1F3929", color: "#9BA17B",
              border: "1px solid rgba(155,161,123,0.25)", borderRadius: 4,
              cursor: "pointer", fontFamily: "'Mirza', serif", fontSize: "0.82rem",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem",
            }}
          >
            💾 حفظ الكل
          </button>
          {saveStatus !== "idle" && (
            <span style={{ fontSize: "0.75rem", color: statusColor, whiteSpace: "nowrap" }}>
              {statusLabel}
            </span>
          )}
        </div>
      </div>

      {/* ─ Search ─ */}
      <div style={{ padding: "0.65rem 1rem", borderBottom: "1px solid rgba(200,187,164,0.08)", flexShrink: 0 }}>
        <input
          type="text"
          placeholder="🔍 بحث في الحقول..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          dir="rtl"
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(200,187,164,0.15)",
            borderRadius: 4, padding: "0.5rem 0.75rem",
            fontFamily: "'Mirza', serif", fontSize: "0.85rem", color: "#F2EADB",
            outline: "none",
          }}
        />
      </div>

      {/* ─ Content groups ─ */}
      <div className="cms-scroll" style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
        {CONTENT_REGISTRY.map(group => (
          <GroupBlock
            key={group.id}
            group={group}
            query={query}
            activeKey={activeKey}
            onFieldClick={setActiveKey}
          />
        ))}
      </div>

      {/* ─ Shortcuts footer ─ */}
      <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid rgba(200,187,164,0.08)", flexShrink: 0 }}>
        <p style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(155,161,123,0.4)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          اختصارات لوحة المفاتيح
        </p>
        {SHORTCUTS.map(s => (
          <div key={s.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
            <span style={{ fontFamily: "'Mirza', serif", fontSize: "0.72rem", color: "rgba(242,234,219,0.4)" }}>{s.label}</span>
            <kbd style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#9BA17B", background: "rgba(155,161,123,0.12)", padding: "0.15rem 0.4rem", borderRadius: 3, border: "1px solid rgba(155,161,123,0.2)" }}>
              {s.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}
