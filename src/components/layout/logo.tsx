import { DumbbellIcon } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex shrink-0 items-center gap-2 font-heading", className)}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <DumbbellIcon className="size-5" aria-hidden />
      </span>
      <span className="text-lg leading-none font-extrabold tracking-tight uppercase">{siteConfig.name}</span>
    </Link>
  );
}
