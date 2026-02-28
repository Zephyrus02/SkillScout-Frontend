import { useState } from "react";
import { useRouter } from "next/router";

/* ─────────────────────────────────────────────────────────────
   Practice Arena  (screen 8d3cb26f / practice.html)
   12-col grid: left-8 config | right-4 preview + pro tip
───────────────────────────────────────────────────────────────── */

type InterviewTypeId =
  | "technical"
  | "behavioral"
  | "hr-screening"
  | "full-loop";

const INTERVIEW_TYPES: { id: InterviewTypeId; label: string; icon: string }[] =
  [
    { id: "technical", label: "Technical", icon: "code" },
    { id: "behavioral", label: "Behavioral", icon: "psychology" },
    { id: "hr-screening", label: "HR Screening", icon: "groups" },
    { id: "full-loop", label: "Full Loop", icon: "all_inclusive" },
  ];

const DIFFICULTY_LABELS = ["Junior", "Mid-Level", "Senior/Staff"];
const DIFFICULTY_BADGE = [
  "bg-green-50 text-green-600",
  "bg-yellow-50 text-yellow-600",
  "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
];

const DURATIONS = [15, 30, 45];

const PERSONAS = [
  {
    id: "strict",
    label: "Strict & Formal",
    desc: "Minimal hints, professional tone.",
    emoji: "🧐",
  },
  {
    id: "neutral",
    label: "Professional & Neutral",
    desc: "Standard interview experience.",
    emoji: "👔",
  },
  {
    id: "friendly",
    label: "Friendly & Helpful",
    desc: "Offers hints and encouragement.",
    emoji: "🤝",
  },
];

const SESSION_STEPS = [
  { title: "Introduction", meta: "2 mins • Elevator Pitch", note: null },
  {
    title: "Technical Deep Dive",
    meta: "25 mins • System Design & Algo",
    note: "Focus: Scalability & Database Choice",
  },
  { title: "Behavioral Questions", meta: "10 mins • STAR Method", note: null },
  { title: "Q&A / Feedback", meta: "8 mins • Wrap up", note: null },
];

function GoogleLogo() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="w-8 h-8"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        fill="#EA4335"
      />
      <path
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        fill="#4285F4"
      />
      <path
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        fill="#FBBC05"
      />
      <path
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        fill="#34A853"
      />
      <path d="M0 0h48v48H0z" fill="none" />
    </svg>
  );
}

