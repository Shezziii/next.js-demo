import { CalendarClockIcon, DumbbellIcon, HeartPulseIcon, UsersIcon } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const stats = [
  { value: "2,000+", label: "Active members" },
  { value: "40+", label: "Classes every week" },
  { value: "12", label: "Certified coaches" },
  { value: "17 hrs", label: "Open daily" },
];

const features = [
  {
    icon: DumbbellIcon,
    title: "Pro-grade equipment",
    description: "Hammer Strength racks, free weights to 50 kg and a dedicated functional zone.",
  },
  {
    icon: UsersIcon,
    title: "Expert coaching",
    description: "Certified trainers on the floor at all times, plus 1-on-1 personal training.",
  },
  {
    icon: CalendarClockIcon,
    title: "Book in seconds",
    description: "Reserve your spot in any class up to 7 days ahead from your member dashboard.",
  },
  {
    icon: HeartPulseIcon,
    title: "Progress you can see",
    description: "Regular fitness assessments and check-ins to keep you moving forward.",
  },
];

export function StatsStrip() {
  return (
    <div className="border-b bg-primary text-primary-foreground">
      <Container className="grid grid-cols-2 gap-6 py-10 text-center lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-heading text-3xl font-extrabold sm:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm opacity-80">{stat.label}</p>
          </div>
        ))}
      </Container>
    </div>
  );
}

export function Features() {
  return (
    <Section
      eyebrow="Why Gold's Gym"
      title="Everything you need to reach your goals"
      description="Whether you're picking up a barbell for the first time or chasing a new PR."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
            <span className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
