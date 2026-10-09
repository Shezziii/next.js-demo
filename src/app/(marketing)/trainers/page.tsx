import { UsersIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { CardGridSkeleton } from "@/components/shared/card-grid-skeleton";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getClasses } from "@/features/classes/server/queries";
import { TrainerCard } from "@/features/trainers/components/trainer-card";
import { getTrainers } from "@/features/trainers/server/queries";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Trainers",
  description: "Meet the certified coaches at Gold's Gym: strength, HIIT, yoga, cycling and dance specialists.",
  path: "/trainers",
});

export default function TrainersPage() {
  return (
    <>
      <PageHero
        eyebrow="Our team"
        title="Meet your coaches"
        description="Certified trainers who'll help you train safely, stay consistent and actually enjoy it."
        image={siteConfig.images.trainers}
        imageAlt="Gold's Gym coaching team"
        imageIcon={UsersIcon}
      >
        <Link href="/contact?topic=personal-training" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}>
          Book personal training
        </Link>
      </PageHero>

      <Section>
        <Suspense fallback={<CardGridSkeleton count={6} />}>
          <TrainerGrid />
        </Suspense>
      </Section>
    </>
  );
}

async function TrainerGrid() {
  const [trainers, classes] = await Promise.all([getTrainers(), getClasses()]);
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trainers.map((trainer) => (
        <TrainerCard key={trainer.id} trainer={trainer} classes={classes.filter((c) => c.trainerId === trainer.id)} />
      ))}
    </div>
  );
}
