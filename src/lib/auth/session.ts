import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { io } from "next/cache";
import { cookies } from "next/headers";

import { env, isProduction } from "@/config/env";

/**
 * Stateless, signed cookie session: `base64url(payload).base64url(hmac)`.
 * The payload is readable but can't be forged or altered without SESSION_SECRET.
 * Swap for iron-session / Auth.js / a backend token when a real auth service exists:
 * everything else talks to the session only through the functions in this file.
 */

export const SESSION_COOKIE = "gg_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type SessionPayload = {
  userId: string;
  /** Unix ms. */
  expiresAt: number;
};

function sign(value: string) {
  return createHmac("sha256", env.SESSION_SECRET).update(value).digest("base64url");
}

export function encodeSession(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

/** Returns the payload only if the signature is valid and it hasn't expired. Never throws. */
export function decodeSession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (typeof payload.userId !== "string" || typeof payload.expiresAt !== "number") return null;
    return payload.expiresAt > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

/** Call from a Server Action / Route Handler only (cookies can't be set while rendering). */
export async function createSession(userId: string) {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  (await cookies()).set(SESSION_COOKIE, encodeSession({ userId, expiresAt }), {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function readSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  // The expiry check reads the clock. io() tells Cache Components that this (and everything
  // rendered after it, e.g. "today's classes") is per-request and must stay out of prerendering.
  await io();
  return decodeSession(token);
}
