import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminStatsOverview from "@/components/dashboard/admin/StatsOverview";
import UserTable from "@/components/dashboard/admin/UserTable";
import InterviewsTable from "@/components/dashboard/admin/InterviewsTable";

export default function AdminDashboard() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans min-h-screen transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-text-light dark:text-text-dark">
              Admin Dashboard
            </h1>
            <p className="text-sm text-subtext-light dark:text-subtext-dark mt-1">
              Platform overview and user management.
            </p>
          </div>
          <span className="text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full">
            Admin
          </span>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <AdminStatsOverview />
        </div>

        {/* Users table */}
        <div className="mb-8">
          <UserTable />
        </div>

        {/* Interviews table */}
        <div>
          <InterviewsTable />
        </div>
      </main>

      <Footer />
    </div>
  );
}
