import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  type BlogPost,
  getAllBlogs,
  getBlogTopics,
  getFeaturedBlog,
} from "@/lib/blogs";

/* ─── Data ──────────────────────────────────────────────────────────── */

type TagColor = "blue" | "purple" | "emerald" | "rose" | "orange" | "indigo";

type Article = BlogPost;

const TAG_COLORS: Record<TagColor, string> = {
  blue: "text-primary bg-white dark:bg-surface-dark",
  purple: "text-purple-600 bg-white dark:bg-surface-dark",
  emerald: "text-emerald-600 bg-white dark:bg-surface-dark",
  rose: "text-rose-600 bg-white dark:bg-surface-dark",
  orange: "text-orange-600 bg-white dark:bg-surface-dark",
  indigo: "text-indigo-600 bg-white dark:bg-surface-dark",
};

const ALL_ARTICLES: Article[] = getAllBlogs();
const FEATURED = getFeaturedBlog();
const TOPICS = getBlogTopics();
const TRENDING = ALL_ARTICLES.slice(1, 5).map((article, index) => ({
  title: article.title,
  when: index === 0 ? "Recently added" : `${index + 1} posts ago`,
  slug: article.slug,
}));

function getTagColor(label: string): TagColor {
  if (label.includes("System") || label.includes("Behavioral")) return "purple";
  if (label.includes("Salary") || label.includes("Offer")) return "emerald";
  if (label.includes("SQL") || label.includes("Data")) return "indigo";
  if (label.includes("Resume")) return "orange";
  if (label.includes("Remote") || label.includes("Communication"))
    return "rose";
  return "blue";
}

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is SkillScout and who is it for?",
    a: "SkillScout is an AI-powered mock interview platform built for software engineers, product managers, data professionals, and college students preparing for placements. We support lateral moves, internal transfers, and campus hiring so you can rehearse coding, design, and behavioural rounds that match your target role and experience level.",
  },
  {
    q: "How does the AI mock interview work?",
    a: "Choose your role, seniority, and topic (system design, coding, behavioural, PM case, or analytics). The AI interviewer conducts a live desktop session with collaborative coding, whiteboarding, and optional voice mode, asking contextual follow-ups like a senior hiring manager. When you finish, you get an instant scorecard with strengths, red flags, and action items tied to real company rubrics.",
  },
  {
    q: "Will my interview recordings be used to train AI models?",
    a: "No. Your personal interview recordings are never used to train our public models unless you explicitly opt in. Sessions are encrypted at rest, processed only to generate your feedback report, and can be deleted from your dashboard at any time in line with our Privacy Policy.",
  },
  {
    q: "Can I practise for a specific company like Google or Amazon?",
    a: "Yes. SkillScout includes company-specific tracks for Google, Amazon, Microsoft, Meta, Flipkart, and fast-growing startups, plus curated flows for Indian campus placements. Each track mirrors the format, difficulty, and evaluation criteria of that employer so your prep maps directly to the loop you care about.",
  },
  {
    q: "What is included in the free tier?",
    a: "The free tier lets you run sample mock interviews across three topic categories, review basic analytics, and download one feedback report per month—no credit card required. To unlock unlimited desktop interviews, voice mode, and advanced analytics, upgrade whenever you’re ready.",
  },
  {
    q: "How accurate is the AI feedback?",
    a: "Our feedback engine is calibrated against thousands of anonymized interview loops that were reviewed by senior hiring managers. It scores technical depth, communication, and execution, then benchmarks you against candidates who recently landed similar offers so you get actionable guidance instead of generic tips.",
  },
  {
    q: "Can I use SkillScout on mobile?",
    a: "You can browse resources and manage your account from any modern mobile browser, but all AI-powered mock interview sessions must be taken on a desktop or laptop. We rely on multi-stream audio, live coding panes, and low-latency transcription that currently require a full browser with microphone access for accurate scoring.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel anytime under Billing & Payments. Your plan remains active until the end of the billing period, no penalties or lock-ins, and you can export your interview history before the subscription expires. Check our Refund Policy for eligibility details.",
  },
];

