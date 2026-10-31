import { wedding } from "@/data/wedding";
import { useLang } from "@/i18n/LangProvider";
import { dottedDate } from "@/lib/format";
import { Divider, FloralCorner, FloralWreath } from "./ornaments/Floral";
import Reveal from "./Reveal";

export default function Closing() {
  const { closing } = wedding;
  const { dict, tx } = useLang();
  return (
    <footer className="relative overflow-hidden px-6 pb-16 pt-20 text-center sm:pb-24" aria-labelledby="closing-title">
      <FloralCorner className="pointer-events-none absolute bottom-0 left-0 w-40 -scale-y-100 sm:w-64" />
      <FloralCorner className="pointer-events-none absolute bottom-0 right-0 w-40 -scale-100 sm:w-64" />

      <Reveal className="relative mx-auto max-w-xl">
        <p className="font-serif text-3xl text-gold-600">{closing.blessing}</p>
        <h2 id="closing-title" className="mt-4 font-script text-5xl text-rose-600 sm:text-6xl">
          {dict.closing.thanks}
        </h2>
        <Divider className="mx-auto mt-5 h-6 w-56" />
        <p className="mt-6 font-serif text-xl leading-relaxed text-ink-soft">{tx(closing.message)}</p>
        <p className="mt-8 eyebrow">{tx(closing.signOff)}</p>
        <p className="mt-2 font-serif text-2xl text-ink">{tx(closing.families)}</p>

        <div className="relative mx-auto mt-10 aspect-square w-40">
          <FloralWreath className="absolute inset-0 h-full w-full" />
          <span className="absolute inset-0 flex items-center justify-center font-serif text-3xl" aria-hidden="true">
            <span className="gold-text">
              {tx(wedding.groom.name).charAt(0)}
              <span className="mx-1 text-xl">&amp;</span>
              {tx(wedding.bride.name).charAt(0)}
            </span>
          </span>
        </div>
        <p className="mt-4 font-sans text-xs tracking-[0.3em] text-gold-600">{dottedDate(wedding.weddingDate)}</p>
      </Reveal>
    </footer>
  );
}
