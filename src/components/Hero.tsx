import { ChevronDown } from "lucide-react";
import { wedding } from "@/data/wedding";
import { useLang } from "@/i18n/LangProvider";
import { dayOfMonth, monthName, weekday, year } from "@/lib/format";
import { Divider, FloralCorner, Mandala } from "./ornaments/Floral";
import Reveal from "./Reveal";

export default function Hero() {
  const { lang, dict, tx } = useLang();
  const d = wedding.weddingDate;
  return (
    <header className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pb-16 pt-24 text-center">
      <Mandala className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 animate-spin-slow text-gold-400/15" />
      <FloralCorner className="pointer-events-none absolute left-0 top-0 w-44 sm:w-72" />
      <FloralCorner className="pointer-events-none absolute right-0 top-0 w-44 -scale-x-100 sm:w-72" />
      <FloralCorner className="pointer-events-none absolute bottom-0 left-0 w-36 -scale-y-100 sm:w-56" />
      <FloralCorner className="pointer-events-none absolute bottom-0 right-0 w-36 -scale-100 sm:w-56" />

      <Reveal className="relative z-10 max-w-xl">
        {wedding.invocation && <p className="font-serif text-lg text-gold-600">{wedding.invocation}</p>}
        <p className="eyebrow mt-6">{dict.hero.together}</p>

        <h2 id="welcome" tabIndex={-1} className="mt-6 outline-none">
          <span className="block font-script text-6xl leading-none text-rose-600 sm:text-8xl">
            {tx(wedding.groom.name)}
          </span>
          <span className="my-2 block font-serif text-3xl italic text-gold-500 sm:text-4xl">{dict.hero.weds}</span>
          <span className="block font-script text-6xl leading-none text-rose-600 sm:text-8xl">
            {tx(wedding.bride.name)}
          </span>
        </h2>

        <Divider className="mx-auto mt-8 h-6 w-60" />

        <div className="mt-6 flex items-center justify-center gap-4 font-serif text-ink">
          <span className="w-24 border-y border-gold-300 py-1 text-sm uppercase tracking-[0.25em] sm:w-28">
            {weekday(d, lang)}
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-xs uppercase tracking-[0.3em] text-gold-600">{monthName(d, lang)}</span>
            <span className="text-6xl font-medium">{dayOfMonth(d, lang)}</span>
            <span className="text-xs tracking-[0.3em] text-gold-600">{year(d, lang)}</span>
          </span>
          <span className="w-24 border-y border-gold-300 py-1 text-sm uppercase tracking-[0.25em] sm:w-28">
            {tx(wedding.venues.groom.shortName)}
          </span>
        </div>

        <p className="mt-6 text-sm text-ink-soft">
          {wedding.venues.groom.lines.map(tx).join(" ")}
        </p>
      </Reveal>

      <a
        href="#couple"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-gold-600 transition hover:text-rose-600"
        aria-label={dict.hero.scroll}
      >
        <ChevronDown className="h-6 w-6 animate-bounce motion-reduce:animate-none" aria-hidden="true" />
      </a>
    </header>
  );
}
