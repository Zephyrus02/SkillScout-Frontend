import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { subscriptionData } from "./data";

export default function SubscriptionChart() {
  return (
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
  );
}
