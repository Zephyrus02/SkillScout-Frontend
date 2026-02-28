import type { UserStats } from "@/types";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  accent?: string;
}

function StatCard({
  label,
  value,
  icon,
  trend,
  accent = "blue",
}: StatCardProps) {
  const accentMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentMap[accent]}`}
        >
          <span className="material-icons text-xl">{icon}</span>
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
            {trend}
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

interface StatsOverviewProps {
  stats?: UserStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const data = stats ?? {
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    streak: 0,
    rank: "—",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Interviews"
        value={data.totalInterviews}
        icon="assignment"
        accent="blue"
      />
      <StatCard
        label="Completed"
        value={data.completedInterviews}
        icon="check_circle"
        accent="green"
        trend="+3 this week"
      />
      <StatCard
        label="Avg. Score"
        value={`${data.averageScore}/100`}
        icon="star"
        accent="orange"
      />
      <StatCard
        label="Day Streak"
        value={`${data.streak} days`}
        icon="local_fire_department"
        accent="purple"
      />
    </div>
  );
}
