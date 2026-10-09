import { ClockIcon, MailIcon, MapIcon, MapPinIcon, MessageSquareTextIcon, PhoneIcon, type LucideIcon } from "lucide-react";
import { Suspense } from "react";
import { FaWhatsapp } from "react-icons/fa6";

import { MediaImage } from "@/components/shared/media-image";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/features/enquiries/components/contact-form";
import { getPlans } from "@/features/plans/server/queries";
import { toPlanOptions } from "@/features/plans/utils";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact us",
  description: `Questions about membership, personal training or a free trial? Contact ${siteConfig.name}, ${siteConfig.branch}.`,
  path: "/contact",
});

export default async function ContactPage() {
  const plans = toPlanOptions(await getPlans());
  const { contact, hours, social } = siteConfig;

  const channels: { icon: LucideIcon | typeof FaWhatsapp; title: string; body: React.ReactNode; href?: string }[] = [
    { icon: PhoneIcon, title: "Call us", body: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
    { icon: FaWhatsapp, title: "WhatsApp", body: "Chat with the front desk", href: social.whatsapp },
    { icon: MailIcon, title: "Email", body: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPinIcon, title: "Visit", body: contact.address },
  ];

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="We'd love to hear from you"
        description="Ask about memberships, book a free trial or plan personal training. We reply within one working day."
        image={siteConfig.images.contact}
        imageAlt="Gold's Gym reception"
        imageIcon={MessageSquareTextIcon}
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-heading text-2xl font-bold">Send us an enquiry</CardTitle>
              <CardDescription>Fields are required unless marked optional.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* The form pre-fills from ?topic= / ?plan= via useSearchParams, which needs Suspense. */}
              <Suspense fallback={<FormSkeleton />}>
                <ContactForm plans={plans} />
              </Suspense>
            </CardContent>
          </Card>

          <div className="space-y-4 lg:col-span-2">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {channels.map(({ icon: Icon, title, body, href }) => {
                const content = (
                  <>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold">{title}</span>
                      <span className="block text-sm text-muted-foreground">{body}</span>
                    </span>
                  </>
                );
                const className = "flex items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10";
                return (
                  <li key={title}>
                    {href ? (
                      <a
                        href={href}
                        className={`${className} transition-colors hover:ring-primary/40`}
                        {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                      >
                        {content}
                      </a>
                    ) : (
                      <div className={className}>{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <p className="mb-3 flex items-center gap-2 font-semibold">
                <ClockIcon className="size-4 text-primary" aria-hidden />
                Opening hours
              </p>
              <dl className="space-y-1.5 text-sm">
                {hours.map((slot) => (
                  <div key={slot.days} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{slot.days}</dt>
                    <dd className="font-medium">{slot.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Replace with a Google Maps embed or a static map image. */}
            <MediaImage
              src="/images/hero/map.png"
              alt={`Map showing ${siteConfig.name}, ${siteConfig.branch}`}
              icon={MapIcon}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-video rounded-xl ring-1 ring-foreground/10"
            />
          </div>
        </div>
      </Section>
    </>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true">
      <div className="grid gap-5 sm:grid-cols-2">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
      <Skeleton className="h-14" />
      <Skeleton className="h-28" />
      <Skeleton className="h-11 w-40" />
    </div>
  );
}
