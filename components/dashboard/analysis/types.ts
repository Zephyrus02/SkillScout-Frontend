// Types for the Analysis page

export interface TechItem {
  id: string;
  status: "pass" | "warn";
  title: string;
  detail: string;
}

export interface ImprovementCard {
  priority: "High" | "Medium" | "Low";
  priorityColor: string;
  borderColor: string;
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  actionIcon: string;
}
