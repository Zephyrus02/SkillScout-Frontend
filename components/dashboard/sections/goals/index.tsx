// Goals & Milestones section orchestrator

import GoalCard from "./GoalCard";
import ReadinessGate from "./ReadinessGate";
import WeeklyTarget from "./WeeklyTarget";
import MilestonesList from "./MilestonesList";
import RoadmapPanel from "./RoadmapPanel";

export default function GoalsSectionContent() {
  return (
    <div className="space-y-8">
      {/* ── Page header ── */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Goals &amp; Milestones
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stay accountable and track your path to your dream job.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2 shadow-sm">
            <span className="material-icons text-lg">edit</span>
            Edit Goals
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <span className="material-icons text-lg">add</span>
            New Milestone
          </button>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <GoalCard />
        <ReadinessGate />
        <WeeklyTarget />
        <MilestonesList />
        <RoadmapPanel />
      </div>
    </div>
  );
}
