import { ArrowRightIcon, CalendarCheckIcon, FlameIcon, MapPinIcon, StarIcon } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { MediaImage } from "@/components/shared/media-image";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
      {/* Background photo (placeholder until public/images/hero/hero.jpg exists), darkened for contrast */}
      <MediaImage
        src={siteConfig.images.hero}
        alt="Members training at Gold's Gym"
        priority
        className="absolute inset-0 -z-20 bg-zinc-900 opacity-40 [&_[role=img]]:items-start [&_[role=img]]:justify-end [&_[role=img]]:p-6"
      />
      {/* Decorative glow + grid */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_20%,color-mix(in_oklch,var(--primary),transparent_45%),transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <Container className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
        <div className="space-y-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/15">
            <MapPinIcon className="size-3.5" aria-hidden />
            Now open in {siteConfig.branch}
          </p>
          <h1 className="text-5xl leading-[1.05] font-extrabold tracking-tight text-balance uppercase sm:text-6xl lg:text-7xl">
            Stronger <span className="text-primary brightness-150">starts</span> here.
          </h1>
          <p className="max-w-xl text-lg text-pretty text-white/70">
            World-class equipment, 40+ group classes a week and coaches who know your name. Book classes in seconds and
            track every session from your member dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}>
              Join now
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
            <Link
              href="/classes"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-11 border-white/20 bg-white/5 px-5 text-base text-white hover:bg-white/15 hover:text-white",
              )}
            >
              Explore classes
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center px-2 text-base font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              Member login
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <div className="flex text-amber-400" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} className="size-4 fill-current" />
              ))}
            </div>
            Rated 4.9 by 1,200+ members
          </div>
        </div>

        <HeroPreview />
      </Container>
    </section>
  );
}

/** Static illustration of the member experience. */
function HeroPreview() {
  const rows = [
    { time: "6:00 AM", name: "HIIT Burn", coach: "Priya Nair", spots: "4 spots left" },
    { time: "7:00 AM", name: "Power Yoga", coach: "Kavya Rao", spots: "9 spots left" },
    { time: "6:00 PM", name: "Strength Foundations", coach: "Arjun Mehta", spots: "Booked", booked: true },
  ];

  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md lg:mr-0">
      <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-heading font-bold">Today&apos;s classes</p>
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">Live</span>
        </div>
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.name} className="flex items-center gap-4 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <span className="w-16 shrink-0 font-heading text-sm font-bold">{row.time}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{row.name}</span>
                <span className="block text-xs text-white/60">{row.coach}</span>
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-md px-2 py-1 text-xs",
                  row.booked ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/80",
                )}
              >
                {row.spots}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-xl bg-white p-3 text-zinc-900 shadow-2xl sm:flex">
        <span className="flex size-10 items-center justify-center rounded-lg bg-orange-500/15 text-orange-600">
          <FlameIcon className="size-5" />
        </span>
        <span className="text-sm">
          <span className="block font-bold">12-day streak</span>
          <span className="text-zinc-500">Keep it going!</span>
        </span>
      </div>
      <div className="absolute -top-5 -right-3 hidden items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-2xl sm:flex">
        <CalendarCheckIcon className="size-4 text-primary" />
        Booking confirmed
      </div>
    </div>
  );
}
