import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Bot, Briefcase, Calendar, Download, Star, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import { isAdminUser, useAuth } from "@/contexts/AuthContext";

const skillsData = [
  { skill: "Algorithms", junior: 65, senior: 85 },
  { skill: "System Design", junior: 50, senior: 90 },
  { skill: "Data Structures", junior: 70, senior: 80 },
  { skill: "Behavioral", junior: 60, senior: 75 },
  { skill: "Database", junior: 55, senior: 88 },
  { skill: "Networking", junior: 45, senior: 70 },
];

const companiesData = [
  { name: "Google", value: 1200, active: false },
  { name: "Amazon", value: 1150, active: false },
  { name: "Meta", value: 980, active: false },
  { name: "Netflix", value: 650, active: true },
  { name: "Microsoft", value: 890, active: false },
  { name: "Apple", value: 720, active: false },
];

const cohortData = [
  {
    cohort: "Jan 01 - Jan 07",
    users: 420,
    weeks: [98, 75, 62, 58, 50, 48, 45, 42],
  },
  {
    cohort: "Jan 08 - Jan 14",
    users: 385,
    weeks: [100, 78, 65, 60, 54, 51, 46, null],
  },
  {
    cohort: "Jan 15 - Jan 21",
    users: 450,
    weeks: [99, 80, 68, 64, 58, 55, null, null],
  },
  {
    cohort: "Jan 22 - Jan 28",
    users: 512,
    weeks: [100, 82, 70, 68, 59, null, null, null],
  },
];

function getCohortCellClass(value: number | null): string {
  if (value === null) return "";
  if (value >= 90) return "bg-blue-600 text-white";
  if (value >= 70) return "bg-blue-500 text-white";
  if (value >= 55) return "bg-blue-400 text-white";
  if (value >= 47) return "bg-blue-300 text-white";
  return "bg-blue-200 text-blue-800";
}

const topStats = [
  {
    icon: Users,
    iconClass: "bg-blue-50 text-blue-600",
    trend: "+12.5%",
    trendClass: "bg-green-50 text-green-600",
    value: "2,845",
    label: "Total Active Users",
  },
  {
    icon: Bot,
    iconClass: "bg-purple-50 text-purple-600",
    trend: "+5.2%",
    trendClass: "bg-green-50 text-green-600",
    value: "14,302",
    label: "AI Interviews Conducted",
  },
  {
    icon: Star,
    iconClass: "bg-orange-50 text-orange-600",
    trend: "+0.8%",
    trendClass: "bg-green-50 text-green-600",
    value: "4.8/5.0",
    label: "Avg. User Satisfaction",
  },
  {
    icon: Briefcase,
    iconClass: "bg-green-50 text-green-600",
    trend: "+24 Offers",
    trendClass: "bg-green-50 text-green-600",
    value: "186",
    label: "Reported Job Offers",
  },
] as const;

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !isAdminUser(user)) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || (user && !isAdminUser(user))) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Admin Platform Analytics – SkillScout</title>
      </Head>

      <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-background-dark dark:text-text-dark">
        <AdminSidebar activeTab="analytics" userName={user?.name} />

        <main className="p-6 lg:ml-64 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Platform Analytics
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Deep-dive into global user performance and AI accuracy metrics.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-dark"
              >
                <Calendar size={15} />
                Last 30 Days
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600"
              >
                <Download size={15} />
                Export Report
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {topStats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-surface-dark"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className={`rounded-lg p-2 ${item.iconClass}`}>
                      <Icon size={20} />
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${item.trendClass}`}
                    >
                      {item.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{item.label}</p>
                </div>
              );
            })}
          </div>

          {/* Main 4-column grid */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Global User Skills — col-span-2 row-span-2 */}
            <section className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-dark lg:col-span-2 lg:row-span-2">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Global User Skills
                  </h3>
                  <p className="text-xs text-slate-500">
                    Average proficiency across all active users
                  </p>
                </div>
              </div>

              <div className="min-h-0 flex-1">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart
                    data={skillsData}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                  >
                    <PolarGrid stroke="rgba(0,0,0,0.05)" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                    />
                    <Radar
                      name="Senior Level"
                      dataKey="senior"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      strokeWidth={3}
                    />
                    <Radar
                      name="Junior Level"
                      dataKey="junior"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.2}
                      strokeWidth={3}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "none",
                        borderRadius: "8px",
                        color: "#f8fafc",
                        fontSize: 12,
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="mt-4 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Senior Level
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Junior Level
                  </span>
                </div>
              </div>
            </section>

            {/* Popular Target Companies — top right */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-dark lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Popular Target Companies
                </h3>
                <p className="text-xs text-slate-500">
                  Where users are practicing to apply
                </p>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={companiesData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="2 4"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
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
                      cursor={{ fill: "rgba(59,130,246,0.05)" }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {companiesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.active ? "#8b5cf6" : "#3b82f6"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* AI Accuracy Feedback — bottom right (dark card) */}
            <section className="relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-sm lg:col-span-2">
              {/* Decorative glows */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                      <span className="text-purple-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 8V4H8" />
                          <rect width="16" height="12" x="4" y="8" rx="2" />
                          <path d="M2 14h2" />
                          <path d="M20 14h2" />
                          <path d="M15 13v2" />
                          <path d="M9 13v2" />
                        </svg>
                      </span>
                      AI Accuracy Feedback
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      User agreement with AI-generated interview scores
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    92% Positive
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-4">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center backdrop-blur-sm">
                    <span className="block text-2xl font-bold text-green-400">
                      85%
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      Agreed
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center backdrop-blur-sm">
                    <span className="block text-2xl font-bold text-yellow-400">
                      12%
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      Neutral
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center backdrop-blur-sm">
                    <span className="block text-2xl font-bold text-red-400">
                      3%
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      Disagreed
                    </span>
                  </div>
                </div>

                {/* Segmented progress bar */}
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-700/50">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: "85%" }}
                  />
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: "12%" }}
                  />
                  <div className="h-full bg-red-500" style={{ width: "3%" }} />
                </div>
                <p className="mt-2 text-center text-xs text-gray-400">
                  Based on 5,200 feedback submissions this month
                </p>
              </div>
            </section>
          </div>

          {/* User Retention Cohorts — full width */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  User Retention Cohorts
                </h3>
                <p className="text-xs text-slate-500">
                  Weekly retention rates over the last 8 weeks
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="h-3 w-3 rounded-sm bg-blue-200" />
                  &lt; 20%
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="h-3 w-3 rounded-sm bg-blue-300" />
                  20–50%
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="h-3 w-3 rounded-sm bg-blue-600" />
                  &gt; 50%
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
                    <th className="rounded-l-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
                      Cohort
                    </th>
                    <th className="bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
                      Users
                    </th>
                    {[
                      "Week 1",
                      "Week 2",
                      "Week 3",
                      "Week 4",
                      "Week 5",
                      "Week 6",
                      "Week 7",
                      "Week 8",
                    ].map((w) => (
                      <th
                        key={w}
                        className="bg-slate-50 px-2 py-3 text-center last:rounded-r-lg dark:bg-slate-800/50"
                      >
                        {w}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cohortData.map((row) => (
                    <tr key={row.cohort}>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        {row.cohort}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{row.users}</td>
                      {row.weeks.map((val, wi) => (
                        <td key={wi} className="px-2 py-3 text-center">
                          {val !== null ? (
                            <div
                              className={`mx-auto w-10 rounded py-1 text-xs ${getCohortCellClass(val)}`}
                            >
                              {val}%
                            </div>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
