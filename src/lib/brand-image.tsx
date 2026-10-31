import { wedding } from "@/data/wedding";

/**
 * Loads a subset of Cormorant Garamond for generated images.
 * Falls back to the default font if Google Fonts is unreachable at build time.
 */
export async function loadSerif(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&text=${encodeURIComponent(text)}`,
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export const initials = `${wedding.groom.name.en.charAt(0)}${wedding.bride.name.en.charAt(0)}`;

/** Square monogram used for favicon / PWA / apple icons. Safe-zone friendly for maskable icons. */
export function MonogramIcon({ size }: { size: number }) {
  const ring = Math.round(size * 0.64);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(150deg, #FDF5F5 0%, #F9E6E7 50%, #F4ECDF 100%)",
      }}
    >
      <div
        style={{
          width: ring,
          height: ring,
          borderRadius: "50%",
          border: `${Math.max(1, Math.round(size * 0.012))}px solid #B39258`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8E6F3A",
          fontSize: Math.round(size * 0.3),
          fontFamily: "Cormorant",
          letterSpacing: Math.round(size * 0.01),
        }}
      >
        {wedding.groom.name.en.charAt(0)}
        <span style={{ color: "#C27688", fontSize: Math.round(size * 0.16), margin: `0 ${Math.round(size * 0.015)}px` }}>
          &
        </span>
        {wedding.bride.name.en.charAt(0)}
      </div>
    </div>
  );
}
