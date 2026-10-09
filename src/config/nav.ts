import { CalendarCheckIcon, CalendarDaysIcon, LayoutDashboardIcon, UsersIcon, type LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

/** Links shown in the header once a member is signed in. */
export const memberNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Classes", href: "/classes", icon: CalendarDaysIcon },
  { title: "My bookings", href: "/bookings", icon: CalendarCheckIcon },
  { title: "Trainers", href: "/trainers", icon: UsersIcon },
];

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
