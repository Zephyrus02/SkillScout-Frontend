export default function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-background-light dark:bg-background-dark relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-light dark:text-text-dark mb-4">
            Too Many Tutorials. <br className="hidden md:block" /> Not Enough{" "}
            <span className="italic text-primary font-serif">Practice</span>.
          </h2>
          <p className="text-subtext-light dark:text-subtext-dark max-w-2xl mx-auto">
            Reading about system design isn&apos;t the same as designing one.
            Our platform bridges the gap between theory and execution with
            interactive simulations.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Real-time Code Analysis — tall card */}
          <div className="md:col-span-1 md:row-span-2 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-8 -mt-8" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-auto">
                <h3 className="text-xl font-display font-bold text-text-light dark:text-text-dark mb-2 group-hover:text-primary transition-colors">
                  Real-time Code Analysis
                </h3>
                <p className="text-sm text-subtext-light dark:text-subtext-dark">
                  Our AI reviews your syntax, time complexity, and edge cases
                  instantly as you type.
                </p>
              </div>
              <div className="mt-8 flex-grow bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 font-mono text-xs text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <p>
                  <span className="text-purple-500">def</span>{" "}
                  <span className="text-blue-500">two_sum</span>(nums, target):
                </p>
                <p className="pl-4 text-green-600 dark:text-green-400">
                  # Optimal solution: O(n)
                </p>
                <p className="pl-4">seen = {"{}"}</p>
                <p className="pl-4">
                  <span className="text-purple-500">for</span> i, num{" "}
                  <span className="text-purple-500">in</span> enumerate(nums):
                </p>
                <p className="pl-8">diff = target - num</p>
                <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800/30">
                  <p className="text-blue-600 dark:text-blue-400 font-sans font-semibold">
                    AI Tip:
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-sans">
                    Using a hash map reduces complexity from O(n²) to O(n).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Design Canvas */}
          <div className="md:col-span-2 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 pr-4 z-10">
                <h3 className="text-xl font-display font-bold text-text-light dark:text-text-dark mb-2">
                  System Design Canvas
                </h3>
                <p className="text-sm text-subtext-light dark:text-subtext-dark mb-6">
                  Drag, drop, and architect scalable systems. The AI challenges
                  your choices on databases, caching, and load balancing.
                </p>
                <div className="flex gap-2">
                  {["Load Balancer", "Redis Cache", "PostgreSQL"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-subtext-light dark:text-subtext-dark"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-80">
                  <div className="relative w-full h-32">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg border border-indigo-200 dark:border-indigo-700 flex items-center justify-center">
                      <span className="material-icons text-indigo-500 text-sm">
                        cloud
                      </span>
                    </div>
                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full border border-blue-200 dark:border-blue-700 flex items-center justify-center z-10 shadow-lg">
                      <span className="material-icons text-blue-500">hub</span>
                    </div>
                    <div className="absolute right-0 top-0 w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700 flex items-center justify-center">
                      <span className="material-icons text-green-500 text-sm">
                        storage
                      </span>
                    </div>
                    <div className="absolute right-0 bottom-0 w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700 flex items-center justify-center">
                      <span className="material-icons text-green-500 text-sm">
                        storage
                      </span>
                    </div>
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none stroke-gray-300 dark:stroke-gray-700"
                      style={{ zIndex: 0 }}
                    >
                      <line
                        strokeDasharray="4 4"
                        strokeWidth="2"
                        x1="12%"
                        x2="45%"
                        y1="50%"
                        y2="50%"
                      />
                      <line
                        strokeWidth="2"
                        x1="55%"
                        x2="88%"
                        y1="50%"
                        y2="20%"
                      />
                      <line
                        strokeWidth="2"
                        x1="55%"
                        x2="88%"
                        y1="50%"
                        y2="80%"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Mode */}
          <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                <span className="material-icons">mic</span>
              </div>
              <h3 className="text-lg font-display font-bold text-text-light dark:text-text-dark mb-2">
                Voice Mode
              </h3>
              <p className="text-sm text-subtext-light dark:text-subtext-dark">
                Speak naturally. Our AI analyzes tone, pace, and clarity.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-2/3 animate-pulse" />
              </div>
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
                Listening...
              </span>
            </div>
          </div>

          {/* Benchmarking */}
          <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                  <span className="material-icons">analytics</span>
                </div>
                <span className="text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                  Top 5%
                </span>
              </div>
              <h3 className="text-lg font-display font-bold text-text-light dark:text-text-dark mb-2">
                Benchmarking
              </h3>
              <p className="text-sm text-subtext-light dark:text-subtext-dark mb-4">
                See how you rank against engineers from top tech companies and
                college students racing toward placement season.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-subtext-light dark:text-subtext-dark">
                  <span>Problem Solving</span>
                  <span className="font-bold">92/100</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: "92%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
