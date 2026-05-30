import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthBranding from "@/components/auth/AuthBranding";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const t = router.query.token;
    setToken(typeof t === "string" && t.length > 0 ? t : null);
    setReady(true);
  }, [router.isReady, router.query.token]);

  if (!ready) return null;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Change Password – SkillScout</title>
        <meta
          name="description"
          content="Securely change your SkillScout account password."
        />
      </Head>

      <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-hidden bg-white dark:bg-background-dark">
        {/* Left – branding panel */}
        <AuthBranding />

        {/* Right – form or error */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white dark:bg-background-dark overflow-y-auto">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            /* No token in URL – show friendly error */
            <div className="w-full max-w-[440px] flex flex-col items-center gap-6 text-center py-4">
              <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                <span className="material-icons text-red-500 text-[44px]">
                  link_off
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight font-display">
                  Invalid Link
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-base">
                  This password reset link is invalid or missing. Please go to
                  your account settings and request a new one.
                </p>
              </div>
              <a
                href="/dashboard/settings"
                className="h-12 w-full rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-icons text-[18px]">settings</span>
                Back to Settings
              </a>
              <a
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
              >
                Forgot your password instead? →
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
