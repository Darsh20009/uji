import { useEditMode } from "../../context/EditModeContext";
import { useSiteContent } from "../../context/SiteContentContext";
import { useAuth } from "../../hooks/useAuth";

const ADMIN_PHONE = "0552469643";

function isAdmin(user: any) {
  if (!user) return false;
  return user.phone === ADMIN_PHONE || user.role === "admin" || user.role === "employee";
}

const STATUS_LABEL: Record<string, string> = {
  idle: "",
  saving: "جاري الحفظ...",
  saved: "✓ تم الحفظ",
  error: "⚠ خطأ في الحفظ",
};
const STATUS_COLOR: Record<string, string> = {
  idle: "transparent",
  saving: "#C89B5A",
  saved: "#78933C",
  error: "#c0392b",
};

export function EditToolbar() {
  const { user } = useAuth();
  const { editMode, setEditMode } = useEditMode();
  const { saveStatus, forceSave } = useSiteContent();

  if (!isAdmin(user)) return null;

  return (
    <>
      {/* Floating button — bottom right */}
      <div style={{
        position: "fixed", bottom: "calc(env(safe-area-inset-bottom, 0px) + 5rem)", left: "1rem",
        zIndex: 99999, display: "flex", alignItems: "center", gap: "0.5rem",
        filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.25))",
      }}>
        {/* Save status badge */}
        {saveStatus !== "idle" && (
          <div style={{
            background: STATUS_COLOR[saveStatus], color: "#fff",
            padding: "0.4rem 0.85rem", borderRadius: 20,
            fontFamily: "'Mirza', serif", fontSize: "0.8rem",
            transition: "all 0.3s",
          }}>
            {STATUS_LABEL[saveStatus]}
          </div>
        )}

        {/* Edit toggle */}
        <button
          onClick={() => setEditMode(!editMode)}
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.6rem 1.1rem", borderRadius: 24,
            background: editMode ? "#1F3929" : "#F7F2E8",
            color: editMode ? "#9BA17B" : "#1F3929",
            border: editMode ? "1.5px solid #9BA17B" : "1.5px solid #1F3929",
            cursor: "pointer", fontFamily: "'Mirza', serif", fontSize: "0.88rem",
            fontWeight: 500, whiteSpace: "nowrap",
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
            transition: "all 0.2s",
          }}
        >
          {editMode ? "✓ إنهاء التعديل" : "✏ تعديل الموقع"}
        </button>

        {/* Force save (only in edit mode) */}
        {editMode && (
          <button
            onClick={forceSave}
            style={{
              padding: "0.6rem 0.9rem", borderRadius: 24,
              background: "#9BA17B", color: "#1C201B",
              border: "none", cursor: "pointer",
              fontFamily: "'Mirza', serif", fontSize: "0.85rem",
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >💾 حفظ</button>
        )}
      </div>

      {/* Edit mode banner at top */}
      {editMode && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 99998,
          background: "#1F3929", color: "#9BA17B",
          padding: "0.35rem 1rem",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem",
          fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}>
          <span>✏ وضع التعديل مفعّل — انقر على أي نص أو صورة لتعديله</span>
        </div>
      )}
    </>
  );
}
