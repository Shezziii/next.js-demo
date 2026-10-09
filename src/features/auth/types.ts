import type { ID, ISODateString } from "@/types/common";

export type MembershipStatus = "active" | "expiring" | "expired";

export type Membership = {
  planName: string;
  status: MembershipStatus;
  memberSince: ISODateString;
  renewsOn: ISODateString;
};

/** The narrow user shape exposed to the UI. Never includes credentials. */
export type User = {
  id: ID;
  name: string;
  email: string;
  membership: Membership;
};
