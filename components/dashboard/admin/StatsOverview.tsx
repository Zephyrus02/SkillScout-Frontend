import type { AdminStats } from "@/types";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  change?: string;
  positive?: boolean;
}

function StatCard({
  label,
  value,
  icon,
  change,
  positive = true,
}: StatCardProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
          <span className="material-icons text-xl">{icon}</span>
        </div>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              positive
                ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/20 text-red-500"
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-text-light dark:text-text-dark mb-1">
        {value}
      </div>
      <div className="text-sm text-subtext-light dark:text-subtext-dark">
        {label}
      </div>
    </div>
  );
}

interface AdminStatsOverviewProps {
  stats?: AdminStats;
}

export default function AdminStatsOverview({ stats }: AdminStatsOverviewProps) {
  const data = stats ?? {
    totalUsers: 0,
    activeUsers: 0,
    totalInterviews: 0,
    revenueThisMonth: 0,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Users"
        value={data.totalUsers.toLocaleString()}
        icon="group"
        change="+12%"
        positive
      />
      <StatCard
        label="Active Users"
        value={data.activeUsers.toLocaleString()}
        icon="person_check"
        change="+8%"
        positive
      />
      <StatCard
        label="Total Interviews"
        value={data.totalInterviews.toLocaleString()}
        icon="assignment"
        change="+24%"
        positive
      />
      <StatCard
        label="Revenue (Month)"
        value={`$${data.revenueThisMonth.toLocaleString()}`}
        icon="payments"
        change="+18%"
        positive
      />
    </div>
  );
}
