import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

export default function SpeedDemo() {
  return (
    <section className="py-24 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-light dark:text-text-dark">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 font-serif italic">
              10x Speed
            </span>{" "}
            To Your Dream Job.
          </h2>
          <p className="mt-4 text-subtext-light dark:text-subtext-dark">
            Outcome-driven delivery model where AI acts as your personal
            interviewer.
          </p>
        </div>

        {/* Demo card */}
        <div className="relative bg-gray-50 dark:bg-background-dark rounded-xl p-4 md:p-8 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-surface-dark h-full w-full pointer-events-none z-20 opacity-20" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar skeleton */}
            <div className="hidden md:block col-span-2 bg-white dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-700/50 p-4 space-y-4">
              <div className="h-8 w-24 bg-gray-100 dark:bg-gray-800 rounded mb-6" />
              <div className="h-4 w-full bg-blue-50 dark:bg-blue-900/20 rounded border-l-2 border-primary" />
              <div className="h-4 w-3/4 bg-gray-50 dark:bg-gray-800/50 rounded" />
              <div className="h-4 w-5/6 bg-gray-50 dark:bg-gray-800/50 rounded" />
            </div>

            {/* Main content */}
            <div className="col-span-12 md:col-span-10 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
                    System Design: Twitter Newsfeed
                  </h3>
                  <p className="text-sm text-subtext-light dark:text-subtext-dark">
                    Session ID: #8293-A • 45 mins
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold">
                  Passed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video Analysis */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-700/50">
                  <div className="flex items-center mb-4">
                    <Icon
                      name="videocam"
                      className="mr-2 size-5 text-blue-500"
                    />
                    <h4 className="font-semibold text-text-light dark:text-text-dark">
                      Video Analysis
                    </h4>
                  </div>
                  <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 overflow-hidden group">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl_KyRCB6X0LixZQnCkheNgINCzHzL1tKa7JS8CqjMftMGvtDBpcshfdC1-d2rH9aJuKWJPGD3xoQfTq4fdwlv9EB__jrcbnV8Ea0atisDAaq0YDXOeoF4i52ih7OI1QuC_1Bt1J3QPpizid4qG1pyv31dwig-XqYajfH9lh7cp6btrXxeBFDEENhz24HyCKVmwcoDwfpvF4uyzz1GVl81WWxDuug4917n6K15a2rDN1fZtNTemi7THOq0yDmuYV1zXgiFWsVsvKzZ"
                      alt="Interview video analysis preview"
                      fill
                      sizes="(min-width: 768px) 480px, 100vw"
                      className="object-cover opacity-80"
                      priority={false}
                    />
                    <button className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform">
                      <Icon name="play_arrow" className="size-6 text-primary" />
                    </button>
                  </div>
                  <p className="text-xs text-subtext-light dark:text-subtext-dark">
                    Your eye contact was consistent, but pace slowed down during
                    the sharding explanation.
                  </p>
                </div>

                {/* Whiteboard Snapshot */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-700/50">
                  <div className="flex items-center mb-4">
                    <span className="material-icons text-purple-500 mr-2">
                      code
                    </span>
                    <h4 className="font-semibold text-text-light dark:text-text-dark">
                      Whiteboard Snapshot
                    </h4>
                  </div>
                  <div className="w-full aspect-video bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 relative">
                    <div className="flex justify-around items-center h-full opacity-60">
                      <div className="w-10 h-10 border-2 border-gray-400 rounded" />
                      <div className="h-px w-10 bg-gray-400" />
                      <div className="w-10 h-10 border-2 border-gray-400 rounded-full" />
                      <div className="h-px w-10 bg-gray-400" />
                      <div className="w-10 h-10 border-2 border-gray-400 rounded-lg" />
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-[10px] rounded">
                      AI Generated
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {["Fan-out Service", "Redis"].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs border border-gray-200 dark:border-gray-700 px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 text-subtext-light dark:text-subtext-dark"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
