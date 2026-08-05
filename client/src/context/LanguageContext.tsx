import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "ar" | "en";

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  isRTL: boolean;
}

const Ctx = createContext<LanguageCtx>({ lang: "ar", setLang: () => {}, isRTL: true });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("uji-lang") as Lang) || "ar";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("uji-lang", l);
  };

  // Keep <html> dir + lang in sync
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  return (
    <Ctx.Provider value={{ lang, setLang, isRTL: lang === "ar" }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
