const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, source, query, page = 1 } = await req.json();
    const apiKey = Deno.env.get('NEWS_API_KEY');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'NEWS_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let url: string;

    if (query) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&page=${page}&language=en&apiKey=${apiKey}`;
    } else if (source) {
      url = `https://newsapi.org/v2/top-headlines?sources=${source}&pageSize=20&page=${page}&apiKey=${apiKey}`;
    } else {
      const cat = category || 'general';
      url = `https://newsapi.org/v2/top-headlines?category=${cat}&pageSize=20&page=${page}&language=en&apiKey=${apiKey}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to fetch news' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
