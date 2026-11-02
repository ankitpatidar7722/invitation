/**
 * Small animated illustrations for each ritual (64×64 SVG, hand-drawn).
 * Animations live in globals.css (`.ra-*`), pause while off-screen and are
 * switched off for reduced motion.
 */

import type { RitualKey } from "@/data/wedding";

const d = (ms: number) => ({ animationDelay: `${ms}ms` });

function Marigold({ x, y, r = 4 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <circle key={i} cx={x + Math.cos(a) * r * 0.6} cy={y + Math.sin(a) * r * 0.6} r={r * 0.5} fill="#FF9F1C" />;
      })}
      <circle cx={x} cy={y} r={r * 0.45} fill="#E86A0C" />
    </g>
  );
}

/** माता पूजन — diya with a flickering flame and warm glow */
function MataPujan() {
  return (
    <>
      <circle className="ra-glow" cx={32} cy={27} r={14} fill="#FFC94A" opacity={0.35} />
      <path className="ra-flame" d="M32 18 C37 25 37 31 32 35 C27 31 27 25 32 18Z" fill="#FF8C1A" />
      <path className="ra-flame" style={d(120)} d="M32 25 C34.5 28 34.5 31.5 32 34 C29.5 31.5 29.5 28 32 25Z" fill="#FFE066" />
      <line x1={32} y1={34} x2={32} y2={37} stroke="#5E4B45" strokeWidth={1.2} />
      <path d="M15 38 Q32 56 49 38 Z" fill="#C8742F" />
      <ellipse cx={32} cy={38} rx={17} ry={3.2} fill="#E3923F" />
      <path d="M20 44 Q32 50 44 44" fill="none" stroke="#FFD27A" strokeWidth={1.2} strokeDasharray="1.5 2.5" />
      <Marigold x={12} y={50} r={4} />
      <Marigold x={52} y={50} r={4} />
    </>
  );
}

/** हल्दी — bowl of turmeric paste with golden drops rising */
function Haldi() {
  return (
    <>
      {[18, 27, 36, 45].map((x, i) => (
        <circle key={x} className="ra-rise" style={d(i * 450)} cx={x} cy={30} r={i % 2 ? 2 : 2.6} fill="#FFC300" />
      ))}
      <path d="M12 36 H52 A20 15 0 0 1 12 36Z" fill="#B5651D" />
      <ellipse cx={32} cy={36} rx={20} ry={4.4} fill="#FFC300" />
      <ellipse cx={27} cy={35.2} rx={6} ry={1.4} fill="#FFE07A" />
      <path d="M18 43 Q32 48 46 43" fill="none" stroke="#E3A15A" strokeWidth={1.2} />
      <g className="ra-sway-slow">
        <Marigold x={50} y={18} r={5} />
        <path d="M50 23 Q48 28 44 30" stroke="#6A8F3C" strokeWidth={1.4} fill="none" />
      </g>
    </>
  );
}

/** मेहंदी — a hand with a pattern being drawn */
function Mehandi() {
  return (
    <>
      <path
        d="M24 56 L24 36 Q21 24 23.5 17 Q25.5 15 27 17 L28.5 31 L29 13 Q31 11 33 13 L33.5 30 L35 14 Q37 12 38.6 14.5 L38.5 31 L40.5 19 Q42.5 17.5 43.6 19.5 Q44 29 41 37 Q45 33.5 48 34.5 Q49.3 36.5 47 38.5 Q41 45 39.5 56 Z"
        fill="#F6D2B4"
        stroke="#C98B5E"
        strokeWidth={1}
      />
      <g className="ra-draw" fill="none" stroke="#8B3A1A" strokeWidth={1.1} strokeLinecap="round">
        <circle cx={32} cy={43} r={4.5} pathLength={100} strokeDasharray="100" />
        <circle cx={32} cy={43} r={1.6} pathLength={100} strokeDasharray="100" />
        <path d="M31 30 Q29 34 31 37" pathLength={100} strokeDasharray="100" />
        <path d="M26 25 Q27.5 28 26.5 32" pathLength={100} strokeDasharray="100" />
        <path d="M36.2 24 Q37.5 27 36.6 31" pathLength={100} strokeDasharray="100" />
        <path d="M27 50 Q32 53 37 50" pathLength={100} strokeDasharray="100" />
      </g>
      <g fill="#8B3A1A">
        <circle cx={31} cy={17} r={0.9} />
        <circle cx={25.3} cy={20} r={0.9} />
        <circle cx={36.8} cy={18} r={0.9} />
        <circle cx={41.9} cy={22.5} r={0.9} />
      </g>
    </>
  );
}

