import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { authRoutes } from "@/config/routes";
import { findUserById } from "@/features/auth/server/users";
import type { User } from "@/features/auth/types";

import { readSession } from "./session";

/**
 * Data Access Layer: the ONLY place pages, components and actions get the current user.
 * proxy.ts does a fast optimistic redirect; these checks are the real authorization.
 *
 * Reads cookies, so with Cache Components any component calling these must sit
 * inside a <Suspense> boundary. React `cache` dedupes the lookup within one request.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await readSession();
  if (!session) return null;
  return findUserById(session.userId);
});

/** For protected pages and Server Actions: returns the user or redirects to login. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(authRoutes.login);
  return user;
}
