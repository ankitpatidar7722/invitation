/**
 * Hand-built SVG botanical artwork (no external images).
 * All pieces are decorative and hidden from assistive technology.
 */

type Tone = "pink" | "ivory" | "peach";

const PALETTE: Record<Tone, [string, string, string, string]> = {
  pink: ["#FBE9EB", "#F2D2D6", "#E3A9B4", "#C27688"],
  ivory: ["#FFFBF2", "#F6EAD0", "#E5D0A1", "#B39258"],
  peach: ["#FDF0E8", "#F8DCCB", "#EDBBA3", "#C98C70"],
};

const deg = (a: number) => (a * Math.PI) / 180;
const r2 = (n: number) => Math.round(n * 100) / 100;

export function Rose({
  x,
  y,
  r = 14,
  tone = "pink",
  rotate = 0,
}: {
  x: number;
  y: number;
  r?: number;
  tone?: Tone;
  rotate?: number;
}) {
  const [light, mid, deep, edge] = PALETTE[tone];
  return (
    <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${rotate})`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={`o${i}`}
          cx={0}
          cy={-r * 0.48}
          rx={r * 0.52}
          ry={r * 0.46}
          transform={`rotate(${i * 72})`}
          fill={light}
          stroke={deep}
          strokeWidth={0.6}
          strokeOpacity={0.7}
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={`i${i}`}
          cx={0}
          cy={-r * 0.26}
          rx={r * 0.34}
          ry={r * 0.3}
          transform={`rotate(${i * 72 + 36})`}
          fill={mid}
          stroke={deep}
          strokeWidth={0.5}
          strokeOpacity={0.6}
        />
      ))}
      <circle r={r * 0.24} fill={deep} opacity={0.85} />
      <path
        d={`M${-r * 0.12} 0 a ${r * 0.12} ${r * 0.12} 0 1 1 ${r * 0.18} ${r * 0.08}`}
        fill="none"
        stroke={edge}
        strokeWidth={0.7}
        strokeLinecap="round"
      />
    </g>
  );
}

export function Leaf({
  x,
  y,
  len = 22,
  rotate = 0,
  shade = 0,
}: {
  x: number;
  y: number;
  len?: number;
  rotate?: number;
  shade?: 0 | 1 | 2;
}) {
  const fills = ["#B9C6A8", "#9AAE88", "#C9D3BA"];
  const w = len * 0.34;
  return (
    <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(rotate)})`}>
      <path
        d={`M0 0 C ${len * 0.25} ${-w}, ${len * 0.75} ${-w}, ${len} 0 C ${len * 0.75} ${w}, ${len * 0.25} ${w}, 0 0 Z`}
        fill={fills[shade]}
        opacity={0.95}
      />
      <path d={`M0 0 L ${len * 0.92} 0`} stroke="#7C9169" strokeWidth={0.5} opacity={0.7} />
    </g>
  );
}

function Berry({ x, y, r = 1.6 }: { x: number; y: number; r?: number }) {
  return <circle cx={r2(x)} cy={r2(y)} r={r} fill="#C9AC74" opacity={0.9} />;
}

