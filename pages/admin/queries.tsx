import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  BarChart3,
  Check,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";

type SupportTicket = {
  id: string;
  title: string;
  preview: string;
  user: string;
  time: string;
  priority: string;
  priorityClass: string;
  active?: boolean;
};

const tickets: readonly SupportTicket[] = [
  {
    id: "#TR-8922",
    title: "Interview session stuck on loading",
    preview:
      "The AI interviewer stopped responding after the second question in the System Design mock.",
    user: "Sarah J.",
    time: "12m ago",
    priority: "High",
    priorityClass: "bg-red-100 text-red-600",
    active: true,
  },
  {
    id: "#TR-8921",
    title: "Billing cycle clarification",
    preview: "I was charged twice for the monthly Pro subscription.",
    user: "Mike R.",
    time: "45m ago",
    priority: "Medium",
    priorityClass: "bg-orange-100 text-orange-600",
  },
  {
    id: "#TR-8920",
    title: "Feature request: Python 3.11",
    preview: "Can we get the latest Python version for coding challenges?",
    user: "Dev_99",
    time: "2h ago",
    priority: "Low",
    priorityClass: "bg-green-100 text-green-600",
  },
  {
    id: "#TR-8919",
    title: "Typo in Behavioral Question 4",
    preview:
      "Just a small thing, there is a typo in the word 'responsibility'.",
    user: "Anna K.",
    time: "3h ago",
    priority: "Low",
    priorityClass: "bg-green-100 text-green-600",
  },
];

export default function AdminQueriesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || (user && user.role !== "admin")) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Admin Support Queries – SkillScout</title>
      </Head>

      <div className="min-h-screen overflow-hidden bg-slate-100 text-slate-900 dark:bg-background-dark dark:text-text-dark">
        <AdminSidebar activeTab="queries" userName={user?.name} />

        <main className="h-screen overflow-y-auto p-6 lg:ml-64 lg:p-8">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Support Queries
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage incoming help requests and AI escalations.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs shadow-sm dark:border-slate-700 dark:bg-surface-dark">
                <p className="text-slate-500">Open Tickets</p>
                <p className="font-bold text-slate-900 dark:text-white">
                  12 Pending
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs shadow-sm dark:border-slate-700 dark:bg-surface-dark">
                <p className="text-slate-500">Avg. Response</p>
                <p className="font-bold text-slate-900 dark:text-white">
                  1h 45m
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-surface-dark">
              <div className="mb-3 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="w-full rounded-xl bg-slate-100 py-2 pl-9 pr-3 text-sm outline-none dark:bg-slate-800"
                  />
                </div>
                <button
                  type="button"
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800"
                >
                  <BarChart3 size={14} />
                </button>
              </div>

              <div className="space-y-2">
                {tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      ticket.active
                        ? "border-blue-100 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10"
                        : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {ticket.id}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ticket.priorityClass}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {ticket.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                      {ticket.preview}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {ticket.user} • {ticket.time}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-surface-dark">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Sarah Jenkins
                  </h2>
                  <p className="text-sm text-slate-500">
                    Premium User • #TR-8922
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700"
                  >
                    <Check size={12} />
                    Resolve
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Today, 10:23 AM
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-orange-200" />
                  <div className="max-w-[75%] rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <p>
                      Hi team, I was in the middle of a System Design mock
                      interview about 20 minutes ago. The AI interviewer asked
                      the second follow-up question, and then the loading
                      spinner just kept spinning indefinitely.
                    </p>
                    <div className="mt-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800">
                      screenshot_error.png
                    </div>
                  </div>
                </div>

                <div className="ml-auto max-w-[78%] rounded-2xl bg-blue-50 p-3 text-sm text-slate-700 dark:bg-blue-900/20 dark:text-slate-200">
                  <p className="mb-1 text-xs font-bold text-primary">
                    AI AGENT
                  </p>
                  Hi Sarah, I&apos;m sorry to hear that! I&apos;ve logged this
                  incident. Could you please try refreshing the session page?
                  Your progress should be saved automatically.
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-orange-200" />
                  <div className="max-w-[75%] rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    I tried refreshing, but it says &quot;Session Invalid&quot;.
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm dark:border-blue-900/30 dark:bg-blue-900/10">
                  <p className="mb-1 text-xs font-bold text-primary">
                    AI SUGGESTED REPLY
                  </p>
                  I&apos;ve restored your session manually from backend logs.
                  Please try accessing it again from your dashboard. The context
                  should be preserved.
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <textarea
                  className="h-16 w-full resize-none bg-transparent text-sm outline-none"
                  placeholder="Type your reply..."
                />
                <div className="mt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-500">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                    />
                    Private Note
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                    >
                      <Paperclip size={14} />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                    >
                      <Smile size={14} />
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                    >
                      Send Reply
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
