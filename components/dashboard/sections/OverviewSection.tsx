import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { DIFFICULTY_BADGE, DIFFICULTY_LABELS } from "./practice/data";

/* ─────────────────────────────────────────────────────────────
   Overview / Home  –  new-user empty state
   Layout exactly matches dash.html reference design:
   8/4 grid · hero banner · locked roadmap · empty history ·
   Quick Start sticky card · Did You Know tip
───────────────────────────────────────────────────────────────── */

const LOCKED_FEATURES = [
  {
    icon: "analytics",
    iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-500",
    title: "Detailed Skill Report",
    desc: "Deep dive into your technical and soft skills.",
  },
  {
    icon: "lightbulb",
    iconBg: "bg-orange-50 dark:bg-orange-900/20 text-orange-500",
    title: "AI Personalized Tips",
    desc: "Curated advice based on your weak points.",
  },
  {
    icon: "trending_up",
    iconBg: "bg-green-50 dark:bg-green-900/20 text-green-500",
    title: "Progress Tracking",
    desc: "Visualize your improvement over time.",
  },
];

export default function OverviewSection() {
  const { user } = useAuth();
  const [interviewType, setInterviewType] = useState<
    "technical" | "behavioral"
  >("technical");
  const [duration, setDuration] = useState<15 | 30 | 45>(15);
  const [difficulty, setDifficulty] = useState(3);
  const diffLabel = DIFFICULTY_LABELS[difficulty - 1];
  const diffBadge = DIFFICULTY_BADGE[difficulty - 1];
  const displayName = user?.name?.trim() || "there";

  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Welcome, {displayName}! 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Let&rsquo;s get you ready for your dream job. Your journey starts
            here.
          </p>
        </div>

        {/* Readiness pill */}
        <div className="flex items-center gap-3 px-4 py-2 bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-full shadow-sm">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Readiness
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            0%
          </span>
          <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-primary rounded-full" />
          </div>
        </div>
      </div>

      {/* ── 8/4 grid ── */}
      <div className="grid grid-cols-12 gap-8">
        {/* ── Left col (8) ── */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Hero banner */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary to-blue-600 p-8 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
            {/* glow blobs */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-purple-500 opacity-20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Text */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-4 border border-white/20">
                  <span className="material-icons text-sm">star</span>
                  New User Guide
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  Ready to ace your next interview?
                </h2>
                <p className="text-blue-100 mb-6 max-w-md text-sm leading-relaxed">
                  Our AI coach will analyze your answers, body language, and
                  tone to give you personalized feedback instantly.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/dashboard/practice"
                    className="bg-white text-primary px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm"
                  >
                    <span className="material-icons text-xl">play_arrow</span>
                    Start First Interview
                  </Link>
                  <button className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm">
                    Watch Demo
                  </button>
                </div>
              </div>

              {/* Rocket illustration */}
              <div className="hidden md:block w-48 h-48 relative shrink-0">
                <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
                  <span className="material-icons text-6xl text-white">
                    rocket_launch
                  </span>
                </div>
                <div className="absolute top-0 right-0 bg-white text-primary px-2 py-1.5 rounded-lg shadow-lg rotate-12 text-xs font-bold">
                  HIRED!
                </div>
                <div className="absolute bottom-4 left-0 bg-green-400 text-white px-2 py-1.5 rounded-lg shadow-lg -rotate-6 flex items-center gap-1 text-xs font-bold">
                  <span className="material-icons text-sm">check_circle</span>
                  98%
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons text-primary">map</span>
                Your Roadmap
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                Complete your first interview to unlock
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LOCKED_FEATURES.map((feat) => (
                <div
                  key={feat.title}
                  className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800 relative overflow-hidden"
                >
                  {/* lock overlay */}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-[2px]">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2 shadow-sm">
                      <span className="material-icons text-gray-400 text-xl">
                        lock
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      Locked
                    </span>
                  </div>
                  {/* blurred content */}
                  <div className="blur-[3px] select-none pointer-events-none">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${feat.iconBg}`}
                    >
                      <span className="material-icons">{feat.icon}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-gray-500">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty history */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <span className="material-icons text-primary text-3xl">
                history_edu
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              No Recent Sessions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              Your interview history will appear here once you complete your
              first session. Track your progress and review feedback.
            </p>
          </div>
        </div>

        {/* ── Right col (4) ── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Start card */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)] p-6 border border-gray-100 dark:border-gray-800 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Quick Start
              </h3>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-md">
                Recommended
              </span>
            </div>

            <div className="space-y-5">
              {/* Interview Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">
                  Interview Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setInterviewType("technical")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      interviewType === "technical"
                        ? "border-primary bg-blue-50 dark:bg-blue-900/20 text-primary"
                        : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className="material-icons mb-1">code</span>
                    <span className="text-xs font-bold">Technical</span>
                  </button>
                  <button
                    onClick={() => setInterviewType("behavioral")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      interviewType === "behavioral"
                        ? "border-primary bg-blue-50 dark:bg-blue-900/20 text-primary"
                        : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className="material-icons mb-1">person</span>
                    <span className="text-xs font-medium">Behavioral</span>
                  </button>
                </div>
              </div>

              {/* Difficulty Level — matches Practice → Parameters */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Difficulty Level
                  </label>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${diffBadge}`}
                  >
                    {diffLabel}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={1}
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>Junior</span>
                  <span>Mid-Level</span>
                  <span>Senior/Staff</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">
                  Duration
                </label>
                <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  {([15, 30, 45] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        duration === d
                          ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                          : "font-medium text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link
                  href="/dashboard/prelaunch"
                  className="w-full bg-primary hover:bg-primary-hover text-white py-4 px-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-sm group"
                >
                  Quick Start Your Interview
                  <span className="material-icons text-lg group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </Link>
                <p className="text-center text-[10px] text-gray-400 mt-3">
                  No credit card required for trial.
                </p>
              </div>
            </div>
          </div>

          {/* Did you know? */}
          <div className="bg-linear-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-surface-dark rounded-2xl p-6 border border-purple-100 dark:border-purple-900/30">
            <div className="flex gap-3">
              <span className="material-icons text-purple-500 shrink-0">
                tips_and_updates
              </span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Did you know?
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Practicing out loud increases your retention by 50%. Our AI
                  listens to your voice tone and pace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
