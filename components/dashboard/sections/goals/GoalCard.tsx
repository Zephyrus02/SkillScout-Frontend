// Active Goal card — spans 2 columns

export default function GoalCard() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 col-span-1 md:col-span-2 relative overflow-hidden flex flex-col justify-between h-[280px]">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="flex justify-between items-start relative z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white mb-3 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Active Goal
          </span>
          <h2 className="text-2xl font-bold leading-tight">
            Crack FAANG by April
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Targeting Senior Software Engineer roles
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10 shrink-0">
          <span className="material-icons text-2xl">rocket_launch</span>
        </div>
      </div>
      <div className="relative z-10">
        <div className="flex justify-between text-sm mb-2 font-medium">
          <span className="text-blue-100">Overall Progress</span>
          <span>68%</span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-3 mb-4 backdrop-blur-sm overflow-hidden">
          <div className="bg-white h-3 rounded-full" style={{ width: "68%" }} />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col bg-white/10 rounded-xl p-3 flex-1 border border-white/5 backdrop-blur-sm">
            <span className="text-xs text-blue-200">Days Remaining</span>
            <span className="text-lg font-bold">42 Days</span>
          </div>
          <div className="flex flex-col bg-white/10 rounded-xl p-3 flex-1 border border-white/5 backdrop-blur-sm">
            <span className="text-xs text-blue-200">Current Streak</span>
            <span className="text-lg font-bold">5 Days 🔥</span>
          </div>
        </div>
      </div>
    </div>
  );
}
