import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ─── Data ──────────────────────────────────────────────────────────── */

const VALUES = [
  {
    id: "innovation",
    icon: "lightbulb",
    title: "Innovation First",
    description:
      "We leverage state-of-the-art Large Language Models to create interview scenarios that feel real. We don't just follow trends — we define how AI can be used for personal development.",
    colSpan: "md:col-span-2",
    iconBg: "bg-primary/10 text-primary",
    dark: false,
  },
  {
    id: "empathy",
    icon: "volunteer_activism",
    title: "Candidate Empathy",
    description:
      "We understand the anxiety of job hunting. Every feature is designed to build confidence, not just test skills.",
    colSpan: "",
    iconBg: "bg-rose-100 text-rose-600",
    dark: false,
  },
  {
    id: "unbiased",
    icon: "balance",
    title: "Unbiased Feedback",
    description:
      "AI doesn't judge your appearance or background. We ensure fair, objective evaluations for everyone, everywhere.",
    colSpan: "",
    iconBg: "bg-emerald-100 text-emerald-600",
    dark: false,
  },
  {
    id: "evolution",
    icon: "rocket_launch",
    title: "Constant Evolution",
    description:
      "The job market changes fast. So do we. We continuously update our question banks and AI personas to reflect real-world hiring standards.",
    colSpan: "md:col-span-2",
    iconBg: "bg-white/10 text-white",
    dark: true,
  },
] as const;

const TEAM = [
  {
    name: "Aneesh Raskar",
    role: "Founder & CEO",
    bio: "Software engineer with a passion for democratising interview prep across India.",
    img: "/aneesh.png",
  },
];

