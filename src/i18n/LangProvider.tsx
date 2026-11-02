"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { wedding, type Lang, type Txt } from "@/data/wedding";
import { dicts, type Dict } from "./dict";

const HTML_LANG: Record<Lang, string> = { hi: "hi", en: "en-IN" };

type LangContextValue = {
  lang: Lang;
  dict: Dict;
  /** Picks the current language from a bilingual { hi, en } value. */
  tx: (value: Txt) => string;
  setLang: (lang: Lang) => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  // Every visit and every shared link opens in the default language (Hindi);
  // the toggle only switches for the current page view.
  const [lang, setLang] = useState<Lang>(wedding.defaultLang);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);

  const tx = useCallback((value: Txt) => value[lang], [lang]);

  return (
    <LangContext.Provider value={{ lang, dict: dicts[lang], tx, setLang }}>{children}</LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
