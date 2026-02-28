const STEP_TITLES: Record<number, string> = {
  0: "Let's start with the basics",
  1: "Experience & Skills",
  2: "Job Level & Target Roles",
  3: "Skills & Technologies",
  4: "Review & Finish",
};

const TOTAL_STEPS = 5;

interface SetupProgressBarProps {
  currentStep: number; // 0-indexed
}

export default function SetupProgressBar({
  currentStep,
}: SetupProgressBarProps) {
  const fillPercent = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="mb-10">
      {/* Heading + step counter */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-2xl font-bold text-text-light dark:text-text-dark font-display">
          {STEP_TITLES[currentStep]}
        </p>
        <p className="text-sm font-semibold text-subtext-light dark:text-subtext-dark whitespace-nowrap">
          <span className="text-primary font-bold">Step {currentStep + 1}</span>{" "}
          of {TOTAL_STEPS}
        </p>
      </div>

      {/* Progress track */}
      <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all duration-500"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
    </div>
  );
}
