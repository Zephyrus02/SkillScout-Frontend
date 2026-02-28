// ─── Auth ──────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  createdAt: string;
}

// ─── Interviews ────────────────────────────────────────────────────────────
export interface Interview {
  id: string;
  userId: string;
  title: string;
  type: "technical" | "behavioral" | "system-design";
  status: "pending" | "in-progress" | "completed" | "cancelled";
  score?: number;
  feedback?: string;
  durationMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Analytics ─────────────────────────────────────────────────────────────
export interface UserStats {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  streak: number;
  rank?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalInterviews: number;
  revenueThisMonth: number;
}

// ─── API Helpers ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
