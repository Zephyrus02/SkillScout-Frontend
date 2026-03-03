new_content = '''import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Bell, Search } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import { isAdminUser, useAuth } from "@/contexts/AuthContext";
import KpiCards from "@/components/admin/revenue/KpiCards";
import RevenueChart from "@/components/admin/revenue/RevenueChart";
import SubscriptionChart from "@/components/admin/revenue/SubscriptionChart";
import TransactionsTable from "@/components/admin/revenue/TransactionsTable";
import UpcomingRenewals from "@/components/admin/revenue/UpcomingRenewals";

export default function AdminRevenuePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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
        <title>Revenue &amp; Billing \\u2013 SkillScout Admin</title>
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-background-dark dark:text-white">
        <AdminSidebar activeTab="revenue" userName={user?.name} />

        <main className="lg:ml-64">
          {/* \\u2500\\u2500 Sticky header \\u2500\\u2500 */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/80">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Revenue &amp; Billing
              </h2>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                LIVE DATA
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-64 rounded-xl border-0 bg-slate-100 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800"
                />
              </div>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                <Bell size={16} />
              </button>
            </div>
          </header>

          {/* \\u2500\\u2500 Body \\u2500\\u2500 */}
          <div className="space-y-6 p-8">
            <KpiCards />

            {/* Charts row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <RevenueChart />
              <SubscriptionChart />
            </div>

            {/* Transactions & Renewals row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <TransactionsTable />
              <UpcomingRenewals />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
'''

open('pages/admin/revenue.tsx', 'w').write(new_content)
print("Done!", len(new_content.splitlines()), "lines")
