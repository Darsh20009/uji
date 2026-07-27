import { createContext, useContext, useState, ReactNode } from "react";

interface EditModeCtx {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
}

const Ctx = createContext<EditModeCtx>({ editMode: false, setEditMode: () => {} });

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false);
  return <Ctx.Provider value={{ editMode, setEditMode }}>{children}</Ctx.Provider>;
}

export const useEditMode = () => useContext(Ctx);
