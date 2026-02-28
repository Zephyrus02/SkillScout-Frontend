import { apiClient } from "./client";
import type { ApiResponse, User } from "@/types";

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>("/api/auth/login", payload),

  signup: (payload: SignupPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>("/api/auth/signup", payload),

  logout: () => apiClient.post<ApiResponse<null>>("/api/auth/logout", {}),

  getMe: () => apiClient.get<ApiResponse<User>>("/api/auth/me"),

  refreshToken: () =>
    apiClient.post<ApiResponse<{ token: string }>>("/api/auth/refresh", {}),
};
