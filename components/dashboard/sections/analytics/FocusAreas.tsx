const FOCUS_AREAS = [
  {
    priority: "High",
    color: "red",
    title: "System Scalability",
    desc: "Struggled with distributed systems trade-offs in last 3 sessions",
    bg: "bg-red-50 dark:bg-red-900/10",
    border: "border-red-200 dark:border-red-800",
    badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
  {
    priority: "Medium",
    color: "orange",
    title: "Dynamic Programming",
    desc: "Bottom-up approaches need more practice — 54% accuracy this week",
    bg: "bg-orange-50 dark:bg-orange-900/10",
    border: "border-orange-200 dark:border-orange-800",
    badge:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  {
    priority: "Low",
    color: "gray",
    title: "Conflict Resolution",
    desc: "Behavioral responses lack specific examples — work on STAR format",
    bg: "bg-gray-50 dark:bg-gray-800/40",
    border: "border-gray-200 dark:border-gray-700",
    badge: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
    dot: "bg-gray-400",
  },
];

export default function FocusAreas() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 col-span-1 md:col-span-2 lg:col-span-4 h-auto lg:h-[380px] overflow-visible lg:overflow-hidden flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Focus Areas
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Based on recent performance
          </p>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
          View All
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-visible lg:overflow-y-auto lg:pr-1">
        {FOCUS_AREAS.map((area) => (
          <div
            key={area.title}
            className={`flex items-start gap-3 p-3 rounded-xl border min-w-0 ${area.bg} ${area.border}`}
          >
            <span
              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${area.dot}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex-1 min-w-0 break-words">
                  {area.title}
                </p>
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded shrink-0 ${area.badge}`}
                >
                  {area.priority}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words">
                {area.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
