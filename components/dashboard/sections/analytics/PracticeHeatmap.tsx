import { HEATMAP, HEAT_CLS } from "./chartData";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PracticeHeatmap() {
  const weekCount = HEATMAP.length;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 col-span-1 md:col-span-4 lg:col-span-4 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Practice Activity
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last 8 weeks
          </p>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <div
          className="grid w-full items-center"
          style={{
            gridTemplateColumns: `var(--label-width) repeat(${weekCount}, minmax(0, 1fr))`,
            gap: `var(--cell-gap)`,
            ["--cell-gap" as string]: "clamp(2px, 0.6vw, 7px)",
            ["--label-width" as string]: "clamp(26px, 4.5vw, 44px)",
          }}
        >
          <span className="text-[9px] text-gray-400 dark:text-gray-600 h-4 leading-4" />

          {HEATMAP.map((week, wi) => (
            <span
              key={`week-${wi}`}
              className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[9px] text-gray-400 dark:text-gray-600 text-center h-4 leading-4"
            >
              W{wi + 1}
            </span>
          ))}

          {DAYS.map((d, di) => (
            <span
              key={d}
              className="text-[9px] text-gray-400 dark:text-gray-600 h-3 leading-3"
              style={{ gridColumn: 1, gridRow: di + 2 }}
            >
              {d}
            </span>
          ))}

          {HEATMAP.map((week, wi) =>
            week.map((val, di) => (
              <span
                key={`${wi}-${di}`}
                title={`Week ${wi + 1}, ${DAYS[di]}: ${val === "gray" ? "No activity" : val === "b2" ? "Light" : val === "b4" ? "Moderate" : "Active"}`}
                className={`aspect-square w-full max-w-[20px] rounded-sm place-self-center ${HEAT_CLS[val]}`}
                style={{ gridColumn: wi + 2, gridRow: di + 2 }}
              />
            )),
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
        {[
          { label: "Days Active", value: "18" },
          { label: "Current Streak", value: "4 days" },
          { label: "Longest Streak", value: "12 days" },
        ].map((stat) => (
          <div key={stat.label} className="text-left">
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
