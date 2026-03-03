// Communication Analysis section with progress bars

export default function CommunicationAnalysis() {
  return (
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
            You tend to over-explain simple concepts. Try the &quot;Bottom Line
            Up Front&quot; (BLUF) method to start answers with the conclusion.
          </p>
        </div>
      </div>
    </div>
  );
}
