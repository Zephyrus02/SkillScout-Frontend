import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Search,
  Trash2,
  Plus,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import { isAdminUser, useAuth } from "@/contexts/AuthContext";
import {
  tableRows,
  PLAN_STYLES,
  type Plan,
  type Status,
  type UserTableRow,
} from "@/components/admin/users/data";
import UserDetailPanel from "@/components/admin/users/UserDetailPanel";

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | Plan>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const filteredRows = useMemo(() => {
    return tableRows.filter((row) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.plan.toLowerCase().includes(q);
      const matchesPlan = planFilter === "all" || row.plan === planFilter;
      const matchesStatus =
        statusFilter === "all" || row.status === statusFilter;
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [search, planFilter, statusFilter]);

  const selectedUser =
    tableRows.find((row) => row.email === selectedUserEmail) ?? null;

  useEffect(() => {
    if (!loading && user && !isAdminUser(user)) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || (user && !isAdminUser(user))) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Head>
        <meta name="robots" content="noindex, nofollow" />

        <title>Admin User Management – SkillScout</title>
      </Head>

      <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-background-dark dark:text-text-dark">
        <AdminSidebar activeTab="users" userName={user?.name} />

        <main
          className={`relative ml-0 h-screen overflow-y-auto p-6 lg:ml-64 lg:p-10 ${selectedUser ? "xl:mr-[400px]" : ""}`}
        >
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="mb-1 text-3xl font-bold text-slate-900 dark:text-white">
                User Management
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage student and professional accounts.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Download size={16} />
                Export User Data
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600"
              >
                <Plus size={16} />
                Add User
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-surface-dark md:flex-row">
            <div className="relative w-full md:w-96">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or plan..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div className="flex w-full gap-3 overflow-x-auto pb-2 md:w-auto md:pb-0">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value as "all" | Plan)}
                className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-8 text-sm font-medium text-slate-700 transition-colors hover:border-primary focus:border-primary focus:ring-0 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300"
              >
                <option value="all">All Plans</option>
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | Status)
                }
                className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-8 text-sm font-medium text-slate-700 transition-colors hover:border-primary focus:border-primary focus:ring-0 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
              <button
                type="button"
                className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <Filter size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-surface-dark">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      User
                    </th>
                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Plan
                    </th>
                    <th className="p-5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Total Interviews
                    </th>
                    <th className="p-5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Avg. Score
                    </th>
                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="p-5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-10 text-center text-sm text-slate-400"
                      >
                        No users match your filters.
                      </td>
                    </tr>
                  ) : null}
                  {filteredRows.map((row) => (
                    <tr
                      key={row.email}
                      className="group cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      onClick={() => setSelectedUserEmail(row.email)}
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-sm font-bold ${row.avatarClass}`}
                          >
                            {row.avatarImage ? (
                              <Image
                                src={row.avatarImage}
                                alt={row.name}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              row.avatar
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {row.name}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {row.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${PLAN_STYLES[row.plan]}`}
                        >
                          {row.plan}
                        </span>
                      </td>

                      <td className="p-5 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        {row.interviews}
                      </td>

                      <td className="p-5 text-center">
                        <div className="inline-flex items-center gap-1">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {row.score}
                          </span>
                          {row.score !== "-" ? (
                            <span
                              className={`text-xs font-medium ${row.scoreClass}`}
                            >
                              /10
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${row.statusDot}`}
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {row.status}
                          </span>
                        </div>
                      </td>

                      <td className="p-5 text-right">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedUserEmail(row.email);
                          }}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:text-primary"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => event.stopPropagation()}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Showing {filteredRows.length} of {tableRows.length} users
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:opacity-50 dark:border-slate-700"
                >
                  <ChevronLeft size={14} />
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    3
                  </button>
                  <span className="text-xs text-slate-400">...</span>
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </main>

        <UserDetailPanel
          user={selectedUser}
          onClose={() => setSelectedUserEmail(null)}
        />
      </div>
    </ProtectedRoute>
  );
}
