import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { useLang } from "./LanguageContext";
import { ENGLISH_CONTENT } from "../lib/englishContent";

interface SiteContentCtx {
  content: Record<string, string>;
  getContent: (key: string, def: string) => string;
  updateContent: (key: string, value: string) => void;
  saveStatus: "idle" | "saving" | "saved" | "error";
  forceSave: () => void;
}

const Ctx = createContext<SiteContentCtx>({
  content: {},
  getContent: (_, d) => d,
  updateContent: () => {},
  saveStatus: "idle",
  forceSave: () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { lang } = useLang();
  const [content, setContent] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const pending = useRef<Record<string, string>>({});
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    fetch("/api/site-content", { credentials: "include" })
      .then(r => r.ok ? r.json() : {})
      .then(data => { if (data && typeof data === "object") setContent(data as Record<string, string>); })
      .catch(() => {});
  }, []);

  const doSave = useCallback(async () => {
    const updates = { ...pending.current };
    if (!Object.keys(updates).length) return;
    pending.current = {};
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      setSaveStatus(res.ok ? "saved" : "error");
      if (res.ok) setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    }
  }, []);

  const updateContent = useCallback((key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
    pending.current[key] = value;
    clearTimeout(timer.current);
    timer.current = setTimeout(doSave, 1500);
  }, [doSave]);

  const getContent = useCallback((key: string, def: string): string => {
    // In English mode: prefer saved English content, then the built-in English
    // copy, and never silently show the Arabic default.
    if (lang === "en") {
      const enKey = key + ".en";
      if (enKey in content) return content[enKey];
      if (key in ENGLISH_CONTENT) return ENGLISH_CONTENT[key];
    }
    return key in content ? content[key] : def;
  }, [content, lang]);

  return (
    <Ctx.Provider value={{ content, getContent, updateContent, saveStatus, forceSave: doSave }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSiteContent = () => useContext(Ctx);
