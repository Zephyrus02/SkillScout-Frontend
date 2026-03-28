/**
 * ProtectedRoute
 *
 * Wrap any page that requires authentication.
 * - While auth state is resolving: shows a full-screen spinner.
 * - Once resolved with no user: redirects to /auth/login (unless `loggingOut`,
 *   in which case AuthContext is sending the user to `/`).
 * - Once resolved with a valid user: renders children.
 *
 * The guard uses `router.isReady` to avoid firing before Next.js has
 * parsed dynamic query params, and shows nothing (null) while the redirect
 * is in-flight so there is zero content flash.
 */

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, loggingOut } = useAuth();
  const router = useRouter();

  const unauthenticated = !loading && !isAuthenticated;

  useEffect(() => {
    if (!router.isReady) return;
    // During logout, AuthContext navigates to `/`; do not race with /auth/login.
    if (unauthenticated && !loggingOut) {
      const destination = router.asPath;
      const loginUrl =
        destination && destination !== "/" && destination !== "/auth/login"
          ? `/auth/login?redirect=${encodeURIComponent(destination)}`
          : "/auth/login";
      router.replace(loginUrl);
    }
  }, [unauthenticated, loggingOut, router]);

  // Show a spinner while the auth check is in progress
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background-dark">
        <div className="flex flex-col items-center gap-3">
          <span className="material-icons animate-spin text-primary text-[40px]">
            refresh
          </span>
          <p className="text-sm text-slate-400">Loading…</p>
        </div>
      </div>
    );
  }

  // Render nothing while unauthenticated (login redirect or logout → home)
  if (unauthenticated) {
    return null;
  }

  return <>{children}</>;
}
