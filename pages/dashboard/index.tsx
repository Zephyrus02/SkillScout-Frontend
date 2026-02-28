import Head from "next/head";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import OverviewSection from "@/components/dashboard/sections/OverviewSection";

export default function UserDashboard() {
  return (
    <>
      <Head>
        <title>Dashboard – SkillScout</title>
      </Head>
      <DashboardLayout>
        <OverviewSection />
      </DashboardLayout>
    </>
  );
}
