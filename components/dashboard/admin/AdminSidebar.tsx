import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  MessageSquare,
  Users,
  Video,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type ActiveTab =
  | "dashboard"
  | "revenue"
  | "users"
  | "interviews"
  | "analytics"
  | "queries";

interface AdminSidebarProps {
  activeTab: ActiveTab;
  userName?: string;
}

type AdminNavItem = {
  key: ActiveTab;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
};

const navItems: readonly AdminNavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    key: "revenue",
    label: "Revenue & Billing",
    icon: CreditCard,
    href: "/admin/revenue",
  },
  { key: "users", label: "Users", icon: Users, href: "/admin/users" },
  {
    key: "interviews",
    label: "Interviews",
    icon: Video,
    href: "/admin/interviews",
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },
  {
    key: "queries",
    label: "Queries",
    icon: MessageSquare,
    badge: "3",
    href: "/admin/queries",
  },
];

export default function AdminSidebar({
  activeTab,
  userName,
}: AdminSidebarProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white p-6 lg:flex dark:border-slate-800 dark:bg-surface-dark">
      <div>
        <div className="mb-10 flex items-center gap-2">
          <Image
            src="/brandimg.png"
            alt="SkillScout logo"
            width={150}
            height={32}
            className="object-contain"
          />
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-normal text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Admin
          </span>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold">
            {(userName || "Admin User").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {userName || "Admin User"}
            </p>
            {/* Todo: check if user is superadmin or no */}
            <p className="text-xs text-slate-500">Super Administrator</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activeTab;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-primary"
                    : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