const ARTICLES_PER_PAGE = 4;

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = ALL_ARTICLES.filter((a) => {
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchTopic = !activeTopic || a.tags.includes(activeTopic);
    return matchSearch && matchTopic;
  });

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ARTICLES_PER_PAGE,
    page * ARTICLES_PER_PAGE,
  );

  function handleTopicClick(topic: string) {
    setActiveTopic((prev) => (prev === topic ? null : topic));
    setPage(1);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  return (
    <>
      <Head>
        <title>Resources & Blog — SkillScout</title>
        <meta
          name="description"
          content="AI interview tips, system design guides, coding patterns, and FAQs to help you land your next tech role."
        />
      </Head>

      <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans min-h-screen flex flex-col transition-colors duration-300">
        <Navbar />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          {/* ── Featured Article ─────────────────────────────────── */}
          <section className="mb-12">
            <div className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-surface-dark rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="lg:col-span-7 relative h-64 lg:h-96 w-full overflow-hidden rounded-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${FEATURED.image.url}')` }}
                />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    Featured
                  </span>
                  <span className="text-sm text-subtext-light dark:text-subtext-dark">
                    {FEATURED.readTime}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-text-light dark:text-text-dark leading-tight">
                  {FEATURED.title}
                </h1>
                <p className="text-lg text-subtext-light dark:text-subtext-dark leading-relaxed">
                  {FEATURED.excerpt}
                </p>
                <div className="pt-4 flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {FEATURED.author.name[0]}
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-text-light dark:text-text-dark">
                        {FEATURED.author.name}
                      </p>
                      <p className="text-subtext-light dark:text-subtext-dark">
                        {FEATURED.author.role}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/resources/blog/${FEATURED.slug}`}
                    className="ml-auto flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    Read Article
                    <span className="material-icons text-lg">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── Main Grid ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Blog Grid (Left) */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
                  Latest Articles
                  {activeTopic && (
                    <span className="ml-2 text-base font-medium text-primary">
                      — {activeTopic}
                    </span>
                  )}
                </h2>
                <div className="flex gap-1">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-subtext-light dark:text-subtext-dark"}`}
                    aria-label="Grid view"
                  >
                    <span className="material-icons">grid_view</span>
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-subtext-light dark:text-subtext-dark"}`}
                    aria-label="List view"
                  >
                    <span className="material-icons">view_list</span>
                  </button>
                </div>
              </div>

              {paged.length === 0 ? (
                <div className="py-20 text-center">
                  <span className="material-icons text-4xl text-subtext-light dark:text-subtext-dark">
                    search_off
                  </span>
                  <p className="mt-3 text-subtext-light dark:text-subtext-dark">
                    No articles match your search.
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveTopic(null);
                    }}
                    className="mt-3 text-sm text-primary font-semibold hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paged.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paged.map((article) => (
                    <ArticleListItem key={article.id} article={article} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav
                    className="flex items-center gap-2"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-subtext-light dark:text-subtext-dark hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
                    >
                      <span className="material-icons text-sm">
                        chevron_left
                      </span>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (n) => (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${n === page ? "bg-primary text-white" : "border border-gray-200 dark:border-gray-700 text-subtext-light dark:text-subtext-dark hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                        >
                          {n}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-subtext-light dark:text-subtext-dark hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
                    >
                      <span className="material-icons text-sm">
                        chevron_right
                      </span>
                    </button>
                  </nav>
                </div>
              )}
            </div>

            {/* Sidebar (Right) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark material-icons text-[20px]">
                  search
                </span>
                <input
                  value={search}
                  onChange={handleSearchChange}
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
                  <h3 className="text-xl font-bold mb-2">
                    Crack the Interview
                  </h3>
                  <p className="text-violet-100 text-sm mb-4 leading-relaxed">
                    Join 50,000+ engineers and placement-focused college
                    students receiving weekly system design tips and coding
                    patterns directly to their inbox.
                  </p>
                  {subscribed ? (
                    <div className="flex items-center gap-2 py-3 text-sm font-semibold text-white bg-white/20 rounded-lg px-4">
                      <span className="material-icons text-lg">
                        check_circle
                      </span>
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
                  {TOPICS.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleTopicClick(topic)}
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
                  <span className="material-icons text-primary">
                    trending_up
                  </span>
                  Trending Now
                </h3>
                <div className="space-y-4">
                  {TRENDING.map((item, i) => (
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
          </div>

          {/* ── FAQ Section ──────────────────────────────────────── */}
          <section className="mt-20" id="faq">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <span className="size-1.5 rounded-full bg-primary inline-block" />
                FAQ
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-text-light dark:text-text-dark tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-subtext-light dark:text-subtext-dark max-w-xl mx-auto">
                Everything you need to know about SkillScout. Can&apos;t find
                the answer?{" "}
                <Link
                  href="/contact"
                  className="text-primary hover:underline font-medium"
                >
                  Contact our team.
                </Link>
              </p>
            </div>

            <div className="max-w-3xl mx-auto divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-surface-dark">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <span className="font-semibold text-text-light dark:text-text-dark text-sm leading-snug">
                      {faq.q}
                    </span>
                    <span
                      className={`material-icons text-subtext-light dark:text-subtext-dark shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    >
                      expand_more
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-subtext-light dark:text-subtext-dark leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Still have questions CTA */}
            <div className="mt-10 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-2xl px-8 py-6 shadow-sm">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-icons text-2xl">support_agent</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-text-light dark:text-text-dark">
                    Still have questions?
                  </p>
                  <p className="text-sm text-subtext-light dark:text-subtext-dark">
                    Our support team is available Mon–Fri, 9am–6pm IST.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="sm:ml-4 shrink-0 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

/* ─── Article Card (grid) ────────────────────────────────────────────── */
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/resources/blog/${article.slug}`} className="block">
      <article className="flex flex-col rounded-xl bg-gray-50 dark:bg-gray-800/60 overflow-hidden group hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div
          className="h-48 w-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${article.image.url}')` }}
          aria-label={article.image.alt}
        />
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs font-semibold px-2 py-1 rounded ${TAG_COLORS[getTagColor(tag)]}`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-subtext-light dark:text-subtext-dark text-sm mb-4 line-clamp-3 flex-grow">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-subtext-light dark:text-subtext-dark pt-4 border-t border-gray-200 dark:border-gray-700">
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ─── Article List Item ──────────────────────────────────────────────── */
function ArticleListItem({ article }: { article: Article }) {
  return (
    <Link href={`/resources/blog/${article.slug}`} className="block">
      <article className="flex gap-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 p-4 group hover:shadow-md transition-all duration-200">
        <div
          className="w-28 h-20 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700 bg-cover bg-center"
          style={{ backgroundImage: `url('${article.image.url}')` }}
          aria-label={article.image.alt}
        />
        <div className="flex flex-col justify-between flex-grow min-w-0">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded ${TAG_COLORS[getTagColor(tag)]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-sm font-bold text-text-light dark:text-text-dark line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-subtext-light dark:text-subtext-dark mt-2">
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
