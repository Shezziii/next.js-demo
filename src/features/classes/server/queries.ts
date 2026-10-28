import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { env } from "@/config/env";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoint";
import { cacheTags } from "@/lib/cache-tags";
import { mockApi } from "@/mocks/server";

import type { ClassSession, GymClass } from "../types";

/** Class catalogue. Shared by every visitor, so it's cached on the server and prerendered. */
export async function getClasses(): Promise<GymClass[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.classes);

  if (env.USE_MOCK_API) return mockApi.listClasses();
  return apiClient.get<GymClass[]>(endpoints.classes.list);
}

/** Upcoming sessions for the next `days` days. Short cache; booking actions invalidate it via updateTag. */
export async function getSchedule(days = 7): Promise<ClassSession[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(cacheTags.schedule);

  const from = new Date();
  if (env.USE_MOCK_API) return mockApi.listSessions({ from, days });
  return apiClient.get<ClassSession[]>(endpoints.sessions.list, { query: { from: from.toISOString(), days } });
}

/** One bookable session. Reuses the cached schedule, so only sessions in the booking window are found. */
export async function getSessionById(sessionId: string): Promise<ClassSession | null> {
  const sessions = await getSchedule();
  return sessions.find((s) => s.id === sessionId) ?? null;
}

/** Single class for the detail page. Reuses the cached catalogue, so no extra request. */
export async function getClassBySlug(slug: string): Promise<GymClass | null> {
  const classes = await getClasses();
  return classes.find((c) => c.slug === slug) ?? null;
}
