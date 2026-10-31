import { ImageResponse } from "next/og";
import { wedding } from "@/data/wedding";
import { longDate } from "@/lib/format";
import { loadSerif } from "@/lib/brand-image";

export const alt = `${wedding.groom.name.en} & ${wedding.bride.name.en} — Wedding Invitation`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const date = longDate(wedding.weddingDate);
  const place = wedding.venue.lines.map((l) => l.en).join(" ");
  const text = `${wedding.groom.name.en}${wedding.bride.name.en}&WEDDING INVITATION${date}${place}`;
  const font = await loadSerif(text);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(150deg, #FDF5F5 0%, #F9E6E7 45%, #F4ECDF 100%)",
          fontFamily: "Cormorant",
        }}
      >
        <div
          style={{
            width: 1120,
            height: 550,
            border: "2px solid #C9AC74",
            borderRadius: 36,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#3F2F2B",
          }}
        >
          <div style={{ fontSize: 26, letterSpacing: 10, color: "#8E6F3A" }}>WEDDING INVITATION</div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 120, color: "#A45A6D", marginTop: 24 }}>
            {wedding.groom.name.en}
            <span style={{ fontSize: 80, color: "#B39258", margin: "0 32px" }}>&</span>
            {wedding.bride.name.en}
          </div>
          <div style={{ width: 360, height: 2, background: "#C9AC74", margin: "28px 0" }} />
          <div style={{ fontSize: 40 }}>{date}</div>
          <div style={{ fontSize: 28, color: "#5E4B45", marginTop: 12 }}>{place}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Cormorant", data: font, weight: 500, style: "normal" }] : undefined,
    },
  );
}
