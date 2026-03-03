import { useState } from "react";

// Schedule panel with list/month toggle — col-span-2

export default function SchedulePanel() {
  const [scheduleView, setScheduleView] = useState<"list" | "month">("list");

  return (
    <div className="col-span-1 md:col-span-2 bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 min-h-[340px] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Schedule
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Upcoming mock sessions
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {(["list", "month"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setScheduleView(v)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                scheduleView === v
                  ? "bg-white dark:bg-surface-dark shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {/* Feb 24 */}
        <div className="flex gap-4 p-3 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md transition bg-white dark:bg-gray-900/50 group cursor-pointer">
          <div className="flex flex-col items-center justify-center min-w-[60px] bg-blue-50 dark:bg-blue-900/20 rounded-lg px-2 py-1 text-blue-600 shrink-0">
            <span className="text-xs font-bold uppercase">Feb</span>
            <span className="text-xl font-bold">24</span>
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Mock: Amazon Leadership Principles
              </h4>
              <span className="text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full whitespace-nowrap">
                Confirmed
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span className="material-icons text-sm">schedule</span> 10:00
                AM - 11:00 AM
              </span>
              <span className="flex items-center gap-1">
                <span className="material-icons text-sm">person</span> w/ Coach
                Sarah
              </span>
            </div>
          </div>
          <button className="self-center p-2 text-gray-300 hover:text-blue-600 transition shrink-0">
            <span className="material-icons">chevron_right</span>
          </button>
        </div>

        {/* Feb 26 */}
        <div className="flex gap-4 p-3 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md transition bg-white dark:bg-gray-900/50 group cursor-pointer">
          <div className="flex flex-col items-center justify-center min-w-[60px] bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1 text-gray-500 shrink-0">
            <span className="text-xs font-bold uppercase">Feb</span>
            <span className="text-xl font-bold">26</span>
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Peer Mock: LeetCode Hard
              </h4>
              <span className="text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full whitespace-nowrap">
                Pending
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span className="material-icons text-sm">schedule</span> 02:00
                PM - 03:00 PM
              </span>
              <span className="flex items-center gap-1">
                <span className="material-icons text-sm">group</span> w/
                User_892
              </span>
            </div>
          </div>
          <button className="self-center p-2 text-gray-300 hover:text-blue-600 transition shrink-0">
            <span className="material-icons">chevron_right</span>
          </button>
        </div>

        {/* Mar 01 */}
        <div className="flex gap-4 p-3 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md transition bg-white dark:bg-gray-900/50 group cursor-pointer opacity-80">
          <div className="flex flex-col items-center justify-center min-w-[60px] bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1 text-gray-500 shrink-0">
            <span className="text-xs font-bold uppercase">Mar</span>
            <span className="text-xl font-bold">01</span>
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Mock: System Design (Netflix)
              </h4>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span className="material-icons text-sm">schedule</span> 05:00
                PM - 06:00 PM
              </span>
            </div>
          </div>
          <button className="self-center p-2 text-gray-300 hover:text-blue-600 transition shrink-0">
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
