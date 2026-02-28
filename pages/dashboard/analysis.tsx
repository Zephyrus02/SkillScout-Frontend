import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// ── Types ──────────────────────────────────────────────────────────────────
interface TechItem {
  id: string;
  status: "pass" | "warn";
  title: string;
  detail: string;
}

interface ImprovementCard {
  priority: "High" | "Medium" | "Low";
  priorityColor: string;
  borderColor: string;
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  actionIcon: string;
}

// ── Static data (replace with real API data) ──────────────────────────────
const TECH_ITEMS: TechItem[] = [
  {
    id: "arch",
    status: "pass",
    title: "React Component Architecture",
    detail:
      "Excellent separation of concerns. You correctly identified the need for a custom hook to handle the API logic, keeping the UI component clean. The use of useMemo for the expensive calculation was spot on.",
  },
  {
    id: "state",
    status: "warn",
    title: "State Management (Redux/Context)",
    detail:
      "While your solution worked, using global state for a localized form modal was overkill. Consider keeping state local or lifting it up one level instead of adding complexity with a global store.",
  },
  {
    id: "scale",
    status: "pass",
    title: "System Design: Scalability",
    detail:
      "Good discussion on caching strategies (CDN + Redis). You proactively addressed potential bottlenecks in the database layer.",
  },
];

const IMPROVEMENT_CARDS: ImprovementCard[] = [
  {
    priority: "High",
    priorityColor: "text-purple-600",
    borderColor: "border-l-purple-500",
    icon: "code",
    title: "Master State Patterns",
    description:
      'Review "Prop Drilling vs Context vs Redux" patterns. Focus on when not to use global state.',
    actionLabel: "View Resources",
    actionIcon: "arrow_forward",
  },
  {
    priority: "Medium",
    priorityColor: "text-amber-500",
    borderColor: "border-l-amber-500",
    icon: "timer",
    title: "Concise Communication",
    description:
      "Practice the STAR method strictly limiting answers to 2 minutes for behavioral questions.",
    actionLabel: "Start Drill",
    actionIcon: "play_circle",
  },
  {
    priority: "Low",
    priorityColor: "text-emerald-500",
    borderColor: "border-l-emerald-500",
    icon: "dns",
    title: "Database Sharding",
    description:
      "Deep dive into database sharding strategies to bolster your system design answers.",
    actionLabel: "Read Article",
    actionIcon: "article",
  },
];

