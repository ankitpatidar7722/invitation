/** QR code helpers. The encoder is loaded on demand so it never weighs on first paint. */

export type QrMatrix = { size: number; isDark: (row: number, col: number) => boolean };

export async function makeQr(text: string): Promise<QrMatrix> {
  const { create } = await import("qrcode");
  // "Q" survives scuffs and small print better than the default.
  const { size, data } = create(text, { errorCorrectionLevel: "Q" }).modules;
  return { size, isDark: (r, c) => data[r * size + c] === 1 };
}

/** One SVG path covering every dark module, in module units. */
export function qrPath(qr: QrMatrix): string {
  let d = "";
  for (let r = 0; r < qr.size; r++) {
    for (let c = 0; c < qr.size; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  }
  return d;
}

/** Standalone vector QR (with the required 4-module quiet zone) — best for printing. */
export function qrSvgString(qr: QrMatrix, fg = "#3F2F2B"): string {
  const full = qr.size + 8;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 ${full} ${full}" width="1024" height="1024" shape-rendering="crispEdges"><rect x="-4" y="-4" width="${full}" height="${full}" fill="#ffffff"/><path d="${qrPath(qr)}" fill="${fg}"/></svg>`;
}

/** Draws the QR (without quiet zone) with its top-left at x,y, each module `px` pixels. */
export function drawQr(ctx: CanvasRenderingContext2D, qr: QrMatrix, x: number, y: number, px: number, fg = "#3F2F2B") {
  ctx.fillStyle = fg;
  for (let r = 0; r < qr.size; r++) {
    for (let c = 0; c < qr.size; c++) {
      if (qr.isDark(r, c)) ctx.fillRect(Math.round(x + c * px), Math.round(y + r * px), Math.ceil(px), Math.ceil(px));
    }
  }
}

/** Square PNG of the QR with a white quiet zone. */
export function qrPngCanvas(qr: QrMatrix, pixels = 1024, fg = "#3F2F2B"): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = pixels;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, pixels, pixels);
  const px = pixels / (qr.size + 8);
  drawQr(ctx, qr, 4 * px, 4 * px, px, fg);
  return canvas;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
