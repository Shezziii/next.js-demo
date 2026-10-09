/** Shared types used across features. */

export type ID = string;

/** ISO-8601 date-time string, e.g. "2026-10-08T18:30:00Z". */
export type ISODateString = string;

export type Money = {
  /** Amount in minor units (paise for INR) to avoid floating-point errors. */
  amount: number;
  currency: string;
};

export type ImageAsset = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

/** The response shape we expect from the backend. Adjust when the API is final. */
export type ApiSuccess<T> = { success: true; data: T };

export type ApiFailure = {
  success: false;
  error: { code: string; message: string; details?: Record<string, string[]> };
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;