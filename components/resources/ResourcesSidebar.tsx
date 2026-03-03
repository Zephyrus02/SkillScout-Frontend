import Link from "next/link";

interface TrendingItem {
  title: string;
  when: string;
  slug: string;
}

interface ResourcesSidebarProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  topics: string[];
  activeTopic: string | null;
  onTopicClick: (topic: string) => void;
  trending: TrendingItem[];
  email: string;
  setEmail: (v: string) => void;
  subscribed: boolean;
  setSubscribed: (v: boolean) => void;
}

export default function ResourcesSidebar({
  search,
  onSearchChange,
  topics,
  activeTopic,
  onTopicClick,
  trending,
  email,
  setEmail,
  subscribed,
  setSubscribed,
}: ResourcesSidebarProps) {
  return (
    <aside className="lg:col-span-4 space-y-6">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark material-icons text-[20px]">
          search
        </span>
        <input
          value={search}
          onChange={onSearchChange}
          type="text"
          placeholder="Search resources..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white dark:bg-surface-dark shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-subtext-light dark:placeholder:text-subtext-dark text-text-light dark:text-text-dark"
        />
      </div>

      {/* Newsletter */}
      <div className="rounded-xl p-6 bg-violet-600 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-icons text-lg">mail</span>
            <span className="font-bold tracking-wide uppercase text-xs opacity-90">
              Newsletter
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2">Crack the Interview</h3>
          <p className="text-violet-100 text-sm mb-4 leading-relaxed">
            Join 50,000+ engineers and placement-focused college students
            receiving weekly system design tips and coding patterns directly to
            their inbox.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-2 py-3 text-sm font-semibold text-white bg-white/20 rounded-lg px-4">
              <span className="material-icons text-lg">check_circle</span>
              You&apos;re subscribed!
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubscribed(true);
              }}
              className="space-y-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-2.5 rounded-lg border-none bg-white/20 placeholder:text-violet-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-white text-violet-600 font-bold text-sm hover:bg-violet-50 transition-colors shadow-sm"
              >
                Subscribe Free
              </button>
            </form>
          )}
          <p className="text-[10px] text-violet-200 mt-3 text-center">
            No spam, unsubscribe anytime.
          </p>
        </div>
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Popular Topics */}
      <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-base font-bold text-text-light dark:text-text-dark mb-4">
          Popular Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => onTopicClick(topic)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                activeTopic === topic
                  ? "bg-primary text-white border border-primary"
                  : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-subtext-light dark:text-subtext-dark hover:bg-primary/5 hover:text-primary hover:border-primary/20"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Now */}
      <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-base font-bold text-text-light dark:text-text-dark mb-4 flex items-center gap-2">
          <span className="material-icons text-primary">trending_up</span>
          Trending Now
        </h3>
        <div className="space-y-4">
          {trending.map((item, i) => (
            <Link
              key={i}
              href={`/resources/blog/${item.slug}`}
              className="group flex items-start gap-3"
            >
              <span className="text-2xl font-bold text-gray-200 dark:text-gray-700 group-hover:text-primary transition-colors leading-none mt-0.5 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-text-light dark:text-text-dark group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h4>
                <span className="text-xs text-subtext-light dark:text-subtext-dark">
                  {item.when}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
