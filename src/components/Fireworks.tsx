"use client";

import { useEffect, useRef } from "react";

/**
 * One-time "sky shot" celebration shown when the invitation is opened:
 * rockets rise from the bottom and burst into falling sparks over a brief
 * evening-sky veil. Decorative only; skipped for reduced motion.
 */

const COLORS = ["#FFC94A", "#FF6F91", "#FF9F45", "#FF4D6D", "#C08BFF", "#FFE7A3", "#7FE0C2"];

type Rocket = { x: number; y0: number; y1: number; t: number; dur: number; trail: [number, number][] };
type Spark = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  glitter: boolean;
};

const TOTAL_MS = 4600;

type Flash = { x: number; y: number; life: number; color: string };

export default function Fireworks({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return;
    }
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const scale = Math.min(W, H) / 700; // bursts sized to the screen
    // Launch times (seconds); the opening salvo fires three rockets together for impact.
    const launches = (
      W < 640 ? [0, 0.08, 0.15, 0.6, 0.95, 1.3, 1.7, 2.1] : [0, 0.08, 0.15, 0.5, 0.8, 1.05, 1.35, 1.65, 2, 2.35]
    ).map((s) => s * 1000);
    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];
    const flashes: Flash[] = [];
    let launched = 0;

    const burst = (x: number, y: number) => {
      const c1 = COLORS[Math.floor(Math.random() * COLORS.length)]!;
      const c2 = COLORS[Math.floor(Math.random() * COLORS.length)]!;
      const n = W < 640 ? 90 : 110;
      const power = (210 + Math.random() * 110) * Math.max(0.85, scale);
      flashes.push({ x, y, life: 0.3, color: c1 });
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.08;
        const sp = power * (0.55 + Math.random() * 0.5);
        const max = 1.1 + Math.random() * 0.8;
        sparks.push({
          x,
          y,
          px: x,
          py: y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: max,
          max,
          color: i % 3 === 0 ? c2 : c1,
          glitter: Math.random() < 0.35,
        });
      }
    };

    let start = 0;
    let last = 0;
    let raf = 0;
    const frame = (now: number) => {
      if (!start) start = last = now;
      const t = now - start;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      while (launched < launches.length && t >= launches[launched]!) {
        rockets.push({
          x: W * (0.15 + Math.random() * 0.7),
          y0: H + 10,
          y1: H * (0.14 + Math.random() * 0.26),
          t: 0,
          dur: 0.85 + Math.random() * 0.35,
          trail: [],
        });
        launched++;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      // Rising rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]!;
        r.t += dt;
        const k = Math.min(r.t / r.dur, 1);
        const ease = 1 - (1 - k) ** 3;
        const y = r.y0 + (r.y1 - r.y0) * ease;
        const x = r.x + Math.sin(k * 6) * 3;
        r.trail.push([x, y]);
        if (r.trail.length > 10) r.trail.shift();
        r.trail.forEach(([tx, ty], j) => {
          ctx.globalAlpha = (j + 1) / r.trail.length;
          ctx.fillStyle = "#FFE7A3";
          ctx.beginPath();
          ctx.arc(tx, ty, 1.2 + j * 0.15, 0, Math.PI * 2);
          ctx.fill();
        });
        if (k >= 1) {
          burst(x, y);
          rockets.splice(i, 1);
        }
      }

      // Burst flashes
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i]!;
        f.life -= dt;
        if (f.life <= 0) {
          flashes.splice(i, 1);
          continue;
        }
        const r = 70 * Math.max(0.85, scale) * (1.3 - f.life / 0.3);
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        g.addColorStop(0, f.color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = (f.life / 0.3) * 0.55;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Falling sparks
      ctx.lineCap = "round";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]!;
        s.life -= dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.px = s.x;
        s.py = s.y;
        const drag = Math.pow(0.4, dt);
        s.vx *= drag;
        s.vy = s.vy * drag + 140 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const fade = s.life / s.max;
        let alpha = Math.min(1, fade * 1.4);
        if (s.glitter && fade < 0.5) alpha *= Math.random() < 0.5 ? 0.2 : 1;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.glitter ? 2 : 2.8;
        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (t > TOTAL_MS || (launched === launches.length && !rockets.length && !sparks.length && !flashes.length)) {
        onDone();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [onDone]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]">
      <div className="fireworks-veil absolute inset-0" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
