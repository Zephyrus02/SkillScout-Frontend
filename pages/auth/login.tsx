import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthBranding from "@/components/auth/AuthBranding";
import SignInForm from "@/components/auth/SignInForm";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Redirect already authenticated users to the dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const redirect = router.query.redirect as string | undefined;
      router.replace(redirect ?? "/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || isAuthenticated) return null;
  return (
    <>
      <Head>
        <title>Sign In – SkillScout</title>
        <meta
          name="description"
          content="Sign in to your SkillScout account and continue your interview prep journey."
        />
      </Head>

      <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-hidden bg-white dark:bg-background-dark">
        {/* Left – branding panel */}
        <AuthBranding />

        {/* Right – sign in form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white dark:bg-background-dark overflow-y-auto">
          <SignInForm />
        </div>
      </div>
    </>
  );
}
