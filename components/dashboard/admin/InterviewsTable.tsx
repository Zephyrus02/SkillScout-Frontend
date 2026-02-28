import type { Interview } from "@/types";

interface InterviewsTableProps {
  interviews?: Interview[];
}

const STATUS_STYLES: Record<Interview["status"], string> = {
  pending:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  "in-progress":
    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  completed:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  cancelled: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
};

const TYPE_ICONS: Record<Interview["type"], string> = {
  technical: "code",
  behavioral: "psychology",
  "system-design": "hub",
};

export default function InterviewsTable({
  interviews = [],
}: InterviewsTableProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-display font-semibold text-text-light dark:text-text-dark">
          All Interviews
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs text-subtext-light dark:text-subtext-dark uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Score</th>
              <th className="px-6 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {interviews.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-subtext-light dark:text-subtext-dark"
                >
                  No interviews found.
                </td>
              </tr>
            ) : (
              interviews.map((interview) => (
                <tr
                  key={interview.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-text-light dark:text-text-dark">
                    {interview.title}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-subtext-light dark:text-subtext-dark capitalize">
                      <span className="material-icons text-sm">
                        {TYPE_ICONS[interview.type]}
                      </span>
                      {interview.type.replace("-", " ")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_STYLES[interview.status]}`}
                    >
                      {interview.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-light dark:text-text-dark font-medium">
                    {interview.score !== undefined
                      ? `${interview.score}/100`
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-subtext-light dark:text-subtext-dark">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
