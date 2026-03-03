import { HEATMAP, HEAT_CLS, type HeatVal } from "./chartData";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PracticeHeatmap() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 col-span-1 md:col-span-4 lg:col-span-4 h-[380px] flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Practice Activity
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last 8 weeks
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Less</span>
          {(["gray", "b2", "b4", "b6"] as HeatVal[]).map((v) => (
            <span key={v} className={`w-3 h-3 rounded-sm ${HEAT_CLS[v]}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-[500px]">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pt-5 pr-1">
            {DAYS.map((d) => (
              <span
                key={d}
                className="text-[9px] text-gray-400 dark:text-gray-600 h-3 leading-3"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Heatmap grid */}
          {HEATMAP.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {/* Week label */}
              <span className="text-[9px] text-gray-400 dark:text-gray-600 text-center h-4 leading-4">
                W{wi + 1}
              </span>
              {week.map((val, di) => (
                <span
                  key={di}
                  title={`Week ${wi + 1}, ${DAYS[di]}: ${val === "gray" ? "No activity" : val === "b2" ? "Light" : val === "b4" ? "Moderate" : "Active"}`}
                  className={`w-3 h-3 rounded-sm ${HEAT_CLS[val]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-6 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
        {[
          { label: "Days Active", value: "18" },
          { label: "Current Streak", value: "4 days" },
          { label: "Longest Streak", value: "12 days" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
