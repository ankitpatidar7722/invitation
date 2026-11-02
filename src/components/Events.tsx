import { Clock, MapPin, Sparkles } from "lucide-react";
import { wedding, type VenueKey } from "@/data/wedding";
import { useLang } from "@/i18n/LangProvider";
import { dayOfMonth, longDate, monthShort, weekday } from "@/lib/format";
import { RoseIcon } from "./ornaments/Floral";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/** Small tappable tag that jumps to the venue card. */
function VenueTag({ which }: { which: VenueKey }) {
  const { tx } = useLang();
  return (
    <a
      href={`#venue-${which}`}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-sans text-xs transition hover:underline ${
        which === "bride" ? "bg-rose-500/10 text-rose-600" : "bg-gold-300/25 text-gold-700"
      }`}
    >
      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
      {tx(wedding.venues[which].tag)}
    </a>
  );
}

export default function Events() {
  const { lang, dict, tx } = useLang();
  return (
    <section id="events" className="section" aria-labelledby="events-title">
      <SectionHeading
        id="events-title"
        eyebrow={dict.events.eyebrow}
        title={dict.events.title}
        subtitle={dict.events.subtitle}
      />

      <ol className="relative mx-auto max-w-3xl">
        {/* timeline spine */}
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[2.35rem] top-6 w-px bg-gradient-to-b from-gold-300/0 via-gold-400 to-gold-300/0 sm:left-[3.1rem]"
        />
        {wedding.events.map((day, i) => {
          const places = [...new Set(day.items.map((it) => it.venue ?? "groom"))];
          const perItem = places.length > 1;
          return (
          <Reveal as="li" key={day.date} delay={i * 80} className="relative mb-8 flex gap-4 last:mb-0 sm:gap-8">
            <div className="relative z-10 shrink-0">
              <div
                className={`flex h-[4.7rem] w-[4.7rem] flex-col items-center justify-center rounded-full border text-center shadow-soft sm:h-[6.2rem] sm:w-[6.2rem] ${
                  day.highlight
                    ? "border-rose-400 bg-gradient-to-b from-blush-100 to-blush-200"
                    : "border-gold-300 bg-ivory"
                }`}
              >
                <span className="font-serif text-2xl font-semibold leading-none text-ink sm:text-4xl">
                  {dayOfMonth(day.date, lang)}
                </span>
                <span className="mt-0.5 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-gold-600 sm:text-[0.7rem]">
                  {monthShort(day.date, lang)}
                </span>
              </div>
            </div>

            <article
              className={`card flex-1 px-5 py-5 sm:px-8 sm:py-6 ${day.highlight ? "border-rose-300 bg-gradient-to-br from-white/90 to-blush-50" : ""}`}
              aria-label={longDate(day.date, lang)}
            >
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-300/50 pb-3">
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-600">
                  <time dateTime={day.date}>{weekday(day.date, lang)}</time>
                </p>
                {day.highlight && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1 font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white">
                    <Sparkles className="h-3 w-3" aria-hidden="true" /> {dict.events.weddingDay}
                  </span>
                )}
              </header>

              <ul className="mt-3 divide-y divide-gold-300/30">
                {day.items.map((item) => (
                  <li key={item.name.en} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5">
                    <span className="flex items-center gap-3">
                      <RoseIcon className="h-4 w-4 shrink-0" tone={day.highlight ? "pink" : "ivory"} />
                      <span className="font-serif text-xl text-ink sm:text-2xl">{tx(item.name)}</span>
                    </span>
                    <span className="flex flex-wrap items-center gap-1.5">
                      {item.time && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/70 bg-ivory px-3 py-1 font-sans text-xs text-gold-700">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {tx(item.time)}
                        </span>
                      )}
                      {perItem && <VenueTag which={item.venue ?? "groom"} />}
                    </span>
                  </li>
                ))}
              </ul>
              {!perItem && (
                <div className="mt-3 border-t border-gold-300/30 pt-3">
                  <VenueTag which={places[0]!} />
                </div>
              )}
            </article>
          </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
