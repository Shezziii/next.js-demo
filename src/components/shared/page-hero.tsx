import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Container } from "./container";
import { MediaImage } from "./media-image";

type PageHeroProps = {
  title: React.ReactNode;
  eyebrow?: string;
  description?: React.ReactNode;
  /** Background image under /public (placeholder until added). */
  image: string;
  imageAlt: string;
  imageIcon?: LucideIcon;
  /** CTAs / badges under the description. */
  children?: React.ReactNode;
  className?: string;
};

/** Dark image-backed banner for public inner pages (Classes, Trainers, Pricing, Contact). */
export function PageHero({ title, eyebrow, description, image, imageAlt, imageIcon, children, className }: PageHeroProps) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-zinc-950 text-white", className)}>
      <MediaImage
        src={image}
        alt={imageAlt}
        icon={imageIcon}
        priority
        className="absolute inset-0 -z-20 bg-zinc-900 [&_[role=img]]:items-end [&_[role=img]]:pr-8 [&_[role=img]]:pb-6"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
      <Container className="py-16 sm:py-24">
        <div className="max-w-2xl space-y-4">
          {eyebrow && (
            <p className="text-sm font-semibold tracking-widest text-primary uppercase brightness-150">{eyebrow}</p>
          )}
          <h1 className="text-4xl font-extrabold tracking-tight text-balance uppercase sm:text-5xl">{title}</h1>
          {description && <p className="text-lg text-pretty text-white/75">{description}</p>}
          {children && <div className="flex flex-wrap gap-3 pt-2">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
