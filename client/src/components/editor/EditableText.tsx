import { CSSProperties, ElementType } from "react";
import { useEditMode } from "../../context/EditModeContext";
import { useSiteContent } from "../../context/SiteContentContext";
import { useLang } from "../../context/LanguageContext";
import { t } from "../../lib/translations";
import { ENGLISH_CONTENT } from "../../lib/englishContent";

interface Props {
  contentKey: string;
  defaultValue: string;
  as?: ElementType;
  multiline?: boolean;
  style?: CSSProperties;
  className?: string;
  label?: string;
}

export function EditableText({ contentKey, defaultValue, as: Tag = "span", style, className }: Props) {
  const { editMode, activeKey, setActiveKey } = useEditMode();
  const { getContent } = useSiteContent();
  const { lang } = useLang();

  const value = getContent(contentKey, lang === "en" ? (ENGLISH_CONTENT[contentKey] ?? defaultValue) : defaultValue);

  // In English edit mode, clicking targets the .en suffixed key so the sidebar
  // field name reflects the English content slot.
  const editKey = editMode && lang === "en" ? contentKey + ".en" : contentKey;
  const isActive = editMode && (activeKey === contentKey || activeKey === editKey);

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
        setActiveKey(isActive ? null : editKey);
      }}
      title={editMode ? t("cms.click-hint", lang) : undefined}
      dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, "<br/>") }}
    />
  );
}
