import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthBranding from "@/components/auth/AuthBranding";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { email, verified } = router.query;

  /** `verified=true` is set when the user clicks the link in the email */
  const isVerified = verified === "true";

  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  /* auto-start cooldown on first render so the user can't spam immediately */
  useEffect(() => {
    startCooldown(60);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startCooldown = (seconds: number) => {
    setResendCooldown(seconds);
    const t = setInterval(() => {
      setResendCooldown((v) => {
        if (v <= 1) {
          clearInterval(t);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setResendSuccess(false);
    // TODO: call POST /auth/resend-verification { email }
    await new Promise((r) => setTimeout(r, 800));
    setResendLoading(false);
    setResendSuccess(true);
    startCooldown(60);
  };

  return (
    <>
      <Head>
        <title>
          {isVerified
            ? "Email Verified – SkillScout"
            : "Verify Your Email – SkillScout"}
        </title>
        <meta
          name="description"
          content="Verify your SkillScout account email to get started."
        />
      </Head>

      <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-hidden bg-white dark:bg-background-dark">
        {/* Left – branding panel */}
        <AuthBranding />

        {/* Right – content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white dark:bg-background-dark overflow-y-auto">
          <div className="w-full max-w-[440px] flex flex-col gap-8">
            {/* ── VERIFIED state ────────────────────────────────── */}
            {isVerified ? (
              <div className="flex flex-col items-center gap-6 text-center py-4">
                {/* Success icon */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="material-icons text-green-500 text-[52px]">
                      mark_email_read
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-2 border-white dark:border-background-dark">
                    <span className="material-icons text-white text-[18px]">
                      check
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight font-display">
                    Email Verified!
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-base">
                    Your account is now active. Welcome to SkillScout – let's
                    start your interview prep journey.
                  </p>
                </div>

                <Link
                  href="/auth/login"
                  className="h-12 w-full rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-icons text-[18px]">login</span>
                  Sign In to Your Account
                </Link>
              </div>
            ) : (
              /* ── PENDING state ────────────────────────────────── */
              <>
                {/* Header */}
                <div className="flex flex-col gap-2 text-center lg:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-1 mx-auto lg:mx-0">
                    <span className="material-icons text-primary text-[28px]">
                      forward_to_inbox
                    </span>
                  </div>
                  <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight font-display">
                    Verify Your Email
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-base">
                    We've sent a verification link to{" "}
                    {email ? (
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {email}
                      </span>
                    ) : (
                      "your email address"
                    )}
                    . Click the link in the email to activate your account.
                  </p>
                </div>

                {/* Info card */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-5 flex flex-col gap-4">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    What to do next
                  </p>
                  <ol className="flex flex-col gap-3">
                    {[
                      {
                        icon: "inbox",
                        text: 'Open your email inbox and look for a message from "SkillScout".',
                      },
                      {
                        icon: "touch_app",
                        text: 'Click the "Verify Email Address" button inside the email.',
                      },
                      {
                        icon: "check_circle",
                        text: "Your account will be activated and you'll be ready to sign in.",
                      },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                          <span className="material-icons text-primary text-[18px]">
                            {item.icon}
                          </span>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Spam notice */}
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <span className="material-icons text-amber-500 text-[20px] shrink-0 mt-0.5">
                    info
                  </span>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Can't find the email? Check your spam or junk folder. The
                    link expires in{" "}
                    <span className="font-semibold">24 hours</span>.
                  </p>
                </div>

                {/* Resend section */}
                <div className="flex flex-col gap-3">
                  {resendSuccess && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium">
                      <span className="material-icons text-[18px]">
                        check_circle
                      </span>
                      Verification email resent! Check your inbox.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || resendLoading}
                    className="h-12 w-full rounded-xl border-2 border-primary text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
                  >
                    {resendLoading ? (
                      <>
                        <span className="material-icons text-[18px] animate-spin">
                          autorenew
                        </span>
                        Sending…
                      </>
                    ) : resendCooldown > 0 ? (
                      <>
                        <span className="material-icons text-[18px]">
                          schedule
                        </span>
                        Resend in {resendCooldown}s
                      </>
                    ) : (
                      <>
                        <span className="material-icons text-[18px]">send</span>
                        Resend Verification Email
                      </>
                    )}
                  </button>
                </div>

                {/* Footer links */}
                <div className="flex flex-col gap-2 items-center text-sm text-slate-500 dark:text-slate-400">
                  <p>
                    Wrong email address?{" "}
                    <Link
                      href="/auth/signup"
                      className="font-semibold text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Sign up again
                    </Link>
                  </p>
                  <p>
                    Already verified?{" "}
                    <Link
                      href="/auth/login"
                      className="font-semibold text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