export default function PracticeSection() {
  const [interviewType, setInterviewType] =
    useState<InterviewTypeId>("technical");
  const [company, setCompany] = useState("google");
  const [difficulty, setDifficulty] = useState(3);
  const [duration, setDuration] = useState(45);
  const [persona, setPersona] = useState("neutral");

  const router = useRouter();
  const diffLabel = DIFFICULTY_LABELS[difficulty - 1];
  const diffBadge = DIFFICULTY_BADGE[difficulty - 1];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Practice Arena
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Configure your mock interview environment. Choose a persona, company
            style, and difficulty level to simulate real-world scenarios.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          AI Services Operational
        </div>
      </div>

      {/* 12-column grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: 8 cols */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Interview Type */}
          <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-icons text-primary">category</span>
              Interview Type
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {INTERVIEW_TYPES.map((t) => {
                const active = interviewType === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setInterviewType(t.id)}
                    className={`relative group p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all ${
                      active
                        ? "border-primary bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {active && (
                      <div className="absolute top-2 right-2 text-primary">
                        <span className="material-icons text-[18px]">
                          check_circle
                        </span>
                      </div>
                    )}
                    <span
                      className={`material-icons text-3xl ${active ? "text-primary" : "text-gray-400 group-hover:text-primary"}`}
                    >
                      {t.icon}
                    </span>
                    <span
                      className={`font-bold text-sm ${active ? "text-primary" : "text-gray-600 dark:text-gray-300 group-hover:text-primary"}`}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Company Presets */}
          <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons text-primary">business</span>
                Company Presets
              </h2>
              <button className="text-xs font-semibold text-primary hover:underline">
                View all companies
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <button
                onClick={() => setCompany("google")}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 bg-white dark:bg-gray-800 hover:shadow-sm ${company === "google" ? "border-blue-400 shadow-sm" : "border-gray-200 dark:border-gray-700 hover:border-blue-400"}`}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <GoogleLogo />
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Google
                </span>
              </button>
              <button
                onClick={() => setCompany("amazon")}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 bg-white dark:bg-gray-800 hover:shadow-sm ${company === "amazon" ? "border-yellow-400 shadow-sm" : "border-gray-200 dark:border-gray-700 hover:border-yellow-500"}`}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="material-icons text-3xl text-gray-800 dark:text-white">
                    shopping_bag
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Amazon
                </span>
              </button>
              <button
                onClick={() => setCompany("meta")}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 bg-white dark:bg-gray-800 hover:shadow-sm ${company === "meta" ? "border-blue-600 shadow-sm" : "border-gray-200 dark:border-gray-700 hover:border-blue-600"}`}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="material-icons text-3xl text-blue-600">
                    public
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Meta
                </span>
              </button>
              <button
                onClick={() => setCompany("netflix")}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 bg-white dark:bg-gray-800 hover:shadow-sm ${company === "netflix" ? "border-red-600 shadow-sm" : "border-gray-200 dark:border-gray-700 hover:border-red-600"}`}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-2xl font-bold text-red-600 tracking-tighter">
                    N
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Netflix
                </span>
              </button>
              <button
                onClick={() => setCompany("custom")}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${company === "custom" ? "border-primary bg-blue-50 dark:bg-blue-900/20" : "border-dashed border-gray-300 dark:border-gray-600 hover:border-primary"}`}
              >
                <span className="material-icons text-2xl text-gray-400">
                  add
                </span>
                <span className="text-xs font-medium text-gray-500">
                  Custom
                </span>
              </button>
            </div>
          </section>

          {/* Parameters + Persona side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-icons text-primary">tune</span>
                Parameters
              </h2>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
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
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {DURATIONS.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                          duration === d
                            ? "border-primary bg-primary text-white font-bold"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {d} min
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-icons text-primary">face</span>
                Interviewer Persona
              </h2>
              <div className="space-y-3">
                {PERSONAS.map((p) => {
                  const active = persona === p.id;
                  return (
                    <label
                      key={p.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        active
                          ? "border-2 border-primary bg-blue-50/50 dark:bg-blue-900/10"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name="persona"
                        checked={active}
                        onChange={() => setPersona(p.id)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-sm text-gray-900 dark:text-white">
                          {p.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {p.desc}
                        </div>
                      </div>
                      <span className="text-xl">{p.emoji}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Right: 4 cols */}
        <div className="col-span-12 lg:col-span-4 space-y-6 flex flex-col">
          {/* Session Preview */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Session Preview
              </h2>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-primary text-xs font-bold px-2 py-1 rounded uppercase">
                Draft
              </span>
            </div>

            <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-6 pb-2 flex-1">
              {SESSION_STEPS.map((step, i) => (
                <div key={step.title} className="relative">
                  <span
                    className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white dark:border-surface-dark ${i === 0 ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                  />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {step.meta}
                  </p>
                  {step.note && (
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
                      {step.note}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Est. Duration
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {duration} Minutes
                </span>
              </div>
              <button
                onClick={() => router.push("/dashboard/prelaunch")}
                className="w-full bg-primary hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 group"
              >
                <span>Launch Session</span>
                <span className="material-icons group-hover:translate-x-1 transition-transform">
                  rocket_launch
                </span>
              </button>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                AI will record and analyze your performance
              </p>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <span className="material-icons" style={{ fontSize: "96px" }}>
                lightbulb
              </span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <span className="material-icons text-sm">tips_and_updates</span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Pro Tip
                </span>
              </div>
              <p className="text-sm font-medium leading-relaxed">
                &ldquo;For system design questions, always clarify requirements
                before jumping into the solution. Ask about scale, users, and
                constraints.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
