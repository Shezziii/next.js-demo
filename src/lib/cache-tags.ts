/** Cache tags in one place so `cacheTag()` and `updateTag()` can never drift apart. */
export const cacheTags = {
  classes: "classes",
  schedule: "schedule",
  trainers: "trainers",
  plans: "plans",
} as const;
