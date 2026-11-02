# Ankit & Yashasvi — Digital Wedding Invitation

A mobile-first, installable (PWA) wedding invitation website for the wedding of **Ankit & Yashasvi** on **19 January 2027**, Village Gothada, Tehsil Nalkheda, District Agar Malwa, Madhya Pradesh.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3 and lucide-react. All floral artwork is hand-built SVG — no external or hotlinked images.

## Features

- Monogram cover with floral wreath and **Open Invitation** "doors" reveal
- Couple names with grandparents' and parents' names
- Live countdown to 19 January 2027 (Asia/Kolkata), with a wedding-day / after-wedding message instead of negative numbers
- Event timeline (14–19 January 2027) with the supplied times only
- Venue card with a **Get Directions** Google Maps search link (no invented coordinates)
- Photo gallery with lightbox (keyboard ←/→/Esc, swipe on phones) and elegant placeholders
- RSVP / contact cards: tap-to-call (`tel:`) and WhatsApp for all three numbers
- Optional background music (off by default, never autoplays)
- PWA manifest, generated icons, conservative service worker, Open Graph image, theme colour
- Accessible: semantic HTML, focus styles, skip link, `prefers-reduced-motion`, works without JavaScript (cover is skipped)

## Hindi / English

- The site **always opens in Hindi** (`defaultLang` in `src/data/wedding.ts`) — every visit and every shared link. The **EN / हिं** button (on the cover and in the top bar) switches language for that page view only.
- Every guest-facing text in `wedding.ts` is written as `{ hi: "…", en: "…" }`. Fixed UI labels (buttons, headings) are in `src/i18n/dict.ts`.

## Invitation card & QR code (section "निमंत्रण भेजें / Share")

- The site draws a **portrait invitation card photo** (names, families, date, programme, venue, contacts and a QR code) in the current language. Guests can **download** it or, on phones that support it, **share** it straight to WhatsApp. There is also "send link on WhatsApp" and "copy link".
- The **QR code** opens the invitation. "QR download (for printing)" gives a vector SVG — best for the printer; "QR download (photo)" gives a 1024×1024 PNG.
- **Important:** the QR and shared links use the address the site is opened from. Download the QR **from the live Vercel site**, not from `localhost` (the page warns you if the address is local). To pin a custom domain, set `NEXT_PUBLIC_SITE_URL=https://your-domain` in Vercel and redeploy.

## Run locally

Requires Node.js 18.18+ (tested on Node 24).

```bash
npm install
npm run dev        # http://localhost:3200
```

Production check:

```bash
npm run typecheck
npm run lint
npm run build
npm start          # http://localhost:3200
```

To test on your phone, run `npm run dev` and open `http://<your-computer-LAN-IP>:3200` on the same Wi-Fi.

Tip: a link to a section, e.g. `/#venue` or `/#events`, skips the cover and opens that section directly.

## Editing the content

**Everything lives in [`src/data/wedding.ts`](src/data/wedding.ts)** — names, families, events, venue, phone numbers, gallery, music, closing text, page title and description. No other file needs to change.

- Event with no time → leave `time` out. Event with a time → `{ name: "Nikasi", time: "8:00 PM onwards" }`.
- `highlight: true` on a day gives it the "Wedding Day" styling.
- `invocation` (॥ श्री गणेशाय नमः ॥) can be changed or set to `""` to hide it.

## Adding photos

1. Put images in `public/photos/` (e.g. `public/photos/couple-1.jpg`). JPG/WebP around 1600px on the long side is plenty.
2. In `src/data/wedding.ts`, set `src` on a gallery entry:

```ts
gallery: [
  { src: "/photos/couple-1.jpg", alt: "Ankit and Yashasvi at the engagement", caption: "Engagement" },
  ...
]
```

Entries without `src` show a floral placeholder. Add or remove entries freely.

## Adding music (optional)

Only use a file you own or have a licence for.

1. Put the file in `public/music/`, e.g. `public/music/shehnai.mp3` (keep it small — 1–3 MB).
2. Set `music.src: "/music/shehnai.mp3"` in `src/data/wedding.ts`.

A round music on/off button then appears at the bottom-right. Music starts only after the guest taps **Open Invitation** (or the button) — browsers block autoplay anyway.

## Icons, sharing preview & PWA

- Favicon, app icons (`/icon/32`, `/icon/192`, `/icon/512`), Apple touch icon and the Open Graph preview image are **generated** from the names in `src/app/icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`. To use your own artwork instead, delete those files and add `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/opengraph-image.png` (1200×630).
- The manifest is `src/app/manifest.ts`. The site is a normal website that supported browsers (Chrome on Android, Safari "Add to Home Screen") can optionally install — it is **not** an APK.
- `public/sw.js` caches the page for offline viewing after the first visit. It is only registered in production. After changing content, bump `VERSION` in `sw.js` so returning visitors get the update promptly.
- Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://ankit-yashasvi.vercel.app`) so link previews use absolute URLs. On Vercel, the production domain is picked up automatically.

## Deploy to Vercel

**Option A — GitHub (recommended)**

```bash
git init
git add .
git commit -m "Wedding invitation"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then on vercel.com → **Add New… → Project** → import the repo → Deploy (framework is auto-detected as Next.js; no environment variables are required).

**Option B — Vercel CLI**

```bash
npm i -g vercel
vercel login
vercel            # preview deployment
vercel --prod     # production, when you are happy with the preview
```

## Project structure

```
src/
  data/wedding.ts            ← all wedding content
  app/                       layout (fonts, metadata), page, manifest, generated icons/OG image
  components/                Cover, Hero, Families, Countdown, Events, Venue, Gallery, Contact, Closing, …
  components/ornaments/      SVG floral wreath, corners, divider, mandala (one shared sprite)
  lib/format.ts              date formatting, tel/WhatsApp/Maps links
public/
  photos/                    your photos
  music/                     optional music file
  sw.js                      service worker
```
