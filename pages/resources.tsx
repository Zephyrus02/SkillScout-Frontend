import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ─── Data ──────────────────────────────────────────────────────────── */

const FEATURED = {
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDbGcEh9NH-Id57hsMnaXtukxl_13MOrttC9JP6jixFaI18LiuuZmz8eFqcdsGJ8SOlK1b1abrfz-DZWUHuzW-WD7KE6BtrA9XZSvC-IoUWIwqt7EvxZiV3yb3foOEjS-zHgCxngwXRyh7HNOG31ml0l5-BScQK-Wdv9J45tuBvwk-aSWQiXF1vaiov5UGTibMzPTgV7Aqm8QxksrtCJ8GmwHkcJrO2zMw45NlGnacvDSc-7VoRg2_ZJksRn42pEunD1iauQZxbiOWW",
  tag: "Featured",
  readTime: "5 min read",
  title: "Mastering the System Design Interview with AI Assistants",
  excerpt:
    "Learn how our AI tools simulate real-world system design scenarios to help you crack the toughest tech interviews at top tier companies.",
  author: { name: "Priya Sharma", role: "Principal Engineer @ Flipkart" },
};

type TagColor = "blue" | "purple" | "emerald" | "rose" | "orange" | "indigo";

interface Article {
  id: number;
  image: string;
  alt: string;
  tags: { label: string; color: TagColor }[];
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

const TAG_COLORS: Record<TagColor, string> = {
  blue: "text-primary bg-white dark:bg-surface-dark",
  purple: "text-purple-600 bg-white dark:bg-surface-dark",
  emerald: "text-emerald-600 bg-white dark:bg-surface-dark",
  rose: "text-rose-600 bg-white dark:bg-surface-dark",
  orange: "text-orange-600 bg-white dark:bg-surface-dark",
  indigo: "text-indigo-600 bg-white dark:bg-surface-dark",
};

const ALL_ARTICLES: Article[] = [
  {
    id: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsnu55m1TZpW75DrEOmW3hstD0bixR6XnazQpBIWb8oWfz_lbsx4JUB9DY87Ww-1NuKsKENtGsNHwgsvbs2a3T28kLLqbqbM1cbsMKKVh6ETO5PN4LlHfid8HFAfHJRjC6JGseVc52WP_ihdx1rghfvbRWkr_hzm6edIKuxqaxHqtpGT4Rv2sWTt9XGW0uBkocnnAAMkvNrrRHQb4u6rnd9BkHuDaUdfFrqAWRoTlbcp7Q4AGv8Xeek7dRIVxhM9bmEjVFXL-4uaP4",
    alt: "Abstract AI neural network visualization",
    tags: [{ label: "AI Tech", color: "blue" }],
    title: "Understanding LLMs for Technical Interviews",
    excerpt:
      "Large Language Models are changing how we code. Here's what you need to know about transformers and attention mechanisms for your next ML interview.",
    date: "Feb 24, 2026",
    readTime: "8 min read",
  },
  {
    id: 2,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDm0VDKxoNfQyrW8k0cU-APvCnxE5RAcOjDqp0J9G3VR6FbW2gR8yIJM6Verh9MPWWRAfAtncnacqm8ip6hHQEPXsoXYr5Mz_e5f7CqU6yEc9cwbykdEj7MbwXiuCrx5V-K4HSZByz4_v3vfLFPnbV5NuVn4S36WBhFt45DDGEn-ELjed6Qj1RQhkBzdpopOgjp3e8XqYLAsvzP9wKlkCAZy6Rl-rCfia1xwefK4R3b56za4R13uKl3XND9P1B4KgVaonWXk1wef0pJ",
    alt: "Professional in a confident interview setting",
    tags: [
      { label: "Interview Tips", color: "blue" },
      { label: "Soft Skills", color: "purple" },
    ],
    title: 'How to Answer "Tell Me About Yourself"',
    excerpt:
      "The opening question sets the tone. Learn the frameworks to craft a compelling narrative that highlights your strengths without rambling.",
    date: "Feb 22, 2026",
    readTime: "4 min read",
  },
  {
    id: 3,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCl35H7oO6sJprcscv7JtX3n_8I_JxZ-Ls6g2BEj7CAVHUu0AfGVMa1nnZtKp7GJ5ZzrjxMvpwtEaVyJYWFUdG14TsWtmZibS1PuIti_Ar_yRjrpsTLR0YgLUZAVdmmBgCuUenKSW_fMy0J_TWaXvmS9nGBjyuprRzM1oDj8NkBRECiB44zuF1L4zo3WWxZVFtXzvl_R15dSAxyU-IbuOVfEQcxoS1nyIyxshN1h-Ljc1N4Ala1lFZkEF3nwa9mFMx8bkk9TuwI-HZw",
    alt: "Team celebrating a successful job offer",
    tags: [{ label: "Career Growth", color: "emerald" }],
    title: "Negotiating Your Senior Engineer Offer",
    excerpt:
      "Don't leave money on the table. Strategies for leveraging competing offers and understanding equity packages in 2026.",
    date: "Feb 19, 2026",
    readTime: "12 min read",
  },
  {
    id: 4,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvEhJWNx5yca6aAZX7FtoVNEcaZgiV6SBSQle-Xe_gbwFnzPth52wawIXLiMbKDxUh9-2w1frcxSbsHUax-zihRmVcgATdju-sG_-C7SQt6swW29AY02YUmNZPVnUVxMz168sq-hUWkVj_4tMnKSvJMMsIxQ-I3uFtbenwjZttGWW3v8YeABH6_N-Njeck4PHk0GyPHETt4ZA-uoXzlvvtB0NZ0212sbrpWTJQwaPPV07PCQVSHITN6h_6PUwCkbZDlE2T4qQ7GU8q",
    alt: "Code on a dark monitor screen",
    tags: [{ label: "Coding Challenges", color: "indigo" }],
    title: "Top 10 Dynamic Programming Problems",
    excerpt:
      "A curated list of must-solve DP problems to master the pattern before your onsite interview at FAANG companies.",
    date: "Feb 15, 2026",
    readTime: "15 min read",
  },
  {
    id: 5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsnu55m1TZpW75DrEOmW3hstD0bixR6XnazQpBIWb8oWfz_lbsx4JUB9DY87Ww-1NuKsKENtGsNHwgsvbs2a3T28kLLqbqbM1cbsMKKVh6ETO5PN4LlHfid8HFAfHJRjC6JGseVc52WP_ihdx1rghfvbRWkr_hzm6edIKuxqaxHqtpGT4Rv2sWTt9XGW0uBkocnnAAMkvNrrRHQb4u6rnd9BkHuDaUdfFrqAWRoTlbcp7Q4AGv8Xeek7dRIVxhM9bmEjVFXL-4uaP4",
    alt: "System architecture diagram on whiteboard",
    tags: [{ label: "System Design", color: "purple" }],
    title: "Designing a Scalable Job Board Like LinkedIn",
    excerpt:
      "Walk through the architecture decisions behind a large-scale job platform: database sharding, search indexing, and notification pipelines.",
    date: "Feb 10, 2026",
    readTime: "10 min read",
  },
  {
    id: 6,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDm0VDKxoNfQyrW8k0cU-APvCnxE5RAcOjDqp0J9G3VR6FbW2gR8yIJM6Verh9MPWWRAfAtncnacqm8ip6hHQEPXsoXYr5Mz_e5f7CqU6yEc9cwbykdEj7MbwXiuCrx5V-K4HSZByz4_v3vfLFPnbV5NuVn4S36WBhFt45DDGEn-ELjed6Qj1RQhkBzdpopOgjp3e8XqYLAsvzP9wKlkCAZy6Rl-rCfia1xwefK4R3b56za4R13uKl3XND9P1B4KgVaonWXk1wef0pJ",
    alt: "Resume being reviewed",
    tags: [
      { label: "Resume Tips", color: "orange" },
      { label: "Career Growth", color: "emerald" },
    ],
    title: "Resume Checklist: What FAANG Recruiters Actually Look For",
    excerpt:
      "A 10-point checklist built from recruiter feedback at top tech companies. Cut fluff, quantify impact, and get past the ATS filter.",
    date: "Feb 5, 2026",
    readTime: "6 min read",
  },
];

const TOPICS = [
  "System Design",
  "Python",
  "Behavioral",
  "Meta",
  "Mock Interviews",
  "Resume Reviews",
  "DSA",
  "SQL",
  "Salary Negotiation",
];

const TRENDING = [
  {
    title: "Amazon Leadership Principles: The Complete Guide",
    when: "Yesterday",
  },
  { title: "Designing a URL Shortener like Bit.ly", when: "2 days ago" },
  { title: "Salary Negotiation Scripts That Work", when: "5 days ago" },
  { title: "Top 15 React Interview Questions in 2026", when: "1 week ago" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is SkillScout and who is it for?",
    a: "SkillScout is an AI-powered mock interview platform designed for software engineers, product managers, and data professionals preparing for technical and behavioural interviews at top tech companies. Whether you're a recent graduate or a senior engineer switching teams, SkillScout adapts to your level.",
  },
  {
    q: "How does the AI mock interview work?",
    a: "You choose a role, seniority level, and topic (system design, coding, behavioural, etc.). The AI interviewer asks contextual follow-up questions based on your answers — just like a real interview. After each session, you receive a detailed feedback report with scores, strengths, and areas to improve.",
  },
  {
    q: "Will my interview recordings be used to train AI models?",
    a: "No. Your personal interview recordings are never used to train our public foundational models without your explicit opt-in consent. All real-time AI processing is strictly for generating your personal feedback report. You can review our Privacy Policy for full details.",
  },
  {
    q: "Can I practise for a specific company like Google or Amazon?",
    a: "Yes. SkillScout offers company-specific interview tracks covering the unique formats, question banks, and evaluation criteria of leading tech companies including Google, Amazon, Microsoft, Meta, Flipkart, and more.",
  },
  {
    q: "What is included in the free tier?",
    a: "The free tier gives you access to sample mock interview sessions across 3 topic categories, basic performance analytics, and one downloadable feedback report per month. No credit card required to sign up.",
  },
  {
    q: "How accurate is the AI feedback?",
    a: "Our feedback engine is trained on thousands of real interview patterns and evaluated by senior engineers from top tech companies. It scores your answers on technical accuracy, communication clarity, structure, and depth — providing actionable, specific suggestions rather than generic advice.",
  },
  {
    q: "Can I use SkillScout on mobile?",
    a: "Yes. SkillScout is fully responsive and works on any modern browser on desktop, tablet, or mobile. Voice-based mock interview sessions require microphone access and work best on desktop for the most accurate transcription.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel anytime from your account settings under Billing & Payments. Cancellation stops future charges at the end of the current billing period — you keep access until then. Please refer to our Refund Policy for details on refund eligibility.",
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
    const matchTopic =
      !activeTopic || a.tags.some((t) => t.label === activeTopic);
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
                  style={{ backgroundImage: `url('${FEATURED.image}')` }}
                />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {FEATURED.tag}
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
                    href="/resources/blog"
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
                    Join 50,000+ engineers receiving weekly system design tips
                    and coding patterns directly to their inbox.
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
                    <a
                      key={i}
                      href="#"
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
                    </a>
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
    <Link href="/resources/blog" className="block">
      <article className="flex flex-col rounded-xl bg-gray-50 dark:bg-gray-800/60 overflow-hidden group hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div
          className="h-48 w-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${article.image}')` }}
          aria-label={article.alt}
        />
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.map((tag) => (
              <span
                key={tag.label}
                className={`text-xs font-semibold px-2 py-1 rounded ${TAG_COLORS[tag.color]}`}
              >
                {tag.label}
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
    <Link href="/resources/blog" className="block">
      <article className="flex gap-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 p-4 group hover:shadow-md transition-all duration-200">
        <div
          className="w-28 h-20 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700 bg-cover bg-center"
          style={{ backgroundImage: `url('${article.image}')` }}
          aria-label={article.alt}
        />
        <div className="flex flex-col justify-between flex-grow min-w-0">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {article.tags.map((tag) => (
                <span
                  key={tag.label}
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded ${TAG_COLORS[tag.color]}`}
                >
                  {tag.label}
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
