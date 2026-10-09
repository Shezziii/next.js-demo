import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { env } from "@/config/env";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoint";
import { cacheTags } from "@/lib/cache-tags";
import { mockApi } from "@/mocks/server";

import type { MembershipPlan } from "../types";

export async function getPlans(): Promise<MembershipPlan[]> {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.plans);

  if (env.USE_MOCK_API) return mockApi.listPlans();
  return apiClient.get<MembershipPlan[]>(endpoints.plans.list);
}
