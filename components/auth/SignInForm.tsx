import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import SocialAuthButtons from "./SocialAuthButtons";

export default function SignInForm() {
  const { login, googleAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password, rememberMe);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const { googleButtonRef } = useGoogleAuth({
    onSuccess: async (idToken) => {
      setLoading(true);
      try {
        await googleAuth(idToken, false);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Google authentication failed.";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => console.error("Google auth error:", err),
  });

  const handleGitHubClick = () => {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
    window.location.href = `${apiBase}/api/auth/github`;
  };

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-8">
      {/* Heading */}
      <div className="flex flex-col gap-2 text-center lg:text-left">
        <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight font-display">
          Welcome Back
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Sign in to continue your interview prep journey.
        </p>
      </div>

      {/* Social auth */}
      <SocialAuthButtons
        googleButtonRef={googleButtonRef}
        onGitHubClick={handleGitHubClick}
        loading={loading}
      />

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
        <span className="mx-4 flex-shrink-0 text-slate-400 text-xs font-bold uppercase tracking-wider">
          Or continue with email
        </span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
      </div>

      {/* Email/password form */}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-semibold text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <span className="material-icons text-[20px]">lock</span>
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
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

        <div className="flex items-center gap-2">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer select-none"
          >
            Keep me logged in
          </label>
        </div>

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
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-bold text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
