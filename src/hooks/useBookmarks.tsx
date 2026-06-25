import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Article } from "@/lib/newsApi";

interface BookmarksContextValue {
  bookmarks: Article[];
  isBookmarked: (url: string) => boolean;
  toggleBookmark: (article: Article) => void;
  clearBookmarks: () => void;
}

const BookmarksContext = createContext<BookmarksContextValue | undefined>(undefined);

const STORAGE_KEY = "aura-bookmarks";

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setBookmarks(JSON.parse(saved));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const persist = useCallback((next: Article[]) => {
    setBookmarks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const isBookmarked = useCallback(
    (url: string) => bookmarks.some((a) => a.url === url),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (article: Article) => {
      const exists = bookmarks.some((a) => a.url === article.url);
      const next = exists
        ? bookmarks.filter((a) => a.url !== article.url)
        : [article, ...bookmarks];
      persist(next);
    },
    [bookmarks, persist]
  );

  const clearBookmarks = useCallback(() => persist([]), [persist]);

  return (
    <BookmarksContext.Provider value={{ bookmarks, isBookmarked, toggleBookmark, clearBookmarks }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error("useBookmarks must be used within BookmarksProvider");
  return ctx;
}
