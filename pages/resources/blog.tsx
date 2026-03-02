import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const RELATED = [
  {
    category: "AI Tech",
    categoryColor: "text-primary",
    title: "Understanding LLMs for Technical Interviews",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsnu55m1TZpW75DrEOmW3hstD0bixR6XnazQpBIWb8oWfz_lbsx4JUB9DY87Ww-1NuKsKENtGsNHwgsvbs2a3T28kLLqbqbM1cbsMKKVh6ETO5PN4LlHfid8HFAfHJRjC6JGseVc52WP_ihdx1rghfvbRWkr_hzm6edIKuxqaxHqtpGT4Rv2sWTt9XGW0uBkocnnAAMkvNrrRHQb4u6rnd9BkHuDaUdfFrqAWRoTlbcp7Q4AGv8Xeek7dRIVxhM9bmEjVFXL-4uaP4",
  },
  {
    category: "Career Growth",
    categoryColor: "text-emerald-600",
    title: "Negotiating Your Senior Engineer Offer",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCl35H7oO6sJprcscv7JtX3n_8I_JxZ-Ls6g2BEj7CAVHUu0AfGVMa1nnZtKp7GJ5ZzrjxMvpwtEaVyJYWFUdG14TsWtmZibS1PuIti_Ar_yRjrpsTLR0YgLUZAVdmmBgCuUenKSW_fMy0J_TWaXvmS9nGBjyuprRzM1oDj8NkBRECiB44zuF1L4zo3WWxZVFtXzvl_R15dSAxyU-IbuOVfEQcxoS1nyIyxshN1h-Ljc1N4Ala1lFZkEF3nwa9mFMx8bkk9TuwI-HZw",
  },
  {
    category: "Coding",
    categoryColor: "text-blue-600",
    title: "Top 10 Dynamic Programming Problems",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvEhJWNx5yca6aAZX7FtoVNEcaZgiV6SBSQle-Xe_gbwFnzPth52wawIXLiMbKDxUh9-2w1frcxSbsHUax-zihRmVcgATdju-sG_-C7SQt6swW29AY02YUmNZPVnUVxMz168sq-hUWkVj_4tMnKSvJMMsIxQ-I3uFtbenwjZttGWW3v8YeABH6_N-Njeck4PHk0GyPHETt4ZA-uoXzlvvtB0NZ0212sbrpWTJQwaPPV07PCQVSHITN6h_6PUwCkbZDlE2T4qQ7GU8q",
  },
];