/** A soft circular wreath with two rose clusters, used for the monogram. */
function WreathShapes() {
  const cx = 160;
  const cy = 160;
  const R = 122;
  const leaves = Array.from({ length: 44 }, (_, i) => {
    const a = i * (360 / 44);
    const out = i % 2 === 0 ? 6 : -6;
    return {
      x: cx + (R + out) * Math.cos(deg(a)),
      y: cy + (R + out) * Math.sin(deg(a)),
      rotate: a + 90 + (i % 2 === 0 ? -28 : 28),
      len: 16 + (i % 3) * 4,
      shade: (i % 3) as 0 | 1 | 2,
    };
  });
  const roses: { a: number; r: number; tone: Tone }[] = [
    { a: 120, r: 17, tone: "pink" },
    { a: 140, r: 22, tone: "pink" },
    { a: 160, r: 15, tone: "ivory" },
    { a: 102, r: 12, tone: "peach" },
    { a: 300, r: 15, tone: "ivory" },
    { a: 318, r: 20, tone: "pink" },
    { a: 338, r: 13, tone: "peach" },
  ];
  const berries = Array.from({ length: 18 }, (_, i) => {
    const a = i * 20 + 8;
    return { x: cx + (R - 14) * Math.cos(deg(a)), y: cy + (R - 14) * Math.sin(deg(a)) };
  });

  return (
    <>
      <circle cx={cx} cy={cy} r={R - 24} fill="none" stroke="#C9AC74" strokeWidth={0.8} />
      <circle cx={cx} cy={cy} r={R - 29} fill="none" stroke="#C9AC74" strokeWidth={0.4} strokeDasharray="1 4" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#9AAE88" strokeWidth={1.1} opacity={0.6} />
      {leaves.map((l, i) => (
        <Leaf key={i} {...l} />
      ))}
      {berries.map((b, i) => (
        <Berry key={i} {...b} />
      ))}
      {roses.map((ro, i) => (
        <Rose
          key={i}
          x={cx + R * Math.cos(deg(ro.a))}
          y={cy + R * Math.sin(deg(ro.a))}
          r={ro.r}
          tone={ro.tone}
          rotate={ro.a}
        />
      ))}
    </>
  );
}

/** Corner spray of vines, leaves and roses. Flip it with CSS for other corners. */
function CornerShapes() {
  const leaves: [number, number, number, number, 0 | 1 | 2][] = [
    [8, 46, 40, 22, 1],
    [30, 62, 70, 20, 0],
    [44, 92, 30, 24, 2],
    [62, 118, 80, 22, 1],
    [70, 150, 40, 20, 0],
    [92, 172, 70, 18, 2],
    [46, 8, 50, 22, 1],
    [70, 30, -10, 20, 0],
    [96, 22, 30, 24, 2],
    [122, 40, -20, 22, 1],
    [146, 34, 20, 20, 0],
    [170, 22, -30, 18, 2],
    [24, 30, 200, 18, 0],
    [56, 70, 250, 16, 2],
  ];
  return (
    <>
      <path
        d="M0 28 C 34 46, 52 76, 66 116 S 96 176, 140 210"
        fill="none"
        stroke="#9AAE88"
        strokeWidth={1.2}
        opacity={0.8}
      />
      <path
        d="M28 0 C 50 30, 84 40, 124 38 S 184 26, 214 12"
        fill="none"
        stroke="#9AAE88"
        strokeWidth={1.2}
        opacity={0.8}
      />
      <path d="M0 10 C 40 20, 80 60, 110 70" fill="none" stroke="#C9AC74" strokeWidth={0.6} />
      {leaves.map(([x, y, rot, len, shade], i) => (
        <Leaf key={i} x={x} y={y} rotate={rot} len={len} shade={shade} />
      ))}
      {[
        [104, 52],
        [86, 64],
        [52, 108],
        [150, 52],
        [40, 140],
      ].map(([x, y], i) => (
        <Berry key={i} x={x!} y={y!} />
      ))}
      <Rose x={40} y={40} r={26} tone="pink" rotate={10} />
      <Rose x={86} y={30} r={16} tone="ivory" rotate={40} />
      <Rose x={28} y={88} r={15} tone="peach" rotate={-20} />
      <Rose x={132} y={20} r={10} tone="pink" rotate={60} />
      <Rose x={18} y={132} r={9} tone="ivory" rotate={-40} />
    </>
  );
}

/** Thin gold ornamental divider with a lotus centre. */
function DividerShapes() {
  return (
    <>
      <g stroke="#B39258" fill="none" strokeWidth={0.8}>
        <path d="M6 14 H92" />
        <path d="M148 14 H234" />
        <path d="M70 10 H92 M148 10 H170" strokeWidth={0.4} />
        <path d="M70 18 H92 M148 18 H170" strokeWidth={0.4} />
        <path d="M120 3 C 112 10, 112 18, 120 25 C 128 18, 128 10, 120 3 Z" fill="#F2D2D6" />
        <path d="M120 25 C 108 22, 100 16, 98 10 C 106 11, 114 16, 120 25 Z" fill="#FBE9EB" />
        <path d="M120 25 C 132 22, 140 16, 142 10 C 134 11, 126 16, 120 25 Z" fill="#FBE9EB" />
      </g>
      <circle cx={2} cy={14} r={2} fill="#B39258" />
      <circle cx={238} cy={14} r={2} fill="#B39258" />
      <circle cx={102} cy={14} r={1.4} fill="#B39258" />
      <circle cx={138} cy={14} r={1.4} fill="#B39258" />
    </>
  );
}

