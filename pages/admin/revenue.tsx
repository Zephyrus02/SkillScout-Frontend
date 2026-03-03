import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Bell, MoreVertical, Search } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import { isAdminUser, useAuth } from "@/contexts/AuthContext";

// ─── Data ─────────────────────────────────────────────────────────────────────

const revenueGrowthData = [
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

const subscriptionData = [
  { name: "Starter", value: 45, color: "#3B82F6" },
  { name: "Pro", value: 35, color: "#6366F1" },
  { name: "Elite", value: 20, color: "#94A3B8" },
];

const transactions = [
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
    plan: "Starter Monthly",
    amount: "$19.00",
    status: "FAILED" as const,
    date: "Oct 23, 2024",
  },
  {
    name: "Emily Davis",
    plan: "Pro Annual",
    amount: "$299.00",
    status: "SUCCESS" as const,
    date: "Oct 22, 2024",
  },
  {
    name: "James Wilson",
    plan: "Elite Annual",
    amount: "$490.00",
    status: "SUCCESS" as const,
    date: "Oct 21, 2024",
  },
];

const renewals = [
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

const STATUS_CONFIG = {
  SUCCESS: { label: "SUCCESS", cls: "bg-emerald-500/10 text-emerald-500" },
  PENDING: { label: "PENDING", cls: "bg-amber-500/10 text-amber-500" },
  FAILED: { label: "FAILED", cls: "bg-rose-500/10 text-rose-500" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminRevenuePage() {
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
        <title>Revenue & Billing – SkillScout Admin</title>
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-background-dark dark:text-white">
        <AdminSidebar activeTab="revenue" userName={user?.name} />

        <main className="lg:ml-64">
          {/* ── Sticky header ── */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/80">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Revenue &amp; Billing
              </h2>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                LIVE DATA
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-64 rounded-xl border-0 bg-slate-100 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800"
                />
              </div>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                <Bell size={16} />
              </button>
            </div>
          </header>

          {/* ── Body ── */}
          <div className="space-y-6 p-8">
            {/* KPI cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* MRR */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Monthly Recurring Revenue
                  </span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500">
                    +12%
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-bold">$124,500</h3>
                  {/* Mini sparkline */}
                  <div className="flex h-8 items-end gap-0.5">
                    {[50, 75, 66, 100, 83].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-emerald-500"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Revenue
                  </span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500">
                    +8.5%
                  </span>
                </div>
                <h3 className="text-2xl font-bold">$892,300</h3>
                <p className="mt-1 text-xs text-slate-400">Past 30 days</p>
              </div>

              {/* Active Subscriptions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Active Subscriptions
                  </span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500">
                    +5.2%
                  </span>
                </div>
                <h3 className="text-2xl font-bold">1,240</h3>
                <p className="mt-1 text-xs text-slate-400">Across 3 plans</p>
              </div>

              {/* Churn Rate */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Churn Rate
                  </span>
                  <span className="rounded bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-500">
                    -0.4%
                  </span>
                </div>
                <h3 className="text-2xl font-bold">3.2%</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Lower than benchmark
                </p>
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Revenue Growth Area Chart */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-surface-dark">
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      Revenue Growth
                    </h4>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Trends over the last 12 months
                    </p>
                  </div>
                  <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    <option>Year 2024</option>
                    <option>Year 2023</option>
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueGrowthData}
                      margin={{ top: 5, right: 5, left: 10, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient
                          id="revGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
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
                        tick={{
                          fontSize: 10,
                          fill: "#94a3b8",
                          fontWeight: 700,
                        }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        width={48}
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
                        stroke="#3B82F6"
                        strokeWidth={3}
                        fill="url(#revGradient)"
                        dot={false}
                        activeDot={{ r: 5, fill: "#3B82F6" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Subscription Distribution Donut */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
                <h4 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">
                  Subscription Distribution
                </h4>
                <div className="relative flex h-48 items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subscriptionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {subscriptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#1e293b",
                          border: "none",
                          borderRadius: "8px",
                          color: "#f8fafc",
                          fontSize: 12,
                        }}
                        formatter={(v) => [`${v as number}%`, "Share"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      1,240
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Total
                    </p>
                  </div>
                </div>
                <div className="mt-8 space-y-3">
                  {subscriptionData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-600 dark:text-slate-300">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Transactions & Renewals row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Recent Transactions table */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-surface-dark">
                <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Recent Transactions
                  </h4>
                  <button
                    type="button"
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:bg-slate-900/50">
                      <tr>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Plan</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {transactions.map((tx) => {
                        const cfg = STATUS_CONFIG[tx.status];
                        return (
                          <tr
                            key={tx.name + tx.date}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                  {tx.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {tx.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                              {tx.plan}
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                              {tx.amount}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`rounded px-2 py-1 text-[10px] font-bold ${cfg.cls}`}
                              >
                                {cfg.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {tx.date}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Upcoming Renewals */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
                <div className="mb-6 flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Upcoming Renewals
                  </h4>
                  <span className="text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                  </span>
                </div>
                <div className="space-y-3">
                  {renewals.map((r) => (
                    <div
                      key={r.company}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-center">
                        {r.date.split("\n").map((line, i) => (
                          <span
                            key={i}
                            className={`block text-primary ${i === 0 ? "text-[9px] font-bold" : "text-[11px] font-bold leading-none"}`}
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                          {r.company}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {r.plan} &bull; {r.amount}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 text-slate-400 hover:text-slate-600"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white transition hover:opacity-90 dark:bg-primary"
                >
                  View All Renewals
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
