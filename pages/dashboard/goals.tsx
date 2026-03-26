import Head from "next/head";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import GoalsSection from "@/components/dashboard/sections/GoalsSection";

export default function GoalsPage() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />

        <title>Goals & Progress – SkillScout</title>
      </Head>
      <DashboardLayout>
        <GoalsSection />
      </DashboardLayout>
    </>
  );
}
