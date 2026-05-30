import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  token: string;
}

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p: string) => /[a-z]/.test(p), label: "One lowercase letter" },
  { test: (p: string) => /[0-9]/.test(p), label: "One number" },
  {
    test: (p: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
    label: "One special character",
  },
];

function validatePassword(pwd: string): string | null {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(pwd)) return rule.label;
  }
  return null;
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-lime-400", "bg-green-500"];
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {PASSWORD_RULES.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < passed ? colors[passed - 1] : "bg-slate-200 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${passed >= 4 ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
        {labels[passed - 1] ?? "Very weak"}
      </p>
    </div>
  );
}

export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenExpired, setTokenExpired] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Frontend validations
    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      setError(`New password: ${pwdError}.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({ token, currentPassword, newPassword });
      setSuccess(true);
      toast.success("Password updated successfully!");
      // Give the user a moment to read the success state, then go to login
      setTimeout(() => {
        logout?.();
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.code === "TOKEN_EXPIRED") {
        setTokenExpired(true);
        return;
      }
      if (data?.code === "WRONG_CURRENT_PASSWORD") {
        setError("Your current password is incorrect. Please try again.");
        return;
      }
      setError(data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-shadow outline-none";

  // ── Token expired state ─────────────────────────────────────────────────────
  if (tokenExpired) {
    return (
      <div className="w-full max-w-[440px] flex flex-col items-center gap-6 text-center py-4">
        <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
          <span className="material-icons text-amber-500 text-[44px]">timer_off</span>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight font-display">
            Link Expired
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            This password reset link has expired. Please go back to your account
            settings and request a new one.
          </p>
        </div>
        <Link
          href="/dashboard/settings"
          className="h-12 w-full rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-icons text-[18px]">settings</span>
          Back to Settings
        </Link>
        <Link
          href="/auth/forgot-password"
          className="text-sm text-primary hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
        >
          Use forgot password instead →
        </Link>
      </div>
    );
  }

  // ── Success state ───────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="w-full max-w-[440px] flex flex-col items-center gap-6 text-center py-4">
        <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
          <span className="material-icons text-green-500 text-[44px]">check_circle</span>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight font-display">
            Password Updated!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Your password has been changed successfully. Redirecting you to sign
            in…
          </p>
        </div>
        <div className="w-8 h-8">
          <span className="material-icons animate-spin text-primary text-[32px]">refresh</span>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-[440px] flex flex-col gap-8">
      {/* Heading */}
      <div className="flex flex-col gap-2 text-center lg:text-left">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-1 mx-auto lg:mx-0">
          <span className="material-icons text-primary text-[28px]">lock_reset</span>
        </div>
        <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight font-display">
          Change Password
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Enter your current password and choose a strong new one.
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
            <span className="material-icons text-[18px]">error_outline</span>
            {error}
          </div>
        )}

        {/* Current Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="currentPassword"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Current password
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <span className="material-icons text-[20px]">lock</span>
            </span>
            <input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`${inputBase} pl-11 pr-12`}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              onClick={() => setShowCurrent((v) => !v)}
              aria-label="Toggle password visibility"
            >
              <span className="material-icons text-[20px]">
                {showCurrent ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="newPassword"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            New password
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <span className="material-icons text-[20px]">lock_open</span>
            </span>
            <input
              id="newPassword"
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`${inputBase} pl-11 pr-12`}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              onClick={() => setShowNew((v) => !v)}
              aria-label="Toggle password visibility"
            >
              <span className="material-icons text-[20px]">
                {showNew ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          <PasswordStrength password={newPassword} />
          {/* Password rules checklist */}
          {newPassword.length > 0 && (
            <ul className="mt-1 space-y-1">
              {PASSWORD_RULES.map((rule) => (
                <li
                  key={rule.label}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    rule.test(newPassword)
                      ? "text-green-600 dark:text-green-400"
                      : "text-slate-400"
                  }`}
                >
                  <span className="material-icons text-[14px]">
                    {rule.test(newPassword) ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  {rule.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Confirm New Password */}
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
              autoComplete="new-password"
              required
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputBase} pl-11 pr-12`}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label="Toggle password visibility"
            >
              <span className="material-icons text-[20px]">
                {showConfirm ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          {/* Match indicator */}
          {confirmPassword.length > 0 && newPassword !== confirmPassword && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
              <span className="material-icons text-[13px]">error_outline</span>
              Passwords do not match
            </p>
          )}
          {confirmPassword.length > 0 && newPassword === confirmPassword && (
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-0.5">
              <span className="material-icons text-[13px]">check_circle</span>
              Passwords match
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-xl h-12 px-5 bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="material-icons animate-spin text-[20px]">refresh</span>
          ) : (
            <>
              <span className="material-icons text-[18px] mr-2">lock_reset</span>
              Update Password
            </>
          )}
        </button>
      </form>

      {/* Forgot current password */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 -mt-4">
        Forgot your current password?{" "}
        <Link
          href="/auth/forgot-password"
          className="font-semibold text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Reset via email →
        </Link>
      </p>
    </div>
  );
}
