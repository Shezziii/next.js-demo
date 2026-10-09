import type { GymClass } from "@/features/classes/types";
import type { MembershipPlan } from "@/features/plans/types";
import type { Trainer } from "@/features/trainers/types";

/** Static fixtures. Mirrors what the backend will return so the UI is built against real shapes. */

export const trainers: Trainer[] = [
  {
    id: "trn_1",
    slug: "arjun-mehta",
    name: "Arjun Mehta",
    role: "Head Strength Coach",
    specialties: ["Powerlifting", "Strength & conditioning", "Mobility"],
    experienceYears: 9,
    bio: "Former state-level powerlifter who builds programmes around clean technique and steady progress.",
    image: "/images/trainers/arjun-mehta.jpg",
  },
  {
    id: "trn_2",
    slug: "priya-nair",
    name: "Priya Nair",
    role: "HIIT & Functional Coach",
    specialties: ["HIIT", "Boxing", "Fat loss"],
    experienceYears: 6,
    bio: "High-energy sessions that mix intervals, bodyweight work and boxing combinations.",
    image: "/images/trainers/priya-nair.jpg",
  },
  {
    id: "trn_3",
    slug: "kavya-rao",
    name: "Kavya Rao",
    role: "Yoga & Pilates Instructor",
    specialties: ["Vinyasa", "Pilates", "Breathwork"],
    experienceYears: 8,
    bio: "Focuses on core strength, flexibility and recovery so you can train harder the rest of the week.",
    image: "/images/trainers/kavya-rao.jpg",
  },
  {
    id: "trn_4",
    slug: "rohan-das",
    name: "Rohan Das",
    role: "Endurance Coach",
    specialties: ["Indoor cycling", "Endurance", "Rowing"],
    experienceYears: 5,
    bio: "Marathoner and cycling coach who makes cardio something you look forward to.",
    image: "/images/trainers/arjun-mehta.jpg",
  },
  {
    id: "trn_5",
    slug: "sneha-kulkarni",
    name: "Sneha Kulkarni",
    role: "Dance Fitness Instructor",
    specialties: ["Zumba", "Aerobics", "Cardio dance"],
    experienceYears: 4,
    bio: "Turns a full-body workout into a party. No dance experience needed.",
    image: "/images/trainers/kavya-rao.jpg",
  },
];

export const classes: GymClass[] = [
  {
    id: "cls_1",
    slug: "strength-foundations",
    name: "Strength Foundations",
    category: "strength",
    level: "beginner",
    durationMinutes: 60,
    description: "Learn the big lifts — squat, deadlift, press — with coaching on form and safe progression.",
    trainerId: "trn_1",
    image: "/images/classes/strength-foundations.jpg",
    highlights: [
      "Master squat, deadlift and overhead press technique",
      "Build full-body strength safely",
      "Small groups for hands-on coaching",
    ],
    whatToBring: ["Flat-soled shoes", "Water bottle", "Small towel"],
  },
  {
    id: "cls_2",
    slug: "hiit-burn",
    name: "HIIT Burn",
    category: "hiit",
    level: "intermediate",
    durationMinutes: 45,
    description: "Short, intense intervals that push your heart rate up and keep burning calories after class.",
    trainerId: "trn_2",
    image: "/images/classes/hiit-burn.jpg",
    highlights: [
      "Burn calories long after class",
      "Improve stamina and heart health",
      "Scaled options for every level",
    ],
    whatToBring: ["Cross-training shoes", "Water bottle", "Towel"],
  },
  {
    id: "cls_3",
    slug: "power-yoga",
    name: "Power Yoga",
    category: "mind-body",
    level: "all-levels",
    durationMinutes: 60,
    description: "A strong, flowing vinyasa practice that builds strength, balance and focus.",
    trainerId: "trn_3",
    image: "/images/classes/power-yoga.jpg",
    highlights: [
      "Build strength, balance and flexibility",
      "Reduce stress with focused breathing",
      "Mats and blocks provided",
    ],
    whatToBring: ["Comfortable stretch clothing", "Water bottle"],
  },
  {
    id: "cls_4",
    slug: "spin-ride",
    name: "Spin Ride",
    category: "cardio",
    level: "intermediate",
    durationMinutes: 45,
    description: "Climbs, sprints and intervals on the bike, set to a playlist that keeps you pedalling.",
    trainerId: "trn_4",
    image: "/images/classes/spin-ride.jpg",
    highlights: ["Low-impact, high-energy cardio", "Ride at your own resistance", "Music-driven intervals"],
    whatToBring: ["Padded shorts (optional)", "Water bottle", "Towel"],
  },
  {
    id: "cls_5",
    slug: "zumba-party",
    name: "Zumba Party",
    category: "dance",
    level: "all-levels",
    durationMinutes: 60,
    description: "Latin and Bollywood rhythms in a feel-good cardio workout.",
    trainerId: "trn_5",
    image: "/images/classes/zumba-party.jpg",
    highlights: ["Full-body cardio that feels like a party", "No dance experience needed", "Great for coordination"],
    whatToBring: ["Light trainers", "Water bottle"],
  },
  {
    id: "cls_6",
    slug: "crossfit-wod",
    name: "CrossFit WOD",
    category: "strength",
    level: "advanced",
    durationMinutes: 60,
    description: "The workout of the day: Olympic lifts, gymnastics and metabolic conditioning.",
    trainerId: "trn_1",
    image: "/images/classes/crossfit-wod.jpg",
    highlights: ["Varied, high-intensity functional training", "Track your PRs over time", "Strong community feel"],
    whatToBring: ["Cross-training shoes", "Wrist wraps (optional)", "Water bottle"],
  },
  {
    id: "cls_7",
    slug: "core-pilates",
    name: "Core Pilates",
    category: "mind-body",
    level: "beginner",
    durationMinutes: 50,
    description: "Controlled mat work for a stronger core, better posture and a healthier back.",
    trainerId: "trn_3",
    image: "/images/classes/core-pilates.jpg",
    highlights: ["Stronger core and better posture", "Gentle on joints", "Helps prevent back pain"],
    whatToBring: ["Grip socks", "Water bottle"],
  },
  {
    id: "cls_8",
    slug: "boxfit",
    name: "BoxFit",
    category: "hiit",
    level: "intermediate",
    durationMinutes: 45,
    description: "Pad work, footwork drills and conditioning rounds inspired by boxing training.",
    trainerId: "trn_2",
    image: "/images/classes/boxfit.jpg",
    highlights: ["Learn real boxing combinations", "Sharpen speed and footwork", "Gloves and pads provided"],
    whatToBring: ["Hand wraps (or buy at reception)", "Water bottle", "Towel"],
  },
];

