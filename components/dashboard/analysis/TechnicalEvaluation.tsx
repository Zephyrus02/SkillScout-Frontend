import { useState } from "react";
import { TECH_ITEMS } from "./data";

export default function TechnicalEvaluation() {
  const [expanded, setExpanded] = useState<string | null>("arch");
  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  return (
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
                  className={`material-icons ${
                    item.status === "pass"
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }`}
                >
                  {item.status === "pass" ? "check_circle" : "warning"}
                </span>
                <span className="font-medium text-slate-900 dark:text-white text-sm">
                  {item.title}
                </span>
              </div>
              <span
                className={`material-icons text-slate-400 transition-transform duration-200 ${
                  expanded === item.id ? "rotate-180" : ""
                }`}
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
  );
}
