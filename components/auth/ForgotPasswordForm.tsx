import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

type Step = "email" | "verify" | "reset" | "success";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  /* ── helpers ──────────────────────────────────────────────────── */

  const startResendCooldown = () => {
    setResendCooldown(60);
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

  /* ── step handlers ────────────────────────────────────────────── */

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // TODO: call POST /auth/forgot-password { email }
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    startResendCooldown();
    setStep("verify");
  };

  const handleCodeChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = cleaned;
    setCode(next);
    if (cleaned && index < 5) codeRefs.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = [...code];
    pasted.split("").forEach((ch, i) => {
      if (i < 6) next[i] = ch;
    });
    setCode(next);
    const lastFilled = Math.min(pasted.length, 5);
    codeRefs.current[lastFilled]?.focus();
    e.preventDefault();
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const otp = code.join("");
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setLoading(true);
    // TODO: call POST /auth/verify-reset-code { email, code: otp }
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("reset");
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    // TODO: call POST /auth/forgot-password { email }
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setCode(["", "", "", "", "", ""]);
    startResendCooldown();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    // TODO: call POST /auth/reset-password { email, code, password }
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("success");
  };

  /* ── shared input style ───────────────────────────────────────── */
  const inputBase =
    "w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-shadow outline-none";

  /* ── render ───────────────────────────────────────────────────── */

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-8">
      {/* ── STEP 1 : enter email ────────────────────────────────── */}
      {step === "email" && (
        <>
          <div className="flex flex-col gap-2 text-center lg:text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-1 mx-auto lg:mx-0">
              <span className="material-icons text-primary text-[28px]">
                lock_reset
              </span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight font-display">
              Forgot Password?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              No worries – enter your email and we&apos;ll send you a reset code.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSendCode}>
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
                <span className="material-icons text-[18px]">
                  error_outline
                </span>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <span className="material-icons text-[20px]">mail</span>
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputBase} pl-11 pr-4`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-icons text-[18px] animate-spin">
                    autorenew
                  </span>
                  Sending…
                </>
              ) : (
                <>
                  Send Reset Code
                  <span className="material-icons text-[18px]">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </>
      )}

      {/* ── STEP 2 : enter OTP (inline, not a modal) ────────────── */}
      {step === "verify" && (
        <>
          <div className="flex flex-col gap-2 text-center lg:text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-1 mx-auto lg:mx-0">
              <span className="material-icons text-primary text-[28px]">
                mark_email_read
              </span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight font-display">
              Check Your Email
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {email}
              </span>
              . Enter it below to continue.
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleVerifyCode}>
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
                <span className="material-icons text-[18px]">
                  error_outline
                </span>
                {error}
              </div>
            )}

            {/* OTP inputs */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Verification code
              </label>
              <div
                className="flex gap-3 justify-between"
                onPaste={handleCodePaste}
              >
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      codeRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || code.join("").length < 6}
              className="h-12 w-full rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-icons text-[18px] animate-spin">
                    autorenew
                  </span>
                  Verifying…
                </>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>

          {/* Resend + back */}
          <div className="flex flex-col gap-3 items-center text-sm text-slate-500 dark:text-slate-400">
            <p>
              Didn&apos;t receive a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="font-semibold text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend code"}
              </button>
            </p>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError("");
                setCode(["", "", "", "", "", ""]);
              }}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors font-medium"
            >
              <span className="material-icons text-[16px]">arrow_back</span>
              Change email address
            </button>
          </div>
        </>
      )}

      {/* ── STEP 3 : set new password ────────────────────────────── */}
      {step === "reset" && (
        <>
          <div className="flex flex-col gap-2 text-center lg:text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-1 mx-auto lg:mx-0">
              <span className="material-icons text-primary text-[28px]">
                lock
              </span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight font-display">
              Set New Password
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Choose a strong password for your account.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleResetPassword}>
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
                <span className="material-icons text-[18px]">
                  error_outline
                </span>
                {error}
              </div>
            )}

            {/* New password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                New password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <span className="material-icons text-[20px]">lock</span>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputBase} pl-11 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-icons text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {/* Strength hints */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[8, 12, 16].map((threshold) => (
                    <div
                      key={threshold}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= threshold
                          ? threshold >= 16
                            ? "bg-green-500"
                            : threshold >= 12
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">
                    {password.length < 8
                      ? "Weak"
                      : password.length < 12
                        ? "Fair"
                        : password.length < 16
                          ? "Good"
                          : "Strong"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Confirm new password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <span className="material-icons text-[20px]">lock</span>
                </span>
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputBase} pl-11 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  <span className="material-icons text-[20px]">
                    {showConfirm ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-icons text-[18px] animate-spin">
                    autorenew
                  </span>
                  Updating…
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </>
      )}

      {/* ── STEP 4 : success ────────────────────────────────────── */}
      {step === "success" && (
        <div className="flex flex-col items-center gap-6 text-center py-4">
          <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
            <span className="material-icons text-green-500 text-[44px]">
              check_circle
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight font-display">
              Password Updated!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="h-12 w-full rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-icons text-[18px]">login</span>
            Go to Sign In
          </button>
        </div>
      )}
    </div>
  );
}
