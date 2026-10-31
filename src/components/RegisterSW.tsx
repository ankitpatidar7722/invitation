"use client";

import { useEffect } from "react";

/** Registers the service worker in production only, so dev never serves stale files. */
export default function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* Installability is optional; the site works without it. */
    });
  }, []);
  return null;
}
