import { ActivityIcon, BikeIcon, DumbbellIcon, FlameIcon, FlowerIcon, type LucideIcon } from "lucide-react";

import type { ClassCategory, ClassLevel } from "./types";

export const categoryMeta: Record<ClassCategory, { label: string; icon: LucideIcon; className: string }> = {
  strength: { label: "Strength", icon: DumbbellIcon, className: "bg-primary/10 text-primary" },
  cardio: { label: "Cardio", icon: BikeIcon, className: "bg-sky-500/10 text-sky-700 dark:text-sky-300" },
  hiit: { label: "HIIT", icon: FlameIcon, className: "bg-orange-500/10 text-orange-700 dark:text-orange-300" },
  "mind-body": { label: "Mind & body", icon: FlowerIcon, className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  dance: { label: "Dance", icon: ActivityIcon, className: "bg-pink-500/10 text-pink-700 dark:text-pink-300" },
};

export const levelLabels: Record<ClassLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  "all-levels": "All levels",
};
