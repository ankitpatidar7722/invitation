import { ImageResponse } from "next/og";
import { MonogramIcon, initials, loadSerif } from "@/lib/brand-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await loadSerif(`${initials}&`);
  return new ImageResponse(<MonogramIcon size={180} />, {
    ...size,
    fonts: font ? [{ name: "Cormorant", data: font, weight: 500, style: "normal" }] : undefined,
  });
}
