import { useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Analytics Hub  (screen 586ddf20)
   Performance over time, metric cards, skill radar,
   focus areas, and practice consistency heatmap.
───────────────────────────────────────────────────────────────── */

// ── Chart data ────────────────────────────────────────────────
const TECHNICAL_DATA = [45, 52, 55, 60, 68, 72, 75, 82];
const BEHAVIORAL_DATA = [30, 40, 45, 42, 55, 60, 62, 70];
const WEEKS = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"];

// ── SVG chart helpers ─────────────────────────────────────────
const CW = 560,
  CH = 180,
  PL = 32,
  PR = 8,
  PT = 10,
  PB = 28;
const AW = CW - PL - PR;
const AH = CH - PT - PB;

function sx(i: number) {
  return PL + (i / (WEEKS.length - 1)) * AW;
}
function sy(score: number) {
  return PT + (1 - score / 100) * AH;
}

const techPts = TECHNICAL_DATA.map(
  (s, i) => `${sx(i).toFixed(1)},${sy(s).toFixed(1)}`,
).join(" ");
const behavPts = BEHAVIORAL_DATA.map(
  (s, i) => `${sx(i).toFixed(1)},${sy(s).toFixed(1)}`,
).join(" ");
function technicalFill() {
  return `M ${TECHNICAL_DATA.map((s, i) => `${sx(i).toFixed(1)},${sy(s).toFixed(1)}`).join(" L ")} L ${sx(7).toFixed(1)},${CH - PB} L ${sx(0).toFixed(1)},${CH - PB} Z`;
}
function behavioralFill() {
  return `M ${BEHAVIORAL_DATA.map((s, i) => `${sx(i).toFixed(1)},${sy(s).toFixed(1)}`).join(" L ")} L ${sx(7).toFixed(1)},${CH - PB} L ${sx(0).toFixed(1)},${CH - PB} Z`;
}

// ── Radar chart helpers ───────────────────────────────────────
const RCX = 110,
  RCY = 110,
  RR = 80;
const RADAR_LABELS = [
  "Communication",
  "Data Struct.",
  "System Des.",
  "Behavioral",
  "Prob. Solving",
  "Code Quality",
];
const CURRENT_VALS = [85, 65, 50, 78, 90, 72];
const MARKET_VALS = [60, 60, 55, 65, 70, 60];

function rPt(val: number, idx: number) {
  const a = (idx * 60 - 90) * (Math.PI / 180);
  return {
    x: RCX + (val / 100) * RR * Math.cos(a),
    y: RCY + (val / 100) * RR * Math.sin(a),
  };
}
function hexPts(r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 90) * (Math.PI / 180);
    return `${(RCX + r * Math.cos(a)).toFixed(1)},${(RCY + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

// ── Heatmap data ──────────────────────────────────────────────
type HeatVal = "gray" | "b2" | "b4" | "b6";
const HEATMAP: HeatVal[][] = [
  ["gray", "b2", "gray", "b4", "gray", "gray", "gray"],
  ["gray", "gray", "b6", "b2", "gray", "gray", "b2"],
  ["b4", "b2", "gray", "gray", "gray", "b6", "gray"],
  ["gray", "gray", "gray", "gray", "b2", "b4", "gray"],
  ["b6", "b6", "b4", "b2", "gray", "gray", "gray"],
  ["gray", "gray", "gray", "b2", "b4", "gray", "gray"],
  ["b2", "gray", "gray", "gray", "gray", "gray", "b6"],
  ["gray", "b4", "b4", "gray", "gray", "gray", "gray"],
  ["b6", "b2", "gray", "gray", "gray", "gray", "b2"],
  ["gray", "gray", "gray", "b6", "b6", "b4", "gray"],
  ["b2", "gray", "gray", "gray", "gray", "gray", "gray"],
  ["gray", "gray", "gray", "gray", "b2", "b4", "b6"],
  ["gray", "gray", "b4", "gray", "gray", "gray", "gray"],
];
const HEAT_CLS: Record<HeatVal, string> = {
  gray: "bg-gray-100 dark:bg-gray-800",
  b2: "bg-blue-200",
  b4: "bg-blue-400",
  b6: "bg-blue-600",
};

// ── Component ─────────────────────────────────────────────────
export default function WeakAreasSection() {
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
        {/* Performance Over Time ── col-span-8 */}
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

        {/* Metric cards ── col-span-4 */}
        <div className="col-span-1 md:col-span-4 lg:col-span-4 flex flex-col gap-6">
          {/* Behavioral Velocity */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex-1 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <span
                className="material-icons text-green-500"
                style={{ fontSize: "80px" }}
              >
                trending_up
              </span>
            </div>
            <div className="relative z-10">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Behavioral Velocity
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  +23%
                </span>
                <span className="text-xs text-green-600 font-bold bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                  High Impact
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Great job using STAR method consistently.
              </p>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full"
                style={{ width: "78%" }}
              />
            </div>
          </div>

          {/* Coding Speed */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex-1 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <span
                className="material-icons text-blue-500"
                style={{ fontSize: "80px" }}
              >
                speed
              </span>
            </div>
            <div className="relative z-10">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Coding Speed
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  -12%
                </span>
                <span className="text-xs text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  Faster
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Time to optimal solution has decreased.
              </p>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: "65%" }}
              />
            </div>
          </div>
        </div>

        {/* Skill Analysis ── col-span-4 */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 col-span-1 md:col-span-2 lg:col-span-4 h-[380px] flex flex-col">
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
          <div className="flex-1 w-full flex items-center justify-center">
            <svg viewBox="0 0 220 220" className="w-full h-full max-w-[200px]">
              {[20, 40, 60, 80, 100].map((pct) => (
                <polygon
                  key={pct}
                  points={hexPts((pct / 100) * RR)}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
              ))}
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
              <polygon
                points={CURRENT_VALS.map((v, i) => {
                  const p = rPt(v, i);
                  return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                }).join(" ")}
                fill="rgba(59,130,246,0.2)"
                stroke="#3B82F6"
                strokeWidth="2"
              />
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

        {/* Focus Areas ── col-span-4 */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 col-span-1 md:col-span-2 lg:col-span-4 h-[380px] overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Focus Areas
          </h3>
          <div
            className="flex-1 overflow-y-auto space-y-3 pr-1"
            style={{ scrollbarWidth: "none" }}
          >
            {/* System Scalability */}
            <div className="p-4 rounded-xl border border-red-100 bg-red-50/30 dark:border-red-900/30 dark:bg-red-900/10">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-red-500 text-xl">
                    warning
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    System Scalability
                  </span>
                </div>
                <span className="text-xs font-bold text-red-600 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm whitespace-nowrap">
                  Score: 45/100
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Struggled with database sharding concepts in last session.
              </p>
              <button className="w-full py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1 transition-colors">
                <span className="material-icons text-base">play_lesson</span>
                Review Sharding Strategies
              </button>
            </div>
            {/* Dynamic Programming */}
            <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/30 dark:border-orange-900/30 dark:bg-orange-900/10">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-orange-500 text-xl">
                    timer
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    Dynamic Programming
                  </span>
                </div>
                <span className="text-xs font-bold text-orange-600 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm whitespace-nowrap">
                  Score: 58/100
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Optimization approach was correct but implementation was slow.
              </p>
              <button className="w-full py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1 transition-colors">
                <span className="material-icons text-base">code</span>
                Practice DP Problems
              </button>
            </div>
            {/* Conflict Resolution */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/30">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-gray-500 text-xl">
                    psychology
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    Conflict Resolution
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-600 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm whitespace-nowrap">
                  Score: 65/100
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Answers were good but lacked specific &quot;I&quot; statements.
              </p>
              <button className="w-full py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1 transition-colors">
                <span className="material-icons text-base">mic</span>
                Behavioral Drills
              </button>
            </div>
          </div>
        </div>

        {/* Practice Consistency ── col-span-4 */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 col-span-1 md:col-span-4 lg:col-span-4 h-[380px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Practice Consistency
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm" />
                <div className="w-3 h-3 bg-blue-200 rounded-sm" />
                <div className="w-3 h-3 bg-blue-400 rounded-sm" />
                <div className="w-3 h-3 bg-blue-600 rounded-sm" />
              </div>
              <span>More</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex gap-1">
              {HEATMAP.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-1">
                  {col.map((val, ri) => (
                    <div
                      key={ri}
                      className={`h-3 w-3 rounded-sm ${HEAT_CLS[val]}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-6 px-4">
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                18
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Days Active
              </span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                4
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Current Streak
              </span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                12
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Longest Streak
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
