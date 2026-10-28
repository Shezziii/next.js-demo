import { CircleCheckIcon, type LucideIcon } from "lucide-react";

import { MediaImage } from "@/components/shared/media-image";

type AuthShellProps = {
  image: string;
  imageAlt: string;
  imageIcon?: LucideIcon;
  /** Headline over the image (desktop only). */
  tagline: string;
  points: string[];
  children: React.ReactNode;
};

export function AuthShell({ image, imageAlt, imageIcon, tagline, points, children }: AuthShellProps) {
  return (
    <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-zinc-950 lg:block">
        <MediaImage src={image} alt={imageAlt} icon={imageIcon} priority sizes="50vw" className="absolute inset-0 bg-zinc-900" />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 space-y-5 p-10 text-white">
          <p className="max-w-md font-heading text-3xl font-extrabold uppercase">{tagline}</p>
          <ul className="space-y-2">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-2 text-white/85">
                <CircleCheckIcon className="size-5 shrink-0 text-emerald-400" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-center bg-muted/40 px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
