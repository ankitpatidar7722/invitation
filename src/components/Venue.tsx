import { MapPin, Navigation, Route } from "lucide-react";
import { wedding, type VenueKey } from "@/data/wedding";
import { useLang } from "@/i18n/LangProvider";
import { mapEmbedSrc, mapsHref, routeHref } from "@/lib/format";
import { FloralCorner, Mandala } from "./ornaments/Floral";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function VenueCard({ which, delay }: { which: VenueKey; delay: number }) {
  const { dict, tx } = useLang();
  const v = wedding.venues[which];
  return (
    <Reveal
      delay={delay}
      className="card card-frame relative overflow-hidden px-6 py-10 text-center sm:px-10"
    >
      <div id={`venue-${which}`} className="absolute -top-20" aria-hidden="true" />
      <FloralCorner className="pointer-events-none absolute -left-4 -top-4 w-24 opacity-90 sm:w-32" />
      <FloralCorner className="pointer-events-none absolute -bottom-4 -right-4 w-24 -scale-100 opacity-90 sm:w-32" />
      <Mandala className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 text-gold-400/10" />

      <div className="relative">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-300 bg-blush-50 text-rose-500 shadow-soft">
          <MapPin className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="eyebrow mt-5">{tx(v.label)}</h3>
        <address className="mt-3 font-serif text-[1.3rem] not-italic leading-snug text-ink sm:text-2xl">
          {v.lines.map((line) => (
            <span key={line.en} className="block">
              {tx(line)}
            </span>
          ))}
        </address>

        <div className="mx-auto mt-6 overflow-hidden rounded-2xl border border-gold-300/70 shadow-soft">
          <iframe
            src={mapEmbedSrc(v)}
            title={`${dict.venue.mapTitle} — ${tx(v.label)}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-56 w-full sm:h-64"
          />
        </div>

        <a href={mapsHref(v)} target="_blank" rel="noopener noreferrer" className="btn-gold mt-6">
          <Navigation className="h-4 w-4" aria-hidden="true" />
          {dict.venue.directions}
          <span className="sr-only">
            {" "}
            {tx(v.label)} {dict.venue.opensMaps}
          </span>
        </a>
      </div>
    </Reveal>
  );
}

export default function Venue() {
  const { dict, tx } = useLang();
  const { groom, bride } = wedding.venues;
  return (
    <section id="venue" className="section" aria-labelledby="venue-title">
      <SectionHeading id="venue-title" eyebrow={dict.venue.eyebrow} title={dict.venue.title} />

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <VenueCard which="groom" delay={0} />
        <VenueCard which="bride" delay={120} />
      </div>

      {/* Baraat route: groom's home → bride's home */}
      <Reveal className="card mx-auto mt-8 max-w-2xl px-6 py-7 text-center">
        <p className="eyebrow">{dict.venue.routeTitle}</p>
        <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-serif text-2xl text-ink">
          <span>{tx(groom.shortName)}</span>
          <span className="text-gold-500" aria-hidden="true">
            ⟶
          </span>
          <span className="sr-only">{dict.venue.to}</span>
          <span>{tx(bride.shortName)}</span>
        </p>
        <a href={routeHref(groom, bride)} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5">
          <Route className="h-4 w-4" aria-hidden="true" />
          {dict.venue.route}
          <span className="sr-only"> {dict.venue.opensMaps}</span>
        </a>
      </Reveal>
    </section>
  );
}
