/**
 * ProtectedRoute
 *
 * Wrap any page that requires authentication.
 * - While auth state is resolving: shows a full-screen spinner.
 * - Once resolved with no user: immediately redirects to /auth/login.
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
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const shouldRedirect = !loading && !isAuthenticated;

  useEffect(() => {
    if (!router.isReady) return;
    if (shouldRedirect) {
      // Preserve the intended destination so the user can be sent back after login
      const destination = router.asPath;
      const loginUrl =
        destination && destination !== "/" && destination !== "/auth/login"
          ? `/auth/login?redirect=${encodeURIComponent(destination)}`
          : "/auth/login";
      router.replace(loginUrl);
    }
  }, [shouldRedirect, router]);

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

  // Render nothing while the redirect is in-flight — prevents a content flash
  if (shouldRedirect) {
    return null;
  }

  return <>{children}</>;
}
