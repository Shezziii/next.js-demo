import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-Id";
import { Section } from "@/components/shared/section";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ClassCard } from "@/features/classes/components/class-card";
import { getClasses } from "@/features/classes/server/queries";
import { PlanCard } from "@/features/plans/components/plan-card";
import { getPlans } from "@/features/plans/server/queries";
import { TrainerCard } from "@/features/trainers/components/trainer-card";
import { getTrainers } from "@/features/trainers/server/queries";
import { cn } from "@/lib/utils";

import { About } from "./_components/about";
import { Features, StatsStrip } from "./_components/highlights";
import { Hero } from "./_components/hero";
import { VisitCta } from "./_components/visit-cta";


export default async function LandingPage() {
  const [classes, plans, trainers] = await Promise.all([getClasses(), getPlans(), getTrainers()]);
  const trainerName = new Map(trainers.map((t) => [t.id, t.name]));

  const viewAll = (href: string, label: string) => (
    <Link href={href} className={buttonVariants({ variant: "outline" })}>
      {label}
      <ArrowRightIcon data-icon="inline-end" />
    </Link>
  );

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HealthClub",
          name: siteConfig.name,
          description: siteConfig.description,
          url: siteConfig.url,
          telephone: siteConfig.contact.phone,
          email: siteConfig.contact.email,
          address: siteConfig.contact.address,
          sameAs: Object.values(siteConfig.social),
        }}
      />

      <Hero />
      <StatsStrip />
      <About />
      <Features />

      <Section
        id="classes"
        eyebrow="Group classes"
        title="Find a class you'll love"
        description="From heavy lifting to flowing yoga — there's a class for every goal and every level."
        action={viewAll("/classes", "Full schedule")}
        className="scroll-mt-16 bg-muted/40"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.slice(0, 6).map((gymClass) => (
            <ClassCard key={gymClass.id} gymClass={gymClass} trainerName={trainerName.get(gymClass.trainerId)} />
          ))}
        </div>
      </Section>

      <Section
        id="plans"
        eyebrow="Membership"
        title="Simple, honest pricing"
        description="No joining fee. Freeze or upgrade your plan any time."
        align="center"
        className="scroll-mt-16"
      >
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              action={
                <Link
                  href={`/register?plan=${plan.id}`}
                  className={cn(buttonVariants({ variant: plan.highlighted ? "default" : "outline" }), "w-full")}
                >
                  Choose {plan.name}
                </Link>
              }
            />
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link href="/pricing" className="font-medium text-primary hover:underline">
            Compare all plan features
          </Link>
        </p>
      </Section>

      <Section
        eyebrow="Our team"
        title="Train with the best"
        description="Certified coaches who'll help you train safely and stay consistent."
        action={viewAll("/trainers", "All trainers")}
        className="bg-muted/40"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.slice(0, 3).map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              classes={classes.filter((c) => c.trainerId === trainer.id)}
            />
          ))}
        </div>
      </Section>

      <VisitCta />
    </>
  );
}
