import { apiClient } from "./client";
import type { ApiResponse, PaginatedResponse, Interview } from "@/types";

interface CreateInterviewPayload {
  title: string;
  type: Interview["type"];
}

interface SubmitAnswersPayload {
  answers: Record<string, string>;
}

export const interviewsApi = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get<PaginatedResponse<Interview>>(
      `/api/interviews?page=${page}&limit=${limit}`,
    ),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Interview>>(`/api/interviews/${id}`),

  create: (payload: CreateInterviewPayload) =>
    apiClient.post<ApiResponse<Interview>>("/api/interviews", payload),

  submit: (id: string, payload: SubmitAnswersPayload) =>
    apiClient.post<ApiResponse<Interview>>(
      `/api/interviews/${id}/submit`,
      payload,
    ),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/interviews/${id}`),
};
