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
  { id: "digital-delivery", label: "2. Digital Delivery" },
  { id: "delivery-timeline", label: "3. Delivery Timeline" },
  { id: "reports-exports", label: "4. Reports & Exports" },
  { id: "certificates", label: "5. Certificates" },
  { id: "enterprise-plans", label: "6. Enterprise & Team Plans" },
  { id: "failed-delivery", label: "7. Failed Delivery" },
  { id: "contact", label: "8. Contact Us" },
];

export default function ShippingPolicyPage() {
  return (
    <LegalLayout
      pageTitle="Shipping Policy"
      title="Shipping Policy"
      description="SkillScout is a fully digital platform. This policy explains how we deliver your purchased plans, reports, certificates, and other digital assets."
      effectiveDate="March 1, 2025"
      lastUpdated="March 1, 2026"
      tocItems={TOC}
      canonicalPath="/legal/shipping-policy"
    >
      <Section id="overview" number={1} title="Overview">
        <p>
          SkillScout is a 100% digital, software-as-a-service (SaaS) platform.
          We do not ship or deliver any physical goods. All products, plans,
          features, and outputs provided by SkillScout are delivered
          electronically.
        </p>
        <p>
          This Shipping Policy describes how and when you receive access to
          purchased plans and how digital deliverables such as interview
          feedback reports, performance exports, and certificates are provided
          to you.
        </p>
        <Callout type="info" title="No Physical Shipping">
          Because SkillScout delivers exclusively digital products, there are no
          shipping fees, shipping addresses, or carrier-related timelines
          applicable to our Service.
        </Callout>
      </Section>

      <Section id="digital-delivery" number={2} title="Digital Delivery">
        <p>
          All SkillScout products and deliverables are fulfilled digitally
          through the following methods:
        </p>
        <InfoGrid
          items={[
            {
              icon: "flash_on",
              title: "Instant Account Access",
              description:
                "Subscription plan features are activated immediately upon successful payment confirmation.",
            },
            {
              icon: "mail",
              title: "Email Delivery",
              description:
                "Confirmation receipts, interview reports, and certificates are sent to your registered email address.",
            },
            {
              icon: "dashboard",
              title: "In-App Dashboard",
              description:
                "All reports, analytics, and exports are permanently accessible from your SkillScout dashboard.",
            },
            {
              icon: "download",
              title: "Downloadable Exports",
              description:
                "Interview feedback reports can be downloaded as PDF or viewed online at any time.",
            },
          ]}
        />
      </Section>

      <Section id="delivery-timeline" number={3} title="Delivery Timeline">
        <p>
          The following timelines apply to digital deliverables on SkillScout:
        </p>
        <BulletList
          items={[
            "Subscription activation: Immediate upon payment confirmation. You will receive a receipt email within 5 minutes.",
            "AI interview feedback report: Generated within 1–3 minutes after an interview session ends.",
            "Detailed performance analytics: Available on your dashboard in real-time as you complete sessions.",
            "Bulk session export (CSV/PDF): Generated within 5–10 minutes and emailed to your account address.",
            "Completion certificates: Issued within 24 hours of meeting the required criteria.",
            "Enterprise licence keys (Team plans): Delivered within one business day of contract execution.",
          ]}
        />
        <Callout type="warning" title="High-Traffic Delays">
          During peak usage periods or scheduled maintenance windows, generation
          of reports and exports may experience delays of up to 30 minutes. We
          will notify you via email if a deliverable is delayed beyond the
          standard window.
        </Callout>
      </Section>

      <Section id="reports-exports" number={4} title="Reports & Exports">
        <p>
          SkillScout generates the following types of digital reports and
          exports:
        </p>
        <InfoGrid
          items={[
            {
              icon: "assessment",
              title: "Interview Feedback Report",
              description:
                "AI-generated analysis of answer quality, communication, confidence, and technical accuracy.",
            },
            {
              icon: "bar_chart",
              title: "Performance Trend Export",
              description:
                "Session-over-session improvement charts and skill-gap summaries in PDF or CSV format.",
            },
            {
              icon: "psychology",
              title: "Weak-Area Analysis",
              description:
                "Topic-level breakdown identifying knowledge gaps with targeted improvement suggestions.",
            },
            {
              icon: "folder_special",
              title: "Full Data Export",
              description:
                "Complete account data download including all sessions, scores, and profile information.",
            },
          ]}
        />
        <p>
          All reports are stored on your dashboard for the duration of your
          subscription. Pro and annual subscribers retain access to reports for
          a rolling 12-month window even after subscription expiry.
        </p>
      </Section>

      <Section id="certificates" number={5} title="Certificates">
        <p>
          SkillScout issues digital completion certificates for recognised
          preparation milestones. Certificates are:
        </p>
        <BulletList
          items={[
            "Issued as secure, verifiable PDF documents linked to your account.",
            "Shareable via a unique public URL for LinkedIn profiles, portfolios, and job applications.",
            "Revocation-proof: once issued, your certificate remains valid and accessible even after subscription downgrade.",
            "Delivered to your registered email within 24 hours of eligibility.",
          ]}
        />
        <Callout type="success" title="Shareable on LinkedIn">
          Each certificate includes a verification ID that recruiters and hiring
          managers can use to confirm authenticity directly on our verification
          portal.
        </Callout>
      </Section>

      <Section id="enterprise-plans" number={6} title="Enterprise & Team Plans">
        <p>
          For organisations purchasing team or enterprise licences, delivery
          includes additional steps:
        </p>
        <BulletList
          items={[
            "A signed order confirmation is emailed to the billing contact within one business day.",
            "Admin portal access credentials are delivered securely within one business day of contract execution.",
            "Bulk seat invitations can be sent by the organisation admin at any time after delivery.",
            "Onboarding documentation and API credentials (where applicable) are delivered within two business days.",
          ]}
        />
        <p>
          For custom enterprise agreements, delivery timelines will be specified
          in the order form or statement of work.
        </p>
      </Section>

      <Section id="failed-delivery" number={7} title="Failed Delivery">
        <p>
          If you do not receive a digital deliverable within the expected
          timeframe, please take the following steps:
        </p>
        <BulletList
          items={[
            "Check your spam or junk email folder for reports and receipt emails.",
            "Ensure the email address in your SkillScout account settings is correct.",
            "Check your dashboard under 'History' or 'Reports' — deliverables are always archived there.",
            "If a report is missing from your dashboard, contact us within 7 days of the session date.",
          ]}
        />
        <Callout type="warning" title="Email Delivery Issues">
          Some corporate email servers may block automated emails. If you
          consistently have trouble receiving emails from SkillScout, add
          noreply@skillscout.ai to your email safe-sender list.
        </Callout>
      </Section>

      <Section id="contact" number={8} title="Contact Us">
        <p>
          If you have questions about our shipping and delivery policy or have
          not received a digital deliverable, please contact our support team:
        </p>
        <ContactBlock
          email="support@skillscout.ai"
          emailLabel="support@skillscout.ai"
        />
      </Section>
    </LegalLayout>
  );
}
