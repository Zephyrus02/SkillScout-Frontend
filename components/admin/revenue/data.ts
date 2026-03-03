// ─── Revenue Page Data ─────────────────────────────────────────────────────

export const revenueGrowthData = [
  { month: "Jan", revenue: 65000 },
  { month: "Feb", revenue: 72000 },
  { month: "Mar", revenue: 68000 },
  { month: "Apr", revenue: 78000 },
  { month: "May", revenue: 85000 },
  { month: "Jun", revenue: 92000 },
  { month: "Jul", revenue: 98000 },
  { month: "Aug", revenue: 105000 },
  { month: "Sep", revenue: 112000 },
  { month: "Oct", revenue: 108000 },
  { month: "Nov", revenue: 118000 },
  { month: "Dec", revenue: 124500 },
];

export const subscriptionData = [
  { name: "Starter", value: 45, color: "#3B82F6" },
  { name: "Pro", value: 35, color: "#6366F1" },
  { name: "Elite", value: 20, color: "#94A3B8" },
];

export type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED";

export interface Transaction {
  name: string;
  plan: string;
  amount: string;
  status: TransactionStatus;
  date: string;
}

export const transactions: Transaction[] = [
  {
    name: "Sarah Jenkins",
    plan: "Pro Annual",
    amount: "$299.00",
    status: "SUCCESS",
    date: "Oct 24, 2024",
  },
  {
    name: "Michael Chen",
    plan: "Elite Monthly",
    amount: "$49.00",
    status: "PENDING",
    date: "Oct 24, 2024",
  },
  {
    name: "David Smith",
    plan: "Starter Monthly",
    amount: "$19.00",
    status: "FAILED",
    date: "Oct 23, 2024",
  },
  {
    name: "Emily Davis",
    plan: "Pro Annual",
    amount: "$299.00",
    status: "SUCCESS",
    date: "Oct 22, 2024",
  },
  {
    name: "James Wilson",
    plan: "Elite Annual",
    amount: "$490.00",
    status: "SUCCESS",
    date: "Oct 21, 2024",
  },
];

export interface Renewal {
  date: string;
  company: string;
  plan: string;
  amount: string;
}

export const renewals: Renewal[] = [
  {
    date: "OCT\n28",
    company: "Acme Corp",
    plan: "Elite Plan",
    amount: "$4,990",
  },
  {
    date: "OCT\n30",
    company: "Global Tech",
    plan: "Pro Plan",
    amount: "$1,200",
  },
  {
    date: "NOV\n02",
    company: "Studio Flux",
    plan: "Starter Plan",
    amount: "$190",
  },
];

export const STATUS_CONFIG: Record<
  TransactionStatus,
  { label: string; cls: string }
> = {
  SUCCESS: { label: "SUCCESS", cls: "bg-emerald-500/10 text-emerald-500" },
  PENDING: { label: "PENDING", cls: "bg-amber-500/10 text-amber-500" },
  FAILED: { label: "FAILED", cls: "bg-rose-500/10 text-rose-500" },
};
