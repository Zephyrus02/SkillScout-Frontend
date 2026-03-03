import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAllBlogs, getBlogTopics, getFeaturedBlog } from "@/lib/blogs";
import {
  ArticleCard,
  ArticleListItem,
  type Article,
} from "@/components/resources/ArticleCards";
import ResourcesSidebar from "@/components/resources/ResourcesSidebar";
import ResourcesFAQ from "@/components/resources/ResourcesFAQ";
import { ARTICLES_PER_PAGE } from "@/components/resources/data";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const ALL_ARTICLES: Article[] = getAllBlogs();
const FEATURED = getFeaturedBlog();
const TOPICS = getBlogTopics();
const TRENDING = ALL_ARTICLES.slice(1, 5).map((article, index) => ({
  title: article.title,
  when: index === 0 ? "Recently added" : `${index + 1} posts ago`,
  slug: article.slug,
}));

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
            <ResourcesSidebar
              search={search}
              onSearchChange={handleSearchChange}
              topics={TOPICS}
              activeTopic={activeTopic}
              onTopicClick={handleTopicClick}
              trending={TRENDING}
              email={email}
              setEmail={setEmail}
              subscribed={subscribed}
              setSubscribed={setSubscribed}
            />
          </div>

          {/* ── FAQ Section ──────────────────────────────────────── */}
          <ResourcesFAQ
            openFaq={openFaq}
            onToggle={(i) => setOpenFaq(openFaq === i ? null : i)}
          />
        </main>

        <Footer />
      </div>
    </>
  );
}
