import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { env } from "@/config/env";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoint";
import { cacheTags } from "@/lib/cache-tags";
import { mockApi } from "@/mocks/server";

import type { Trainer } from "../types";

export async function getTrainers(): Promise<Trainer[]> {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.trainers);

  if (env.USE_MOCK_API) return mockApi.listTrainers();
  return apiClient.get<Trainer[]>(endpoints.trainers.list);
}

export async function getTrainerById(id: string): Promise<Trainer | null> {
  const trainers = await getTrainers();
  return trainers.find((t) => t.id === id) ?? null;
}
