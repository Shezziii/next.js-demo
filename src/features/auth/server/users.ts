import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

import type { User } from "../types";



type UserRecord = User & { passwordHash: string };

const sha256 = (value: string) => createHash("sha256").update(value).digest();

const users: UserRecord[] = [
  {
    id: "usr_001",
    name: "Imna Tuba",
    email: "imnatuba@novasarc.com",
    passwordHash: sha256("Novas@123").toString("hex"),
    membership: {
      planName: "Pro",
      status: "active",
      memberSince: "2025-03-14T00:00:00+05:30",
      renewsOn: "2027-03-14T00:00:00+05:30",
    },
  },
];

/** Allowlist the fields that may leave this module, so new secret fields are never leaked by accident. */
function toPublicUser({ id, name, email, membership }: UserRecord): User {
  return { id, name, email, membership };
}

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  const record = users.find((user) => user.email === email.trim().toLowerCase());
  // Hash even when the email is unknown so response time doesn't reveal which emails exist.
  const candidate = sha256(password);
  const expected = record ? Buffer.from(record.passwordHash, "hex") : sha256("");
  const match = timingSafeEqual(candidate, expected);
  return record && match ? toPublicUser(record) : null;
}

export async function findUserById(id: string): Promise<User | null> {
  const record = users.find((user) => user.id === id);
  return record ? toPublicUser(record) : null;
}
