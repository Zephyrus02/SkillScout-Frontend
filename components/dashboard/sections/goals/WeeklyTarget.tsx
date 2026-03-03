// Weekly Target donut chart card

const DONUT_CIRC = 251;
const DONUT_FILLED = Math.round((3 / 5) * DONUT_CIRC);

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ACTIVE_DAYS = new Set([1, 3, 4]); // Tue, Thu, Fri (0-indexed)

export default function WeeklyTarget() {
  return (
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
              strokeDasharray={DONUT_CIRC}
              strokeDashoffset={DONUT_CIRC - DONUT_FILLED}
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
        {DAYS.map((d, i) => (
          <span
            key={d}
            className={
              ACTIVE_DAYS.has(i)
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
  );
}
