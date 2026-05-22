import {
  RCX,
  RCY,
  RR,
  RADAR_LABELS,
  CURRENT_VALS,
  MARKET_VALS,
  rPt,
  hexPts,
} from "./chartData";

export default function SkillRadarChart() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 col-span-1 md:col-span-2 lg:col-span-4 h-auto lg:h-[380px] flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Skill Analysis
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Current competency map
          </p>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
          View Details
        </button>
      </div>

      <div className="flex-1 w-full flex items-center justify-center py-1">
        <svg
          viewBox="-14 -14 248 248"
          className="w-full h-auto aspect-square max-w-[220px] xl:max-w-[240px] overflow-visible"
        >
          {/* Grid hexagons */}
          {[20, 40, 60, 80, 100].map((pct) => (
            <polygon
              key={pct}
              points={hexPts((pct / 100) * RR)}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          ))}

          {/* Axis spokes */}
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i * 60 - 90) * (Math.PI / 180);
            return (
              <line
                key={i}
                x1={RCX}
                y1={RCY}
                x2={RCX + RR * Math.cos(a)}
                y2={RCY + RR * Math.sin(a)}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            );
          })}

          {/* Market average polygon */}
          <polygon
            points={MARKET_VALS.map((v, i) => {
              const p = rPt(v, i);
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            }).join(" ")}
            fill="transparent"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Current level polygon */}
          <polygon
            points={CURRENT_VALS.map((v, i) => {
              const p = rPt(v, i);
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            }).join(" ")}
            fill="rgba(59,130,246,0.2)"
            stroke="#3B82F6"
            strokeWidth="2"
          />

          {/* Dot markers */}
          {CURRENT_VALS.map((v, i) => {
            const p = rPt(v, i);
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={3}
                fill="#3B82F6"
                stroke="#fff"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Labels */}
          {RADAR_LABELS.map((lbl, i) => {
            const a = (i * 60 - 90) * (Math.PI / 180);
            return (
              <text
                key={i}
                x={RCX + (RR + 16) * Math.cos(a)}
                y={RCY + (RR + 16) * Math.sin(a) + 4}
                textAnchor="middle"
                fontSize="8"
                fontWeight="600"
                fill="#64748B"
              >
                {lbl}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4 mt-1">
        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          Current Level
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full border border-gray-400 inline-block" />
          Market Average
        </span>
      </div>
    </div>
  );
}
