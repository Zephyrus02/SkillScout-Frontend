import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50 dark:from-background-dark dark:to-surface-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-text-light dark:text-text-dark mb-6">
          Want to understand how{" "}
          <span className="italic text-primary font-serif">Fast</span> <br />
          you can get hired?
        </h2>
        <p className="text-lg text-subtext-light dark:text-subtext-dark mb-10 max-w-xl mx-auto">
          Join fellow engineers and placement-focused college students who have
          doubled their offer rates using SkillScout. Start your first mock
          interview today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/auth/signup"
            className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/25 text-center"
          >
            Start Free Trial
          </Link>
          <button className="bg-transparent border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            View Pricing
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-background-dark to-transparent pointer-events-none" />
    </section>
  );
}
