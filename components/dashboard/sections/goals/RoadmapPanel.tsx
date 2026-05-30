import { useRef } from "react";

const roadmapData = [
  {
    id: 1,
    title: "Core Data Structures",
    desc: "Arrays, Strings, Hash Tables & Trees",
    date: "Week 1",
    status: "completed",
    icon: "data_object"
  },
  {
    id: 2,
    title: "Advanced Algorithms",
    desc: "Dynamic Programming, Graphs & Tries",
    date: "Week 2-3",
    status: "in-progress",
    icon: "account_tree"
  },
  {
    id: 3,
    title: "System Design Patterns",
    desc: "Scalability, DBs, Caching",
    date: "Week 4",
    status: "pending",
    icon: "architecture"
  },
  {
    id: 4,
    title: "Behavioral Prep",
    desc: "STAR method stories, Leadership",
    date: "Week 5",
    status: "pending",
    icon: "psychology"
  },
  {
    id: 5,
    title: "Mock Interviews",
    desc: "Peer and Coach sessions",
    date: "Week 6-7",
    status: "pending",
    icon: "groups"
  },
  {
    id: 6,
    title: "Final Polish",
    desc: "Resume review & final prep",
    date: "Week 8",
    status: "pending",
    icon: "workspace_premium"
  },
];

export default function RoadmapPanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="col-span-1 md:col-span-2 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col relative overflow-hidden group h-[340px]">
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />
      
      <div className="flex justify-between items-center mb-6 shrink-0 z-10">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-icons text-blue-600 dark:text-blue-400">route</span>
            Roadmap
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Your step-by-step interview preparation
          </p>
        </div>
      </div>
      
      {/* Scrollable container relative for the animated line */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto relative pr-2 space-y-4 pb-12 z-10 custom-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Background line */}
        <div className="absolute right-3 top-4 bottom-12 w-0.5 bg-gray-100 dark:bg-gray-800 rounded-full z-0" />
        
        {/* Animated fill line */}
        <div 
          className="absolute right-3 top-4 bottom-12 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full z-10 origin-top"
        />

        {/* Steps */}
        {roadmapData.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isInProgress = step.status === "in-progress";

          return (
            <div 
              key={step.id}
              className={`flex items-start justify-between gap-4 p-4 pr-10 relative z-20 transition-all duration-300 rounded-2xl border-l-[3px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none ${
                isInProgress 
                  ? "bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-900/10 dark:to-surface-dark border-blue-500 pb-5"
                  : "bg-white dark:bg-surface-dark border-transparent hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
              }`}
            >
              {/* Icon */}
              <div className={`flex items-center justify-center min-w-[36px] h-[36px] rounded-xl shrink-0 transition-colors ${
                isCompleted ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" :
                isInProgress ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm" :
                "bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
              }`}>
                <span className="material-icons text-[18px]">{step.icon}</span>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-1 gap-2">
                  <h4 className={`text-sm font-bold truncate transition-colors ${
                    isCompleted ? "text-gray-900 dark:text-white" :
                    isInProgress ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-white"
                  }`}>
                    {step.title}
                  </h4>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                    isInProgress 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" 
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}>
                    {step.date}
                  </span>
                </div>
                <p className={`text-xs truncate ${isCompleted ? "text-gray-500 dark:text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
                  {step.desc}
                </p>
              </div>

              {/* Dot on the right */}
              <div className={`absolute top-1/2 -translate-y-1/2 shrink-0 border-[3px] bg-white dark:bg-surface-dark rounded-full flex items-center justify-center z-20 transition-all ${
                isInProgress ? "right-[2px] border-white dark:border-surface-dark w-[20px] h-[20px] shadow-sm"
                : "right-1 border-white dark:border-surface-dark w-[18px] h-[18px]"
              }`}>
                 {isCompleted ? (
                   <div 
                     className="w-2.5 h-2.5 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full" 
                   />
                 ) : isInProgress ? (
                   <div className="relative flex items-center justify-center">
                     <div className="w-2.5 h-2.5 bg-blue-600 rounded-full z-10" />
                   </div>
                 ) : (
                   <div className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
                 )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Scroll hints */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:bg-surface-dark to-transparent pointer-events-none z-20 rounded-b-2xl" />
      <div className="absolute top-[72px] left-0 right-0 h-6 bg-gradient-to-b from-white dark:bg-surface-dark to-transparent pointer-events-none z-20" />
    </div>
  );
}
