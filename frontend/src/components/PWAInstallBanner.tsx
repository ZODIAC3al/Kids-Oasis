"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Already installed as PWA?
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Dismissed before?
    const dismissed = sessionStorage.getItem("pwa-banner-dismissed");
    if (dismissed) return;

    if (ios) {
      const notInStandalone = !("standalone" in navigator && (navigator as any).standalone);
      if (notInStandalone) setTimeout(() => setShowBanner(true), 3000);
      return;
    }

    // Chrome/Edge beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 2000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) { setShowIOSGuide(true); return; }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const dismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  };

  if (isInstalled) return null;

  return (
    <>
      {/* ── Install Banner ── */}
      <AnimatePresence>
        {showBanner && !showIOSGuide && (
          <motion.div
            key="pwa-banner"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-sm"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-primary/20"
              style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #1E293B 100%)" }}>
              {/* Glow */}
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/20 blur-2xl pointer-events-none" />

              <div className="relative p-4 flex items-start gap-3">
                {/* App icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg"
                  style={{ background: "linear-gradient(135deg, #4F46E5, #0EA5E9)" }}>
                  <span className="text-2xl">🌴</span>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">Add Kids Oasis to Home Screen</p>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {isIOS
                      ? "Tap Share then \"Add to Home Screen\" for the full app experience"
                      : "Install for instant access, offline mode & notifications"}
                  </p>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleInstall}
                      className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-primary transition hover:bg-slate-100 active:scale-95"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {isIOS ? "How to install" : "Install App"}
                    </button>
                    <button
                      onClick={dismiss}
                      className="rounded-xl border border-white/20 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10"
                    >
                      Not now
                    </button>
                  </div>
                </div>

                {/* Close */}
                <button onClick={dismiss}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 transition">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── iOS Install Guide Modal ── */}
      <AnimatePresence>
        {showIOSGuide && (
          <motion.div
            key="ios-guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowIOSGuide(false)}
          >
            <motion.div
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 80 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-full max-w-sm rounded-3xl bg-surface p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-bold text-on-surface">Install on iPhone</h3>
                </div>
                <button onClick={() => setShowIOSGuide(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {[
                { step: "1", icon: "⬆️", text: "Tap the Share button in Safari" },
                { step: "2", icon: "➕", text: "Scroll down and tap \"Add to Home Screen\"" },
                { step: "3", icon: "✅", text: "Tap \"Add\" — Kids Oasis will appear on your home screen" },
              ].map(({ step, icon, text }) => (
                <div key={step} className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container/30 text-primary font-bold text-sm">
                    {step}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <p className="text-sm text-on-surface">{text}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-bold text-on-primary"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
