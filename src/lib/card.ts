/**
 * Draws the shareable invitation card (a portrait photo for WhatsApp) on a canvas,
 * in the chosen language. Runs in the browser so Hindi text is shaped by the
 * browser's own text engine with the site's web fonts.
 */
import { wedding, type Lang } from "@/data/wedding";
import { dicts } from "@/i18n/dict";
import { dayOfMonth, monthShort, prettyPhone, shortDate, weekday } from "@/lib/format";
import { drawQr, type QrMatrix } from "./qr";

const W = 1080;
const MIN_H = 1920;
const COLOR = {
  ink: "#3F2F2B",
  soft: "#5E4B45",
  gold: "#8E6F3A",
  goldLine: "#C9AC74",
  rose: "#A45A6D",
};

type Families = { serif: string; script: string; sans: string };

function fontFamilies(): Families {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    serif: `${v("--font-serif")}, ${v("--font-deva-serif")}, Georgia, serif`,
    script: `${v("--font-script")}, ${v("--font-deva-script")}, cursive`,
    sans: `${v("--font-sans")}, ${v("--font-deva-sans")}, sans-serif`,
  };
}

/** Rasterises one of the page's ornament <symbol>s to an image of the given size. */
async function ornament(name: string, w: number, h: number, color = COLOR.goldLine): Promise<HTMLImageElement | null> {
  const sym = document.getElementById(`orn-${name}`);
  if (!sym) return null;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${sym.getAttribute("viewBox")}" width="${w}" height="${h}" style="color:${color}">${sym.innerHTML}</svg>`;
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  try {
    await img.decode();
    return img;
  } catch {
    return null;
  }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderCard(lang: Lang, qr: QrMatrix | null): Promise<HTMLCanvasElement> {
  const dict = dicts[lang];
  const tx = (t: Record<Lang, string>) => t[lang];
  const f = fontFamilies();
  const g = tx(wedding.groom.name);
  const b = tx(wedding.bride.name);

  const font = {
    invocation: `400 42px ${f.serif}`,
    eyebrow: `500 30px ${f.sans}`,
    monogram: `500 104px ${f.serif}`,
    name: `400 128px ${f.script}`,
    weds: `italic 400 50px ${f.serif}`,
    label: `500 26px ${f.sans}`,
    body: `400 32px ${f.sans}`,
    person: `500 34px ${f.serif}`,
    // Cormorant's old-style figures shrink next to Devanagari, so Hindi uses the sans pairing for dates/times.
    date: lang === "hi" ? `500 62px ${f.sans}` : `500 66px ${f.serif}`,
    heading: `500 44px ${f.serif}`,
    event: lang === "hi" ? `400 32px ${f.sans}` : `500 33px ${f.serif}`,
    families: `500 40px ${f.serif}`,
  };

  // Make sure every face (Latin + Devanagari subsets) is ready before drawing.
  const sample =
    `${wedding.invocation}${g}${b}&|·0123456789` +
    JSON.stringify(dict) +
    JSON.stringify(wedding).replace(/[{}"\\]/g, " ");
  await Promise.all(Object.values(font).map((spec) => document.fonts.load(spec, sample).catch(() => [])));
  await document.fonts.ready;

  const [corner, wreath, divider, mandala] = await Promise.all([
    ornament("corner", 320, 320),
    ornament("wreath", 360, 360),
    ornament("divider", 480, 56),
    ornament("mandala", 980, 980, "rgba(201,172,116,0.16)"),
  ]);

  // ── Pass 1: content on a tall transparent canvas, tracking the height used.
  const content = document.createElement("canvas");
  content.width = W;
  content.height = 3200;
  const ctx = content.getContext("2d")!;
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  const spacing = (px: number) => {
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = lang === "en" ? `${px}px` : "0px";
  };
  const text = (s: string, fnt: string, color: string, x: number, y: number, align: CanvasTextAlign = "center") => {
    ctx.font = fnt;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(s, x, y);
  };

  const cx = W / 2;
  let y = 150;

  if (mandala) ctx.drawImage(mandala, cx - 490, 260);

  if (wedding.invocation) {
    text(wedding.invocation, font.invocation, COLOR.gold, cx, y);
    y += 74;
  }
  spacing(8);
  text(dict.cover.weddingInvitation.toUpperCase(), font.eyebrow, COLOR.gold, cx, y);
  spacing(0);
  y += 56;

  if (wreath) ctx.drawImage(wreath, cx - 180, y);
  const monogram = `${g.charAt(0)} & ${b.charAt(0)}`;
  ctx.font = font.monogram;
  // Keep the initials inside the wreath's inner ring.
  const fit = Math.min(1, 200 / ctx.measureText(monogram).width);
  ctx.font = `500 ${Math.floor(104 * fit)}px ${f.serif}`;
  ctx.fillStyle = COLOR.gold;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(monogram, cx, y + 186);
  ctx.textBaseline = "top";
  y += 384;

  text(g, font.name, COLOR.rose, cx, y);
  y += 166;
  text(dict.hero.weds, font.weds, COLOR.gold, cx, y);
  y += 76;
  text(b, font.name, COLOR.rose, cx, y);
  y += 186;

  text(dict.hero.together, font.body, COLOR.soft, cx, y);
  y += 78;

  // Families, two columns
  const colW = 430;
  const column = (x: number, role: string, grand: string, grandName: string, child: string, childName: string) => {
    let cy = y;
    spacing(5);
    text(role.toUpperCase(), font.eyebrow, COLOR.rose, x, cy);
    spacing(0);
    cy += 52;
    for (const [label, value] of [[grand, grandName], [child, childName]] as const) {
      spacing(3);
      text(label.toUpperCase(), font.label, COLOR.gold, x, cy);
      spacing(0);
      cy += 38;
      ctx.font = font.person;
      for (const line of wrap(ctx, value, colW)) {
        text(line, font.person, COLOR.ink, x, cy);
        cy += 44;
      }
      cy += 18;
    }
    return cy;
  };
  const fam = dict.families;
  const leftEnd = column(290, fam.groom, fam.grandson, tx(wedding.groom.grandfather), fam.son, tx(wedding.groom.father));
  const rightEnd = column(790, fam.bride, fam.granddaughter, tx(wedding.bride.grandfather), fam.daughter, tx(wedding.bride.father));
  ctx.strokeStyle = COLOR.goldLine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, y + 10);
  ctx.lineTo(cx, Math.max(leftEnd, rightEnd) - 20);
  ctx.stroke();
  y = Math.max(leftEnd, rightEnd) + 10;

  if (divider) ctx.drawImage(divider, cx - 240, y);
  y += 90;

  // Wedding date
  spacing(6);
  text(weekday(wedding.weddingDate, lang).toUpperCase(), font.eyebrow, COLOR.gold, cx, y);
  spacing(0);
  y += 50;
  text(shortDate(wedding.weddingDate, lang), font.date, COLOR.ink, cx, y);
  y += 110;

  // Programme
  text(dict.events.title, font.heading, COLOR.rose, cx, y);
  y += 78;
  const dateX = 300;
  const itemsX = 340;
  const itemsW = W - itemsX - 140;
  for (const day of wedding.events) {
    const color = day.highlight ? COLOR.rose : COLOR.ink;
    text(`${dayOfMonth(day.date, lang)} ${monthShort(day.date, lang)}`, font.eyebrow, COLOR.gold, dateX, y + 2, "right");
    const line = day.items
      .map((it) => {
        let label = it.time ? `${tx(it.name)} (${tx(it.time)})` : tx(it.name);
        // Most functions are at the groom's home; call out the ones elsewhere.
        if (it.venue && it.venue !== "groom") label += ` — ${tx(wedding.venues[it.venue].tag)}`;
        return label;
      })
      .join("  ·  ");
    ctx.font = font.event;
    for (const l of wrap(ctx, line, itemsW)) {
      text(l, font.event, color, itemsX, y, "left");
      y += 46;
    }
    y += 16;
  }
  y += 24;

  if (divider) ctx.drawImage(divider, cx - 240, y);
  y += 90;

  // Venues: groom's home and bride's home
  for (const v of [wedding.venues.groom, wedding.venues.bride]) {
    spacing(4);
    text(tx(v.label).toUpperCase(), font.label, COLOR.gold, cx, y);
    spacing(0);
    y += 42;
    for (const l of v.lines) {
      text(tx(l), font.person, COLOR.ink, cx, y);
      y += 46;
    }
    y += 26;
  }

  // Contacts
  spacing(4);
  text(dict.nav.contact.toUpperCase(), font.label, COLOR.gold, cx, y);
  spacing(0);
  y += 42;
  for (const c of wedding.contacts) {
    text(`${tx(c.name)}:  ${prettyPhone(c.phone)}`, font.body, COLOR.ink, cx, y);
    y += 46;
  }
  y += 40;

  // QR code
  if (qr) {
    const box = 280;
    const pad = 22;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = COLOR.goldLine;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - box / 2, y, box, box, 24);
    ctx.fill();
    ctx.stroke();
    const px = (box - pad * 2) / qr.size;
    drawQr(ctx, qr, cx - box / 2 + pad, y + pad, px, COLOR.ink);
    y += box + 22;
    text(dict.share.cardScan, font.label, COLOR.soft, cx, y);
    y += 70;
  }

  // Sign-off
  spacing(5);
  text(tx(wedding.closing.signOff).toUpperCase(), font.label, COLOR.gold, cx, y);
  spacing(0);
  y += 44;
  text(tx(wedding.closing.families), font.families, COLOR.ink, cx, y);
  y += 60;

  // ── Pass 2: background, border and corners sized to the content.
  const H = Math.max(MIN_H, Math.ceil(y + 190));
  const card = document.createElement("canvas");
  card.width = W;
  card.height = H;
  const out = card.getContext("2d")!;

  const bg = out.createLinearGradient(0, 0, W * 0.6, H);
  bg.addColorStop(0, "#FDF5F5");
  bg.addColorStop(0.45, "#F9EEEC");
  bg.addColorStop(1, "#F4ECDF");
  out.fillStyle = bg;
  out.fillRect(0, 0, W, H);

  out.strokeStyle = COLOR.goldLine;
  out.lineWidth = 3;
  out.beginPath();
  out.roundRect(34, 34, W - 68, H - 68, 36);
  out.stroke();
  out.lineWidth = 1.5;
  out.beginPath();
  out.roundRect(48, 48, W - 96, H - 96, 28);
  out.stroke();

  if (corner) {
    const S = 320;
    const place = (tx_: number, ty: number, sx: number, sy: number) => {
      out.save();
      out.translate(tx_, ty);
      out.scale(sx, sy);
      out.drawImage(corner, 0, 0, S, S);
      out.restore();
    };
    place(0, 0, 1, 1);
    place(W, 0, -1, 1);
    place(0, H, 1, -1);
    place(W, H, -1, -1);
  }

  out.drawImage(content, 0, 0, W, Math.min(H, content.height), 0, 0, W, Math.min(H, content.height));
  return card;
}
