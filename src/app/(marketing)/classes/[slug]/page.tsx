import {
  BackpackIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  ClockIcon,
  GaugeIcon,
  UserRoundIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/shared/json-Id";
import { MediaImage } from "@/components/shared/media-image";
import { Section } from "@/components/shared/section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { CategoryBadge } from "@/features/classes/components/category-badge";
import { ClassCard } from "@/features/classes/components/class-card";
import { LiveSchedule } from "@/features/classes/components/live-schedule";
import { ScheduleSkeleton } from "@/features/classes/components/schedule-skeleton";
import { categoryMeta, levelLabels } from "@/features/classes/constants";
import { getClassBySlug, getClasses } from "@/features/classes/server/queries";
import { getTrainers } from "@/features/trainers/server/queries";
import { formatDuration, formatMoney, getInitials } from "@/lib/format";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * The page reads `params` at the top level so unknown slugs return a real 404 (good for SEO)
 * rather than a streamed "soft" 404. Every slug is prerendered below, so this costs nothing.
 */
export const instant = false;

/** Prerender a page per class at build time. */
export async function generateStaticParams() {
  const classes = await getClasses();
  return classes.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/classes/[slug]">) {
  const gymClass = await getClassBySlug((await params).slug);
  if (!gymClass) return {};
  return createMetadata({ title: gymClass.name, description: gymClass.description, path: `/classes/${gymClass.slug}` });
}

export default async function ClassDetailPage({ params }: PageProps<"/classes/[slug]">) {
  const { slug } = await params;
  const [gymClass, classes, trainers] = await Promise.all([getClassBySlug(slug), getClasses(), getTrainers()]);
  if (!gymClass) notFound();

  const trainer = trainers.find((t) => t.id === gymClass.trainerId);
  const sameCategory = classes.filter((c) => c.category === gymClass.category && c.id !== gymClass.id);
  const related = [...sameCategory, ...classes.filter((c) => c.category !== gymClass.category)].slice(0, 3);
  const trainerName = new Map(trainers.map((t) => [t.id, t.name]));

  const facts: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: ClockIcon, label: "Duration", value: formatDuration(gymClass.durationMinutes) },
    { icon: GaugeIcon, label: "Level", value: levelLabels[gymClass.level] },
    { icon: categoryMeta[gymClass.category].icon, label: "Type", value: categoryMeta[gymClass.category].label },
    { icon: UserRoundIcon, label: "Coach", value: trainer?.name ?? "Gold's Gym coach" },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Classes", item: `${siteConfig.url}/classes` },
            { "@type": "ListItem", position: 3, name: gymClass.name, item: `${siteConfig.url}/classes/${gymClass.slug}` },
          ],
        }}
      />

      <Container className="py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <ChevronRightIcon className="size-4" aria-hidden />
            <li>
              <Link href="/classes" className="hover:text-foreground">
                Classes
              </Link>
            </li>
            <ChevronRightIcon className="size-4" aria-hidden />
            <li aria-current="page" className="font-medium text-foreground">
              {gymClass.name}
            </li>
          </ol>
        </nav>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <MediaImage
            src={gymClass.image}
            alt={`${gymClass.name} class at ${siteConfig.name}`}
            icon={categoryMeta[gymClass.category].icon}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-4/3 rounded-2xl ring-1 ring-foreground/10"
          />
          <div className="space-y-6">
            <CategoryBadge category={gymClass.category} />
            <h1 className="text-4xl font-extrabold tracking-tight uppercase sm:text-5xl">{gymClass.name}</h1>
            <p className="text-lg text-muted-foreground">{gymClass.description}</p>
            <dl className="grid grid-cols-2 gap-3">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="truncate font-semibold">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="text-muted-foreground">
              <span className="font-heading text-3xl font-extrabold text-foreground">{formatMoney(gymClass.price)}</span>{" "}
              per session + GST
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#sessions" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}>
                <CalendarDaysIcon data-icon="inline-start" />
                See upcoming sessions
              </a>
              <Link
                href="/contact?topic=trial"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-11 px-5 text-base")}
              >
                Try it free
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <InfoList title="What you'll get" icon={CircleCheckIcon} items={gymClass.highlights} />
          <InfoList title="What to bring" icon={BackpackIcon} items={gymClass.whatToBring} />
          {trainer && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Your coach</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary font-bold text-primary-foreground">
                      {getInitials(trainer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{trainer.name}</p>
                    <p className="text-sm text-muted-foreground">{trainer.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{trainer.bio}</p>
                <Link href="/trainers" className={cn(buttonVariants({ variant: "link", size: "sm" }), "px-0")}>
                  Meet all trainers
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>

      <Section
        id="sessions"
        eyebrow="Book a spot"
        title={`Upcoming ${gymClass.name} sessions`}
        description="Next 7 days. All times are IST."
        className="scroll-mt-16 border-t bg-muted/30"
      >
        <Suspense fallback={<ScheduleSkeleton />}>
          <LiveSchedule classSlug={gymClass.slug} />
        </Suspense>
      </Section>

      <Section title="You might also like">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((c) => (
            <ClassCard key={c.id} gymClass={c} trainerName={trainerName.get(c.trainerId)} />
          ))}
        </div>
      </Section>
    </>
  );
}

function InfoList({ title, icon: Icon, items }: { title: string; icon: LucideIcon; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
