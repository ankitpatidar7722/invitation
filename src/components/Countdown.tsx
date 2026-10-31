"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { wedding } from "@/data/wedding";
import { useLang } from "@/i18n/LangProvider";
import { longDate } from "@/lib/format";
import { Mandala } from "./ornaments/Floral";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const DAY = 86_400_000;
const target = new Date(wedding.weddingDateTime).getTime();

type Phase =
  | { kind: "before"; days: number; hours: number; minutes: number; seconds: number }
  | { kind: "today" }
  | { kind: "after" };

function compute(now: number): Phase {
  const diff = target - now;
  if (diff > 0) {
    return {
      kind: "before",
      days: Math.floor(diff / DAY),
      hours: Math.floor((diff % DAY) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    };
  }
  // weddingDateTime is midnight IST, so the next 24h are the wedding day.
  return diff > -DAY ? { kind: "today" } : { kind: "after" };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown() {
  const [phase, setPhase] = useState<Phase | null>(null);
  const { lang, dict, tx } = useLang();
  const c = dict.countdown;
  const date = longDate(wedding.weddingDate, lang);
  const g = tx(wedding.groom.name);
  const b = tx(wedding.bride.name);

  useEffect(() => {
    const tick = () => setPhase(compute(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const units =
    phase?.kind === "before"
      ? [
          { label: c.days, value: String(phase.days) },
          { label: c.hours, value: pad(phase.hours) },
          { label: c.minutes, value: pad(phase.minutes) },
          { label: c.seconds, value: pad(phase.seconds) },
        ]
      : null;

  return (
    <section id="countdown" className="section" aria-labelledby="countdown-title">
      <SectionHeading
        id="countdown-title"
        eyebrow={c.eyebrow}
        title={c.title}
        subtitle={`${date} · ${c.ist}`}
      />

      <Reveal className="card card-frame relative mx-auto max-w-3xl overflow-hidden px-4 py-10 sm:px-10 sm:py-14">
        <Mandala className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 text-gold-400/20" />
        <Mandala className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 text-rose-400/15" />

        {phase === null || units ? (
          <>
            <div className="relative grid grid-cols-4 gap-2 sm:gap-6" aria-hidden="true">
              {(units ?? [c.days, c.hours, c.minutes, c.seconds].map((label) => ({ label, value: "--" }))).map(
                (u) => (
                  <div key={u.label} className="flex flex-col items-center">
                    <div className="flex aspect-square w-full max-w-[7.5rem] items-center justify-center rounded-2xl border border-gold-300/70 bg-gradient-to-b from-white to-blush-50 shadow-soft">
                      <span className="font-serif text-3xl font-medium tabular-nums text-ink sm:text-5xl">
                        {u.value}
                      </span>
                    </div>
                    <span className="mt-3 font-sans text-[0.65rem] uppercase tracking-[0.25em] text-gold-600 sm:text-xs">
                      {u.label}
                    </span>
                  </div>
                ),
              )}
            </div>
            {/* Screen readers get a single, calm summary instead of a per-second ticker. */}
            <p className="sr-only">
              {units
                ? c.srLeft(units[0]!.value, date)
                : c.srOn(date)}
            </p>
          </>
        ) : (
          <div className="relative py-4 text-center" role="status">
            <Heart className="mx-auto h-8 w-8 fill-rose-400 text-rose-500" aria-hidden="true" />
            <p className="mt-4 font-script text-5xl text-rose-600">
              {phase.kind === "today" ? c.today : c.after}
            </p>
            <p className="mx-auto mt-4 max-w-md font-serif text-xl text-ink-soft">
              {phase.kind === "today" ? c.todayMsg(g, b) : c.afterMsg(g, b)}
            </p>
          </div>
        )}
      </Reveal>
    </section>
  );
}
