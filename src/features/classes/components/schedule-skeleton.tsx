import { Skeleton } from "@/components/ui/skeleton";

export function ScheduleSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading schedule">
      <Skeleton className="h-12 w-full max-w-xl" />
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  );
}
