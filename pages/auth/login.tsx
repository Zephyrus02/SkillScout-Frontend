import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthBranding from "@/components/auth/AuthBranding";
import SignInForm from "@/components/auth/SignInForm";
import { isAdminUser, useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, loading, user, authFlowNavigating } = useAuth();
  const router = useRouter();

  // Redirect already-authenticated users away from the login page.
  // Skip if the auth flow (login/googleAuth/githubCallbackAuth) is already
  // handling post-auth navigation — firing two concurrent router.replace calls
  // can race and cause the 401 interceptor to clear the refresh-token cookie.
  useEffect(() => {
    if (!loading && isAuthenticated && !authFlowNavigating) {
      const redirect = router.query.redirect as string | undefined;
      // Admins always go to /admin/dashboard — never honour a ?redirect param
      // that might point to a candidate page (e.g. from a prior ProtectedRoute save).
      const targetPath = isAdminUser(user)
        ? "/admin/dashboard"
        : (redirect ?? "/dashboard");
      router.replace(targetPath);
    }
  }, [loading, isAuthenticated, user, router, authFlowNavigating]);

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
