import LegalLayout, {
  BulletList,
  Callout,
  ContactBlock,
  InfoGrid,
  Section,
  TocItem,
} from "@/components/legal/LegalLayout";

const TOC: TocItem[] = [
  { id: "introduction", label: "1. Introduction" },
  { id: "eligibility", label: "2. Eligibility" },
  { id: "account", label: "3. Account & Registration" },
  { id: "subscriptions", label: "4. Subscriptions & Billing" },
  { id: "acceptable-use", label: "5. Acceptable Use" },
  { id: "intellectual-property", label: "6. Intellectual Property" },
  { id: "disclaimer", label: "7. Disclaimer" },
  { id: "termination", label: "8. Termination" },
  { id: "governing-law", label: "9. Governing Law" },
  { id: "contact", label: "10. Contact Us" },
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      pageTitle="Terms of Service"
      title="Terms of Service"
      description="Please read these terms carefully before using SkillScout. By accessing or using our services, you agree to be bound by these terms."
      effectiveDate="March 1, 2025"
      lastUpdated="March 1, 2026"
      tocItems={TOC}
    >
      <Section id="introduction" number={1} title="Introduction">
        <p>
          Welcome to SkillScout. These Terms of Service (&quot;Terms&quot;)
          govern your access to and use of our website, AI-powered mock
          interview platform, assessment engine, and any other software or
          services provided by SkillScout (collectively, the
          &quot;Service&quot;).
        </p>
        <p>
          By accessing or using the Service, you agree to be bound by these
          Terms. If you disagree with any part of the Terms, you may not access
          the Service. These Terms apply to all visitors, registered users, and
          others who access or use the Service.
        </p>
      </Section>

      <Section id="eligibility" number={2} title="Eligibility">
        <p>To use SkillScout, you must meet the following requirements:</p>
        <BulletList
          items={[
            "Be at least 16 years of age.",
            "Have the legal capacity to enter into a binding agreement.",
            "Not be prohibited from receiving services under applicable laws.",
            "Provide accurate, current, and complete registration information.",
          ]}
        />
        <p>
          SkillScout is intended for job seekers, students, and professionals
          preparing for technical and behavioural interviews. If you are signing
          up on behalf of an organisation, you represent that you have authority
          to bind that organisation to these Terms.
        </p>
      </Section>

      <Section id="account" number={3} title="Account & Registration">
        <p>
          When you create an account, you agree to provide accurate and complete
          information. You are responsible for maintaining the confidentiality
          of your credentials and for all activities that occur under your
          account.
        </p>
        <InfoGrid
          items={[
            {
              icon: "lock",
              title: "Account Security",
              description:
                "Use a strong, unique password and enable two-factor authentication where available.",
            },
            {
              icon: "person",
              title: "Accurate Information",
              description:
                "Keep your profile details — name, email, job role preferences — up to date.",
            },
            {
              icon: "devices",
              title: "Single Use",
              description:
                "Accounts are for individual use only and may not be shared or transferred.",
            },
            {
              icon: "report",
              title: "Breach Notification",
              description:
                "Notify us immediately at security@skillscout.ai of any unauthorised access.",
            },
          ]}
        />
        <Callout type="info" title="Account Suspension">
          We reserve the right to suspend or terminate accounts that violate
          these Terms, engage in fraudulent activity, or threaten the security
          of other users.
        </Callout>
      </Section>

      <Section id="subscriptions" number={4} title="Subscriptions & Billing">
        <p>
          SkillScout offers both free-tier access and paid subscription plans.
          Paid plans unlock advanced features including unlimited AI mock
          interviews, detailed performance analytics, and personalised coaching
          reports.
        </p>
        <BulletList
          items={[
            "Subscription fees are billed in advance on a monthly or annual basis.",
            "All payments are processed securely. We do not store your full card details.",
            "Prices are displayed inclusive of applicable taxes where required.",
            "You may upgrade or downgrade your plan at any time; changes take effect at the next billing cycle.",
            "Annual plans are non-refundable after 14 days from the date of purchase unless stated otherwise in our Refund Policy.",
          ]}
        />
        <Callout type="warning" title="Auto-Renewal">
          Subscriptions automatically renew at the end of each billing period.
          You may cancel auto-renewal at any time from your account settings
          before the renewal date.
        </Callout>
      </Section>

      <Section id="acceptable-use" number={5} title="Acceptable Use">
        <p>
          You agree not to misuse the Service. Prohibited activities include,
          but are not limited to:
        </p>
        <BulletList
          items={[
            "Attempting to reverse-engineer, scrape, or extract our AI models or interview question databases.",
            "Submitting false, misleading, or offensive content during mock interviews.",
            "Using automated bots or scripts to interact with the platform.",
            "Sharing, reselling, or redistributing content generated by SkillScout without written consent.",
            "Circumventing access controls or attempting to gain unauthorised access to other accounts.",
            "Uploading malicious code, viruses, or any content that could disrupt the Service.",
          ]}
        />
      </Section>

      <Section
        id="intellectual-property"
        number={6}
        title="Intellectual Property"
      >
        <p>
          The Service and its original content, features, and functionality are
          and will remain the exclusive property of SkillScout and its
          licensors. Our trademarks and trade dress may not be used in
          connection with any product or service without our prior written
          consent.
        </p>
        <p>
          Content you upload (résumés, profile data) remains yours. By
          uploading, you grant SkillScout a limited, non-exclusive licence to
          process that content solely to provide the Service to you.
        </p>
        <Callout type="success" title="Your Content Belongs to You">
          Interview recordings, feedback reports, and résumé data are yours. We
          will never sell or license your personal content to third parties.
        </Callout>
      </Section>

      <Section id="disclaimer" number={7} title="Disclaimer of Warranties">
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot;
          without warranties of any kind, either express or implied. SkillScout
          does not warrant that the Service will be uninterrupted, error-free,
          or free of harmful components. AI-generated feedback is for
          educational purposes only and does not constitute career or legal
          advice.
        </p>
        <p>
          To the maximum extent permitted by law, SkillScout is not liable for
          any indirect, incidental, special, consequential, or punitive damages,
          however caused.
        </p>
      </Section>

      <Section id="termination" number={8} title="Termination">
        <p>
          You may terminate your account at any time from the account settings
          page. Upon termination, your right to use the Service ceases
          immediately. We may retain anonymised usage data as permitted by our
          Privacy Policy.
        </p>
        <p>
          SkillScout may suspend or terminate your access immediately if you
          breach these Terms, without prior notice or liability.
        </p>
      </Section>

      <Section id="governing-law" number={9} title="Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of India, without regard to its conflict of law provisions. Any
          disputes arising from these Terms or the use of the Service shall be
          subject to the exclusive jurisdiction of the courts located in
          Bengaluru, Karnataka, India.
        </p>
        <p>
          We reserve the right to update these Terms at any time. Material
          changes will be communicated via email or a prominent notice on the
          platform at least 14 days before they take effect.
        </p>
      </Section>

      <Section id="contact" number={10} title="Contact Us">
        <p>
          If you have any questions about these Terms of Service, please contact
          us:
        </p>
        <ContactBlock email="legal@skillscout.ai" />
      </Section>
    </LegalLayout>
  );
}
