import { formatMoney } from "@/lib/format";

import type { MembershipPlan } from "./types";

/** Plans as select options, e.g. "Pro — ₹3,499/month". */
export function toPlanOptions(plans: MembershipPlan[]) {
  return plans.map((plan) => ({ value: plan.id, label: `${plan.name} — ${formatMoney(plan.price)}/${plan.period}` }));
}
