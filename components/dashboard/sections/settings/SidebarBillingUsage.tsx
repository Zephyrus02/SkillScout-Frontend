import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { paymentsAPI, type Plan } from "@/lib/api";
import { interviewSessionsApi, type CreditsBalance } from "@/lib/api/interviews";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { PAID_PLANS, type PlanDefinition } from "@/lib/plans";
import { cardCls } from "./constants";

function formatAmount(cents: number, currency: string): string {
  const value = (cents / 100).toFixed(2);
  if (currency === "INR") return `₹${Number(value).toLocaleString("en-IN")}`;
  return `${currency} ${value}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function UpgradePlanCard({
  planDef,
  disabled,
  loading,
  isCurrent,
  showAnnual,
  annualPriceCents,
  onUpgrade,
}: {
  planDef: PlanDefinition;
  disabled: boolean;
  loading: boolean;
  isCurrent: boolean;
  showAnnual: boolean;
  annualPriceCents: number;
  onUpgrade: () => void;
}) {
  const isPrimary = planDef.accent === "primary";
  const isPurple = planDef.accent === "purple";

  // Annual: show per-month equivalent billed annually
  const monthlyEquivFromAnnual = annualPriceCents / 100 / 12;
  const displayPrice = showAnnual
    ? monthlyEquivFromAnnual
    : planDef.monthlyPrice;

  return (
    <div
      onClick={disabled ? undefined : onUpgrade}
      className={`relative flex flex-col h-full rounded-2xl p-8 transition-all duration-300 overflow-hidden cursor-pointer min-w-0
        ${
          disabled && !isCurrent
            ? "opacity-60 cursor-not-allowed"
            : "hover:-translate-y-1"
        }
        ${
          isCurrent
            ? "border-2 border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/50"
            : isPrimary
              ? "border-2 border-primary shadow-2xl shadow-primary/20 hover:shadow-primary/30 bg-white dark:bg-surface-dark"
              : "border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl bg-white dark:bg-surface-dark"
        }
      `}
    >
      {isPurple && planDef.badge && (
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="mb-6 relative">
        {isPurple && planDef.badge && (
          <div className="absolute top-0 right-0">
            <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] font-bold px-2 py-1 rounded border border-violet-200 dark:border-violet-700 uppercase tracking-wide">
              {planDef.badge}
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
          {planDef.name}
        </h3>
        <p className="text-subtext-light dark:text-subtext-dark text-sm min-h-[2.5rem] leading-relaxed">
          {planDef.tagline}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-text-light dark:text-text-dark">
            ₹
            {displayPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
          <span className="text-subtext-light dark:text-subtext-dark font-medium">
            /mo{showAnnual ? " (billed annually)" : ""}
          </span>
        </div>
        {showAnnual && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
            ₹{(annualPriceCents / 100).toLocaleString("en-IN")} / year
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onUpgrade();
        }}
        disabled={disabled}
        className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-center transition-all mb-8 ${
          isCurrent
            ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-default"
            : isPrimary
              ? "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/30 disabled:opacity-50"
              : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 disabled:opacity-50"
        }`}
      >
        {loading ? "Processing…" : isCurrent ? "Renew" : "Upgrade"}
      </button>

      <div className="space-y-4 flex-grow relative z-10">
        {planDef.features.map((feature) => (
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

export default function SidebarBillingUsage() {
  const [subscription, setSubscription] = useState<{
    plan: Plan;
    status: string;
    billingInterval: string;
    currentPeriodStart?: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    scheduledUpgrade: {
      id: string;
      plan: { id: string; name: string; slug: string };
      billingInterval: string;
      currentPeriodStart: string;
    } | null;
  } | null>(null);
  const [invoices, setInvoices] = useState<
    {
      id: string;
      invoiceNumber: string;
      planName: string;
      amountCents: number;
      currency: string;
      paidAt: string;
    }[]
  >([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoicesExpanded, setInvoicesExpanded] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradePlanId, setUpgradePlanId] = useState<string | null>(null);
  const [upgradePending, setUpgradePending] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);
  const [cancelPending, setCancelPending] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [credits, setCredits] = useState<CreditsBalance | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [subResult, invResult, plansResult, creditsResult] =
      await Promise.allSettled([
        paymentsAPI.getSubscription(),
        paymentsAPI.listInvoices(20, 0),
        paymentsAPI.getPlans(),
        interviewSessionsApi.getCredits(),
      ]);

    if (
      subResult.status === "fulfilled" &&
      subResult.value.success &&
      subResult.value.data
    ) {
      const d = subResult.value.data;
      setSubscription({
        plan: d.plan,
        status: d.status,
        billingInterval: d.billingInterval,
        currentPeriodStart: d.currentPeriodStart,
        currentPeriodEnd: d.currentPeriodEnd,
        cancelAtPeriodEnd: d.cancelAtPeriodEnd,
        scheduledUpgrade: d.scheduledUpgrade ?? null,
      });
    } else {
      setSubscription(null);
    }

    if (
      invResult.status === "fulfilled" &&
      invResult.value.success &&
      invResult.value.data
    ) {
      setInvoices(invResult.value.data);
    } else {
      setInvoices([]);
    }

    if (
      plansResult.status === "fulfilled" &&
      plansResult.value.success &&
      plansResult.value.data
    ) {
      setPlans(
        plansResult.value.data.filter(
          (p) =>
            p.slug === "lite" ||
            p.slug === "basic" ||
            p.slug === "pro" ||
            p.slug === "elite",
        ),
      );
    } else {
      setPlans([]);
    }

    if (
      creditsResult.status === "fulfilled" &&
      creditsResult.value?.success &&
      creditsResult.value.data
    ) {
      setCredits(creditsResult.value.data);
    } else {
      setCredits(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const planSlug = subscription?.plan?.slug ?? "trial";
  const isPaid =
    planSlug === "lite" || planSlug === "pro" || planSlug === "elite";
  const slugToPlanId = Object.fromEntries(plans.map((p) => [p.slug, p.id]));

  const handleUpgrade = async (slug: string) => {
    const planId = slugToPlanId[slug];
    if (!planId) return;
    setUpgradePlanId(planId);
    setUpgradeError(null);
    setUpgradePending(true);
    try {
      const orderRes = await paymentsAPI.createOrder(
        planId,
        "monthly",
        "one_time",
      );
      if (!orderRes.success || !orderRes.data) {
        throw new Error("Failed to create order");
      }
      const data = orderRes.data;
      if (data.subscriptionType !== "one_time" || !("orderId" in data)) {
        throw new Error("Invalid order response");
      }
      const response = await openRazorpayCheckout({
        key: data.keyId,
        order_id: data.orderId,
        name: "SkillScout",
        description: `Plan payment - ${data.amountDisplay}`,
      });
      const verifyRes = await paymentsAPI.verifyPayment({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });

      // Use the subscription returned by verifyPayment to update state immediately
      const updatedSub = verifyRes.data?.subscription;
      if (updatedSub) {
        setSubscription({
          plan: updatedSub.plan,
          status: updatedSub.status,
          billingInterval: updatedSub.billingInterval,
          currentPeriodStart: updatedSub.currentPeriodStart,
          currentPeriodEnd: updatedSub.currentPeriodEnd,
          cancelAtPeriodEnd: updatedSub.cancelAtPeriodEnd,
          scheduledUpgrade: updatedSub.scheduledUpgrade ?? null,
        });
        const upgradedPlanName =
          updatedSub.scheduledUpgrade?.plan?.name ?? updatedSub.plan?.name;
        const startDate = updatedSub.scheduledUpgrade
          ? formatDate(updatedSub.scheduledUpgrade.currentPeriodStart)
          : formatDate(updatedSub.currentPeriodStart);
        setUpgradeSuccess(
          updatedSub.scheduledUpgrade
            ? `Plan upgraded to ${upgradedPlanName}. New plan starts on ${startDate}.`
            : `Plan upgraded to ${upgradedPlanName}. Access is now active.`,
        );
      }

      setUpgradeModalOpen(false);
      // Reload invoices to reflect the new invoice
      const invRes = await paymentsAPI.listInvoices(20, 0);
      if (invRes.success && invRes.data) setInvoices(invRes.data);
    } catch (e) {
      setUpgradeError(
        e instanceof Error ? e.message : "Payment failed. Please try again.",
      );
    } finally {
      setUpgradePending(false);
      setUpgradePlanId(null);
    }
  };

  const handleCancelSubscription = async (
    atCycleEnd: boolean,
  ): Promise<boolean> => {
    setCancelPending(true);
    setCancelError(null);
    try {
      await paymentsAPI.cancelSubscription(atCycleEnd);
      await loadData();
      return true;
    } catch (e) {
      setCancelError(
        e instanceof Error ? e.message : "Failed to cancel. Please try again.",
      );
      return false;
    } finally {
      setCancelPending(false);
    }
  };

  const handleConfirmCancel = async () => {
    const succeeded = await handleCancelSubscription(true);
    if (succeeded) setCancelModalOpen(false);
  };

  const handleViewInvoice = async (id: string) => {
    try {
      await paymentsAPI.openInvoiceInNewTab(id);
    } catch {
      // Could add toast
    }
  };

  const handleDownloadInvoice = async (id: string, invoiceNumber: string) => {
    try {
      await paymentsAPI.downloadInvoicePdf(id, invoiceNumber);
    } catch {
      // Could add toast
    }
  };

  if (loading) {
    return (
      <div className={cardCls}>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-icons text-gray-900 dark:text-white">
            receipt_long
          </span>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Billing & Usage
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <div className={cardCls}>
        {/* Success banner for plan upgrade */}
        {upgradeSuccess && (
          <div className="mb-4 flex items-start gap-2 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2.5 border border-green-200 dark:border-green-800">
            <span className="material-icons text-base shrink-0 mt-0.5">
              check_circle
            </span>
            <span className="flex-1">{upgradeSuccess}</span>
            <button
              onClick={() => setUpgradeSuccess(null)}
              className="shrink-0 text-green-500 hover:text-green-700 dark:hover:text-green-200"
            >
              <span className="material-icons text-base">close</span>
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 mb-4">
          <span className="material-icons text-gray-900 dark:text-white">
            receipt_long
          </span>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Billing & Usage
          </h3>
        </div>

        <div className="space-y-4">
          {/* Current Plan */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Current Plan
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {subscription?.plan?.name ?? "Lite"}
            </p>
            {subscription && (
              <>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {subscription.billingInterval === "MONTHLY"
                    ? "Monthly"
                    : "Annual"}
                  {subscription.cancelAtPeriodEnd
                    ? ` · Cancelling on ${formatDate(subscription.currentPeriodEnd)}`
                    : subscription.status === "ACTIVE"
                      ? ` · Renews ${formatDate(subscription.currentPeriodEnd)}`
                      : ` · Expires ${formatDate(subscription.currentPeriodEnd)}`}
                </p>
                {subscription.cancelAtPeriodEnd && (
                  <span className="inline-block mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    Cancelling at period end
                  </span>
                )}
                {subscription.scheduledUpgrade && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-2.5 py-1.5">
                    <span className="material-icons text-sm">schedule</span>
                    <span>
                      Upgrading to{" "}
                      <strong>{subscription.scheduledUpgrade.plan.name}</strong>{" "}
                      on{" "}
                      {formatDate(
                        subscription.scheduledUpgrade.currentPeriodStart,
                      )}
                    </span>
                  </div>
                )}
                {/* Credits usage bar */}
                {credits && (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Credits used</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {credits.creditsUsed} / {credits.totalAllowance}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          credits.creditsUsed >= credits.totalAllowance
                            ? "bg-red-500"
                            : credits.creditsUsed >= credits.totalAllowance * 0.8
                              ? "bg-amber-500"
                              : "bg-primary"
                        }`}
                        style={{
                          width: `${Math.min(100, credits.totalAllowance > 0 ? (credits.creditsUsed / credits.totalAllowance) * 100 : 0)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {credits.creditsRemaining === 0
                        ? "No credits remaining — upgrade to continue"
                        : `${credits.creditsRemaining} credits remaining`}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Upgrade */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="w-full text-left text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition flex justify-between items-center py-2"
            >
              <span>Upgrade Plan</span>
              <span className="material-icons text-base">arrow_forward</span>
            </button>
          </div>

          {/* Invoices */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setInvoicesExpanded(!invoicesExpanded)}
              className="w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition flex justify-between items-center py-2"
            >
              <span>Invoices</span>
              <span
                className={`material-icons text-base transition-transform ${
                  invoicesExpanded ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
            {invoicesExpanded && (
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {invoices.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No invoices yet
                  </p>
                ) : (
                  invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex justify-between items-center text-xs py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {inv.invoiceNumber}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {formatDate(inv.paidAt)} ·{" "}
                          {formatAmount(inv.amountCents, inv.currency)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewInvoice(inv.id)}
                          className="text-blue-600 hover:underline text-xs font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            handleDownloadInvoice(inv.id, inv.invoiceNumber)
                          }
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          title="Download PDF"
                        >
                          <span className="material-icons text-sm">
                            download
                          </span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Cancel (paid only) */}
          {isPaid && subscription && !subscription.cancelAtPeriodEnd && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setCancelModalOpen(true)}
                disabled={cancelPending}
                className="w-full text-left text-sm font-medium text-red-500 hover:text-red-600 transition flex justify-between items-center py-2 disabled:opacity-50"
              >
                <span>{cancelPending ? "Cancelling…" : "Cancel subscription"}</span>
                <span className="material-icons text-base">cancel</span>
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Access until period end
              </p>
              {cancelError && (
                <p className="text-xs text-red-500 mt-1">{cancelError}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal — pricing-style plan cards */}
      {upgradeModalOpen && (
        <Modal
          title="Upgrade Plan"
          maxWidth="3xl"
          onClose={() => {
            if (!upgradePending) {
              setUpgradeModalOpen(false);
              setUpgradeError(null);
            }
          }}
        >
          <div className="space-y-6">
            {upgradeError && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                {upgradeError}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
              {PAID_PLANS.map((planDef) => {
                const apiPlan = plans.find(
                  (p) =>
                    p.slug === planDef.id ||
                    (planDef.id === "lite" && p.slug === "basic"),
                );
                if (!apiPlan) return null;
                const isCurrent =
                  subscription?.status === "ACTIVE" &&
                  (planSlug === planDef.id ||
                    (planDef.id === "lite" && planSlug === "basic"));
                const isLoading =
                  upgradePending && upgradePlanId === apiPlan.id;
                return (
                  <UpgradePlanCard
                    key={planDef.id}
                    planDef={planDef}
                    disabled={upgradePending || isCurrent}
                    loading={isLoading}
                    isCurrent={isCurrent}
                    showAnnual={false}
                    annualPriceCents={apiPlan.amountAnnual}
                    onUpgrade={() => handleUpgrade(apiPlan.slug)}
                  />
                );
              })}
            </div>
          </div>
        </Modal>
      )}

      {cancelModalOpen && (
        <Modal
          title="Cancel subscription"
          onClose={() => {
            if (!cancelPending) setCancelModalOpen(false);
          }}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You will keep access until the end of your current billing period.
              Are you sure you want to cancel?
            </p>
            {cancelError && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                {cancelError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                disabled={cancelPending}
              >
                Keep subscription
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelPending}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50"
              >
                {cancelPending ? "Cancelling…" : "Confirm cancel"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
