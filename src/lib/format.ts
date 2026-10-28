import { siteConfig } from "@/config/site";
import type { Money } from "@/types/common";

const { locale, timeZone } = siteConfig;

export function formatMoney({ amount, currency }: Money) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}


export function formatTime(iso: string) {
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone }).format(
    new Date(iso),
  );
}

export function formatDate(iso: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone,
    ...options,
  }).format(new Date(iso));
}

/** Stable "YYYY-MM-DD" key in IST, used to group sessions by day. */
export function toDateKey(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date(iso));
}

/** 75 → "1 h 15 min" */
export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** "Rahul Sharma" → "RS" (avatar fallback) */
export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}