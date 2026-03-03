export default function MetricCards() {
  return (
    <div className="col-span-1 md:col-span-4 lg:col-span-4 flex flex-col gap-6">
      {/* Behavioral Velocity */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Behavioral Velocity
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              +23%
            </p>
          </div>
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-2 py-1 rounded-full">
            Improving
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-3">
          <div
            className="bg-emerald-500 h-1.5 rounded-full"
            style={{ width: "72%" }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Soft skill response quality improved significantly vs. last month
        </p>
      </div>

      {/* Coding Speed */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Coding Speed
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              -12%
            </p>
          </div>
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2 py-1 rounded-full">
            Needs Focus
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-3">
          <div
            className="bg-blue-500 h-1.5 rounded-full"
            style={{ width: "41%" }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Average time-to-solution is slower than your personal best
        </p>
      </div>
    </div>
  );
}
