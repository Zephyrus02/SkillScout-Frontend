import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Headset,
  TrendingUp,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";

const revenueData = [
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

const recentTransactions = [
  {
    name: "Sarah Jenkins",
    plan: "Pro Annual",
    amount: "$299.00",
    status: "SUCCESS" as const,
    date: "Oct 24, 2024",
  },
  {
    name: "Michael Chen",
    plan: "Elite Monthly",
    amount: "$49.00",
    status: "PENDING" as const,
    date: "Oct 24, 2024",
  },
  {
    name: "David Smith",
    plan: "Starter",
    amount: "$19.00",
    status: "FAILED" as const,
    date: "Oct 23, 2024",
  },
];

const stats = [
  {
    title: "Total Active Users",
    value: "24,592",
    trend: "+12%",
    icon: Users,
    iconClass: "bg-blue-50 text-blue-600",
    trendClass: "bg-green-50 text-green-600",
  },
  {
    title: "Interviews (Month)",
    value: "8,140",
    trend: "+5%",
    icon: Video,
    iconClass: "bg-purple-50 text-purple-600",
    trendClass: "bg-green-50 text-green-600",
  },
  {
    title: "Total Revenue",
    value: "$892,300",
    trend: "+8.5%",
    icon: DollarSign,
    iconClass: "bg-emerald-50 text-emerald-600",
    trendClass: "bg-green-50 text-green-600",
  },
  {
    title: "Pending Support",
    value: "14",
    trend: "Urgent",
    icon: Headset,
    iconClass: "bg-red-50 text-red-600",
    trendClass: "bg-red-50 text-red-600",
  },
] as const;

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || (user && user.role !== "admin")) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Admin Dashboard – SkillScout</title>
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-background-dark dark:text-text-dark">
        <AdminSidebar activeTab="dashboard" userName={user?.name} />

        <main className="p-6 lg:ml-64 lg:p-10">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-3xl font-bold">Admin Overview</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Real-time platform insights and moderation queue.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                System Operational
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300"
              >
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-surface-dark"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className={`rounded-lg p-2 ${card.iconClass}`}>
                      <Icon size={18} />
                    </div>
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${card.trendClass}`}
                    >
                      {card.trend}
                    </span>
                  </div>
                  <p className="mb-1 text-sm text-slate-500">{card.title}</p>
                  <p className="text-3xl font-bold leading-none tracking-tight font-heading">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Revenue Growth Area Chart */}
            <section
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2 dark:border-slate-800 dark:bg-surface-dark flex flex-col"
              style={{ minHeight: "400px" }}
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Revenue Growth</h2>
                  <p className="text-xs text-slate-500">
                    Trends over the last 12 months
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    Year 2024
                  </span>
                </div>
              </div>

              <div className="relative w-full flex-1 min-h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                      width={50}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "none",
                        borderRadius: "8px",
                        color: "#f8fafc",
                        fontSize: 12,
                      }}
                      itemStyle={{ color: "#f8fafc" }}
                      formatter={(v) => [
                        `$${(v as number).toLocaleString()}`,
                        "Revenue",
                      ]}
                      cursor={{
                        stroke: "#3b82f6",
                        strokeWidth: 1,
                        strokeDasharray: "4 4",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fill="url(#revenueGradient)"
                      dot={false}
                      activeDot={{ r: 5, fill: "#3b82f6" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Recent Transactions sidebar */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-surface-dark overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Recent Transactions
                </h3>
                <button
                  type="button"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTransactions.map((tx) => {
                  const statusConfig = {
                    SUCCESS: {
                      icon: CheckCircle2,
                      cls: "text-emerald-500",
                      bg: "bg-emerald-50 text-emerald-600",
                    },
                    PENDING: {
                      icon: Clock,
                      cls: "text-amber-500",
                      bg: "bg-amber-50 text-amber-600",
                    },
                    FAILED: {
                      icon: XCircle,
                      cls: "text-red-500",
                      bg: "bg-red-50 text-red-600",
                    },
                  }[tx.status];
                  const StatusIcon = statusConfig.icon;
                  return (
                    <div
                      key={tx.name + tx.date}
                      className="flex items-center gap-3 px-5 py-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {tx.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                          {tx.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {tx.plan}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {tx.amount}
                        </p>
                        <span
                          className={`mt-0.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${statusConfig.bg}`}
                        >
                          <StatusIcon size={10} />
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-slate-400 text-center">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