/** Very faint mandala, used as a watermark behind headings/cards. */
function MandalaShapes() {
  const rings = [
    { r: 46, n: 12, len: 18 },
    { r: 76, n: 18, len: 22 },
    { r: 110, n: 24, len: 26 },
  ];
  return (
    <>
      <g transform="translate(150 150)" fill="none" stroke="currentColor" strokeWidth={0.7}>
        <circle r={20} />
        <circle r={30} strokeDasharray="2 4" />
        {rings.map((ring, ri) => (
          <g key={ri}>
            <circle r={ring.r} />
            {Array.from({ length: ring.n }, (_, i) => (
              <path
                key={i}
                transform={`rotate(${(360 / ring.n) * i})`}
                d={`M0 ${-ring.r} C ${ring.len * 0.45} ${-ring.r - ring.len * 0.5}, ${ring.len * 0.2} ${-ring.r - ring.len}, 0 ${-ring.r - ring.len} C ${-ring.len * 0.2} ${-ring.r - ring.len}, ${-ring.len * 0.45} ${-ring.r - ring.len * 0.5}, 0 ${-ring.r} Z`}
              />
            ))}
          </g>
        ))}
        <circle r={142} strokeDasharray="1 5" />
      </g>
    </>
  );
}

/*
 * The detailed artwork is defined once as <symbol>s (render <OrnamentSprite />
 * once per page) and every placement below is a tiny <use> reference.
 */
const SYMBOLS = {
  wreath: { viewBox: "0 0 320 320", Shapes: WreathShapes },
  corner: { viewBox: "0 0 220 220", Shapes: CornerShapes },
  divider: { viewBox: "0 0 240 28", Shapes: DividerShapes },
  mandala: { viewBox: "0 0 300 300", Shapes: MandalaShapes },
  // <use> places a symbol at the origin, so symbol viewBoxes must start at 0 0.
  "rose-pink": { viewBox: "0 0 40 40", Shapes: () => <Rose x={20} y={20} r={16} tone="pink" /> },
  "rose-ivory": { viewBox: "0 0 40 40", Shapes: () => <Rose x={20} y={20} r={16} tone="ivory" /> },
} as const;

type SymbolName = keyof typeof SYMBOLS;

export function OrnamentSprite() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {(Object.keys(SYMBOLS) as SymbolName[]).map((name) => {
          const { viewBox, Shapes } = SYMBOLS[name];
          return (
            <symbol key={name} id={`orn-${name}`} viewBox={viewBox}>
              <Shapes />
            </symbol>
          );
        })}
      </defs>
    </svg>
  );
}

function Ornament({ name, className = "" }: { name: SymbolName; className?: string }) {
  return (
    <svg viewBox={SYMBOLS[name].viewBox} className={className} aria-hidden="true" focusable="false">
      <use href={`#orn-${name}`} />
    </svg>
  );
}

type OrnamentProps = { className?: string };
export const FloralWreath = (p: OrnamentProps) => <Ornament name="wreath" {...p} />;
export const FloralCorner = (p: OrnamentProps) => <Ornament name="corner" {...p} />;
export const Divider = (p: OrnamentProps) => <Ornament name="divider" {...p} />;
export const Mandala = (p: OrnamentProps) => <Ornament name="mandala" {...p} />;
export const RoseIcon = ({ tone = "pink", ...p }: OrnamentProps & { tone?: "pink" | "ivory" }) => (
  <Ornament name={`rose-${tone}`} {...p} />
);
