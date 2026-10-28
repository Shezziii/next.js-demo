import "server-only";

import { env } from "@/config/env";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoint";
import { isApiError } from "@/lib/api/errors";
import { requireUser } from "@/lib/auth/dal";
import { mockApi } from "@/mocks/server";

import type { Order } from "../types";

/** One of the signed-in member's orders, or null if it doesn't exist or belongs to someone else. */
export async function getMyOrder(orderId: string): Promise<Order | null> {
  const user = await requireUser();
  try {
    if (env.USE_MOCK_API) return await mockApi.getOrder(user.id, orderId);
    return await apiClient.get<Order>(endpoints.orders.byId(orderId));
  } catch (error) {
    if (isApiError(error) && error.isNotFound) return null;
    throw error;
  }
}
