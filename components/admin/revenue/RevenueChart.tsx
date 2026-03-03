import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { revenueGrowthData } from "./data";

export default function RevenueChart() {
  return (
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
              <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
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
  );
}
