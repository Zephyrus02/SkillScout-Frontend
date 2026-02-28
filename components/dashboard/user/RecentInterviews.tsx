import type { Interview } from "@/types";

const STATUS_STYLES: Record<Interview["status"], string> = {
  pending:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  "in-progress":
    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  completed:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  cancelled: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
};

interface RecentInterviewsProps {
  interviews?: Interview[];
}

export default function RecentInterviews({
  interviews = [],
}: RecentInterviewsProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h3 className="font-display font-semibold text-text-light dark:text-text-dark">
          Recent Interviews
        </h3>
        <button className="text-xs text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {interviews.length === 0 ? (
          <div className="p-10 text-center text-subtext-light dark:text-subtext-dark text-sm">
            <span className="material-icons text-4xl mb-3 block opacity-40">
              assignment
            </span>
            No interviews yet. Start your first mock interview!
          </div>
        ) : (
          interviews.map((interview) => (
            <div
              key={interview.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-icons text-blue-500 text-sm">
                    psychology
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-light dark:text-text-dark">
                    {interview.title}
                  </p>
                  <p className="text-xs text-subtext-light dark:text-subtext-dark capitalize">
                    {interview.type.replace("-", " ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {interview.score !== undefined && (
                  <span className="text-sm font-bold text-text-light dark:text-text-dark">
                    {interview.score}/100
                  </span>
                )}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[interview.status]}`}
                >
                  {interview.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
