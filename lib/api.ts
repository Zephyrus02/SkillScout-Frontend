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
import { isClientLogoutInProgress } from "./client-logout";

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
        if (
          !isAuthPage &&
          typeof window !== "undefined" &&
          !isClientLogoutInProgress()
        ) {
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

// ── Profile API types ────────────────────────────────────────────────────────

export interface ProfileHeader {
  name?: string;
  title?: string;
  location?: string;
  experience?: string;
  salary?: string;
  noticePeriod?: string;
  avatarUrl?: string | null;
}

export interface CareerProfile {
  primaryCareerGoal?: string;
  jobRole?: string;
  desiredEmploymentType?: string;
  preferredShift?: string;
  preferredWorkLocation?: string;
  expectedSalary?: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
}

export interface EmploymentEntry {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  desc?: string;
  salary?: string;
  noticePeriod?: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  desc?: string;
}

export interface PublicationEntry {
  id: string;
  title: string;
  publisher?: string;
  date?: string;
  url?: string;
  desc?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  doesExpire?: boolean;
  expiryDate?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface CareerDirection {
  careerLevel?: string;
  targetIndustries?: string[];
  targetRoles?: string[];
}

export interface FullProfile {
  profileId: string;
  userId: string;
  completionPercentage: number;
  header: ProfileHeader;
  career: CareerProfile;
  careerDirection: CareerDirection;
  education: EducationEntry[];
  employment: EmploymentEntry[];
  projects: ProjectEntry[];
  publications: PublicationEntry[];
  certifications: CertificationEntry[];
  skills: string[];
  socialLinks: SocialLinks;
  resumeUrl?: string | null;
  resumeFileName?: string | null;
  isPublicProfile: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Payments API ───────────────────────────────────────────────────────────

export interface Plan {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  amountMonthly: number;
  amountAnnual: number;
  currency: string;
  rateLimitTier: string;
  sortOrder: number;
}

export const paymentsAPI = {
  /** GET /api/payments/plans — list active plans (public) */
  getPlans: async () => {
    const res = await apiClient.get("/payments/plans");
    return res.data as { success: boolean; data: Plan[] };
  },

  /** POST /api/payments/create-order — create Razorpay order (one-time) or subscription */
  createOrder: async (
    planId: string,
    billingInterval: "monthly" | "annual",
    subscriptionType: "one_time" | "recurring",
  ) => {
    const res = await apiClient.post("/payments/create-order", {
      planId,
      billingInterval,
      subscriptionType,
    });
    return res.data as {
      success: boolean;
      data:
        | {
            orderId: string;
            keyId: string;
            currency: string;
            amountDisplay: string;
            subscriptionType: "one_time";
          }
        | {
            subscriptionId: string;
            keyId: string;
            currency: string;
            amountDisplay: string;
            subscriptionType: "recurring";
          };
    };
  },

  /** POST /api/payments/verify — verify Razorpay payment and grant access */
  verifyPayment: async (params: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    const res = await apiClient.post("/payments/verify", params);
    return res.data as {
      success: boolean;
      data: {
        hasAccess: boolean;
        alreadyProcessed?: boolean;
        /** Updated subscription returned from the backend to avoid a second round-trip */
        subscription: {
          id: string;
          planId: string;
          plan: Plan;
          status: string;
          billingInterval: string;
          currentPeriodStart: string;
          currentPeriodEnd: string;
          nextBillingAt: string | null;
          cancelAtPeriodEnd: boolean;
          cancelledAt: string | null;
          scheduledUpgrade: {
            id: string;
            plan: { id: string; name: string; slug: string };
            billingInterval: string;
            currentPeriodStart: string;
          } | null;
        } | null;
      };
      message: string;
    };
  },

  /** POST /api/payments/activate-free — grant access for Free/Basic plan (no payment) */
  activateFreePlan: async (planSlug?: "free" | "basic") => {
    const res = await apiClient.post("/payments/activate-free", {
      planSlug,
    });
    return res.data as { success: boolean; message: string };
  },

  /** POST /api/payments/activate-trial — activate Trial plan (14 days, no payment) */
  activateTrialPlan: async () => {
    const res = await apiClient.post("/payments/activate-trial");
    return res.data as { success: boolean; message: string };
  },

  /** GET /api/payments/subscription — current user's subscription (or null) */
  getSubscription: async () => {
    const res = await apiClient.get("/payments/subscription");
    return res.data as {
      success: boolean;
      data: {
        id: string;
        planId: string;
        plan: Plan;
        status: string;
        billingInterval: string;
        currentPeriodStart: string;
        currentPeriodEnd: string;
        nextBillingAt: string | null;
        cancelAtPeriodEnd: boolean;
        cancelledAt: string | null;
        /** Pending upgrade that will activate at the end of the current period */
        scheduledUpgrade: {
          id: string;
          plan: { id: string; name: string; slug: string };
          billingInterval: string;
          currentPeriodStart: string;
        } | null;
      } | null;
    };
  },

  /** GET /api/payments/invoices — list user's invoices */
  listInvoices: async (limit = 50, offset = 0) => {
    const res = await apiClient.get("/payments/invoices", {
      params: { limit, offset },
    });
    return res.data as {
      success: boolean;
      data: {
        id: string;
        invoiceNumber: string;
        planName: string;
        billingInterval: string;
        amountCents: number;
        currency: string;
        discountCents: number;
        paidAt: string;
        createdAt: string;
      }[];
    };
  },

  /** POST /api/payments/subscription/cancel — cancel subscription */
  cancelSubscription: async (cancelAtCycleEnd = true) => {
    const res = await apiClient.post("/payments/subscription/cancel", {
      cancelAtCycleEnd,
    });
    return res.data as {
      success: boolean;
      data: unknown;
      message: string;
    };
  },

  /**
   * Fetch invoice HTML and open in new tab for print/save as PDF.
   * Uses Bearer auth; creates blob URL for same-origin display.
   */
  openInvoiceInNewTab: async (invoiceId: string) => {
    const res = await apiClient.get(`/payments/invoices/${invoiceId}/html`, {
      responseType: "blob",
      headers: { Accept: "text/html" },
    });
    const blob = new Blob([res.data as Blob], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener");
    // Revoke after a delay to allow the new tab to load
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  },

  /**
   * Download invoice as PDF. Triggers a file save in the browser.
   */
  downloadInvoicePdf: async (invoiceId: string, invoiceNumber?: string) => {
    const res = await apiClient.get(`/payments/invoices/${invoiceId}/pdf`, {
      responseType: "blob",
      headers: { Accept: "application/pdf" },
    });
    const blob = new Blob([res.data as Blob], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoiceNumber ?? invoiceId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  },
};

// ── Onboarding API ─────────────────────────────────────────────────────────

export const onboardingAPI = {
  /** GET /api/onboarding/progress — get saved progress + hasAccess */
  getProgress: async () => {
    const res = await apiClient.get("/onboarding/progress");
    return res.data as {
      success: boolean;
      data: {
        currentStep: number;
        draftData: Record<string, unknown> | null;
        selectedPlan: string | null;
        paymentStatus: string | null;
        lastSavedAt: string;
        hasAccess: boolean;
      };
    };
  },

  /** PATCH /api/onboarding/progress — save progress */
  saveProgress: async (data: {
    flowType?: "candidate" | "recruiter";
    currentStep?: number;
    draftData?: Record<string, unknown>;
    selectedPlan?: string | null;
    paymentStatus?: string | null;
  }) => {
    const res = await apiClient.patch("/onboarding/progress", data);
    return res.data as { success: boolean; data: unknown };
  },

  /** DELETE /api/onboarding/progress — clear after completion */
  clearProgress: async () => {
    const res = await apiClient.delete("/onboarding/progress");
    return res.data as { success: boolean; message: string };
  },

  /** POST /api/onboarding/upload-file — upload profile picture or resume during onboarding */
  uploadFile: async (formData: FormData) => {
    const res = await apiClient.post("/onboarding/upload-file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data as {
      success: boolean;
      data: {
        profilePictureUrl?: string;
        profilePictureFileName?: string;
        resumeUrl?: string;
        resumeFileName?: string;
      };
    };
  },
};

// ── Contact API ──────────────────────────────────────────────────────────────

export const contactAPI = {
  /** POST /api/contact — public contact form submission (rate-limited) */
  submit: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const res = await apiClient.post("/contact", data);
    return res.data as {
      success: boolean;
      message: string;
      data?: unknown;
    };
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

  /** GET /api/profile  — full profile object */
  getFullProfile: async () => {
    const res = await apiClient.get("/profile");
    return res.data as { success: boolean; data: FullProfile };
  },

  /** POST /api/profile/setup  — multipart, one-shot wizard submit */
  setupProfile: async (formData: FormData) => {
    const res = await apiClient.post("/profile/setup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data as {
      success: boolean;
      data: {
        profileId: string;
        userId: string;
        completionPercentage: number;
        createdAt: string;
      };
    };
  },

  // ── Header ──────────────────────────────────────────────────────────────

  /** GET /api/profile/header */
  getHeader: async () => {
    const res = await apiClient.get("/profile/header");
    return res.data as { success: boolean; data: ProfileHeader };
  },

  /** PUT /api/profile/header */
  updateHeader: async (data: ProfileHeader) => {
    const res = await apiClient.put("/profile/header", data);
    return res.data as { success: boolean; data: ProfileHeader };
  },

  // ── Avatar ──────────────────────────────────────────────────────────────

  /** POST /api/profile/avatar  — multipart, field name: avatar */
  uploadAvatar: async (file: File) => {
    const fd = new FormData();
    fd.append("avatar", file);
    const res = await apiClient.post("/profile/avatar", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data as { success: boolean; data: { avatarUrl: string } };
  },

  /** DELETE /api/profile/avatar */
  deleteAvatar: async () => {
    const res = await apiClient.delete("/profile/avatar");
    return res.data as { success: boolean; message: string };
  },

  // ── Resume ──────────────────────────────────────────────────────────────

  /** POST /api/profile/resume  — multipart, field name: resume */
  uploadResume: async (file: File) => {
    const fd = new FormData();
    fd.append("resume", file);
    const res = await apiClient.post("/profile/resume", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data as {
      success: boolean;
      data: { resumeUrl: string; resumeFileName: string; uploadedAt: string };
    };
  },

  /** DELETE /api/profile/resume */
  deleteResume: async () => {
    const res = await apiClient.delete("/profile/resume");
    return res.data as { success: boolean; message: string };
  },

  /** GET /api/profile/resume/download-url — returns a short-lived signed URL for private bucket */
  getResumeDownloadUrl: async () => {
    const res = await apiClient.get("/profile/resume/download-url");
    return res.data as { success: boolean; data: { url: string } };
  },

  /** POST /api/profile/resume/parse — upload, parse with AI, return parsed data for autofill */
  parseResume: async (file: File) => {
    const fd = new FormData();
    fd.append("resume", file);
    const res = await apiClient.post("/profile/resume/parse", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data as {
      success: boolean;
      data: {
        resumeUrl: string;
        resumeFileName: string;
        parsedData: {
          name?: string;
          email?: string;
          phone?: string;
          location?: string;
          bio?: string;
          profileHeadline?: string;
          education: Array<{
            institution: string;
            degree: string;
            field: string;
            startDate?: string;
            endDate?: string;
          }>;
          experience: Array<{
            company: string;
            title: string;
            startDate?: string;
            endDate?: string;
            current?: boolean;
            description?: string;
          }>;
          skills: string[];
          certifications: Array<{
            name: string;
            issuer: string;
            issueDate?: string;
            expiryDate?: string;
          }>;
          languages: Array<{ name: string; proficiency?: string }>;
          careerLevel?: string;
          expectedSalary?: string;
        };
      };
    };
  },

  /** PATCH /api/profile/visibility — toggle public profile on/off */
  toggleVisibility: async (isPublicProfile: boolean) => {
    const res = await apiClient.patch("/profile/visibility", {
      isPublicProfile,
    });
    return res.data as { success: boolean; data: { isPublicProfile: boolean } };
  },

  // ── Career ──────────────────────────────────────────────────────────────

  /** GET /api/profile/career */
  getCareer: async () => {
    const res = await apiClient.get("/profile/career");
    return res.data as { success: boolean; data: CareerProfile };
  },

  /** PUT /api/profile/career */
  updateCareer: async (data: CareerProfile) => {
    const res = await apiClient.put("/profile/career", data);
    return res.data as { success: boolean; data: CareerProfile };
  },

  // ── Career Direction ────────────────────────────────────────────────────

  /** GET /api/profile/career-direction */
  getCareerDirection: async () => {
    const res = await apiClient.get("/profile/career-direction");
    return res.data as { success: boolean; data: CareerDirection };
  },

  /** PUT /api/profile/career-direction */
  updateCareerDirection: async (data: CareerDirection) => {
    const res = await apiClient.put("/profile/career-direction", data);
    return res.data as { success: boolean; data: CareerDirection };
  },

  // ── Education ───────────────────────────────────────────────────────────

  /** GET /api/profile/education */
  getEducation: async () => {
    const res = await apiClient.get("/profile/education");
    return res.data as { success: boolean; data: EducationEntry[] };
  },

  /** POST /api/profile/education */
  addEducation: async (data: Omit<EducationEntry, "id">) => {
    const res = await apiClient.post("/profile/education", data);
    return res.data as { success: boolean; data: EducationEntry };
  },

  /** PUT /api/profile/education/:id */
  updateEducation: async (id: string, data: Partial<EducationEntry>) => {
    const res = await apiClient.put(`/profile/education/${id}`, data);
    return res.data as { success: boolean; data: EducationEntry };
  },

  /** DELETE /api/profile/education/:id */
  deleteEducation: async (id: string) => {
    const res = await apiClient.delete(`/profile/education/${id}`);
    return res.data as { success: boolean; message: string };
  },

  // ── Employment ──────────────────────────────────────────────────────────

  /** GET /api/profile/employment */
  getEmployment: async () => {
    const res = await apiClient.get("/profile/employment");
    return res.data as { success: boolean; data: EmploymentEntry[] };
  },

  /** POST /api/profile/employment */
  addEmployment: async (data: Omit<EmploymentEntry, "id">) => {
    const res = await apiClient.post("/profile/employment", data);
    return res.data as { success: boolean; data: EmploymentEntry };
  },

  /** PUT /api/profile/employment/:id */
  updateEmployment: async (id: string, data: Partial<EmploymentEntry>) => {
    const res = await apiClient.put(`/profile/employment/${id}`, data);
    return res.data as { success: boolean; data: EmploymentEntry };
  },

  /** DELETE /api/profile/employment/:id */
  deleteEmployment: async (id: string) => {
    const res = await apiClient.delete(`/profile/employment/${id}`);
    return res.data as { success: boolean; message: string };
  },

  // ── Projects ────────────────────────────────────────────────────────────

  /** GET /api/profile/projects */
  getProjects: async () => {
    const res = await apiClient.get("/profile/projects");
    return res.data as { success: boolean; data: ProjectEntry[] };
  },

  /** POST /api/profile/projects */
  addProject: async (data: Omit<ProjectEntry, "id">) => {
    const res = await apiClient.post("/profile/projects", data);
    return res.data as { success: boolean; data: ProjectEntry };
  },

  /** PUT /api/profile/projects/:id */
  updateProject: async (id: string, data: Partial<ProjectEntry>) => {
    const res = await apiClient.put(`/profile/projects/${id}`, data);
    return res.data as { success: boolean; data: ProjectEntry };
  },

  /** DELETE /api/profile/projects/:id */
  deleteProject: async (id: string) => {
    const res = await apiClient.delete(`/profile/projects/${id}`);
    return res.data as { success: boolean; message: string };
  },

  // ── Publications ────────────────────────────────────────────────────────

  /** GET /api/profile/publications */
  getPublications: async () => {
    const res = await apiClient.get("/profile/publications");
    return res.data as { success: boolean; data: PublicationEntry[] };
  },

  /** POST /api/profile/publications */
  addPublication: async (data: Omit<PublicationEntry, "id">) => {
    const res = await apiClient.post("/profile/publications", data);
    return res.data as { success: boolean; data: PublicationEntry };
  },

  /** PUT /api/profile/publications/:id */
  updatePublication: async (id: string, data: Partial<PublicationEntry>) => {
    const res = await apiClient.put(`/profile/publications/${id}`, data);
    return res.data as { success: boolean; data: PublicationEntry };
  },

  /** DELETE /api/profile/publications/:id */
  deletePublication: async (id: string) => {
    const res = await apiClient.delete(`/profile/publications/${id}`);
    return res.data as { success: boolean; message: string };
  },

  // ── Certifications ──────────────────────────────────────────────────────

  /** GET /api/profile/certifications */
  getCertifications: async () => {
    const res = await apiClient.get("/profile/certifications");
    return res.data as { success: boolean; data: CertificationEntry[] };
  },

  /** POST /api/profile/certifications */
  addCertification: async (data: Omit<CertificationEntry, "id">) => {
    const res = await apiClient.post("/profile/certifications", data);
    return res.data as { success: boolean; data: CertificationEntry };
  },

  /** PUT /api/profile/certifications/:id */
  updateCertification: async (
    id: string,
    data: Partial<CertificationEntry>,
  ) => {
    const res = await apiClient.put(`/profile/certifications/${id}`, data);
    return res.data as { success: boolean; data: CertificationEntry };
  },

  /** DELETE /api/profile/certifications/:id */
  deleteCertification: async (id: string) => {
    const res = await apiClient.delete(`/profile/certifications/${id}`);
    return res.data as { success: boolean; message: string };
  },

  // ── Skills ──────────────────────────────────────────────────────────────

  /** GET /api/profile/skills */
  getSkills: async () => {
    const res = await apiClient.get("/profile/skills");
    return res.data as { success: boolean; data: { skills: string[] } };
  },

  /** PUT /api/profile/skills */
  updateSkills: async (skills: string[]) => {
    const res = await apiClient.put("/profile/skills", { skills });
    return res.data as {
      success: boolean;
      data: { skills: string[]; updatedAt: string };
    };
  },

  // ── Social Links ────────────────────────────────────────────────────────

  /** GET /api/profile/social-links */
  getSocialLinks: async () => {
    const res = await apiClient.get("/profile/social-links");
    return res.data as { success: boolean; data: SocialLinks };
  },

  /** PUT /api/profile/social-links */
  updateSocialLinks: async (data: SocialLinks) => {
    const res = await apiClient.put("/profile/social-links", data);
    return res.data as { success: boolean; data: SocialLinks };
  },
};

// ── Shared User type (mirrors backend AuthProfile response) ─────────────────

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  avatar?: string;
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
  onboardingCompleted?: boolean;
  phone?: string;
  location?: string;
  isSuperAdmin?: boolean;
}