const STATS = [
  { value: "50k+", label: "Interviews Conducted" },
  { value: "92%", label: "Offer Success Rate" },
  { value: "120+", label: "Companies Covered" },
  { value: "24/7", label: "AI Availability" },
];

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us — SkillScout</title>
        <meta
          name="description"
          content="Learn about SkillScout's mission to empower engineers with AI-driven mock interviews, unbiased feedback, and personalised growth paths."
        />
        <link rel="canonical" href="https://www.skillscout.dev/about" />
      </Head>

      <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans min-h-screen flex flex-col transition-colors duration-300">
        <Navbar />

        <main className="flex-grow pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* ── Hero ──────────────────────────────────────────── */}
            <section className="py-8 mb-16">
              <div className="relative overflow-hidden rounded-3xl bg-slate-900">
                {/* Background image */}
                <div
                  className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCTLifHTWh6lm9-lpuD78BRrbsdAen0Tco1WaUJ3dvBnHd9g377prz3n841yWEuuT6hSjDa3RL-UHgl93Ck39qG7X8YaZhJ-82Aw5w2A7AbOQ6LCChxfFAGDNi8XWyhhMl51Qeh14hfe8thiVPRXOUHgFwb2jOrdDrJC-jRXpAFJwO86mX0nrG3vYATvy_9MUvS1KqeegdyscfRH_R6fQ3i5kx4xoyPwUJ-FYxWYhvpeqVVqSeUbp6uvukW6T8q1UpTs7hIB0pUIGRB')",
                  }}
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent" />

                <div className="relative z-10 flex min-h-[480px] flex-col items-center justify-center px-6 py-20 text-center md:px-12">
                  <span className="mb-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm ring-1 ring-inset ring-white/20">
                    Transforming Careers with AI
                  </span>
                  <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                    Empowering the Next <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                      Generation of Talent
                    </span>
                  </h1>
                  <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl font-light leading-relaxed">
                    We bridge the gap between potential and opportunity through
                    AI-driven interview preparation, unbiased feedback, and
                    personalised growth paths.
                  </p>
                  <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Link
                      href="/auth/signup"
                      className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-base font-bold text-slate-900 shadow-xl transition-transform hover:scale-105 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                      Join Our Mission
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10 focus:outline-none"
                    >
                      View Open Roles
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Values (Bento Grid) ───────────────────────────── */}
            <section className="mb-20">
              <div className="mb-10 md:flex md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-primary text-sm font-bold uppercase tracking-widest mb-2">
                    Our Values
                  </p>
                  <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-4xl">
                    What Drives Us Forward
                  </h2>
                  <p className="mt-4 text-lg text-subtext-light dark:text-subtext-dark">
                    Our principles are the foundation of our AI technology and
                    community approach. We believe in building tools that are
                    fair, accessible, and cutting-edge.
                  </p>
                </div>
                <a
                  href="#team"
                  className="group hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  Meet the team
                  <span className="material-icons text-[18px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </a>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2 lg:gap-8">
                {/* Innovation First — 2 cols */}
                <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-surface-dark p-8 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/5 transition-shadow hover:shadow-md md:col-span-2">
                  <div className="absolute right-0 top-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-primary/5 blur-3xl transition-colors group-hover:bg-primary/10" />
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <span className="material-icons text-2xl">lightbulb</span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-text-light dark:text-text-dark">
                      Innovation First
                    </h3>
                    <p className="text-subtext-light dark:text-subtext-dark max-w-lg">
                      We leverage state-of-the-art Large Language Models to
                      create interview scenarios that feel real. We don&apos;t
                      just follow trends — we define how AI can be used for
                      personal development.
                    </p>
                  </div>
                  {/* Decoration */}
                  <div className="absolute bottom-4 right-4 h-24 w-24 opacity-10 pointer-events-none">
                    <svg
                      viewBox="0 0 200 200"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.4,70.9,32.2C59.6,43,48.3,51.8,36.4,58.8C24.5,65.8,12.1,71.1,-1.2,73.1C-14.4,75.2,-29.9,74,-42.9,67.6C-55.9,61.2,-66.4,49.6,-74.2,36.5C-82,23.4,-87.1,8.8,-84.9,-4.6C-82.7,-18,-73.2,-30.2,-63,-40.8C-52.8,-51.4,-41.9,-60.4,-30.3,-69.4C-18.7,-78.4,-6.4,-87.4,3.7,-93.8L13.8,-100.2"
                        fill="#3b82f6"
                        transform="translate(100 100)"
                      />
                    </svg>
                  </div>
                </div>

                {/* Candidate Empathy */}
                <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-surface-dark p-8 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/5 transition-shadow hover:shadow-md">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/30 text-rose-600">
                    <span className="material-icons text-2xl">
                      volunteer_activism
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-text-light dark:text-text-dark">
                    Candidate Empathy
                  </h3>
                  <p className="text-subtext-light dark:text-subtext-dark">
                    We understand the anxiety of job hunting. Every feature is
                    designed to build confidence, not just test skills.
                  </p>
                </div>

                {/* Unbiased Feedback */}
                <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-surface-dark p-8 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/5 transition-shadow hover:shadow-md">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                    <span className="material-icons text-2xl">balance</span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-text-light dark:text-text-dark">
                    Unbiased Feedback
                  </h3>
                  <p className="text-subtext-light dark:text-subtext-dark">
                    AI doesn&apos;t judge your appearance or background. We
                    ensure fair, objective evaluations for everyone, everywhere.
                  </p>
                </div>

                {/* Constant Evolution — 2 cols, dark */}
                <div className="group relative overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-sm transition-shadow hover:shadow-md md:col-span-2 text-white">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-60 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
                      <span className="material-icons text-2xl">
                        rocket_launch
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white">
                      Constant Evolution
                    </h3>
                    <p className="text-slate-300 max-w-lg">
                      The job market changes fast. So do we. We continuously
                      update our question banks and AI personas to reflect
                      real-world hiring standards at the world&apos;s top
                      companies.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Team ─────────────────────────────────────────── */}
            <section id="team" className="mb-20">
              <div className="mb-12 text-center">
                <p className="text-primary text-sm font-bold uppercase tracking-widest mb-2">
                  Our Team
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-4xl">
                  The Minds Behind the AI
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-subtext-light dark:text-subtext-dark">
                  A diverse group of engineers, designers, and career coaches
                  united by a single mission.
                </p>
              </div>

              <div className="mx-auto grid w-full max-w-[1216px] grid-cols-[repeat(auto-fit,minmax(220px,280px))] justify-center gap-x-8 gap-y-14">
                {TEAM.map((member) => (
                  <div
                    key={member.name}
                    className="group flex flex-col items-center text-center w-full max-w-[280px]"
                  >
                    <div className="relative mb-5 h-44 w-44 overflow-hidden rounded-full ring-4 ring-white dark:ring-surface-dark shadow-lg transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={member.img}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="176px"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                      {member.name}
                    </h3>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {member.role}
                    </p>
                    <p className="mt-2 text-sm text-subtext-light dark:text-subtext-dark max-w-[200px] leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="mt-4 flex gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <a
                        href="mailto:team@skillscout.dev"
                        className="text-subtext-light dark:text-subtext-dark hover:text-primary transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <span className="material-icons text-xl">mail</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Stats ─────────────────────────────────────────── */}
            <section className="mb-20 rounded-3xl bg-slate-100 dark:bg-surface-dark px-6 py-14 md:px-12">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center divide-x divide-slate-300/40 dark:divide-slate-600/40">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-4xl font-black text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-subtext-light dark:text-subtext-dark mt-2">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── CTA Band ──────────────────────────────────────── */}
            <section className="mb-20">
              <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center shadow-xl shadow-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-indigo-600/30 pointer-events-none" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
                    Ready to land your dream role?
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-blue-100 text-lg">
                    Be a part of the growing community of engineers who use
                    SkillScout to practise smarter and interview with
                    confidence.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                      href="/auth/signup"
                      className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 font-bold text-primary hover:bg-blue-50 transition-colors shadow-lg text-base"
                    >
                      Start for Free
                    </Link>
                    <Link
                      href="/resources"
                      className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 font-bold text-white hover:bg-white/20 transition-colors text-base backdrop-blur-sm"
                    >
                      Read Our Blog
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
