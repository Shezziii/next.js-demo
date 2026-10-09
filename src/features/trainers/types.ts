import type { ID } from "@/types/common";

export type Trainer = {
  id: ID;
  slug: string;
  name: string;
  role: string;
  specialties: string[];
  experienceYears: number;
  bio: string;
  /** Path under /public. Shows a placeholder until the file exists. */
  image: string;
};
