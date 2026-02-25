import { useState, useEffect } from "react";
import { fetchSources, NewsSource } from "@/lib/newsApi";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Rss, Check, Loader2 } from "lucide-react";

interface SourcePickerProps {
  selectedSource: string | null;
  onSelectSource: (sourceId: string | null) => void;
}

const CATEGORIES = ["all", "business", "entertainment", "health", "science", "sports", "technology"];

export function SourcePicker({ selectedSource, onSelectSource }: SourcePickerProps) {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchSources(filterCat === "all" ? undefined : filterCat)
      .then(setSources)
      .finally(() => setLoading(false));
  }, [open, filterCat]);

  const filtered = filterCat === "all" ? sources : sources.filter(s => s.category === filterCat);

  const handleSelect = (id: string) => {
    onSelectSource(selectedSource === id ? null : id);
    setOpen(false);
  };

  const selectedName = sources.find(s => s.id === selectedSource)?.name;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 font-body rounded-full border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
        >
          <Rss size={14} />
          {selectedName ? (
            <span className="text-[hsl(var(--primary))] font-semibold">{selectedName}</span>
          ) : (
            "Pick Source"
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[360px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Choose a News Source</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors font-body ${
                  filterCat === cat
                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                    : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-[hsl(var(--primary))]" size={28} />
            </div>
          ) : (
            <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
              <button
                onClick={() => { onSelectSource(null); setOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between font-body text-sm transition-colors ${
                  !selectedSource
                    ? "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]"
                    : "hover:bg-[hsl(var(--muted))]"
                }`}
              >
                <span className="font-semibold">All Sources (Top Headlines)</span>
                {!selectedSource && <Check size={14} />}
              </button>
              {filtered.map(source => (
                <button
                  key={source.id}
                  onClick={() => handleSelect(source.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition-colors ${
                    selectedSource === source.id
                      ? "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]"
                      : "hover:bg-[hsl(var(--muted))]"
                  }`}
                >
                  <div>
                    <p className="font-semibold font-body text-sm">{source.name}</p>
                    <p className="text-xs text-[hsl(var(--news-meta))] mt-0.5 capitalize">{source.category} · {source.country.toUpperCase()}</p>
                  </div>
                  {selectedSource === source.id && <Check size={14} className="flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
