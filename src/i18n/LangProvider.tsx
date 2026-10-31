"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { wedding, type Lang, type Txt } from "@/data/wedding";
import { dicts, type Dict } from "./dict";

const STORAGE_KEY = "ay-invitation-lang";
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
  const [lang, setLangState] = useState<Lang>(wedding.defaultLang);

  // A ?lang=en / ?lang=hi link wins, then the guest's last choice.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    const pick = fromUrl === "hi" || fromUrl === "en" ? fromUrl : stored;
    if (pick === "hi" || pick === "en") setLangState(pick);
  }, []);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

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
