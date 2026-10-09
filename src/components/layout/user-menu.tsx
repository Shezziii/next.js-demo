import { LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions";
import type { User } from "@/features/auth/types";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function UserMenu({ user, className }: { user: User; className?: string }) {
  return (
    <div className={cn("items-center gap-3", className)}>
      <Avatar>
        <AvatarFallback className="bg-primary/10 font-semibold text-primary">{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="hidden text-sm leading-tight lg:block">
        <p className="font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.membership.planName} member</p>
      </div>
      <form action={logout}>
        <Button type="submit" variant="ghost" size="icon" aria-label="Log out" title="Log out">
          <LogOutIcon />
        </Button>
      </form>
    </div>
  );
}
