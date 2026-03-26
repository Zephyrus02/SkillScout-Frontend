import Head from "next/head";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonial from "@/components/landing/Testimonial";
import SpeedDemo from "@/components/landing/SpeedDemo";
import CTA from "@/components/landing/CTA";

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.skillscout.dev/#software",
  name: "SkillScout",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "AI mock interview platform with real-time code analysis, system design canvas, voice mode, and personalized feedback.",
  publisher: { "@id": "https://www.skillscout.dev/#organization" },
  offers: [
    { "@type": "Offer", name: "Trial", price: "0", priceCurrency: "INR" },
    { "@type": "Offer", name: "Lite", price: "1000", priceCurrency: "INR" },
    { "@type": "Offer", name: "Pro", price: "2000", priceCurrency: "INR" },
    { "@type": "Offer", name: "Elite", price: "5000", priceCurrency: "INR" },
  ],
};

export default function Home() {
  return (
    <>
      <Head>
        <title>SkillScout — AI Mock Interview Practice for Software Engineers</title>
        <meta
          name="description"
          content="Practice technical and behavioral interviews with AI. Real-time code analysis, system design canvas, voice mode, and instant feedback. Free to start."
        />
        <link rel="canonical" href="https://www.skillscout.dev/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationSchema),
          }}
        />
      </Head>
      <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-300">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonial />
        <SpeedDemo />
        <CTA />
        <Footer />
      </div>
    </>
  );
}
