import { useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   Session History  (screen 367b00cb / my interviews.html)
   3-column card: score panel | content | action buttons
   Always-visible AI summaries · search bar · filter chips ·
   pagination
───────────────────────────────────────────────────────────────── */

type SessionCategory = "System Design" | "Behavioral" | "Coding";

interface Session {
  id: string;
  date: string;
  time: string;
  duration: string;
  category: SessionCategory;
  title: string;
  score: number;
  badge: string;
  badgeIcon: string;
  badgeColor: string;
  aiSummary: string;
}

const SESSIONS: Session[] = [
  {
    id: "1",
    date: "Today",
    time: "10:30 AM",
    duration: "45m",
    category: "System Design",
    title: "Scalable URL Shortener Architecture",
    score: 8.5,
    badge: "Top 15%",
    badgeIcon: "trending_up",
    badgeColor:
      "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    aiSummary:
      "Strong grasp of database sharding and key generation strategies. You effectively addressed the collision handling edge case. However, the caching strategy for hot keys could be more detailed, specifically regarding eviction policies.",
  },
  {
    id: "2",
    date: "Yesterday",
    time: "2:15 PM",
    duration: "30m",
    category: "Behavioral",
    title: "Leadership & Conflict Resolution",
    score: 7.2,
    badge: "Average",
    badgeIcon: "remove",
    badgeColor:
      "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    aiSummary:
      'Good use of the STAR method. Your "Situation" and "Task" were clear, but the "Result" section lacked quantifiable metrics. Focus more on the specific impact of your actions on the team\'s velocity.',
  },
  {
    id: "3",
    date: "Oct 24",
    time: "4:00 PM",
    duration: "60m",
    category: "Coding",
    title: "Sliding Window: Maximum Sum Subarray",
    score: 9.0,
    badge: "Excellent",
    badgeIcon: "star",
    badgeColor:
      "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    aiSummary:
      "Flawless implementation of Kadane's algorithm. You correctly identified the edge cases for negative numbers and empty arrays. The time complexity analysis was spot on (O(n)).",
  },
  {
    id: "4",
    date: "Oct 20",
    time: "11:00 AM",
    duration: "40m",
    category: "System Design",
    title: "Designing Instagram Feed",
    score: 6.5,
    badge: "Needs Work",
    badgeIcon: "arrow_downward",
    badgeColor: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    aiSummary:
      "You struggled with defining the data schema early on, which led to confusion during the API design phase. Recommend reviewing fan-out on write vs fan-out on read strategies.",
  },
];

const CATEGORY_STYLE: Record<SessionCategory, string> = {
  "System Design":
    "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  Behavioral:
    "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  Coding:
    "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
};

export default function HistorySection() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Session History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Review your past performance and track your growth.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
          <span className="material-icons text-[18px]">download</span>
          Export All
        </button>
      </div>

      {/* ── Search + filters bar ── */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100 dark:border-gray-800 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="relative w-full md:w-96">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by topic, type, or notes..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto overflow-x-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap">
            <span>All Types</span>
            <span className="material-icons text-[18px]">expand_more</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap">
            <span>Date Range</span>
            <span className="material-icons text-[18px]">calendar_today</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap">
            <span>Score</span>
            <span className="material-icons text-[18px]">sort</span>
          </button>
        </div>
      </div>

      {/* ── Session cards ── */}
      <div className="space-y-4">
        {SESSIONS.map((session) => (
          <div
            key={session.id}
            className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* ── Left: score panel ── */}
              <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-4 md:w-48 md:border-r border-gray-100 dark:border-gray-800 md:pr-6 md:shrink-0">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Score
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {session.score}
                    </span>
                    <span className="text-sm text-gray-400">/10</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${session.badgeColor}`}
                  >
                    <span className="material-icons text-[14px]">
                      {session.badgeIcon}
                    </span>
                    {session.badge}
                  </span>
                </div>
                <div className="text-right md:text-left">
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">
                    {session.date}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {session.time} • {session.duration}
                  </div>
                </div>
              </div>

              {/* ── Middle: content ── */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${CATEGORY_STYLE[session.category]}`}
                  >
                    {session.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {session.title}
                  </h3>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-primary font-medium text-xs uppercase tracking-wide">
                    <span className="material-icons text-[16px]">
                      smart_toy
                    </span>
                    AI Summary
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {session.aiSummary}
                  </p>
                </div>
              </div>

              {/* ── Right: actions ── */}
              <div className="flex md:flex-col items-center md:justify-center gap-3 md:pl-6 md:border-l border-gray-100 dark:border-gray-800 md:shrink-0 w-full md:w-auto mt-4 md:mt-0">
                <Link
                  href="/dashboard/analysis"
                  className="w-full md:w-auto px-4 py-2 bg-primary text-white hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 whitespace-nowrap"
                >
                  <span className="material-icons text-[18px]">analytics</span>
                  View Analysis
                </Link>
                <button className="w-full md:w-auto px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
                  <span className="material-icons text-[18px]">
                    description
                  </span>
                  Transcript
                </button>
                <button className="w-full md:w-auto px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
                  <span className="material-icons text-[18px]">
                    picture_as_pdf
                  </span>
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pagination ── */}
      <div className="flex justify-center pt-8">
        <nav className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-icons">chevron_left</span>
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                page === n
                  ? "bg-primary text-white shadow-md shadow-blue-500/20"
                  : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {n}
            </button>
          ))}
          <span className="px-2 text-gray-400">...</span>
          <button
            onClick={() => setPage(page + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-icons">chevron_right</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
