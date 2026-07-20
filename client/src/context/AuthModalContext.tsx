import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type AuthTab = "login" | "register";

interface AuthModalCtx {
  isOpen: boolean;
  initialTab: AuthTab;
  openAuth: (tab?: AuthTab) => void;
  closeAuth: () => void;
}

const Ctx = createContext<AuthModalCtx>({
  isOpen: false,
  initialTab: "login",
  openAuth: () => {},
  closeAuth: () => {},
});

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen]         = useState(false);
  const [initialTab, setInitialTab] = useState<AuthTab>("login");

  const openAuth  = useCallback((tab: AuthTab = "login") => {
    setInitialTab(tab);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => setIsOpen(false), []);

  return (
    <Ctx.Provider value={{ isOpen, initialTab, openAuth, closeAuth }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuthModal = () => useContext(Ctx);
