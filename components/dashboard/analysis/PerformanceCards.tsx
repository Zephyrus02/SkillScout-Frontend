// Overall Performance + Performance Trend cards (left column)

export default function PerformanceCards() {
  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 fade-in-up stagger-1">
      {/* Overall Performance */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Overall Performance
          </h2>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Top 15%
          </span>
        </div>

        <div className="flex items-center justify-center gap-6">
          {/* SVG ring */}
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle
                className="text-slate-100 dark:text-slate-800"
                cx="60"
                cy="60"
                r="52"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="progress-ring__circle text-emerald-500"
                cx="60"
                cy="60"
                r="52"
                fill="transparent"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="8"
                style={{ strokeDasharray: "326.726", strokeDashoffset: "58.8" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                82%
              </span>
            </div>
          </div>

          {/* Status + Confidence */}
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                Status
              </div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-sm">
                Strong Hire
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                Confidence
              </div>
              <div className="font-semibold text-slate-900 dark:text-white text-sm">
                High
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trend */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Performance Trend
          </h2>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md text-xs font-bold border border-green-100 dark:border-green-900/30">
            <span className="material-icons text-sm">trending_up</span>
            +14%
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          {/* Previous */}
          <div className="flex-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Previous
            </div>
            <div className="text-2xl font-bold text-slate-400 dark:text-slate-600">
              68
              <span className="text-sm font-normal text-slate-400 ml-1">%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
              <div
                className="bg-slate-300 dark:bg-slate-600 h-1.5 rounded-full"
                style={{ width: "68%" }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Oct 10, 2023</div>
          </div>

          {/* Arrow */}
          <div className="pb-3 text-slate-300 dark:text-slate-600">
            <span className="material-icons">arrow_forward</span>
          </div>

          {/* Current */}
          <div className="flex-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Current
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              82
              <span className="text-sm font-normal text-slate-500 ml-1">%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: "82%" }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Today</div>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
          Significant improvement in technical depth compared to your last
          session. Keep up the momentum!
        </p>
      </div>
    </div>
  );
}
