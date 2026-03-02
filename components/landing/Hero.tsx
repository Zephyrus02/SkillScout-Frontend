import Link from "next/link";

const COMPANIES = ["Google", "Meta", "Amazon", "Netflix", "Uber"];

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] aurora-orb rounded-full animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        {/* <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 relative mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            New: GPT-4o Voice Integration
          </span>
        </div> */}

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-display font-bold text-text-light dark:text-text-dark tracking-tight mb-6 leading-tight">
          Practice for Interviews with
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 italic font-serif">
            AI‑Driven Mock Sessions
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-subtext-light dark:text-subtext-dark mb-10 leading-relaxed">
          Run live, interactive mock interviews powered by AI that mimic real
          technical and behavioral questions. Receive instant feedback on your
          coding speed, answer structure, and communication so you can build
          confidence before the big day. Built for software engineers, product
          managers, data professionals, and college students preparing for
          placements.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/auth/signup"
            className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-lg font-semibold text-sm hover:scale-105 transition-transform duration-200 shadow-xl flex items-center shadow-blue-500/30"
          >
            Start Mock Interview
            <span className="material-icons text-sm ml-2">arrow_forward</span>
          </Link>
          <button className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-light dark:text-text-dark px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center">
            <span className="material-icons text-sm mr-2 text-primary">
              play_circle
            </span>
            Watch How it Works
          </button>
        </div>

        {/* Company logos */}
        <div className="mt-16 pt-8">
          <p className="text-xs font-semibold text-subtext-light dark:text-subtext-dark uppercase tracking-widest mb-6">
            Trusted by candidates landing offers at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {COMPANIES.map((co) => (
              <div
                key={co}
                className="font-display font-bold text-xl text-gray-400 dark:text-gray-500"
              >
                {co}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
