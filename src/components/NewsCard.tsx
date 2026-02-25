import { Article } from "@/lib/newsApi";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  article: Article;
  variant?: "hero" | "default" | "compact";
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  const hasImage = !!article.urlToImage;

  if (variant === "hero") {
    return (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative overflow-hidden rounded-xl h-[420px] md:h-[480px] card-hover"
      >
        {hasImage ? (
          <img
            src={article.urlToImage!}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--news-hero-bg))] to-[hsl(var(--primary))]" />
        )}
        <div className="absolute inset-0 news-gradient" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge className="mb-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-body text-xs uppercase tracking-wider">
            {article.source.name}
          </Badge>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight mb-3 line-clamp-3">
            {article.title}
          </h2>
          {article.description && (
            <p className="text-white/80 text-sm line-clamp-2 mb-3 font-body">{article.description}</p>
          )}
          <div className="flex items-center gap-4 text-white/60 text-xs font-body">
            <span className="flex items-center gap-1"><Clock size={12} />{timeAgo}</span>
            {article.author && <span className="flex items-center gap-1"><User size={12} />{article.author.split(',')[0]}</span>}
          </div>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <ExternalLink size={14} className="text-white" />
          </div>
        </div>
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex gap-3 py-3 border-b border-[hsl(var(--news-divider))] last:border-0 hover:bg-[hsl(var(--news-card-hover))] rounded-lg px-2 -mx-2 transition-colors"
      >
        {hasImage && (
          <img
            src={article.urlToImage!}
            alt=""
            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm text-foreground line-clamp-2 leading-snug mb-1">
            {article.title}
          </p>
          <div className="flex items-center gap-2 text-[hsl(var(--news-meta))] text-xs font-body">
            <span>{article.source.name}</span>
            <span>·</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-[hsl(var(--news-surface))] rounded-xl overflow-hidden border border-[hsl(var(--news-divider))] card-hover"
    >
      {hasImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.urlToImage!}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[hsl(var(--primary))] text-xs font-semibold uppercase tracking-wider font-body">
            {article.source.name}
          </span>
          <ExternalLink size={12} className="text-[hsl(var(--news-meta))] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h3 className="font-display font-bold text-base leading-snug mb-2 line-clamp-3">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-[hsl(var(--news-meta))] text-sm line-clamp-2 mb-3 font-body leading-relaxed">
            {article.description}
          </p>
        )}
        <div className="flex items-center gap-3 text-[hsl(var(--news-meta))] text-xs font-body">
          <span className="flex items-center gap-1"><Clock size={11} />{timeAgo}</span>
          {article.author && (
            <span className="flex items-center gap-1 truncate max-w-[120px]">
              <User size={11} />{article.author.split(',')[0]}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
