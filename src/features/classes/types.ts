import type { ID, ISODateString } from "@/types/common";

export type ClassCategory = "strength" | "cardio" | "hiit" | "mind-body" | "dance";
export type ClassLevel = "beginner" | "intermediate" | "advanced" | "all-levels";

/** A class in the catalogue, e.g. "HIIT Burn". */
export type GymClass = {
  id: ID;
  slug: string;
  name: string;
  category: ClassCategory;
  level: ClassLevel;
  durationMinutes: number;
  description: string;
  trainerId: ID;
  /** Path under /public. Shows a placeholder until the file exists. */
  image: string;
  /** What members get out of the class. */
  highlights: string[];
  whatToBring: string[];
};

/** One scheduled occurrence of a class that members can book. */
export type ClassSession = {
  id: ID;
  classId: ID;
  classSlug: string;
  className: string;
  category: ClassCategory;
  level: ClassLevel;
  trainerName: string;
  room: string;
  startsAt: ISODateString;
  durationMinutes: number;
  capacity: number;
  spotsLeft: number;
};
