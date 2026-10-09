import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { LoginForm } from "@/features/auth/components/login-form";
import { createMetadata } from "@/lib/seo";

import { AuthShell } from "../_components/auth-shell";

export const metadata = createMetadata({
  title: "Member login",
  description: "Sign in to book classes and manage your Gold's Gym membership.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <AuthShell
      image={siteConfig.images.login}
      imageAlt="Member training at Gold's Gym"
      imageIcon={LogInIcon}
      tagline="Welcome back. Let's get moving."
      points={["Book classes up to 7 days ahead", "Track your upcoming sessions", "Cancel any time before class"]}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl font-bold">Member login</CardTitle>
          <CardDescription>Sign in to book classes and manage your membership.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* LoginForm reads ?from= via useSearchParams, which needs a Suspense boundary. */}
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Not a member yet?&nbsp;
          <Link href="/register" className="font-medium text-primary hover:underline">
            Join Gold&apos;s Gym
          </Link>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true">
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
      <Skeleton className="h-9" />
    </div>
  );
}
