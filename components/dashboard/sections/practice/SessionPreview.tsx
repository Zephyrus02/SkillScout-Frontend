import { useRouter } from "next/router";
import type { InterviewTypeId } from "./data";
import { getSessionSections, getTotalDuration } from "./data";

interface Props {
  interviewType: InterviewTypeId;
  planSlug: string | null;
}

export default function SessionPreview({ interviewType, planSlug }: Props) {
  const router = useRouter();
  const sections = getSessionSections(interviewType, planSlug);
  const totalDuration = getTotalDuration(sections);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-148 max-h-148 flex flex-col">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
        <span className="material-icons text-primary">preview</span>
        Session Preview
      </h2>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {sections.map((section, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                {i + 1}
              </div>
              {i < sections.length - 1 && (
                <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700 mt-1" />
              )}
            </div>
            <div className="pb-2">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {section.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {section.targetMinutes} mins
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Duration summary */}
      <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 mb-5">
          <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <span className="material-icons text-[18px]">schedule</span>
            Total Duration
          </span>
          <span className="font-bold text-gray-900 dark:text-white">
            ~{totalDuration} minutes
          </span>
        </div>

        {/* Launch button */}
        <button
          onClick={() => {
            if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
              document.documentElement.requestFullscreen?.().catch((err) => {
                console.warn("Fullscreen request failed:", err);
              });
            }
            router.push("/dashboard/prelaunch");
          }}
          className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/30"
        >
          <span className="material-icons">play_arrow</span>
          Launch Session
        </button>
      </div>
    </div>
  );
}
