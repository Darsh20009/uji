import { CSSProperties, ElementType } from "react";
import { useEditMode } from "../../context/EditModeContext";
import { useSiteContent } from "../../context/SiteContentContext";

interface Props {
  contentKey: string;
  defaultValue: string;
  as?: ElementType;
  multiline?: boolean;   // kept for API compatibility — not used for modal anymore
  style?: CSSProperties;
  className?: string;
  label?: string;        // kept for API compatibility
}

export function EditableText({ contentKey, defaultValue, as: Tag = "span", style, className }: Props) {
  const { editMode, activeKey, setActiveKey } = useEditMode();
  const { getContent } = useSiteContent();

  const value = getContent(contentKey, defaultValue);

  const isActive = editMode && activeKey === contentKey;

  const editStyle: CSSProperties = editMode
    ? {
        outline: isActive ? "2px solid #9BA17B" : "2px dashed rgba(59,130,246,0.5)",
        outlineOffset: 3,
        cursor: "pointer",
        borderRadius: 2,
      }
    : {};

  const El = Tag as any;

  return (
    <El
      className={className}
      style={{ ...style, ...editStyle }}
      onClick={(e: React.MouseEvent) => {
        if (!editMode) return;
        e.stopPropagation();
        setActiveKey(isActive ? null : contentKey);
      }}
      title={editMode ? `انقر للتعديل في اللوحة الجانبية` : undefined}
      dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, "<br/>") }}
    />
  );
}
