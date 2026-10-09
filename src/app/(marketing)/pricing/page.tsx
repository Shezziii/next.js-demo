import { CheckIcon, MinusIcon, WalletIcon } from "lucide-react";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-Id";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { PlanCard } from "@/features/plans/components/plan-card";
import { getPlans } from "@/features/plans/server/queries";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Membership pricing",
  description: "Simple monthly memberships at Gold's Gym. No joining fee — compare Basic, Pro and Elite plans.",
  path: "/pricing",
});

/** Plan comparison. Columns follow plan order from the API: Basic, Pro, Elite. */
const comparison: { feature: string; values: (boolean | string)[] }[] = [
  { feature: "Gym floor access", values: [true, true, true] },
  { feature: "Locker & showers", values: [true, true, true] },
  { feature: "Group classes", values: [false, "Unlimited", "Unlimited"] },
  { feature: "Advance class booking", values: [false, "7 days", "7 days"] },
  { feature: "Fitness assessment", values: ["On joining", "Monthly", "Monthly"] },
  { feature: "Personal training sessions", values: [false, false, "8 / month"] },
  { feature: "Custom nutrition plan", values: [false, false, true] },
  { feature: "Guest passes", values: [false, false, "2 / month"] },
];

const faqs = [
  {
    q: "Is there a joining fee?",
    a: "No. You only pay the monthly plan price. GST is included in the prices shown.",
  },
  {
    q: "Can I try the gym before joining?",
    a: "Yes — book a free trial session and fitness assessment with one of our coaches from the contact page.",
  },
  {
    q: "Can I freeze or change my plan?",
    a: "You can upgrade any time, and freeze your membership for up to 30 days a year for travel or medical reasons.",
  },
  {
    q: "How do I book group classes?",
    a: "Pro and Elite members book from their member dashboard, up to 7 days ahead. Cancel any time before the class starts.",
  },
  {
    q: "What payment methods do you accept?",
    a: "UPI, debit and credit cards, and net banking. Monthly auto-pay is available at reception.",
  },
];

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }}
      />

      <PageHero
        eyebrow="Membership"
        title="Simple, honest pricing"
        description="No joining fee, no long contracts. Pick the plan that fits your goals and upgrade any time."
        image={siteConfig.images.pricing}
        imageAlt="Gold's Gym training floor"
        imageIcon={WalletIcon}
      />

      <Section>
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              action={
                <Link
                  href={`/register?plan=${plan.id}`}
                  className={cn(buttonVariants({ variant: plan.highlighted ? "default" : "outline" }), "w-full")}
                >
                  Choose {plan.name}
                </Link>
              }
            />
          ))}
        </div>
      </Section>

      <Section title="Compare plans" align="center" className="border-t bg-muted/30">
        <div className="mx-auto max-w-4xl overflow-x-auto rounded-xl bg-card ring-1 ring-foreground/10">
          <table className="w-full min-w-[540px] text-sm">
            <thead>
              <tr className="border-b">
                <th scope="col" className="p-4 text-left font-semibold">
                  Feature
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} scope="col" className={cn("p-4 text-center font-heading font-bold", plan.highlighted && "text-primary")}>
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b last:border-0">
                  <th scope="row" className="p-4 text-left font-normal">
                    {row.feature}
                  </th>
                  {row.values.map((value, i) => (
                    <td key={i} className="p-4 text-center">
                      {value === true ? (
                        <CheckIcon className="mx-auto size-5 text-primary" aria-label="Included" />
                      ) : value === false ? (
                        <MinusIcon className="mx-auto size-5 text-muted-foreground/50" aria-label="Not included" />
                      ) : (
                        <span className="font-medium">{value}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Frequently asked questions" align="center">
        <Accordion className="mx-auto max-w-3xl">
          {faqs.map(({ q, a }) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-base">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-10 text-center text-muted-foreground">
          Still have questions?{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Talk to our team
          </Link>
        </p>
      </Section>
    </>
  );
}
