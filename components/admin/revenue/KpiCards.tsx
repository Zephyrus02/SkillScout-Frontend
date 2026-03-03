// KPI cards row for the Revenue admin page

export default function KpiCards() {
  return (
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
        <p className="mt-1 text-xs text-slate-400">Lower than benchmark</p>
      </div>
    </div>
  );
}
