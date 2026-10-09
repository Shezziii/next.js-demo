import { CalendarDaysIcon, CalendarSearchIcon, DumbbellIcon } from "lucide-react";
import { Suspense } from "react";

import { CardGridSkeleton } from "@/components/shared/card-grid-skeleton";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { siteConfig } from "@/config/site";
import { ClassCard } from "@/features/classes/components/class-card";
import { LiveSchedule } from "@/features/classes/components/live-schedule";
import { ScheduleSkeleton } from "@/features/classes/components/schedule-skeleton";
import { getClasses } from "@/features/classes/server/queries";
import { getTrainers } from "@/features/trainers/server/queries";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Classes & schedule",
  description: "HIIT, strength, yoga, spin, Zumba and more. See this week's class timetable at Gold's Gym and book your spot.",
  path: "/classes",
});

export default function ClassesPage() {
  return (
    <>
      <PageHero
        eyebrow="Group classes"
        title="Classes & schedule"
        description="40+ coached classes every week, from beginner-friendly to seriously tough. Browse the timetable and book your spot."
        image={siteConfig.images.classes}
        imageAlt="Members in a group class at Gold's Gym"
        imageIcon={DumbbellIcon}
      >
        <a href="#schedule" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/20 hover:bg-white/20">
          <CalendarDaysIcon className="size-4" aria-hidden />
          This week&apos;s timetable
        </a>
        <a href="#all-classes" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/20 hover:bg-white/20">
          <CalendarSearchIcon className="size-4" aria-hidden />
          All classes
        </a>
      </PageHero>

      <Section
        id="schedule"
        eyebrow="Timetable"
        title="Available sessions"
        description="All times are IST. Members can book up to 7 days ahead."
        className="scroll-mt-16"
      >
        {/* Shows booked state for members, so it's rendered per request. */}
        <Suspense fallback={<ScheduleSkeleton />}>
          <LiveSchedule />
        </Suspense>
      </Section>

      <Section
        id="all-classes"
        eyebrow="Our classes"
        title="Find your class"
        description="Every class on our timetable. Tap one for details, benefits and upcoming sessions."
        className="scroll-mt-16 border-t bg-muted/30"
      >
        <Suspense fallback={<CardGridSkeleton count={8} />}>
          <ClassCatalogue />
        </Suspense>
      </Section>
    </>
  );
}

async function ClassCatalogue() {
  const [classes, trainers] = await Promise.all([getClasses(), getTrainers()]);
  const trainerName = new Map(trainers.map((t) => [t.id, t.name]));

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {classes.map((gymClass) => (
        <ClassCard key={gymClass.id} gymClass={gymClass} trainerName={trainerName.get(gymClass.trainerId)} />
      ))}
    </div>
  );
}