/** मंडप छाया — canopy with swaying marigold garlands */
function Mandap() {
  return (
    <>
      <rect x={14} y={25} width={3} height={30} rx={1} fill="#C9AC74" />
      <rect x={47} y={25} width={3} height={30} rx={1} fill="#C9AC74" />
      <path d="M8 27 L32 11 L56 27 Z" fill="#E8789A" />
      <path d="M8 27 L32 11 L56 27" fill="none" stroke="#B4475F" strokeWidth={1.2} />
      <circle cx={32} cy={10} r={2.2} fill="#FFC94A" />
      <g className="ra-sway">
        <path d="M10 28 q5.5 7 11 0 q5.5 7 11 0 q5.5 7 11 0 q5.5 7 11 0" fill="none" stroke="#FF9F1C" strokeWidth={2.4} strokeLinecap="round" />
        {[15.5, 26.5, 37.5, 48.5].map((x) => (
          <g key={x}>
            <line x1={x} y1={32} x2={x} y2={39} stroke="#6A8F3C" strokeWidth={1} />
            <circle cx={x} cy={40} r={1.8} fill="#FFC94A" />
          </g>
        ))}
      </g>
      <rect x={9} y={54} width={46} height={3} rx={1.5} fill="#B5651D" />
      <path className="ra-glow" d="M28 54 Q32 46 36 54 Z" fill="#FF8C1A" />
    </>
  );
}

/** गंगा चरी — kalash over flowing water */
function GangaChari() {
  return (
    <>
      <defs>
        <clipPath id="ra-water">
          <rect x={6} y={44} width={52} height={14} rx={6} />
        </clipPath>
      </defs>
      <g clipPath="url(#ra-water)">
        <g className="ra-wave">
          <path d="M-10 48 q4 -3 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 V60 H-10Z" fill="#7FB8E0" />
        </g>
        <g className="ra-wave-slow">
          <path d="M-10 52 q4 -3 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 V60 H-10Z" fill="#4A90C9" />
        </g>
      </g>
      <g className="ra-bob">
        <path d="M24 26 Q18 36 24 44 H40 Q46 36 40 26 Z" fill="#C8892E" />
        <rect x={25} y={21} width={14} height={5} rx={2} fill="#B5651D" />
        <path d="M22 34 H42" stroke="#FFD27A" strokeWidth={1.4} />
        <path d="M27 21 Q22 14 18 15 Q22 19 27 21Z M37 21 Q42 14 46 15 Q42 19 37 21Z" fill="#5E9A3A" />
        <circle cx={32} cy={17} r={5} fill="#8A5A2B" />
        <path d="M30 34 l2 -3 l2 3 l-2 3z" fill="#E8789A" />
      </g>
    </>
  );
}

/** ढोली कलश — dhol being played */
function DholiKalash() {
  return (
    <>
      <g className="ra-pulse" fill="none" stroke="#E8789A" strokeWidth={1.6} strokeLinecap="round">
        <path d="M8 26 Q4 34 8 42" />
        <path d="M56 26 Q60 34 56 42" />
      </g>
      <g className="ra-pulse" style={d(250)} fill="none" stroke="#FFC94A" strokeWidth={1.4} strokeLinecap="round">
        <path d="M4 22 Q-1 34 4 46" />
        <path d="M60 22 Q65 34 60 46" />
      </g>
      <rect x={14} y={27} width={36} height={18} rx={4} fill="#D35400" />
      <ellipse cx={14} cy={36} rx={3.5} ry={9} fill="#F4D9A6" stroke="#8A5A2B" />
      <ellipse cx={50} cy={36} rx={3.5} ry={9} fill="#F4D9A6" stroke="#8A5A2B" />
      <path d="M16 28 L24 44 L32 28 L40 44 L48 28" fill="none" stroke="#FFE07A" strokeWidth={1.1} />
      <path d="M16 44 L24 28 L32 44 L40 28 L48 44" fill="none" stroke="#FFE07A" strokeWidth={1.1} opacity={0.7} />
      <g className="ra-stick">
        <line x1={22} y1={8} x2={14} y2={30} stroke="#6E4A2A" strokeWidth={2.2} strokeLinecap="round" />
      </g>
      <g className="ra-stick" style={d(250)}>
        <line x1={44} y1={8} x2={50} y2={30} stroke="#6E4A2A" strokeWidth={2} strokeLinecap="round" />
      </g>
      <path d="M26 50 Q32 55 38 50 L36 57 H28 Z" fill="#C8892E" />
      <circle cx={32} cy={49} r={3} fill="#5E9A3A" />
    </>
  );
}

