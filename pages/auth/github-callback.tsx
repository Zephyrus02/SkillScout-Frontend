import Head from "next/head";
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

import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function GitHubCallbackPage() {
  const router = useRouter();
  const { githubCallbackAuth } = useAuth();

  useEffect(() => {
    // Wait until router is ready so query params are populated
    if (!router.isReady) return;

    const { accessToken, isNewUser, error } = router.query as {
      accessToken?: string;
      isNewUser?: string;
      error?: string;
    };

    if (error) {
      toast.error(decodeURIComponent(error));
      router.push("/auth/login");
      return;
    }

    if (!accessToken) {
      toast.error("No access token received from GitHub. Please try again.");
      router.push("/auth/login");
      return;
    }

    githubCallbackAuth(accessToken, isNewUser === "true").catch(
      (err: unknown) => {
        const msg =
          (err as Error)?.message ??
          "GitHub authentication failed. Please try again.";
        toast.error(msg);
        router.push("/auth/login");
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900">
        <span className="material-icons animate-spin text-4xl text-primary">
          refresh
        </span>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Completing GitHub sign-in…
        </p>
      </div>
    </>
  );
}
