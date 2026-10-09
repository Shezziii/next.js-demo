import { publicEnv } from "@/config/public-env";

export const siteConfig = {
  name: "Gold's Gym",
  shortName: "Gold's Gym",
  branch: "Koramangala, Bengaluru",
  description:
    "Strength training, group classes and personal coaching at Gold's Gym. Flexible memberships for every fitness level.",
  url: publicEnv.NEXT_PUBLIC_SITE_URL,

  locale: "en-IN",
  ogLocale: "en_IN",
  currency: "INR",
  timeZone: "Asia/Kolkata",

  contact: {
    email: "info@goldsgym-branch.example",
    phone: "+91 98765 43210",
    address: "123, 80 Feet Road, Koramangala 4th Block, Bengaluru, Karnataka 560034",
  },
  /** Replace with the branch's real profiles. */
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    whatsapp: "https://wa.me/919876543210",
  },
  /** Site-wide images under /public. Each shows a placeholder until the file is added. */
  images: {
    hero: "/images/hero/hero.jpg",
    classes: "/images/hero/classes.jpg",
    trainers: "/images/hero/classes.jpg",
    pricing: "/images/hero/classes.jpg",
    about: "/images/hero/gym-floor.jpg",
    contact: "/images/hero/classes.jpg",
    join: "/images/hero/login.jpg",
    login: "/images/hero/login.jpg",
  },
  hours: [
    { days: "Mon – Sat", time: "5:00 AM – 10:00 PM" },
    { days: "Sunday", time: "6:00 AM – 12:00 PM" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;