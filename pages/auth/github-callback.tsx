/**
 * /auth/github-callback
 *
 * Landing page after the backend completes GitHub OAuth.
 * The backend redirects here with ?accessToken=...&isNewUser=... on success,
 * or ?error=... on failure.
 *
 * This page reads those params, calls githubCallbackAuth from AuthContext
 * to store the token + fetch the profile, then navigates to the dashboard.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function GitHubCallbackPage() {
  const router = useRouter();
  const { githubCallbackAuth } = useAuth();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Wait until router is ready so query params are populated
    if (!router.isReady) return;

    const { accessToken, isNewUser, error } = router.query as {
      accessToken?: string;
      isNewUser?: string;
      error?: string;
    };

    if (error) {
      setErrorMsg(decodeURIComponent(error));
      setStatus("error");
      toast.error(decodeURIComponent(error));
      return;
    }

    if (!accessToken) {
      const msg = "No access token received from GitHub. Please try again.";
      setErrorMsg(msg);
      setStatus("error");
      toast.error(msg);
      return;
    }

    githubCallbackAuth(accessToken, isNewUser === "true").catch(
      (err: unknown) => {
        const msg =
          (err as Error)?.message ??
          "GitHub authentication failed. Please try again.";
        setErrorMsg(msg);
        setStatus("error");
        toast.error(msg);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-slate-900 px-4">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <span className="material-icons text-5xl text-red-500">
            error_outline
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            GitHub Login Failed
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {errorMsg}
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state while we process the token
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900">
      <span className="material-icons animate-spin text-4xl text-primary">
        refresh
      </span>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
        Completing GitHub sign-in…
      </p>
    </div>
  );
}
