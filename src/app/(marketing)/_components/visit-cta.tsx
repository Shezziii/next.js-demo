import { ArrowRightIcon, ClockIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function VisitCta() {
  const { contact, hours } = siteConfig;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 overflow-hidden rounded-3xl bg-zinc-950 p-8 text-white sm:p-12 lg:grid-cols-2">
          <div className="space-y-5">
            <h2 className="text-3xl font-extrabold uppercase sm:text-4xl">Your first session is on us</h2>
            <p className="text-white/70">
              Drop in for a free trial workout and a fitness assessment with one of our coaches. Already a member? Sign
              in to book your next class.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact?topic=trial" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}>
                Book a free trial
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-11 border-white/20 bg-white/5 px-5 text-base text-white hover:bg-white/15 hover:text-white",
                )}
              >
                <PhoneIcon data-icon="inline-start" />
                Call us
              </a>
            </div>
          </div>

          <dl className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <dt className="mb-3 flex items-center gap-2 font-semibold">
                <ClockIcon className="size-4 text-primary brightness-150" aria-hidden />
                Opening hours
              </dt>
              {hours.map((slot) => (
                <dd key={slot.days} className="text-sm text-white/70">
                  <span className="text-white">{slot.days}</span> · {slot.time}
                </dd>
              ))}
            </div>
            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <dt className="mb-3 flex items-center gap-2 font-semibold">
                <MapPinIcon className="size-4 text-primary brightness-150" aria-hidden />
                Find us
              </dt>
              <dd className="text-sm text-white/70">{contact.address}</dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
