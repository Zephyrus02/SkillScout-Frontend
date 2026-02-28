const STEPS = [
  {
    icon: "assignment",
    color: "blue",
    title: "1. Personalized Plan",
    description:
      "Our AI builds a custom interview roadmap based on your target role, experience level, and schedule.",
  },
  {
    icon: "psychology",
    color: "indigo",
    title: "2. Mock Interview",
    description:
      "Take realistic interviews with an AI that mimics senior engineering managers.",
  },
  {
    icon: "verified",
    color: "green",
    title: "3. Instant Feedback",
    description:
      "Get granular feedback on what you did right and where you lost points.",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-500",
  indigo:
    "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 text-indigo-500",
  green:
    "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-500",
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-white dark:bg-background-dark border-y border-gray-100 dark:border-gray-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-light dark:text-text-dark max-w-lg mb-6 md:mb-0">
            The New Physics of Interview Prep. <br />
            <span className="text-primary italic font-serif">10x Faster.</span>
          </h2>
          <p className="text-subtext-light dark:text-subtext-dark max-w-md text-sm md:text-base border-l-2 border-primary pl-4">
            Traditional prep means weeks of grinding LeetCode. Skillscout
            condenses this into targeted, high-impact sessions that adapt to
            your weaknesses immediately.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent border-t border-dashed border-gray-300 dark:border-gray-700 z-0" />
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="relative z-10 bg-white dark:bg-background-dark p-4"
            >
              <div
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-sm border ${colorMap[step.color]}`}
              >
                <span className="material-icons text-4xl">{step.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-subtext-light dark:text-subtext-dark px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Speed comparison */}
        <div className="flex justify-between mt-12 px-4 md:px-20 text-center">
          <div>
            <div className="text-red-500 font-bold text-xl mb-1">5 Weeks</div>
            <div className="text-xs text-subtext-light dark:text-subtext-dark uppercase tracking-wider">
              Without Skillscout
            </div>
          </div>
          <div>
            <div className="text-green-500 font-bold text-xl mb-1">5 Days</div>
            <div className="text-xs text-subtext-light dark:text-subtext-dark uppercase tracking-wider">
              With Skillscout
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
