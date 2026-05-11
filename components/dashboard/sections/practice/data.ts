// Types and constants for the Practice section

export type InterviewTypeId =
  | "technical"
  | "behavioral"
  | "hr-screening"
  | "full-loop";

export const INTERVIEW_TYPES: {
  id: InterviewTypeId;
  label: string;
  icon: string;
}[] = [
  { id: "technical", label: "Technical", icon: "code" },
  { id: "behavioral", label: "Behavioral", icon: "psychology" },
  { id: "hr-screening", label: "HR Screening", icon: "groups" },
  { id: "full-loop", label: "Full Loop", icon: "all_inclusive" },
];

export const DIFFICULTY_LABELS = ["Junior", "Mid-Level", "Senior/Staff"];
export const DIFFICULTY_BADGE = [
  "bg-green-50 text-green-600",
  "bg-yellow-50 text-yellow-600",
  "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
];

export const PERSONAS = [
  {
    id: "strict",
    label: "Strict & Formal",
    desc: "Minimal hints, professional tone.",
    emoji: "🧐",
  },
  {
    id: "neutral",
    label: "Professional & Neutral",
    desc: "Standard interview experience.",
    emoji: "👔",
  },
  {
    id: "friendly",
    label: "Friendly & Helpful",
    desc: "Offers hints and encouragement.",
    emoji: "🤝",
  },
];

// Plan tier: trial/lite → "lite" (shorter); pro/elite → "pro" (longer)
export type PlanTier = "lite" | "pro";

export interface SessionSection {
  name: string;
  targetMinutes: number;
}

// Mirrors INTERVIEW_STRUCTURES from ai-agent/src/interview-types/schema.ts
export const PLAN_INTERVIEW_STRUCTURES: Record<
  InterviewTypeId,
  { lite: SessionSection[]; pro: SessionSection[] }
> = {
  technical: {
    lite: [
      { name: "Warm-up", targetMinutes: 5 },
      { name: "Core Technical", targetMinutes: 25 },
      { name: "Problem Solving", targetMinutes: 10 },
      { name: "Wrap-up", targetMinutes: 5 },
    ],
    pro: [
      { name: "Warm-up", targetMinutes: 5 },
      { name: "Core Technical", targetMinutes: 25 },
      { name: "System Design", targetMinutes: 20 },
      { name: "Problem Solving", targetMinutes: 5 },
      { name: "Wrap-up", targetMinutes: 5 },
    ],
  },
  behavioral: {
    lite: [
      { name: "Introduction", targetMinutes: 3 },
      { name: "Behavioral Questions", targetMinutes: 22 },
      { name: "Wrap-up", targetMinutes: 5 },
    ],
    pro: [
      { name: "Introduction", targetMinutes: 3 },
      { name: "Behavioral Questions", targetMinutes: 35 },
      { name: "Wrap-up", targetMinutes: 7 },
    ],
  },
  "hr-screening": {
    lite: [
      { name: "Introduction", targetMinutes: 5 },
      { name: "Background", targetMinutes: 15 },
      { name: "Role Fit", targetMinutes: 7 },
      { name: "Wrap-up", targetMinutes: 3 },
    ],
    pro: [
      { name: "Introduction", targetMinutes: 5 },
      { name: "Background", targetMinutes: 20 },
      { name: "Role Fit", targetMinutes: 15 },
      { name: "Wrap-up", targetMinutes: 5 },
    ],
  },
  "full-loop": {
    lite: [
      { name: "Introduction", targetMinutes: 5 },
      { name: "Technical", targetMinutes: 25 },
      { name: "Behavioral", targetMinutes: 20 },
      { name: "Role Fit", targetMinutes: 7 },
      { name: "Wrap-up", targetMinutes: 3 },
    ],
    pro: [
      { name: "Introduction", targetMinutes: 5 },
      { name: "Technical", targetMinutes: 35 },
      { name: "System Design", targetMinutes: 20 },
      { name: "Behavioral", targetMinutes: 20 },
      { name: "Role Fit", targetMinutes: 7 },
      { name: "Wrap-up", targetMinutes: 3 },
    ],
  },
};

export function getPlanTier(planSlug: string | null | undefined): PlanTier {
  return planSlug === "pro" || planSlug === "elite" ? "pro" : "lite";
}

export function getSessionSections(
  interviewType: InterviewTypeId,
  planSlug: string | null | undefined,
): SessionSection[] {
  const tier = getPlanTier(planSlug);
  return PLAN_INTERVIEW_STRUCTURES[interviewType][tier];
}

export function getTotalDuration(sections: SessionSection[]): number {
  return sections.reduce((sum, s) => sum + s.targetMinutes, 0);
}
