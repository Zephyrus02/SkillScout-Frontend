import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading, loggingOut } = useAuth();
  const router = useRouter();

  const unauthenticated = !loading && !isAuthenticated;

  // Authenticated but onboarding not yet completed (non-admin only)
  const incompleteOnboarding =
    !loading &&
    isAuthenticated &&
    user != null &&
    !user.onboardingCompleted &&
    !isAdminUser(user);

  useEffect(() => {
    if (!router.isReady) return;
    if (unauthenticated && !loggingOut) {
      const destination = router.asPath;
      const loginUrl =
        destination && destination !== "/" && destination !== "/auth/login"
          ? `/auth/login?redirect=${encodeURIComponent(destination)}`
          : "/auth/login";
      router.replace(loginUrl);
      return;
    }
    if (incompleteOnboarding && router.pathname !== "/profile-setup") {
      router.replace("/profile-setup");
    }
  }, [unauthenticated, incompleteOnboarding, loggingOut, router]);

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

  // Render nothing while unauthenticated or while onboarding redirect is in-flight
  if (unauthenticated || incompleteOnboarding) {
    return null;
  }

  return <>{children}</>;
}
