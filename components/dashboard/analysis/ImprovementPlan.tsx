import { IMPROVEMENT_CARDS } from "./data";

export default function ImprovementPlan() {
  return (
    <div className="col-span-12 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-surface-dark rounded-2xl shadow-sm border border-indigo-100 dark:border-slate-700 p-8 fade-in-up stagger-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Tailored Improvement Plan
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Actionable steps to reach the Senior+ level based on this session.
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
              <span className="material-icons text-sm">{card.actionIcon}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
