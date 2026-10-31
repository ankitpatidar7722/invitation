import type { MetadataRoute } from "next";
import { wedding } from "@/data/wedding";

export default function manifest(): MetadataRoute.Manifest {
  const names = `${wedding.groom.name.en} & ${wedding.bride.name.en}`;
  return {
    name: `${names} · Wedding Invitation`,
    short_name: names,
    description: wedding.site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBF7F0",
    theme_color: wedding.site.themeColor,
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
