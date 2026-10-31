import { ImageResponse } from "next/og";
import { MonogramIcon, initials, loadSerif } from "@/lib/brand-image";

export const contentType = "image/png";

const SIZES = [32, 192, 512] as const;

export function generateImageMetadata() {
  return SIZES.map((s) => ({ id: String(s), size: { width: s, height: s }, contentType }));
}

export default async function Icon({ id }: { id: string }) {
  const size = Number(id) || 192;
  const font = await loadSerif(`${initials}&`);
  return new ImageResponse(<MonogramIcon size={size} />, {
    width: size,
    height: size,
    fonts: font ? [{ name: "Cormorant", data: font, weight: 500, style: "normal" }] : undefined,
  });
}
