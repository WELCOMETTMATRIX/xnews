import { useState, useEffect } from "react";
import { Download, X, Share, Plus } from "lucide-react";
import { Logo } from "./Logo";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPadOS reports as Mac with touch support
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("pwa-install-dismissed")) return;
    if (isStandalone()) return;

    const onIOS = isIOS();
    setIos(onIOS);

    // iOS has no beforeinstallprompt — show manual instructions after a delay
    if (onIOS) {
      const t = setTimeout(() => setShow(true), 3500);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-80 z-[60] animate-in slide-in-from-bottom-4 duration-300">
      <div className="glass-strong rounded-2xl p-4 shadow-2xl flex gap-3 items-start aura-ring">
        <Logo size={42} className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-foreground text-sm leading-snug">
            Install Aura News 2.0
          </p>

          {ios ? (
            <>
              <p className="text-[hsl(var(--news-meta))] text-xs mt-1 font-body leading-relaxed">
                Add to your Home Screen for the full app experience:
              </p>
              <ol className="text-xs text-foreground/80 font-body mt-2 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="font-bold text-primary">1.</span>
                  Tap <Share size={13} className="inline text-primary" /> Share
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-primary">2.</span>
                  Choose <Plus size={13} className="inline text-primary" /> Add to Home Screen
                </li>
              </ol>
            </>
          ) : (
            <>
              <p className="text-[hsl(var(--news-meta))] text-xs mt-0.5 font-body leading-relaxed">
                Works on Android &amp; desktop. Add it to your home screen for instant, offline-ready news.
              </p>
              <button
                onClick={handleInstall}
                className="mt-3 flex items-center gap-1.5 text-xs font-semibold font-body px-3 py-1.5 rounded-lg text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
                style={{ background: "hsl(var(--primary))" }}
              >
                <Download size={12} />
                Install App
              </button>
            </>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="text-[hsl(var(--news-meta))] hover:text-foreground transition-colors flex-shrink-0 mt-0.5"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
