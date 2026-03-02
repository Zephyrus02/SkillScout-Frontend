import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  CirclePlus,
  Download,
  Eye,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";

const ongoingSessions = [
  {
    candidate: "Sarah Jenkins",
    role: "Frontend React Engineer",
    type: "Technical",
    ai: "CodeMaster v4",
    elapsed: "22:15 elapsed",
    estimate: "Est. 45m",
    progress: "45%",
    borderClass: "border-green-500",
    liveClass: "bg-green-100 text-green-700",
    progressClass: "bg-green-500",
  },
  {
    candidate: "Michael Chang",
    role: "Product Manager L5",
    type: "Behavioral",
    ai: "PM Leader Persona",
    elapsed: "42:30 elapsed",
    estimate: "Est. 60m",
    progress: "78%",
    borderClass: "border-blue-500",
    liveClass: "bg-blue-100 text-blue-700",
    progressClass: "bg-blue-500",
  },
  {
    candidate: "Jessica Wong",
    role: "System Design",
    type: "Architecture",
    ai: "SysDesign Architect",
    elapsed: "08:12 elapsed",
    estimate: "Est. 90m",
    progress: "15%",
    borderClass: "border-purple-500",
    liveClass: "bg-purple-100 text-purple-700",
    progressClass: "bg-purple-500",
  },
] as const;

const historyRows = [
  {
    date: "Feb 24, 2024",
    time: "10:00 AM",
    initials: "JD",
    initialsClass: "bg-indigo-100 text-indigo-600",
    name: "John Doe",
    email: "john.doe@example.com",
    type: "Technical",
    typeClass:
      "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    ai: "CodeMaster v4",
    score: "85",
    scoreClass: "border-green-500 text-green-600 bg-green-50",
    verdict: "Strong Hire",
    status: "Completed",
    statusClass: "bg-green-100 text-green-700 border-green-200",
    dotClass: "bg-green-600",
    action: "View",
  },
  {
    date: "Feb 23, 2024",
    time: "02:30 PM",
    initials: "AS",
    initialsClass: "bg-pink-100 text-pink-600",
    name: "Alice Smith",
    email: "alice.s@tech.co",
    type: "Behavioral",
    typeClass:
      "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    ai: "PM Leader Persona",
    score: "62",
    scoreClass: "border-yellow-500 text-yellow-600 bg-yellow-50",
    verdict: "Mixed Signals",
    status: "Completed",
    statusClass: "bg-gray-100 text-gray-700 border-gray-200",
    dotClass: "bg-gray-500",
    action: "View",
  },
  {
    date: "Feb 23, 2024",
    time: "11:15 AM",
    initials: "MK",
    initialsClass: "bg-orange-100 text-orange-600",
    name: "Marcus King",
    email: "m.king@dev.io",
    type: "Technical",
    typeClass:
      "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    ai: "CodeMaster v4",
    score: "--",
    scoreClass: "border-gray-200 text-gray-400 bg-gray-50",
    verdict: "N/A",
    status: "Interrupted",
    statusClass: "bg-red-100 text-red-700 border-red-200",
    dotClass: "bg-red-600",
    action: "Log",
  },
  {
    date: "Feb 22, 2024",
    time: "04:00 PM",
    initials: "LP",
    initialsClass: "bg-teal-100 text-teal-600",
    name: "Liam Patel",
    email: "liam.p@network.net",
    type: "System Design",
    typeClass:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    ai: "SysDesign Architect",
    score: "45",
    scoreClass: "border-red-500 text-red-600 bg-red-50",
    verdict: "Needs Work",
    status: "Failed",
    statusClass: "bg-orange-100 text-orange-700 border-orange-200",
    dotClass: "bg-orange-600",
    action: "View",
  },
  {
    date: "Feb 22, 2024",
    time: "09:00 AM",
    initials: "ER",
    initialsClass: "bg-cyan-100 text-cyan-600",
    name: "Elena Rodriguez",
    email: "elena.rod@mail.com",
    type: "Technical",
    typeClass:
      "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    ai: "CodeMaster v4",
    score: "92",
    scoreClass: "border-green-500 text-green-600 bg-green-50",
    verdict: "Expert",
    status: "Completed",
    statusClass: "bg-green-100 text-green-700 border-green-200",
    dotClass: "bg-green-600",
    action: "View",
  },
] as const;

export default function AdminInterviewsPage() {
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
        <title>Admin Interview Sessions – SkillScout</title>
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-background-dark dark:text-text-dark">
        <AdminSidebar activeTab="interviews" userName={user?.name} />

        <main className="max-w-[1600px] p-6 lg:ml-64 lg:p-10">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
                Interview Sessions
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Monitor live sessions and review past interview transcripts.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Download size={16} />
                Export Log
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600"
              >
                <CirclePlus size={16} />
                New Session
              </button>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Ongoing Sessions
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ongoingSessions.map((session) => (
                <div
                  key={session.candidate}
                  className={`group relative overflow-hidden rounded-2xl border-l-4 ${session.borderClass} bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {session.candidate}
                      </h3>
                      <p className="text-xs text-slate-500">{session.role}</p>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase ${session.liveClass}`}
                    >
                      <span
                        className="h-2 w-2 rounded-full bg-red-500 animate-pulse"
                        style={{ animationDuration: "2.5s" }}
                      />
                      Live
                    </span>
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {session.type}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      AI: {session.ai}
                    </span>
                  </div>

                  <div className="mb-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className={`h-1.5 rounded-full ${session.progressClass}`}
                      style={{ width: session.progress }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{session.elapsed}</span>
                    <span>{session.estimate}</span>
                  </div>

                  <div className="absolute right-0 top-0 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      className="rounded-lg bg-white p-1.5 text-gray-500 shadow-sm hover:text-primary dark:bg-gray-700"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex min-h-[500px] flex-col rounded-2xl bg-white shadow-sm dark:bg-surface-dark">
            <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-6 dark:border-gray-800 sm:flex-row sm:items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Session History
              </h2>
              <div className="flex w-full gap-2 sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search candidate or session ID..."
                    className="w-full rounded-xl bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 outline-none ring-0 focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  className="rounded-xl bg-gray-50 p-2 text-gray-500 transition hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <Filter size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 border-b border-gray-100 bg-gray-50/50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-800/30">
              <div className="col-span-2">Date & Time</div>
              <div className="col-span-3">Candidate</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">AI Score</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {historyRows.map((row) => (
                <div
                  key={`${row.name}-${row.date}-${row.time}`}
                  className="group grid grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {row.date}
                    </p>
                    <p className="text-xs text-slate-500">{row.time}</p>
                  </div>

                  <div className="col-span-3 flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${row.initialsClass}`}
                    >
                      {row.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {row.name}
                      </p>
                      <p className="text-xs text-slate-500">{row.email}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${row.typeClass}`}
                    >
                      {row.type}
                    </span>
                    <p className="mt-1 text-[10px] text-gray-400">{row.ai}</p>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${row.scoreClass}`}
                      >
                        {row.score}
                      </div>
                      <span className="text-xs text-gray-500">
                        {row.verdict}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${row.statusClass}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${row.dotClass}`}
                      />
                      {row.status}
                    </span>
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      className="text-sm font-medium text-primary opacity-0 transition-opacity hover:underline group-hover:opacity-100"
                    >
                      {row.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 p-4 dark:border-gray-800">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  1-5
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  124
                </span>{" "}
                sessions
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
