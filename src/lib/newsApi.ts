import { supabase } from "@/integrations/supabase/client";

export interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsSource {
  id: string;
  name: string;
  description: string;
  category: string;
  country: string;
}

export async function fetchNews(params: {
  category?: string;
  source?: string;
  query?: string;
  page?: number;
}): Promise<{ articles: Article[]; totalResults: number }> {
  const { data, error } = await supabase.functions.invoke('fetch-news', {
    body: params,
  });

  if (error) throw new Error(error.message);
  if (data.error) throw new Error(data.error);

  return { articles: data.articles || [], totalResults: data.totalResults || 0 };
}

export async function fetchSources(category?: string): Promise<NewsSource[]> {
  const { data, error } = await supabase.functions.invoke('fetch-sources', {
    body: { category },
  });

  if (error) throw new Error(error.message);
  if (data.error) throw new Error(data.error);

  return data.sources || [];
}
