import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pwa-install-dismissed");
    if (saved) return;

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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-80 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div
        className="rounded-2xl p-4 shadow-2xl flex gap-3 items-start"
        style={{ background: "hsl(var(--news-hero-bg))", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div
          className="rounded-xl p-2.5 flex-shrink-0"
          style={{ background: "hsl(var(--primary))" }}
        >
          <Smartphone size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-white text-sm leading-snug">Install XNEWS</p>
          <p className="text-white/60 text-xs mt-0.5 font-body leading-relaxed">
            Add to your home screen for instant access to live news.
          </p>
          <button
            onClick={handleInstall}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold font-body px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: "hsl(var(--primary))", color: "white" }}
          >
            <Download size={12} />
            Install App
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white/40 hover:text-white/70 transition-colors flex-shrink-0 mt-0.5"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