export const plans: MembershipPlan[] = [
  {
    id: "pln_basic",
    name: "Basic",
    tagline: "Everything you need to train on your own.",
    price: { amount: 199_900, currency: "INR" },
    period: "month",
    features: ["Full gym floor access", "Locker & shower facilities", "Fitness assessment on joining"],
  },
  {
    id: "pln_pro",
    name: "Pro",
    tagline: "Our most popular plan for regular members.",
    price: { amount: 349_900, currency: "INR" },
    period: "month",
    features: [
      "Everything in Basic",
      "Unlimited group classes",
      "Book classes up to 7 days ahead",
      "Monthly progress check-in",
    ],
    highlighted: true,
  },
  {
    id: "pln_elite",
    name: "Elite",
    tagline: "Personal coaching for faster results.",
    price: { amount: 599_900, currency: "INR" },
    period: "month",
    features: ["Everything in Pro", "8 personal training sessions", "Custom nutrition plan", "Guest passes"],
  },
];

export const rooms = {
  "Studio A": 20,
  "Studio B": 16,
  "Strength Zone": 12,
  "Cycle Studio": 18,
  "Box Arena": 14,
} as const;

export type Room = keyof typeof rooms;

type Slot = { time: string; classSlug: string; room: Room };

const weekdayA: Slot[] = [
  { time: "06:00", classSlug: "hiit-burn", room: "Studio A" },
  { time: "07:00", classSlug: "power-yoga", room: "Studio B" },
  { time: "18:00", classSlug: "strength-foundations", room: "Strength Zone" },
  { time: "19:00", classSlug: "spin-ride", room: "Cycle Studio" },
  { time: "20:00", classSlug: "zumba-party", room: "Studio A" },
];

const weekdayB: Slot[] = [
  { time: "06:00", classSlug: "spin-ride", room: "Cycle Studio" },
  { time: "07:30", classSlug: "core-pilates", room: "Studio B" },
  { time: "18:00", classSlug: "crossfit-wod", room: "Strength Zone" },
  { time: "19:00", classSlug: "boxfit", room: "Box Arena" },
  { time: "20:00", classSlug: "power-yoga", room: "Studio B" },
];

/** Weekly timetable, indexed by day of week (0 = Sunday). */
export const weeklyTimetable: Slot[][] = [
  [
    { time: "07:00", classSlug: "power-yoga", room: "Studio B" },
    { time: "09:00", classSlug: "zumba-party", room: "Studio A" },
  ],
  weekdayA,
  weekdayB,
  weekdayA,
  weekdayB,
  weekdayA,
  [
    { time: "07:00", classSlug: "crossfit-wod", room: "Strength Zone" },
    { time: "08:30", classSlug: "spin-ride", room: "Cycle Studio" },
    { time: "10:00", classSlug: "core-pilates", room: "Studio B" },
    { time: "17:00", classSlug: "boxfit", room: "Box Arena" },
  ],
];
