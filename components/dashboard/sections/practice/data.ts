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

export const DURATIONS = [15, 30, 45];

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

export const SESSION_STEPS = [
  { title: "Introduction", meta: "2 mins • Elevator Pitch", note: null },
  {
    title: "Technical Deep Dive",
    meta: "25 mins • System Design & Algo",
    note: "Focus: Scalability & Database Choice",
  },
  { title: "Behavioral Questions", meta: "10 mins • STAR Method", note: null },
  { title: "Q&A / Feedback", meta: "8 mins • Wrap up", note: null },
];
