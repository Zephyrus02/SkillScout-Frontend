import { apiClient } from "./client";
import type { ApiResponse, PaginatedResponse, Interview } from "@/types";
import type { InterviewType } from "@/lib/credits";

interface CreateInterviewPayload {
  title: string;
  type: Interview["type"];
}

interface SubmitAnswersPayload {
  answers: Record<string, string>;
}

export interface CreditsBalance {
  creditsUsed: number;
  creditsRemaining: number;
  creditAllowance: number;
  bonusCredits: number;
  totalAllowance: number;
  periodEnd: string | null;
}

/** Create a mock interview session (LiveKit voice agent). Returns token + livekitUrl for one-shot connect. */
export interface CreateSessionPayload {
  interviewType?: InterviewType;
  jobRole: string;
  jobDescription?: string;
  experienceLevel?: string | null;
  companyName?: string | null;
  skills?: string[] | null;
  focusAreas?: string[] | null;
  jobProfileId?: string | null;
}

export interface CreateSessionResponse {
  success: boolean;
  data: {
    id: string;
    sessionId: string;
    roomName: string;
    agentName: string;
    token: string;
    livekitUrl: string;
    status: string;
    jobRole: string;
    jobDescription?: string;
    experienceLevel?: string | null;
    companyName?: string | null;
    skills?: string[] | null;
    focusAreas?: string[] | null;
    createdAt: string;
  };
}

/** Join an existing session (get a fresh LiveKit token). */
export interface JoinSessionResponse {
  success: boolean;
  data: {
    token: string;
    livekitUrl: string;
    roomName: string;
    agentName: string;
  };
}

export interface VideoSignalItem {
  turnId?: string | null;
  windowStart?: string | null;
  faceVisiblePct?: number | null;
  avgGazeScore?: number | null;
  avgHeadPitch?: number | null;
  lookingDownPct?: number | null;
  avgEyeBlink?: number | null;
  avgBrowFurrow?: number | null;
  avgMouthSmile?: number | null;
  avgJawOpen?: number | null;
  shoulderAlign?: number | null;
  forwardLean?: number | null;
}

export const interviewSessionsApi = {
  getCredits: () =>
    apiClient.get<{ success: boolean; data: CreditsBalance }>(
      "/api/interviews/credits",
    ),

  createSession: (payload: CreateSessionPayload) =>
    apiClient.post<CreateSessionResponse>("/api/interviews", payload),

  joinSession: (sessionId: string, participantName?: string) =>
    apiClient.post<JoinSessionResponse>(`/api/interviews/${sessionId}/join`, {
      participantName,
    }),

  postVideoSignals: (
    sessionId: string,
    payload: { signals: VideoSignalItem[]; turnId?: string | null },
  ) =>
    apiClient.post<{ success: boolean }>(
      `/api/interviews/${sessionId}/video-signals`,
      payload,
    ),

  getReport: (sessionId: string) =>
    apiClient.get<ApiResponse<unknown>>(`/api/interviews/${sessionId}/report`),

  getImprovement: () =>
    apiClient.get<ApiResponse<{ sessions: unknown[]; mem0Context: string }>>(
      "/api/interviews/improvement",
    ),
};

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
