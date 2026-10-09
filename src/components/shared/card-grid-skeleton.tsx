import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CardGridSkeletonProps = {
  count?: number;
  className?: string;
  /** Show an image block at the top of each card. */
  withMedia?: boolean;
};

export function CardGridSkeleton({ count = 6, className, withMedia = true }: CardGridSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading" className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
          {withMedia && <Skeleton className="aspect-video rounded-none" />}
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}