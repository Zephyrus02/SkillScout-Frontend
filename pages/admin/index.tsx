import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <ProtectedRoute>
        <div className="min-h-screen bg-white dark:bg-background-dark" />
      </ProtectedRoute>
    </>
  );
}
