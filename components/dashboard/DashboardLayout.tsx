import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    exact: true,
    extraPaths: [] as string[],
  },
  {
    label: "Goals & Milestones",
    href: "/dashboard/goals",
    icon: "flag",
    exact: false,
    extraPaths: [] as string[],
  },
  {
    label: "My Interviews",
    href: "/dashboard/history",
    icon: "videocam",
    exact: false,
    extraPaths: ["/dashboard/analysis"],
  },
  {
    label: "Practice",
    href: "/dashboard/practice",
    icon: "fitness_center",
    exact: false,
  },
  {
    label: "Analytics",
    href: "/dashboard/weak-areas",
    icon: "analytics",
    exact: false,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
    exact: false,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (
    href: string,
    exact: boolean,
    extraPaths: string[] = [],
  ) => {
    if (extraPaths.includes(router.pathname)) return true;
    if (exact) return router.pathname === href;
    return router.pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col
          bg-surface-light dark:bg-surface-dark
          border-r border-gray-100 dark:border-gray-800
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:flex lg:shrink-0
        `}
      >
        <div className="px-6 pt-6 pb-4">
          {/* Logo */}
          <Link href="/" className="flex items-center mb-10">
            <Image
              src="/brandimg.png"
              alt="SkillScout"
              width={160}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          {/* User profile */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0 ring-2 ring-white dark:ring-gray-700">
              AC
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                Alex Chen
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Software Engineer
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href, item.exact, item.extraPaths);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${
                      active
                        ? "bg-blue-50 dark:bg-blue-900/20 text-primary"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <span
                    className={`material-icons text-[20px] ${active ? "text-primary" : ""}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Start Mock Interview CTA */}
        <div className="px-6 pb-6 pt-2">
          <Link
            href="/dashboard/practice"
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 px-4 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-sm"
          >
            <span className="material-icons text-[20px]">play_circle</span>
            Start Mock Interview
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <span className="material-icons text-xl text-gray-600 dark:text-gray-300">
          menu
        </span>
      </button>

      {/* ── Page content ── */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-10 py-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
