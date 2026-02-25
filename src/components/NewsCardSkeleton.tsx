import { Skeleton } from "@/components/ui/skeleton";

export function NewsCardSkeleton({ variant = "default" }: { variant?: "hero" | "default" | "compact" }) {
  if (variant === "hero") {
    return <div className="skeleton-pulse rounded-xl h-[420px] md:h-[480px]" />;
  }
  if (variant === "compact") {
    return (
      <div className="flex gap-3 py-3 border-b border-border">
        <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
