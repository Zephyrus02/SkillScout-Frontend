import Head from "next/head";
import AuthBranding from "@/components/auth/AuthBranding";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Sign Up – SkillScout</title>
        <meta
          name="description"
          content="Create your free SkillScout account and start acing your interviews with AI."
        />
      </Head>

      <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-hidden bg-white dark:bg-background-dark">
        {/* Left – branding panel */}
        <AuthBranding />

        {/* Right – sign up form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white dark:bg-background-dark overflow-y-auto">
          <SignUpForm />
        </div>
      </div>
    </>
  );
}
