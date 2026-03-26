import { Html, Head, Main, NextScript } from "next/document";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.skillscout.dev/#organization",
  name: "SkillScout",
  legalName: "SkillScout Inc.",
  url: "https://www.skillscout.dev",
  logo: {
    "@type": "ImageObject",
    url: "https://www.skillscout.dev/favicon/apple-touch-icon.png",
  },
  description:
    "AI-powered mock interview preparation platform for software engineers.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@skillscout.dev",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.skillscout.dev/#website",
  name: "SkillScout",
  url: "https://www.skillscout.dev",
  publisher: { "@id": "https://www.skillscout.dev/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://www.skillscout.dev/resources?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicons */}
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="icon"
          href="/favicon/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />

        {/* Open Graph — site-wide defaults (individual pages override og:title / og:description) */}
        <meta
          property="og:title"
          content="SkillScout — AI Mock Interview Practice"
        />
        <meta
          property="og:description"
          content="Cut interview prep from 5 weeks to 5 days with AI-powered mock sessions."
        />
        <meta
          property="og:image"
          content="https://www.skillscout.dev/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SkillScout" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://www.skillscout.dev/og-image.png"
        />
        <meta
          name="twitter:title"
          content="SkillScout — AI Mock Interview Practice"
        />
        <meta
          name="twitter:description"
          content="Cut interview prep from 5 weeks to 5 days with AI-powered mock sessions."
        />

        {/* Structured Data — Organisation + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
