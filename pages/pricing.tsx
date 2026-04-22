import React from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PRICING_PLANS } from "@/lib/plans";

/* ─── Data (from shared plans + pricing-specific CTAs) ─────────────────── */

const PLAN_CTAS: Record<string, { cta: string; ctaHref: string }> = {
  trial: { cta: "Start Trial", ctaHref: "/auth/signup?plan=trial" },
  lite: { cta: "Get Lite", ctaHref: "/auth/signup?plan=lite" },
  pro: { cta: "Start 7-Day Free Trial", ctaHref: "/auth/signup?plan=pro" },
  elite: { cta: "Go Elite", ctaHref: "/auth/signup?plan=elite" },
};

const PLANS = PRICING_PLANS.map((p) => ({
  ...p,
  cta: PLAN_CTAS[p.id]?.cta ?? `Get ${p.name}`,
  ctaHref: PLAN_CTAS[p.id]?.ctaHref ?? "/auth/signup",
}));

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing — SkillScout</title>
        <meta
          name="description"
          content="Choose the SkillScout plan that fits your career stage. Start free, or go Pro and Elite for AI mock interviews and advanced interview prep."
        />
        <link rel="canonical" href="https://www.skillscout.dev/pricing" />
      </Head>

      <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans min-h-screen flex flex-col transition-colors duration-300">
        <Navbar />

        <main className="flex-grow relative overflow-hidden pt-16">
          {/* Background decoration */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.08) 40%, transparent 70%)",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            {/* ── Hero ──────────────────────────────────────────── */}
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-text-light dark:text-text-dark">
                Choose Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
                  Growth Path
                </span>
              </h1>
              <p className="text-lg md:text-xl text-subtext-light dark:text-subtext-dark mb-10 max-w-2xl mx-auto leading-relaxed">
                Unlock your potential with AI-driven interview preparation
                designed for every career stage. From students to senior
                engineers.
              </p>
            </div>

            {/* ── Pricing Cards ─────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start mb-24">
              {PLANS.map((plan) => {
                const isPro = plan.id === "pro";
                return (
                  <div
                    key={plan.id}
                    className={isPro ? "relative z-10 lg:-mt-4" : undefined}
                  >
                    {isPro && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                        <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-md whitespace-nowrap">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <PlanCard plan={plan as PlanForCard} featured={isPro} />
                  </div>
                );
              })}
            </div>

            {/* ── Feature Comparison ────────────────────────────── */}
            <div className="mb-24 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 pr-8 text-subtext-light dark:text-subtext-dark font-semibold uppercase tracking-wider text-xs w-1/2">
                      Feature
                    </th>
                    {PLANS.map((p) => (
                      <th
                        key={p.id}
                        className={`text-center py-4 px-4 font-bold ${
                          p.accent === "primary"
                            ? "text-primary"
                            : p.accent === "purple"
                              ? "text-violet-500"
                              : "text-text-light dark:text-text-dark"
                        }`}
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {[
                    {
                      label: "Credits",
                      values: ["300", "500/mo", "800/mo", "1,100/mo"],
                    },
                    {
                      label: "Code Editor & Whiteboard",
                      values: [false, false, true, true],
                    },
                    {
                      label: "Video & Voice Analysis",
                      values: [false, false, true, true],
                    },
                    {
                      label: "AI Behavioral Modes",
                      values: [false, false, true, true],
                    },
                    {
                      label: "Custom Company Presets & Goals",
                      values: [false, false, false, true],
                    },
                    {
                      label: "Support",
                      values: [
                        "Community",
                        "Community",
                        "3-5 business days",
                        "Within 1 day",
                      ],
                    },
                    {
                      label: "Plan Renewal",
                      values: ["14 days", "Monthly", "Monthly", "Monthly"],
                    },
                  ].map((row) => (
                    <tr
                      key={row.label}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-4 pr-8 text-text-light dark:text-text-dark font-medium">
                        {row.label}
                      </td>
                      {row.values.map((v, i) => (
                        <td key={i} className="py-4 px-4 text-center">
                          {typeof v === "boolean" ? (
                            v ? (
                              <span className="material-icons text-primary text-xl">
                                check_circle
                              </span>
                            ) : (
                              <span className="material-icons text-gray-300 dark:text-gray-600 text-xl">
                                remove_circle_outline
                              </span>
                            )
                          ) : (
                            <span className="text-subtext-light dark:text-subtext-dark font-medium">
                              {v}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── FAQ Teaser ────────────────────────────────────── */}
            <div className="max-w-2xl mx-auto text-center border-t border-gray-200 dark:border-gray-700 pt-16">
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                Still have questions?
              </h2>
              <p className="text-subtext-light dark:text-subtext-dark mb-8">
                We have answers. Check out our detailed FAQ or contact our
                support team.
              </p>
              <Link
                href="/resources#faq"
                className="inline-flex items-center gap-1 text-primary font-semibold hover:text-primary-hover transition-colors"
              >
                Visit Help Centre
                <span className="material-icons text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

/* ─── Plan Card ──────────────────────────────────────────────────────── */
type PlanAccent = "default" | "primary" | "purple";

interface PlanForCard {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  cta: string;
  ctaHref?: string;
  accent: PlanAccent;
  badge?: string;
  note?: string;
  features: readonly { text: string; included: boolean }[];
}

function PlanCard({
  plan,
  featured = false,
}: {
  plan: PlanForCard;
  featured?: boolean;
}) {
  const isPrimary = plan.accent === "primary";
  const isPurple = plan.accent === "purple";

  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl p-8 transition-all duration-300 overflow-hidden
        ${
          featured
            ? "border-2 border-primary shadow-2xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 bg-white dark:bg-surface-dark"
            : "border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none hover:-translate-y-1 bg-white dark:bg-surface-dark"
        }
      `}
    >
      {/* Purple glow for elite */}
      {isPurple && (
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Header */}
      <div className="mb-6 relative">
        {isPurple && plan.badge && (
          <div className="absolute top-0 right-0">
            <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] font-bold px-2 py-1 rounded border border-violet-200 dark:border-violet-700 uppercase tracking-wide">
              {plan.badge}
            </span>
          </div>
        )}
        <h3
          className={`text-lg font-bold mb-2 ${
            isPrimary
              ? "text-primary"
              : isPurple
                ? "text-violet-500"
                : "text-text-light dark:text-text-dark"
          }`}
        >
          {plan.name}
        </h3>
        <p className="text-subtext-light dark:text-subtext-dark text-sm h-10 leading-relaxed">
          {plan.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          {plan.monthlyPrice === 0 ? (
            <span className="text-4xl font-black text-text-light dark:text-text-dark">
              Free
            </span>
          ) : (
            <>
              <span className="text-4xl font-black text-text-light dark:text-text-dark">
                ₹{plan.monthlyPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-subtext-light dark:text-subtext-dark font-medium">
                /mo
              </span>
            </>
          )}
        </div>
        {plan.note && (
          <p className="mt-1 text-xs text-subtext-light dark:text-subtext-dark">
            {plan.note}
          </p>
        )}
      </div>

      {/* CTA */}
      <Link
        href={plan.ctaHref ?? "/auth/signup"}
        className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-center transition-all mb-8 block ${
          isPrimary
            ? "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/30"
            : isPurple
              ? "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-text-light dark:text-text-dark"
        }`}
      >
        {plan.cta}
      </Link>

      {/* Features */}
      <div className="space-y-4 flex-grow relative z-10">
        {plan.features.map((feature) => (
          <div
            key={feature.text}
            className={`flex items-start gap-3 ${!feature.included ? "opacity-40" : ""}`}
          >
            <span
              className={`material-icons text-xl shrink-0 ${
                !feature.included
                  ? "text-gray-400"
                  : isPurple
                    ? "text-violet-500"
                    : "text-primary"
              }`}
            >
              {feature.included ? "check_circle" : "remove_circle_outline"}
            </span>
            <span
              className={`text-sm ${
                feature.included
                  ? "text-text-light dark:text-text-dark"
                  : "text-subtext-light dark:text-subtext-dark"
              }`}
            >
              {feature.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
