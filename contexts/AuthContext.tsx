/**
 * AuthContext — manages authenticated user state, login/signup/googleAuth/logout.
 *
 * Strategy (same as the Vite frontend):
 * - Access tokens are stored in-memory only (never localStorage) to prevent XSS.
 * - A session token (random UUID, no PII) is kept in localStorage so we know
 *   whether to attempt a token refresh on page load.
 * - The HttpOnly refresh-token cookie is sent automatically (withCredentials).
 *
 * Candidate-only flow: after login/google-auth we check profile status and
 * redirect candidates to:
 *   1. /profile-setup  — if profile not yet completed
 *   2. /choose-plan    — if hasAccess is false
 *   3. /dashboard      — happy path
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { authAPI, profileAPI, type User } from "@/lib/api";
import {
  setAccessToken,
  clearAccessToken,
  getAccessToken,
} from "@/lib/token-storage";
import {
  setUserData,
  clearUserData,
  getUserData,
  hasUserSession,
} from "@/lib/user-storage";
import { clearCachedProfile } from "@/lib/profile-cache";

// ── Types ───────────────────────────────────────────────────────────────────

export type { User };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (
    email: string,
    password: string,
    keepMeLoggedIn?: boolean,
  ) => Promise<void>;
  signup: (
    email: string,
    password: string,
    fullName: string,
    avatarUrl?: string,
  ) => Promise<{ requiresEmailVerification: boolean; email?: string } | void>;
  googleAuth: (idToken: string, keepMeLoggedIn?: boolean) => Promise<void>;
  githubCallbackAuth: (
    accessToken: string,
    isNewUser?: boolean,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * After a successful login/google-auth, check candidate profile status and
 * navigate to the right page.
 *
 * Admins → /admin/dashboard (future)
 * Candidates without completed profile → /profile-setup
 * Candidates without access → /choose-plan
 * Candidates OK → /dashboard
 */
async function navigateAfterAuth(
  userForNav: User,
  router: ReturnType<typeof useRouter>,
) {
  if (userForNav.role === "admin") {
    await router.replace("/dashboard"); // admin dashboard to be added later
    return;
  }

  // Candidate flow
  try {
    const profileStatus = await profileAPI.checkProfileStatus();
    if (!profileStatus.data.hasCompletedProfile) {
      await router.replace("/profile-setup");
      return;
    }
    if (userForNav.hasAccess === false) {
      await router.replace("/choose-plan");
      return;
    }
  } catch (err) {
    console.error("Failed to check profile status:", err);
  }

  await router.replace("/dashboard");
}

// ── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Load user on mount ──────────────────────────────────────────────────

  useEffect(() => {
    const loadUser = async () => {
      // Fast path: user already in memory (in-memory state survives client-side nav)
      const memUser = getUserData();
      if (memUser) {
        setUserState(memUser);
        setLoading(false);
        return;
      }

      const existingToken = getAccessToken();

      // Only attempt a token refresh if we have either:
      //   (a) an in-memory access token, or
      //   (b) a session marker in localStorage indicating a previous login on this app.
      // Without this guard a completely fresh/anonymous visitor triggers a pointless
      // network request AND any stale HttpOnly cookie from another app can silently
      // log the user in without their knowledge.
      const hasSession = existingToken || hasUserSession();
      if (!hasSession) {
        // Definitely not logged in — skip the API roundtrip.
        setLoading(false);
        return;
      }

      if (!existingToken) {
        // We have a session marker but no in-memory token → try the HttpOnly cookie refresh
        try {
          const refreshRes = await authAPI.refreshToken();
          if (refreshRes.success && refreshRes.data?.accessToken) {
            setAccessToken(refreshRes.data.accessToken);
            try {
              const profileRes = await authAPI.getProfile();
              if (profileRes.success && profileRes.data) {
                setUserState(profileRes.data);
                setUserData(profileRes.data);
              } else {
                clearSession();
              }
            } catch {
              clearSession();
            }
          } else {
            clearSession();
          }
        } catch (err: unknown) {
          // 401 is expected when the refresh token has expired or is absent
          const status = (err as { response?: { status?: number } })?.response
            ?.status;
          if (status !== 401) console.error("Token refresh error:", err);
          clearSession();
        }
      } else {
        // We have an access token – try fetching profile
        try {
          const profileRes = await authAPI.getProfile();
          if (profileRes.success && profileRes.data) {
            setUserState(profileRes.data);
            setUserData(profileRes.data);
          } else {
            clearSession();
          }
        } catch {
          // Access token may be expired – try refresh once
          try {
            const refreshRes = await authAPI.refreshToken();
            if (refreshRes.success && refreshRes.data?.accessToken) {
              setAccessToken(refreshRes.data.accessToken);
              const retryRes = await authAPI.getProfile();
              if (retryRes.success && retryRes.data) {
                setUserState(retryRes.data);
                setUserData(retryRes.data);
              } else {
                clearSession();
              }
            } else {
              clearSession();
            }
          } catch {
            clearSession();
          }
        }
      }

      setLoading(false);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────

  const login = async (
    email: string,
    password: string,
    keepMeLoggedIn = false,
  ) => {
    const response = await authAPI.login({ email, password, keepMeLoggedIn });

    if (response.success) {
      const { user: userData, accessToken } = response.data;
      setAccessToken(accessToken);

      // Fetch full auth profile (includes role, isSuperAdmin, hasAccess, etc.)
      let userForNav = userData;
      try {
        const profileRes = await authAPI.getProfile();
        if (profileRes.success && profileRes.data) {
          userForNav = profileRes.data;
        }
      } catch {
        // use the login response user data as fallback
      }

      setUserState(userForNav);
      setUserData(userForNav);
      toast.success("Login successful!");
      await navigateAfterAuth(userForNav, router);
    }
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    avatarUrl?: string,
  ): Promise<{ requiresEmailVerification: boolean; email?: string } | void> => {
    const response = await authAPI.signup({
      email,
      password,
      fullName,
      avatarUrl,
      role: "candidate",
    });

    if (response.success) {
      if (response.data.requiresEmailVerification) {
        return { requiresEmailVerification: true, email };
      }

      // Edge case: backend returns tokens immediately (shouldn't happen for email flow)
      const { user: userData, accessToken } = response.data;
      if (userData && accessToken) {
        setAccessToken(accessToken);
        setUserState(userData);
        setUserData(userData);
        toast.success("Account created successfully!");
        await router.replace("/dashboard");
      }
    }
  };

  const googleAuth = async (idToken: string, keepMeLoggedIn = false) => {
    const response = await authAPI.googleLogin({
      idToken,
      keepMeLoggedIn,
      role: "candidate",
    });

    if (response.success) {
      const { user: userData, accessToken, isNewUser } = response.data;
      setAccessToken(accessToken);

      let userForNav = userData;
      try {
        const profileRes = await authAPI.getProfile();
        if (profileRes.success && profileRes.data) {
          userForNav = profileRes.data;
        }
      } catch {
        // use the google-auth response user data as fallback
      }

      setUserState(userForNav);
      setUserData(userForNav);
      toast.success(
        isNewUser
          ? "Account created successfully with Google!"
          : "Login successful with Google!",
      );
      await navigateAfterAuth(userForNav, router);
    }
  };

  /**
   * Called from the /auth/github-callback page after GitHub redirects back
   * with an access token in the query string.
   */
  const githubCallbackAuth = async (accessToken: string, isNewUser = false) => {
    setAccessToken(accessToken);

    let userForNav: User | null = null;
    try {
      const profileRes = await authAPI.getProfile();
      if (profileRes.success && profileRes.data) {
        userForNav = profileRes.data;
      }
    } catch {
      // profile fetch failed — clear bad token
      clearAccessToken();
      throw new Error("Failed to load user profile after GitHub login.");
    }

    if (!userForNav) {
      clearAccessToken();
      throw new Error("Failed to load user profile after GitHub login.");
    }

    setUserState(userForNav);
    setUserData(userForNav);
    toast.success(
      isNewUser
        ? "Account created successfully with GitHub!"
        : "Login successful with GitHub!",
    );
    await navigateAfterAuth(userForNav, router);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearSession();
      clearCachedProfile();
      // Return to the landing page (not the login page) so the user
      // lands on a public page and can choose to sign in again.
      await router.push("/");
    }
  };

  const handleSetUser = (u: User | null) => {
    setUserState(u);
    if (u) setUserData(u);
    else clearUserData();
  };

  // ── Context value ────────────────────────────────────────────────────────

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    setUser: handleSetUser,
    login,
    signup,
    googleAuth,
    githubCallbackAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

// ── Private helpers ──────────────────────────────────────────────────────────

function clearSession() {
  clearUserData();
  clearAccessToken();
}
