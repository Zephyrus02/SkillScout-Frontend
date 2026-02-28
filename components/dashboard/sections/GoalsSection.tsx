import { useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Goals & Milestones  (screen 3b27a7d8)
   Active goal card, readiness gate, weekly target donut,
   milestones list, and upcoming schedule.
───────────────────────────────────────────────────────────────── */

const MILESTONES = [
  {
    icon: "code",
    title: "Master Data Structures",
    status: "completed",
    due: "Completed on Feb 10",
    progress: 100,
  },
  {
    icon: "functions",
    title: "Advanced Algorithms",
    status: "warning",
    due: "Due in 3 days",
    progress: 75,
  },
  {
    icon: "architecture",
    title: "System Design Patterns",
    status: "pending",
    due: "Due Mar 15",
    progress: 30,
  },
  {
    icon: "groups",
    title: "Behavioral Stories (STAR)",
    status: "upcoming",
    due: "Starts Mar 16",
    progress: 0,
  },
];

export default function GoalsSection() {
  const [scheduleView, setScheduleView] = useState<"list" | "month">("list");

  // Readiness gate SVG circle: r=34, circ≈213
  const gateCirc = 213;
  const gateOffset = 60; // ~72% filled

  // Weekly donut SVG: r=40, circ≈251
  const donutCirc = 251;
  const donutFilled = Math.round((3 / 5) * donutCirc); // 3 of 5 sessions

  return (
    <div className="space-y-8">
      {/* ── Page header ── */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Goals &amp; Milestones
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stay accountable and track your path to your dream job.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2 shadow-sm">
            <span className="material-icons text-lg">edit</span>
            Edit Goals
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <span className="material-icons text-lg">add</span>
            New Milestone
          </button>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Active Goal ── col-span-2 */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 col-span-1 md:col-span-2 relative overflow-hidden flex flex-col justify-between h-[280px]">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white mb-3 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                Active Goal
              </span>
              <h2 className="text-2xl font-bold leading-tight">
                Crack FAANG by April
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Targeting Senior Software Engineer roles
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10 shrink-0">
              <span className="material-icons text-2xl">rocket_launch</span>
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between text-sm mb-2 font-medium">
              <span className="text-blue-100">Overall Progress</span>
              <span>68%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 mb-4 backdrop-blur-sm overflow-hidden">
              <div
                className="bg-white h-3 rounded-full"
                style={{ width: "68%" }}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col bg-white/10 rounded-xl p-3 flex-1 border border-white/5 backdrop-blur-sm">
                <span className="text-xs text-blue-200">Days Remaining</span>
                <span className="text-lg font-bold">42 Days</span>
              </div>
              <div className="flex flex-col bg-white/10 rounded-xl p-3 flex-1 border border-white/5 backdrop-blur-sm">
                <span className="text-xs text-blue-200">Current Streak</span>
                <span className="text-lg font-bold">5 Days 🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Readiness Gate ── col-span-1 */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border-t-4 border-yellow-400 p-6 col-span-1 h-[280px] flex flex-col shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons text-yellow-500">lock_clock</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Readiness Gate
            </h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative w-20 h-20 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="transparent"
                  stroke="#F3F4F6"
                  strokeWidth="4"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="transparent"
                  stroke="#EAB308"
                  strokeWidth="4"
                  strokeDasharray={gateCirc}
                  strokeDashoffset={gateOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">B+</span>
              </div>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-1">
              Almost Ready
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              AI suggests 3 more{" "}
              <span className="font-bold text-yellow-600">System Design</span>{" "}
              mocks to clear the L5 gate.
            </p>
          </div>
          <button className="w-full mt-auto py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition">
            View Gap Analysis
          </button>
        </div>

        {/* Weekly Target ── col-span-1 */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 col-span-1 h-[280px] flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Weekly Target
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Feb 19 - Feb 25
              </p>
            </div>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-md text-xs font-bold">
              On Track
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  strokeDasharray={donutCirc}
                  strokeDashoffset={donutCirc - donutFilled}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
                  3<span className="text-lg text-gray-400 font-normal">/5</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Sessions
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs mt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
              <span
                key={d}
                className={
                  i === 1 || i === 3 || i === 4
                    ? "font-bold text-green-500"
                    : i >= 5
                      ? "text-gray-300"
                      : "text-gray-500 dark:text-gray-400"
                }
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Milestones ── col-span-2 */}
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

        {/* Schedule ── col-span-2 */}
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
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${scheduleView === v ? "bg-white dark:bg-surface-dark shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
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
                    <span className="material-icons text-sm">schedule</span>{" "}
                    10:00 AM - 11:00 AM
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-icons text-sm">person</span> w/
                    Coach Sarah
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
                    <span className="material-icons text-sm">schedule</span>{" "}
                    02:00 PM - 03:00 PM
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
                    <span className="material-icons text-sm">schedule</span>{" "}
                    05:00 PM - 06:00 PM
                  </span>
                </div>
              </div>
              <button className="self-center p-2 text-gray-300 hover:text-blue-600 transition shrink-0">
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
