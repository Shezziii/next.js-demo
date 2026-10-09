import { MapPinIcon, UserIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { BookSessionButton } from "@/features/bookings/components/book-session-button";
import { formatDuration, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

import { levelLabels } from "../constants";
import type { ClassSession } from "../types";
import { CategoryBadge } from "./category-badge";

type SessionCardProps = {
  session: ClassSession;
  isBooked: boolean;
  isAuthenticated: boolean;
  /** Set false on the class's own detail page, where linking to itself is pointless. */
  showClassLink?: boolean;
};

/** One bookable session in the timetable. */
export function SessionCard({ session, isBooked, isAuthenticated, showClassLink = true }: SessionCardProps) {
  const isFull = session.spotsLeft <= 0;
  const isLow = !isFull && session.spotsLeft <= 3;

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center",
        isBooked && "ring-2 ring-primary/40",
      )}
    >
      <div className="flex shrink-0 items-baseline gap-2 sm:w-28 sm:flex-col sm:gap-0">
        <p className="font-heading text-xl font-bold">{formatTime(session.startsAt)}</p>
        <p className="text-xs text-muted-foreground">{formatDuration(session.durationMinutes)}</p>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold">
            {showClassLink ? (
              <Link href={`/classes/${session.classSlug}`} className="hover:text-primary hover:underline">
                {session.className}
              </Link>
            ) : (
              session.className
            )}
          </h3>
          <CategoryBadge category={session.category} />
          <Badge variant="outline">{levelLabels[session.level]}</Badge>
        </div>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <UserIcon className="size-3.5" aria-hidden />
            {session.trainerName}
          </span>
          <span className="flex items-center gap-1">
            <MapPinIcon className="size-3.5" aria-hidden />
            {session.room}
          </span>
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <p
          className={cn(
            "text-sm text-muted-foreground",
            isLow && "font-medium text-orange-600 dark:text-orange-400",
            isFull && "text-destructive",
          )}
        >
          {isFull ? "No spots left" : `${session.spotsLeft} of ${session.capacity} spots left`}
        </p>
        <BookSessionButton
          session={session}
          isBooked={isBooked}
          isAuthenticated={isAuthenticated}
          className="min-w-24"
        />
      </div>
    </article>
  );
}
