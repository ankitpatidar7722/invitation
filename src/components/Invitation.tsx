"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/data/wedding";
import { LangProvider, useLang } from "@/i18n/LangProvider";
import Cover from "./Cover";
import Nav from "./Nav";
import Hero from "./Hero";
import Families from "./Families";
import Countdown from "./Countdown";
import Events from "./Events";
import Venue from "./Venue";
import Gallery from "./Gallery";
import Contact from "./Contact";
import Closing from "./Closing";
import MusicToggle from "./MusicToggle";
import Petals from "./Petals";
import Share from "./Share";
import Fireworks from "./Fireworks";
import AutoScroll from "./AutoScroll";
import { OrnamentSprite } from "./ornaments/Floral";

const OPENED_KEY = "ay-invitation-opened";

export default function Invitation() {
  return (
    <LangProvider>
      <InvitationBody />
    </LangProvider>
  );
}

function InvitationBody() {
  const { dict } = useLang();
  const [opened, setOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const endCelebration = useCallback(() => setCelebrating(false), []);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setMounted(true);
    // A shared link to a section (e.g. /#venue) goes straight to it.
    const hash = window.location.hash.slice(1);
    if (hash && hash !== "welcome" && document.getElementById(hash)) {
      setOpened(true);
      return;
    }
    try {
      if (sessionStorage.getItem(OPENED_KEY)) setOpened(true);
    } catch {
      /* storage unavailable — just show the cover */
    }
  }, []);

  // Lock page scroll while the cover is showing.
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened, mounted]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const handleOpened = () => {
    setOpened(true);
    try {
      sessionStorage.setItem(OPENED_KEY, "1");
    } catch {
      /* ignore */
    }
    // Music may start only now, after a deliberate user tap.
    if (audioRef.current?.paused) void toggleMusic();
    requestAnimationFrame(() => document.getElementById("welcome")?.focus({ preventScroll: true }));
  };

  // `inert` only after hydration, so a no-JS render is never locked.
  const lockContent = mounted && !opened;

  return (
    <>
      <OrnamentSprite />
      <a
        href="#couple"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-soft"
      >
        {dict.skip}
      </a>

      {/* Rendered from first paint (no flash of content); CSS hides it when JS is off. */}
      {!opened && <Cover onOpening={() => setCelebrating(true)} onOpened={handleOpened} />}
      {celebrating && <Fireworks onDone={endCelebration} />}

      <div inert={lockContent ? true : undefined}>
        <Petals />
        <Nav visible={opened} />
        <main>
          <Hero />
          <Families />
          <Countdown />
          <Events />
          <Venue />
          <Gallery />
          <Contact />
          <Share />
          <Closing />
        </main>
      </div>

      <AutoScroll enabled={opened} />

      {wedding.music.src && (
        <>
          <audio ref={audioRef} src={wedding.music.src} loop preload="none" onEnded={() => setPlaying(false)} />
          {opened && <MusicToggle playing={playing} onToggle={toggleMusic} />}
        </>
      )}
    </>
  );
}
