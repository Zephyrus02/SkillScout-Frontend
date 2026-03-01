import LegalLayout, {
  BulletList,
  Callout,
  ContactBlock,
  InfoGrid,
  Section,
  TocItem,
} from "@/components/legal/LegalLayout";

const TOC: TocItem[] = [
  { id: "overview", label: "1. Overview" },
  { id: "no-refund", label: "2. No Refund Policy" },
  { id: "subscriptions", label: "3. Subscriptions & Billing" },
  { id: "free-trial", label: "4. Free Trial" },
  { id: "exceptions", label: "5. Exceptions" },
  { id: "cancellation", label: "6. Cancellations" },
  { id: "contact", label: "7. Contact Us" },
];

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      pageTitle="Refund Policy"
      title="Refund Policy"
      description="All purchases on SkillScout are final and non-refundable. Please read this policy carefully before completing a purchase."
      effectiveDate="March 1, 2025"
      lastUpdated="March 1, 2026"
      tocItems={TOC}
    >
      <Section id="overview" number={1} title="Overview">
        <p>
          This Refund Policy applies to all paid subscription plans and
          purchases made directly through SkillScout. Please read this policy
          carefully before completing a purchase.
        </p>
        <p>
          All purchases on SkillScout are final. By completing a purchase, you
          acknowledge and agree that you have read this policy and accept that
          no refunds will be issued.
        </p>
        <Callout type="warning" title="All Sales Are Final">
          SkillScout does not offer refunds, credits, or exchanges for any
          subscription plans, add-ons, or one-time purchases, except in the
          limited circumstances described in Section 5 of this policy.
        </Callout>
      </Section>

      <Section id="no-refund" number={2} title="No Refund Policy">
        <p>All fees paid to SkillScout are non-refundable. This applies to:</p>
        <BulletList
          items={[
            "Monthly and annual subscription fees, regardless of usage.",
            "Subscription fees for any partial billing period.",
            "One-time add-on purchases such as additional report exports or résumé reviews.",
            "Interview credits or session tokens, whether used or unused.",
            "Completion certificates once issued.",
            "Enterprise and team plan licence fees.",
          ]}
        />
        <Callout type="info" title="Why No Refunds?">
          SkillScout provides immediate access to AI-powered interview sessions,
          performance analytics, and coaching reports upon payment. Because our
          digital services are delivered instantly and cannot be
          &quot;returned&quot;, we maintain a strict no-refund policy.
        </Callout>
      </Section>

      <Section id="subscriptions" number={3} title="Subscriptions & Billing">
        <p>
          When you purchase a subscription, you are granted immediate access to
          all features of your chosen plan. The following billing terms apply:
        </p>
        <InfoGrid
          items={[
            {
              icon: "autorenew",
              title: "Auto-Renewal",
              description:
                "Subscriptions renew automatically at the end of each billing cycle. You will be charged the applicable fee on your renewal date.",
            },
            {
              icon: "cancel",
              title: "Cancellation",
              description:
                "You may cancel your subscription at any time. Cancellation prevents future charges but does not entitle you to a refund for the current period.",
            },
            {
              icon: "price_change",
              title: "Price Changes",
              description:
                "We reserve the right to change subscription prices with 30 days' notice. Continued use after the notice period constitutes acceptance.",
            },
            {
              icon: "credit_card_off",
              title: "Failed Payments",
              description:
                "If a payment fails, access may be suspended until the outstanding balance is settled.",
            },
          ]}
        />
      </Section>

      <Section id="free-trial" number={4} title="Free Trial">
        <p>
          SkillScout offers a free tier with access to a limited set of features
          — no credit card required. We strongly encourage you to use the free
          tier to evaluate the platform before upgrading to a paid plan.
        </p>
        <BulletList
          items={[
            "The free tier gives you access to sample AI mock interview sessions and basic analytics.",
            "Upgrading to a paid plan is a deliberate action that confirms your acceptance of this no-refund policy.",
            "If a promotional free trial of a paid plan is offered, you will not be charged if you cancel before the trial period ends.",
          ]}
        />
        <Callout type="success" title="Try Before You Buy">
          We encourage all users to fully explore the free tier before
          purchasing. This ensures you are confident in the value SkillScout
          provides before committing to a paid plan.
        </Callout>
      </Section>

      <Section id="exceptions" number={5} title="Exceptions">
        <p>
          Refunds will only be considered in the following strictly limited
          circumstances, at SkillScout&apos;s sole discretion:
        </p>
        <BulletList
          items={[
            "Duplicate charge: You were billed more than once for the same subscription period due to a verified billing system error.",
            "Unauthorised charge: A charge was made without your consent, reported to us within 7 days of the transaction date.",
            "Verified extended outage: A documented platform outage rendered core paid features completely inaccessible for more than 72 consecutive hours.",
          ]}
        />
        <p>
          Requests based on the above must be submitted in writing to{" "}
          <a
            href="mailto:billing@skillscout.ai"
            className="text-primary underline"
          >
            billing@skillscout.ai
          </a>{" "}
          within 7 days of the charge. We will review and respond within 10
          business days. Approval is not guaranteed.
        </p>
        <Callout type="warning" title="Chargebacks">
          Filing a chargeback or payment dispute with your bank without first
          contacting SkillScout may result in immediate account suspension and
          may be treated as a breach of our Terms of Service.
        </Callout>
      </Section>

      <Section id="cancellation" number={6} title="Cancellations">
        <p>
          You may cancel your subscription at any time from your account
          settings. Cancellation:
        </p>
        <BulletList
          items={[
            "Prevents automatic renewal at the end of the current billing period.",
            "Does not remove access to paid features — you retain access until the current period ends.",
            "Does not trigger a refund for any unused portion of the current billing period.",
            "Is irreversible within the same billing period; you must re-subscribe to restore access after the period ends.",
          ]}
        />
      </Section>

      <Section id="contact" number={7} title="Contact Us">
        <p>
          If you have questions about this Refund Policy or believe you qualify
          for one of the limited exceptions in Section 5, please contact our
          billing team:
        </p>
        <ContactBlock
          email="billing@skillscout.ai"
          emailLabel="billing@skillscout.ai"
        />
      </Section>
    </LegalLayout>
  );
}
