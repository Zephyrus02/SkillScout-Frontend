/**
 * SkillScout API client
 *
 * Axios instance with:
 * - Auth Bearer token injection via request interceptor
 * - Automatic token refresh on 401 via response interceptor
 * - withCredentials: true for HttpOnly refresh-token cookie
 *
 * All env vars use NEXT_PUBLIC_ prefix for Next.js client-side access.
 */

import axios, { type AxiosError } from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./token-storage";
import { clearUserData } from "./user-storage";

// Base URL — no trailing /api; we add /api per-route
const BASE_URL =
  (typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : undefined) || "http://localhost:5001";

const API_BASE = `${BASE_URL}/api`;

// ── Axios instance ──────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // required for HttpOnly refresh-token cookie
  headers: { "Content-Type": "application/json" },
});

// Inject access token on every request
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Refresh-token mutex ─────────────────────────────────────────────────────
// Prevents multiple concurrent 401s from all triggering a /auth/refresh call.
// The first request that gets a 401 performs the refresh; every other request
// that arrives while the refresh is in-flight queues a callback and waits.
let _isRefreshing = false;
type RefreshCallback = (newToken: string | null) => void;
let _refreshSubscribers: RefreshCallback[] = [];

function _subscribeTokenRefresh(cb: RefreshCallback) {
  _refreshSubscribers.push(cb);
}

function _notifyRefreshSubscribers(newToken: string | null) {
  _refreshSubscribers.forEach((cb) => cb(newToken));
  _refreshSubscribers = [];
}

// Auto-refresh access token on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    const isRefreshEndpoint = originalRequest?.url?.includes("/auth/refresh");
    const isAuthPage =
      typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/auth/") ||
        window.location.pathname === "/");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshEndpoint
    ) {
      originalRequest._retry = true;

      // If a refresh is already in progress, queue this request and wait.
      if (_isRefreshing) {
        return new Promise<ReturnType<typeof apiClient>>((resolve, reject) => {
          _subscribeTokenRefresh((newToken) => {
            if (newToken) {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              resolve(apiClient(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      _isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_BASE}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const { accessToken } = res.data.data;
        setAccessToken(accessToken);
        _isRefreshing = false;
        _notifyRefreshSubscribers(accessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch {
        _isRefreshing = false;
        _notifyRefreshSubscribers(null);
        clearAccessToken();
        clearUserData();
        if (!isAuthPage && typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

// ── Auth API ────────────────────────────────────────────────────────────────

export const authAPI = {
  /** POST /api/auth/signup */
  signup: async (data: {
    email: string;
    password: string;
    fullName: string;
    role?: string;
    avatarUrl?: string;
  }) => {
    const res = await apiClient.post("/auth/signup", {
      ...data,
      role: data.role ?? "candidate",
    });
    return res.data as {
      success: boolean;
      data: {
        requiresEmailVerification?: boolean;
        user?: User;
        accessToken?: string;
      };
      message?: string;
    };
  },

  /** POST /api/auth/login */
  login: async (data: {
    email: string;
    password: string;
    keepMeLoggedIn?: boolean;
  }) => {
    const res = await apiClient.post("/auth/login", data);
    return res.data as {
      success: boolean;
      data: { user: User; accessToken: string };
      message?: string;
    };
  },

  /**
   * POST /api/auth/google/login
   * Used for both login and signup via Google (backend handles new users).
   */
  googleLogin: async (data: {
    idToken: string;
    keepMeLoggedIn?: boolean;
    role?: string;
  }) => {
    const res = await apiClient.post("/auth/google/login", {
      ...data,
      role: data.role ?? "candidate",
    });
    return res.data as {
      success: boolean;
      data: { user: User; accessToken: string; isNewUser?: boolean };
      message?: string;
    };
  },

  /** POST /api/auth/logout */
  logout: async () => {
    const res = await apiClient.post("/auth/logout");
    return res.data;
  },

  /** POST /api/auth/refresh */
  refreshToken: async () => {
    const res = await apiClient.post("/auth/refresh");
    return res.data as {
      success: boolean;
      data: { accessToken: string };
    };
  },

  /** GET /api/auth/profile */
  getProfile: async () => {
    const res = await apiClient.get("/auth/profile");
    return res.data as { success: boolean; data: User };
  },

  /** PATCH /api/auth/profile */
  updateProfile: async (data: {
    name?: string;
    phone?: string;
    location?: string;
  }) => {
    const res = await apiClient.patch("/auth/profile", data);
    return res.data;
  },

  /** POST /api/auth/verify-email */
  verifyEmail: async (payload: { email?: string; token?: string }) => {
    try {
      const res = await apiClient.post("/auth/verify-email", payload);
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) throw err.response.data;
      throw err;
    }
  },

  /** POST /api/auth/resend-verification */
  resendVerification: async (email: string) => {
    const res = await apiClient.post("/auth/resend-verification", { email });
    return res.data;
  },
};

// ── Profile API ─────────────────────────────────────────────────────────────

export const profileAPI = {
  /** GET /api/profile/status */
  checkProfileStatus: async () => {
    const res = await apiClient.get("/profile/status");
    return res.data as {
      success: boolean;
      data: { hasCompletedProfile: boolean };
    };
  },

  /** GET /api/profile */
  getProfile: async () => {
    const res = await apiClient.get("/profile");
    return res.data;
  },
};

// ── Shared User type (mirrors backend AuthProfile response) ─────────────────

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: string;
  roles?: string[] | string;
  emailConfirmedAt: Date | null;
  lastSignInAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  rawUserMetaData?: unknown;
  rawAppMetaData?: unknown;
  waitlist?: boolean;
  hasAccess?: boolean;
  phone?: string;
  location?: string;
  isSuperAdmin?: boolean;
}
