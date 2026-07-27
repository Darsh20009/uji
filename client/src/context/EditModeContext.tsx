import { createContext, useContext, useState, ReactNode } from "react";

interface EditModeCtx {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  activeKey: string | null;
  setActiveKey: (key: string | null) => void;
}

const Ctx = createContext<EditModeCtx>({
  editMode: false,
  setEditMode: () => {},
  activeKey: null,
  setActiveKey: () => {},
});

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleSetEditMode = (v: boolean) => {
    setEditMode(v);
    if (!v) setActiveKey(null);
  };

  return (
    <Ctx.Provider value={{ editMode, setEditMode: handleSetEditMode, activeKey, setActiveKey }}>
      {children}
    </Ctx.Provider>
  );
}

export const useEditMode = () => useContext(Ctx);
