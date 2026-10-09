import "server-only";

import { env } from "@/config/env";
import type { ApiEnvelope } from "@/types/common";

import { ApiError } from "./errors";

type QueryValue = string | number | boolean | undefined | null;

export type RequestOptions = Omit<RequestInit, "body"> & {
  /** JSON-serialisable request body. */
  body?: unknown;
  /** Query string params; undefined/null values are dropped. */
  query?: Record<string, QueryValue>;
  /** Bearer token for authenticated endpoints. */
  token?: string;
  /** Override the default timeout from API_TIMEOUT_MS. */
  timeoutMs?: number;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const base = env.API_BASE_URL.replace(/\/$/, "");
  const url = new URL(`${base}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
  return url;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, query, token, timeoutMs, headers, ...init } = options;

  // 1. Send the request. Network failures and timeouts become ApiErrors.
  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: init.signal ?? AbortSignal.timeout(timeoutMs ?? env.API_TIMEOUT_MS),
  }).catch((cause: unknown) => {
    const timedOut = cause instanceof DOMException && cause.name === "TimeoutError";
    throw new ApiError(timedOut ? "The server took too long to respond." : "Network error.", {
      status: timedOut ? 408 : 503,
      code: timedOut ? "TIMEOUT" : "NETWORK_ERROR",
    });
  });

  // 2. "204 No Content" has no body to parse.
  if (response.status === 204) return undefined as T;

  // 3. Parse JSON (null if the body isn't valid JSON, e.g. an HTML error page).
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  // 4. HTTP errors and { success: false } both become ApiErrors.
  if (!response.ok || !payload || payload.success === false) {
    const error = payload && payload.success === false ? payload.error : undefined;
    throw new ApiError(error?.message ?? (response.statusText || "Request failed"), {
      status: response.status,
      code: error?.code,
      details: error?.details,
    });
  }

  // 5. Success: return only the data, not the envelope.
  return payload.data;
}

/** Typed wrapper around fetch for the backend. Server-only: tokens and the API URL never reach the browser. */
export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};