import { MoreVertical } from "lucide-react";
import { renewals } from "./data";

export default function UpcomingRenewals() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Upcoming Renewals
        </h4>
        <span className="text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </span>
      </div>
      <div className="space-y-3">
        {renewals.map((r) => (
          <div
            key={r.company}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-center">
              {r.date.split("\n").map((line, i) => (
                <span
                  key={i}
                  className={`block text-primary ${
                    i === 0
                      ? "text-[9px] font-bold"
                      : "text-[11px] font-bold leading-none"
                  }`}
                >
                  {line}
                </span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                {r.company}
              </p>
              <p className="truncate text-xs text-slate-500">
                {r.plan} &bull; {r.amount}
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 text-slate-400 hover:text-slate-600"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white transition hover:opacity-90 dark:bg-primary"
      >
        View All Renewals
      </button>
    </section>
  );
}
