import Head from "next/head";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WeakAreasSection from "@/components/dashboard/sections/WeakAreasSection";

export default function WeakAreasPage() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />

        <title>Weak Areas – SkillScout</title>
      </Head>
      <DashboardLayout>
        <WeakAreasSection />
      </DashboardLayout>
    </>
  );
}
