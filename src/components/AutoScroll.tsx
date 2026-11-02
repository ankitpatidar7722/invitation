"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";

/** Pixels per second — a slow, readable glide. */
const SPEED = 40;
/** Wait after the invitation opens (lets the fireworks finish). */
const START_DELAY = 4500;
/** Pause after the guest lets go of the screen before gliding again. */
const RESUME_AFTER = 1000;

/**
 * Slowly scrolls the invitation on its own. Holding a finger (or mouse) on the
 * screen stops it; letting go resumes it. Scrolling by hand, the wheel or keys
 * also pause it briefly. A button lets guests switch it off entirely.
 */
export default function AutoScroll({ enabled }: { enabled: boolean }) {
  const { dict } = useLang();
  const [allowed, setAllowed] = useState(false);
  const [running, setRunning] = useState(true);
  const firstRun = useRef(true);

  useEffect(() => {
    setAllowed(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!enabled || !allowed || !running) return;

    let pos = window.scrollY;
    let holding = false;
    let pauseUntil = performance.now() + (firstRun.current ? START_DELAY : 400);
    firstRun.current = false;
    let last = 0;
    let raf = 0;

    const pauseFor = (ms: number) => {
      pauseUntil = Math.max(pauseUntil, performance.now() + ms);
    };
    const down = () => {
      holding = true;
    };
    const up = () => {
      holding = false;
      pauseFor(RESUME_AFTER);
    };
    const nudge = () => pauseFor(1500);
    const onKey = (e: KeyboardEvent) => {
      if ([" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(e.key)) nudge();
    };

    const opts = { passive: true } as const;
    window.addEventListener("pointerdown", down, opts);
    window.addEventListener("touchstart", down, opts);
    window.addEventListener("pointerup", up, opts);
    window.addEventListener("pointercancel", up, opts);
    window.addEventListener("touchend", up, opts);
    window.addEventListener("touchcancel", up, opts);
    window.addEventListener("wheel", nudge, opts);
    window.addEventListener("keydown", onKey);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(now - last, 100) : 0;
      last = now;

      // The guest (or a menu link) moved the page — continue from there.
      if (Math.abs(window.scrollY - pos) > 2) pos = window.scrollY;

      const blocked =
        holding ||
        now < pauseUntil ||
        document.hidden ||
        document.body.style.overflow === "hidden"; // photo viewer open
      if (blocked) return;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (pos >= max - 1) {
        setRunning(false);
        return;
      }
      pos = Math.min(max, pos + (SPEED * dt) / 1000);
      window.scrollTo({ top: pos, behavior: "instant" });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("touchstart", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchcancel", up);
      window.removeEventListener("wheel", nudge);
      window.removeEventListener("keydown", onKey);
    };
  }, [enabled, allowed, running]);

  if (!enabled || !allowed) return null;

  const toggle = () => {
    if (!running) {
      // Finished at the bottom → start again from the top.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= max - 2) window.scrollTo({ top: 0, behavior: "instant" });
    }
    setRunning((r) => !r);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={running}
      aria-label={running ? dict.autoScroll.pause : dict.autoScroll.play}
      title={running ? dict.autoScroll.pause : dict.autoScroll.play}
      className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold-300 bg-white/90 text-gold-700 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-blush-50"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      {running ? <Pause className="h-5 w-5" aria-hidden="true" /> : <Play className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
