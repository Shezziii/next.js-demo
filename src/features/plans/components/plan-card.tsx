import { CheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { MembershipPlan } from "../types";

const periodLabel: Record<MembershipPlan["period"], string> = { month: "month", quarter: "quarter", year: "year" };

export function PlanCard({ plan, action }: { plan: MembershipPlan; action?: React.ReactNode }) {
  return (
    <Card className={cn("relative h-full", plan.highlighted && "ring-2 ring-primary lg:scale-[1.03]")}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="font-heading text-xl font-bold">{plan.name}</CardTitle>
          {plan.highlighted && <Badge>Most popular</Badge>}
        </div>
        <CardDescription>{plan.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p>
          <span className="font-heading text-4xl font-extrabold">{formatMoney(plan.price)}</span>
          <span className="text-muted-foreground"> / {periodLabel[plan.period]}</span>
        </p>
        <ul className="space-y-2.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      {action && <CardFooter className="mt-auto border-t bg-transparent">{action}</CardFooter>}
    </Card>
  );
}
