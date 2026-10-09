import { Suspense } from "react";

import { Container } from "@/components/shared/container";
import { getCurrentUser } from "@/lib/auth/dal";

import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";

/**
 * Shared header for every page. The logo is static (part of the prerendered shell);
 * the member area reads the session, so it streams in behind <Suspense>.
 * Guests see only the logo; signed-in members also get navigation and their account menu.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <Container className="flex h-16 items-center gap-8">
        <Logo />
        <Suspense fallback={null}>
          <MemberArea />
        </Suspense>
      </Container>
    </header>
  );
}

async function MemberArea() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <>
      <MainNav className="hidden md:flex" />
      <div className="ml-auto flex items-center gap-2">
        <UserMenu user={user} className="hidden md:flex" />
        <MobileNav user={user} className="md:hidden" />
      </div>
    </>
  );
}
