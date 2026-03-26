import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        {/* Favicons */}
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />

        {/* Open Graph — site-wide defaults (individual pages override og:title / og:description) */}
        <meta property="og:title" content="SkillScout — AI Mock Interview Practice" />
        <meta property="og:description" content="Cut interview prep from 5 weeks to 5 days with AI-powered mock sessions." />
        <meta property="og:image" content="https://www.skillscout.dev/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SkillScout" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.skillscout.dev/og-image.png" />
        <meta name="twitter:title" content="SkillScout — AI Mock Interview Practice" />
        <meta name="twitter:description" content="Cut interview prep from 5 weeks to 5 days with AI-powered mock sessions." />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

