import { useState, useEffect, useCallback } from "react";
import { fetchNews, Article } from "@/lib/newsApi";
import { NewsCard } from "@/components/NewsCard";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";
import { SearchBar } from "@/components/SearchBar";
import { SourcePicker } from "@/components/SourcePicker";
import { Button } from "@/components/ui/button";
import { RefreshCw, Newspaper, ChevronDown, AlertCircle } from "lucide-react";

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
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setSelectedSource(null);
    setSearchQuery("");
  };

  const handleSourceChange = (src: string | null) => {
    setSelectedSource(src);
    setSearchQuery("");
  };

  const heroArticles = articles.slice(0, 1);
  const sideArticles = articles.slice(1, 4);
  const gridArticles = articles.slice(4);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(var(--news-hero-bg))] text-white shadow-lg">
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
            <p className="text-xs text-white/50 font-body">{today}</p>
            <p className="text-xs text-white/50 font-body">Powered by NewsAPI · Live Updates</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[hsl(var(--primary))] rounded-lg p-2">
              <Newspaper size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-none">NewsAI</h1>
              <p className="text-white/50 text-xs font-body">Live Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SearchBar onSearch={handleSearch} />
            <SourcePicker selectedSource={selectedSource} onSelectSource={handleSourceChange} />
            <button
              onClick={() => loadNews(true)}
              className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Category Nav */}
        {!searchQuery && !selectedSource && (
          <div className="max-w-7xl mx-auto px-4 pb-3">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all font-body ${
                    category === cat.id
                      ? "bg-[hsl(var(--primary))] text-white"
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

      {/* Search / Source indicator */}
      {(searchQuery || selectedSource) && (
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-body">
            <span className="text-[hsl(var(--news-meta))]">Showing results for:</span>
            <span className="font-semibold text-[hsl(var(--primary))]">
              {searchQuery ? `"${searchQuery}"` : selectedSource}
            </span>
            <button
              onClick={() => { setSearchQuery(""); setSelectedSource(null); }}
              className="text-xs text-[hsl(var(--news-meta))] underline hover:text-foreground"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {error ? (
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
        ) : loading ? (
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
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="bg-muted rounded-full p-4">
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
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="font-display font-bold text-lg mb-3 pb-2 border-b border-[hsl(var(--news-divider))]">
                      Latest Updates
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
                  <h2 className="font-display font-bold text-xl">More Stories</h2>
                  <div className="flex-1 h-px bg-[hsl(var(--news-divider))]" />
                  <span className="text-xs text-[hsl(var(--news-meta))] font-body">
                    {totalResults.toLocaleString()} total results
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridArticles.map(article => (
                    <NewsCard key={article.url} article={article} />
                  ))}
                </div>
              </>
            )}

            {/* Load more */}
            {articles.length < Math.min(totalResults, 100) && (
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

      <footer className="border-t border-[hsl(var(--news-divider))] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-[hsl(var(--news-meta))] text-sm font-body">
          <p>NewsAI · Live news powered by NewsAPI · Data updates in real-time</p>
        </div>
      </footer>
    </div>
  );
}
