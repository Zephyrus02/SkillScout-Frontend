import { useState } from "react";
import PerformanceChart from "./PerformanceChart";
import MetricCards from "./MetricCards";
import SkillRadarChart from "./SkillRadarChart";
import FocusAreas from "./FocusAreas";
import PracticeHeatmap from "./PracticeHeatmap";

export default function AnalyticsHub() {
  const [activeFilter, setActiveFilter] = useState<"30days" | "alltime">(
    "30days",
  );

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Analytics Hub
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Deep dive into your interview performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-lg p-1">
            {(["30days", "alltime"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeFilter === f
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {f === "30days" ? "Last 30 Days" : "All Time"}
              </button>
            ))}
          </div>
          <button className="p-2 bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-full text-gray-500 hover:text-blue-600 transition-colors">
            <span className="material-icons text-xl">download</span>
          </button>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">
        {/* Row 1: Performance chart (8) + Metric cards (4) */}
        <PerformanceChart />
        <MetricCards />

        {/* Row 2: Radar chart (4) + Focus areas (4) + Practice heatmap (4) */}
        <SkillRadarChart />
        <FocusAreas />

        {/* Row 2 item 3: Practice heatmap (col-span-4) */}
        <PracticeHeatmap />
      </div>
    </div>
  );
}
