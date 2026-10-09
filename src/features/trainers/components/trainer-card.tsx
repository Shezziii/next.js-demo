import { AwardIcon, CalendarDaysIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";

import { MediaImage } from "@/components/shared/media-image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { GymClass } from "@/features/classes/types";

import type { Trainer } from "../types";
import { TrainerProfileDialog } from "./trainer-profile-dialog";

type TrainerCardProps = {
  trainer: Trainer;
  /** Classes this trainer leads, shown in the profile modal. */
  classes?: Pick<GymClass, "slug" | "name">[];
};

export function TrainerCard({ trainer, classes = [] }: TrainerCardProps) {
  return (
    <Card className="h-full pt-0">
      <MediaImage
        src={trainer.image}
        alt={`${trainer.name}, ${trainer.role}`}
        icon={UserRoundIcon}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-4/3"
      />
      <CardHeader>
        <CardTitle className="text-lg font-bold">{trainer.name}</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <AwardIcon className="size-4 text-primary" aria-hidden />
          {trainer.role} · {trainer.experienceYears} yrs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {trainer.specialties.map((specialty) => (
            <Badge key={specialty} variant="outline">
              {specialty}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto border-t bg-transparent">
        <TrainerProfileDialog name={trainer.name}>
          <MediaImage
            src={trainer.image}
            alt={`${trainer.name}, ${trainer.role}`}
            icon={UserRoundIcon}
            sizes="(min-width: 640px) 512px, 100vw"
            className="aspect-video"
          />
          <div className="space-y-4 p-5">
            <div>
              <p className="font-heading text-2xl font-bold">{trainer.name}</p>
              <p className="text-muted-foreground">
                {trainer.role} · {trainer.experienceYears} years coaching
              </p>
            </div>
            <p>{trainer.bio}</p>
            <div className="flex flex-wrap gap-1.5">
              {trainer.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
            {classes.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <CalendarDaysIcon className="size-4 text-primary" aria-hidden />
                  Classes with {trainer.name.split(" ")[0]}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {classes.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/classes/${c.slug}`}
                        className="inline-flex rounded-md bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary hover:bg-primary/15"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TrainerProfileDialog>
      </CardFooter>
    </Card>
  );
}
