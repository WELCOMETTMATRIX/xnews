import { useState, useEffect, useCallback } from "react";
import { fetchNews, Article } from "@/lib/newsApi";
import { NewsCard } from "@/components/NewsCard";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";
import { SearchBar } from "@/components/SearchBar";
import { SourcePicker } from "@/components/SourcePicker";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Logo } from "@/components/Logo";
import { MoreFromNova } from "@/components/MoreFromNova";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronDown, AlertCircle, Bookmark, Zap, Newspaper } from "lucide-react";

const CATEGORIES = [
  { id: "general", label: "Top Stories" },
  { id: "business", label: "Business" },
  { id: "technology", label: "Technology" },
  { id: "entertainment", label: "Entertainment" },
  { id: "health", label: "Health" },
  { id: "science", label: "Science" },
  { id: "sports", label: "Sports" },
];

export default function Index() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("general");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const { bookmarks, clearBookmarks } = useBookmarks();

  const loadNews = useCallback(async (reset = true) => {
    if (reset) {
      setLoading(true);
      setError(null);
      setArticles([]);
      setPage(1);
    } else {
      setLoadingMore(true);
    }

    const currentPage = reset ? 1 : page;

    try {
      const result = await fetchNews({
        category: !selectedSource && !searchQuery ? category : undefined,
        source: selectedSource || undefined,
        query: searchQuery || undefined,
        page: currentPage,
      });

      setArticles(prev => reset ? result.articles : [...prev, ...result.articles]);
      setTotalResults(result.totalResults);
      if (!reset) setPage(p => p + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, selectedSource, searchQuery, page]);

  useEffect(() => {
    loadNews(true);
  }, [category, selectedSource, searchQuery]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setSelectedSource(null);
    setShowSaved(false);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setSelectedSource(null);
    setSearchQuery("");
    setShowSaved(false);
  };

  const handleSourceChange = (src: string | null) => {
    setSelectedSource(src);
    setSearchQuery("");
    setShowSaved(false);
  };

  const feed = showSaved ? bookmarks : articles;
  const heroArticles = feed.slice(0, 1);
  const sideArticles = feed.slice(1, 4);
  const gridArticles = feed.slice(4);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  return (
    <div className="min-h-screen aura-field">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(var(--news-hero-bg))] text-white shadow-xl">
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
            <p className="text-xs text-white/50 font-body">{today}</p>
            <p className="text-xs text-white/50 font-body flex items-center gap-1.5">
              <Zap size={11} className="text-primary" /> Live updates · powered by Nova AI
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={44} className="animate-float-slow" />
            <div>
              <h1 className="font-display text-2xl font-bold leading-none flex items-baseline gap-1.5">
                Aura News <span className="aura-text font-bold">2.0</span>
              </h1>
              <p className="text-white/50 text-xs font-body">Crystal-clear live intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SearchBar onSearch={handleSearch} />
            <SourcePicker selectedSource={selectedSource} onSelectSource={handleSourceChange} />
            <button
              onClick={() => setShowSaved(s => !s)}
              className={`relative transition-colors p-1.5 rounded-lg hover:bg-white/10 ${showSaved ? "text-primary" : "text-white/70 hover:text-white"}`}
              title="Saved articles"
              aria-label="Saved articles"
            >
              <Bookmark size={16} className={showSaved ? "fill-primary" : ""} />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-[hsl(var(--primary-foreground))] text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </button>
            <ThemeSwitcher />
            <button
              onClick={() => loadNews(true)}
              className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              title="Refresh"
              aria-label="Refresh news"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Category Nav */}
        {!searchQuery && !selectedSource && !showSaved && (
          <div className="max-w-7xl mx-auto px-4 pb-3">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all font-body ${
                    category === cat.id
                      ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Marketing strip */}
      <div className="bg-[hsl(var(--news-hero-bg))] text-white/80">
        <div className="max-w-7xl mx-auto px-4 py-2 overflow-hidden">
          <p className="text-xs md:text-sm font-body text-center text-balance">
            Headlines that hit different. Install Aura News 2.0 and carry the whole newsroom in your pocket.
          </p>
        </div>
      </div>

      {/* Search / Source / Saved indicator */}
      {(searchQuery || selectedSource || showSaved) && (
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-body">
            <span className="text-[hsl(var(--news-meta))]">
              {showSaved ? "Your saved stories:" : "Showing results for:"}
            </span>
            <span className="font-semibold text-[hsl(var(--primary))]">
              {showSaved ? `${bookmarks.length} bookmarked` : searchQuery ? `"${searchQuery}"` : selectedSource}
            </span>
            {showSaved && bookmarks.length > 0 ? (
              <button
                onClick={clearBookmarks}
                className="text-xs text-[hsl(var(--news-meta))] underline hover:text-foreground"
              >
                Clear all
              </button>
            ) : !showSaved ? (
              <button
                onClick={() => { setSearchQuery(""); setSelectedSource(null); }}
                className="text-xs text-[hsl(var(--news-meta))] underline hover:text-foreground"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {showSaved && bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="glass rounded-full p-5">
              <Bookmark size={32} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold mb-1">No saved stories yet</h2>
              <p className="text-[hsl(var(--news-meta))] text-sm font-body max-w-sm">
                Tap the bookmark icon on any article to keep it here for later.
              </p>
            </div>
            <Button onClick={() => setShowSaved(false)} variant="outline">Browse the news</Button>
          </div>
        ) : error && !showSaved ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="bg-destructive/10 rounded-full p-4">
              <AlertCircle size={32} className="text-destructive" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold mb-1">Couldn't load news</h2>
              <p className="text-[hsl(var(--news-meta))] text-sm font-body max-w-sm">{error}</p>
            </div>
            <Button onClick={() => loadNews(true)} variant="outline">Try again</Button>
          </div>
        ) : loading && !showSaved ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <NewsCardSkeleton variant="hero" />
              </div>
              <div className="space-y-1">
                {[...Array(3)].map((_, i) => <NewsCardSkeleton key={i} variant="compact" />)}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <NewsCardSkeleton key={i} />)}
            </div>
          </>
        ) : feed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="glass rounded-full p-5">
              <Newspaper size={32} className="text-[hsl(var(--news-meta))]" />
            </div>
            <h2 className="font-display text-xl font-bold">No articles found</h2>
            <p className="text-[hsl(var(--news-meta))] font-body text-sm">Try a different search or category</p>
          </div>
        ) : (
          <>
            {/* Hero + Sidebar */}
            {heroArticles.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <NewsCard article={heroArticles[0]} variant="hero" />
                </div>
                <div className="flex flex-col justify-between glass rounded-2xl p-4">
                  <div>
                    <h2 className="font-display font-bold text-lg mb-3 pb-2 border-b border-[hsl(var(--news-divider))]">
                      {showSaved ? "More Saved" : "Latest Updates"}
                    </h2>
                    {sideArticles.map(article => (
                      <NewsCard key={article.url} article={article} variant="compact" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Grid */}
            {gridArticles.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="font-display font-bold text-xl">{showSaved ? "All Saved Stories" : "More Stories"}</h2>
                  <div className="flex-1 h-px bg-[hsl(var(--news-divider))]" />
                  {!showSaved && (
                    <span className="text-xs text-[hsl(var(--news-meta))] font-body">
                      {totalResults.toLocaleString()} total results
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridArticles.map(article => (
                    <NewsCard key={article.url} article={article} />
                  ))}
                </div>
              </>
            )}

            {/* Load more */}
            {!showSaved && articles.length < Math.min(totalResults, 100) && (
              <div className="flex justify-center mt-10">
                <Button
                  onClick={() => loadNews(false)}
                  disabled={loadingMore}
                  variant="outline"
                  className="gap-2 font-body rounded-full px-8 border-2 hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
                >
                  {loadingMore ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  {loadingMore ? "Loading..." : "Load More Stories"}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* More from Nova AI */}
      <MoreFromNova />

      <footer className="border-t border-[hsl(var(--news-divider))] py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-display font-bold text-lg">
              Aura News <span className="aura-text">2.0</span>
            </span>
          </div>
          <p className="text-[hsl(var(--news-meta))] text-sm font-body max-w-md text-pretty">
            Real-time, verified, beautifully delivered news. Powered by NewsAPI and updated live.
          </p>
          <p className="text-[hsl(var(--news-meta))] text-xs font-body">
            Created by <span className="font-semibold text-foreground">DOGEKINGMIKE</span> ·{" "}
            <span className="aura-text font-semibold">Nova AI</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
