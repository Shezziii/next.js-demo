import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

import { ImageIcon, type LucideIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type MediaImageProps = {
  /** Path under /public, e.g. "/images/classes/hiit-burn.jpg". */
  src: string;
  alt: string;
  /** Size the wrapper (aspect ratio, height, rounding). The image fills it. */
  className?: string;
  /** Passed to next/image so the right size is downloaded. */
  sizes?: string;
  priority?: boolean;
  /** Icon shown in the placeholder. */
  icon?: LucideIcon;
};

function publicFileExists(src: string) {
  return existsSync(path.join(process.cwd(), "public", src));
}

/**
 * Optimised image with a built-in placeholder. Until the file exists in /public it renders a
 * branded placeholder (in development it also shows the expected path), so you can drop images
 * in later without touching code. Server Component: pass it as children/props into client components.
 */
export function MediaImage({ src, alt, className, sizes = "100vw", priority, icon: Icon = ImageIcon }: MediaImageProps) {
  const exists = publicFileExists(src);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {exists ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-linear-to-br from-primary/15 via-muted to-primary/5 text-primary/60"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-size-[16px_16px] opacity-15"
          />
          <Icon className="relative size-10" aria-hidden strokeWidth={1.5} />
          {process.env.NODE_ENV !== "production" && (
            <code className="relative max-w-[90%] truncate rounded bg-background/70 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              public{src}
            </code>
          )}
        </div>
      )}
    </div>
  );
}
