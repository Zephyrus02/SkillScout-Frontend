import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import SocialAuthButtons from "./SocialAuthButtons";

export default function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    // TODO: wire up to auth API
    console.log("Sign up", { name, email, password });
    // Redirect to email verification page after successful sign up
    await router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-8">
      {/* Heading */}
      <div className="flex flex-col gap-2 text-center lg:text-left">
        <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight font-display">
          Create an Account
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Start your interview prep journey for free.
        </p>
      </div>

      {/* Social auth */}
      <SocialAuthButtons />

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
        <span className="mx-4 flex-shrink-0 text-slate-400 text-xs font-bold uppercase tracking-wider">
          Or continue with email
        </span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
      </div>

      {/* Form */}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Full name
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <span className="material-icons text-[20px]">person</span>
            </span>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-shadow outline-none"
            />
          </div>
        </div>

        {/* Email */}
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
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-shadow outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <span className="material-icons text-[20px]">lock</span>
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-shadow outline-none"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              <span className="material-icons text-[20px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Confirm password
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <span className="material-icons text-[20px]">lock</span>
            </span>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-shadow outline-none"
            />
          </div>
        </div>

        {/* Inline error */}
        {error && (
          <p className="text-sm text-red-500 font-medium -mt-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-xl h-12 px-5 bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="material-icons animate-spin text-[20px]">
              refresh
            </span>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="text-center text-xs text-slate-400 -mt-2">
          By signing up you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      {/* Footer */}
      <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-bold text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
