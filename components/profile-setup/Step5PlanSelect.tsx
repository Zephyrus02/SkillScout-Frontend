import React from "react";

/* ─── Plan data (mirrored from pricing.tsx) ──────────────────────────── */
const PLANS = [
  {
    id: "free",
    name: "Free",
    tagline: "Get started with AI mock interviews. No renewal.",
    monthlyPrice: 0,
    cta: "Select Free",
    accent: "default" as const,
    note: "One-time · doesn't renew",
    features: [
      { text: "5 AI Mock Interviews", included: true },
      { text: "Basic AI Feedback Analysis", included: true },
      { text: "Community Access", included: true },
      { text: "Code Editor & Whiteboard", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For active job seekers needing serious prep.",
    monthlyPrice: 2000,
    cta: "Select Pro",
    accent: "primary" as const,
    badge: "Most Popular",
    features: [
      { text: "10 AI Mock Interviews per month", included: true },
      { text: "Video & Voice Analysis", included: true },
      { text: "AI Behavioral Modes", included: true },
      { text: "Access to Code Editor & Whiteboard", included: true },
      { text: "Priority Support in 3-5 business days", included: true },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "Everything in Pro, plus advanced tools for serious candidates.",
    monthlyPrice: 5000,
    cta: "Select Elite",
    accent: "purple" as const,
    badge: "Best Value",
    features: [
      { text: "20 AI Mock Interviews per month", included: true },
      { text: "Everything in Pro", included: true },
      { text: "Custom Company Presets & Goals", included: true },
      { text: "Priority Support within 1 day", included: true },
    ],
  },
] as const;

type PlanId = "free" | "pro" | "elite";
type PlanAccent = "default" | "primary" | "purple";

interface Feature {
  text: string;
  included: boolean;
}

interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyPrice: number;
  cta: string;
  accent: PlanAccent;
  badge?: string;
  note?: string;
  features: readonly Feature[];
}

/* ─── Plan Card ──────────────────────────────────────────────────────── */
function PlanCard({
  plan,
  featured = false,
  selected,
  onSelect,
}: {
  plan: Plan;
  featured?: boolean;
  selected: boolean;
  onSelect: (id: PlanId) => void;
}) {
  const isPrimary = plan.accent === "primary";
  const isPurple = plan.accent === "purple";

  return (
    <div
      onClick={() => onSelect(plan.id)}
      className={`relative flex flex-col h-full rounded-2xl p-8 transition-all duration-300 overflow-hidden cursor-pointer
        ${
          selected
            ? isPrimary
              ? "border-2 border-primary shadow-2xl shadow-primary/30 ring-2 ring-primary/40 scale-[1.02]"
              : isPurple
                ? "border-2 border-violet-500 shadow-2xl shadow-violet-500/20 ring-2 ring-violet-400/40 scale-[1.02]"
                : "border-2 border-gray-400 dark:border-gray-400 shadow-2xl shadow-gray-300/50 ring-2 ring-gray-400/40 scale-[1.02]"
            : featured
              ? "border-2 border-primary shadow-2xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 bg-white dark:bg-surface-dark"
              : "border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none hover:-translate-y-1 bg-white dark:bg-surface-dark"
        }
        bg-white dark:bg-surface-dark
      `}
    >
      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-4 right-4 z-20">
          <span
            className={`material-icons text-2xl ${
              isPrimary
                ? "text-primary"
                : isPurple
                  ? "text-violet-500"
                  : "text-gray-600 dark:text-gray-300"
            }`}
          >
            check_circle
          </span>
        </div>
      )}

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

      {/* CTA button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(plan.id);
        }}
        className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-center transition-all mb-8 block ${
          selected
            ? isPrimary
              ? "bg-primary text-white shadow-lg shadow-primary/30 ring-2 ring-primary/40"
              : isPurple
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 ring-2 ring-violet-400/40"
                : "bg-gray-800 dark:bg-white text-white dark:text-gray-900 ring-2 ring-gray-400/40"
            : isPrimary
              ? "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/30"
              : isPurple
                ? "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-text-light dark:text-text-dark"
        }`}
      >
        {selected ? (
          <span className="flex items-center justify-center gap-1.5">
            <span className="material-icons text-base">check</span>
            Selected
          </span>
        ) : (
          plan.cta
        )}
      </button>

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

/* ─── Step 5 Plan Select ─────────────────────────────────────────────── */
interface Step5PlanSelectProps {
  selectedPlan: PlanId | null;
  onSelectPlan: (plan: PlanId) => void;
  onContinue: () => void;
  onBack: () => void;
}

export type { PlanId };

export default function Step5PlanSelect({
  selectedPlan,
  onSelectPlan,
  onContinue,
  onBack,
}: Step5PlanSelectProps) {
  return (
    <div className="space-y-8">
      {/* Subtitle */}
      <p className="max-w-3xl text-subtext-light dark:text-subtext-dark text-base leading-relaxed -mt-4">
        Unlock your potential with AI-driven interview preparation designed for
        every career stage. You can always upgrade later.
      </p>

      {/* Plan cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Free */}
        <PlanCard
          plan={PLANS[0]}
          selected={selectedPlan === "free"}
          onSelect={onSelectPlan}
        />

        {/* Pro — featured */}
        <div className="relative z-10 md:-mt-8">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
            <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-md whitespace-nowrap">
              Most Popular
            </span>
          </div>
          <PlanCard
            plan={PLANS[1]}
            featured
            selected={selectedPlan === "pro"}
            onSelect={onSelectPlan}
          />
        </div>

        {/* Elite */}
        <PlanCard
          plan={PLANS[2]}
          selected={selectedPlan === "elite"}
          onSelect={onSelectPlan}
        />
      </div>

      {/* Nav */}
      <div className="max-w-3xl space-y-3 pt-4">
        {!selectedPlan && (
          <p className="text-center text-sm text-subtext-light dark:text-subtext-dark">
            Please select a plan to continue.
          </p>
        )}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark font-medium px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <span className="material-icons text-sm">arrow_back</span> Back
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={!selectedPlan}
            className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <span className="material-icons">arrow_forward</span>
            Review &amp; Finish
          </button>
        </div>
      </div>
    </div>
  );
}
