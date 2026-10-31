/** A handful of slowly drifting petals. Purely decorative; disabled for reduced motion. */
const PETALS = [
  { left: "6%", dur: "16s", delay: "0s", drift: "60px", size: 12 },
  { left: "22%", dur: "19s", delay: "5s", drift: "-40px", size: 9 },
  { left: "41%", dur: "15s", delay: "9s", drift: "50px", size: 11 },
  { left: "63%", dur: "21s", delay: "2s", drift: "-60px", size: 10 },
  { left: "80%", dur: "17s", delay: "7s", drift: "40px", size: 13 },
  { left: "93%", dur: "20s", delay: "12s", drift: "-30px", size: 8 },
];

export default function Petals() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {PETALS.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="petal absolute -top-8"
          width={p.size}
          height={p.size}
          style={
            {
              left: p.left,
              "--dur": p.dur,
              "--delay": p.delay,
              "--drift": p.drift,
            } as React.CSSProperties
          }
        >
          <path d="M10 0 C 18 6, 16 16, 10 20 C 4 16, 2 6, 10 0 Z" fill={i % 2 ? "#F2D2D6" : "#E8B6BE"} opacity={0.8} />
        </svg>
      ))}
    </div>
  );
}
