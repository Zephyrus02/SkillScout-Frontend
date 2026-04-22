export type InterviewType =
  | "TECHNICAL"
  | "BEHAVIORAL"
  | "HR_SCREENING"
  | "FULL_LOOP";

export const INTERVIEW_TYPES = [
  {
    type: "HR_SCREENING" as InterviewType,
    label: "HR Screening",
    duration: "15–30 min",
    cost: 50,
    description: "Culture fit, background, and role expectations",
  },
  {
    type: "BEHAVIORAL" as InterviewType,
    label: "Behavioral",
    duration: "30–45 min",
    cost: 60,
    description: "Situational and competency-based questions",
  },
  {
    type: "TECHNICAL" as InterviewType,
    label: "Technical",
    duration: "45–60 min",
    cost: 75,
    description: "Coding, system design, and technical depth",
  },
  {
    type: "FULL_LOOP" as InterviewType,
    label: "Full Loop",
    duration: "60–90 min",
    cost: 100,
    description: "End-to-end simulation covering all interview stages",
  },
] as const;
