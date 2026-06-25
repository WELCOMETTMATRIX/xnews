import { ArrowUpRight, Sparkles } from "lucide-react";

const APPS = [
  {
    name: "Nocturne",
    tagline: "AI music for the night owls",
    url: "https://night-echoes-crystal.lovable.app",
    emojiless: "NC",
    gradient: "linear-gradient(135deg, #6366f1, #0ea5e9)",
  },
  {
    name: "FlipLink",
    tagline: "Share links that flip heads",
    url: "https://fliplinked.lovable.app",
    emojiless: "FL",
    gradient: "linear-gradient(135deg, #14b8a6, #22c55e)",
  },
  {
    name: "Aura Kids",
    tagline: "Safe, playful AI for kids",
    url: "https://auravai.lovable.app",
    emojiless: "AK",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
  },
  {
    name: "LyricsX",
    tagline: "Lyrics, decoded by AI",
    url: "https://lyricsx.lovable.app",
    emojiless: "LX",
    gradient: "linear-gradient(135deg, #0ea5e9, #14b8a6)",
  },
];

export function MoreFromNova() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="glass rounded-3xl p-6 md:p-10 aura-field overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-primary" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary font-body">
            The DOGEKINGMIKE Universe
          </span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-1 text-balance">
          More apps, all crafted by{" "}
          <span className="aura-text">DOGEKINGMIKE</span>
        </h2>
        <p className="text-[hsl(var(--news-meta))] font-body text-sm md:text-base mb-8 max-w-2xl text-pretty">
          Aura News 2.0 is part of a growing family of beautifully built apps. Take the rest for a spin.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {APPS.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-strong rounded-2xl p-4 flex items-center gap-4 card-hover"
            >
              <span
                className="h-12 w-12 rounded-xl flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0 aura-ring"
                style={{ background: app.gradient }}
              >
                {app.emojiless}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-display font-bold text-sm leading-none">{app.name}</span>
                <span className="block text-xs text-[hsl(var(--news-meta))] font-body mt-1 truncate">
                  {app.tagline}
                </span>
              </span>
              <ArrowUpRight
                size={18}
                className="text-[hsl(var(--news-meta))] group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
