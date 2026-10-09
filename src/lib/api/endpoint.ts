/** Backend endpoint paths, relative to API_BASE_URL. */
export const endpoints = {
  classes: {
    list: "/classes",
    bySlug: (slug: string) => `/classes/${encodeURIComponent(slug)}`,
  },
  sessions: {
    list: "/sessions",
  },
  trainers: {
    list: "/trainers",
    bySlug: (slug: string) => `/trainers/${encodeURIComponent(slug)}`,
  },
  bookings: {
    list: "/me/bookings",
    create: "/me/bookings",
    cancel: (id: string) => `/me/bookings/${encodeURIComponent(id)}`,
  },
  plans: {
    list: "/membership-plans",
  },
  enquiries: {
    create: "/enquiries",
  },
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    me: "/auth/me",
  },
} as const;