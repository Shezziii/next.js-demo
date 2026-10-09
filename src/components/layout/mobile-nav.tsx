"use client";

import { LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { isActivePath, memberNav } from "@/config/nav";
import { logout } from "@/features/auth/actions";
import type { User } from "@/features/auth/types";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function MobileNav({ user, className }: { user: User; className?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" className={className} />}>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader className="flex-row items-center gap-3 border-b">
          <Avatar>
            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <SheetTitle className="truncate">{user.name}</SheetTitle>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex flex-col gap-1 px-2">
          {memberNav.map(({ href, title, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted",
                  active && "bg-primary/10 text-primary hover:bg-primary/10",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {title}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4">
          <Separator className="mb-4" />
          <form action={logout}>
            <Button type="submit" variant="outline" className="w-full">
              <LogOutIcon data-icon="inline-start" />
              Log out
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