// ── Component ───────────────────────────────────────────────────────────────
export default function AnalysisPage() {
  const [expanded, setExpanded] = useState<string | null>("arch");

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  return (
    <DashboardLayout>
      <Head>
        <title>Interview Analysis Result – SkillScout</title>
        <style>{`
          .progress-ring__circle {
            transition: stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1);
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
          .stagger-1  { animation-delay: 0.05s; opacity: 0; }
          .stagger-2  { animation-delay: 0.12s; opacity: 0; }
          .stagger-3  { animation-delay: 0.20s; opacity: 0; }
          .stagger-4  { animation-delay: 0.28s; opacity: 0; }
        `}</style>
      </Head>

      {/* ── Back link + page header ─────────────────────────────────────── */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-6"
        >
          <span className="material-icons text-lg">arrow_back</span>
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 fade-in-up">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                Senior Frontend Engineer
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-sm flex items-center gap-1">
                <span className="material-icons text-[15px]">
                  calendar_today
                </span>
                Oct 24, 2023
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-sm flex items-center gap-1">
                <span className="material-icons text-[15px]">schedule</span>
                45 mins
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Interview Analysis Result
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm leading-relaxed">
              Detailed breakdown of your performance across technical,
              communication, and behavioral metrics.
            </p>
          </div>

          <div className="flex gap-3 mt-1 shrink-0">
            <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm h-10 whitespace-nowrap">
              <span className="material-icons text-lg mr-2">download</span>
              PDF Report
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition shadow-lg shadow-blue-500/20 h-10 whitespace-nowrap">
              <span className="material-icons text-lg mr-2">share</span>
              Share Result
            </button>
          </div>
        </div>
      </div>

      {/* ── Bento Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6 pb-12">
        {/* ── Left column: Overall Performance + Performance Trend ── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 fade-in-up stagger-1">
          {/* Overall Performance */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Overall Performance
              </h2>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Top 15%
              </span>
            </div>

            <div className="flex items-center justify-center gap-6">
              {/* SVG ring */}
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  <circle
                    className="text-slate-100 dark:text-slate-800"
                    cx="60"
                    cy="60"
                    r="52"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  <circle
                    className="progress-ring__circle text-emerald-500"
                    cx="60"
                    cy="60"
                    r="52"
                    fill="transparent"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="8"
                    style={{
                      strokeDasharray: "326.726",
                      strokeDashoffset: "58.8",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    82%
                  </span>
                </div>
              </div>

              {/* Status + Confidence */}
              <div className="flex flex-col gap-3">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Status
                  </div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-sm">
                    Strong Hire
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Confidence
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white text-sm">
                    High
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Performance Trend
              </h2>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md text-xs font-bold border border-green-100 dark:border-green-900/30">
                <span className="material-icons text-sm">trending_up</span>
                +14%
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              {/* Previous */}
              <div className="flex-1">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Previous
                </div>
                <div className="text-2xl font-bold text-slate-400 dark:text-slate-600">
                  68
                  <span className="text-sm font-normal text-slate-400 ml-1">
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-slate-300 dark:bg-slate-600 h-1.5 rounded-full"
                    style={{ width: "68%" }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Oct 10, 2023
                </div>
              </div>

              {/* Arrow */}
              <div className="pb-3 text-slate-300 dark:text-slate-600">
                <span className="material-icons">arrow_forward</span>
              </div>

              {/* Current */}
              <div className="flex-1">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Current
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  82
                  <span className="text-sm font-normal text-slate-500 ml-1">
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: "82%" }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Today</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
              Significant improvement in technical depth compared to your last
              session. Keep up the momentum!
            </p>
          </div>
        </div>

        {/* ── Technical Evaluation ── */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col fade-in-up stagger-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full" />
              Technical Evaluation
            </h2>
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-lg border border-blue-100 dark:border-blue-900/30">
              Score: 8.5/10
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {TECH_ITEMS.map((item) => (
              <div
                key={item.id}
                className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full text-left p-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-icons ${item.status === "pass" ? "text-emerald-500" : "text-amber-500"}`}
                    >
                      {item.status === "pass" ? "check_circle" : "warning"}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white text-sm">
                      {item.title}
                    </span>
                  </div>
                  <span
                    className={`material-icons text-slate-400 transition-transform duration-200 ${expanded === item.id ? "rotate-180" : ""}`}
                  >
                    expand_more
                  </span>
                </button>
                {expanded === item.id && (
                  <div className="p-4 bg-white dark:bg-surface-dark text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                    {item.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Communication Analysis ── */}
        <div className="col-span-12 lg:col-span-6 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 fade-in-up stagger-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-icons text-purple-500">
                record_voice_over
              </span>
              Communication Analysis
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Tone &amp; Clarity
            </span>
          </div>

          <div className="space-y-6">
            {/* Clarity */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-700 dark:text-slate-200">
                  Clarity of Thought
                </span>
                <span className="text-emerald-500">92%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/30"
                  style={{ width: "92%" }}
                />
              </div>
            </div>
            {/* Empathy */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-700 dark:text-slate-200">
                  Empathy &amp; Listening
                </span>
                <span className="text-purple-500">88%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full shadow-sm shadow-purple-500/30"
                  style={{ width: "88%" }}
                />
              </div>
            </div>
            {/* Conciseness */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-700 dark:text-slate-200">
                  Conciseness
                </span>
                <span className="text-amber-500">74%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full shadow-sm shadow-amber-500/30"
                  style={{ width: "74%" }}
                />
              </div>
            </div>

            {/* Key Feedback callout */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl mt-2">
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1 flex items-center gap-1">
                <span className="material-icons text-sm">tips_and_updates</span>
                Key Feedback
              </h4>
              <p className="text-sm text-purple-800 dark:text-purple-400 leading-relaxed">
                You tend to over-explain simple concepts. Try the &quot;Bottom
                Line Up Front&quot; (BLUF) method to start answers with the
                conclusion.
              </p>
            </div>
          </div>
        </div>

        {/* ── Behavioral Insights ── */}
        <div className="col-span-12 lg:col-span-6 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col fade-in-up stagger-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-icons text-orange-500">
                psychology_alt
              </span>
              Behavioral Insights
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            {/* Growth Mindset */}
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 flex flex-col items-start gap-2 hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors">
              <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg text-green-600 dark:text-green-300">
                <span className="material-icons text-xl">star</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Growth Mindset
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                Demonstrated excellent ability to learn from past failures in
                the &quot;Tell me about a time you failed&quot; question.
              </p>
            </div>

            {/* Collaboration */}
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 flex flex-col items-start gap-2 hover:bg-orange-100/50 dark:hover:bg-orange-900/20 transition-colors">
              <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-lg text-orange-600 dark:text-orange-300">
                <span className="material-icons text-xl">groups</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Collaboration
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                Could emphasize more on &quot;we&quot; instead of &quot;I&quot;
                when discussing team projects to showcase better team spirit.
              </p>
            </div>

            {/* Leadership – full width */}
            <div className="col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="shrink-0 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <span className="material-icons text-2xl text-slate-500 dark:text-slate-300">
                  lightbulb
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Leadership Potential
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  Showed strong initiative in the architectural decision-making
                  process discussion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tailored Improvement Plan ── */}
        <div className="col-span-12 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-surface-dark rounded-2xl shadow-sm border border-indigo-100 dark:border-slate-700 p-8 fade-in-up stagger-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Tailored Improvement Plan
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Actionable steps to reach the Senior+ level based on this
                session.
              </p>
            </div>
            <button className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition whitespace-nowrap flex items-center gap-2">
              <span className="material-icons text-[18px]">calendar_today</span>
              Add to Calendar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {IMPROVEMENT_CARDS.map((card) => (
              <div
                key={card.title}
                className={`bg-white dark:bg-slate-800/50 rounded-xl p-5 border-l-4 ${card.borderColor} shadow-sm hover:shadow-md transition-shadow cursor-pointer group`}
              >
                <div className="flex justify-between mb-3">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${card.priorityColor}`}
                  >
                    Priority: {card.priority}
                  </span>
                  <span className="material-icons text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors">
                    {card.icon}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {card.description}
                </p>
                <a
                  href="#"
                  className={`text-sm font-medium flex items-center gap-1 transition-colors ${card.priorityColor}`}
                >
                  {card.actionLabel}
                  <span className="material-icons text-sm">
                    {card.actionIcon}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
