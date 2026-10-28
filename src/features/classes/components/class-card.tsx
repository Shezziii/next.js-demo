import { ArrowRightIcon, ClockIcon, GaugeIcon, UserIcon } from "lucide-react";
import Link from "next/link";

import { MediaImage } from "@/components/shared/media-image";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration, formatMoney } from "@/lib/format";

import { categoryMeta, levelLabels } from "../constants";
import type { GymClass } from "../types";
import { CategoryBadge } from "./category-badge";

/** Catalogue card for a class (not a specific session). Links to the class detail page. */
export function ClassCard({ gymClass, trainerName }: { gymClass: GymClass; trainerName?: string }) {
  return (
    <Card className="group relative h-full pt-0 transition-shadow hover:shadow-lg hover:ring-primary/30">
      <MediaImage
        src={gymClass.image}
        alt={`${gymClass.name} class at Gold's Gym`}
        icon={categoryMeta[gymClass.category].icon}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-video transition-transform"
      />
      <CardHeader>
        <CategoryBadge category={gymClass.category} />
        <CardTitle className="mt-2 text-lg font-bold">
          {/* Stretched link: the whole card is clickable, but only one link is announced. */}
          <Link href={`/classes/${gymClass.slug}`} className="after:absolute after:inset-0 group-hover:text-primary">
            {gymClass.name}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">{gymClass.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto flex-wrap gap-x-4 gap-y-1 border-t py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ClockIcon className="size-3.5" aria-hidden />
          {formatDuration(gymClass.durationMinutes)}
        </span>
        <span className="flex items-center gap-1">
          <GaugeIcon className="size-3.5" aria-hidden />
          {levelLabels[gymClass.level]}
        </span>
        {trainerName && (
          <span className="flex items-center gap-1">
            <UserIcon className="size-3.5" aria-hidden />
            {trainerName}
          </span>
        )}
        <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-foreground">
          {formatMoney(gymClass.price)}
          <ArrowRightIcon className="size-4 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </CardFooter>
    </Card>
  );
}
