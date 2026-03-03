import Link from "next/link";
import { FAQS } from "./data";

interface ResourcesFAQProps {
  openFaq: number | null;
  onToggle: (i: number) => void;
}

export default function ResourcesFAQ({ openFaq, onToggle }: ResourcesFAQProps) {
  return (
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
          Everything you need to know about SkillScout. Can&apos;t find the
          answer?{" "}
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
              onClick={() => onToggle(i)}
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
  );
}
