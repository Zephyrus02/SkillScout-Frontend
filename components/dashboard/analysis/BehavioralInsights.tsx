// Behavioral insights cards section

export default function BehavioralInsights() {
  return (
    <div className="col-span-12 lg:col-span-6 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col fade-in-up stagger-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-icons text-orange-500">psychology_alt</span>
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
            Demonstrated excellent ability to learn from past failures in the
            &quot;Tell me about a time you failed&quot; question.
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
            Could emphasize more on &quot;we&quot; instead of &quot;I&quot; when
            discussing team projects to showcase better team spirit.
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
  );
}
