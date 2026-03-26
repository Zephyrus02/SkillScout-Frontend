import Head from "next/head";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SettingsSection from "@/components/dashboard/sections/SettingsSection";

export default function SettingsPage() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />

        <title>Settings – SkillScout</title>
      </Head>
      <DashboardLayout>
        <SettingsSection />
      </DashboardLayout>
    </>
  );
}
