import Head from "next/head";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HistorySection from "@/components/dashboard/sections/HistorySection";

export default function HistoryPage() {
  return (
    <>
      <Head>
        <title>Session History – SkillScout</title>
      </Head>
      <DashboardLayout>
        <HistorySection />
      </DashboardLayout>
    </>
  );
}
