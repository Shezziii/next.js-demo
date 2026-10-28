import { ArrowRightIcon, Building2Icon, ShowerHeadIcon, SquareParkingIcon, WifiIcon } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { MediaImage } from "@/components/shared/media-image";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const amenities = [
  { icon: ShowerHeadIcon, label: "Showers & lockers" },
  { icon: SquareParkingIcon, label: "Free parking" },
  { icon: WifiIcon, label: "Free Wi-Fi" },
  { icon: Building2Icon, label: "15,000 sq ft floor" },
];


export function About() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <MediaImage
            src={siteConfig.images.about}
            alt={`Training floor at ${siteConfig.name}, ${siteConfig.branch}`}
            icon={Building2Icon}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-4/3 rounded-2xl ring-1 ring-foreground/10"
          />
          <div className="absolute -right-3 -bottom-5 rounded-xl bg-primary px-5 py-4 text-primary-foreground shadow-xl sm:-right-6">
            <p className="font-heading text-3xl font-extrabold">10+</p>
            <p className="text-sm opacity-85">years in {siteConfig.branch.split(",")[0]}</p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">About the gym</p>
          <h2 className="text-3xl font-bold text-balance sm:text-4xl">A neighbourhood gym with world-class kit</h2>
          <p className="text-muted-foreground">
            Gold&apos;s Gym {siteConfig.branch.split(",")[0]} brings the legendary Gold&apos;s training culture to your
            doorstep: serious strength equipment, a busy class studio and coaches who actually know your name.
          </p>
          <ul className="grid grid-cols-2 gap-3">
            {amenities.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 rounded-lg bg-muted/60 p-3 text-sm font-medium">
                <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
          <Link href="/contact?topic=trial" className={buttonVariants({ size: "lg" })}>
            Book a free visit
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