export default function BlogDetailPage() {
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  return (
    <>
      <Head>
        <title>
          Mastering the System Design Interview with AI Assistants | SkillScout
        </title>
        <meta
          name="description"
          content="System design interview strategies, frameworks, and AI practice prompts to improve your interview performance."
        />
      </Head>

      <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans min-h-screen flex flex-col transition-colors duration-300">
        <Navbar />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <article className="lg:col-span-8">
              <nav className="flex items-center gap-2 text-sm text-subtext-light dark:text-subtext-dark mb-6">
                <Link
                  href="/resources"
                  className="hover:text-primary transition-colors"
                >
                  Resources
                </Link>
                <span className="material-icons text-sm">chevron_right</span>
                <span className="font-medium text-text-light dark:text-text-dark">
                  Interview Tips
                </span>
              </nav>

              <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-light dark:text-text-dark mb-6 leading-tight">
                  Mastering the System Design Interview with AI Assistants
                </h1>
                <div className="flex flex-wrap items-center gap-4 py-4 border-y border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden bg-cover bg-center"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJ-NiyPbMJNOSkpVLLMvndAME16NPb92Hi6Sr0TYFjROATBrosTKyPux8zYPc72XOdHI_qrw4VWVeiBg7ZT_hgTK16lNZd2ZOUMlM0uTAxf5vTV2qZZawDq_74Kj06bigCIqOyIyGjUT6Apb5lhK8gstB-s-MpGATjJjtD5UqYbEMQLbkXo7u86LxJU4h2ht2ordFF8DLJxb0U2Ns0ZICh6joZSvWZWBiXLOCEzebtTv7WDqzFIxBjy2Kf7mrBrSZ1S8DJLq6SM6-K')",
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-text-light dark:text-text-dark">
                        David Chen
                      </p>
                      <p className="text-xs text-subtext-light dark:text-subtext-dark">
                        Senior Engineer @ Google
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
                  <div className="flex items-center gap-1 text-sm text-subtext-light dark:text-subtext-dark">
                    <span className="material-icons text-base">schedule</span>
                    <span>5 min read</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-subtext-light dark:text-subtext-dark sm:ml-auto">
                    <span className="material-icons text-base">
                      calendar_today
                    </span>
                    <span>Oct 24, 2023</span>
                  </div>
                </div>
              </header>

              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100 dark:border-gray-800">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDbGcEh9NH-Id57hsMnaXtukxl_13MOrttC9JP6jixFaI18LiuuZmz8eFqcdsGJ8SOlK1b1abrfz-DZWUHuzW-WD7KE6BtrA9XZSvC-IoUWIwqt7EvxZiV3yb3foOEjS-zHgCxngwXRyh7HNOG31ml0l5-BScQK-Wdv9J45tuBvwk-aSWQiXF1vaiov5UGTibMzPTgV7Aqm8QxksrtCJ8GmwHkcJrO2zMw45NlGnacvDSc-7VoRg2_ZJksRn42pEunD1iauQZxbiOWW')",
                  }}
                />
              </div>

              <div className="text-subtext-light dark:text-subtext-dark">
                <p className="text-lg leading-relaxed mb-6">
                  System design interviews are notoriously difficult. Unlike
                  coding rounds where there&apos;s often a single "correct"
                  optimal solution, system design is open-ended, ambiguous, and
                  requires a breadth of knowledge spanning databases,
                  networking, and distributed systems.
                </p>
                <p className="mb-8 leading-relaxed">
                  However, with the rise of AI assistants, candidates now have a
                  powerful tool to practice these scenarios. In this guide,
                  we&apos;ll explore how to leverage AI to simulate realistic
                  interview conditions and receive actionable feedback on your
                  architecture choices.
                </p>

                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4 mt-8">
                  The Framework for Success
                </h2>
                <p className="mb-4 leading-relaxed">
                  Before diving into tools, let&apos;s revisit the standard
                  45-minute system design framework used by top tech companies:
                </p>
                <ul className="space-y-3 mb-8 list-none pl-0">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 size-6 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs mt-0.5">
                      1
                    </span>
                    <span>
                      <strong className="text-text-light dark:text-text-dark">
                        Requirements Clarification (5 min):
                      </strong>{" "}
                      Define the scope, functional requirements, and
                      non-functional constraints.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 size-6 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs mt-0.5">
                      2
                    </span>
                    <span>
                      <strong className="text-text-light dark:text-text-dark">
                        High-Level Design (10-15 min):
                      </strong>{" "}
                      Sketch the core components and how data flows between
                      them.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 size-6 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs mt-0.5">
                      3
                    </span>
                    <span>
                      <strong className="text-text-light dark:text-text-dark">
                        Deep Dive (20 min):
                      </strong>{" "}
                      Focus on bottlenecks, scaling issues, and specific
                      technologies.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 size-6 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs mt-0.5">
                      4
                    </span>
                    <span>
                      <strong className="text-text-light dark:text-text-dark">
                        Wrap Up (5 min):
                      </strong>{" "}
                      Summarize and discuss trade-offs.
                    </span>
                  </li>
                </ul>

                <div className="my-10 p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-l-4 border-violet-500">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-violet-500/10 rounded-lg text-violet-500 shrink-0">
                      <span className="material-icons">lightbulb</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-text-light dark:text-text-dark mb-2">
                        Pro Tip: Focus on Trade-offs
                      </h4>
                      <p className="text-subtext-light dark:text-subtext-dark text-sm leading-relaxed">
                        Interviewers aren&apos;t just looking for the right
                        answer; they want to see your thought process. When
                        choosing a database (SQL vs NoSQL), always explicitly
                        state why you made that choice and what you sacrificed
                        (e.g., consistency for availability).
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                  Simulating the Interview with AI
                </h2>
                <p className="mb-6 leading-relaxed">
                  You can use ChatGPT or Claude as a mock interviewer. Here is a
                  prompt template we&apos;ve found effective for simulating a
                  senior-level system design round:
                </p>

                <div className="bg-slate-900 rounded-lg p-5 text-slate-300 font-mono text-sm overflow-x-auto mb-8 border border-slate-700">
                  <p className="mb-0">
                    "Act as a Staff Engineer at Meta conducting a system design
                    interview. I am the candidate. Ask me to design
                    Instagram&apos;s News Feed. Do not give me the solution.
                    Start by giving me the problem statement, then wait for my
                    clarifying questions. Grade my responses on scalability,
                    reliability, and completeness."
                  </p>
                </div>

                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-3 mt-6">
                  Key Areas to Practice
                </h3>
                <p className="mb-4 leading-relaxed">
                  While every system is unique, certain patterns emerge
                  frequently:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h4 className="font-semibold text-text-light dark:text-text-dark mb-2">
                      Data Sharding
                    </h4>
                    <p className="text-sm text-subtext-light dark:text-subtext-dark">
                      Horizontal scaling strategies based on user ID or
                      geography.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h4 className="font-semibold text-text-light dark:text-text-dark mb-2">
                      Caching Strategies
                    </h4>
                    <p className="text-sm text-subtext-light dark:text-subtext-dark">
                      Write-through vs. write-back, eviction policies (LRU/LFU).
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-8 mb-12">
                {[
                  "#SystemDesign",
                  "#InterviewPrep",
                  "#AI",
                  "#CareerGrowth",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-subtext-light dark:text-subtext-dark text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <hr className="border-gray-200 dark:border-gray-800 mb-10" />

              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 mb-12 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div
                    className="size-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJ-NiyPbMJNOSkpVLLMvndAME16NPb92Hi6Sr0TYFjROATBrosTKyPux8zYPc72XOdHI_qrw4VWVeiBg7ZT_hgTK16lNZd2ZOUMlM0uTAxf5vTV2qZZawDq_74Kj06bigCIqOyIyGjUT6Apb5lhK8gstB-s-MpGATjJjtD5UqYbEMQLbkXo7u86LxJU4h2ht2ordFF8DLJxb0U2Ns0ZICh6joZSvWZWBiXLOCEzebtTv7WDqzFIxBjy2Kf7mrBrSZ1S8DJLq6SM6-K')",
                    }}
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                        David Chen
                      </h3>
                      <button className="text-primary hover:text-primary-hover text-sm font-semibold">
                        Follow
                      </button>
                    </div>
                    <p className="text-subtext-light dark:text-subtext-dark text-sm mb-4 leading-relaxed">
                      Senior Software Engineer at Google working on Cloud
                      Infrastructure. I write about distributed systems,
                      scalability patterns, and helping engineers ace their
                      technical interviews.
                    </p>
                    <div className="flex gap-4">
                      <a
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        href="#"
                        aria-label="Twitter"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        href="#"
                        aria-label="LinkedIn"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">
                    Discussion (12)
                  </h3>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y min-h-[100px]"
                    placeholder="Add to the discussion..."
                  />
                  <div className="flex justify-end mt-3">
                    <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <aside className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-24">
              <div className="rounded-xl p-6 bg-violet-500 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-icons">mail</span>
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
                  <form
                    className="space-y-3"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <input
                      className="w-full px-4 py-2.5 rounded-lg border-none bg-white/20 placeholder:text-violet-100 text-white focus:ring-2 focus:ring-white/50 text-sm outline-none"
                      placeholder="Your email address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      className="w-full py-2.5 rounded-lg bg-white text-violet-500 font-bold text-sm hover:bg-violet-50 transition-colors shadow-sm"
                      type="submit"
                    >
                      Subscribe Free
                    </button>
                  </form>
                  <p className="text-[10px] text-violet-200 mt-3 text-center">
                    No spam, unsubscribe anytime.
                  </p>
                </div>
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
              </div>

              <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-6">
                  Related Articles
                </h3>
                <div className="space-y-6">
                  {RELATED.map((item) => (
                    <Link
                      key={item.title}
                      className="group flex gap-4 items-start"
                      href="/resources/blog"
                    >
                      <div
                        className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 bg-cover bg-center shrink-0 group-hover:opacity-90 transition-opacity"
                        style={{ backgroundImage: `url('${item.image}')` }}
                      />
                      <div>
                        <span
                          className={`text-xs font-semibold ${item.categoryColor} mb-1 block`}
                        >
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-text-light dark:text-text-dark line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-text-light dark:text-text-dark mb-4 uppercase tracking-wider">
                  Share this article
                </h3>
                <div className="flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-subtext-light dark:text-subtext-dark"
                    aria-label="Share on Twitter"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549" />
                    </svg>
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-subtext-light dark:text-subtext-dark"
                    aria-label="Share on LinkedIn"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-subtext-light dark:text-subtext-dark"
                    aria-label="Copy link"
                  >
                    <span className="material-icons text-[20px]">link</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