/** निकासी — groom on a decorated mare, trotting */
function Nikasi() {
  return (
    <>
      <g className="ra-ground">
        {[6, 20, 34, 48, 62].map((x) => (
          <circle key={x} cx={x} cy={57} r={0.9} fill="#C9AC74" />
        ))}
      </g>
      <g className="ra-trot">
        {/* legs */}
        <g stroke="#B9A07E" strokeWidth={3} strokeLinecap="round">
          <line className="ra-leg" x1={21} y1={40} x2={20} y2={55} />
          <line className="ra-leg ra-leg-b" x1={25} y1={40} x2={26} y2={55} />
          <line className="ra-leg ra-leg-b" x1={38} y1={40} x2={37} y2={55} />
          <line className="ra-leg" x1={42} y1={40} x2={43} y2={55} />
        </g>
        {/* tail */}
        <path className="ra-tail" d="M15 33 Q9 36 10 46" fill="none" stroke="#B9A07E" strokeWidth={2.6} strokeLinecap="round" />
        {/* body, neck, head */}
        <ellipse cx={31} cy={36} rx={16} ry={7.5} fill="#FBF6EE" stroke="#9C8466" strokeWidth={1} />
        <path d="M41 33 L47 20 Q50 17 54 19 L57 24 Q57 26 55 26 L50 25 L46 36 Z" fill="#FBF6EE" stroke="#9C8466" strokeWidth={1} />
        <path d="M47 20 L48 16 L50 19" fill="#FBF6EE" stroke="#9C8466" strokeWidth={1} />
        <circle cx={52} cy={21.5} r={0.8} fill="#3F2F2B" />
        <path d="M45 22 Q47 26 46 31" fill="none" stroke="#E86A0C" strokeWidth={1.6} strokeDasharray="1.5 1.5" />
        <path d="M50 18 Q52 13 55 14" fill="none" stroke="#FFC94A" strokeWidth={1.4} />
        {/* saddle cloth */}
        <path d="M22 29 H40 L38 41 H24 Z" fill="#C2185B" />
        <path d="M22 29 H40 L38 41 H24 Z" fill="none" stroke="#FFC94A" strokeWidth={1.1} strokeDasharray="2 1.5" />
        {/* groom */}
        <path d="M27 29 Q27 18 31 17 Q35 18 35 29 Z" fill="#F2C14E" />
        <path d="M31 18 V29" stroke="#E3A15A" strokeWidth={0.8} />
        <path d="M27 24 Q24 27 26 30" stroke="#F2C14E" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <circle cx={31} cy={13} r={3.6} fill="#C68B5E" />
        <path d="M27 12 Q31 5.5 35 12 Q31 10.5 27 12Z" fill="#E8303F" />
        <path d="M34 8 Q37 4 36 9" fill="none" stroke="#FFC94A" strokeWidth={1.1} />
        <g stroke="#FFE07A" strokeWidth={0.6}>
          <line x1={28} y1={12} x2={28} y2={17} />
          <line x1={30} y1={12.5} x2={30} y2={17.5} />
          <line x1={32} y1={12.5} x2={32} y2={17.5} />
          <line x1={34} y1={12} x2={34} y2={17} />
        </g>
      </g>
    </>
  );
}

/** मामेरा — gift boxes and a saree tray with a bouncing lid */
function Mamera() {
  return (
    <>
      {[[12, 16], [52, 20], [46, 9]].map(([x, y], i) => (
        <path key={i} className="ra-twinkle" style={d(i * 400)} d={`M${x} ${y - 3} L${x + 1} ${y - 1} L${x + 3} ${y} L${x + 1} ${y + 1} L${x} ${y + 3} L${x - 1} ${y + 1} L${x - 3} ${y} L${x - 1} ${y - 1} Z`} fill="#FFC94A" />
      ))}
      <rect x={13} y={38} width={20} height={17} rx={2} fill="#C2185B" />
      <rect x={21.5} y={38} width={3} height={17} fill="#FFC94A" />
      <g className="ra-lid">
        <rect x={11.5} y={32} width={23} height={6} rx={1.5} fill="#E8789A" />
        <rect x={21.5} y={32} width={3} height={6} fill="#FFC94A" />
        <path d="M23 32 Q17 25 19 31 M23 32 Q29 25 27 31" fill="none" stroke="#FFC94A" strokeWidth={1.6} />
      </g>
      <ellipse cx={45} cy={52} rx={13} ry={3.5} fill="#C9AC74" />
      <path d="M34 50 Q35 40 45 39 Q55 40 56 50 Z" fill="#7B3FA0" />
      <path d="M36 46 H54" stroke="#FFC94A" strokeWidth={1.2} strokeDasharray="2 1.5" />
      <path d="M38 50 Q45 45 52 50" fill="none" stroke="#FF9F1C" strokeWidth={1.2} />
    </>
  );
}

