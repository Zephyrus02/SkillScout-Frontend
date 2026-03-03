import {
  CW,
  CH,
  PL,
  PR,
  PB,
  WEEKS,
  sy,
  sx,
  techPts,
  behavPts,
  technicalFill,
  behavioralFill,
} from "./chartData";

export default function PerformanceChart() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 col-span-1 md:col-span-4 lg:col-span-8 h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Performance Over Time
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Score trajectory across all mock sessions
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            Technical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
            Behavioral
          </span>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <svg
          viewBox={`0 0 ${CW} ${CH}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gTech" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gBehav" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y gridlines */}
          {[0, 20, 40, 60, 80, 100].map((s) => (
            <line
              key={s}
              x1={PL}
              y1={sy(s)}
              x2={CW - PR}
              y2={sy(s)}
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Gradient fills */}
          <path d={technicalFill()} fill="url(#gTech)" />
          <path d={behavioralFill()} fill="url(#gBehav)" />

          {/* Lines */}
          <polyline
            points={behavPts}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={techPts}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X labels */}
          {WEEKS.map((w, i) => (
            <text
              key={w}
              x={sx(i)}
              y={CH - 6}
              textAnchor="middle"
              fontSize="9.5"
              fill="#94A3B8"
            >
              {w}
            </text>
          ))}

          {/* Y labels */}
          {[0, 20, 40, 60, 80, 100].map((s) => (
            <text
              key={s}
              x={PL - 4}
              y={sy(s) + 4}
              textAnchor="end"
              fontSize="9.5"
              fill="#94A3B8"
            >
              {s}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
