// Readiness Gate card with SVG donut

const GATE_CIRC = 213;
const GATE_OFFSET = 60; // ~72% filled

export default function ReadinessGate() {
  return (
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
              strokeDasharray={GATE_CIRC}
              strokeDashoffset={GATE_OFFSET}
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
          <span className="font-bold text-yellow-600">System Design</span> mocks
          to clear the L5 gate.
        </p>
      </div>
      <button className="w-full mt-auto py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition">
        View Gap Analysis
      </button>
    </div>
  );
}
