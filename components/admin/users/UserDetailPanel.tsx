import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Lock, Mail, X } from "lucide-react";
import type { UserTableRow } from "./data";
import { PLAN_STYLES } from "./data";

interface UserDetailPanelProps {
  user: UserTableRow | null;
  onClose: () => void;
}

export default function UserDetailPanel({
  user,
  onClose,
}: UserDetailPanelProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {user ? (
        <motion.aside
          key="user-profile-sidebar"
          initial={
            prefersReducedMotion ? { opacity: 1 } : { x: 420, opacity: 0 }
          }
          animate={prefersReducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 1 } : { x: 420, opacity: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.25, ease: "easeOut" }
          }
          className="fixed right-0 top-0 z-50 hidden h-screen w-[400px] overflow-y-auto border-l border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-surface-dark xl:block"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-surface-dark">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              User Profile
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-4 h-24 w-24 rounded-full bg-purple-100 p-1 ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-surface-dark">
                {user.avatarImage ? (
                  <Image
                    alt={user.name}
                    width={96}
                    height={96}
                    className="h-full w-full rounded-full object-cover"
                    src={user.avatarImage}
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center rounded-full text-xl font-bold ${user.avatarClass}`}
                  >
                    {user.avatar}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {user.name}
              </h3>
              <p className="mb-2 text-sm text-slate-500">{user.email}</p>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${PLAN_STYLES[user.plan]}`}
              >
                {user.plan}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quick Stats
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                    <span className="block text-2xl font-bold text-slate-900 dark:text-white">
                      {user.interviews}
                    </span>
                    <span className="text-xs text-slate-500">Interviews</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                    <span
                      className={`block text-2xl font-bold ${user.scoreClass}`}
                    >
                      {user.score}
                    </span>
                    <span className="text-xs text-slate-500">Avg Rating</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recent Activity
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      text: "Conducted Mock: System Design",
                      sub: "2 hours ago • Rated 8/10",
                      dot: "bg-primary",
                    },
                    {
                      text: "Updated Profile Bio",
                      sub: "Yesterday at 4:30 PM",
                      dot: "bg-primary",
                    },
                    {
                      text: "Account Created",
                      sub: "Jan 12, 2024",
                      dot: "bg-slate-300",
                    },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3">
                      <div
                        className={`mt-2 h-2 w-2 shrink-0 rounded-full ${item.dot}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.text}
                        </p>
                        <p className="text-xs text-slate-500">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Admin Actions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Lock size={14} />
                    Reset Pwd
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:border-slate-700 dark:bg-surface-dark dark:hover:bg-red-900/20"
                  >
                    <X size={14} />
                    Suspend
                  </button>
                  <button
                    type="button"
                    className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-600"
                  >
                    <Mail size={14} />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
