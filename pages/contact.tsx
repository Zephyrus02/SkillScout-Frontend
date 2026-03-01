import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const SUBJECTS = [
  "General Inquiry",
  "Technical Support",
  "Billing Question",
  "Feature Request",
  "Partnership",
  "Other",
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/skillscout",
    icon: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com/skillscout",
    icon: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/skillscout",
    icon: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
        />
      </svg>
    ),
  },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    // Simulate async submission — wire up to real API when ready
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  }

  return (
    <>
      <Head>
        <title>Contact Us — SkillScout</title>
        <meta
          name="description"
          content="Have questions about SkillScout? Reach out to our team and we'll get back to you shortly."
        />
      </Head>

      <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans min-h-screen flex flex-col transition-colors duration-300">
        <Navbar />

        <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 lg:px-10 lg:py-20">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* ── Left: Form ─────────────────────────────────────── */}
            <div className="flex flex-col justify-center">
              {/* Header */}
              <div className="mb-8">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                  Contact Us
                </span>
                <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4 text-text-light dark:text-text-dark">
                  We&apos;re here to help you grow.
                </h1>
                <p className="text-lg text-subtext-light dark:text-subtext-dark leading-relaxed">
                  Have questions about your interview prep or need technical
                  support? Fill out the form below and our team will get back to
                  you shortly.
                </p>
              </div>

              {status === "success" ? (
                <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-8 flex flex-col items-center text-center gap-4">
                  <div className="size-14 rounded-full bg-green-100 dark:bg-green-800/40 flex items-center justify-center">
                    <span className="material-icons text-green-600 dark:text-green-400 text-3xl">
                      check_circle
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                    Message sent!
                  </h2>
                  <p className="text-subtext-light dark:text-subtext-dark text-sm">
                    Thanks for reaching out. We&apos;ll get back to you at{" "}
                    <span className="font-semibold text-text-light dark:text-text-dark">
                      {form.email}
                    </span>{" "}
                    within one business day.
                  </p>
                  <button
                    onClick={() => {
                      setStatus("idle");
                      setForm({
                        firstName: "",
                        lastName: "",
                        email: "",
                        subject: SUBJECTS[0],
                        message: "",
                      });
                    }}
                    className="mt-2 text-sm font-semibold text-primary hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Name row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                        First Name
                      </span>
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Enter first name"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary h-12 px-4 text-base placeholder:text-subtext-light dark:placeholder:text-subtext-dark transition-all"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                        Last Name
                      </span>
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Enter last name"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary h-12 px-4 text-base placeholder:text-subtext-light dark:placeholder:text-subtext-dark transition-all"
                      />
                    </label>
                  </div>

                  {/* Email */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                      Email Address
                    </span>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary h-12 px-4 text-base placeholder:text-subtext-light dark:placeholder:text-subtext-dark transition-all"
                    />
                  </label>

                  {/* Subject */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                      Subject
                    </span>
                    <div className="relative">
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary h-12 px-4 pr-10 text-base transition-all"
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-subtext-light dark:text-subtext-dark">
                        <span className="material-icons text-xl">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Message */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                      Message
                    </span>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="How can we help you prepare for your next interview?"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary px-4 py-3 text-base placeholder:text-subtext-light dark:placeholder:text-subtext-dark resize-y transition-all min-h-[140px]"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-2 flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer rounded-xl h-12 px-8 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-blue-500/20"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="material-icons animate-spin text-xl">
                          autorenew
                        </span>
                        Sending…
                      </>
                    ) : (
                      <>
                        <span className="material-icons text-xl">send</span>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ── Right: Info panels ──────────────────────────────── */}
            <div className="flex flex-col gap-5 lg:pt-16">
              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="mailto:support@skillscout.dev"
                  className="group bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3 hover:border-primary/50 transition-colors"
                >
                  <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-icons">mail</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-subtext-light dark:text-subtext-dark">
                      Email us at
                    </p>
                    <p className="font-semibold text-text-light dark:text-text-dark text-base break-all">
                      support@skillscout.dev
                    </p>
                  </div>
                </a>

                <div className="group bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3">
                  <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                    <span className="material-icons">schedule</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-subtext-light dark:text-subtext-dark">
                      Response time
                    </p>
                    <p className="font-semibold text-text-light dark:text-text-dark text-base">
                      Within 1 business day
                    </p>
                  </div>
                </div>
              </div>

              {/* HQ Card with map visual */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-text-light dark:text-text-dark text-lg font-bold">
                      Headquarters
                    </h3>
                    <p className="text-subtext-light dark:text-subtext-dark text-sm mt-0.5">
                      Pune, Maharashtra, India
                    </p>
                  </div>
                  <div className="size-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-subtext-light dark:text-subtext-dark">
                    <span className="material-icons text-lg">location_on</span>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="w-full h-44 rounded-xl overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                  <div
                    className="absolute inset-0 bg-cover bg-center grayscale opacity-50"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
                  {/* Pin */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="size-4 bg-primary rounded-full shadow-[0_0_0_5px_rgba(59,130,246,0.25)] animate-pulse" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-primary" />
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark">
                  Connect with us
                </h3>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-10 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-subtext-light dark:text-subtext-dark flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                    >
                      {icon}
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ nudge */}
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 flex items-center justify-between">
                <div>
                  <p className="text-primary font-bold text-sm">
                    Need faster answers?
                  </p>
                  <p className="text-subtext-light dark:text-subtext-dark text-xs mt-0.5">
                    Check out our knowledge base first.
                  </p>
                </div>
                <Link
                  href="/#features"
                  className="text-primary hover:text-primary-hover text-sm font-semibold flex items-center gap-1 group whitespace-nowrap"
                >
                  Visit FAQ
                  <span className="material-icons text-base transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
