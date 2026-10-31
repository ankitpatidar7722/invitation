import type { Metadata, Viewport } from "next";
import { Amita, Cormorant_Garamond, Great_Vibes, Hind, Jost, Tiro_Devanagari_Hindi } from "next/font/google";
import { wedding } from "@/data/wedding";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

// Devanagari companions: each font stack lists the Latin face first and these
// second, so Hindi letters fall through to a matching Hindi typeface.
const devaSerif = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--font-deva-serif",
  display: "swap",
});

const devaScript = Amita({
  subsets: ["devanagari"],
  weight: ["400", "700"],
  variable: "--font-deva-script",
  display: "swap",
});

const devaSans = Hind({
  subsets: ["devanagari"],
  weight: ["300", "400", "500"],
  variable: "--font-deva-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3200");

const couple = `${wedding.groom.name.en} & ${wedding.bride.name.en}`;
const coupleHi = `${wedding.groom.name.hi} & ${wedding.bride.name.hi}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: wedding.site.title,
  description: wedding.site.description,
  applicationName: couple,
  appleWebApp: {
    capable: true,
    title: couple,
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    title: `शुभ विवाह · ${coupleHi} · ${couple} Wedding Invitation`,
    description: wedding.site.description,
    siteName: couple,
    locale: "hi_IN",
    alternateLocale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `शुभ विवाह · ${coupleHi} · ${couple} Wedding Invitation`,
    description: wedding.site.description,
  },
};

export const viewport: Viewport = {
  themeColor: wedding.site.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={wedding.defaultLang === "hi" ? "hi" : "en-IN"}
      className={`${serif.variable} ${script.variable} ${sans.variable} ${devaSerif.variable} ${devaScript.variable} ${devaSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks JS as available before paint so reveal/cover styles never hide content without JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
