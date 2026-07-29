"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const reg = async () => {
      try {
        const r = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
        setInterval(() => r.update(), 60000);
        r.addEventListener("updatefound", () => {
          const w = r.installing;
          if (!w) return;
          w.addEventListener("statechange", () => {
            if (w.state === "installed" && navigator.serviceWorker.controller)
              console.log("[SW] New version ready");
          });
        });
      } catch(e) { console.warn("[SW] Failed:", e); }
    };
    if (document.readyState === "complete") reg();
    else window.addEventListener("load", reg, { once: true });
  }, []);
  return null;
}
