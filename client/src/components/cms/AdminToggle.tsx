import { useIsAdmin } from "../../hooks/useIsAdmin";
import { useEditMode } from "../../context/EditModeContext";

export function AdminToggle() {
  const { isAdmin, isLoading } = useIsAdmin();
  const { editMode, setEditMode } = useEditMode();

  // Only render for actual admins — wait for loading to finish
  if (isLoading || !isAdmin) return null;

  return (
    <button
      onClick={() => setEditMode(!editMode)}
      title={editMode ? "إيقاف التعديل (Ctrl+E)" : "تعديل الموقع (Ctrl+E)"}
      style={{
        position: "fixed",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)",
        left: "1rem",
        zIndex: 99998,
        width: 48, height: 48, borderRadius: "50%",
        background: editMode ? "#9BA17B" : "#1F3929",
        color: editMode ? "#1C201B" : "#F2EADB",
        border: editMode ? "2px solid #1C201B" : "2px solid rgba(155,161,123,0.4)",
        cursor: "pointer",
        fontSize: "1.1rem", lineHeight: 1,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        transition: "all 0.2s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {editMode ? "✕" : "✏"}
    </button>
  );
}
