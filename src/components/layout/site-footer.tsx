import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa6";

import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";

import { Logo } from "./logo";

const exploreLinks = [
  { href: "/classes", label: "Classes & schedule" },
  { href: "/trainers", label: "Trainers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact us" },
  { href: "/register", label: "Join now" },
  { href: "/login", label: "Member login" },
];

/** Static footer: fully prerendered, identical for guests and members. */
export function SiteFooter() {
  const { contact, hours, social } = siteConfig;
  const socials = [
    { href: social.instagram, label: "Instagram", icon: FaInstagram },
    { href: social.facebook, label: "Facebook", icon: FaFacebookF },
    { href: social.youtube, label: "YouTube", icon: FaYoutube },
    { href: social.whatsapp, label: "WhatsApp", icon: FaWhatsapp },
  ];

  return (
    <footer className="border-t bg-muted/40">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-4 sm:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">{siteConfig.description}</p>
          <p className="text-sm font-medium">{siteConfig.branch}</p>
          <ul className="flex gap-2">
            {socials.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-foreground/10 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-4 text-sm font-semibold tracking-wide uppercase">Explore</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wide uppercase">Opening hours</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {hours.map((slot) => (
              <li key={slot.days} className="flex items-start gap-2">
                <ClockIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  <span className="font-medium text-foreground">{slot.days}</span>
                  <br />
                  {slot.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wide uppercase">Contact</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
              <address className="not-italic">{contact.address}</address>
            </li>
            <li>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-foreground">
                <PhoneIcon className="size-4 shrink-0" aria-hidden />
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-foreground">
                <MailIcon className="size-4 shrink-0" aria-hidden />
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t">
        <Container className="py-5 text-center text-xs text-muted-foreground">
          © <CurrentYear /> {siteConfig.name}. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}

/** `new Date()` must be inside a cache scope to be part of the prerendered shell. */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
