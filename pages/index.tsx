import Head from "next/head";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonial from "@/components/landing/Testimonial";
import SpeedDemo from "@/components/landing/SpeedDemo";
import CTA from "@/components/landing/CTA";

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
