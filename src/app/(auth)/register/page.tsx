import { UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { RegistrationForm } from "@/features/enquiries/components/registration-form";
import { getPlans } from "@/features/plans/server/queries";
import { toPlanOptions } from "@/features/plans/utils";
import { createMetadata } from "@/lib/seo";

import { AuthShell } from "../_components/auth-shell";

export const metadata = createMetadata({
  title: "Join Gold's Gym",
  description: "Become a Gold's Gym member. Pick a plan and our team will set up your membership and member login.",
  path: "/register",
});

export default async function RegisterPage() {
  const plans = toPlanOptions(await getPlans());

  return (
    <AuthShell
      image={siteConfig.images.join}
      imageAlt="New members at Gold's Gym"
      imageIcon={UserPlusIcon}
      tagline="Your strongest year starts today."
      points={["No joining fee", "Free fitness assessment", "40+ classes every week"]}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl font-bold">Become a member</CardTitle>
          <CardDescription>
            Tell us a bit about you. We&apos;ll call to confirm your plan and set up your member login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Reads ?plan= via useSearchParams, which needs a Suspense boundary. */}
          <Suspense fallback={<RegistrationSkeleton />}>
            <RegistrationForm plans={plans} />
          </Suspense>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Already a member?&nbsp;
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}

function RegistrationSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-14" />
      ))}
      <Skeleton className="h-24" />
      <Skeleton className="h-11" />
    </div>
  );
}
