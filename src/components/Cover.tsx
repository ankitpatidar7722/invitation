"use client";

import { useState } from "react";
import { MailOpen } from "lucide-react";
import { wedding } from "@/data/wedding";
import { useLang } from "@/i18n/LangProvider";
import { dottedDate } from "@/lib/format";
import LangToggle from "./LangToggle";
import { FloralCorner, FloralWreath, Mandala } from "./ornaments/Floral";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Door({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden="true"
      className={`cover-door cover-door-${side} absolute inset-y-0 ${side === "left" ? "left-0" : "right-0"} w-1/2 overflow-hidden`}
      style={{
        background:
          "linear-gradient(160deg, #FDF5F5 0%, #F9E6E7 45%, #F4ECDF 100%)",
      }}
    >
      <div
        className={`absolute inset-y-0 ${side === "left" ? "right-0" : "left-0"} w-px bg-gradient-to-b from-transparent via-gold-300/50 to-transparent`}
      />
      <Mandala
        className={`absolute top-1/2 h-[140vmin] w-[140vmin] -translate-y-1/2 text-gold-400/10 ${side === "left" ? "-right-[70vmin]" : "-left-[70vmin]"}`}
      />
    </div>
  );
}

export default function Cover({ onOpened }: { onOpened: () => void }) {
  const [opening, setOpening] = useState(false);
  const { dict, tx } = useLang();

  const open = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpened, prefersReducedMotion() ? 0 : 1500);
  };

  const g = tx(wedding.groom.name);
  const b = tx(wedding.bride.name);

  return (
    <div
      className={`cover fixed inset-0 z-50 overflow-hidden ${opening ? "is-opening" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-title"
    >
      <Door side="left" />
      <Door side="right" />

      <div className="cover-content relative flex h-full flex-col items-center justify-center px-6 py-10 text-center">
        <FloralCorner className="pointer-events-none absolute left-0 top-0 w-40 sm:w-60" />
        <FloralCorner className="pointer-events-none absolute right-0 top-0 w-40 -scale-x-100 sm:w-60" />
        <FloralCorner className="pointer-events-none absolute bottom-0 left-0 w-36 -scale-y-100 sm:w-52" />
        <FloralCorner className="pointer-events-none absolute bottom-0 right-0 w-36 -scale-100 sm:w-52" />

        <div className="absolute right-4 top-4 z-10" style={{ marginTop: "env(safe-area-inset-top)" }}>
          <LangToggle />
        </div>

        <p className="eyebrow animate-fade-up">{wedding.invocation}</p>

        <div className="relative mt-4 aspect-square w-[min(78vw,340px)] animate-fade-up [animation-delay:150ms]">
          <FloralWreath className="absolute inset-0 h-full w-full animate-float-slow" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-[0.7rem] uppercase tracking-[0.4em] text-gold-600">
              {dict.cover.shubhVivah}
            </span>
            <span className="mt-1 flex items-center gap-3 font-serif text-6xl font-medium sm:text-7xl" aria-hidden="true">
              <span className="gold-text">{g.charAt(0)}</span>
              <span className="h-12 w-px rotate-12 bg-gold-400" />
              <span className="gold-text">{b.charAt(0)}</span>
            </span>
            <span className="mt-2 font-sans text-[0.68rem] tracking-[0.3em] text-ink-soft">
              {dottedDate(wedding.weddingDate)}
            </span>
          </div>
        </div>

        <p className="eyebrow mt-6 animate-fade-up [animation-delay:300ms]">{dict.cover.weddingInvitation}</p>
        <h1
          id="cover-title"
          className="mt-2 animate-fade-up font-script text-[2.6rem] leading-tight text-rose-600 [animation-delay:400ms] min-[400px]:text-5xl sm:text-6xl"
        >
          {g} <span className="font-serif text-3xl text-gold-500 sm:text-4xl">&amp;</span> {b}
        </h1>

        <button
          type="button"
          onClick={open}
          autoFocus
          className="btn-gold btn-shimmer mt-8 animate-fade-up [animation-delay:600ms]"
          style={{
            backgroundImage:
              "linear-gradient(110deg, #8E6F3A 0%, #B39258 35%, #E5D0A1 50%, #B39258 65%, #8E6F3A 100%)",
          }}
        >
          <MailOpen className="h-4 w-4" aria-hidden="true" />
          {dict.cover.open}
        </button>
        <p className="mt-4 text-xs text-ink-soft/80">{dict.cover.tap}</p>
      </div>
    </div>
  );
}
