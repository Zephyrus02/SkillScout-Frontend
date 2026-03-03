// Milestones list card — col-span-2

export default function MilestonesList() {
  return (
    <div className="col-span-1 md:col-span-2 bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 min-h-[340px] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="material-icons text-blue-600">flag</span>
          Milestones
        </h3>
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition">
            <span className="material-icons text-lg">filter_list</span>
          </button>
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition">
            <span className="material-icons text-lg">more_horiz</span>
          </button>
        </div>
      </div>
      <div className="space-y-6">
        {/* Master Data Structures — completed */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <span className="material-icons text-sm">check</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-400 line-through decoration-gray-400 decoration-2">
                  Master Data Structures
                </h4>
                <span className="text-xs text-green-600 font-medium">
                  Completed on Feb 10
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
              100%
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full w-full" />
          </div>
        </div>

        {/* Advanced Algorithms — warning */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <span className="material-icons text-sm">code</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Advanced Algorithms
                </h4>
                <span className="text-xs text-orange-500 font-medium flex items-center gap-1">
                  <span className="material-icons text-xs">warning</span>
                  Due in 3 days
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
              75%
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-3/4" />
          </div>
        </div>

        {/* System Design Patterns */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <span className="material-icons text-sm">architecture</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  System Design Patterns
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Due Mar 15
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
              30%
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: "30%" }}
            />
          </div>
        </div>

        {/* Behavioral Stories — upcoming */}
        <div className="opacity-60">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center shrink-0">
                <span className="material-icons text-sm">groups</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Behavioral Stories (STAR)
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Starts Mar 16
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
              0%
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gray-400 w-0 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
