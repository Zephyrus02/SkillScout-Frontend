import Head from "next/head";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PracticeSection from "@/components/dashboard/sections/PracticeSection";

export default function PracticePage() {
  return (
    <>
      <Head>
        <title>Practice Arena – SkillScout</title>
      </Head>
      <DashboardLayout>
        <PracticeSection />
      </DashboardLayout>
    </>
  );
}
