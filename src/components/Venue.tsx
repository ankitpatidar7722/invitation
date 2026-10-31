import { MapPin, Navigation } from "lucide-react";
import { wedding } from "@/data/wedding";
import { useLang } from "@/i18n/LangProvider";
import { mapsHref } from "@/lib/format";
import { FloralCorner, Mandala } from "./ornaments/Floral";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Venue() {
  const { dict, tx } = useLang();
  return (
    <section id="venue" className="section" aria-labelledby="venue-title">
      <SectionHeading id="venue-title" eyebrow={dict.venue.eyebrow} title={dict.venue.title} />

      <Reveal className="card card-frame relative mx-auto max-w-2xl overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
        <FloralCorner className="pointer-events-none absolute -left-4 -top-4 w-28 opacity-90 sm:w-36" />
        <FloralCorner className="pointer-events-none absolute -bottom-4 -right-4 w-28 -scale-100 opacity-90 sm:w-36" />
        <Mandala className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 text-gold-400/10" />

        <div className="relative">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-300 bg-blush-50 text-rose-500 shadow-soft">
            <MapPin className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="eyebrow mt-6">{dict.venue.label}</p>
          <address className="mt-4 font-serif text-[1.35rem] not-italic leading-snug text-ink sm:text-3xl">
            {wedding.venue.lines.map((line) => (
              <span key={line.en} className="block">
                {tx(line)}
              </span>
            ))}
          </address>

          <a
            href={mapsHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-8"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            {dict.venue.directions}
            <span className="sr-only"> {dict.venue.opensMaps}</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
