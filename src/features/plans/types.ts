import type { ID, Money } from "@/types/common";

export type MembershipPlan = {
  id: ID;
  name: string;
  tagline: string;
  /** Price per billing period. */
  price: Money;
  period: "month" | "quarter" | "year";
  features: string[];
  highlighted?: boolean;
};
