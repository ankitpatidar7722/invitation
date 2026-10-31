"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Download, Loader2, MessageCircle, Printer, QrCode, Share2 } from "lucide-react";
import { wedding } from "@/data/wedding";
import { useLang } from "@/i18n/LangProvider";
import { renderCard } from "@/lib/card";
import { isLocalAddress, shortDate, siteUrl, whatsappShareHref } from "@/lib/format";
import { downloadBlob, makeQr, qrPath, qrPngCanvas, qrSvgString, type QrMatrix } from "@/lib/qr";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type Card = { blob: Blob; url: string };

const toBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), type, quality),
  );

export default function Share() {
  const { lang, dict, tx } = useLang();
  const s = dict.share;
  const sectionRef = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [base, setBase] = useState("");
  const [qr, setQr] = useState<QrMatrix | null>(null);
  const [card, setCard] = useState<Card | null>(null);
  const [copied, setCopied] = useState(false);
  const [canShareFiles, setCanShareFiles] = useState(false);

  const fileBase = `${wedding.groom.name.en}-${wedding.bride.name.en}`;
  // English guests get an English link; the QR always opens the default (Hindi) page.
  const link = base ? (lang === wedding.defaultLang ? `${base}/` : `${base}/?lang=${lang}`) : "";
  const message = `${s.shareText(tx(wedding.groom.name), tx(wedding.bride.name), shortDate(wedding.weddingDate, lang))} ${link}`;

  useEffect(() => {
    setBase(siteUrl());
    try {
      const probe = new File([new Blob(["x"], { type: "image/jpeg" })], "x.jpg", { type: "image/jpeg" });
      setCanShareFiles(!!navigator.canShare?.({ files: [probe] }));
    } catch {
      setCanShareFiles(false);
    }
  }, []);

  // Build the QR and card only when the guest gets close to this section.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near || !base) return;
    let cancelled = false;
    makeQr(`${base}/`)
      .then((m) => !cancelled && setQr(m))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [near, base]);

  useEffect(() => {
    if (!near || !qr) return;
    let cancelled = false;
    let made: string | null = null;
    setCard(null);
    renderCard(lang, qr)
      .then((canvas) => toBlob(canvas, "image/jpeg", 0.9))
      .then((blob) => {
        if (cancelled) return;
        made = URL.createObjectURL(blob);
        setCard({ blob, url: made });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (made) URL.revokeObjectURL(made);
    };
  }, [near, qr, lang]);

  const cardFile = useMemo(
    () => (card ? new File([card.blob], `${fileBase}-Invitation.jpg`, { type: "image/jpeg" }) : null),
    [card, fileBase],
  );

  const shareCard = async () => {
    if (!cardFile) return;
    try {
      await navigator.share({ files: [cardFile], text: message });
    } catch {
      /* cancelled by the guest */
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked */
    }
  };

  const downloadQrPng = async () => {
    if (qr) downloadBlob(await toBlob(qrPngCanvas(qr), "image/png"), `${fileBase}-QR.png`);
  };
  const downloadQrSvg = () => {
    if (qr) downloadBlob(new Blob([qrSvgString(qr)], { type: "image/svg+xml" }), `${fileBase}-QR.svg`);
  };

  return (
    <section ref={sectionRef} id="share" className="section" aria-labelledby="share-title">
      <SectionHeading id="share-title" eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />

      <div className="mx-auto grid max-w-4xl items-start gap-8 md:grid-cols-[1.1fr_1fr]">
        {/* Card preview + actions */}
        <Reveal className="card card-frame px-5 py-6 text-center sm:px-8 sm:py-8">
          <div className="relative mx-auto w-full max-w-[19rem] overflow-hidden rounded-2xl border border-gold-300/70 bg-ivory shadow-soft">
            {card ? (
              // eslint-disable-next-line @next/next/no-img-element -- local blob URL, not optimisable
              <img src={card.url} alt={s.cardAlt} className="block h-auto w-full" />
            ) : (
              <div className="flex aspect-[9/16] flex-col items-center justify-center gap-3 text-sm text-ink-soft" role="status">
                <Loader2 className="h-6 w-6 animate-spin text-gold-500 motion-reduce:animate-none" aria-hidden="true" />
                {s.preparing}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              className="btn-gold disabled:opacity-60"
              disabled={!card}
              onClick={() => card && downloadBlob(card.blob, `${fileBase}-Invitation-${lang}.jpg`)}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {s.download}
            </button>
            {canShareFiles && (
              <button type="button" className="btn-outline disabled:opacity-60" disabled={!card} onClick={shareCard}>
                <Share2 className="h-4 w-4" aria-hidden="true" />
                {s.shareCard}
              </button>
            )}
            <a
              href={link ? whatsappShareHref(message) : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {s.shareLink}
            </a>
            <button type="button" className="btn-outline" onClick={copyLink} disabled={!link}>
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              <span aria-live="polite">{copied ? s.copied : s.copyLink}</span>
            </button>
          </div>
        </Reveal>

        {/* QR code */}
        <Reveal delay={120} className="card card-frame px-6 py-8 text-center sm:px-8">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blush-100 text-rose-500">
            <QrCode className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-serif text-3xl text-ink">{s.qrTitle}</h3>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">{s.qrText}</p>

          <div className="mx-auto mt-6 w-full max-w-[15rem] rounded-2xl border border-gold-300/70 bg-white p-3 shadow-soft">
            {qr ? (
              <svg
                viewBox={`-4 -4 ${qr.size + 8} ${qr.size + 8}`}
                className="block h-auto w-full"
                shapeRendering="crispEdges"
                role="img"
                aria-label={`${s.qrTitle}: ${base}/`}
              >
                <rect x={-4} y={-4} width={qr.size + 8} height={qr.size + 8} fill="#fff" />
                <path d={qrPath(qr)} fill="#3F2F2B" />
              </svg>
            ) : (
              <div className="flex aspect-square items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gold-500 motion-reduce:animate-none" aria-hidden="true" />
              </div>
            )}
          </div>
          {base && <p className="mt-3 break-all font-sans text-xs text-ink-soft">{base}/</p>}
          {base && isLocalAddress(base) && (
            <p className="mx-auto mt-3 max-w-xs rounded-xl bg-blush-100 px-3 py-2 text-xs leading-relaxed text-rose-600">
              {s.localWarning}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <button type="button" className="btn-outline disabled:opacity-60" disabled={!qr} onClick={downloadQrPng}>
              <Download className="h-4 w-4" aria-hidden="true" />
              {s.qrPng}
            </button>
            <button type="button" className="btn-outline disabled:opacity-60" disabled={!qr} onClick={downloadQrSvg}>
              <Printer className="h-4 w-4" aria-hidden="true" />
              {s.qrSvg}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
