/**
 * Shared plan definitions for pricing page, profile setup, and settings.
 * Single source of truth for plan metadata.
 */

export type PlanAccent = "default" | "primary" | "purple";

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanDefinition {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  accent: PlanAccent;
  badge?: string;
  note?: string;
  creditAllowance: number;
  bonusCredits: number;
  features: readonly PlanFeature[];
  /** Trial only: validity in days */
  validityDays?: number;
}

export const PLAN_DEFINITIONS: Record<string, PlanDefinition> = {
  trial: {
    id: "trial",
    name: "Trial",
    tagline: "Try SkillScout for 14 days. No payment required.",
    monthlyPrice: 0,
    accent: "default",
    note: "14 days · no renewal",
    validityDays: 14,
    creditAllowance: 300,
    bonusCredits: 0,
    features: [
      { text: "300 credits (14-day trial)", included: true },
      { text: "Basic AI Feedback Analysis", included: true },
      { text: "Community Access", included: false },
      { text: "Code Editor & Whiteboard", included: false },
    ],
  },
  lite: {
    id: "lite",
    name: "Lite",
    tagline: "A lite version to get started with AI mock interviews.",
    monthlyPrice: 1000,
    accent: "default",
    creditAllowance: 500,
    bonusCredits: 0,
    features: [
      { text: "500 credits per month", included: true },
      { text: "Basic AI Feedback Analysis", included: true },
      { text: "Community Access", included: true },
      { text: "Code Editor & Whiteboard", included: false },
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "For active job seekers needing serious prep.",
    monthlyPrice: 2000,
    accent: "primary",
    badge: "Most Popular",
    creditAllowance: 750,
    bonusCredits: 50,
    features: [
      { text: "750 + 50 bonus credits per month", included: true },
      { text: "Video & Voice Analysis", included: true },
      { text: "AI Behavioral Modes", included: true },
      { text: "Access to Code Editor & Whiteboard", included: true },
      { text: "Priority Support in 3-5 business days", included: true },
    ],
  },
  elite: {
    id: "elite",
    name: "Elite",
    tagline: "Everything in Pro, plus advanced tools for serious candidates.",
    monthlyPrice: 5000,
    accent: "purple",
    badge: "Best Value",
    creditAllowance: 1000,
    bonusCredits: 100,
    features: [
      { text: "1000 + 100 bonus credits per month", included: true },
      { text: "Everything in Pro", included: true },
      { text: "Custom Company Presets & Goals", included: true },
      { text: "Priority Support within 1 day", included: true },
    ],
  },
};

/** Plans shown in profile setup (Trial, Lite, Pro, Elite) */
export const PROFILE_SETUP_PLANS = [
  PLAN_DEFINITIONS.trial,
  PLAN_DEFINITIONS.lite,
  PLAN_DEFINITIONS.pro,
  PLAN_DEFINITIONS.elite,
];

/** Paid plans only (Lite, Pro, Elite) - for upgrade modal */
export const PAID_PLANS = [
  PLAN_DEFINITIONS.lite,
  PLAN_DEFINITIONS.pro,
  PLAN_DEFINITIONS.elite,
];

/** All plans for pricing page */
export const PRICING_PLANS = [
  PLAN_DEFINITIONS.trial,
  PLAN_DEFINITIONS.lite,
  PLAN_DEFINITIONS.pro,
  PLAN_DEFINITIONS.elite,
];

/** Plan slugs that require no payment (Trial only). Backend uses "free" for legacy. */
export const FREE_PLAN_SLUGS = ["trial", "free"];
