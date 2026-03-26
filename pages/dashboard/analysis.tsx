import Head from "next/head";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PerformanceCards from "@/components/dashboard/analysis/PerformanceCards";
import TechnicalEvaluation from "@/components/dashboard/analysis/TechnicalEvaluation";
import CommunicationAnalysis from "@/components/dashboard/analysis/CommunicationAnalysis";
import BehavioralInsights from "@/components/dashboard/analysis/BehavioralInsights";
import ImprovementPlan from "@/components/dashboard/analysis/ImprovementPlan";

export default function AnalysisPage() {
  return (
    <DashboardLayout>
      <Head>
        <meta name="robots" content="noindex, nofollow" />

        <title>Interview Analysis Result \u2013 SkillScout</title>
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

      {/* \u2500\u2500 Back link + page header \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
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
                <span className="material-icons text-[15px]">calendar_today</span>
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

      {/* \u2500\u2500 Bento Grid \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <div className="grid grid-cols-12 gap-6 pb-12">
        <PerformanceCards />
        <TechnicalEvaluation />
        <CommunicationAnalysis />
        <BehavioralInsights />
        <ImprovementPlan />
      </div>
    </DashboardLayout>
  );
}