/** प्रीतिभोज — thali with katoris and rising steam */
function Pritibhoj() {
  return (
    <>
      {[24, 32, 40].map((x, i) => (
        <path key={x} className="ra-steam" style={d(i * 500)} d={`M${x} 26 q-3 -4 0 -8 t0 -8`} fill="none" stroke="#C9AC74" strokeWidth={1.4} strokeLinecap="round" />
      ))}
      <ellipse cx={32} cy={42} rx={24} ry={10} fill="#D9D2C5" />
      <ellipse cx={32} cy={41} rx={21} ry={8.4} fill="#EFEAE0" stroke="#BFB6A6" strokeWidth={0.8} />
      <ellipse cx={22} cy={39} rx={4.6} ry={2.4} fill="#E3A15A" />
      <ellipse cx={32} cy={36.5} rx={4.6} ry={2.4} fill="#6A8F3C" />
      <ellipse cx={42} cy={39} rx={4.6} ry={2.4} fill="#D35400" />
      <circle cx={30} cy={44.5} r={4} fill="#F2D7A6" stroke="#C9A06A" strokeWidth={0.6} />
      <circle cx={36} cy={45} r={3.4} fill="#F7E4C0" stroke="#C9A06A" strokeWidth={0.6} />
      <path d="M40 45 l3 -2 l3 2 l-3 2z" fill="#FFC94A" />
    </>
  );
}

/** बारात — the groom's procession on the mare, under lights and fireworks */
function Baraat() {
  return (
    <>
      {[
        [14, 24, "#FF6F91", 0],
        [50, 22, "#FFC94A", 700],
      ].map(([x, y, c, delay]) => (
        <g key={String(x)} className="ra-burst" style={{ ...d(delay as number), transformOrigin: `${x}px ${y}px` }}>
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={(x as number) + Math.cos(a) * 2.5}
                y1={(y as number) + Math.sin(a) * 2.5}
                x2={(x as number) + Math.cos(a) * 7.5}
                y2={(y as number) + Math.sin(a) * 7.5}
                stroke={c as string}
                strokeWidth={1.3}
                strokeLinecap="round"
              />
            );
          })}
        </g>
      ))}
      <path d="M2 9 Q32 21 62 9" fill="none" stroke="#8E6F3A" strokeWidth={0.8} />
      {[8, 17, 26, 35, 44, 53].map((x, i) => (
        <circle
          key={x}
          className="ra-blink"
          style={d(i * 160)}
          cx={x}
          cy={9 + Math.sin((x / 64) * Math.PI) * 6}
          r={1.7}
          fill={["#FFC94A", "#FF6F91", "#7FE0C2"][i % 3]}
        />
      ))}
      <g transform="translate(7 12) scale(0.8)">
        <Nikasi />
      </g>
    </>
  );
}

const ART: Record<RitualKey, () => React.JSX.Element> = {
  mataPujan: MataPujan,
  haldi: Haldi,
  mehandi: Mehandi,
  mandap: Mandap,
  gangaChari: GangaChari,
  dholiKalash: DholiKalash,
  nikasi: Nikasi,
  mamera: Mamera,
  pritibhoj: Pritibhoj,
  baraat: Baraat,
};

export default function RitualArt({ kind, className = "" }: { kind: RitualKey; className?: string }) {
  const Art = ART[kind];
  return (
    <svg viewBox="0 0 64 64" className={`ritual-art ${className}`} aria-hidden="true" focusable="false">
      <circle cx={32} cy={32} r={31} fill="#FFF8EC" stroke="#E9D8B4" strokeWidth={1} />
      <Art />
    </svg>
  );
}
