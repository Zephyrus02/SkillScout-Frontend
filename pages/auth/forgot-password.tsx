import Head from "next/head";
import AuthBranding from "@/components/auth/AuthBranding";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />

        <title>Forgot Password – SkillScout</title>
        <meta
          name="description"
          content="Reset your SkillScout password. Enter your email and we'll send you a verification code."
        />
      </Head>

      <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-hidden bg-white dark:bg-background-dark">
        {/* Left – branding panel */}
        <AuthBranding />

        {/* Right – forgot password form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white dark:bg-background-dark overflow-y-auto">
          <ForgotPasswordForm />
        </div>
      </div>
    </>
  );
}
