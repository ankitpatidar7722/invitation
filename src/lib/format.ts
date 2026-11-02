import { wedding, type Lang, type Venue } from "@/data/wedding";

const LOCALE: Record<Lang, string> = { hi: "hi-IN", en: "en-IN" };

/** Parses a YYYY-MM-DD string as a pure calendar date (no timezone drift). */
function calendarDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1, 12));
}

function part(iso: string, options: Intl.DateTimeFormatOptions, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], { ...options, timeZone: "UTC" }).format(
    calendarDate(iso),
  );
}

export const dayOfMonth = (iso: string, lang: Lang = "en") => part(iso, { day: "numeric" }, lang);
export const monthName = (iso: string, lang: Lang = "en") => part(iso, { month: "long" }, lang);
export const monthShort = (iso: string, lang: Lang = "en") => part(iso, { month: "short" }, lang);
export const weekday = (iso: string, lang: Lang = "en") => part(iso, { weekday: "long" }, lang);
export const year = (iso: string, lang: Lang = "en") => part(iso, { year: "numeric" }, lang);
export const longDate = (iso: string, lang: Lang = "en") =>
  part(iso, { weekday: "long", day: "numeric", month: "long", year: "numeric" }, lang);
/** "19 January 2027" / "19 जनवरी 2027" */
export const shortDate = (iso: string, lang: Lang = "en") =>
  part(iso, { day: "numeric", month: "long", year: "numeric" }, lang);

/** "19 · 01 · 2027" */
export const dottedDate = (iso: string) => iso.split("-").reverse().join(" · ");

/** "+91 77228 18772" */
export const prettyPhone = (n: string) => `+${wedding.countryCode} ${n.slice(0, 5)} ${n.slice(5)}`;

export const telHref = (n: string) => `tel:+${wedding.countryCode}${n}`;

export const whatsappHref = (n: string, lang: Lang = "en") =>
  `https://wa.me/${wedding.countryCode}${n}?text=${encodeURIComponent(wedding.whatsappMessage[lang])}`;

/** Opens WhatsApp's "send to…" picker with a ready-made message. */
export const whatsappShareHref = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;

/** A venue as Google Maps understands it: exact pin when known, else the address text. */
const mapsPoint = (v: Venue) => (v.pin ? `${v.pin.lat},${v.pin.lng}` : v.mapsQuery);

/** Navigation from the guest's location to the venue. */
export const mapsHref = (v: Venue) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsPoint(v))}`;

/** Route between two venues, e.g. the baraat from the groom's home to the bride's. */
export const routeHref = (from: Venue, to: Venue) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(mapsPoint(from))}&destination=${encodeURIComponent(mapsPoint(to))}`;

/** Key-free Google Maps embed (pin, or the village when no pin is set). */
export const mapEmbedSrc = (v: Venue) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(mapsPoint(v))}&z=${v.pin ? 15 : 13}&output=embed`;

/** Public address of the invitation, used for QR codes and share links. */
export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return typeof window === "undefined" ? "" : window.location.origin;
}

/** True when the address is only reachable from this computer / Wi-Fi. */
export const isLocalAddress = (url: string) =>
  /^https?:\/\/(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[::1\])/.test(url);
