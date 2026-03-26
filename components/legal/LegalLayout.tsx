import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

export interface TocItem {
  id: string;
  label: string;
}

interface LegalLayoutProps {
  pageTitle: string;
  title: string;
  description: string;
  effectiveDate: string;
  lastUpdated: string;
  tocItems: TocItem[];
  children: React.ReactNode;
  canonicalPath?: string;
}

export default function LegalLayout({
  pageTitle,
  title,
  description,
  effectiveDate,
  lastUpdated,
  tocItems,
  children,
  canonicalPath,
}: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(
    tocItems[0]?.id ?? "",
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    tocItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  return (
    <>
      <Head>
        <title>{pageTitle} — SkillScout</title>
        <meta name="description" content={description} />
        {canonicalPath && (
          <link
            rel="canonical"
            href={`https://www.skillscout.dev${canonicalPath}`}
          />
        )}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons&display=optional"
        />
      </Head>

      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark px-6 lg:px-10 py-3 shadow-sm">
        <Link
          href="/"
          className="flex items-center"
        >
          <Image
            src="/brandimg.svg"
            alt="SkillScout"
            width={160}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/#features"
            className="text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-primary transition-colors"
          >
            Platform
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/auth/login"
            className="text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-primary transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-5 py-2 rounded-full transition-all shadow-lg shadow-blue-500/30"
          >
            Get Started
          </Link>
        </div>
        <Link
          href="/auth/signup"
          className="md:hidden bg-primary hover:bg-primary-hover text-white text-xs font-medium px-4 py-2 rounded-full transition-all shadow-lg shadow-blue-500/30"
        >
          Get Started
        </Link>
      </header>

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Sticky Sidebar / Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28">
            <nav className="flex flex-col gap-2">
              <h3 className="text-text-light dark:text-text-dark text-xs font-bold uppercase tracking-wider mb-4 px-3">
                On this page
              </h3>
              <ul className="space-y-1">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeSection === item.id
                          ? "text-primary bg-blue-50 dark:bg-blue-900/20"
                          : "text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Legal nav links */}
              <div className="mt-8 p-4 bg-gray-50 dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-bold text-subtext-light dark:text-subtext-dark uppercase tracking-wider mb-3">
                  Legal Documents
                </h4>
                <ul className="space-y-1 text-sm">
                  {[
                    {
                      label: "Terms of Service",
                      href: "/legal/terms-of-service",
                    },
                    { label: "Privacy Policy", href: "/legal/privacy-policy" },
                    {
                      label: "Shipping Policy",
                      href: "/legal/shipping-policy",
                    },
                    { label: "Refund Policy", href: "/legal/refund-policy" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block px-2 py-1.5 text-subtext-light dark:text-subtext-dark hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="col-span-1 lg:col-span-9">
            {/* Header Section */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-subtext-light dark:text-subtext-dark text-xs font-semibold uppercase tracking-wide mb-4">
                <span className="size-2 rounded-full bg-primary inline-block"></span>
                Legal Center
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark tracking-tight mb-4">
                {title}
              </h1>
              <p className="text-lg text-subtext-light dark:text-subtext-dark max-w-2xl">
                {description}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-5 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 flex items-start gap-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-lg">
                  <span className="material-icons text-xl">calendar_month</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-subtext-light dark:text-subtext-dark">
                    Effective Date
                  </p>
                  <p className="text-base font-bold text-text-light dark:text-text-dark">
                    {effectiveDate}
                  </p>
                </div>
              </div>
              <div className="p-5 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 flex items-start gap-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-lg">
                  <span className="material-icons text-xl">update</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-subtext-light dark:text-subtext-dark">
                    Last Updated
                  </p>
                  <p className="text-base font-bold text-text-light dark:text-text-dark">
                    {lastUpdated}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <article className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-10 shadow-sm">
              {/* Decorative Header */}
              <div className="relative w-full h-40 md:h-52 rounded-xl overflow-hidden mb-10 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/10"></div>
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <span className="material-icons text-primary text-5xl opacity-40">
                    gavel
                  </span>
                  <span className="text-xs font-semibold text-subtext-light dark:text-subtext-dark bg-white/80 dark:bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-600">
                    Policy Document v1.0
                  </span>
                </div>
              </div>

              <div className="space-y-12">{children}</div>
            </article>

            {/* Footer */}
            <footer className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-subtext-light dark:text-subtext-dark">
              <p>
                © {new Date().getFullYear()} SkillScout Inc. All rights
                reserved.
              </p>
              <div className="flex gap-6">
                <Link
                  href="/legal/privacy-policy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/legal/terms-of-service"
                  className="hover:text-primary transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/legal/refund-policy"
                  className="hover:text-primary transition-colors"
                >
                  Refund
                </Link>
                <Link
                  href="/legal/shipping-policy"
                  className="hover:text-primary transition-colors"
                >
                  Shipping
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </main>

      {/* Mobile TOC FAB */}
      <div className="fixed bottom-6 right-6 lg:hidden z-40">
        <button
          className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-blue-500/30 hover:bg-primary-hover transition-colors"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <span className="material-icons text-2xl">keyboard_arrow_up</span>
        </button>
      </div>
    </>
  );
}

/* ─── Section helpers ─────────────────────────────────────────────────── */

export function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number | string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section id={id} className="scroll-mt-32">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary text-sm font-bold shrink-0">
            {number}
          </span>
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark m-0">
            {title}
          </h2>
        </div>
        <div className="text-subtext-light dark:text-subtext-dark leading-relaxed space-y-4">
          {children}
        </div>
      </section>
      <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
    </>
  );
}

export function InfoGrid({
  items,
}: {
  items: { icon: string; title: string; description: string }[];
}) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0 mt-4">
      {items.map((item) => (
        <li
          key={item.title}
          className="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
        >
          <span className="material-icons text-primary mt-0.5 shrink-0">
            {item.icon}
          </span>
          <div>
            <h4 className="font-bold text-text-light dark:text-text-dark text-sm mb-1">
              {item.title}
            </h4>
            <p className="text-sm text-subtext-light dark:text-subtext-dark">
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warning" | "success";
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: "bg-blue-50 dark:bg-blue-900/10 border-blue-400 text-blue-800 dark:text-blue-200",
    warning:
      "bg-amber-50 dark:bg-amber-900/10 border-amber-400 text-amber-800 dark:text-amber-200",
    success:
      "bg-green-50 dark:bg-green-900/10 border-green-400 text-green-800 dark:text-green-200",
  };
  return (
    <div className={`mt-4 p-5 border-l-4 rounded-r-lg ${styles[type]}`}>
      <p className="text-sm font-medium">
        <span className="font-bold block mb-1">{title}</span>
        {children}
      </p>
    </div>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-6 mt-2 space-y-2 text-subtext-light dark:text-subtext-dark marker:text-primary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function ContactBlock({
  email,
  emailLabel,
}: {
  email: string;
  emailLabel?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <a
        href={`mailto:${email}`}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-text-light dark:text-text-dark font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="material-icons text-primary">mail</span>
        {emailLabel ?? email}
      </a>
      <Link
        href="/#features"
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-text-light dark:text-text-dark font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="material-icons text-primary">support_agent</span>
        Help Center
      </Link>
    </div>
  );
}
