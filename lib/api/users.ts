import { apiClient } from "./client";
import type { ApiResponse, PaginatedResponse, User } from "@/types";

export const usersApi = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get<PaginatedResponse<User>>(
      `/api/users?page=${page}&limit=${limit}`,
    ),

  getById: (id: string) => apiClient.get<ApiResponse<User>>(`/api/users/${id}`),

  updateProfile: (id: string, data: Partial<Omit<User, "id" | "createdAt">>) =>
    apiClient.put<ApiResponse<User>>(`/api/users/${id}`, data),

  deleteUser: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/users/${id}`),
};
