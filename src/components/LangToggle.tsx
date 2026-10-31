"use client";

import { Languages } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";

/** Switches हिन्दी ⇄ English. `compact` is the small pill used inside the nav bar. */
export default function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, dict, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "hi" ? "en" : "hi")}
      aria-label={dict.langToggle}
      title={dict.langToggle}
      lang={lang === "hi" ? "en" : "hi"}
      className={`flex items-center gap-1.5 rounded-full border border-gold-300 font-sans font-medium text-gold-700 transition hover:bg-blush-50 ${
        compact
          ? "h-10 bg-white px-3 text-xs"
          : "h-12 bg-white/90 px-4 text-sm shadow-soft backdrop-blur hover:-translate-y-0.5"
      }`}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      {dict.langToggleShort}
    </button>
  );
}
