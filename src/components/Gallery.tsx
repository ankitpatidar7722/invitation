"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import { wedding, type GalleryPhoto } from "@/data/wedding";
import { useLang } from "@/i18n/LangProvider";
import { FloralWreath } from "./ornaments/Floral";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const photos = wedding.gallery;

function Placeholder({ photo, large = false }: { photo: GalleryPhoto; large?: boolean }) {
  const { dict, tx } = useLang();
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blush-50 via-ivory to-cream p-4 text-center">
      <FloralWreath className={`${large ? "w-56 sm:w-72" : "w-24 sm:w-32"} opacity-80`} />
      <span className="mt-2 flex items-center gap-1.5 font-sans text-[0.62rem] uppercase tracking-[0.18em] text-gold-600">
        <ImagePlus className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {dict.gallery.soon}
      </span>
      {photo.caption && <span className="mt-1 font-serif text-lg italic text-ink-soft">{tx(photo.caption)}</span>}
    </div>
  );
}

function Lightbox({
  index,
  onClose,
  onNav,
}: {
  index: number;
  onClose: () => void;
  onNav: (delta: number) => void;
}) {
  const photo = photos[index]!;
  const { dict, tx } = useLang();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNav(1);
      else if (e.key === "ArrowLeft") onNav(-1);
      else if (e.key === "Tab") {
        // keep focus inside the dialog
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0]!;
        const last = nodes[nodes.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus();
    };
  }, [onClose, onNav]);

  // basic swipe support for phones
  const touchX = useRef<number | null>(null);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${dict.gallery.position(index + 1, photos.length)}: ${tx(photo.alt)}`}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm animate-fade-up"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        if (start != null && end != null && Math.abs(end - start) > 50) onNav(end < start ? 1 : -1);
        touchX.current = null;
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft transition hover:bg-white"
        aria-label={dict.gallery.close}
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      <figure className="relative w-full max-w-3xl">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-gold-300 bg-ivory shadow-2xl sm:aspect-[4/3]">
          {photo.src ? (
            <Image src={photo.src} alt={tx(photo.alt)} fill sizes="(max-width: 768px) 100vw, 768px" className="object-contain" />
          ) : (
            <Placeholder photo={photo} large />
          )}
        </div>
        <figcaption className="mt-4 text-center font-serif text-lg text-ivory">
          {tx(photo.caption ?? photo.alt)}
          <span className="ml-2 font-sans text-xs text-ivory/70">
            {index + 1} / {photos.length}
          </span>
        </figcaption>
      </figure>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => onNav(-1)}
            className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow-soft transition hover:bg-white sm:left-6"
            aria-label={dict.gallery.prev}
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNav(1)}
            className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow-soft transition hover:bg-white sm:right-6"
            aria-label={dict.gallery.next}
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const { dict, tx } = useLang();

  const close = useCallback(() => setActive(null), []);
  const nav = useCallback(
    (delta: number) =>
      setActive((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [],
  );

  return (
    <section id="gallery" className="section" aria-labelledby="gallery-title">
      <SectionHeading
        id="gallery-title"
        eyebrow={dict.gallery.eyebrow}
        title={dict.gallery.title}
        subtitle={dict.gallery.subtitle}
      />

      <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
        {photos.map((photo, i) => (
          <Reveal as="li" key={i} delay={(i % 3) * 90} className={i % 5 === 0 ? "row-span-2" : ""}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group relative block h-full min-h-[11rem] w-full overflow-hidden rounded-3xl border border-gold-300/70 bg-ivory shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-card sm:min-h-[14rem]"
              aria-label={`${dict.gallery.open} ${tx(photo.caption ?? photo.alt)}`}
            >
              {photo.src ? (
                <Image
                  src={photo.src}
                  alt={tx(photo.alt)}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <Placeholder photo={photo} />
              )}
              <span className="pointer-events-none absolute inset-2 rounded-[1.25rem] border border-white/70" />
            </button>
          </Reveal>
        ))}
      </ul>

      {active !== null && <Lightbox index={active} onClose={close} onNav={nav} />}
    </section>
  );
}
