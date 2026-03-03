import type { TechItem, ImprovementCard } from "./types";

export const TECH_ITEMS: TechItem[] = [
  {
    id: "arch",
    status: "pass",
    title: "React Component Architecture",
    detail:
      "Excellent separation of concerns. You correctly identified the need for a custom hook to handle the API logic, keeping the UI component clean. The use of useMemo for the expensive calculation was spot on.",
  },
  {
    id: "state",
    status: "warn",
    title: "State Management (Redux/Context)",
    detail:
      "While your solution worked, using global state for a localized form modal was overkill. Consider keeping state local or lifting it up one level instead of adding complexity with a global store.",
  },
  {
    id: "scale",
    status: "pass",
    title: "System Design: Scalability",
    detail:
      "Good discussion on caching strategies (CDN + Redis). You proactively addressed potential bottlenecks in the database layer.",
  },
];

export const IMPROVEMENT_CARDS: ImprovementCard[] = [
  {
    priority: "High",
    priorityColor: "text-purple-600",
    borderColor: "border-l-purple-500",
    icon: "code",
    title: "Master State Patterns",
    description:
      'Review "Prop Drilling vs Context vs Redux" patterns. Focus on when not to use global state.',
    actionLabel: "View Resources",
    actionIcon: "arrow_forward",
  },
  {
    priority: "Medium",
    priorityColor: "text-amber-500",
    borderColor: "border-l-amber-500",
    icon: "timer",
    title: "Concise Communication",
    description:
      "Practice the STAR method strictly limiting answers to 2 minutes for behavioral questions.",
    actionLabel: "Start Drill",
    actionIcon: "play_circle",
  },
  {
    priority: "Low",
    priorityColor: "text-emerald-500",
    borderColor: "border-l-emerald-500",
    icon: "dns",
    title: "Database Sharding",
    description:
      "Deep dive into database sharding strategies to bolster your system design answers.",
    actionLabel: "Read Article",
    actionIcon: "article",
  },
];
